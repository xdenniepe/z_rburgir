import { useEffect, useReducer } from 'react'
import { getDifferenceInDays, getLocalStorageItem, setLocalStorageItem } from '../utilities/helpers'
import { BEARER, GET, POST, emailRegex, phoneNumberRegex } from '../utilities/constants'
import { request } from '../services/request'
import { getAuth, signOut } from 'firebase/auth'
import AuthContext from '../contexts/authContext'
import AuthReducer, { initialState, initializer, LOGIN, LOGOUT, SET_USER } from '../reducers/authReducer'
import api from '../services/api'

const AuthProvider = ({ children }) => {
	// TO DOs: 
	// Refactor verifyByLoginType function by implementing getAuthType in the function scope.
	// Implement one field on sign in page using email or phone number (same with forgot password).
	
	// NOTE:
	// One field for email or phone number is not advisable on sign up page (must be separate).

	const [state, dispatch] = useReducer(AuthReducer, initialState, initializer)

	const { token, user } = state

	const authUser = (values, loginType) => {
		const username = loginType === "email" ? values[loginType] : `+${values[loginType]}`
		const password = values.password

		return request({
				url   : api.LOGIN,
				method: POST,
				data  : {
					username : username,
					password : password,
					loginType: loginType
				}
			})
	}

	const generateOTP = data => {
		return request({
				url   : api.OTP_FORGOT_PASSWORD,
				method: POST,
				data  : data
			})	
	}

	const getAuthType = data => {
		if (data.match(emailRegex)) {
			return Promise.resolve('email')
		} else if (data.match(phoneNumberRegex)) {
			return Promise.resolve('phoneNumber')
		}
	
		return Promise.reject(new Error('Authentication type is null.'))
	}

	const getDataFromAuthType = (authType, emailOrPhoneNumber) => {
		if (authType) {
			// The data object property sent to the request.
			const data = {}

			// Assigns dynamic property.
			// e.g. if authType === 'email' then data { 'email': emailOrPhoneNumber }.
			// e.g. if authType === 'phoneNumber' then data { 'phoneNumber': emailOrPhoneNumber }.
			data[authType] = emailOrPhoneNumber
			return data
		} 
		
		return null
    }

	const getUser = async value => {
		try {
			let verifyFunction

			const authType = await getAuthType(value)

			if (authType === 'email') {
				verifyFunction = verifyUserByEmail
			} else if (authType === 'phoneNumber') {
				verifyFunction = verifyUserByPhoneNumber
			}

			const verifyRes  = await verifyFunction(value)

			return verifyRes.data 
		} catch (err) {
			throw new Error('Oops! Something went wrong!')
		}
	}

	const getUserByToken = token => {
        return request({
				url    : api.USERS_BY_TOKEN,
				method : GET,
				headers: {
					Authorization: BEARER + token
				}
			})
    }

	const getExternalUserData = (user, provider) => {
		const data = {
			firstName: user.displayName ? user.displayName.split(' ')[0] : null,
			lastName : user.displayName ? user.displayName.split(' ')[1] : null,
			email    : user.email,
			password : user.uid,
		}

		if (provider === 'apple') {
			data.appleId = user.uid
		} else if (provider === 'google') {
			data.googleId = user.uid
		}

		return data
	}

    const getUserData = data => {
        return { 
            email      		 : data.email, 
            emailStatus		 : data.emailStatus, 
            firstName  		 : data.firstName, 
			phoneNumber		 : data.phoneNumber,
			phoneNumberStatus: data.phoneNumberStatus,
            lastName         : data.lastName, 
            status     		 : data.status, 
            userId     		 : data.userId, 
			subscription     : data.subscription,
        } 
    }

	const getVerificationCode = userID => {
		return request({
				url   : api.USERS_FP_VERIFICATION_CODE,
				method: GET,
				params: {
					userId: userID
				}
			})
	}

    const hasDateExceeded = registerDate => {
		if (registerDate) {
			const date1      = new Date()
			const date2      = new Date(registerDate * 1000)
			const difference = getDifferenceInDays(date1, date2)

			return difference >= 70 && registerDate
		}
        
		return false
    }

	const loginUser = (navigate, payload) => {
        dispatch({ type: LOGIN, payload })
        setLocalStorageItem('firstload', true)
        navigate('/')
    }

	const logoutFirebase = () => {
		const auth            = getAuth()
		const { currentUser } = auth

		if (currentUser) {
			signOut(auth)
		}
	}

	const logoutUser = navigate => {
		if (user.status === 'EXT') {
			logoutFirebase()
		}

		dispatch({ type: LOGOUT })
        navigate('/loading')
	}

	const registerUser = ({ email, password, phoneNumber }) => {
		const config = {
			url   : api.REGISTER,
			method: POST,
			data  : {
				password: password
			}
		}

		if (email) {
			config.data.email = email
		} 
		
		if (phoneNumber) {
			config.data.phoneNumber = `+${phoneNumber}`
		} 

		if (!email && !phoneNumber) {
			return new Error('Oops! Something went wrong!')
		}

		return request(config)
	}

	const registerAppleAccount = user => {
		const data = getExternalUserData(user, 'apple')

		return request({
				url   : api.REGISTER_APPLE_ACCOUNT,
				method: POST,
				data  : data
			})
	} 

	const registerGoogleAccount = user => {
		const data = getExternalUserData(user, 'google')

		return request({
				url   : api.REGISTER_GOOGLE_ACCOUNT,
				method: POST,
				data  : data
			})
	} 

	const resetPassword = (code, password) => {
		return request({
				url   : api.USERS_NEW_PASSWORD,
				method: POST,
				data  : {
					code       : code,
					newPassword: password
				}
			})
	}

	const sendUserOTP = (data, timeZone) => {
		if (data.email) {
			data.baseUrl = window.location.origin
		}

		return request ({	
			url   : api.USERS_FORGOT_PASSWORD,
            method: POST,
            data  : {
				...data,
				timeZone: timeZone
			} 
		})
	}

	const setUser = (dispatch, payload) => {
		const type = SET_USER

		dispatch({  type, payload })
	}

	const verifyByLoginType = async (verificationType, values) => {
        let verifyFunc

        if (verificationType === 'email') {
            verifyFunc = verifyUserByEmail(values.email)
        } else {
            verifyFunc = verifyUserByPhoneNumber(values.phoneNumber)
        }

        const verifyRes  = await verifyFunc.catch(err => console.error(err))
        
        return await verifyRes.data 
    }

	const verifyAccount = code => {
		return request({
				url   : `${api.REGISTER_VERIFY}/${code}`,
				method: GET
			})
	}

	const unsubscribeEmailAccount = code => {
		return request({
			url   : `${api.UNSUBSCRIBE_EMAIL}/${code}`,
			method: POST,
			data  : {
				code : code
			}
		})
	}

	const verifyRegistration = ({ email, phoneNumber}, baseUrl) => {
		const config = {
			url   : api.REGISTER_VERIFY,
			method: POST,
			data  : {
				baseUrl: baseUrl,
			}
		}

		if (email) {
			config.data.email = email
		}  
		
		if (phoneNumber) {
			config.data.phoneNumber = `+${phoneNumber}`
		} 
		
		if (!email && !phoneNumber) {
			return new Error('Oops! Something went wrong!')
		}

		return request(config)
	}

	const verifyUserByEmail = email => {
		return request({
				url   : api.USERS_BY_EMAIL,
				method: GET,
				params  : {
					email: email
				}
			})
	}

	const verifyUserByPhoneNumber = phoneNumber => {
		return request({
				url   : api.USERS_BY_PHONE_NUMBER,
				method: GET,
				params  : {
					phoneNumber: phoneNumber
				}
			})
	}

	const verifyUserUpdate = ({ email, phoneNumber}, baseUrl) => {
		const config = {
			url   : api.USER_UPDATE_VERIFICATION,
			method: POST,
			data  : {
				baseUrl: baseUrl,
			}
		}

		if (email) {
			config.data.email = email
		}  
		
		if (phoneNumber) {
			config.data.phoneNumber = phoneNumber
		} 
		
		if (!email && !phoneNumber) {
			return new Error('Oops! Something went wrong!')
		}

		return request(config)
	}

	const providerValue = { 
		state, 
		authUser, 
		dispatch, 
		generateOTP, 
		getAuthType,
		getDataFromAuthType,
		getUser,
		getUserByToken, 
		getUserData, 
		getVerificationCode,
		hasDateExceeded, 
		loginUser, 
		logoutFirebase,
		logoutUser, 
		registerAppleAccount, 
		registerGoogleAccount, 
		registerUser, 
		resetPassword,
		sendUserOTP,
		setUser,
		verifyByLoginType,
		verifyAccount,
		unsubscribeEmailAccount,
		verifyRegistration, 
		verifyUserByEmail, 
		verifyUserByPhoneNumber,
		verifyUserUpdate
	}

	useEffect(() => {
		if (token) {
			setLocalStorageItem('token', token)
		} 

		if (!token && getLocalStorageItem('token')) {
			localStorage.clear()
		}
	}, [token])

	useEffect(() => {
		if (user) {
			setLocalStorageItem('user', user)
		} 
	}, [user])

	return (
		<AuthContext.Provider value={providerValue}>
			{ children }
		</AuthContext.Provider>
	)
}

export default AuthProvider
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthCtx } from '../../../hooks'
import { getAuth, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { evaluate, removeLocalStorageItem, setLocalStorageItem } from '../../../utilities/helpers'
import { Apple } from '../../../utilities/icons'


const AppleButton = ({ toast }) => {
    const { authUser, getUserByToken, getUserData, loginUser, logoutFirebase, registerAppleAccount, verifyUserByEmail } = useAuthCtx()
    const { pathname } = useLocation()
    
    const btnAction = pathname === '/signup' ? 'Sign up' : 'Login'
    
    const navigate = useNavigate()

    const handleAppleSignIn = () => {
        const appleAuth     = getAuth() 
        const appleProvider = new OAuthProvider('apple.com')

        appleProvider.addScope('email')
        appleProvider.addScope('name')

        signInWithPopup(appleAuth, appleProvider)
            .then(res => {
                console.log(appleAuth, res)
                if (res) {
                    const { user } = res

                    if (pathname === '/signup') {  
                        signUpUser(user)
                    } else if (pathname === '/signin') {
                        signInUser(user)
                    }
                }
            })
            .catch(err => console.error(err?.message || err))
    }

    const checkUserStatus = data => {
        evaluate(data)
            .compare(data => data === null, () => toast('Error', 'This email does not exist.'))
            .compare(data => data.status === 'EXT', () => toast('Error', 'Please try again.'))
            .compare(data => data.status === 'INA' || data.status === 'ACT', () => toast('Error', 'This email address is not linked to your apple account. Please use another login method.'))
    }

    const signInUser = async ({ email, uid }) => {
        try {
            const values    = { email: email, password: uid }
            const verifyRes = await verifyUserByEmail(email)
            const { data }  = await verifyRes
            const authRes   = await authUser(values, 'email')
            const token     = await authRes.data

            if (!data.appleId) {
                toast('Error', 'This email address is not linked to your apple account. Please use another login method.')
                throw new Error('This email is not linked to your apple account.')
            }

            if (token) {
                setLocalStorageItem('token', token)

                const tokenRes   = await getUserByToken(token)
                const user       = await getUserData(tokenRes.data)

                removeLocalStorageItem('token')
                loginUser(navigate, { token, user })
            } else {
                checkUserStatus(data)
                logoutFirebase()
            }
        } catch (err) {
            toast("Error", "Account doesn't exist, please sign up")
            logoutFirebase()
            navigate('/signup')
        }
    }

    const signUpUser = async user => {
        logoutFirebase()

        try {
            const verifyRes = await verifyUserByEmail(user.email)
            const { data }  = await verifyRes    

            if (data) {
                toast('Error', 'Email already exists.')
            }
        } catch (err) {
            registerAppleAccount(user).then(() => navigate('/success?message=accountverified'))
        }
    }

    return (
        <button
            aria-label = {`Continue with Apple ${btnAction}`}
            className  = "w-full flex flex-row h-[48px] sm:h-[48px] xs:h-[46px] xxs:h-[44px] 3xs:h-[42px]"
            onClick    = {() => handleAppleSignIn()}
            role       = "button"
            type       = "button"
        >
            <div className='h-full w-1/5 border border-[#cbc8c6] flex-none flex items-center justify-center bg-white'>
                <Apple className="h-[36px] xs:h-[33px] xs:w-[33px] xxs:h-[33px] xxs:w-[33px] 3xs:h-[33px] 3xs:w-[33px] w-full"/>
            </div>
            <div className="flex items-center justify-center bg-black text-white h-full w-full sm:text-xs xs:text-[12px] xxs:text-[11px] 3xs:text-[10px] tracking-[2px] font-futura"> CONTINUE WITH APPLE </div>
        </button>
    )
}

export default AppleButton

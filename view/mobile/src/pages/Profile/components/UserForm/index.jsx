import React from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useAuthCtx } from '../../../../hooks'
import { request } from '../../../../services/request'
import { Input, Password, PhoneNumber } from '../../../../components/Form'
import { Button } from '../../../../components/Common'
import { autoCapitalize } from '../../../../utilities/helpers'
import { updateUserSchema } from '../../../../validation/schema'
import { POST } from '../../../../utilities/constants'
import UserVerifyButton from '../UserVerifyButton'
import api from '../../../../services/api'

const UserForm = ({ handleHideCriteria, handleShowCriteria, showCriteria, toast }) => {
    const { dispatch, state, setUser, verifyUserByEmail, verifyUserByPhoneNumber, verifyUserUpdate } = useAuthCtx()
    const { user } = state

    const navigate = useNavigate()

    const fieldProps = [
        {
            inputlabel: 'Input Email'
        },
        {
            inputlabel: 'Input First Name'
        },
        {
            inputlabel: 'Input Last Name'
        },
        {
            passwordLabel: 'Input Current Password'
        },
        {
            passwordLabel: 'Input New Password'
        },
        {
            passwordLabel: 'Confirm Input Password'
        },
        {
            phoneNumberLabel: 'Enter Phone Number'
        }
    ]

    const labelProps = {
        buttonlabel  : 'Update User Info',
        eyeofficon   : 'Crossed Eye Icon - Hide Profile Password',
        eyeicon      : 'Eye Icon - Show Profile Password',
        passwordLabel: 'Textbox for password'
    }

    const isActiveUser = user?.status !== 'EXT'
    
    const isNullOrInactive = fieldStatus => fieldStatus === null || fieldStatus === 'INA'

    const canVerifyPhoneNumber = isNullOrInactive(user?.phoneNumberStatus) && isActiveUser 

    const canVerifyEmail       = isNullOrInactive(user?.emailStatus) && isActiveUser

    const getVerifyMessage = ({ emailStatus }) => {
        if (isNullOrInactive(emailStatus)) {
            return 'verifyemail'
        } 

        return 'verifyphonenumber'
    }

    const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => { 
        const phoneNumber = values.phoneNumber && values.phoneNumber.includes('+') ? values.phoneNumber : values.phoneNumber && `+${values.phoneNumber}`
        
        const userData = {
            email            : values.email || null,
            emailStatus      : values.emailStatus,
            phoneNumber      : isActiveUser && values.phoneNumber ? phoneNumber : null,
            phoneNumberStatus: values.phoneNumberStatus,
            firstName        : values.firstName ? autoCapitalize(values.firstName.trim()) : '',
            lastName         : values.lastName ? autoCapitalize(values.lastName.trim()) : '',
        }

        const valueToVerify = {}

        if (canVerifyPhoneNumber && values?.phoneNumber) {
            try {
                const verifyRes = await verifyUserByPhoneNumber(phoneNumber)
                const { data }  = await verifyRes

                if (data) {
                    toast('Error', 'This phone number already exists.')
                    return
                } 
            } catch (err) {
                userData.phoneNumberStatus = 'INA'
                valueToVerify.phoneNumber = phoneNumber
                console.error('phone error', err?.message || err)               
            }
        }

        if (canVerifyEmail && values?.email) {
            try {
                const verifyRes = await verifyUserByEmail(values.email)
                const { data }  = await verifyRes

                if (data) {
                    toast('Error', 'This email already exists.')
                    return
                } 
            } catch (err) {
                userData.email = values.email
                valueToVerify.email = values.email
                console.error(err?.message || err)
            }
        }

        if (values.currentPassword !== '') {
            if (values.password === '' && values.confirmPassword === '') {
                setFieldError('password', 'Please enter your new password')
                setFieldError('confirmPassword', 'Please confirm your password')
            } else {
                request({
                    url   : api.LOGIN,
                    method: POST,
                    data  : {
                        username : values.email || values.phoneNumber ,
                        password : values.currentPassword,
                        loginType: values.email ? 'email' : 'phone_number' 
                    }
                })
                .then(({ data }) => {
                    if (data) {
                        if (values.confirmPassword === '') {
                            setFieldError ('confirmPassword', 'Please confirm your password')
                        } else if (values.password === '') { 
                            setFieldError ('password', 'Please enter new password')
                        } else {
                            if (values.currentPassword === values.password) {
                                setFieldError('password', 'New password cannot be your old password') 
                                setFieldError('confirmPassword', 'New password cannot be your old password')   
                            } else {
                            userData.password = values.password
                            request({
                                url   : api.USER_UPDATE,
                                method: POST,
                                data  : userData
                            })
                            .then(response => {
                                updateUserState(response, dispatch)
                                
                                resetForm()
                    
                                handleHideCriteria()
                                
                                toast('Success', 'Profile updated Successfully!')

                                setSubmitting(false)

                                if ((canVerifyEmail && values?.email)|| (canVerifyPhoneNumber && values?.phoneNumber)) {
                                    sendUserVerification(user, valueToVerify, navigate)
                                }
                            })
                            .catch(error => {
                                console.log(error)
                            })
                        }}
                    } else {
                        setFieldError('currentPassword', 'Invalid Password')
                    }
        
                })
                .catch(error => {
                    console.log('error -> ', error)
                })    
            }
           
        } else if (values.password !== '' || values.confirmPassword !== '')  {
            setFieldError('currentPassword', 'Please enter your current password')    
        } else {
            if (values.firstName !== '' && values.lastName === '' ) {
                setFieldError('lastName', 'Please enter your last name')  
            } else if (values.firstName === '' && values.lastName !== '') {
                setFieldError('firstName', 'Please enter your first name')
            } else {
                request({
                    url   : api.USER_UPDATE,
                    method: POST,
                    data  : userData
                })
                .then(response => {
                    updateUserState(response, dispatch)
                    
                    resetForm()
        
                    handleHideCriteria()
                    
                    toast('Success', 'Profile updated Successfully!')

                    setSubmitting(false)

                    if ((canVerifyEmail && values?.email)|| (canVerifyPhoneNumber && values?.phoneNumber)) {
                        sendUserVerification(user, valueToVerify, navigate)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            }
        }
    }
    
    const sendUserVerification = (user, valueToVerify, navigate) => {
        console.log('val ', valueToVerify)

        const baseUrl = window.location.origin 
        const msg     = getVerifyMessage(user)

        verifyUserUpdate(valueToVerify, baseUrl)
        .then(() => {
            navigate(`/success?message=${msg}`, { state: { prevUrl : '/settings' }})
        })
        .catch(err => console.error(err?.message || err))
    }

    const updateUserState = ({ data }, dispatch) => {
        const userData = { 
            email            : data.email,
            emailStatus      : data.emailStatus,
            phoneNumber      : data.phoneNumber,
            phoneNumberStatus: data.phoneNumberStatus,
            firstName        : data.firstName || '',
            lastName         : data.lastName || '',
            status           : data.status,
            userId           : user?.userId,
        }

        setUser(dispatch, userData)
    }

    const initialValues = {
        email            : user.email || '',
        emailStatus      : user.emailStatus,
        firstName        : user.firstName || '',
        lastName         : user.lastName || '',
        phoneNumber      : user.phoneNumber,
        phoneNumberStatus: user.phoneNumberStatus,
        currentPassword  : '',
        password         : '',
        confirmPassword  : '',
    }

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit          : handleSubmit,
        validationSchema  : updateUserSchema
    })

    const { errors, values } = formik
    
    const areFieldsValid = (user, updatedValues) => {
        const { email, firstName, lastName, password, phoneNumber, confirmPassword, currentPassword } = updatedValues
        const emptyValues = ['phoneNumber', 'email']

        const areEmptyEmailAndPhoneNumber = emptyValues.every(property => updatedValues[property] === '') 
        const isInvalidPassword = !((password && confirmPassword && currentPassword) && (password === confirmPassword))
        const isInvalidFullName = (!firstName && !lastName) || (firstName && !lastName) || (!firstName && lastName) || ((firstName === user?.firstName) && (lastName === user?.lastName))

        if (((!email || !phoneNumber) && (firstName && lastName)) || (email && phoneNumber) && (!password && !confirmPassword && !currentPassword)) {
            // If email and phoneNumber are present, and passwords are empty. 
            
            return false
        }

        if (areEmptyEmailAndPhoneNumber || (isInvalidFullName && isInvalidPassword)) {
            // If full name and passwords are invalid.
            
            return true
        }

        if (!areEmptyEmailAndPhoneNumber || (isInvalidFullName && !isInvalidPassword)) {
            // If invalid full name and passwords are valid.
            
            return false
        }
    }

    const cannotUpdate = areFieldsValid(user, formik.values)

    return (
        <div className="w-full h-full">
            <form className="w-full h-full flex flex-col" onSubmit={formik.handleSubmit}>
                <div className="w-full relative">
                    <Input 
                        readOnly   = {user?.emailStatus === 'ACT'}
                        bgclass    = "bg-white"
                        formik     = {formik}
                        id         = "email" 
                        inputclass = "opacity-50" 
                        label      = "Email Address" 
                        name       = "email" 
                        props      = {fieldProps[0]}
                        type       = "email" 
                    />

                    {
                        canVerifyEmail && !errors?.email && values.email && user?.email
                            && 
                                <UserVerifyButton 
                                    formik               = {formik}
                                    sendUserVerification = {sendUserVerification} 
                                    fieldStatus          = {'emailStatus'}
                                />
                    }
                </div>
                
                {
                    isActiveUser
                        && 
                            <div className="w-full relative">
                                <PhoneNumber 
                                    formik  = {formik}
                                    id      = "phoneNumber" 
                                    label   = "Phone Number"
                                    name    = "phoneNumber"
                                    onFocus = {handleHideCriteria}
                                />

                                {
                                    canVerifyPhoneNumber && !errors?.phoneNumber && values.phoneNumber && user?.phoneNumber
                                        && 
                                            <UserVerifyButton 
                                                formik               = {formik}
                                                sendUserVerification = {sendUserVerification} 
                                                fieldStatus          = {'phoneNumberStatus'}
                                            />
                                }
                            </div>
                }
                   

                <Input
                    aria-required = {false}
                    bgclass       = "bg-white"
                    formik        = {formik}
                    id            = "firstName" 
                    label         = "First Name"
                    name          = "firstName"
                    onFocus       = {handleHideCriteria}
                    props         = {fieldProps[1]}
                    type          = "text"
                />
                
                <Input 
                    aria-required = {false}
                    bgclass       = "bg-white"
                    formik        = {formik}
                    id            = "lastName"
                    label         = "Last Name"
                    name          = "lastName"
                    onFocus       = {handleHideCriteria}
                    props         = {fieldProps[2]}
                    type          = "text"
                />

                {
                    isActiveUser
                            &&  
                                <>
                                    <Password 
                                        aria-required = {true}
                                        bgclass       = "bg-white"
                                        formik        = {formik}
                                        id            = "currentPassword" 
                                        label         = "Current Password" 
                                        name          = "currentPassword" 
                                        onFocus       = {handleHideCriteria}
                                        props         = {fieldProps[3]} 
                                    />
                    
                                    <Password 
                                        aria-required = {true}
                                        bgclass       = "bg-white"
                                        formik        = {formik}
                                        id            = "password" 
                                        label         = "New Password" 
                                        name          = "password" 
                                        onFocus       = {handleShowCriteria}
                                        props         = {fieldProps[4]} 
                                        showcriteria  = {showCriteria.toString()} 
                                    />
                    
                                    <Password 
                                        aria-required = {true}
                                        bgclass       = "bg-white"
                                        formik        = {formik} 
                                        id            = "confirmPassword" 
                                        label         = "Confirm Password" 
                                        name          = "confirmPassword" 
                                        onFocus       = {handleHideCriteria}  
                                        props         = {fieldProps[5]} 
                                    />
                                </>
                }

                <Button 
                    classes  = "flex items-center justify-center bg-robo-primaryTwo h-[52px] text-robo-primaryThree mt-[24px] disabled:bg-[#eceae7] disabled:text-robo-primaryEight"
                    disabled = {cannotUpdate}
                    label    = "update info" 
                    props    = {labelProps}
                    type     = "submit" 
                />
            </form>
        </div>
    )
}

export default UserForm

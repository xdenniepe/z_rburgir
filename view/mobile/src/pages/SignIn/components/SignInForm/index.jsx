import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthCtx } from '../../../../hooks'
import { Input, Password, PhoneNumber } from '../../../../components/Form'
import { useFormik } from 'formik'
import { authSchema } from '../../../../validation/schema'
import { evaluate, removeLocalStorageItem, setLocalStorageItem } from '../../../../utilities/helpers'

const SignInForm = ({ toast }) => {
    const { authUser, getUserByToken, getUserData, hasDateExceeded, loginUser, verifyByLoginType } = useAuthCtx()
    const [loginType, setLoginType] = useState('')
    const [disabled, setDisabled]   = useState(false)
    
    const navigate = useNavigate()
    
    const messageType = loginType ? (loginType === 'email' ? loginType : 'phone number') : ''
 
    const initialValues = {
        email      : '',
        phoneNumber: '',
        password   : ''
    } 

    const labelProps = [
        { inputLabel   : 'Input Email' },
        { inputLabel   : 'Input Phone Number' },
        { passwordLabel: 'Input Password' },
        { buttonLabel  : 'Login Button' }
    ]

    const checkUserStatus = (data, setErrors) => {
        evaluate(data)
            .compare(data => !data || data.status === 'ACT', () => displayPasswordError(setErrors))
            .compare(data => data.status === 'INA', () => toast('Error', `Please verify your ${messageType}.`))
            .otherwise(() => toast('Error', 'This email address is linked to your google account.'))
    }


    const displayPasswordError = setErrors => 
        setErrors({
            password: `The ${messageType} and/or password you entered is incorrect.`
        })
    
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        
        try {
            const authRes = await authUser(values, loginType)
            const token   = await authRes.data  
            setDisabled(true)

            if (token) {
                setLocalStorageItem('token', token)

                const tokenRes   = await getUserByToken(token)
                                        .catch(err => console.error(err))
                                        .finally(() => displayPasswordError(setErrors))
                const user       = await getUserData(tokenRes.data)
                const resultDate = await hasDateExceeded(tokenRes.data.whenAdded)

                removeLocalStorageItem('token')
                
                if (resultDate) {
                    toast('Error', 'Password change is required every 70 days. Redirecting to reset password.')
                    setTimeout(() => navigate('/forgotpassword'), 3000)
                } else {
                    loginUser(navigate, { token, user })
                }
            } else {
                const verifyData = await verifyByLoginType(loginType, values)
                    
                checkUserStatus(verifyData, setErrors)
            }
            
            setDisabled(false)
        } catch (err) {
            displayPasswordError(setErrors)
            setDisabled(false)
            setSubmitting(true)
        }

        setSubmitting(false)
    } 

    const formik = useFormik({
        initialValues,
        validationSchema: authSchema,
        onSubmit        : handleSubmit
    })

    const { isSubmitting, values } = formik

    useEffect(() => {
        if (values.email) {
            values.phoneNumber = ''
            setLoginType('email')
        } 
    }, [values.email])

    useEffect(() => {
        if (values.phoneNumber) {
            values.email = ''
            setLoginType('phoneNumber')
        }
    }, [values.phoneNumber])

    return (
        <form onSubmit={formik.handleSubmit} className="w-full max-h-fit">
            <div>
                <Input 
                    autoComplete  = "email"
                    id            = "email" 
                    formik        = {formik} 
                    label         = "Email Address" 
                    name          = "email" 
                    props         = {labelProps[0]} 
                    type          = "email"
                />

                <PhoneNumber 
                    id      = "phoneNumber" 
                    name    = "phoneNumber"
                    label   = "or Phone Number"
                    formik  = {formik}
                />

                <Password
                    aria-required = {true}
                    formik        = {formik}
                    id            = "password"
                    key           = "password"
                    label         = "Password"
                    name          = "password"
                    props         = {labelProps[2]}                    
                />
            </div>

            <div className="mt-10 sm:mt-[31px] xs:mt-[26px] xxs:mt-[24px] 3xs:mt-[22px]">
                <button
                    aria-label = {labelProps[3].buttonLabel}
                    className  = "button-default bg-robo-primaryTwo text-robo-primaryThree disabled:bg-robo-primaryThree disabled:text-robo-primaryTwo"
                    disabled   = {disabled || isSubmitting || !((values.email || values.phoneNumber) && values.password)}                
                    type       = "submit"
                >
                    LOGIN
                </button>
            </div>     
        </form>
    )
}

export default SignInForm

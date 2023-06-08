import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useAuthCtx } from '../../../../hooks'
import { Input, Password, PhoneNumber } from '../../../../components/Form'
import { authSchema } from '../../../../validation/schema'
import { passwordRegex } from '../../../../utilities/constants'
import { isValidPhoneNumber } from 'react-phone-number-input'

const SignUpForm = ({ toast }) => {
    const { registerUser, verifyRegistration } = useAuthCtx()
    const navigate                             = useNavigate()
    const [showCriteria, setShowCriteria]      = useState(false)
    const [disabled, setDisabled]              = useState(false)

    const initialValues = {
        email      : '',
        phoneNumber: '',
        password   : ''
    }

    const labelProps = [
        { inputLabel   : 'Input Email' },
        { passwordLabel: 'Input Password' },
        { buttonLabel  : 'Sign Up Button' }
    ]

    const handleShowCriteria = () => setShowCriteria(true)

    const handleHideCriteria = () => setShowCriteria(false)

    const handleSubmit = async (values, { resetForm, setFieldError, setSubmitting }) => {
        setDisabled(true)

        const reinitialize = reset => {
            if (reset) {
                resetForm()
            }

            setSubmitting(false)
            setShowCriteria(false)
        }

        if (showCriteria) {
            handleHideCriteria()
        }

        if (values.phoneNumber && !isValidPhoneNumber('+' + values.phoneNumber)) {
            setFieldError('phoneNumber', 'The phone number you provided is not valid.')    
            reinitialize(false)      
            setDisabled(false)
            return
        }
        
        try {
            const registerRes    = await registerUser(values)
            const registerStatus = await registerRes.status

            if (registerStatus === 200) {
                const baseUrl = window.location.origin

                let msg = ""

                if (values.email) {
                    msg = "verifyemail"
                } else if (values.phoneNumber) {
                    msg = "verifyphonenumber"
                } 

                if (values.email && values.phoneNumber) {
                    msg = "verifyemailandphonenumber"
                }

                verifyRegistration(values, baseUrl)
                    .then(() => {
                        reinitialize(true)
                        navigate(`/success?message=${msg}`, {state : {values: values}})
                    })
                    .catch(err => console.error(err?.message || err))
            }
        } catch (err) {
            console.error(err?.message || err)
            toast('Error', 'Email or phone number already exists.')
            reinitialize(true)
            setDisabled(false)
        }
        
    }

    const formik = useFormik({
        initialValues,
        validationSchema: authSchema,
        onSubmit        : handleSubmit
    })

    const regex = passwordRegex.map(data => formik.values.password.match(data.regex) ? true: false)

    const isPasswordValid = regex.every(e => e === true)

    const { isSubmitting, values } = formik

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
                    onFocus = {handleHideCriteria}
                    formik  = {formik}
                />

                <Password
                    aria-required = {true}
                    formik        = {formik}
                    hidecriteria  = {handleHideCriteria}
                    id            = "password"
                    key           = "password"
                    label         = "Password"
                    name          = "password"
                    onFocus       = {handleShowCriteria}
                    props         = {labelProps[1]}
                    showcriteria  = {showCriteria.toString()}
                    errormessage  = "Password"
                />
            </div>

            <div className="my-[31px] sm:my-[31px] xs:my-[26px] xxs:my-[24px] 3xs:my-[22px]">
                <button
                    aria-label = {labelProps[2].buttonLabel}
                    className  = " button-default bg-robo-primaryTwo text-robo-primaryThree disabled:bg-robo-primaryThree disabled:text-robo-primaryTwo"
                    disabled   = {disabled || isSubmitting || !((values.email || values.phoneNumber) && values.password) || !isPasswordValid}                
                    type       = "submit"
                >
                    SIGN UP
                </button>
            </div> 
        </form>
    )
}

export default SignUpForm

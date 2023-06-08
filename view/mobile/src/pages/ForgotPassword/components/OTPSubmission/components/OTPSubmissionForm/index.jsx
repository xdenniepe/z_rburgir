import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthCtx } from '../../../../../../hooks'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { resetCodeSchema } from '../../../../../../validation/schema'
import { INVALID_CODE } from '../../../../../../utilities/constants'
import { Input } from '../../../../../../components/Form'
import OTPSubmissionResendCode from './components/OTPSubmissionResendCode'
import OTPSubmissionTimer from './components/OTPSubmissionTimer'

const OTPSubmissionForm = ({ credential, toast }) => {
    const { getUser, getVerificationCode }    = useAuthCtx()
    const navigate                            = useNavigate()
    const [isOTPSubmitted, setIsOTPSubmitted] = useState(false)
    const [OTP, setOTP]                       = useState(null)
    const [showOTPTimer, setShowOTPTimer]     = useState(true)
    const [userID, setUserID]                 = useState(null)

    const initialValues       = { oneTimePassword: '' }
    const invalidCodeVerbiage = credential.includes('@') ? 'email.' : 'inbox.'

    const labelProps = [
        { inputLabel : 'Input OTP' },
        { buttonLabel: 'Send Button' }
    ]

    // Capitalized for formality of having a component as a value.
    const Component = showOTPTimer ? OTPSubmissionTimer : OTPSubmissionResendCode

    const getAndSetOTP = async () => {
        try {
            const { oneTimePassword, userId } = await getUser(credential)
            setOTP(oneTimePassword)
            setUserID(userId)
        } catch (err) {
            // console.error(err?.message || err)
            toast('Error', err?.message || err)
        }
    }

    const getProps = useCallback(() => {
        if (showOTPTimer) {
            return { isOTPSubmitted, setShowOTPTimer }
        }

        return { credential, setShowOTPTimer, getAndSetOTP }
    }, [showOTPTimer])

    const handleSubmit = async ({ oneTimePassword }, { setErrors, setSubmitting }) => {        
        setSubmitting(false)
        
        if (oneTimePassword === OTP) {
            try {
                const { data } = await getVerificationCode(userID)
    
                setIsOTPSubmitted(true)
                navigate(`/resetpassword/${data}`, {state : {credential: credential}})
            } catch (err) {
                console.error(err?.message || err)
            } 
        } else {
            setErrors({ oneTimePassword: `${INVALID_CODE} ${invalidCodeVerbiage}` })
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: resetCodeSchema,
        onSubmit        : handleSubmit
    })

    const props = useMemo(() => getProps(), [showOTPTimer])

    const { isValid, isSubmitting } = formik

    useEffect(() => {
        getAndSetOTP()
    }, [])

    return (
        <form onSubmit={formik.handleSubmit} className="w-full max-h-fit">
            <Input 
                id       = "oneTimePassword" 
                name     = "oneTimePassword" 
                label    = "Enter Code" 
                type     = "oneTimePassword" 
                formik   = {formik} 
                props    = {labelProps[0]} 
            />

            {showOTPTimer ? <></> : <div className="sm:mt-[14px] xs:mt-[10px] xxs:mt-[8px] 3xs:mt-[6px]"> <Component {...props}/> </div> }

            <div className="mt-10 sm:mt-[31px] xs:mt-[26px] xxs:mt-[24px] 3xs:mt-[22px]">
                <button
                    aria-label = {labelProps[1].buttonLabel}
                    className  = "button-default bg-robo-primaryTwo text-robo-primaryThree disabled:opacity-75"
                    disabled   = {isSubmitting || !isValid}                
                    type       = "submit"
                >
                    SUBMIT
                </button>
            </div> 

            {showOTPTimer ? <Component {...props} /> : <></> }
        </form>
    )
}

export default OTPSubmissionForm

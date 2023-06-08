import React from 'react'
import { useAuthCtx } from '../../../../../../hooks'
import { useFormik } from 'formik'
import { forgotPasswordSchema } from '../../../../../../validation/schema'
import { Input } from '../../../../../../components/Form'

const CredentialSubmissionForm = ({ setCredential }) => {
    const { generateOTP, getAuthType, getDataFromAuthType, sendUserOTP } = useAuthCtx()

    const initialValues = { emailOrPhoneNumber: '' }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const labelProps = [
        { inputLabel : 'Input Email' },
        { buttonLabel: 'Send Button' }
    ]

    const cleanse = ({ setSubmitting, setErrors }, status = null) => {
        let error

        if (status) {
            error = 'This user is still unverified.'
        } else {
            error = 'This email/phone number does not exist.'
        }

        setSubmitting(false)
        setErrors({ emailOrPhoneNumber: error })
    }

    const handleSubmit = async ({  emailOrPhoneNumber }, { setSubmitting, setErrors }) => {
        const cleanseFunctions = { setSubmitting, setErrors }
        
        try {
            const authType        = await getAuthType(emailOrPhoneNumber)
            const data            = await getDataFromAuthType(authType, emailOrPhoneNumber)
            const generateOtpRes  = await generateOTP(data)
            const generateOtpData = generateOtpRes.data
            const { status }      = generateOtpData

            if (status === 'ACT') {
                const sendRes    = await sendUserOTP(data, timeZone)
                const { status } = sendRes

                if (status === 200) {
                    setCredential(emailOrPhoneNumber)
                }
            } else if (status === 'INA') {
                cleanse(cleanseFunctions, status)
            } else {
                cleanse(cleanseFunctions)
            }
        } catch (err) {
            console.error(err?.message || err)
            cleanse(cleanseFunctions)
        } 
    }

    const formik = useFormik({
        initialValues,
        validationSchema: forgotPasswordSchema,
        onSubmit        : handleSubmit
    })

    const { isSubmitting, isValid, values } = formik

    return (
        <form onSubmit={formik.handleSubmit} className="w-full max-h-fit">
            <Input 
                id         = "emailOrPhoneNumber" 
                name       = "emailOrPhoneNumber" 
                label      = "Enter Email or Phone Number" 
                type       = "text" 
                formik     = {formik} 
                props      = {labelProps[0]} 
            />

            <div className="mt-[22px] sm:mt-[22px] xs:mt-[18px] xxs:mt-[16px] 3xs:mt-[14px]">
                <button
                    aria-label = {labelProps[1].buttonLabel}
                    className  = "button-default bg-robo-primaryTwo text-robo-primaryThree disabled:opacity-75"
                    disabled   = {isSubmitting || !isValid || !values.emailOrPhoneNumber }                
                    type       = "submit"
                >
                    SEND
                </button>
            </div> 
        </form>
    )
}

export default CredentialSubmissionForm

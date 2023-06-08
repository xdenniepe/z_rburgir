import React from 'react'
import { useAuthCtx } from '../../../../../../../../hooks'

const OTPSubmissionResendCode = ({ credential, getAndSetOTP, setShowOTPTimer }) => {
    const { generateOTP, getAuthType, getDataFromAuthType, sendUserOTP } = useAuthCtx()

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const handleClick = async () => {   
        try {
            const authType       = await getAuthType(credential)
            const data           = await getDataFromAuthType(authType, credential)
            const generateOtpRes = await generateOTP(data)
            const { status }     = generateOtpRes
            
            if (status === 200) {
                const sendRes    = await sendUserOTP(data, timeZone)
                const { status } = sendRes

                if (status === 200) {
                    getAndSetOTP()
                    setShowOTPTimer(true)
                }
            }
        } catch (err) {
            console.error(err?.message || err)
        }
    }

    return (
        <div className="pt-2 text-sm font-light flex flex-row gap-2 tracking-[1.12px] leading-[19px]">
            <p 
                aria-label = "Having Trouble?"
                className  = "w-fit"
            >
                Having trouble? 
            </p> 

            <button 
                aria-label = "Resend code"  
                onClick    = {() => handleClick()}
                className  = "w-fit links" 
                role       = "link" 
                type       = "button" 
            > 
                Resend code.
            </button>   
        </div>  
    )
}

export default OTPSubmissionResendCode

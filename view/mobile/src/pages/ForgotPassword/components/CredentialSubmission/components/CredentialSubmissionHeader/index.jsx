import React from 'react'

const EmailSubmissionHeader = () => {
    return (
        <div className="text-robo-primaryTwo text-left px-1 space-y-4 mb-5 mt-[130px]">
            <p
                aria-label = "Reset Password"
                className  = "text-2xl" 
            >
                Reset Password
            </p>
            <p 
                aria-label = "Please provide your email or phone number associated with this account. We will send you a secured link where you can set up your new password."
                className  = "text-[15px] tracking-[1.12px] leading-[23.5px] text-left" 
            >
                Please provide your email or phone number associated with this account. We will send you a secured link where you can set up your new password.
            </p>
        </div>
    )
}

export default EmailSubmissionHeader

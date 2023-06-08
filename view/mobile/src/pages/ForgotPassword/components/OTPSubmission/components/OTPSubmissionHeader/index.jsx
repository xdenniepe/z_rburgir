import React, { memo } from 'react'

const ForgotPasswordOTPHeader = ({ credential }) => {
    return (
        <div className="text-robo-primaryTwo text-left px-1 space-y-[9px] mt-[130px]">
            <p
                aria-label = "What's your confirmation code?"
                className  = "text-2xl" 
            >
                What's your <br/> confirmation code?
            </p>
            <p 
                aria-label = {`It was sent to you at ${credential}`}
                className  = "text-sm tracking-[1.12px] leading-[18px]" 
            >
                It was sent to you at {credential}
            </p>
        </div>
    )
}

export default memo(ForgotPasswordOTPHeader)

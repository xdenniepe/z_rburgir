import React from 'react'

const ResetPasswordHeader = () => {
    return (
        <div className="text-robo-primaryTwo text-center space-y-4 mt-[130px]">
            <p
                aria-label = "Reset Password"
                className  = "text-left text-2xl ml-1 leading-[30px]" 
            >
                Reset Password
            </p>
            <p 
                aria-label = "Please enter your new password"
                className  = "text-left text-sm tracking-[1.12px] ml-1 leading-[18px]" 
            >
                Please enter your new password
            </p>
        </div>
    )
}

export default ResetPasswordHeader

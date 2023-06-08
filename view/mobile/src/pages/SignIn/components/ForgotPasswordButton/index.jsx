import React from 'react'
import { Link } from 'react-router-dom'

const ForgotPasswordButton = () => {
    return (
        <div className="mt-[22px] sm:mt-[22px] xs:mt-[18px] xxs:mt-[16px] 3xs:mt-[14px]">
            <Link 
                to          = "/forgotpassword" 
                aria-label  = "Forgot password link"
                className   = "text-sm mt-[6px] underline w-full tracking-wide text-left"
                role        = "link"
                tabIndex    = {0}
            > 
                Forgot Password <span className="font-ui text-sm" aria-hidden={true}> &#63; </span>
            </Link>
        </div>
    )   
}

export default ForgotPasswordButton

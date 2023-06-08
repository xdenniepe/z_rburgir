import React from 'react'
import { IMAGES } from '../../../../utilities/constants'
import VerificationNote from '../VerificationNote'

const VerifyEmail = ({ field }) => {
    return (
        <div className="w-full text-center space-y-5">
            <p 
                aria-label = "verify your email" 
                className  = "lg:text-2xl md:text-lg sm:text-lg sm:tracking-[1.44px] sm:leading-[23.5px]" 
                tabIndex   = {0}
            > 
                Verify your email 
            </p>
            
            <div className="flex w-full justify-center items-center">
                <img 
                    aria-label = "Message Envelope Image - Verify Email"
                    className  = "h-[135.3px] w-[135.25px]"
                    src        = {IMAGES.VERIFYEMAIL} 
                    tabIndex   = {0}
                />
            </div>

            <p 
                aria-label = "please check email inbox for the one-time password"
                className  = "pt-2 lg:text-2xl md:text-lg sm:text-md sm:tracking-[1px] sm:leading-7 text-robo-primaryTwo" 
                tabIndex   = {0}
            > 
                Please check <span className="font-futura-bold"> email </span> inbox for the one-time password. {<VerificationNote field={field} />}
            </p>
        </div>
    )
}

export default VerifyEmail

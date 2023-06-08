import React from 'react'
import { useAuthCtx } from '../../../../hooks'
import { RoboBot } from '../../../../utilities/icons'

const AccountVerified = () => {
    const { token } = useAuthCtx().state
    
    const msg = token ? 'You have verified your credential successfully!' : 'You have signed up successfully!'

    return (
        <div className="w-full">
            <div className="flex w-full justify-center items-center">
                <RoboBot className="h-[168px] w-[168px]" aria-label="Robot Head Icon" role="text" tabIndex={0} />
            </div>

            <div className="w-full text-robo-primaryTwo text-center space-y-2">
                <p 
                    aria-label = {msg}
                    className  = "text-lg tracking-[1.44px] leading-[23.5px]"
                    tabIndex   = {0}
                >
                    {msg}
                </p>
            </div>
        </div>
    )
}

export default AccountVerified

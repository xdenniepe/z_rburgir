import React, { useCallback } from 'react'
import { useAuthCtx } from '../../../../hooks'
import { Person } from '../../../../utilities/icons'

const UserProfile = () => {
    const { user } = useAuthCtx().state

    const renderUserName = useCallback(() => (
        <div className="text-robo-currency text-[24px] text-center tracking-[2px] uppercase font-futura-bold" aria-label={`${user.firstName} ${user.lastName}`} tabIndex={0} role="text"> 
            {user.firstName} {user.lastName} 
        </div>
    ), [user])

    return (
        <div className="flex flex-col gap-[11px] items-center justify-center">
            <div className="w-[67.53px] h-[67.53px] rounded-full bg-white flex flex-col content-center items-center justify-center">
                <span 
                    className  = "w-11 h-11 text-center absolute" 
                />
                <Person className="w-[67.53px] h-[67.53px]" fill="#EDE8E4" aria-label="Avatar Icon" role="text" tabIndex={0} />
            </div>

            {(user.firstName && user.lastName) ? renderUserName() : null} 
        </div>
    )
}

export default UserProfile

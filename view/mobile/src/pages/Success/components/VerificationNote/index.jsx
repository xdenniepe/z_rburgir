import React from 'react'

const VerificationNote = ({ field }) => {
    return (
        <span>
            You are unable to login using your {field} until you verify it.
        </span>
    )
}

export default VerificationNote

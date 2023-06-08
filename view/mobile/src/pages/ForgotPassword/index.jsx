import React, { useCallback, useMemo, useState } from 'react'
import { BackButton } from '../../components/Common' 
import CredentialSubmission from './components/CredentialSubmission'
import OTPSubmission from './components/OTPSubmission'

const ForgotPassword = ({ toast, renderSr }) => {
    // TO DO: create dynamic credential submission through email or phone number
    const [credential, setCredential] = useState('')
    // const [verificationType]

    // Capitalized for formality of having a component as a value.
    const Component =  credential ? OTPSubmission : CredentialSubmission

    const getProps = useCallback(() => {
        if (credential) {
            return { credential, toast } 
        }

        return { setCredential }
    }, [credential])

    const props = useMemo(() => getProps(), [credential])

    return (
        <div className="container-class-mt px-10 bg-[#ede8e4]">
            {renderSr()}
            <BackButton to={-1} />
            <Component {...props} />
        </div>
    )
}

export default ForgotPassword

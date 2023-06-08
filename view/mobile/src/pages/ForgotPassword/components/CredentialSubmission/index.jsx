import React from 'react'
import CredentialSubmissionHeader from './components/CredentialSubmissionHeader'
import CredentialSubmissionForm from './components/CredentialSubmissionForm'

const CredentialSubmission = ({ setCredential }) => {
    return (
        <div className='container mx-auto lg:px-[500px]'>
            <CredentialSubmissionHeader />
            <CredentialSubmissionForm setCredential={setCredential} />
        </div>
    )
}

export default CredentialSubmission

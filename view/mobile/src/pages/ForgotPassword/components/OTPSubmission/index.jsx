import React from 'react'
import OTPSubmissionHeader from './components/OTPSubmissionHeader'
import OTPSubmissionForm from './components/OTPSubmissionForm'

const OTPSubmission = ({ credential, toast }) => {
    return (
        <>
            <OTPSubmissionHeader credential={credential} />
            <OTPSubmissionForm credential={credential} toast={toast} />
        </>
    )
}

export default OTPSubmission

import React from 'react'
import { BackButton } from '../../components/Common'
import ResetPasswordHeader from './components/ResetPasswordHeader'
import ResetPasswordForm from './components/ResetPasswordForm'

const ResetPassword = () => {
    return (
        <div className="container-class-mt px-10 bg-[#ede8e4]">
            <BackButton  to={-1} />
            <ResetPasswordHeader />
            <ResetPasswordForm />
        </div>
    )
}

export default ResetPassword

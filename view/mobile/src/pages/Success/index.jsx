import React, { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthCtx } from '../../hooks'
import { UPDATE_USER } from '../../reducers/authReducer'
import AccountVerified from './components/AccountVerified'
import PasswordChange from './components/PasswordChange'
import ResendTimer from './components/ResendTimer'
import UnsubscribeSuccess from './components/UnsubscribeSuccess'
import VerifyEmail from './components/VerifyEmail'
import VerifyPhoneNumber from './components/VerifyPhoneNumber'
import VerifyEmailAndPhone from './components/VerifyEmailAndPhone'

const Success = ({ renderSr }) => {
    const { state, dispatch, verifyAccount } = useAuthCtx()
    const { token, user } = state
    const [searchParams]  = useSearchParams()

    const location            = useLocation()
    const locationStateValues = location?.state?.values
    const message             = searchParams.get('message')
    const prevUrl             = location?.state?.prevUrl

    const navigate = useNavigate()

    const getPathAndVerbiage = (prevUrl, token) => {
        let path     = ''
        let verbiage = ''

        if (token && prevUrl) {
            path     = '/products'
            verbiage = 'Shop Now!'
        } else if (token && !prevUrl) {
            path     = '/home'
            verbiage = 'Back to Home'
        } else {
            path     = '/signin'
            verbiage = 'Back to Login'
        }

        return { path, verbiage }
    }

    const getField = message => {
        switch (message) {
            case 'verifyemail'              : return 'email'
            case 'verifyphonenumber'        : return 'phone number'
            case 'verifyemailandphonenumber': return 'email and phone number'
            default                         : return ''
        }
    }

    const getContent = message => {
        switch (message) {
            case 'accountverified'          : return AccountVerified
            case 'verifyemail'              : return VerifyEmail
            case 'verifyphonenumber'        : return VerifyPhoneNumber
            case 'passwordchange'           : return PasswordChange
            case 'verifyemailandphonenumber': return VerifyEmailAndPhone
            case 'unsubscribesuccess'       : return UnsubscribeSuccess
        }
    }

    const resendAvailable = ['verifyemail', 'verifyphonenumber', 'verifyemailandphonenumber']

    const Content = getContent(message)

    const { path, verbiage } = getPathAndVerbiage(prevUrl, token)

    const updateUserStatus = (fieldStatus, user, dispatch) => {
        if (!fieldStatus) return

        const type    = UPDATE_USER
        const payload = { user: { ...user, [fieldStatus]: 'ACT' } }

        dispatch({ type, payload })
    }

    const contentProps = {}

    if (message === 'verifyemail' || message === 'verifyphonenumber' || message === 'verifyemailandphonenumber') {
        contentProps.field = getField(message)
    }

    useEffect(() => {
        if(message === 'accountverified' && searchParams.has('code')) {
            const code = searchParams.get('code')

            verifyAccount(code)
                .then(() => {
                    const isEmailInactive       = user?.emailStatus === 'INA'
                    const isPhoneNumberInactive = user?.phoneNumberStatus === 'INA'

                    if (token && (isEmailInactive || isPhoneNumberInactive)) {
                        const fieldStatus = isEmailInactive ? 'emailStatus' : isPhoneNumberInactive ? 'phoneNumberStatus' : null

                        updateUserStatus(fieldStatus, user, dispatch)
                    }
                })
                .catch(err => console.error(err?.message || err))
        }
    }, [])
 
    return (
        <div className="container-class px-10 bg-[#ede8e4] items-center">
            {renderSr()}
            {message ? <Content { ...contentProps } /> : null}
            <div className="mt-6 w-full lg:w-1/5">
                <button
                    aria-label = {verbiage}
                    className  = "tracking-widest uppercase flex items-center justify-center text-robo-primaryThree bg-robo-primaryTwo w-full h-[66px] sm:text-xl xs:text-xl xxs:text-lg 3xs:text-base font-futura"
                    onClick    = {() => navigate(path, { state: {} })}
                    type       = "button"
                >
                     {verbiage}
                </button>
            </div> 
            {(resendAvailable.includes(message) && locationStateValues ? <ResendTimer values={locationStateValues}/> : null)}
        </div>
    )
}

export default Success
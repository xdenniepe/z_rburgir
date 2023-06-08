import React from 'react'
import { AppleButton, BackButton, GoogleButton, ThirdPartyAuthContainer } from '../../components/Common'
import AuthHeader from '../../components/Common/AuthHeader'
import SignUpForm from './components/SignUpForm'

const SignUp = ({ toast, renderSr }) => {
    const handleTermsLink = () => {
        window.open('https://app.termly.io/document/terms-of-use-for-online-marketplace/7dbfd379-d7f6-4a1f-b173-7ae072d9543f')
    }

    const handlePrivacyLink = () => {
        window.open('https://app.termly.io/document/privacy-policy/b8016a2e-570b-4a4b-8ffa-dbae0894ae6a')
    }

    return (
        <div className="w-full h-screen px-10 lg:py-20 bg-[#ede8e4] overflow-y-auto absolute">   
            <div className='container mx-auto xl:pt-7 lg:pt-5 md:pt-26 max-w-[35rem]'>

                {renderSr()}
                <BackButton  to={'/landingpage'} />
                <AuthHeader />
                <SignUpForm toast={toast} />
                <ThirdPartyAuthContainer>
                    <GoogleButton toast={toast} />
                    <AppleButton toast={toast} />
                </ThirdPartyAuthContainer>

                <div className=" -mt-[30px] text-center mb-6 text-[13px] tracking-wide 3xs:text-[12px] xxs:text-[12px]" >
                    <p 
                        role       = "text"
                        aria-label = "By continuing, you agree to accept our Privacy Policy and Terms of Service" 
                        tabIndex   = {0}
                    >
                        By continuing, you agree to accept our 
                    </p>
                    <button 
                        tabIndex    = {0}
                        className   = "underline tracking-wide" 
                        aria-label  = "Privacy Policy" 
                        role        = "link" 
                        onClick     = {handlePrivacyLink}
                    >
                        Privacy Policy 
                    </button>
                    <span aria-hidden = {true}> & </span>
                    <button 
                        tabIndex    = {0}
                        className  = "underline tracking-wide" 
                        onClick    = {handleTermsLink}
                        aria-label = "Terms of Service"
                        role       = "link"
                    > 
                        Terms of Service 
                    </button>
                </div>

            </div> 
        </div>
    )
}

export default SignUp

import React from 'react'
import { AppleButton, BackButton, GoogleButton, ThirdPartyAuthContainer } from '../../components/Common'
import AuthHeader from '../../components/Common/AuthHeader'
import ForgotPasswordButton from './components/ForgotPasswordButton'
import SignInForm from './components/SignInForm'


const SignIn = ({ toast, renderSr }) => {
    
    return (
        <div className="w-full h-screen px-10 lg:py-20 bg-[#ede8e4] overflow-y-auto absolute" >
            <div className='container mx-auto xl:pt-7 lg:pt-5 md:pt-26 max-w-[35rem]'>
                {renderSr()}
                <BackButton to="/landingpage" />
                <AuthHeader />
                <SignInForm toast={toast}/>
                <ForgotPasswordButton />
                <ThirdPartyAuthContainer>
                    <GoogleButton toast={toast} />
                    <AppleButton toast={toast} />
                </ThirdPartyAuthContainer>
            </div>
        </div>
    )
}

export default SignIn

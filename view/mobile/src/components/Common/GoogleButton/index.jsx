import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthCtx } from '../../../hooks'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from '../../../firebase'
import { Google } from '../../../utilities/icons'
import { evaluate, removeLocalStorageItem, setLocalStorageItem } from '../../../utilities/helpers'

const GoogleButton = ({ toast }) => {
    const { authUser, getUserByToken, getUserData, loginUser, logoutFirebase, registerGoogleAccount, verifyUserByEmail } = useAuthCtx()

    const { pathname } = useLocation()
    const navigate     = useNavigate()
    let btnAction      = pathname === "/signup" ? "Sign up" : "Login"

    const checkUserStatus = data => {
        evaluate(data)
            .compare(data => data === null, () => toast('Error', 'This email does not exist.'))
            .compare(data => data.status === 'EXT', () => toast('Error', 'Please try again.'))
            .compare(data => data.status === 'INA' || data.status === 'ACT', () => toast('Error', 'This email address is not linked to your google account. Please use another login method.'))
    }

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider()

        provider.setCustomParameters({
            prompt: 'select_account'
        })

        signInWithPopup(auth, provider)
            .then(res => {
                const credential = GoogleAuthProvider.credentialFromResult(res);
                handleCallbackResponse()
            })
            .catch(err => {
                const credential = GoogleAuthProvider.credentialFromError(err);
            })    
    }

    const handleGoogleSignIn = () => {
        googleSignIn()
    }

    const handleCallbackResponse = async () => {
        const user = auth.currentUser

        if (pathname === '/signin') {
            await signInUser(user)
        } else if (pathname === '/signup' && user.emailVerified) {
            await signUpUser(user)
        }
    }

    const signInUser = async ({ email, uid}) => {
        try {
            const values    = { email: email, password: uid }
            const verifyRes = await verifyUserByEmail(email)
            const { data }  = await verifyRes
            const authRes   = await authUser(values, 'email')
            const token     = await authRes.data

            if (!data.googleId) {
                toast('Error', 'This email address is not linked to your google account. Please use another login method.')
                throw new Error('This email is not linked to your google account.')
            }

            if (token) {
                setLocalStorageItem('token', token)

                const tokenRes = await getUserByToken(token)
                const user     = await getUserData(tokenRes.data)

                removeLocalStorageItem('token')
                loginUser(navigate, { token, user })
            } else {
                checkUserStatus(data)
                logoutFirebase()
            }
        } catch (err) {
           
            toast("Error", "Account doesn't exist, please sign up")
            logoutFirebase()
            navigate('/signup')
        }
    }

    const signUpUser = async user => {
        logoutFirebase()

        try {
            const verifyRes = await verifyUserByEmail(user.email)
            const { data }  = await verifyRes

            if (data) {
                toast('Error', 'Email already exists.')
            }
        } catch (err) {
            registerGoogleAccount(user).then(() => navigate('/success?message=accountverified'))
        }
    }

    return (
        <button 
            aria-label = {`Continue with Google ${btnAction}`}
            className  = "flex flex-row w-full h-[48px] sm:h-[48px] xs:h-[46px] xxs:h-[44px] 3xs:h-[42px]" 
            type       = "button" 
            onClick    = {() => handleGoogleSignIn()} 
        >
            <div className="border border-[#cbc8c6] flex items-center justify-center w-1/5 bg-white h-full flex-none">
                <Google className="h-[29px] w-[29px] xs:h-[25px] xs:w-[25px] xxs:h-[25px] xxs:w-[25px] 3xs:h-[25px] 3xs:w-[25px]"/>
            </div> 
            <div className="flex items-center justify-center bg-[#4386F6] text-white h-full w-full text-sm sm:text-xs xs:text-[12px] xxs:text-[11px] 3xs:text-[10px] tracking-[2px] font-futura"> CONTINUE WITH GOOGLE </div>
        </button> 
    )
}

export default GoogleButton
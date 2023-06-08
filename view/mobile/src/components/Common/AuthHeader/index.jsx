import React from 'react'
import { useLocation, Link } from 'react-router-dom'

const AuthHeader = () => {
    const { pathname } = useLocation()
    const classNames   = [
        'w-1/2 py-[9px] bg-robo-primaryTwo text-robo-primaryThree uppercase',
        'w-1/2 py-[9px] bg-robo-primaryThree text-robo-primaryTwo uppercase'
    ]

    return (
        <div className="flex flex-row text-center text-sm md:text-xl uppercase sm:mt-[79px] xs:mt-[72px] xxs:mt-[70px] tracking-[2px] mb-[31px] sm:mb-[31px] xs:mb-[26px] xxs:mb-[24px] 3xs:mb-[22px] font-futura">
            {/* active */}
            <Link 
                className  = {pathname === '/signup' ? classNames[0] : classNames[1]}
                aria-label = "Sign up"
                aria-live  = "off"
                to         = "/signup"
                tabIndex   = {0}
                role       = "button"
            > 
                sign up
            </Link>
            <Link
                className  = {pathname === '/signin' ? classNames[0] : classNames[1]}
                aria-label = "Login"
                aria-live  = "off"
                tabIndex   = {0}
                role       = "button"
                to         = "/signin"
            > 
                login 
            </Link>
        </div>  
    )
}

export default AuthHeader

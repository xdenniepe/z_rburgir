import React from 'react'
import { Transition } from '@headlessui/react'
import { IMAGES } from '../../utilities/constants'
import { Link } from 'react-router-dom'

const LandingPage = ({ renderSr }) => {
    return ( 
        <Transition.Root
            as        = "div"
            appear    = "false"
            className = "w-full h-screen bg-robo-primaryOne overflow-x-hidden"
            show      = {true} 
            enter     = "ease-in duration-500"
            enterFrom = "opacity-0"
            enterTo   = "opacity-100"
            leave     = "ease-in duration-500"
            leaveFrom = "opacity-100"
            leaveto   = "opacity-0"   
        >
            {renderSr()}
            <div className="w-full h-screen flex flex-col items-center justify-center lg:gap-10 md:gap-8 sm:gap-[31px] xs:gap-[26px] xxs:gap-[24px]">
               
                <div className="text-robo-primaryTwo text-center md:mb-7 md:text-3xl sm:text-lg xs:text-lg xxs:text-lg xs:mt-18" tabIndex={0} aria-label="Hello Human, Welcome to RoboBurger Fam!" role="text">
                    <p className="my-1" aria-hidden={true}> Hello Human, </p>
                    <p aria-hidden={true}> Welcome to RoboBurger Fam! </p> 
                </div>

                <div className="sm:py-3 xs:py-2 xxs:py-1">
                    <img src={IMAGES.ROBOHOME} className="xl:mx-auto xl:w-9/12 lg:px-72 md:px-40 sm:px-[74px] xs:px-16 xxs:px-12" aria-label="RoboBurger Logo" role="img" tabIndex={0}/>
                </div>

                <div className="w-full lg:md:px-72 md:px-44 sm:px-[72px] xs:px-16 xxs:px-[60px] md:mt-5 grid grid-cols gap-5 sm:gap-5 xs:gap-[18px] xxs:gap-[16px]">
                    <Link
                        to         = "/signup"
                        className  = "flex justify-center items-center xl:w-[500px] xl:mx-auto bg-robo-primaryTwo tracking-wide button-default text-robo-primaryThree"
                        aria-label = "Sign up button"
                        tabIndex   = {0}
                        role       = "link"
                    >
                        Sign up
                    </Link>

                    <Link
                        to         = "/signin"
                        className  = "flex justify-center items-center xl:w-[500px] xl:mx-auto text-robo-primaryTwo bg-robo-primaryThree button-default tracking-wide"
                        aria-label = "Login button"
                        tabIndex   = {0}
                        role       = "link"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </Transition.Root>
    )
}

export default LandingPage
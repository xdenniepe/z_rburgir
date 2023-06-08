import React from 'react'
import { Link } from 'react-router-dom'
import { BackButton } from '../../../../Common'
import { getLocalStorageItem } from '../../../../../utilities/helpers'

const HeaderContent = (props) => {
    const { to, title } = props
    const guestLogin    = getLocalStorageItem('guestLogin')

    const headerClasses = 'w-full h-fit text-center text-2xl md:text-3xl font-semibold capitalize text-robo-currency'

    if(guestLogin === 'guest') {
        return ( 
            <div className="flex relative flex-col w-full items-start justify-start pt-4 bg-robo-primary">
                <div className="flex relative flex-row items-center w-full pb-4 px-6.5 border-b border-gray-500 border-opacity-10 z-20 xxs:px-2">
                    <div>
                        <BackButton classes={`${to ? '' : 'hidden'}`} to={to} /> 
                    </div>
                </div>
            
                { (!title) && <Link to="/" /> /*insert RoboBurger Logo inside Link*/ }

                <div className={`w-full absolute z-20`}>
                    <div className={`${headerClasses}`} aria-hidden={true}>
                        <div className="items-end absolute top-0 right-7 links text-sm text-gray-500 pt-1">
                            <Link to={'/signin'} role="link" aria-label="Sign In"> Sign In |  </Link> 
                            <Link to={'/signup'} role="link" aria-label="Sign Up"> Sign Up  </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="flex relative flex-col w-full items-start justify-start pt-4 bg-robo-primary">
                <div className="flex relative flex-row items-center w-full pb-4 px-6.5 border-b border-gray-500 border-opacity-10 z-20 xxs:px-2">
                    <div className="h-7 w-7">
                        <BackButton classes={`${to ? '' : 'hidden'}`} to={to} /> 
                    </div>
                </div>
            
                { (!title) && <Link to="/" /> /*insert RoboBurger Logo inside Link*/ }
            </div>
        )
    }
}

export default HeaderContent
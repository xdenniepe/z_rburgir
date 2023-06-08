import React from 'react'
import { BackButton } from '../../Common'
import { Link } from 'react-router-dom'

const HeaderContent = (props) => {
    const { to, title } = props
    const headerClasses = 'w-full h-fit text-center text-lg md:text-xl font-futura-bold text-robo-currency'

    return (
        <div className="flex relative flex-col w-full items-start justify-start pt-4 bg-robo-primary">
            <div className="w-full pb-4 px-6.5 border-b border-gray-500 border-opacity-10 z-20 xxs:px-2">
                <div className="h-7 w-7">
                    <BackButton classes={`${to ? '' : 'hidden'}`} to={to} /> 
                </div>
            </div>
        
            {(!title) && <Link to="/" /> /*insert RoboBurger Logo inside Link*/ }

            <div className="w-full absolute z-10">
                <div className={`${headerClasses} xxs:text-sm xxs:text-xxs`} aria-hidden={true}>
                    {title}
                </div>
            </div>
        </div>
    )
}

const MenuLayout = (props) => {
    const { children, to, title } = props

    return (
        <div>
            <div className="w-full h-full mx-auto">
                <div className="flex flex-col w-screen justify-start drop-shadow-red-900">
                    <div className="fixed w-full top-0 z-10">
                        <HeaderContent to={to} title={title} />
                    </div>
                </div>
                <div className="flex flex-col h-fit w-full justify-between items-center py-6 px-4 sm:px-6 bg-robo-primary mt-10">
                    {children}
                </div>
            </div>
        </div>
    )
}


export default MenuLayout

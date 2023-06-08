import React, { Fragment, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuthCtx, useLocationCtx } from '../../../../../hooks'
import { Dialog, Transition } from '@headlessui/react'
import { Accessibility, ChevronLeft, ContactUs, GrayChevronRight, LogOut, Privacy, Terms, PurchaseHistory, Eula } from '../../../../../utilities/icons'
import { className } from '../../../../../utilities/helpers'

const navigation = [
    {
        current   : false,
        icon      : PurchaseHistory,
        name      : 'Purchase History',
        path      : '/purchasehistory',
        ariaLabel : 'Receipt Icon'
    },
    {
        current   : false,
        icon      : ContactUs,
        name      : 'Contact Us',
        path      : '/contact',
        ariaLabel : 'Phone Icon'
    },
    {
        current   : false,
        icon      : Terms,
        name      : 'Terms & Conditions',
        path      : '/termsandconditions',
        ariaLabel : 'Book Icon'
    },
    {
        current   : false,
        icon      : Privacy,
        name      : 'Privacy',
        path      : '/privacypolicy',
        ariaLabel : 'Lock Icon'
    },
    {
        current   : false,
        icon      : Accessibility,
        name      : 'Accessibility',
        path      : '/accessibility',
        ariaLabel : 'Page Icon'
    },  {
        current   : false,
        icon      : Eula,
        name      : 'End User License Agreement',
        path      : '/enduserlicenseagreement',
        ariaLabel : 'EULA'
    }
]

const SideBar = ({ setHasLoaded, setSidebarOpen, sidebarOpen, loginType }) => {
    const { state, logoutUser } = useAuthCtx()
    const { resetLocationStates } = useLocationCtx()

    const sideBarRef = useRef(false)
    const location   = useLocation()
    const navigate   = useNavigate()
    const { user }   = state

    let itemNameHolder = ''

    const sideBarOnLoad = () => {
        if(sideBarRef && sideBarRef.current){
            sideBarRef.current.focus()
        }
    }

    const handleLogout = () => {
        const cleanse = () => setTimeout(() => {
            setSidebarOpen(false)
            resetLocationStates()
            logoutUser(navigate)
        }, 250)
           
        cleanse()
    }

    const editProfile = () => {
        setSidebarOpen(false)
    }


    return (
        <Transition show={sidebarOpen}>
            <Dialog 
                className       = "fixed inset-0 overflow-hidden z-[51]" 
                aria-labelledby = "utils"
                aria-describedby= "utils"
                role            = "alertdialog"
                aria-label      = "Utilities"
                onClose         = {() => {setSidebarOpen(false)}}
            >
                <p className="sr-only" id="utils" role="text" aria-label="Utilities" tabIndex={0}>Utilities</p>
                <div className="absolute inset-0 overflow-hidden">
                    <Transition.Child
                        as        = {Fragment}
                        enter     = "ease-in-out duration-500"
                        enterFrom = "opacity-0"
                        enterTo   = "opacity-100"
                        leave     = "ease-in-out duration-500"
                        leaveFrom = "opacity-100"
                        leaveTo   = "opacity-0"
                    >
                        <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex w-full">
                        <Transition.Child
                            as        = {Fragment}
                            enter     = "transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom = "translate-x-full"
                            enterTo   = "translate-x-0"
                            leave     = "transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom = "translate-x-0"
                            leaveTo   = "translate-x-full"
                        >
                        <div className="pointer-events-auto relative w-screen">
                            <Transition.Child
                                as        = {Fragment}
                                enter     = "ease-in-out duration-500"
                                enterFrom = "opacity-0"
                                enterTo   = "opacity-100"
                                leave     = "ease-in-out duration-500"
                                leaveFrom = "opacity-100"
                                leaveTo   = "opacity-0"
                            >
                                <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4" />
                            </Transition.Child>
                            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                <div className="w-full py-4 px-6.5 border-b border-gray-500 border-opacity-20">
                                    <div className="h-7 w-7">
                                        <button 
                                            onClick    = {() => {
                                                setSidebarOpen(false) 
                                                setHasLoaded(true)         
                                            }} 
                                            onLoad     = {sideBarOnLoad} 
                                            ref        = {sideBarRef} 
                                            aria-label = "Back Icon - Close Sidebar"
                                            tabIndex   = {0}
                                        >
                                            <ChevronLeft className="h-full w-full" />
                                        </button>
                                    </div>
                                </div>
                                <div className="px-3 h-full flex flex-col py-10">
                                    <div className="flex flex-row pl-3 tracking-wide" >
                                        <div className="pl-3">
                                            <div>
                                                { ((user.firstName === null || user.lastName === null) || (user.firstName === '' || user.lastName === ''))  ?
                                                    <h1 className="pl-1 font-futura-medium font-semibold text-2xl md:text-3xl text-robo-currency tracking-[2px] uppercase" aria-label="Hello, Human" tabIndex={0}>
                                                       Hello, Human!
                                                   </h1>
                                                    :
                                                    <h1 className="pl-1 font-futura-medium font-semibold text-2xl md:text-3xl text-robo-currency tracking-[2px] uppercase" aria-label={user.firstName + user.lastName} tabIndex={0}>
                                                        {`${user.firstName} ${user.lastName}`}
                                                    </h1>
                                                }
                                                <div className="ml-1"> 
                                                    {
                                                        !loginType 
                                                            &&  <>
                                                                    <p className={'text-ellipsis text-robo-primaryTwo text-base opacity-[0.87] font-light md:text-xl'} aria-label={user.email ? user.email : user.phoneNumber} tabIndex={0}> {user.email ? user.email : user.phoneNumber} </p>
                                                                    <Link 
                                                                        to         = "/settings"
                                                                        className  = "text-robo-primaryTwo md:text-xl font-light underline opacity-[0.87]"
                                                                        aria-label = "Edit Profile"
                                                                        onClick    = {editProfile}
                                                                    >
                                                                        Edit Profile
                                                                    </Link>
                                                                </>
                                                    }
                                                </div>
                                            </div>   
                                        </div>
                                    </div>
                                    <div className="relative sm:mt-12 xs:mt-10 xxs:mt-10 flex-1 px-4">
                                        <nav className="px-2 flex flex-col gap-4 sm:gap-4 xs:gap-4 xxs:gap-2" tabIndex={0} aria-label="Utility Navigation">
                                            {
                                                navigation.map((item, index) => (
                                                        <div className="flex flex-row items-center" key={index}>
                                                            
                                                            <button
                                                                key       = {item.name}
                                                                className = {
                                                                    `font-sans text-base w-full group flex items-center py-2 font-normal rounded-md opacity-[0.87]
                                                                    ${className(
                                                                        item.current 
                                                                            ?   'bg-robo-total text-robo-currency'
                                                                            :   'bg-robo-primary text-gray-600 hover:bg-robo-total hover:text-gray-900',
                                                                    )}`
                                                                }
                                                                onClick    = {() => {
                                                                    if (item.path === '/settings') {
                                                                        navigate(item.path)
                                                                    } else if (item.path === '/termsandconditions') {
                                                                        window.open( 'https://app.termly.io/document/terms-of-use-for-online-marketplace/7dbfd379-d7f6-4a1f-b173-7ae072d9543f')
                                                                    } else if (item.path === '/privacypolicy') {
                                                                        window.open( 'https://app.termly.io/document/privacy-policy/b8016a2e-570b-4a4b-8ffa-dbae0894ae6a')
                                                                    } else if (item.path === '/enduserlicenseagreement') {
                                                                        window.open( 'https://app.termly.io/document/eula/c021721e-7144-4354-a07d-bed88f3c06e0')
                                                                    } else {
                                                                        setSidebarOpen(false)
                                                                        navigate(item.path)
                                                                    }
                                                                }}
                                                                disabled = {location?.pathname === '/settings' && item.name === 'Account Settings'  ? [true, itemNameHolder === " Disabled"] : false}
                                                                role     = "link"
                                                                tabIndex ={0}
                                                            >
                                                                <item.icon 
                                                                    className   = "md:h-6 md:w-8 sm:h-5 sm:w-7 xs:h-4 xs:w-6 xxs:h-4 xxs:w-6 pl-1"
                                                                    fill        = "#c0b9af"
                                                                    role        = "text"
                                                                />
                                                                <span className="text-robo-primaryTwo md:text-xl sm:text-lg xs:text-base xxs:text-base text-left font-futura tracking-[0.54px] w-full pl-[12.26px] pt-[1px]" role="text" aria-label={`${item.ariaLabel} - ${item.name} -`}>
                                                                    {item.name}
                                                                </span>
                                                                
                                                                <div className="float-right">
                                                                    {
                                                                        (item.name !== 'Notifications')
                                                                            ?   <GrayChevronRight
                                                                                    className  = "md:h-4 md:w-4 sm:h-4 sm:w-4 xs:h-4 xs:w-4 xxs:h-2 xxs:w-2 cursor-pointer"
                                                                                    aria-label = "Right Arrow Icon"
                                                                                    role       = "text"
                                                                                    fill       = "#8D8D8D"
                                                                                />
                                                                            :   <div className="pr-2">
                                                                                    <div className="flex justify-center items-center bg-[#FF0404] h-5 w-5 rounded-full text-white text-[13px]">
                                                                                        <p>1</p>
                                                                                    </div>
                                                                                </div>
                                                                    }
                                                                </div>
                                                            </button>
                                                        </div>
                                                ))
                                            }
                                        </nav>
                                    </div>

                                    <button 
                                        onClick    = {() => handleLogout()} 
                                        className  = "bottom-0 cursor-pointer text-base hover:text-robo-primaryTwo w-full group flex items-center font-normal mb-0 pl-1 xs:mt-[40px] xxs:mt-[36px] xs:pb-7 xxs:pb-7"
                                        aria-label = "Exit Icon - Logout"
                                    >
                                        <LogOut 
                                            aria-hidden = "false"
                                            className   = "ml-7 group-hover:text-robo-primaryTwo hover:bg-gray-50 bg-robo-primary mr-3 flex-shrink-0 h-7 w-7 sm:h-7 sm:w-7 xs:h-6 xs:w-6 xxs:h-6 xxs:w-6 rounded-lg text-robo-primaryTwo"
                                        />
                                        <span className="font-futura mr-auto text-robo-primaryTwo text-robo-primaryTwo text-lg md:text-xl sm:text-base xs:text-base xxs:text-base font-light pl-1 opacity=[0.87]"> Logout </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default SideBar

import React, { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { Button } from '..'

const Toaster = (props) => { 
    /**
     * show          = Boolean
     * setShow       = Function
     * icon          = Component
     * content       = String
     * title         = String
     * dismiss       = Boolean
     * confirmLabel  = String
     * handleConfirm = Function
     */
	const { show, setShow, icon, content, title, dismiss, confirmLabel, handleConfirm, classes, position } = props

    const [trigger, setTrigger]= useState(false)

    let delayDebounce

	const handleClick = () => {
        setShow(false)
		setTrigger(!trigger)
	}

    const handleClickConfirm = () => {
        setShow(false)
        setTrigger(!trigger)
        handleConfirm()
    }

    useEffect(() => {
        delayDebounce = setTimeout(() => {
            setShow(false)
        }, 3000)

        return () => {
            delayDebounce && clearTimeout(delayDebounce)
        }
    }, [show])

	return (
        <div className={`z-40 w-full px-[15px] fixed flex justify-center ${position ? position : 'top-0'} ${classes}`}>
            <div className="w-full flex items-end pointer-events-none sm:items-end">
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    <Transition
                        show      = {show}
                        as        = {Fragment}
                        enter     = "transform ease-out duration-300 transition"
                        enterFrom = "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo   = "translate-y-0 opacity-100 sm:translate-x-0"
                        leave     = "transition ease-in duration-200"
                        leaveFrom = "opacity-100"
                        leaveTo   = "opacity-0"
                    >
                        <div className="w-full bg-black shadow-xl border border-black pointer-events-auto overflow-hidden" aria-live="assertive" aria-atomic="true">
                            <div className="p-3">
                                <div className="flex items-start">
                                    {/* <div className="flex-shrink-0 mt-0.5">
                                        {icon}
                                    </div> */}
                                    <div className="w-full flex flex-col gap-1">
                                        <p 
                                            className = "text-base tracking-tight text-white text-center text-[15px] xs:text-[12px] xss:[11px]" 
                                            tabIndex  = {0} 
                                            role      = "alertdialog"
                                        > 
                                            {title}
                                        </p>
                                        <p className="text-sm text-menuprimary text-center" > {content} </p>

                                        {
                                            confirmLabel || dismiss 
                                                &&  <div className="mt-2 flex space-x-7">
                                                        <Button
                                                            type      = "button"
                                                            hidden    = {!confirmLabel}
                                                            onClick   = {handleClickConfirm}
                                                            className = "bg-white rounded-md text-sm font-futura-bold text-emphasis"
                                                            label     = {confirmLabel}
                                                        />
                                                        <Button
                                                            type      = "button"
                                                            hidden    = {!dismiss}
                                                            onClick   = {handleClick}
                                                            className = "bg-white rounded-md text-sm font-futura-bold text-menuprimary"
                                                            label     = "Dismiss"
                                                        />
                                                    </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
	)
}

export default Toaster
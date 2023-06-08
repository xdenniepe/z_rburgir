import React, { Fragment, useState, useEffect } from 'react'
import { Toaster } from '../../Common'
import { CheckCircle, Exclamation, Clipboard } from '../../../utilities/icons'

const Base = (props) => {
    const { main: Component, layout, refs, setHasLoaded, sidebarOpen, setSidebarOpen, srTitle } = props

    const [isModalOpen, setIsModalOpen]     = useState(false)
    const [isToasterOpen, setIsToasterOpen] = useState(false)
    const [toasterProp, setToasterProp]     = useState({})

    /**
     * 
     * @param {string}    toastType  // Copy, Error, Success
     * @param {string}    toastTitle 
     * @param {string}    toastContent 
     * @param {component} toastIcon 
     * @param {boolean}   dismiss 
     * @param {string}    confirmLabel 
     * @param {function}  handleConfirm 
     */

    const showToast = (toastType, toastTitle, position, toastContent, toastIcon, dismiss, confirmLabel, handleConfirm) => {
        let tIcon 

        switch (toastType) {
            case 'Copy': 
                tIcon = <Clipboard className="alert-icon-success" aria-hidden="true" />
                break
            case 'Error': 
                tIcon = <Exclamation className="alert-icon-error" aria-hidden="true" />
                break
            case 'Success': 
                tIcon = <CheckCircle className="alert-icon-success" aria-hidden="true" />
                break
            default: 
                tIcon = toastIcon ? toastIcon : <></>
                break
        }

        setIsToasterOpen(true)

        setToasterProp({
            title  : toastTitle,
            content: toastContent,
            icon   : tIcon,
            dismiss,
            confirmLabel,
            handleConfirm,
            position
        })
    }

    const renderSr = () => (
        <span className="sr-only top-0 absolute" role="text" ref={refs} tabIndex={0} aria-label={`${srTitle ? srTitle : ""}`}>{srTitle ? srTitle : ""}</span>
    )

    useEffect(() => {
        const renderSrRef = refs.current

        if (renderSrRef) {
            renderSrRef.focus()
        }
    }, [refs.current])

    return (
        <Fragment>
            <Component 
                isModalOpen    = {isModalOpen}
                refs           = {refs}
                renderSr       = {renderSr} 
                setHasLoaded   = {setHasLoaded}
                setIsModalOpen = {setIsModalOpen} 
                setSidebarOpen = {setSidebarOpen}
                sidebarOpen    = {sidebarOpen}
                toast          = {showToast}    
            />
            <Toaster
                show    = {isToasterOpen}
                setShow = {setIsToasterOpen}
                classes = {
                     'mt-10 px-6' 
                }
                {...toasterProp}
            />
        </Fragment>
    )
}

export default Base
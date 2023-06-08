import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocationCtx, useOrderCtx } from '../../../../../hooks'
import Modal from './components/Modal'

const LocationSwitcher = ({ buttonLabel }) => {
    const { dispatch, setSelectedVendingMachine } = useLocationCtx()
    const { totalItems }                          = useOrderCtx().state
    const [isModalOpen, setIsModalOpen]           = useState(false)

    const navigate = useNavigate()

    const handleClick = () => {
        if (buttonLabel === 'Change' && totalItems) {
            setIsModalOpen(true) 
        } else {
            setSelectedVendingMachine(dispatch, {})
            navigate('/locations')
        }
    }

    return (
        <>
            <button 
                aria-label = {` ${buttonLabel === 'Change' ? 'Change button - Click to change your location' : 'Select button - Click to select your location'} `}
                className  = "px-4 bg-white z-1"
                onClick    = {() => handleClick()}
                tabIndex   = {0}
                type       = "button"
            >
                <span className="leading-[19px] font-futura-bold text-[14px] tracking-wider text-robo-currency underline"> {buttonLabel} </span>
            </button> 
            
            <Modal 
                isModalOpen    = {isModalOpen}
                setIsModalOpen = {setIsModalOpen}
            />
        </>
    )
}

export default LocationSwitcher

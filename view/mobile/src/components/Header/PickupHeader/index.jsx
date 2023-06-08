import React from 'react'
import { useLocation } from 'react-router-dom'

const PickupHeader = () => {
    const { pathname } = useLocation()

    return (
        <div className={`table-cell align-middle w-screen h-[52px] bg-[#A6252A] z-[2] ${pathname !== '/order' ? '-ml-4 relative' : ''}`}>
            <h1 
                aria-label = "Pick up header" 
                className  = {`text-robo-primaryFour text-lg tracking-widest text-center font-futura`} 
                tabIndex   = {0}
            > 
                PICKUP 
            </h1>
        </div>
    )
} 

export default PickupHeader
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocationCtx, useOrderCtx } from '../../../../../hooks'
import { Link } from 'react-router-dom'

const LocationInfo = ({ vm, index, setIsOpenModal, setVendingMachine }) => {
    const { state,  selectVendingMachine }      = useLocationCtx()
    const { totalItems, invoices }              = useOrderCtx().state
    const { locationViewMode, vendingMachines } = state
    const { location, openingHours }            = vm

    const address   = `${vm.address}, ${vm.city}, ${vm.state}`
    const distance  = vm.distance.toFixed(2)
    const isList    = locationViewMode === 'list'
    const buttonRef = useRef(null)

    const navigate  = useNavigate()

    const getButtonClassName = isList => {
        return isList 
            ?   'w-full justify-between'
            :   'w-11/12 h-fit'
    }

    const getContainerClassName = isList => {
        const common = 'flex flex-col bg-white space-y-2 py-[21px] xs:py-[16px] xxs:py-3.5 px-[22px] xs:px-[18px] xxs:px-4 md:h-[121px]'

        return isList
            ?   `${common} relative md:text-base sm:text-sm xs:text-xs xxs:text-xxs w-full items-start justify-between`
            :   `${common} snap-center text-[14px] xxs:text-[12px] xs:text-[13px]`
    }

    const handleClick = vm => {
        if (totalItems > 0 && (vm.vendingMachineId !== invoices[0]?.vendingMachineId)) {
            setVendingMachine(vm)
            setIsOpenModal(true)
        } else {
            selectVendingMachine(vm)
            navigate('/products')
        }
    }

    const buttonClassName    = getButtonClassName(isList)
    const containerClassName = getContainerClassName(isList)

    return (
        <Link
            className = {`${buttonClassName} tracking-tight`} 
            ref       = {buttonRef} 
            tabIndex  = {0} 
            type      = "button" 
            onClick   = {() => handleClick(vm)}
            aria-label= {`Location: ${location} - Address:  ${address} - Open: ${openingHours.replace("-", "to")} - Distance: ${parseFloat(distance).toFixed(2)} miles - Click to use this location`}
        >
            <div className={containerClassName} aria-hidden={true}>
                <div className={`space-y-2 text-start ${isList ? 'w-full' : 'w-screen'}`}>
                    <p className="text-robo-primarySeven font-futura-bold" > 
                        {location} 
                    </p>

                    <p className="text-robo-primaryTwo"> 
                        {address} 
                    </p>
                </div>

                <div className={`flex flex-row justify-between text-[#000000] ${isList ? 'w-full' : '-mt-1'}`}>
                    <p> 
                        Open: {openingHours} 
                    </p> 

                    <p> 
                        {distance} mi 
                    </p> 
                </div>

                {
                    isList && !(index === vendingMachines.length - 1)   ?   (
                        <div className="absolute left-0 bottom-0 w-full px-[22px] xs:px-[18px] xxs:px-4">
                            <div className="h-[1px] w-full bg-black opacity-[0.18]" />
                        </div>
                    )   :   null
                }
            </div>
        </Link>
    )
}

export default LocationInfo

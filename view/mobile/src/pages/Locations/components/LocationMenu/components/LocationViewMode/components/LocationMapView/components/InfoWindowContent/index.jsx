import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocationCtx, useOrderCtx } from '../../../../../../../../../../hooks'

const InfoWindowContent = ({ vm, setIsOpenModal, setVendingMachine }) => {
    const { selectVendingMachine } = useLocationCtx()
    const { totalItems, invoices } = useOrderCtx().state
    const { location }             = vm

    const address  = `${vm.address}, ${vm.city}, ${vm.state}`
    const distance = vm.distance.toFixed(2)
    
    const navigate = useNavigate()

    const handleClick = () => {
        if (totalItems && (vm.vendingMachineId !== invoices?.vendingMachineId)) {
            setVendingMachine(vm)
            setIsOpenModal(true)
        } else {
            selectVendingMachine(vm)
            navigate('/products')
        }
    }

    return (
        <div className="flex flex-col gap-2 w-full text-sm font-futura">
            <span aria-label={location} className="text-start text-robo-primarySeven font-futura-bold" disabled> {location} </span> 
            
            <span aria-label={address}  className="text-start text-robo-primaryTwo" disabled> {address} </span> 
            
            <span aria-label={`Open: ${vm.openingHours}`} className="flex flex-row justify-between w-full text-[#000000]"> 
                <p> Open: {vm.openingHours} </p>

                <p> {distance} mi </p>
            </span>

            <button aria-label="view this menu" className="text-start underline w-fit" onClick={() => handleClick()}> 
                View Menu 
            </button>
        </div>        
    )
}

export default InfoWindowContent

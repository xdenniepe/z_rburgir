import React from 'react'
import { useLocationCtx } from '../../../../../../../../../../hooks'
import LocationInfo from '../../../../../../../Common/LocationInfo'

const Carousel = ({ setVendingMachine, setIsOpenModal }) => {
    const { vendingMachines } = useLocationCtx().state

    return (
        <div className="bg-transparent w-full h-full flex flex-row gap-[22px] xs:gap-[18px] xxs:gap-4 overflow-x-auto no-scrollbar mx-auto snap-proximity snap-x pl-4">
            {vendingMachines.map((vm, index) => 
                <LocationInfo 
                    vm                = {vm} 
                    index             = {index} 
                    key               = {vm.location} 
                    setVendingMachine = {setVendingMachine} 
                    setIsOpenModal    = {setIsOpenModal} 
                />
            )}    
        </div>
    ) 
}

export default Carousel
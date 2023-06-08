import React from 'react'
import { useLocationCtx } from '../../../../../../../../../../hooks'
import LocationInfo from '../../../../../../../Common/LocationInfo'

const LocationList = ({ setIsOpenModal, setVendingMachine }) => {
    const { vendingMachines } = useLocationCtx().state

    return (
        <div className="w-full h-full max-h-[68%] z-[1] mt-[100px] sm:mt-[100px] xs:mt-[95px] xxs:mt-[93px] xl:px-64">
            <div className="sm:h-[98%] xs:h-[80%] xxs:h-[58%] overflow-y-auto overflow-visible w-full">
                {
                    vendingMachines?.map((vm, index) => 
                        <LocationInfo 
                            vm                = {vm} 
                            index             = {index} 
                            key               = {vm.location} 
                            setIsOpenModal    = {setIsOpenModal} 
                            setVendingMachine = {setVendingMachine} 
                        />
                    )
                }       
            </div>
        </div>
    )
}


export default LocationList

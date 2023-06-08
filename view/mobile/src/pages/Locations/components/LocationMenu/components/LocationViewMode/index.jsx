import React, { useState } from 'react'
import LocationListView from './components/LocationListView'
import LocationMapView from './components/LocationMapView'
import CheckLocationModal from '../../../Common/CheckLocationModal'

const LocationViewMode = ({ isListView }) => {
    const [ isOpenModal, setIsOpenModal ]       = useState(false)
    const [ vendingMachine, setVendingMachine ] = useState({})

    return (
        <>
            { 
                isListView ? 
                    <LocationListView 
                        setIsOpenModal    = {setIsOpenModal}
                        setVendingMachine = {setVendingMachine}
                    /> 
                :
                    <LocationMapView 
                        setIsOpenModal    = {setIsOpenModal}
                        setVendingMachine = {setVendingMachine}
                    /> 
            }

            { 
                isOpenModal && 
                    <CheckLocationModal 
                        isModalOpen    = {isOpenModal} 
                        setIsModalOpen = {setIsOpenModal} 
                        vendingMachine = {vendingMachine}
                    /> 
            }
        </>
    )
}  

export default LocationViewMode
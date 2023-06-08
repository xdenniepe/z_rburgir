import React from 'react'
import { useLocationCtx } from '../../../../../../../../hooks'
import LocationFallback from '../../../../../Common/LocationFallback'
import LocationList from './components/LocationList'

const LocationListView = ({ setIsOpenModal, setVendingMachine }) => {
    const { hasOpeningHours, isLoading } = useLocationCtx()
    
    return !isLoading && hasOpeningHours
        ?   <LocationList setIsOpenModal={setIsOpenModal} setVendingMachine={setVendingMachine} />
        :   <LocationFallback />    
}

export default LocationListView
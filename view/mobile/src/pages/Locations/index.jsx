import React, { useRef } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import { useEffectOnce, useLocationCtx, useOrderCtx, useProductCtx, useUpdateEffect } from '../../hooks'
import { isEmptyArray, isEmptyObject } from '../../utilities/helpers'
import LocationMenu from './components/LocationMenu'
import PickupHeader from '../../components/Header/PickupHeader'

const Locations = ({ renderSr }) => {
    const { loaderCredentials, setUserLocation, setLocationViewMode, setVendingMachines } = useLocationCtx()
    const { locationViewMode, userLocation } = useLocationCtx().state
    const { setCurrentOrder }                = useOrderCtx().apis
    const { order }                          = useOrderCtx().state
    const { condiments, products,  }         = useProductCtx().state
    const { getCondiments, getProducts }     = useProductCtx().apis
    const { isLoaded }                       = useJsApiLoader(loaderCredentials)

    const isMounted = useRef(true)

    useEffectOnce(() => {
        if (isMounted.current && isEmptyObject(order)) {
            setCurrentOrder()
        }

        if (isMounted.current && isEmptyArray(products)) {
            getProducts()
        }

        if (isMounted.current && isEmptyArray(condiments)) {
            getCondiments()
        }

        if (isMounted.current && isEmptyObject(userLocation)) {
            setUserLocation()
        }
        
        if (isMounted.current && !locationViewMode) {
            setLocationViewMode('list')
        }

        return () => isMounted.current = false
    }) 

    useUpdateEffect(() => {
        if (!isEmptyObject(userLocation)) {
            setVendingMachines()
        }
    }, [userLocation])

    return (
        <div className="container-class relative bg-map-bg bg-cover bg-no-repeat pt-[23px] overflow-hidden">
            {renderSr()}

            <div className="absolute w-full h-full pt-4">
                <PickupHeader />

                {isLoaded ? <LocationMenu /> : null}
            </div>
        </div>
    )
}

export default Locations

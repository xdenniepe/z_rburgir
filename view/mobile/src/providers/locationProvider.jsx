import { useCallback, useEffect, useReducer, useState } from 'react'
import { useUpdateEffect } from '../hooks'
import { request } from '../services/request'
import { setLocalStorageItem } from '../utilities/helpers'
import { GET, LIBRARIES } from '../utilities/constants' 
import LocationContext from '../contexts/locationContext'
import LocationReducer, { initialState, initializer, RESET_LOCATION_STATES, SET_IS_LOCATION_ENABLED, SET_LOCATION_SEARCH_INPUT, SET_LOCATION_VIEW_MODE, SET_SELECTED_VENDING_MACHINE, SET_USER_LOCATION, SET_VENDING_MACHINES } from '../reducers/locationReducer'
import api from '../services/api'

const LocationProvider = ({ children }) => {
    const [state, dispatch]         = useReducer(LocationReducer, initialState, initializer)
    const [isLoading, setIsLoading] = useState(false)
    
    const { isLocationEnabled, locationSearchInput, locationViewMode, selectedVendingMachine, userLocation, vendingMachines, postalCode } = state

    const hasOpeningHours = vendingMachines.length && vendingMachines.every(vm => vm.openingHours !== '')
    
    const loaderCredentials = {
        id              : 'google-map-script', 
        googleMapsApiKey: import.meta.env.VITE_GMAP_API_KEY,
        libraries       : LIBRARIES
    }

    const mapOptions = {
        fullscreenControl: false,
        mapTypeControl   : false,
        streetViewControl: false,
        zoomControl      : false
    }

    const setFalse = useCallback(() => setIsLoading(false), [])

    const setTrue = useCallback(() => setIsLoading(true), [])
    
    const getUserLocation = useCallback(() => {
        return new Promise((resolve, reject) => {
            try {
                navigator.geolocation.getCurrentPosition(({ coords }) => {
                    const { latitude, longitude } = coords

                    resolve({ latitude, longitude })
                }, err => reject(new Error(err?.message || err)))
            } catch (err) {
                reject(new Error(err?.message || err))
            }    
        })
    }, [])

    const getVMLocations = () => {
        return request({
            url : api.LOCATIONS_BOUNDARY,
            method: GET,
            params: {
                lat: userLocation.latitude,
                lng: userLocation.longitude
            }
        })
    }

    const resetLocationStates = () => {
        dispatch({ type: RESET_LOCATION_STATES })
    }
    
    const selectVendingMachine = vm => {
        dispatch({
            type   : SET_SELECTED_VENDING_MACHINE,
            payload: {
                label      : vm.location + ', ' + vm.address + ', ' + vm.city + ', ' + vm.state,
                value      : vm.vendingMachineId,
                postalCode : vm.postalCode
            }
        })
    }

    const setIsLocationEnabled = payload => {
        const type = SET_IS_LOCATION_ENABLED

        dispatch({ type, payload })
    }

    const setLocationSearchInput = payload => {
        const type = SET_LOCATION_SEARCH_INPUT

        dispatch({ type, payload })
    }
    const setLocationViewMode = payload => {
        const type = SET_LOCATION_VIEW_MODE

        dispatch({ type, payload })
    }

    const setUserLocation = async (data = null) => {
        setTrue()
        
        try {
            const type    = SET_USER_LOCATION 
            const payload = data || await getUserLocation()

            if (isLocationEnabled === false) {
                setIsLocationEnabled(undefined)
            }      
    
            dispatch({ type, payload })
        } catch (err) {
            console.log(err?.message || err)

            setIsLocationEnabled(false)
        }

        setFalse()
    }

    const setSelectedVendingMachine = (dispatch, payload) => {
        const type = SET_SELECTED_VENDING_MACHINE

        dispatch({ type, payload })
    }

    const setVendingMachines = async () => {
        setTrue()

        const type = SET_VENDING_MACHINES
        let payload

        try {
            const getRes = await getVMLocations()
            payload      = getRes.data
            
            dispatch({ payload, type })           
        } catch (err) {
            console.error(err?.messagge || err)

            payload = []
            
            dispatch({ payload, type })   
        }

        setFalse()
    }

    const setVMOpeningHours = (vendingMachines, newPlaces) => {
        setTrue()

        const modifiedVendingMachines = vendingMachines.map(vm => {
            const { openingHours } = newPlaces.filter(place => place.location === vm.location)[0]
            
            return { ...vm, openingHours }
        })

        const type    = SET_VENDING_MACHINES
        const payload = modifiedVendingMachines

        dispatch({ type, payload })
        setFalse()
    }

    const providerValues = {
        hasOpeningHours,
        isLoading,
        loaderCredentials,
        mapOptions,
        state,
        dispatch,
        resetLocationStates,
        selectVendingMachine,
        setLocationSearchInput,
        setLocationViewMode,
        setSelectedVendingMachine,
        setUserLocation,
        setVendingMachines,
        setVMOpeningHours
    }

    useEffect(() => {
        setLocalStorageItem('isLocationEnabled', isLocationEnabled)
    }, [isLocationEnabled])

    useEffect(() => {
        setLocalStorageItem('locationSearchInput', locationSearchInput)
    }, [locationSearchInput])

    useEffect(() => {
        setLocalStorageItem('locationViewMode', locationViewMode)
    }, [locationViewMode])

    useEffect(() => {
        setLocalStorageItem('selectedVendingMachine', selectedVendingMachine)
    }, [selectedVendingMachine])

    useEffect(() => {
        setLocalStorageItem('vendingMachines', vendingMachines)
    }, [vendingMachines])

    useUpdateEffect(() => {
        setLocalStorageItem('userLocation', userLocation)
    }, [userLocation])

    useEffect(() => {
        setLocalStorageItem('postalCode', postalCode)
    }, [postalCode])

    return (
        <LocationContext.Provider value={providerValues}>
            {children}
        </LocationContext.Provider>
    )
}

export default LocationProvider
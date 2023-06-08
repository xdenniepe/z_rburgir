import { getLocalStorageItem } from '../utilities/helpers'

export const initialState = {
    isLocationEnabled     : undefined,
    locationSearchInput   : '',
    locationViewMode      : 'list',
    selectedVendingMachine: {},
    userLocation          : {},
    vendingMachines       : []
}

export const initializer = () => {
    return {
        isLocationEnabled     : getLocalStorageItem('isLocationEnabled'),
        locationSearchInput   : getLocalStorageItem('locationSearchInput') || '',
        locationViewMode      : getLocalStorageItem('locationViewMode') || 'list',
        selectedVendingMachine: getLocalStorageItem('selectedVendingMachine') || {},
        userLocation          : getLocalStorageItem('userLocation') || {},
        vendingMachines       : getLocalStorageItem('vendingMachines') || []
    }
}

export const RESET_LOCATION_STATES        = 'RESET_LOCATION_STATES' 
export const SET_IS_LOCATION_ENABLED      = 'SET_IS_LOCATION_ENABLED'
export const SET_LOCATION_SEARCH_INPUT    = 'SET_LOCATION_SEARCH_INPUT'
export const SET_LOCATION_VIEW_MODE       = 'SET_LOCATION_VIEW_MODE'
export const SET_SELECTED_VENDING_MACHINE = 'SET_SELECTED_VENDING_MACHINE'
export const SET_USER_LOCATION            = 'SET_USER_LOCATION'
export const SET_VENDING_MACHINES         = 'SET_VENDING_MACHINES'

const LocationReducer = (state, { payload, type }) => {
    switch (type) {
        case RESET_LOCATION_STATES:
            return {
                ...initialState
            }
        case SET_IS_LOCATION_ENABLED:
            return {
                ...state,
                isLocationEnabled: payload
            }
        case SET_LOCATION_SEARCH_INPUT:
            return {
                ...state,
                locationSearchInput: payload
            }
        case SET_LOCATION_VIEW_MODE:
            return {
                ...state,
                locationViewMode: payload
            }
        case SET_SELECTED_VENDING_MACHINE:
            return {
                ...state,
                selectedVendingMachine: payload
            }
        case SET_USER_LOCATION:
            return {
                ...state,
                userLocation: payload
            }
        case SET_VENDING_MACHINES:
            return {
                ...state,
                vendingMachines: payload
            }
        default: 
            throw new Error(`Unhandled action type: ${type}`)
    }
}

export default LocationReducer
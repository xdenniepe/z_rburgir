import { getLocalStorageItem } from "../utilities/helpers"

export const initialState = {
    products  : [],
    condiments: [],
    showModal : false,
}

export const initializer = () => {
    return {
        ...initialState,
        products  : getLocalStorageItem('products') || [],
        condiments: getLocalStorageItem('condiments') || []
    }
}

export const GET_PRODUCTS   = 'GET_PRODUCTS'
export const GET_CONDIMENTS = 'GET_CONDIMENTS'
export const HIDE_MODAL     = 'HIDE_MODAL'
export const SHOW_MODAL     = 'SHOW_MODAL'

const ProductReducer = (state, action) => {
    const { type, payload } = action 

    switch (type) {
        case GET_PRODUCTS:
            return {
                ...state,
                products: payload
            }
        case GET_CONDIMENTS:
            return {
                ...state,
                condiments: payload
            }
        case HIDE_MODAL:
            return {
                ...state,
                showModal: payload
            }
        default:
            throw new Error(`Unhandled action type:  ${type}`)
    }
}

export default ProductReducer
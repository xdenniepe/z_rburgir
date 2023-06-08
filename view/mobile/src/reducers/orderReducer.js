import { getLocalStorageItem } from '../utilities/helpers'

export const initialState = {
    couponInfo   : { coupon: '', discount: 0 },
    invoices     : [],
    isCartFull   : false,
    isLoading    : true,
    latestInvoice: {},
    order        : {},
    paymentInfo  : {},
    totalItems   : 0,
    transaction  : {}
}

export const initializer = () => {
    return {
        ...initialState,
        couponInfo   : getLocalStorageItem('couponInfo') || { coupon: '', discount: 0 },
        invoices     : getLocalStorageItem('invoices') || [],
        latestInvoice: getLocalStorageItem('latestInvoice') || {},
        order        : getLocalStorageItem('order') || {},
        paymentInfo  : getLocalStorageItem('paymentInfo') || {},
        totalItems   : getLocalStorageItem('totalItems') || 0,
        transaction  : getLocalStorageItem('transaction') || {}
    }
}

export const DELETE_INVOICES     = 'DELETE_INVOICES'
export const DELETE_ORDER        = 'DELETE_ORDER'
export const SET_COUPON_INFO     = 'SET_COUPON_INFO'
export const SET_INVOICES        = 'SET_INVOICES'
export const SET_LATEST_INVOICE  = 'SET_LATEST_INVOICE'
export const SET_PAYMENT_INFO    = 'SET_PAYMENT_INFO'
export const SET_ORDER           = 'SET_ORDER'
export const SET_TOTAL_ITEMS     = 'SET_TOTAL_ITEMS'
export const SET_TRANSACTION     = 'SET_TRANSACTION'
export const TOGGLE_IS_CART_FULL = 'TOGGLE_IS_CART_FULL'

const OrderReducer = (state, action) => {
    const { payload, type } = action

    switch (type) {
        case DELETE_INVOICES:
            return {
                ...state,
                invoices: []
            }
        case DELETE_ORDER:
            return {
                ...state,
                order: {}
            }
        case SET_COUPON_INFO:
            return {
                ...state,
                couponInfo: payload
            }
        case SET_INVOICES:
            return {
                ...state,
                invoices: payload,    
                isLoading: action.isLoading      
            }
        case SET_ORDER:
            return {
                ...state,
                order: payload
            }
        case SET_LATEST_INVOICE:
            return {
                ...state,
                latestInvoice: payload
            }
        case SET_PAYMENT_INFO:
            return {
                ...state,
                paymentInfo: payload
            }
        case SET_TOTAL_ITEMS:
            return {
                ...state,
                totalItems: payload
            }
        case SET_TRANSACTION:
            return {
                ...state,
                transaction: payload
            }
        case TOGGLE_IS_CART_FULL:
            return {
                ...state,
                isCartFull: payload,
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

export default OrderReducer
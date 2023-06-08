import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthCtx, useOrderCtx } from '../hooks'
import { request } from '../services/request'
import { setLocalStorageItem } from '../utilities/helpers'
import { POST, GET } from '../utilities/constants'
import PaymentContext from '../contexts/paymentContext'
import api from '../services/api'

const PaymentProvider = ({ children }) => {
    const { user }     = useAuthCtx().state
    const { addOrder } = useOrderCtx().apis
    
    const [isPaymentMade, setIsPaymentMade] = useState(false)
    
    const navigate = useNavigate()

    const paymentTransaction = payload => {
        request({
            url   : `${api.ORDERS_SEARCH}/findByUserId`,
            method: GET,
            params: {
                userId    : user.userId,
                projection: 'withId',
            }
        }).then(response => {
            const { data } = response

            setLocalStorageItem('lastOrder', data.orderId)

            request({
                url   : api.CHECKOUT,
                method: POST,
                data  : {
                    orderId      : data.orderId,
                    paymentMethod: payload?.nonce,
                    couponCode   : payload?.coupon !== '' ? payload.coupon : '',
                }
            })
            .then(() => {
                setIsPaymentMade(true)
                setLocalStorageItem('invoiceSent', false)
            })
            .then(() => addOrder())
            .then(() => navigate('/scan'))
            .catch(err => {
                console.log(err?.message || err)
                alert(`Invalid Card Details`)
            })
        }).catch(err => console.log(err?.message || err))
    }

    const providerValues = {
        isPaymentMade, 
        paymentTransaction, 
        setIsPaymentMade
    }

    return (
        <PaymentContext.Provider value={providerValues}>
            { children }
        </PaymentContext.Provider>
    )
}


export default PaymentProvider
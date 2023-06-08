import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuthCtx, useOrderCtx, useUpdateEffect } from '../../hooks'
import { request } from '../../services/request'
import { getLocalStorageItem, getSumOfArray, isEmptyObject, setLocalStorageItem } from '../../utilities/helpers'
import { BackButton, LoadingState } from '../../components/Common'
import { GET } from '../../utilities/constants'
import EmptyCart from '../../components/EmptyState/EmptyCart'
import PickUpSteps from './components/PickUpSteps'
import QR from './components/QR'
import api from '../../services/api'

const Scan = ({ toast, setHasLoaded, renderSr }) => {
    const { sendReceipt, setCouponInfo, setLatestInvoice, setPaymentInfo, setTransaction } = useOrderCtx().apis
    const { latestInvoice, transaction } = useOrderCtx().state
    const { user } = useAuthCtx().state

    const [isLoading, setIsLoading] = useState(true)
    const [searchParam]             = useSearchParams()
    
    const isEmptyInvoice = isEmptyObject(latestInvoice)

    const getCoupon = (couponId, tempTotal)  => {
        request({
            url   : `${api.COUPONS}/findById?`,
            method: GET,
            params: { couponId }
        })
        .then(res => {
            const { data }       = res
            const { percentage } = data

            const computedPercentage = tempTotal * (percentage/100)
            const coupon             = `${percentage}% Discount`
            const discount           = computedPercentage.toFixed(2)

            setCouponInfo({ coupon, discount })
        })
        .catch(err => console.error(err?.message || err))
    }

    const getLatestInvoice = () => {
        const hasOrderId = searchParam.has('orderId') && searchParam.get('orderId') !== ''
        const apiParams  = hasOrderId ? { orderId : parseInt(searchParam.get('orderId')) } : { userId: user.userId }
        const apiUrl     = hasOrderId ? `${api.CART_ITEMS}/findByOrderId` : `${api.CART_ITEMS}/findLatestOrder`
        
        request({
            url   : apiUrl,
            method: GET,
            params: apiParams
        })
        .then(res => {
            const { data } = res

            if (data.length) {
                setLatestInvoice(data)
            }   
        })
        .catch(() => {
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        })
    }

    const getTransaction = latestInvoice => {
        request({
            url   : api.TRANSACTIONS_SEARCH,
            method: GET,
            params: {
                orderId: latestInvoice[0]?.orderId,
            }
        })
        .then(res => {
            const { data } = res
            const { payment, couponId } = data

            if (couponId) {
                const tempTotal = getSumOfArray(latestInvoice?.map(latestInvoice => latestInvoice.total), 2)
                getCoupon(couponId, tempTotal)
            } 
            
            setTransaction(data)
            setPaymentInfo(payment)  
            setIsLoading(false)
        })
        .catch(err => console.log('Payment Error! ' + err?.message || err))
    }
     
    const handleSendReceipt = async () => {
        try {
            const sendReceiptRes = await sendReceipt()

            const { status } = sendReceiptRes

            if (status === 200 && user?.email && user?.phoneNumber && user?.emailStatus === 'ACT' && user?.phoneNumberStatus === 'ACT' && user.subscription === 'ACT') {
                toast('Success', 'Receipt has been sent to your email and phone number')
            } else if (status === 200 && user?.email && user?.phoneNumber && user?.emailStatus === 'ACT' && user?.phoneNumberStatus === 'ACT' && user.subscription === 'INA') {
                toast('Success', 'Receipt has been sent to your phone number')
            } else if (status === 200 && !user?.email && user?.phoneNumberStatus === 'ACT') {
                toast('Success', 'Receipt has been sent to your phone number')
            } else if (status === 200 && !user?.phoneNumber &&  user?.emailStatus === 'ACT' && user.subscription === 'ACT') {
                toast('Success', 'Receipt has been sent to your email')
            } else if (status === 200 && !user?.phoneNumber &&  user?.emailStatus === 'ACT' && user.subscription === 'INA') {
                toast('Success', 'Thank you for your RoboBurger order')
            }

        } catch (err) {
            console.error(err?.message || err)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)

        setHasLoaded(true)
        getLatestInvoice()
    }, [])

    useUpdateEffect(() => {
        getTransaction(latestInvoice)
    }, [latestInvoice])

    useUpdateEffect(() => {
        if (!searchParam.get('orderId') && getLocalStorageItem('invoiceSent') === false) {
            handleSendReceipt()
            setLocalStorageItem('invoiceSent', true)
        }
    }, [transaction])

    return (
        <div className={`relative ${isEmptyInvoice && !isLoading ? 'bg-white' : 'bg-[#EDE8E4]' } h-screen w-full flex flex-col overflow-x-hidden`}>
            {renderSr()}

            <div className={`absolute top-0 w-full ${isEmptyInvoice && !isLoading ? 'bg-white' : 'bg-[#EDE8E4]' }`}>
                <BackButton/>
            </div>
            
            {   
                !isEmptyObject(transaction) && !isLoading ?
                    <div className="h-screen w-full mt-16 flex flex-col overflow-x-hidden overflow-y-auto z-[1]">
                        <QR invoice={latestInvoice} transaction={transaction} />
                        <PickUpSteps />
                    </div>
                :   isLoading && <LoadingState />   
            }

            {isEmptyInvoice && !isLoading && <EmptyCart emptyPage="receipt" />}
        </div>
    )
}

export default Scan

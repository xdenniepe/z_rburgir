import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useOrderCtx } from '../../hooks'
import { useSearchParams } from 'react-router-dom'
import { getSumOfArray } from '../../utilities/helpers'
import { request } from '../../services/request'
import { GET } from '../../utilities/constants'
import BackButton from '../../components/Common/BackButton'
import OrderAgreement from './components/OrderAgreement'
import OrderSummary from './components/OrderSummary'
import PaymentProvider from '../../providers/paymentProvider'
import PaymentMethods from './components/PaymentMethods'
import api from '../../services/api'

const Payment = ({ renderSr }) => {
    const { invoices } = useOrderCtx().state
    const [coupon, setCoupon]                 = useState({})
    const [couponDiscount, setCouponDiscount] = useState('0.00 USD')
    const [tempTotal, setTempTotal]           = useState(parseFloat(0.00))
    const [searchParams]                      = useSearchParams()

    const couponRef = useRef(null)
    const total     = useMemo(() => getSumOfArray(invoices.map(invoice => invoice.total), 2), [invoices])
    const subtotal  = useMemo(() => getSumOfArray(invoices.map(invoice => invoice.subtotal), 2), [invoices])

    const tax = (total - subtotal).toFixed(2)

    const getCouponCode = () => {
        if (searchParams.get('promocode')) {
            request({
                url    : `${api.COUPONS}`,
                method : GET,
                params : {
                    code: searchParams.get('promocode')
                }
            }).then(response => {
                setCouponDiscount(response.data.discountPercentage)
                setCoupon(response.data)
            }).catch(error => {
                console.log(error)
            })
        }   
    }

    const getComputation = useCallback(() => {
        if (searchParams.get('promocode')) {
            const discountValue = (total * (coupon.discountPercentage/100)).toFixed(2)
            setTempTotal((total - discountValue).toFixed(2))
            setCouponDiscount(`-$${discountValue}`)
        } else {
            setTempTotal(total)
        }
    }, [coupon, total])

    useEffect(() => {
        getCouponCode()
    }, [invoices])

    useEffect(() => {
        getComputation()
    }, [coupon, total, tempTotal])

    return (
        <div className="relative h-full w-full bg-white px-[27px] overflow-y-auto overflow-x-hidden flex flex-col lg:px-64">
            { renderSr() }
            <BackButton title="CHECKOUT" />

            <OrderSummary 
                coupon         = {coupon}
                couponCode     = {coupon?.couponCode}
                couponDiscount = {couponDiscount}
                couponRef      = {couponRef}
                subtotal       = {subtotal} 
                tax            = {tax} 
                tempTotal      = {tempTotal}
                total          = {total}
            />

            <OrderAgreement />

            {
                tempTotal > 0 &&
                <PaymentProvider>
                    <PaymentMethods 
                        couponCode     = {coupon.couponCode} 
                        couponDiscount = {couponDiscount}
                        tempTotal      = {tempTotal} 
                        total          = {total} 
                    />
                </ PaymentProvider>
            }
        </div>
    )
}

export default Payment
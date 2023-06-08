import React from 'react'
import { usePaypal } from '../../../../hooks'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard } from '../../../../utilities/icons'
import ApplePayButton from './components/ApplePayButton'
import PaypalButton from './components/PaypalButton'

const PaymentMethods = ({ couponCode, couponDiscount, tempTotal, total }) => {
    const paypal       = usePaypal(couponCode, tempTotal)
    const canUserPay   =  paypal
    const checkoutPath = '/checkout?payment=credit-debit'

    const navigate = useNavigate()
    
    return(
        <div aria-label="Payment Methods" className="flex flex-col border border-robo-primaryTwo px-[9px] py-[38px] justify-center items-center relative gap-4 mt-[70px] mb-[140px]" tabIndex={0}>
            <p aria-label="Express Checkout" className="text-[18px] absolute -top-4 bg-white px-5 tracking-wide text-robo-primaryTwo" tabIndex={0}>
                Express Checkout
            </p>

            <Link
                aria-label = "Debit or Credit Card - Click to proceed checkout"
                className  = {`font-futura button inline-flex tracking-wide items-center w-full justify-center border border-transparent bg-[#2e2e2f] 
                               text-white px-4 py-2 text-base font-medium h-[50px] max-h-[50px] hover:border 
                               disabled:opacity-50 rounded-md ${canUserPay ? '' : 'hidden'}`}
                disabled = {!canUserPay}
                to = {
                    couponCode 
                        ?   (`${checkoutPath}&coupon=${couponCode}`)
                        :   (checkoutPath)
                }
                tabIndex = {0}
                type     = "button"
            >
                <CreditCard aria-hidden="true" className="h-[30px] w-[30px] -mt-[12px]" />
                &nbsp;Debit or Credit Card
            </Link>

            <PaypalButton
                paypal = {paypal}
            />

            <ApplePayButton 
                canUserPay     = {canUserPay}
                couponCode     = {couponCode}
                couponDiscount = {couponDiscount}
                tempTotal      = {tempTotal}
                total          = {total}
            />
                    
            {
                !canUserPay
                    ?   <div className="w-full h-[52px] drop-shadow-lg text-center tracking-wide"> Loading... </div>
                    :   null
            }
        </div>
    )
}

export default PaymentMethods
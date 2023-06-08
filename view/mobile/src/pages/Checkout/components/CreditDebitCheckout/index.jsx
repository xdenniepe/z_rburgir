import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { useSearchParams } from 'react-router-dom'
import { AMEXCVV, CVV, EXPIRATION_DATE, OTHERCARDS } from '../../../../utilities/constants'
import { creditCardSchema } from '../../../../validation/schema'
import { Button } from '../../../../components/Common'
import BraintreeDropIn from '../BraintreeDropIn'
import InputMasked from '../InputMasked'
import CardInput from '../CardInput'
import PaymentProvider from '../../../../providers/paymentProvider'

const CreditDebitCheckout = ({ setHasLoaded, renderSr, toast }) => {
    const [searchParams] = useSearchParams()
    const [coupon, setCoupon] = useState(null)
    const [isAmex, setIsAmex] = useState(false)
    const [isValidPayment, setIsValidPayment] = useState(false)

    const handleSubmit = () => {
        if (searchParams.get('coupon') !== null) {
            setCoupon(searchParams.get('coupon'))
        }
        
        setIsValidPayment(true)
    }

    const initialValues = {
        email            : '',
        ccName           : '',
        ccNumber         : '',
        ccExpirationDate : '',
        ccCVV            : ''
    }

    const formik = useFormik({
        initialValues,
        validationSchema: creditCardSchema,
        onSubmit        : handleSubmit,
    })

    useEffect(() => {
        let ccNum = formik.values.ccNumber

        if (ccNum.slice(0, 2) === '37' || ccNum.slice(0, 2) === '34') {
            setIsAmex(true)
        }

    }, [formik.values.ccNumber])

    useEffect(() => {
        localStorage.removeItem('payment')
        setHasLoaded(true)
    }, [])

    return (
        <div className="w-full h-full border-solid border-t border-[#707070] border-opacity-[0.11] ">
            <form className="lg:max-w-lg lg:container mx-auto px-[37.5px] xs:px-[35.5px] xxs:px-[35.5px] pt-[39.5px] pb-26 h-full sm:h-[92%] xs:h-[88%] xxs:h-[86%] w-full overflow-y-auto" onSubmit={formik.handleSubmit} >
                <p 
                    aria-label = "Secure Credit Card Payment header" 
                    className  = "text-md text-robo-primaryTwo" 
                    tabIndex   = {0}
                >
                    Secure Credit Card Payment
                </p>

                <div className="w-full h-fit space-y-[22px] sm:space-y-[33px] xs:space-y-[18px] xxs:space-y-[16px] 3xs:space-y-[14px]"> 
                    <CardInput 
                        formik      = {formik}
                        label       = "enter cardholder name"
                        placeholder = "Enter Cardholder Name"
                        name        = "ccName"
                    />
                
                    <InputMasked
                        altPlaceholder = ""
                        formik         = {formik}
                        label          = "enter card number"
                        mask           = {OTHERCARDS}
                        name           = "ccNumber"
                        placeholder    = "Card Number"
                    />
                
                    <InputMasked
                        altPlaceholder = "MM/YY" 
                        formik         = {formik}
                        label          = "Expiration Date"
                        mask           = {EXPIRATION_DATE}
                        name           = "ccExpirationDate"
                        placeholder    = "MM/YY"
                    />
                
                    <InputMasked
                        altPlaceholder = ""
                        formik         = {formik}
                        label          = "CVV"
                        mask           = {isAmex ? AMEXCVV : CVV}
                        name           = "ccCVV"
                        placeholder    = "CVV"
                    />
                </div>
                
                <Button 
                    className = "md:mt-[32px] sm:mt-[32px] xs:mt-[26px] xxs:mt-[24px] 3xs:mt-[22px] button-default justify-center button-checkout bg-robo-primaryTwo text-white h-[66px] disabled:opacity-50"
                    disabled  = {isValidPayment} 
                    label     = "Place Order" 
                    type      = "submit" 
                />
            </form>

            {
                isValidPayment &&
                    <PaymentProvider>
                        <BraintreeDropIn coupon={coupon} billingInfo={formik.values} toast={toast} setIsValidPayment={setIsValidPayment} />
                    </PaymentProvider>
            }
        </div>
    )

}

export default CreditDebitCheckout
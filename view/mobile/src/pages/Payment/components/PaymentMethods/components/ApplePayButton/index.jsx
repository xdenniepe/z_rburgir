import React, { useEffect, useRef } from 'react'
import { useApplePay, useOrderCtx, usePaymentCtx } from '../../../../../../hooks'

const ApplePayButton = ({ canUserPay, couponCode, tempTotal }) => {
    /**
     * TO DOs:
     * Validate domain registration.
     * Generate .pem file and .key file from OpenSSL based on the Merchant ID Certificate that will be used on the backend later on.
     */

    const { paymentTransaction } = usePaymentCtx()
    const { setTransaction } = useOrderCtx().apis

    const applePayButtonRef = useRef(null)
    const applePay          = useApplePay()
    const STORE             = 'The RoboBurger'

    const getRequestObject = tempTotal => {
        // const requestObject = 

        // if (couponCode) {
        //     requestObject.couponCode = couponCode
        //     requestObject.lineItems  = [
        //         {
        //             label : 'Subtotal',
        //             amount: total
        //         },
        //         {
        //             label : 'Discount',
        //             amount: couponDiscount
        //         }
        //     ],
        //     requestObject.supportsCouponCode = true
        // }

        return {
            requiredBillingContactFields: ['postalAddress'],
            total                       : {
                amount: tempTotal,
                label : STORE,
                type  : 'final'
            }
        }
    }

    const handleClick = () => {
        const requestObject  = getRequestObject(tempTotal)
        const paymentRequest = applePay.createPaymentRequest(requestObject)
        const paymentSession = new ApplePaySession(3, paymentRequest)

        paymentSession.onvalidatemerchant = event => {
            applePay.performValidation({
                validationURL: event.validationURL,
                displayName  : STORE
            })
            .then(merchantSession => {
                paymentSession.completeMerchantValidation(merchantSession)
            })
            .catch(validationErr => {
                console.error('Error validating merchant:', validationErr)
                paymentSession.abort()
            })
        }

        paymentSession.onpaymentauthorized = event => {
            console.log('Your shipping address is:', event.payment.shippingContact)
          
            applePay.tokenize({
                token: event.payment.token
            })
            .then(payload => {
                // Send payload.nonce to the BE.
                console.log('nonce:', payload.nonce)

                setTransaction({})
                paymentTransaction({ nonce: payload.nonce, coupon: couponCode || '' })
            
                // If requested, address information is accessible in event.payment
                // and may also be sent to the BE.
                console.log('billingPostalCode:', event.payment.billingContact.postalCode)
            
                // After you have transacted with the payload.nonce,
                // call `completePayment` to dismiss the Apple Pay sheet.
                paymentSession.completePayment(ApplePaySession.STATUS_SUCCESS)
            })
            .catch(tokenizeErr => {
                console.error('Error tokenizing Apple Pay:', tokenizeErr)
                paymentSession.completePayment(ApplePaySession.STATUS_FAILURE)
            })
        }

        paymentSession.begin()
    }

    useEffect(() => {
        if (applePay && canUserPay && applePayButtonRef.current) {
            applePayButtonRef.current.addEventListener('click', handleClick)

            return () => {
                applePayButtonRef.current.removeEventListener('click', handleClick)
            }
        }
    }, [applePay, canUserPay, applePayButtonRef.current])

    return applePay && canUserPay
        ?   <apple-pay-button buttonstyle="black" lang="en" ref={applePayButtonRef} type="plain"></apple-pay-button>
        :   null
}

export default ApplePayButton

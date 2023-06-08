import React, { useEffect } from 'react'
import { useOrderCtx, usePaymentCtx } from '../../../../hooks'
import client from 'braintree-web/client'
import clsx from 'clsx'
import hostedFields from 'braintree-web/hosted-fields'

const BraintreeDropIn = ({ coupon, billingInfo, toast, setIsValidPayment }) => {
    const { paymentTransaction, setIsPaymentMade } = usePaymentCtx()
    const { setTransaction } = useOrderCtx().apis

    const BT_AUTHORIZATION =  window.ENVIRONMENT === "PROD" 
                                ? import.meta.env.VITE_BT_AUTHORIZATION_PROD 
                                : import.meta.env.VITE_BT_AUTHORIZATION

    const hostedFieldsProp = {
        cardholderName: {
            container  : '#cc-name',
            placeholder: 'Name on Card*',
            prefill    : billingInfo.ccName,
        },
        number: {
            selector   : '#cc-number',
            placeholder: 'Credit Card Number',
            prefill    : billingInfo.ccNumber,
            supportedCardBrands : {
                'american-express' : true,
                'diners-club'      : true,
                'union-pay'        : true,
                mastercard         : true,
                discover           : true,
                jcb                : true,
                visa               : true,
                maestro            : true,
                elo                : true,
                mir                : true,
                hiper              : true,
                hipercard          : true
            }
        },
        cvv: {
            selector   : '#cc-cvv',
            placeholder: 'CVV*',
            prefill    : billingInfo.ccCVV
        },
        expirationDate: {
            selector   : '#cc-expiration-date',
            placeholder: 'MM/YY*',
            prefill    : billingInfo.ccExpirationDate
        },
    }

    const initializeBraintree = () => {
        client.create({
            authorization: BT_AUTHORIZATION
        },
            (clientErr, clientInstance) => {
                if (clientErr) {
                    console.error(clientErr)
                }

                hostedFields.create({
                    client: clientInstance,
                    fields: hostedFieldsProp,
                }, (hostedFieldsErr, instance) => {
                    if (hostedFieldsErr) {
                        console.error(hostedFieldsErr)
                    }

                    instance?.tokenize((tokenizeErr, payload) => {
                        if (tokenizeErr) {
                            console.error(tokenizeErr)
                            // console.log(tokenizeErr.code)
                            setIsValidPayment(false)
                            toast("Error", "Invalid card credentials")
                        }

                        const paymentMethodNonce = payload.nonce

                        setTransaction({})
                        paymentTransaction({ nonce: paymentMethodNonce, coupon: coupon })
                        setIsPaymentMade(true)
                    })
                })
            })
    }
    
    useEffect(() => {
        initializeBraintree()
    }, [])

    return(
        <div className={`${clsx('hidden : true')}`}>
            <form id="cc-hosted-fields-form" action="/" method="post" className="w-full px-6">
                <div id="cc-name"/>
                <div id="cc-number"/>
                <div id="cc-expiration-date"/>
                <div id="cc-cvv"/>
            </form>
        </div>
    )

}

export default BraintreeDropIn
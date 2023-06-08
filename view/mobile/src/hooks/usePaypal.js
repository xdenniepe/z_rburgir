import { useState } from 'react'
import useEffectOnce from './useEffectOnce'
import useOrderCtx from './useOrderCtx'
import usePaymentCtx from './usePaymentCtx'
import useUpdateEffect from './useUpdateEffect'
import client from 'braintree-web/client'
import paypalCheckout from 'braintree-web/paypal-checkout'

const usePaypal = (couponCode, tempTotal) => {
    const { setTransaction }     = useOrderCtx().apis
    const { paymentTransaction } = usePaymentCtx()
    const [paypalInstance, setPaypalInstance]             = useState(false)
    const [isPaypalClientLoaded, setIsPaypalClientLoaded] = useState(false)
    const [isCheckoutLoaded, setIsCheckoutLoaded]         = useState(false)

    const appBody = document.body

    const PAYPAL_API_KEY   = window.ENVIRONMENT === "PROD" ? import.meta.env.VITE_PAYPAL_API_KEY_PROD : import.meta.env.VITE_PAYPAL_API_KEY
    const BT_AUTHORIZATION = window.ENVIRONMENT === "PROD" ? import.meta.env.VITE_BT_AUTHORIZATION_PROD : import.meta.env.VITE_BT_AUTHORIZATION

    const initializePaypal = (couponCode, paymentTransaction, tempTotal, setTransaction) => {

        client.create({
            authorization: BT_AUTHORIZATION
        }, (clientErr, clientInstance) => {
    
            if (clientErr) {
                console.error('Error creating client: ', clientErr?.message || clientErr)
                return
            }
    
            // Create a PayPal Checkout component.
            paypalCheckout.create({
                    client: clientInstance
                }, (paypalCheckoutErr, paypalCheckoutInstance) => {
                    if (paypalCheckoutErr) {
                        console.error('Error proceeding to checkout: ', paypalCheckoutErr?.message || paypalCheckoutErr)
                        return
                    }

                    paypalCheckoutInstance.loadPayPalSDK({
                            currency: 'USD',
                            intent  : 'capture'
                    }, () => {
                        paypal.Buttons({
                            style: {
                                layout:  'vertical',
                            },
                            fundingSource: paypal.FUNDING.PAYPAL,
        
                            createOrder: () => {
                                return paypalCheckoutInstance.createPayment({
                                    flow    : 'checkout', // Required
                                    amount  : tempTotal, // Required
                                    currency: 'USD', // Required, must match the currency passed in with loadPayPalSDK
                                    intent  : 'capture', // Must match the intent passed in with loadPayPalSDK
                                })
                            },
                    
                            onApprove: (data, actions) => {
                                return paypalCheckoutInstance.tokenizePayment(data, function (tokenizeErr, payload) {
                                    // With authorize payment-nonces
                                    
                                    if (tokenizeErr) {
                                        console.error('Payment nonce error: ', tokenizeErr?.message || tokenizeErr)
                                        return
                                    }

                                    setTransaction({})
                                    paymentTransaction({ nonce: payload.nonce, coupon: couponCode || '' })
                                })
                            },
        
                            onCancel: data => {
                                console.log('PayPal payment cancelled', JSON.stringify(data, 0, 2))
                            },
        
                            onError: err => {
                                console.error('PayPal error', err?.message || err)
                            }
                        }).render('#paypal-button').then(function () {
                            setPaypalInstance(true)
                        })
                })
            })
        }) 
    }

    useEffectOnce(() => {
        const paypalClientSrc    = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_API_KEY}`
        const paypalClientScript = document.createElement('script')
       
        paypalClientScript.id  = 'paypal-client-script'
        paypalClientScript.src = paypalClientSrc

        paypalClientScript.addEventListener('load', () => setIsPaypalClientLoaded(true))
        
        appBody.appendChild(paypalClientScript)
 
        /**
         * Removing child node paypal client script is not necessary because it is the <iframe /> itself.
         * -> appBody.removeChild(paypalClientScript) using this code returns an error because it looks for a <script />, 
         * but the Body DOM has an <iframe />.
         * 
         * When loading the paypal client script, it will append the <iframe /> to the specificed DOM object, in this case the Body.
         * When the paypal client script has been loaded, even with an id of '#paypal-client-script', 
         * it will not appear like a normal <script /> tag since it is the generated paypal <iframe />,
         * unlike the '#paypal-checkout-script' which can be found on the Body DOM as a <script />.
         * 
         * TO DO: 
         * Improvement: remove <iframe /> through query selector.
         */
    })

    useUpdateEffect(() => {
        if (isCheckoutLoaded) {
            initializePaypal(couponCode, paymentTransaction, tempTotal, setTransaction)
        }
    }, [isCheckoutLoaded])

    useUpdateEffect(() => {
        if (isPaypalClientLoaded) {
            const paypalCheckoutSrc    = 'https://js.braintreegateway.com/web/3.87.0/js/paypal-checkout.min.js'
            const paypalCheckoutScript = document.createElement('script')
    
            paypalCheckoutScript.id  = 'paypal-checkout-script'
            paypalCheckoutScript.src = paypalCheckoutSrc

            paypalCheckoutScript.addEventListener('load', () => setIsCheckoutLoaded(true))
    
            appBody.appendChild(paypalCheckoutScript)
    
            return () => {
                appBody.removeChild(paypalCheckoutScript)
    
                paypalCheckoutScript.remove()
            }
                
        }
        
    }, [isPaypalClientLoaded])

    return paypalInstance
}

export default usePaypal
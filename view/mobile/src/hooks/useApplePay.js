import { useEffect, useState } from 'react'
import useEffectOnce from './useEffectOnce'
import client from 'braintree-web/client'
import applePay from 'braintree-web/apple-pay'

const useApplePay = () => {
    const [applePayInstance, setApplePayInstance] = useState(false)
    const [isApplePayLoaded, setIsApplePayLoaded] = useState(false)

    const BT_AUTHORIZATION = window.ENVIRONMENT === "PROD" 
                                ? import.meta.env.VITE_BT_AUTHORIZATION_PROD 
                                : import.meta.env.VITE_BT_AUTHORIZATION

    useEffectOnce(() => {
        const appBody             = document.body
        const applePayLogicSrc    = 'https://js.braintreegateway.com/web/3.90.0/js/apple-pay.min.js'
        const applePayLogicScript = document.createElement('script')

        applePayLogicScript.id  = 'apple-pay-logic'
        applePayLogicScript.src = applePayLogicSrc
    
        applePayLogicScript.addEventListener('load', () => setIsApplePayLoaded(true))
        
        appBody.appendChild(applePayLogicScript)

        return () => {        
            appBody.removeChild(applePayLogicScript)
            applePayLogicScript.remove()
        }
    })

    useEffect(() => {
        try {
            if (isApplePayLoaded && window.ApplePaySession) {
                const canMakePayments = window.ApplePaySession.canMakePayments()
                const supportsVersion = window.ApplePaySession.supportsVersion(3)
                const canUserPayRes   = canMakePayments && supportsVersion
    
                if (canUserPayRes) {
                    client.create({
                        authorization: BT_AUTHORIZATION
                    })
                    .then(clientInstance => {
                        return applePay.create({
                            client: clientInstance
                        })
                    })
                    .then(applePayInstance => setApplePayInstance(applePayInstance))
                    .catch(err => console.error('Error! ', err?.message || err))
                }
            }
        } catch (err) {
            console.error(err?.message || err)
        }
        
    }, [isApplePayLoaded])

    return applePayInstance
}

export default useApplePay
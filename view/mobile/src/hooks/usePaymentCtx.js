import { useContext } from 'react'
import PaymentContext from '../contexts/paymentContext'

const usePaymentCtx = () => {
    const context = useContext(PaymentContext)

    if (context === undefined) {
        throw new Error('usePaymentCtx must be used within a PaymentProvider.')
    }

    return context
}

export default usePaymentCtx
import { useContext } from 'react'
import OrderContext from '../contexts/orderContext'

const useOrderCtx = () => {
    const context = useContext(OrderContext)

    if (context === undefined) {
        throw new Error('useOrderCtx must be used within a OrderProvider.')
    }

    return context
}

export default useOrderCtx
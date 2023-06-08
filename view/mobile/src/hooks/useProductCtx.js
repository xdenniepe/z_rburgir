import { useContext } from 'react'
import ProductContext from '../contexts/productContext'

const useProductCtx = () => {
    const context = useContext(ProductContext)

    if (context === undefined) {
        throw new Error('useProductCtx must be used within a ProductProvider.')
    }

    return context
}

export default useProductCtx
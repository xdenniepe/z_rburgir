import { useContext } from 'react'
import LocationContext from '../contexts/locationContext'

const useLocationCtx = () => {
    const context = useContext(LocationContext)

    if (context === undefined) {
        throw new Error('useLocationCtx must be used within a LocationProvider.')
    }

    return context
}

export default useLocationCtx
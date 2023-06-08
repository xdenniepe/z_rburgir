import { useContext } from 'react'
import AuthContext from '../contexts/authContext'

const useAuthCtx = () => {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuthCtx must be used within a AuthProvider.')
    }

    return context
}

export default useAuthCtx
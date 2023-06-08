import { useEffect } from 'react'
import useIsFirstRender from './useIsFirstRender'

const useUpdateEffect = (callback, deps) => {
    const isFirstRender = useIsFirstRender()

    useEffect(() => {
        if (!isFirstRender) {
            return callback()
        }
    }, deps)
}

export default useUpdateEffect
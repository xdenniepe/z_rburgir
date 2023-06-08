import { useEffect, useState } from 'react'

const useOutsideClick = ref => {
    const [isClickedOutside, setIsClickedOutside] = useState(false)

    useEffect(() => {
        // Alert if clicked outside the component.
        const handleClickOutside = event => {   
            if (ref.current && !ref.current.contains(event.target)) {
                setIsClickedOutside(true)
            } else {
                setIsClickedOutside(false)
            }
        }

        // Bind the event listener.
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            // Unbind the event listener on clean up.
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref])

    return isClickedOutside
}

export default useOutsideClick
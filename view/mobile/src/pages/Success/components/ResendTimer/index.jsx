import React, { useEffect, useRef, useState } from 'react'
import { useAuthCtx } from '../../../../hooks'

const ResendTimer = ({ values }) => {
    const { verifyRegistration } = useAuthCtx()
    const [seconds, setSeconds]  = useState(120)

    const baseUrl = window.location.origin
    const timerId = useRef()

    const startTimer = () => {
        timerId.current = setInterval(() => {
            setSeconds(prev => (prev - 1))
        }, 1000)
    }

    const stopTimer = () => {
        clearInterval(timerId.current)
    }

    useEffect(() => {
        if (seconds === 0) {
            stopTimer()
        } else {
            startTimer()
            return () => {
                stopTimer()
            }
        }
    }, [seconds])

    const handleClick = () => {
        verifyRegistration(values, baseUrl)
        setSeconds(120)
    }

    return (
        <div className="flex flex-row items-left justify-start px-2 mt-2 text-base sm:text-base xs:text-sm xxs:text-sm 3xs:text-sm tracking-wide">
            {seconds === 0 ? 
            <div className="flex flex-row gap-2">
                <p 
                aria-label = "Having Trouble?"
                className  = "w-fit"
                >
                    Didn't receive verification?
                </p> 

                <button 
                    aria-label = "Resend code"  
                    onClick    = {() => handleClick()}
                    className  = "w-fit underline tracking-wide" 
                    role       = "link" 
                    type       = "button" 
                > 
                    Resend link.
                </button>   
            </div>
            :
            <p className="text-left w-full text-base sm:text-base xs:text-sm xxs:text-sm 3xs:text-sm">
                Resend verification link in {seconds} seconds 
            </p>}
            
        </div>
    )
}

export default ResendTimer
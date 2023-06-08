import React, { useEffect, useRef } from 'react'

const ResendReceiptTimer = ({ isSending, handleResendReceipt, seconds, setSeconds }) => {
    const timerId   = useRef()

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

    return seconds === 0 ? (
        <div className="text-center justify-center">
            <p 
                aria-label = "Didn't receive the receipt?"
                className  = "text-center font-futura"
                tabIndex   = {0}
            >
                Didn't receive the receipt?
            </p> 

            <button 
                className  = "tracking-[1.28px] underline font-futura z-10"
                aria-label = "Resend"
                disabled   = {isSending}
                onClick    = {() => handleResendReceipt()}
                tabIndex   = {0}
            > 
                Resend  
            </button>
        </div>
    ) : (
        <p className="w-full text-center" arial-label={`Resend receipt in ${seconds} seconds.`} tabIndex={0}>
            Resend receipt in {seconds} seconds 
        </p>
    )
}

export default ResendReceiptTimer
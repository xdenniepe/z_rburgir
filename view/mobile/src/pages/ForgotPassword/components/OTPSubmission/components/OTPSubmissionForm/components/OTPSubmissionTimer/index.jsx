import React, { useEffect, useRef, useState } from 'react'

const OTPSubmissionTimer = ({ isOTPSubmitted, setShowOTPTimer }) => {
    const [seconds, setSeconds] = useState(120)
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
        startTimer()

        return () => {
            stopTimer()
        }
    }, [])

    useEffect(() => {
        if (seconds === 0) {
            stopTimer()
            setSeconds(120)
            setShowOTPTimer(false)
        }
    }, [seconds])

    useEffect(() => {
        if (isOTPSubmitted) {
            stopTimer()
        }
    }, [isOTPSubmitted])

    return (
        <div className="flex flex-row items-left justify-start p-2">
            <p className="text-left w-full">
                Resend code in {seconds} seconds 
            </p>
        </div>
    )
}

export default OTPSubmissionTimer
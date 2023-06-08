import React, { useState } from 'react'
import { useAuthCtx, useOrderCtx } from '../../../../hooks'
import ResendReceiptTimer from './components/ResendTimer'

const ResendReceipt = ({ toast }) => {
    const { user }        = useAuthCtx().state
    const { sendReceipt } = useOrderCtx().apis

    const [isSending, setIsSending] = useState(false)
    const [seconds, setSeconds]     = useState(120)

    const handleResendReceipt = async () => {
        setIsSending(true)
        setSeconds(120)
        try {
            const sendReceiptRes = await sendReceipt()

            const { status } = sendReceiptRes

            if (status === 200 && user?.email && user?.phoneNumber) {
                toast('Success', 'Receipt has been sent to your email and phone number')
            } else if (status === 200 && !user?.email) {
                toast('Success', 'Receipt has been sent to your phone number')
            } else if (status === 200 && !user?.phoneNumber) {
                toast('Success', 'Receipt has been sent to your email')
            }
        } catch (err) {
            console.error(err?.message || err)
        }

        setIsSending(false)
    }

    return user?.phoneNumber === null && user?.email !== null && user?.subscription === 'INA' 
        ? null
        : (
            <div className="text-robo-primaryTwo h-fit w-full md:text-xl sm:text-md xs:text-sm xxs:text-xs 3xs:text-3xs text-center">
                <ResendReceiptTimer 
                    isSending            = {isSending} 
                    handleResendReceipt  = {handleResendReceipt} 
                    seconds              = {seconds}
                    setSeconds           = {setSeconds}
                />
            </div>
        )
}

export default ResendReceipt

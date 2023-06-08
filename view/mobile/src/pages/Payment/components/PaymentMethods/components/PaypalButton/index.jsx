import React, { memo } from 'react'

const PaypalButton = ({ paypal }) => { 
    return (
        <div 
            className = {`inline-flex items-center w-full justify-center border border-transparent 
                bg-[#FFC439] text-white px-4 py-2 text-base font-medium h-[50px] rounded-md max-h-[50px] z-0 
                ${!paypal && 'hidden'}`}
            id = "paypal-button"
        >
        </div>
    )
} 

export default memo(PaypalButton)
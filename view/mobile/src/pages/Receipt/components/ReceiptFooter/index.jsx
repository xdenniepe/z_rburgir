import React from 'react'

const ReceiptFooter = ({user}) => {
    return (
        <>
            {
                user?.phoneNumber !== null && user?.email !== null && 
                <p 
                    className  = "text-robo-primaryTwo md:text-xl sm:text-md xs:text-sm xxs:text-xs 3xs:text-3xs mb-[6px] font-futura" 
                    aria-label = {`The receipt has been sent to your email and phone number`} 
                    tabIndex   = {0} 
                    role       = "text"
                >
                    *The receipt has been sent to your email and phone number
                </p>
                
            }

            {
                user?.phoneNumber !== null && user?.email === null && 
                <p 
                    className  = "text-robo-primaryTwo md:text-xl sm:text-md xs:text-sm xxs:text-xs 3xs:text-3xs mb-[6px] font-futura" 
                    aria-label = {`The receipt has been sent to your phone number`} 
                    tabIndex   = {0} 
                    role       = "text"
                >
                    *The receipt has been sent to your phone number
                </p>
            }

            {
                user?.phoneNumber === null && user?.email !== null && user?.subscription === 'ACT' &&
                <p 
                    className  = "text-robo-primaryTwo md:text-xl sm:text-md xs:text-sm xxs:text-xs 3xs:text-3xs mb-[6px] font-futura" 
                    aria-label = {`The receipt has been sent to your email`} 
                    tabIndex   = {0} 
                    role       = "text"
                >
                    *The receipt has been sent to your email 
                </p>
            }

            {
                user?.phoneNumber === null && user?.email !== null && user?.subscription === 'INA' &&
                <p 
                    className  = "text-robo-primaryTwo md:text-xl sm:text-md xs:text-sm xxs:text-xs 3xs:text-3xs mb-[6px] font-futura" 
                    aria-label = {`*The receipt has been sent to your email`} 
                    tabIndex   = {0} 
                    role       = "text"
                >
                    *Thank you for your RoboBurger order!
                </p>
            }

        </>
    )
}

export default ReceiptFooter
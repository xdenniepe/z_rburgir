import React from 'react'     

const OrderAgreement = () => {
    return(
        <div className="tracking-wide text-xs text-robo-primaryTwo items-center justify-center text-center mt-[56px]" aria-label = "Your order will be held in the unit for maximum of 5 mins after it's ready. By making this purchase you take full responsibility for picking your order on time." role = "text" tabIndex = {0}>
            <p
                className   = "text-[12px] text-robo-primaryTwo"
                aria-hidden = {true}
            >  
                Your order will be held in the unit for maximum of  
            </p>

            <p
                className   = "text-[12px] text-robo-primaryTwo"
                aria-hidden = {true}
            >  
                5 mins after it's ready. By making this purchase you 
            </p>

            <p
                className   = "text-[12px] text-robo-primaryTwo"
                aria-hidden = {true}
            >  
                take full responsibility for picking your order on time.
            </p>
        </div>
    )
}

export default OrderAgreement
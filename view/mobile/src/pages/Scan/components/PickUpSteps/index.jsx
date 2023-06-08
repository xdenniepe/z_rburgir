import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const PickUpSteps = () => {
    const [searchParam] = useSearchParams()
    
    const navigate = useNavigate()

    let redirectUrl = searchParam.get("orderId") && searchParam.get("orderId") !== "" ? `/receipt?orderId=${searchParam.get("orderId")}` : "/receipt"
    
    return (
        <div className="relative h-screen w-full flex flex-col items-center">
            <div 
                className   = "flex justify-center items-center z-[1] h-[62px] w-[305px] lg:h-[100px] md:h-[90px] xxs:w-[255px] text-[#FFFF] text-center text-sm lg:text-lg md:text-base xs:text-[13px] xxs:text-[10px] 3xs:text-[10px] absolute relative -top-7 md:-top-[30px] lg:-top-[40px] left-50 bg-[#A6252A] tracking-[1.6px] leading-[20px]"
                tabIndex    = {0}
                role        = "text"
                aria-label  = "WARNING! Your order is not placed until you scan this code at the unit"
            > 
                <p className="h-fit xs:px-1 xxs:px-2">
                    <span className="font-futura-bold"> WARNING! </span>
                    Your order is not placed until you scan this code at the unit
                </p>
            </div>
            <div className="z-[0.5] w-full h-[317px] bg-white text-center absolute">
                <div className="flex items-center justify-center">
                    <button 
                        aria-label = "See Receipt Button - Click to see receipt" 
                        tabIndex   = {0}
                        role       = "button"
                        className  = "relative flex justify-center items-center h-[39px] tracking-widest bg-[#C0B9AF] w-[296px] xxs:w-[246px] text-lg lg:text-2xl md:text-xl xs:text-base xxs:text-sm 3xs:text-sm mt-[63px] lg:mt-[85px] md:mt-[90px]" 
                        onClick    = {() => navigate(redirectUrl)}  
                    >
                        <span className="h-fit"> SEE RECEIPT </span>
                    </button>
                </div>


                <p 
                    aria-label = "Your order will be held in the unit for a maximum of 5 minutes after it's ready" 
                    className  = "xxs:px-1.5 mt-6 flex flex-row items-center text-center justify-center text-robo-primaryTwo text-center text-sm lg:text-lg md:text-[18px] sm:text-[14px] xs:text-[12px] xxs:text-[12px] 3xs:text-[11px] tracking-[1.12px] leading-[20px]"
                    tabIndex   = {0}
                    role       = "text"
                >
                    *Your order will be held in the unit for a maximum of 5 minutes after it's ready 
                </p>
            </div>
        </div> 
    )
}

export default PickUpSteps

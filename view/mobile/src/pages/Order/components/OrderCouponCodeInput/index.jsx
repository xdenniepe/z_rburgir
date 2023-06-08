import React, { memo } from 'react'
import { Coupon, ClearCircle } from '../../../../utilities/icons'


const OrderCouponCodeInput = ({ couponCode, handleApplyCoupon, handleChange, handleClearCoupon, code, couponInvalid }) => {
    const regex = e => {
        let regex = /[0-9a-zA-Z]/g;

        if(!regex.test(e.key)) {
            e.preventDefault();
        }
    }
    
    return (
        <> 
            <div 
                aria-label = "Coupon code input field" 
                className  = "flex flex-row w-full h-full border border-robo-primaryTwo/35 border-1 divide-x" 
                tabIndex   = {0}
            >
                <div className="flex flex-row w-9/12 h-[50px] relative">
                    <Coupon
                        aria-label = "Promo Code Icon"
                        className  = "h-6 w-6 opacity-30 absolute ml-3 mt-3" 
                        role       = "text"
                        tabIndex   = {0}
                    />

                    <input
                        aria-label  = "Coupon Code Input Field"
                        className   = {`w-full text-base text-left pl-5 indent-6 tracking-wide focus:outline-robo-primaryTwo ${couponInvalid ? 'text-red-700' : ''}`}
                        id          = "codeplaceholder"
                        name        = "couponCode"
                        placeholder = "PROMOCODE"
                        onChange    = {() => handleChange()} 
                        ref         = {couponCode}
                        tabIndex    = {0}
                        type        = "text"
                        value       = {code}
                        onKeyDown   = {(e)=>regex(e)}
                    />
                
                    {
                        code 
                            ?   <ClearCircle 
                                    aria-label = "Remove Icon" 
                                    className  = "absolute m-2 right-0 h-[30px] w-[30px] bg-transparent border border-none" 
                                    fill       = "#C0B9AF" 
                                    onClick    = {() => handleClearCoupon()}
                                    role       = "text" 
                                    tabIndex   = {0} 
                                />
                            :   null
                    }
                    
                </div>

                <div className="h-[50px] w-3/12" tabIndex={0}>
                    <button
                        aria-label = "Add Button - Click to add promo code"
                        className  = "bg-robo-primaryTwo text-white h-full w-full uppercase font-futura tracking-[1.6px] text-base disabled:bg-[#eceae7] disabled:text-robo-primaryEight"
                        disabled   = {!code}
                        onClick    = {() => handleApplyCoupon()}
                        type       = "button"
                        tabIndex   = {0}
                    >
                        Add
                    </button>
                </div>  
            </div>

            {
                couponInvalid 
                    ?   <p
                            aria-live = "polite"
                            className = "text-center text-red-700 font-normal mt-1 px-1 tracking-[1.12px] leading-[15px] sm:text-xs xs:text-xs xxs:text-xs md:text-base" 
                        >
                            {couponInvalid}
                        </p>
                    :   null
            }
        </>
    )
}

export default memo(OrderCouponCodeInput)

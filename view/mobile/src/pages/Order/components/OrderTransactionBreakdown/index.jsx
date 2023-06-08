import React, { useEffect } from 'react'
import { isEmptyObject } from '../../../../utilities/helpers'

const OrderTransactionBreakdown = ({ deleteCoupon, renderCouponTotal, subtotal, tax, coupon, couponDiscount, couponRef, total, tempTotal, ariaDiscount }) => {

    return (
 
        <div className="bg-robo-primary flex flex-col gap-5 rounded-md h-full w-full">
            <div className="bg-robo-secondary flex flex-col gap-1.5 py-[15px] px-[36px] tracking-[1.12px]" tabIndex = {0} role = "text" aria-label = {`subtotal - ${subtotal} USD - ${!isEmptyObject(coupon) ? `Gift Coupon Discount - ${ariaDiscount} USD`: ``} - Tax - ${tax} USD - Total, in United States dollar - ${!isEmptyObject(coupon) ? `${tempTotal} USD` : `${total} USD`}  `}>
                <div className="flex flex-row w-full justify-between items-start md:text-base sm:text-[14px] xs:text-[14px] xxs:text-[13px] xxs:px-5">
                    <p 
                        aria-label = "Subtotal -" 
                        className  = "text-robo-primaryTwo"  
                        ref        = {deleteCoupon} 
                        aria-hidden = {true}
                    >
                        Subtotal
                    </p>
                    <p 
                        aria-label = {`${subtotal} USD -`}
                        className  = "text-robo-primaryTwo"  
                        aria-hidden = {true}
                    >
                        ${subtotal} 
                    </p>
                </div>

                { 
                    !isEmptyObject(coupon) 
                        ?   <div className="flex flex-row w-full justify-between items-start md:text-base sm:text-[14px] xs:text-[14px] xxs:text-[13px] xxs:px-5">
                                <p 
                                    aria-label = "Gift Coupon Discount -"
                                    aria-live  = "polite" 
                                    className  = "text-[#c7c3c1]"  
                                    ref        = {couponRef} 
                                    aria-hidden = {true}
                                >
                                    Promo Code
                                </p>
                                <p className="justify-between text-[#c7c3c1]"> 
                                    { coupon.discountPercentage ? `  ${couponDiscount} ` : '' }  
                                </p>
                            </div>
                        :   null
                }

                <div className="flex flex-row w-full justify-between items-start md:text-base sm:text-[14px] xs:text-[14px] xxs:text-[13px] xxs:px-5">
                    <div className="flex flex-row">
                        <p 
                            aria-label = "Tax -"
                            className  = "text-robo-primaryTwo"
                            aria-hidden = {true}
                        >
                            Tax
                        </p>
                    </div>
                    <p 
                        aria-label = {`${tax} USD -`}
                        className  = "text-robo-primaryTwo"
                        aria-hidden = {true}
                    >
                        ${tax} 
                    </p>
                </div>
            
                <div className="flex flex-row w-full justify-between text-robo-primaryTwo md:text-base sm:text-[16px] xs:text-[16px] xxs:text-[16px] xxs:px-5 xxs:px-5 mt-4">
                    <p  
                        aria-label = "Total, in United States dollar -"
                        className  = "font-futura-bold"
                        aria-hidden = {true}
                    >
                        Total (USD)
                    </p>
                    <p 
                        className  = "font-futura-bold md:text-base sm:text-[16px] xs:text-[16px] xxs:text-[16px]"  
                    >
                        {renderCouponTotal} 
                    </p>
                </div>
            </div> 
        </div>
    )
}

export default OrderTransactionBreakdown

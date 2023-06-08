import React, { useState } from 'react'
import { Transition } from '@headlessui/react'
import { ChevronDown, ShoppingBag } from '../../../../utilities/icons'
import { isEmptyObject } from '../../../../utilities/helpers'
import InvoiceBreakdown from '../InvoiceBreakdown'

const OrderSummary = ({ coupon, couponDiscount, couponRef, subtotal, tax, tempTotal }) => {
    const [showOrderSummary, setShowOrderSummary] = useState(false)

    return (
        <>
            <div 
                aria-label = "Order Summary Dropdown"
                className  = "gap-2 mt-8 w-full flex flex-row items-center text-robo-primaryTwo text-sm py-3 pr-8 pl-[18px] border border-gray-500/50"
                tabIndex   = {0}
            >
                <div className="w-1/12">
                    <span aria-label="Shopping Bag Icon" role="text" tabIndex={0}>
                        <ShoppingBag 
                            className = "h-[20px] w-[20px] pl-1" 
                            stroke    = "#37250D"    
                        />
                    </span>
                </div>

                <div className="w-8/12">
                    <button
                        aria-label = "Show order summary" 
                        className  = "flex flex-row justify-center items-center sm:text-sm xs:text-xs xxs:text-xs tracking-wide pt-[2px] pl-[10px] xs:pl-[0px]"
                        onClick    = {() => !showOrderSummary ? setShowOrderSummary(true) : setShowOrderSummary(false)}
                        tabIndex   = {0}
                        type       = "button"
                    >
                        <p className="font-futura"> 
                            Show Order Summary &nbsp;
                        </p>
                        <span aria-label="Arrow Down Icon - See More Information" role="button" tabIndex={0}>
                            <ChevronDown 
                                className = "h-4 w-4 mb-1" 
                                stroke    = "#8D8D8D" 
                            />
                        </span>
                        
                    </button>
                </div>
                <div className="w-3/12">
                    <p className="tracking-wide text-sm sm:text-sm xs:text-sm xxs:text-xs pt-[2px] text-right font-futura" aria-label={`${tempTotal} USD`} tabIndex={0} role="text">
                        {isNaN(tempTotal) ? " " : `$${tempTotal}`} 
                    </p>
                </div>
            </div>
            
            <Transition
                appear    = "false"
                as        = "div"
                className = "w-full -mt-6"
                enter     = "ease-in duration-200"
                enterFrom = "ease-in -translate-y-4"
                enterTo   = "ease-in translate-y-5"
                leave     = "ease-out duration-50"
                leaveFrom = "ease-out translate-y-5"
                leaveTo   = "ease-out -translate-y-4"
                show      = {showOrderSummary}
            >
                <div 
                    aria-label = "Order summary table"
                    className  = "w-full text-robo-primaryTwo border border-gray-500/50 text-center py-4 px-8 flex flex-col gap-1 mt-[4px] bg-white"
                    tabIndex   = {0}
                >
                
                    <InvoiceBreakdown />

                    <div className="border border-gray-500/20 mt-4" />

                    <div className="flex flex-col gap-2 mt-4" tabIndex={0}>
                        <div className="tracking-widest flex flex-row w-full justify-between">
                            <p 
                                aria-label = "Subtotal -" 
                                role       = "text"
                                className  = "md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px] ml-[110px] xs:ml-[80px] xxs:ml-[70px]"  
                            >
                                Subtotal
                            </p>
                            <p 
                                aria-label = {`${subtotal} USD -`}
                                className  = "md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px]"  
                                role       = "text"
                            >
                                ${subtotal} 
                            </p>
                        </div>

                        { 
                            !isEmptyObject(coupon) &&  
                                 <div className="tracking-widest flex flex-row w-full justify-between">
                                    <p 
                                        aria-label = "Gift Coupon Discount -"
                                        aria-live  = "polite" 
                                        className  = "text-[#c7c3c1] md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px] ml-[110px] xs:ml-[80px] xxs:ml-[70px]"  
                                        ref        = {couponRef} 
                                        role       = "text"
                                    >
                                        Promo Code
                                    </p>
                                    <p className="text-[#c7c3c1] md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px]"> 
                                        { coupon.discountPercentage ? `${couponDiscount}` : '' }  
                                    </p>
                                </div> 
                        }

                        <div className="tracking-widest flex flex-row w-full justify-between">
                            <p 
                                className  = "md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px] ml-[110px] xs:ml-[80px] xxs:ml-[70px]"  
                                aria-label = "Tax -"
                                role       = "text"
                            >
                                Tax
                            </p>
                            <p 
                                className  = "md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px]"  
                                aria-label = {`${tax} USD -`}
                                role       = "text"
                            >
                                ${tax} 
                            </p>
                        </div>

                        <div className="tracking-widest flex flex-row w-full justify-between font-futura-bold">
                            <p 
                                aria-label = "Total: in United States Dollar -"
                                className  = "md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px] tracking-tight ml-[110px] text-left xs:ml-[80px] xxs:ml-[70px]"  
                            >
                                Total (USD)
                            </p>
                            <p 
                                className  = "md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px] tracking-tighter " 
                                aria-label = {`${tempTotal} USD -`}
                                role       = "text"
                            >
                                ${tempTotal}
                            </p>
                        </div>
                    </div>
                </div>
            </Transition>
        </>
    )

}

export default OrderSummary
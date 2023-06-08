import React from 'react'

const PaymentInfo = ({ subtotal, tax, total, discount, cardNumberSlice, paymentAccountType }) => {
    const payment = () => {
        if (paymentAccountType=== 'credit_card') {
            return (
                <>
                    <p aria-label={`Paid with: credit card - Credit ending with number ${cardNumberSlice.slice(-4)}`} role="text"> Paid with: Credit Card </p>
                    <p aria-hidden = {true}> {cardNumberSlice}</p>
                </>
            )
        } else if (paymentAccountType === 'paypal_account') {
            return (
                <div className="flex flex-row gap-2">
                    <p aria-label="Paid with: Paypal" role="text"> Paid with: </p>
                    <img src="https://roboburgerdev.blob.core.windows.net/email-templates/payment-paypal.png" className="h-[19px] mt-[2px]"/>
                </div>
            )
        } else {
            return (
                <div className="flex flex-row gap-2">
                    <p aria-label="Paid with: Apple pay" role="text"> Paid with: </p>
                    <img src="https://roboburgerdev.blob.core.windows.net/email-templates/payment-applepay.png" className="h-[19px] mt-[2px]"/>
                </div>
            )
        }
    } 

    return (
        <div>
           <div tabIndex={0} className="text-robo-primaryTwo" aria-label={`Subtotal: ${subtotal} USD - ${discount > 0 ? `Promo Code Discount: ${discount.toFixed(2)} USD -` : ``} Tax: ${tax.toFixed(2)} USD -  Total (in United States Dollar): ${total} USD -`} role = "text">
                <div className="flex flex-row text-right font-sm pt-[17.5px] gap-[11px] justify-center md:text-xl sm:text-base xs:text-sm xxs:text-xs 3xs:text-3xs">
                    <div className="w-9/12 text-left pl-[114px] xs:pl-[5rem] xxs:pl-[5rem] 3xs:pl-[5rem]">
                        <p aria-hidden="true" className="mb-2"> Subtotal </p>
                        { 
                            discount > 0 
                                && 
                                <p className="mb-2 text-[#c7c3c1]" aria-hidden="true"> Promo Code </p>
                        }
                        <p aria-hidden="true" className="mb-2"> Tax </p>
                    </div>

                    <div className="w-3/12">
                        <p aria-hidden = {true} className="mb-2">${subtotal}</p>
                        { discount > 0 &&  <p aria-label={`Promo Code Discount: ${discount.toFixed(2)} USD -`} className="mb-2 text-[#c7c3c1]"> -${discount.toFixed(2)}</p>}
                        <p  aria-hidden = {true} className="mb-2">${tax.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex flex-row text-right font-sm gap-[11px] justify-center md:text-xl sm:text-md xs:text-[13px] xxs:text-[11px] 3xs:text-3xs">
                    <div className="w-9/12 text-left pl-[114px] xs:pl-[5rem] xxs:pl-[5rem] 3xs:pl-[5rem]">
                        <p aria-hidden="true" className="font-futura-bold mb-2">Total (USD)</p>
                    </div>

                    <div className="w-3/12">
                        <p className="font-futura-bold sm:text-[14px] xs:text-[13px] xxs:text-[11px] 3xs:text-3xs sm:mt-[1px] xs:mt-[1px] xxs:mt-[0px] 3xs:mt-[0px] md:text-lg lg:mt-[1px] mb-2" aria-hidden = {true} >${total}</p>
                    </div>    
                </div>
            </div>
            
            {/* <p tabIndex={0} className="sr-only" aria-label={`Subtotal ${subtotal} USD Taxes ${(tax).toFixed(2)} USD Coupon ${discount} USD Total ${total} USD`}></p> */}
            
            <div className="md:text-xl sm:text-base xs:text-sm xxs:text-xs 3xs:text-3xs mt-[18px]" tabIndex = {0} role = "text">
                {payment()}
            </div>
        </div>
    )

} 

export default PaymentInfo
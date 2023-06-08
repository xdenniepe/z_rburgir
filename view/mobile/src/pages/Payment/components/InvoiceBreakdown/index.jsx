import React from 'react'  
import { useOrderCtx } from '../../../../hooks'
import { mutateCondimentsToString } from '../../../../utilities/helpers'
import dayjs from 'dayjs'

const InvoiceBreakdown = () => {
    const { state }    = useOrderCtx()
    const { invoices } = state

    return (
        <div className="text-sm space-y-2" tabIndex={0}> 
            <p 
                className  = "text-left my-1 tracking-wide md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px]" 
                aria-label = {`Date: ${dayjs().format("MMMM DD YYYY hh:mm A")} -`}  
                role       = "text"
            > 
                Date: {dayjs().format("MM/DD/YYYY hh:mm A")}
            </p>
            
            <p 
                className  = "text-left tracking-wide md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px]" 
                aria-label = {`RoboBurger Unit: ${invoices[0].vendingMachineId} -`}  
                role       = "text"
            >
                RoboBurger Unit: {invoices[0].vendingMachineId} 
            </p>
            
            <div className="flex flex-row justify-between w-full pt-4" aria-hidden={true}>
                <p 
                    role       = "text"
                    className  = "tracking-wide w-1/3 text-left font-futura-bold"
                >
                    Item
                </p>

                <p 
                    role       = "text"
                    className  = "tracking-wide w-1/3 text-right font-futura-bold ml-[50px]"
                >
                    Qty
                </p>
                
                <p 
                    role       = "text"
                    className  = "w-1/3 text-right font-futura-bold pr-1"
                >
                    Price
                </p>
            </div>

            <div className="space-y-2">
            {
                invoices.map((invoice, index) => (
                    <div key={`${invoice.name}-${index}`} className="font-futura-bold tracking-tight">
                         <div className="flex flex-row justify-between w-full text-sm">
                            <div className="w-[75%]" role="text" aria-label={`${invoice.name} RoboBurger with ${mutateCondimentsToString(invoice.condimentOrder)} -`}>
                                <p className="lg:text-[18px] md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px] capitalize text-left"> 
                                    {invoice.name} RoboBurger
                                </p>
                            </div>
                            <p className="lg:text-[18px] md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px] w-1/4" aria-label={`Order Quantity - ${invoice.quantity} -`} role="text"> {invoice.quantity} </p>
                            <p className="lg:text-[18px] md:text-[16px] sm:text-[14px] xs:text-[12px] xxs:text-[10px] w-1/4 text-right" aria-label={`Price: ${invoice.subtotal} USD -`} role="text"> ${(invoice.subtotal).toFixed(2)} </p>
                        </div>
                        {
                            invoice.name === 'custom' 
                                &&  <p
                                        className   = "mt-[3px] text-left sm:text-xs xs:text-xs xxs:text-xxs"
                                        aria-hidden = {true}
                                    > 
                                       ({mutateCondimentsToString(invoice.condimentOrder)})
                                    </p>
                        }
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default InvoiceBreakdown
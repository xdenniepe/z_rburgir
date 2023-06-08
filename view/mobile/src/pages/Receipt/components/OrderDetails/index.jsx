import React from 'react'
import { capitalizeFirstLowercaseRest, mutateCondimentsToString, padWithLeadingZeros } from '../../../../utilities/helpers'
import dayjs from 'dayjs'

const OrderDetails = ({ invoice, transaction }) => {
    let ariaCondiment = ''
    let date = dayjs.unix(transaction?.payment?.tiTransactionDate).format("MM/DD/YYYY hh:mm A")

    if (invoice) {
        return (
            <div>
                <div className="flex flex-col gap-[11px] font-sm text-robo-primaryTwo justify-center md:text-xl sm:text-base xs:text-sm xxs:text-xs 3xs:text-3xs pb-[23px] mt-[15px]" aria-label={`Receipt number ${padWithLeadingZeros(invoice[0].orderId)} - Date: ${dayjs(date).format("MMM D YYYY hh:mm A")} - Roboburger Unit ${transaction?.vendingMachine?.vendingMachineId} -`} role="text" tabIndex={0}>
                    <p aria-hidden = {true} className="font-futura-bold">Receipt #{padWithLeadingZeros(invoice[0].orderId)}</p>
                    <p aria-hidden = {true}> Date: {date}</p>
                    <p aria-hidden = {true}>RoboBurger Unit: {transaction?.vendingMachine?.vendingMachineId}</p>
                </div>
                
                <table className="text-robo-primaryTwo md:text-xl sm:text-base xs:text-sm xxs:text-xxs 3xs:text-3xs w-full" >
                    <thead>
                        <tr>
                            <th 
                                scope       = "col" 
                                className   = "py-1 pr-3 text-left md:text-xl sm:text-base xs:text-sm xxs:text-xs 3xs:text-3xs text-robo-primaryTwo font-futura-bold" 
                                aria-label  = "Item" 
                                role        = "text"
                                aria-hidden = {true}
                                 
                            >
                                Item
                            </th>
                            <th 
                                scope      = "col" 
                                className  = "px-3 3xs:px-1 xxs:pl-0 py-1 text-left md:text-xl sm:text-base xs:text-sm xxs:text-xs 3xs:text-3xs text-robo-primaryTwo font-futura-bold" 
                                aria-label = "Quantity" 
                                role       = "text"
                                aria-hidden = {true}
                            >
                                Qty
                            </th>
                            <th 
                                scope      = "col" 
                                className  = " 3xs:px-1 xxs:pl-0 py-1 text-right md:text-xl sm:text-base xs:text-sm xxs:text-xs 3xs:text-3xs text-robo-primaryTwo font-futura-bold md:text-right" 
                                aria-label = "Price" 
                                role       = "text"
                                aria-hidden = {true}
                            >
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {Object.values(invoice).map((invoiceItem) => (
                        <tr key={invoiceItem?.productOrderId} role = "text"  aria-label = {`${invoiceItem.name} RoboBurger with ${mutateCondimentsToString(invoiceItem?.condimentOrder)} - Order quantity: ${invoiceItem?.quantity} - Price: ${parseFloat(invoiceItem?.price).toFixed(2)} USD -`} tabIndex={0}>
                            <td 
                                className  = "align-top 3xs:pl-0 xxs:pl-0 xxs:pr-0 pr-3 md:text-base sm:text-[14px] xs:text-[14px] xxs:text-[12px] 3xs:text-xxs text-robo-primaryTwo capitalize font-futura-bold" 
                            >
                                <p  
                                    aria-hidden = {true}
                                > 
                                    <span className="font-futura-bold">{invoiceItem?.name} RoboBurger</span> <br/>
                                    { invoiceItem.name === 'standard' ? <> </> :
                                    <>
                                        {invoiceItem?.condimentOrder.length > 0 && '('} 
                                        {                        
                                        invoiceItem?.condimentOrder.map(({ name }, index) => {
                                            let condimentName = name === 'cheese' ? 'melty cheese sauce' : name
                                            ariaCondiment = ariaCondiment + name + index === invoiceItem?.condimentOrder.length - 1 ? ',' : ''

                                            if (index === 0) {
                                                condimentName = capitalizeFirstLowercaseRest(condimentName)
                                            }

                                            return (
                                                <span className = "text-xs md:text-base sm:text-xs xs:text-xs xxs:text-xxs 3xs:text-[8px]   " key = {name}>
                                                    {condimentName}
                                                    {index < invoiceItem?.condimentOrder.length - 1 ? ', ' : ''}
                                                    
                                                </span>
                                            )
                                        })   
                                    }
                                    {invoiceItem?.condimentOrder.length > 0 && ')'} 
                                    </>
                                    }
                                </p>
                            </td>
                            <td 
                                className  = "align-top text-center whitespace-nowrap py-1 pl-4 xxs:pl-2 xxs:pr-0 pr-3 md:text-base sm:text-[14px] xs:text-[14px] xxs:text-[11px] 3xs:text-xxs text-robo-primaryTwo" 
                            >
                                <p  
                                   aria-hidden = {true}
                                > 
                                    {invoiceItem?.quantity}
                                </p>
                            </td>
                            <td 
                                className  = "align-top text-right whitespace-nowrap py-1 pl-4 xxs:pl-2 xxs:pr-0 pr-[0px] md:text-base sm:text-[14px] xs:text-[14px] xxs:text-[11px] 3xs:text-xxs text-robo-primaryTwo md:text-right" 
                            >
                                <p  
                                    aria-hidden = {true}
                                >
                                    ${invoiceItem?.price.toFixed(2)}
                                </p>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    } else {
        return <></>
    }
}

export default OrderDetails
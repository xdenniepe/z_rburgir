import React from 'react'   
import { GrayChevronRight } from '../../../../utilities/icons'
import { Link } from 'react-router-dom'
import { mutateCondimentsToString, padWithLeadingZeros } from '../../../../utilities/helpers'
import dayjs from 'dayjs'

const TransactionHistoryItem = ({ transaction, componentKey }) => {
    const cartItems = transaction?.cartItems

    const renderCartItems = (cartItem, index) => {

        const renderCondiments = () => {
            let condimentString = 'With '

            cartItem?.condimentOrder.map((condiment, index) => (
                condimentString = condimentString + (condiment.name === "cheese" ? "melty cheese sauce" : condiment.name) + (index === cartItem?.condimentOrder.length -1 ? '' : ', ')
            ))

            return (
                <span className="lowercase"> {condimentString} </span>
            )
        }

        return (
            <p className="text-gray-600 text-[12px] tracking-[.88px] leading-[16px]  mt-[5px]" key={index}>
                {(() => {
                    if (cartItem.name == 'standard'){
                        return(
                            <span 
                                aria-label = {`${cartItem.quantity} ${cartItem.name} RoboBurger -`}
                                className  = "capitalize"
                            > 
                             {cartItem.quantity} {cartItem.name} RoboBurger 
                            </span>
                        )
                    } else {
                        return (
                            <span 
                                aria-label = {`${cartItem.quantity} ${cartItem.name} RoboBurger ${cartItem.condimentOrder.length > 0 ? "with" + mutateCondimentsToString(cartItem?.condimentOrder) : ''} -`}
                                className  = "capitalize"
                            > 
                                {cartItem.quantity} {cartItem.name} RoboBurger {cartItem.condimentOrder.length > 0 ? renderCondiments() : ''} 
                            </span>
                        )
                    }
                })()}
            </p>
        )
    } 

    return(
        <Link to={`/scan?orderId=${transaction.orderId}`} className="border-solid border-[1px] border-x-none border-t-0 border-b-[1px] border-opacity-20 border-[#70707054] px-[30px] leading-[16px] flex flex-row" key={componentKey}>
            <div className="w-11/12" tabIndex={0} role = "text">
                <h1 
                    className  = "text-black text-[15px] font-futura-bold tracking-[1.12px] mt-[21px]"
                    aria-label = {`Order number: ${padWithLeadingZeros(transaction.orderId)} -`}
                    // role       = "text"
                >
                    Order #{padWithLeadingZeros(transaction.orderId)}
                </h1>
                    {cartItems && cartItems?.map((cartItem, index) => 
                        renderCartItems(cartItem, index))}
                <p 
                    className  = "text-gray-600 text-[12px] tracking-[.88px] leading-[16px] pb-[21px] mt-[5px]"
                    aria-label = {dayjs.unix(transaction.transactionDate).format("MMMM D YYYY hh mm A") + `-`}
                    // role       = "text"
                >
                    {dayjs.unix(transaction.transactionDate).format("MM/DD/YYYY hh:mm A")}
                </p>
            </div>
            <div className="w-1/12 my-[2rem]">
                <GrayChevronRight className="h-4 w-4" fill="robo-primaryTwo"/>
            </div>
        </Link>
    )

}

export default TransactionHistoryItem

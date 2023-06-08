import React from 'react'
import { IMAGES } from '../../../../utilities/constants'


const ReceiptHeader = ({transaction}) => {

    return (
        <div className="flex flex-row gap-[17px] items-center justify-center text-center w-full flex flex-col pb-2">
            <img src={IMAGES.ROBOHOME} className="h-[85px] w-[85px] xxs:h-[75px] xxs:w-[75px] xxs:h-[80px] xxs:w-[80px] justify-center items-center" aria-label="RoboBurger Logo" tabIndex={0}/>
            <p 
                className  = "tracking-[0.16px] text-center justify-center md:text-xl sm:text-base xs:text-sm xxs:text-xs 3xs:text-3xs text-robo-primaryTwo" 
                role       = "text" 
                aria-label = {`${transaction?.vendingMachine?.location}, ${transaction?.vendingMachine?.address}, ${transaction?.vendingMachine?.city}, ${transaction?.vendingMachine?.postalCode}`} 
                tabIndex   = {0}
            >
                <span className='font-futura-bold'>{transaction?.vendingMachine?.location} </span> <br/>
                {transaction?.vendingMachine?.address}  <br/>
                {transaction?.vendingMachine?.city}, {transaction?.vendingMachine?.postalCode}
            </p>
        </div>
    )
}

export default ReceiptHeader
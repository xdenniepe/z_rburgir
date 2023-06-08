import React, { memo, useMemo, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import { PrevArrow, NextArrow } from '../../../../utilities/icons'
import QRItem from '../QRItem'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const QR = ({ transaction }) => {
    const [item, setItem] = useState(transaction?.transactionItems[0].productName)

    const invoiceMessage = `Scan this QR code to place the order at the RoboBurger Unit*`

    const renderQrCodes = useMemo(() => (
        transaction?.transactionItems.map((transactionItem, index) => (
            <QRItem key={`qr-item-${index}`} code={transactionItem.code} active={transactionItem.active} index={index} single={transaction?.transactionItems.length === 1} />
        ))
    ), [transaction])

    const arrowStyles = {
        position: 'absolute',
        zIndex: 20,
        top: 'calc(50% - 17px)',
        width: 30,
        height: 30,
        cursor: 'pointer',
    };

    const changeItem = (item) => {
        setItem(transaction?.transactionItems[item].productName)
    }

    const renderPrevArrow = (onClickHandler, hasPrev, label) => {
        return (
            <button type="button" className={`left-[40px] sm:left-[35px] xs:left-[30px] xxs:left-[25px] 3xs:left-[25px] ${ !hasPrev && 'opacity-20'} ${transaction.transactionItems.length === 2 ? "" : "hidden"}`} onClick={onClickHandler} title={label} style={arrowStyles} aria-label = "Left Arrow Icon - Previous QR" tabIndex   = {0} >
                <PrevArrow />
            </button>
        )
    }

    const renderNextArrow = (onClickHandler, hasNext, label) => {
        return (
            <button type="button" className={`right-[42px] sm:right-[36px] xs:right-[31px] xxs:right-[26px] 3xs:right-[26px] ${ !hasNext && 'opacity-20'} ${transaction.transactionItems.length === 2 ? "" : "hidden"}` } onClick={onClickHandler} title={label} style={arrowStyles} aria-label = "Right Arrow Icon - Next QR" tabIndex   = {0} >
                <NextArrow />
            </button>
        )
    }

    return (
        <div className="flex flex-col h-fit w-full h-full bg-[#ebe8e3]">
            <h1 
                aria-label = "Thank You Human!" 
                className  = "font-sans text-robo-currency text-540px] lg:text-5xl md:text-5xl xs:text-4xl sm:text-[40px] xxs:text-[32px] 3xs:text-[30px] text-center tracking-[0.4px]" 
                role       = "text" 
                tabIndex   = {0}
            > 
                Thank You Human! 
            </h1>

            <div className="text-center justify-center text-sm lg:text-lg md:text-[19px] sm:text-[18px] xs:text-[14px] xxs:text-sm 3xs:text-sm tracking-[0.17px] leading-[27px]" tabIndex={0} role = "text" aria-label = {` ${invoiceMessage} - ${transaction?.vendingMachine?.location} - ${transaction?.vendingMachine?.address} - ${transaction?.vendingMachine?.postalCode}`}>
                <p  
                    className   = "mt-[31px] sm:mt-[31px] xs:mt-[26px] xxs:mt-[24px] text-robo-currency" 
                    aria-hidden = {true}
                >
                    Scan this QR code to place the order <br/> 
                    at the RoboBurger unit* <br/>
                </p>
                <p className="mt-[22px] sm:mt-[22px] xs:mt-[18px] xxs:mt-4 font-futura-bold" aria-hidden = {true}> {transaction?.vendingMachine?.location} <br/> {transaction?.vendingMachine?.address}, {transaction?.vendingMachine?.postalCode} </p>
            </div>

            <div className="flex items-center justify-center h-fit lg:h-full md:h-full w-full mt-[22px] sm:mt-[22px] xs:mt-[18px] xxs:mt-4">
                <div className="qr-carousel">
                    <Carousel
                        showArrows            = {true}
                        showStatus            = {false}
                        showIndicators        = {false}
                        showThumbs            = {false}
                        centerMode            = {false}
                        onChange              = {(e) => changeItem(e)}
                        renderArrowPrev       = {(onClickHandler, hasPrev, label) => renderPrevArrow(onClickHandler, hasPrev, label)}
                        renderArrowNext       = {(onClickHandler, hasNext, label) => renderNextArrow(onClickHandler, hasNext, label)}
                    >
                        {renderQrCodes}
                    </Carousel>
                    <p 
                        className  = "text-black mt-[22px] sm:mt-[22px] xs:mt-[18px] xxs:mt-4 mb-[60px] text-[20px] font-futura-bold text-center capitalize"
                        aria-label = {`${item} RoboBurger`}
                        tabIndex   = {0}
                        role       = "text"
                    >
                        {item} RoboBurger
                    </p>
                </div>
            </div>
        </div>
    )
}


export default memo(QR)

import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Invoice from '../../../../components/Invoice'

const PDFInvoice = ({ paymentInfo, transaction, orderNo, discount, isRendered, invoice, handleClick }) => {
    return isRendered && transaction 
        ?
        <PDFDownloadLink 
            document = {
                <Invoice paymentInfo={paymentInfo} transaction={transaction} orderNo={orderNo} items={invoice} discount={discount}/>
            } 
            fileName = "Receipt"
        >
            {
                ({ loading }) => (
                    loading 
                        ?
                        <button 
                            className="font-futura-bold text-robo-primaryTwo text-lg mt-5" disabled
                        >
                            Loading Document
                        </button>
                        :
                        <button 
                            className = "underline text-robo-primaryTwo md:text-xl sm:text-md xs:text-sm xxs:text-xs 3xs:text-3xs font-futura" 
                            tabIndex  = {-1} 
                            onClick   = {handleClick}
                        >
                            Download as PDF
                        </button>
                )
            }
        </PDFDownloadLink>
        :
        null
}

export default PDFInvoice
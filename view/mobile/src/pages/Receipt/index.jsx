import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuthCtx } from '../../hooks'
import { GET } from '../../utilities/constants'
import { request } from '../../services/request'
import { BackButton } from '../../components/Common'
import { getSumOfArray } from '../../utilities/helpers'
import api from '../../services/api'
import EmptyCart from '../../components/EmptyState/EmptyCart'
import LoadingReceipt from './components/LoadingReceipt'
import OrderDetails from './components/OrderDetails'
import PaymentInfo from './components/PaymentInfo'
import PDFInvoice from './components/PDFInvoice'
import ResendReceipt from './components/ResendReceipt'
import ReceiptFooter from './components/ReceiptFooter'
import ReceiptHeader from './components/ReceiptHeader'

const Receipt = ({ toast, setHasLoaded, renderSr }) => {
    const { user }                                = useAuthCtx().state
    const [subtotal, setSubTotal]                 = useState(0)
    const [total, setTotal]                       = useState(0)
    const [tax, setTax]                           = useState(0)
    const [transaction, setTransaction]           = useState({})
    const [paymentInfo, setPaymentInfo]           = useState({})
    const [invoice, setInvoice]                   = useState([])
    const [coupon, setCoupon]                     = useState('')
    const [discount, setDiscount]                 = useState(0)
    const [isRendered, setIsRendered]             = useState(false)
    const [cardHolderNumber, setCardHolderNumber] = useState('')
    const [searchParam]                           = useSearchParams()

    const getInvoices = () => {
        let apiUrl    = searchParam.get('orderId') && searchParam.get('orderId') !== '' ? `${api.CART_ITEMS}/findByOrderId` : `${api.CART_ITEMS}/findLatestOrder`
        let apiParams = searchParam.get('orderId') && searchParam.get('orderId') !== '' ? { orderId : parseInt(searchParam.get('orderId')) } : { userId: user.userId }

        request({
            url   : apiUrl,
            method: GET,
            params: apiParams
        })
        .then(response => {
            const data = response.data
            setInvoice(data)
            getTransaction(data)

        })
        .catch(() => setInvoice([]))
    }

    const handleClick = () => toast('Success', 'File has been downloaded!')

    const getTransaction = (invoice) => {
        if (invoice)  {
            const tempTotal    = getSumOfArray(invoice?.map(invoice => invoice.total), 2)
            const tempSubtotal = getSumOfArray(invoice?.map(invoice => invoice.subtotal), 2)
            
            request({
                url   : api.TRANSACTIONS_SEARCH,
                method: GET,
                params: {
                    orderId: invoice[0].orderId,
                }
            })
            .then(response => {
                setSubTotal(tempSubtotal)
                setTax(tempTotal-tempSubtotal)
                if (response?.data?.couponId) {
                    request({
                        url   : `${api.COUPONS}/findById?`,
                        method: GET,
                        params: {
                            couponId: response.data.couponId
                        }
                    }).then(response => {
                        console.log(response.data)
                        let discount = 0;
                        discount = tempTotal * ( response.data.discountPercentage/100 ).toFixed(2)
                        // setCoupon(coupon)
                        setDiscount(discount)
                        setTotal((tempTotal - discount).toFixed(2))
                    })
                } else {
                    setTotal(tempTotal)
                }

                setTransaction(response?.data)
                getPaymentInfo(response?.data.payment)  
                setIsRendered(true)
            })
            .catch(error => console.log('Payment Error! ' + error))
        }
    }

    const getPaymentInfo = payment => {
        setPaymentInfo(payment)
        setCardHolderNumber(payment.piCreditCardNumber)
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        getInvoices()
    }, [])

    useEffect(() => {
        getTransaction()
        setHasLoaded(true)
    }, [transaction])

    return (
        <div className="w-full h-screen flex flex-col overflow-y-hidden">
            {renderSr()}

            <BackButton title="RECEIPT" />

            { 
                isRendered ? (
                    <div>
                        {
                            invoice ? (
                                <div className="w-full h-screen pb-44 overflow-y-auto tracking-[0.16px] font-futura sm:px-0 px-6 space-y-[17px] m-auto">
                                    <div className="m-auto w-full sm:w-[380px] xs:w-full xxs:w-full md:w-[428px] h-fit text-sm bg-white border border-1 border-[#70707033] drop-shadow-lg pt-[34px] xxs:px-8 xs:px-[34px] sm:px-[34px] md:px-[34px] xs:pb-[27px] xxs:pb-10 sm:pb-[23px] md:pb-[27px] xss:text-xxs">
                                        <ReceiptHeader transaction={transaction} />

                                        <OrderDetails invoice={invoice} transaction={transaction} />

                                        <div className="border border-gray-500/20 mt-2" />

                                        <PaymentInfo 
                                            subtotal           = {subtotal}
                                            tax                = {tax}
                                            total              = {total}
                                            discount           = {discount}
                                            cardNumberSlice    = {cardHolderNumber}
                                            paymentType        = {transaction?.payment?.piPaymenType}
                                            paymentAccountType = {transaction?.payment?.piAccountType} 
                                        />

                                        <div className="pt-1 text-center mt-[25px] xs:mt-[15px]">
                                            <ReceiptFooter user={user} />
                                            
                                            <PDFInvoice
                                                paymentInfo     = {paymentInfo} 
                                                transaction     = {transaction} 
                                                orderNo         = {invoice[0].orderId} 
                                                items           = {invoice} 
                                                coupon          = {coupon} 
                                                discount        = {discount} 
                                                isRendered      = {isRendered} 
                                                invoice         = {invoice} 
                                                handleClick     = {handleClick}
                                            />
                                        </div>     
                                    </div>
                                    
                                    <ResendReceipt toast={toast} />
                                </div>
                            ) : <EmptyCart />
                        }
                    </div>
                ) : <LoadingReceipt />
            }
        </div>
    )
}

export default Receipt
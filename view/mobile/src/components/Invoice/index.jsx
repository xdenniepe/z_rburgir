import React from 'react'
import { Page, Document, StyleSheet } from '@react-pdf/renderer'
import { addLeadingZeros, padWithLeadingZeros } from '../../utilities/helpers'
import HeaderLogo from './components/HeaderLogo'
import InvoiceItemsTable from './components/InvoiceItemsTable'
import LocationDetails from './components/LocationDetails'
import PaidWith from './components/PaidWith'
import ReceiptDetails from './components/ReceiptDetails'
import appleLogo from '../../assets/images/checkout/applepay-payment.png'
import dayjs from 'dayjs'
import logo from '../../assets/images/robo-logo.png'
import paypalLogo from '../../assets/images/checkout/paypal-payment.png'

const styles = StyleSheet.create({
    page: {
        fontFamily   : 'Helvetica',
        fontSize     : 12,
        paddingLeft  : 26,
        paddingRight : 26,
        lineHeight   : 1.5,
        flexDirection: 'column',
        alignItems   : 'center',
        color        : '#37250D'
    },
    logo: {
        marginLeft : 'auto',
        marginRight: 'auto'
    }
})

const Invoice = (props) => {
    const { transaction, paymentInfo, orderNo, items, coupon, discount } = props
    
    const invoice = {
        'id'          : padWithLeadingZeros(orderNo),
        'invoice_no'  : addLeadingZeros(orderNo, 10),
        'balance'     : `$${paymentInfo.tiAmount}`,
        'cardholder'  : paymentInfo.piCardholderName,
        'company'     : paymentInfo.tiMerchantAccount,
        'card_number' : paymentInfo.piCreditCardNumber,
        'account_type': paymentInfo.piAccountType,
        'discount'    : discount.toFixed(2),
        'email'       : '',
        'phone'       : '',
        'address'     : transaction.vendingMachine.address,
        'city'        : transaction.vendingMachine.city,
        'location'    : transaction.vendingMachine.location,
        'machine'     : transaction.vendingMachine.vendingMachineId,
        'trans_date'  : dayjs.unix(transaction.payment.tiTransactionDate).format('MM/DD/YYYY hh:mm A'),
        'items'       : items,
        'coupon'      : coupon,
        'total'       : (transaction.total - discount).toFixed(2),
        'subtotal'    : (transaction.subtotal * 1).toFixed(2),
        'tax'         : (transaction.total - transaction.subtotal).toFixed(2),
        'robologo'    : logo,
        'paypal_logo' : paypalLogo,
        'apple_logo'  : appleLogo,
        'postalCode'  : transaction.vendingMachine.postalCode
    }

    return (
        <Document>
            <Page size={284} style={styles?.page}>
                <HeaderLogo invoice={invoice} />
                <LocationDetails invoice={invoice} />
                <ReceiptDetails invoice={invoice} />
                <InvoiceItemsTable invoice={invoice} />
                <PaidWith invoice={invoice}/>
            </Page>
        </Document> 
    )
}

export default Invoice
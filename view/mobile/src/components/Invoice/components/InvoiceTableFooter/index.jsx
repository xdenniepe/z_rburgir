import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems   : 'center',
        height       : 24,
        fontStyle    : 'bold',
        marginLeft   : 82
    },
    name: {
        width    : 168,
        textAlign: 'left'
    },
    amount: {
        width    : 168,
        textAlign: 'right',
    }, 
    name2: {
        width     : 168,
        textAlign : 'left',
        fontFamily: 'Helvetica-Bold'
    }, 
    amount2: {
        width     : 168,
        textAlign : 'right',
        fontFamily: 'Helvetica-Bold'
    }, 
    promocode: {
        width    : 168,
        textAlign: 'left',
        color    : '#c7c3c1'
    }, 
    promoamount: {
        width    : 168,
        textAlign: 'right',
        color    : '#c7c3c1'
    }
})

const InvoiceTableFooter = ({ invoice }) => (
    <>
        <View style={styles.container}>
            <Text style={styles.name}> Subtotal </Text>
            <Text style={styles.amount}> &#36;{invoice.subtotal} </Text>
        </View>
        {
            invoice.discount === '0.00' 
                ? 
                <> </> 
                : 
                <View style={styles.container}>
                    <Text style={styles.promocode}> Promo Code </Text>
                    <Text style={styles.promoamount}> -&#36;{invoice.discount} </Text>
                </View> 
        }
        <View style={styles.container}>
            <Text style={styles.name}> Tax  </Text>
            <Text style={styles.amount}> &#36;{invoice.tax} </Text>
        </View>
        <View style={styles.container}>
            <Text style={styles.name2}> Total (USD) </Text>
            <Text style={styles.amount2}> &#36;{invoice.total} </Text>
        </View>
    </>
)

export default InvoiceTableFooter



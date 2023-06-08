import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems   : 'center',
        height       : 20,
        fontStyle    : 'bold'
    },
    qty: {
        width     : '50%',
        textAlign : 'left',
        fontFamily: 'Helvetica-Bold'
    },
    rate: {
        width     : '22%',
        textAlign : 'right',
        fontFamily: 'Helvetica-Bold'
    },
    amount: {
        width     : '28%',
        marginLeft: 4,
        textAlign : 'right',
        fontFamily: 'Helvetica-Bold'
    }
})

const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.qty}> Item </Text>
        <Text style={styles.rate}> Qty </Text>
        <Text style={styles.amount}> Price </Text>
    </View>
)

export default InvoiceTableHeader 
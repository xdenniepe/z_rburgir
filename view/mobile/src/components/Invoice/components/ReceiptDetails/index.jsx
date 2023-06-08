import React, { Fragment } from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    invoiceReceiptContainer: {
        flexDirection: 'row',
        marginTop    : 13,
        marginLeft   : 0,
        marginRight  : 'auto',
        fontFamily   : 'Helvetica-Bold',
        lineHeight   : 2
    },
    invoiceDateContainer: {
        flexDirection: 'row',
        marginLeft   : 0,
        marginRight  : 'auto',
        lineHeight   : 2
    }
})

const ReceiptDetails = ({ invoice }) => (
    <Fragment>
        <View style={styles.invoiceReceiptContainer}>
            <Text> Receipt # </Text>
            <Text> {invoice.id} </Text>
        </View>
        <View style={styles.invoiceDateContainer}>
            <Text> Date: </Text>
            <Text> {invoice.trans_date} </Text>
        </View>
        <View style={styles.invoiceDateContainer}>
            <Text> RoboBurger Unit: </Text>
            <Text> {invoice.machine} </Text>
        </View>
    </Fragment>
)

export default ReceiptDetails
import React from 'react'
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'column',
        marginTop    : 14,
        marginBottom : 21,
        marginLeft   : 0,
        marginRight  : 'auto'
    },
    reportTitle: {
        // letterSpacing: 4,
        fontSize : 12,
        textAlign: 'left'
    },
    logo: {
        width : 30,
        height: 13
    }, 
    paypallogo: {
        width : 65,
        height: 13
    },
    paymentMethod: {
        flexDirection: 'row'
    },
    paymentMethod2: {
        flexDirection: 'col'
    }
})

const PaidWith = ({ invoice }) => (
    <View style={styles.titleContainer}>
        {
            invoice.account_type === 'paypal_account' 
                ? 
                <View style={styles.paymentMethod}> 
                    <Text style={styles.reportTitle}> Paid with: </Text>
                    <Image style={styles.paypallogo} src={invoice.paypal_logo} />
                </View> 
                : 
                invoice.account_type === 'credit_card' 
                ? 
                <View style={styles.paymentMethod2}>
                    <Text style={styles.reportTitle}> Paid with: Credit Card </Text>
                    <Text style={styles.reportTitle}> {invoice.card_number} </Text>  
                </View> 
                :
                <View style={styles.paymentMethod}> 
                    <Text style={styles.reportTitle}> Paid with: </Text>
                    <Image style={styles.logo} src={invoice.apple_logo} />
                </View>  
        }
    </View>
)
  
  export default PaidWith
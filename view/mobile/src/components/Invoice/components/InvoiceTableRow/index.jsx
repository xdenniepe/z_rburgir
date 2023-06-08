import React, { Fragment } from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'
import { mutateCondimentsToString } from '../../../../utilities/helpers'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems   : 'center',
        height       : 22,
        textAlign    : 'center',
        fontFamily   : 'Helvetica-Bold'
    },
    name: {
        width        : 140,
        textAlign    : 'left',
        fontSize     : 11,
        textTransform: 'capitalize'
    },
    qty: {
        width    : 25,
        textAlign: 'right'
    },
    amount: {
        width    : 66,
        textAlign: 'right'
    },
    condiment: {
        lineHeight   : 2,
        fontSize     : 9,
        textTransform: 'capitalize'
    },
    container2: {
        fontFamily   : 'Helvetica-Bold',
        width        : 110,
        flexDirection: 'column',
        marginLeft   : 0,
        marginRight  : 'auto',
        alignItems   : 'left',
        paddingBottom: 4
    },
    customcontainer: {
        flexDirection: 'row',
        alignItems   : 'center',
        height       : 19,
        textAlign    : 'center',
        fontFamily   : 'Helvetica-Bold'
    }
})

const InvoiceTableRow = ({ items }) => {
    const rows = items.map(item => 
        <div key={item.productOrderId.toString()}>
            <View style={item.name === 'custom' ? styles.customcontainer : styles.container}>
                <Text style={styles.name}> {item.name} RoboBurger </Text>
                <Text style={styles.qty}> {item.quantity} </Text>
                <Text style={styles.amount}> &#36;{(item.price*1).toFixed(2)} </Text>
            </View>
            { 
                item.name === 'custom' 
                    ?
                    <View style={styles.container2}>
                        <Text style={styles.condiment}>
                            {item.condimentOrder.length > 0 && '('}
                            {mutateCondimentsToString(item.condimentOrder)}
                            {item.condimentOrder.length > 0 && ')'}
                        </Text>
                    </View>
                    :
                    <> </>
            }
        </div>
    )

    return (<Fragment> {rows} </Fragment>)
}
  
  export default InvoiceTableRow
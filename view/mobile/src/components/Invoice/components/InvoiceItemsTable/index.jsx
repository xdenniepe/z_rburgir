import React from 'react'
import { View, StyleSheet, Line, Svg } from '@react-pdf/renderer'
import InvoiceTableHeader from '../InvoiceTableHeader'
import InvoiceTableRow from '../InvoiceTableRow'
import InvoiceTableFooter from '../InvoiceTableFooter'

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap     : 'wrap',
        marginTop    : 14,
    }, 
	line: {
       marginBottom : '5px',
       opacity      : '27%',
       paddingBottom: 5
  	}
})

const InvoiceItemsTable = ({ invoice }) => (
    <View style={styles.tableContainer}>
        <InvoiceTableHeader />
        <InvoiceTableRow items={invoice.items} />
        <Svg height="1" width="250" style={styles.line}>
			<Line
				x1 = "0"
				y1 = "0"
				x2 = "250"
				y2 = "0"
				stroke = "rgb(216, 216, 216)"
				strokeWidth = {3}
			/>
        </Svg>
        <InvoiceTableFooter invoice={invoice} />
    </View>
)
  
export default InvoiceItemsTable
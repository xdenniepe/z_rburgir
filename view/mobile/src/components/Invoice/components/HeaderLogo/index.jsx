import React from 'react'
import { View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 17
    },
   	logo: {
        width      : 66,
        height     : 66,
        marginLeft : 'auto',
        marginRight: 'auto'
    }
})

const HeaderLogo = ({ invoice }) => (
	<View style={styles.headerContainer}>
		<Image style={styles.logo} src={invoice.robologo} />
	</View>
)
  
export default HeaderLogo
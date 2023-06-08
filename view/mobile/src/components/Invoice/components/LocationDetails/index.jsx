import React from 'react'
import { Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'column',
        marginTop    : 13,
        marginLeft   : 'auto',
        marginRight  : 'auto',
        alignItems   : 'center'
    },
    location: {
        // textTransform: 'uppercase',
        fontSize: 12,
        margin  : 'auto'
    }, 
    location2: {
        // textTransform: 'uppercase',
        fontSize  : 12,
        margin    : 'auto',
        fontFamily: 'Helvetica-Bold'
    }
})

const LocationDetails = ({ invoice }) => (
    <View style={styles.titleContainer}>
        <Text style={styles.location2}> {invoice.location} </Text>
        <Text style={styles.location}> {invoice.address} </Text>
        <Text style={styles.location}> {invoice.city}, {invoice.postalCode} </Text>
    </View>
)

export default LocationDetails
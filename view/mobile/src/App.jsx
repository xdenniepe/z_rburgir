import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './providers/authProvider'
import AppRoutes from './router/index'
import DeviceDetector from './utilities/deviceDetector'
import LocationProvider from './providers/locationProvider'

const App = () => {
    return (
        <AuthProvider>
            <LocationProvider>
                <BrowserRouter>
                    <DeviceDetector />
                    <AppRoutes />
                </BrowserRouter>
            </LocationProvider> 
        </AuthProvider>
    )
}

export default App
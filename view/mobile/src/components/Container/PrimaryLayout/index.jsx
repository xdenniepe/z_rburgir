import React from 'react'
import { useLocation } from 'react-router-dom'
import { useOrderCtx, useUpdateEffect } from '../../../hooks'
import { isEmptyObject } from '../../../utilities/helpers'
import SideBar from './components/SideBar'
import MainContent from './components/MainContent'
import BottomNavigation from '../../Dashboard/BottomNavigation'

const PrimaryLayout = ({ children, hideNavigation, setHasLoaded, sidebarOpen, setSidebarOpen }) => {
    const { order }       = useOrderCtx().state
    const { getInvoices } = useOrderCtx().apis
    const { pathname }    = useLocation()

    useUpdateEffect(() => {
        if (!isEmptyObject(order)) {
			getInvoices()
		}
    }, [order])

    return (
        <>
            <SideBar 
                setHasLoaded   = {setHasLoaded}
                sidebarOpen    = {sidebarOpen}
                setSidebarOpen = {setSidebarOpen}
            />
            
            <div className="h-screen flex flex-col flex-1 flex-end font-body">
                <MainContent children={children} />

                {
                    pathname !== '/settings' 
                        ?  <BottomNavigation
                                hidden         = {hideNavigation}
                                setHasLoaded   = {setHasLoaded}
                                sidebarOpen    = {sidebarOpen}
                                setSidebarOpen = {setSidebarOpen}
                            />
                        :   null
                }
            </div>
        </>
    )
}

export default PrimaryLayout
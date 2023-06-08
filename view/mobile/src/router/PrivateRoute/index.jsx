import React, { useState } from 'react'
import { useEffectOnce, useAuthCtx, useLocationCtx } from '../../hooks'
import { Navigate, useLocation } from 'react-router-dom'
import { Base, MenuLayout, PrimaryLayout } from '../../components/Container'
import { getLocalStorageItem, isEmptyObject } from '../../utilities/helpers'
import OrderProvider from '../../providers/orderProvider'
import ProductProvider from '../../providers/productProvider'

const MainLayout = props => {
    const { layout, history, title, srTitle, content, hideNavigation, to, setHasLoaded, refs, sidebarOpen, setSidebarOpen } = props

    switch (layout) {
        case 'Menu':
            return (
                <OrderProvider>
                    <ProductProvider>
                        <MenuLayout history={history} setHasLoaded={setHasLoaded}>
                            <Base 
                                main         = {content} 
                                srTitle      = {srTitle} 
                                layout       = "ML" 
                                title        = {title} 
                                setHasLoaded = {setHasLoaded} 
                                refs         = {refs} 
                                sidebarOpen  = {sidebarOpen}
                            />
                        </MenuLayout>
                    </ProductProvider>
                </OrderProvider>
            )
        case 'Primary':
            return (
                <OrderProvider>
                    <ProductProvider>
                        <PrimaryLayout 
                            title          = {title} 
                            hideNavigation = {hideNavigation} 
                            to             = {to} 
                            access         = "PRIVATE" 
                            setHasLoaded   = {setHasLoaded} 
                            sidebarOpen    = {sidebarOpen} 
                            setSidebarOpen = {setSidebarOpen} 
                        >
                            <Base 
                                main           = {content} 
                                layout         = "PL" 
                                srTitle        = {srTitle} 
                                title          = {title} 
                                setHasLoaded   = {setHasLoaded} 
                                refs           = {refs} 
                                sidebarOpen    = {sidebarOpen} 
                                setSidebarOpen = {setSidebarOpen} 
                            />
                        </PrimaryLayout>
                    </ProductProvider>
                </OrderProvider>
            )
        default: 
            return (
                <Base 
                    main           = {content} 
                    layout         = {""} 
                    title          = {title} 
                    srTitle        = {srTitle} 
                    setHasLoaded   = {setHasLoaded} 
                    refs           = {refs} 
                    setSidebarOpen = {setSidebarOpen}
                    sidebarOpen    = {sidebarOpen} 
                />
            )
    }
}

const PrivateRoute = props => {
    const { children, layout, history, title, srTitle, main, hideNavigation, to, setHasLoaded, refs, sidebarOpen, setSidebarOpen } = props
    const { token }                  = useAuthCtx().state
    const { selectedVendingMachine } = useLocationCtx().state
    const { pathname }               = useLocation()
    const [pageRestricted, setPageRestricted] = useState(false)
    
    const guestLogin = getLocalStorageItem('guestLogin')
    
    const guestRestrictedPages = [
        'EDIT PROFILE'
    ]

    const isPageRestricted = (pageTitle) => {
        guestRestrictedPages.map((page) => (
            pageTitle === page &&
                setPageRestricted(true)
        ))
    }
    
    useEffectOnce(() => {
        isPageRestricted(title)
    })

    if (token) {
        if (guestLogin === 'guest' && pageRestricted) {
            return <Navigate to="/error" />
        } else if (!isEmptyObject(selectedVendingMachine) && pathname === '/locations') {
            return <Navigate to="/products" />
        } else if (isEmptyObject(selectedVendingMachine) && pathname === '/products') {
            return <Navigate to="/locations" />
        } else {
            return (
                <MainLayout
                    children       = {children}
                    content        = {main}
                    hideNavigation = {hideNavigation}
                    history        = {history}
                    layout         = {layout}
                    refs           = {refs}
                    setHasLoaded   = {setHasLoaded}
                    setSidebarOpen = {setSidebarOpen}
                    sidebarOpen    = {sidebarOpen}
                    srTitle        = {srTitle}
                    title          = {title}
                    to             = {to}
                /> 
            )
        }
    } 
        
    return <Navigate to="/" />
}


export default PrivateRoute
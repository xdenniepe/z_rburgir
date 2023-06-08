import React, { useEffect } from 'react'
import { useAuthCtx } from '../../hooks'
import { useLocation, useSearchParams, Navigate } from 'react-router-dom'
import { Base, MenuLayout, PrimaryLayout } from '../../components/Container'
import { setLocalStorageItem } from '../../utilities/helpers'

const MainLayout = props => {
    const { layout, history, content, hideNavigation, title, srTitle, setHasLoaded, refs, sidebarOpen, setSidebarOpen } = props
    const { pathname } = useLocation()
    
    useEffect(() => {
        if(pathname === '/signup' || pathname === '/signin' || pathname === '/forgotpassword' || pathname === '/resetpassword' || pathname === '/success') {
            setLocalStorageItem('openpath', pathname)
            setHasLoaded(true)
        }
    }, [pathname])

    switch(layout) {
        case 'Menu': 
            return (
                <MenuLayout history={history} srTitle={srTitle} to={-1} setHasLoaded={setHasLoaded}>
                    <Base main={content} layout="ML" title={title} srTitle={srTitle} setHasLoaded={setHasLoaded} refs={refs} sidebarOpen={sidebarOpen} />
                </MenuLayout>
            )
        case 'Primary':
            return (
                <PrimaryLayout hideNavigation={hideNavigation} setHasLoaded={setHasLoaded} access="PUBLIC" title={title} to={-1} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                    <Base main={content} layout="PL"  title={title} srTitle={srTitle} setHasLoaded={setHasLoaded} refs={refs} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </PrimaryLayout>
            )
        default: 
            return <Base main={content} layout="" title={title} srTitle={srTitle} setHasLoaded={setHasLoaded} refs={refs} sidebarOpen={sidebarOpen} />
    }
}

const PublicRoute = props => {
    const { children, layout, main, hideNavigation, title, srTitle, to, setHasLoaded, refs, sidebarOpen, setSidebarOpen } = props
    const { token }       = useAuthCtx().state
    const { pathname }    = useLocation()
    const [searchParams]  = useSearchParams()

    const message = searchParams.get('message')

    const successMessages = [
        'accountverified',
        'verifyemail',
        'verifyphonenumber',
        'passwordchange',
        'verifyemailandphonenumber',
        'unsubscribesuccess'
    ]

    const arrayIncludes = arr => msg => arr.includes(msg)

    const doesArrayInclude = arrayIncludes(successMessages)

    const result = doesArrayInclude(message)

    if (token && (pathname !== '/success' && pathname !== '/unsubscribe')) {
        return <Navigate to="/" />
    } else if (pathname === '/success' && !result) {
        return <Navigate to="/error" />
    }


    return (
        <MainLayout
            children       = {children}
            content        = {main}
            hideNavigation = {hideNavigation}
            history        = {to}
            layout         = {layout}
            refs           = {refs}
            setHasLoaded   = {setHasLoaded}
            setSidebarOpen = {setSidebarOpen}
            sidebarOpen    = {sidebarOpen}
            srTitle        = {srTitle} 
            title          = {title}
        />
    )
}

export default PublicRoute

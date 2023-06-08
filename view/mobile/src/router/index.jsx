import React, { useEffect, useRef, useState } from 'react'
import { useAuthCtx, useLocationCtx } from '../hooks'
import { Navigate, Route, Routes } from 'react-router-dom'
import { isEmptyObject } from '../utilities/helpers'

// Routes
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

// Pages
import AccessibilityStatement from '../pages/AccessibilityStatement'
import Checkout from '../pages/Checkout'
import Contact from '../pages/ContactUs'
import Error from '../pages/Error'
import ForgotPassword from '../pages/ForgotPassword'
import Home from '../pages/Home'
import LandingPage from '../pages/LandingPage'
import Locations from '../pages/Locations'
import NutritionFacts from '../pages/NutritionFacts'
import Order from '../pages/Order'
import Payment from '../pages/Payment'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import Product from '../pages/Product'
import Products from '../pages/Products'
import Profile from '../pages/Profile'
import PurchaseHistory from '../pages/PurchaseHistory'
import Receipt from '../pages/Receipt'
import ResetPassword from '../pages/ResetPassword'
import Scan from '../pages/Scan'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Success from '../pages/Success'
import TermsConditions from '../pages/TermsConditions'
import SplashScreen from '../pages/SplashScreen'
import Unsubscribe from '../pages/Unsubscribe'

const AppRoutes = () => {
    const { token }                     = useAuthCtx().state
    const { selectedVendingMachine }    = useLocationCtx().state
    const [hasLoaded, setHasLoaded]     = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    
    const refs = useRef(null)
    
    const getRedirectRoute = selectedVendingMachine => isEmptyObject(selectedVendingMachine) ? '/locations' : '/products' 

    const redirectRoute = getRedirectRoute(selectedVendingMachine)

    useEffect(() => {
        if (refs.current && hasLoaded) {
            refs.current.focus()
            setHasLoaded(false)
        }
    }, [hasLoaded])

    return (
        <Routes>
            <Route path="/" element={<Navigate to={token ? redirectRoute : '/loading'} />} />

            {/* PUBLIC ROUTES */}
            <Route path="/loading"             element={<PublicRoute setHasLoaded={setHasLoaded} refs={refs} layout="" main={SplashScreen}   title="ROBOBURGER"      srTitle="Roboburger Splash Screen"/>} />
            <Route path="/landingpage"         element={<PublicRoute setHasLoaded={setHasLoaded} refs={refs} layout="" main={LandingPage}    title="LANDING PAGE"    srTitle="Roboburger Landing Page"/>} />
            <Route path="/forgotpassword"      element={<PublicRoute setHasLoaded={setHasLoaded} refs={refs} layout="" main={ForgotPassword} title="FORGOT PASSWORD" srTitle="Reset Password Page"/>} />
            <Route path="/resetpassword/:code" element={<PublicRoute setHasLoaded={setHasLoaded} refs={refs} layout="" main={ResetPassword}  title="RESET PASSWORD"  srTitle="Reset Password Page"/>} />
            <Route path="/signin"              element={<PublicRoute setHasLoaded={setHasLoaded} refs={refs} layout="" main={SignIn}         title="LOGIN"           srTitle="Login Page"  to={'/landingpage'}/>} />
            <Route path="/signup"              element={<PublicRoute setHasLoaded={setHasLoaded} refs={refs} layout="" main={SignUp}         title="SIGNUP"          srTitle="Sign Up Page" to={'/landingpage'}/>} />
            <Route path="/success"             element={<PublicRoute setHasLoaded={setHasLoaded} refs={refs} layout="" main={Success}        title="SUCCESS"         srTitle="Success Page"/>} />
            <Route path="/unsubscribe"         element={<PublicRoute setHasLoaded={setHasLoaded} refs={refs} layout="" main={Unsubscribe}    title="UNSUBSCRIBE"     srTitle="Unsubscribe Page"/>} />
             
            {/* PRIVATE ROUTES */}
            <Route path="/checkout"        element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Checkout}        title="PURCHASE"         srTitle="Creditcard Payment Page"         to={-1} />} />
            <Route path="/locations"       element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Locations}       title="LOCATIONS"        srTitle="Location Page"        to={-1} />} />
            <Route path="/order"           element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Order}           title="YOUR CART"        srTitle="Cart Page"        to={-1} />} />
            <Route path="/products"        element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Products}        title="MENU"             srTitle="Menu Page"        to={-1} />} />
            <Route path="/product"         element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Product}         title="PRODUCT"          srTitle="Custom Roboburger Page"     to={-1} />} />
            <Route path="/nutritionfacts"  element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={NutritionFacts}  title="NUTRITION FACTS"  srTitle="Nutrition Facts Page"  to={-1} />} />
            <Route path="/payment"         element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Payment}         title="PAYMENT"          srTitle="CheckOut Page"          to={-1} />} />
            <Route path="/home"            element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Home}            title="HOME"             srTitle="Home Page"             to={-1} />} />
            <Route path="/purchasehistory" element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={PurchaseHistory} title="PURCHASE HISTORY" srTitle="Purchase History Page" to={-1} />} />
            <Route path="/receipt"         element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Receipt}         title="RECEIPT"          srTitle="Order Receipt Page"          to={-1} />} />
            <Route path="/settings"        element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Profile}         title="EDIT PROFILE"     srTitle="User Profile Page"     to="/"  />} />
            <Route path="/scan"            element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Scan}            title="SCAN"             srTitle="Scan QR Page"        to={-1} />} />

            {/* LEGALITIES */}
            <Route path="/accessibility"      element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={AccessibilityStatement} title="ACCESSIBILITY STATEMENT" srTitle="Accessibility Statement Page" to={-1} />} />
            <Route path="/contact"            element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Contact}                title="CONTACT"                 srTitle="Contact Us Page"                 to={-1} />} />
            <Route path="/privacypolicy"      element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={PrivacyPolicy}          title="PRIVACY"                 srTitle="Privacy Policy Page"          to={-1}  />} />
            <Route path="/termsandconditions" element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={TermsConditions}        title="TERMS AND CONDITIONS"    srTitle="Terms and Conditions Page"    to={-1} />} />

            {/* ERROR ROUTES */}
            <Route path="/error" element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Error} title="PAGE NOT FOUND" srTitle="404 Page" to="/" />} /> 
            <Route path="*"      element={<PrivateRoute sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setHasLoaded={setHasLoaded} refs={refs} layout="Primary" main={Error} title="PAGE NOT FOUND" srTitle="Page Not Found" to="/" />} /> 
        </Routes>
    )
}

export default AppRoutes

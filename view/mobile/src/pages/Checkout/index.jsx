import React from 'react'
import { BackButton } from '../../components/Common'
import CreditDebitCheckout from './components/CreditDebitCheckout'

const Checkout = ({ toast, renderSr, setHasLoaded }) => {
    return (
        <div className="h-screen flex flex-col bg-[#ffff]">
            {renderSr()}

            <BackButton title="CARD DETAILS" />
            
            <CreditDebitCheckout toast={toast} setHasLoaded={setHasLoaded} />
        </div>
    )

}

export default Checkout
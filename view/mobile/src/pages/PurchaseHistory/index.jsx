import React, { useEffect, useState } from 'react'
import { useAuthCtx } from '../../hooks'
import { useLocation } from 'react-router-dom'
import { request } from '../../services/request'
import { GET } from '../../utilities/constants'
import { BackButton } from '../../components/Common'
import { isEmptyArray } from '../../utilities/helpers'
import TransactionHistoryItem from './components/TransactionHistyoryItem'
import api from '../../services/api'

const PurchaseHistory = ({ renderSr, setHasLoaded, setSidebarOpen }) => {
    const { user }     = useAuthCtx().state
    const { pathname } = useLocation()
    const [transaction, setTransaction] = useState({})
    const [loading, setLoading]         = useState(true)

    const getTransaction = () => {
        request({
            url   : api.TRANSACTION_HISTORY,
            method: GET,
            params: {
                userId: user.userId
            }
        })
        .then(res => {
            setTransaction(res.data)
            setLoading(false)
        })
        .catch(err => console.error(err?.message || err))
    }

    const renderHistory = (transaction) => {
        return (
                loading 
                    ?
                    <p className="text-gray-200 text-[16px] tracking-[1.28px] leading-[24px] px-[30px] mt-[10px]">Loading.. .</p>
                    : 
                    <div className="max-h-[221px] overflow-y-auto bg-[#FCFCFC] border-b-1 border-[#70707054]">
                        {   
                            !isEmptyArray(transaction) ? 
                            transaction?.map((transactionItem, key) => 
                                <TransactionHistoryItem 
                                    transaction     = {transactionItem} 
                                    key             = {transactionItem?.orderId} 
                                    transactionType = "active"
                                    componentKey    = {key}
                                />
                            )
                            :
                            <p 
                                className  = "text-gray-200 text-[16px] tracking-[1.28px] leading-[24px] px-[30px] mt-[10px]" 
                                aria-label = "no orders yet" 
                                tabIndex   = {0} 
                                role       = "text"
                                >
                                    No orders yet.
                                </p>
                        }
                    </div>
        )
    }
 
    useEffect(() => {
		setHasLoaded(true)
        getTransaction()

        window.scrollTo(0, 0)
	}, [])

    return (
        <div className="h-screen flex flex-col md:p-8 bg-[#ffff] overflow-y-scroll overflow-x-hidden" aria-label="Purchase History"> 
            { renderSr() }
            <div className="w-full h-[61px] absolute top-0 border-b border-[#707070] border-opacity-20">  
                <p 
                    className  = "flex text-center justify-center w-full absolute top-[19.5px] leading-[22px] font-futura-bold tracking-[1.22px] text-[#3A2103] text-[15px]" 
                    aria-label = "PURCHASE HISTORY" 
                    tabIndex   = {0}
                > 
                    PURCHASE HISTORY 
                </p>
            </div>

            <BackButton
                pathname       = {pathname}
                setSidebarOpen = {setSidebarOpen}
            />

            <div className="mt-34">
                <div className="flex flex-row border-b-[1px] border-x-none border-[#70707054] tracking-[1.28px] leading-[24px] font-futura-bold px-[30px] pb-[11px]">
                    <h1 className="w-1/2 text-left text-[16px]" aria-label="Active Orders" tabIndex={0} role="text">Active Orders</h1>
                </div>
                
                { renderHistory(transaction?.activeOrders) }
                
            </div>

            <div className={`pt-[75px] ] ${loading ? '' : 'border-t-1 border-[#70707054'}` }>
                <div className="flex flex-row border-b-[1px] border-x-none border-t-0 border-[#70707054] tracking-[1.28px] leading-[24px] font-futura-bold px-[30px] pb-[11px]">
                    <h1 className="w-1/2 text-left text-[16px] " aria-label="Past Orders" tabIndex={0} role="text">Past Orders</h1>
                </div>

                { renderHistory(transaction?.pastOrders) }
                
            </div>
        </div>
    )
}

export default PurchaseHistory
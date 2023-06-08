import { useEffect, useMemo, useReducer } from 'react'
import { useAuthCtx, useUpdateEffect } from '../hooks'
import { request } from '../services/request'
import { isEmptyArray, setLocalStorageItem } from '../utilities/helpers'
import { GET, DELETE, POST } from '../utilities/constants'
import OrderContext from '../contexts/orderContext'
import OrderReducer, { initializer, initialState, SET_COUPON_INFO, SET_INVOICES, SET_LATEST_INVOICE, SET_ORDER, SET_PAYMENT_INFO, SET_TOTAL_ITEMS, SET_TRANSACTION, TOGGLE_IS_CART_FULL } from '../reducers/orderReducer'
import api from '../services/api'
import dayjs from 'dayjs'

const OrderProvider = ({ children }) => {
	const [state, dispatch] = useReducer(OrderReducer, initialState, initializer)
	const { user } = useAuthCtx().state
	const { couponInfo, invoices, latestInvoice, order, paymentInfo, totalItems, transaction } = state

	const getOrderId = invoices => isEmptyArray(invoices) ? null : invoices[0].orderId

	const orderId = useMemo(() => getOrderId(invoices), [invoices])

	const addOrder = () => {
		request({
			url	  : api.ORDERS,
			method: POST,
			data  : {
				userId: user.userId,
                status: 'PENDING',
			}
		})
		.then(() => setCurrentOrder())
		.catch(err => console.error('error : ', err?.message || err))
	}

	const addPendingOrder = () => {
		return request({
			url	  : api.ORDERS,
			method: POST,
			data  : {
				userId: user.userId,
                status: 'PENDING',
			}
		})
	}

	const clearUserCart = orderId => {	
		request({
			url   : `${api.CLEAR_CART}/${orderId}`,
			method: DELETE
		})
		.then(() => getInvoices())
		.catch(error => {console.log(error)})
	}

	const getCurrentOrder = userId => {
		return request({
			url	  : `${api.ORDERS}/search/findByUserId`,
			method: GET,
			params: {
				projection: 'withId',
				userId	  : userId
			}
		})
	}

	const getInvoices = () => {
		request({
			url   : api.CART_ITEMS,
			method: GET,
			params: {
				userId: user.userId,
			}
		})
		.then(response => {
			let totalItems = 0
			
			response?.data.map((cartItem) => (
				totalItems = totalItems + cartItem.quantity
			))

			dispatch({   
				type      : SET_INVOICES,
				payload   : response.data,
				isLoading : false
			})

			dispatch({
				type   : SET_TOTAL_ITEMS,
				payload: totalItems
			})

			dispatch({
				type   : TOGGLE_IS_CART_FULL,
				payload: totalItems === 2 ? true : false
			})
		})
		.catch(err => console.log('invoices error -> ', err?.message || err))
	}

	const getPendingOrder = () => {
		return request({
			url	  : `${api.ORDERS}/search/findByUserId`,
			method: GET,
			params: {
				projection: 'withId',
				userId	  : user.userId
			}
		})
	}

	const getPendingQuantity = orderId => {
        return  request({
            url   : api.GET_ORDER_QUANTITY,
            method: GET,
            params: {
                orderId: orderId
            }
        })
    }

	const sendReceipt = () => {
		const cardHolderNum = paymentInfo?.piCreditCardNumber

		return request({
            url: api.RECEIPT,
            method: POST,
            data : {
                orderId      : latestInvoice[0].orderId,
                paymentEmail : user?.email,
				phoneNumber  : user?.phoneNumber,
                invoicePdf   : {
                    paymentInfo    : paymentInfo,
                    transaction    : transaction,
                    items          : latestInvoice,
                    discount       : couponInfo.discount,
                    coupon         : couponInfo.coupon || 'Discount',
                    transactionDate: dayjs.unix(transaction?.payment?.tiTransactionDate).format("MM/DD/YYYY hh:mm A"),
					cardNum        : cardHolderNum,
                    receiptUrl     : window.location.origin + '/receipt?orderId=' + latestInvoice[0].orderId,
					redirectUrl    : window.location.origin,
                },
            }
        })
	}

	const setCouponInfo = payload => {
		const type = SET_COUPON_INFO

		dispatch({ type, payload })
	}

	const setCurrentOrder = async () => {
		try {
			const getOrderRes = await getCurrentOrder(user.userId)
			const payload     = getOrderRes.data
			const type        = SET_ORDER

			dispatch({ type, payload })
		} catch (err) {
			console.log(err?.message || err)
			addOrder()
		}
	}

	const setLatestInvoice = payload => {
		const type = SET_LATEST_INVOICE

		dispatch({ type, payload })
	}

	const setPaymentInfo = payload => {
		const type = SET_PAYMENT_INFO

		dispatch({ type, payload })
	}

	const setTransaction = payload => {
		const type = SET_TRANSACTION

		dispatch({ type, payload })
	}

	const apis = {
		addOrder, 
		addPendingOrder,
		clearUserCart, 
		getCurrentOrder,
		getInvoices,
		getPendingOrder,
		getPendingQuantity,
		sendReceipt,
		setCouponInfo,
		setCurrentOrder,
		setLatestInvoice,
		setPaymentInfo,
		setTransaction
	}

	const providerValues = { 
		apis,
		state, 
		orderId, 
		dispatch
	}

	useEffect(() => {
		setLocalStorageItem('couponInfo', couponInfo)
	}, [couponInfo])

	useUpdateEffect(() => {
		setLocalStorageItem('invoices', invoices)
	}, [invoices])

	useUpdateEffect(() => {
		setLocalStorageItem('latestInvoice', latestInvoice)
	}, [latestInvoice])
	
	useUpdateEffect(() => {
		setLocalStorageItem('order', order)
	}, [order])

	useEffect(() => {
		setLocalStorageItem('paymentInfo', paymentInfo)
	}, [paymentInfo])
	
	useUpdateEffect(() => {
		setLocalStorageItem('totalItems', totalItems)
	}, [totalItems])
	
	useEffect(() => {
		setLocalStorageItem('transaction', transaction)
	}, [transaction])
	
	return (
		<OrderContext.Provider value={providerValues}>
			{children}
		</OrderContext.Provider>
	)
}

export default OrderProvider
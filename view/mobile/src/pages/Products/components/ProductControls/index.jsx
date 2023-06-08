import React, { useState, useEffect } from 'react'
import { useAuthCtx, useLocationCtx, useOrderCtx } from '../../../../hooks'
import { SET_INVOICES, SET_ORDER, SET_TOTAL_ITEMS, TOGGLE_IS_CART_FULL } from '../../../../reducers/orderReducer'
import { isEmptyArray } from 'formik'
import { request } from '../../../../services/request'
import { GET, POST } from '../../../../utilities/constants'
import { AddOrder0, MinusOrder0 } from '../../../../utilities/icons'
import { getLocalStorageItem, isEmptyObject } from '../../../../utilities/helpers'
import { useNavigate } from 'react-router-dom'
import api from '../../../../services/api'

const ProductControls = ({ product, toast, productCondiments }) => {
    const { user }                   = useAuthCtx().state
    const { selectedVendingMachine } = useLocationCtx().state
    const { dispatch, state, apis }  = useOrderCtx()
    const { userId }   = user           
    const { invoices } = state 
    const { addPendingOrder, getPendingOrder, getPendingQuantity } = apis

    const [orderQuantity, setOrderQuantity]     = useState(1)
    const [productOrderQty, setProductOrderQty] = useState(0)
    
    const productId = product?.productId

    const navigate = useNavigate()

    const addOrder = (quantity, orderId) => {
        const customCondiments = getLocalStorageItem('options')?.length > 0 ? getLocalStorageItem('options') : []

        request({
            url   : api.ADD_ORDERS,
            method: POST,
            data  : {
                quantity              : product.name === 'standard' ? productOrderQty + quantity : quantity,
                orderId               : orderId,
                productId             : productId,
                vendingMachineId      : selectedVendingMachine.value,
                name                  : product.name.toUpperCase(),
                productOrderCondiments: product.name === 'standard' ? productCondiments : customCondiments
            } 
        })
        .then(() => {
            setOrderQuantity(1)

            setProductOrderQty(productOrderQty + quantity)
            
            toast('Success', 'Order has been added to your cart.')
            
            setTimeout(() => {
            }, 1000) 
       
            getInvoices(userId)
        })
        .catch(err => {
            console.error(err?.message || err)
            toast('Error', 'Network error, please try again later.')
        })
    }

    const getInvoices = userId => {
		request({
            url   : api.CART_ITEMS,
            method: GET,
            params: {
                userId: userId,
            }
		})
        .then(response => {
            let totalItems = 0

            const cartItems = response?.data

			cartItems.map(cartItem => {
				totalItems = totalItems + cartItem.quantity
			})

            dispatch({
                type     : SET_INVOICES,
                payload  : response.data,
                isLoading: false
            })

            dispatch({
                type   : SET_TOTAL_ITEMS,
                payload: totalItems
            })

            dispatch({
                type   : TOGGLE_IS_CART_FULL,
                payload: totalItems === 2 
            })
		})
        .catch(err => console.error(err?.message || err))
	}

    const handleAddToCart = quantity => {
        if (isEmptyObject(selectedVendingMachine)) {
            toast('Error', 'Location is required')
        } else if (orderQuantity > 0) {
            updatePendingStandard(quantity)
        } 
    }

    const handleCustomize = () => {
        if (isEmptyObject(selectedVendingMachine)) {
            toast('Error', 'Location is required')
        } else {
            updatePendingCustom()
        }  
    }

    const handleDecrement = () => {
        const updatedQty = orderQuantity - 1

        if (orderQuantity !== 0) {
            setOrderQuantity(updatedQty)
        } 
    }

    const handleIncrement = () => {
        const updatedQty = orderQuantity + 1
        if (updatedQty > 2) {
            toast('Error', 'Oopsie, we only take a max of 2 burgers per order.')
        } else {
            setOrderQuantity(updatedQty)
        }
    }

    const updatePendingStandard = async (quantity) => {
        try {
            let totalOrderQty = 0

            const pendingOrderRes = await getPendingOrder()
            const { data }        = await pendingOrderRes
            const { orderId }     = await data

            dispatch({ type: SET_ORDER, payload: data })

            getPendingQuantity(orderId)
            .then(orderQuantityResponse => {
                totalOrderQty = orderQuantityResponse.data

                dispatch({
                    type   : SET_TOTAL_ITEMS,
                    payload: totalOrderQty
                })

                if (totalOrderQty + quantity <= 2) {
                    addOrder(quantity, orderId)
                } else {
                    toast('Error', 'Oopsie, we only take a max of 2 burgers per order.')
                    setOrderQuantity(1)
                }
            })
            .catch(err => {
                console.error(err?.message || err)
                addOrder(quantity, orderId)
            })
        } catch (err) {
            console.error(err?.message || err)

            const addPendingRes = await addPendingOrder()
            const { status }    = await addPendingRes

            if (status === 200) {
                updatePendingStandard(quantity)
            }
        }
    }

    const updatePendingCustom = async () => {
        try {
            let totalOrderQty = 0
            localStorage.removeItem('options')

            const pendingOrderRes = await getPendingOrder()
            const { data }        = await pendingOrderRes
            const { orderId }     = await data

            dispatch({ type: SET_ORDER, payload: data })

            getPendingQuantity(orderId)
            .then(orderQuantityResponse => {
                totalOrderQty = orderQuantityResponse.data

                dispatch({
                    type   : SET_TOTAL_ITEMS,
                    payload: totalOrderQty
                })

                if (totalOrderQty < 2) {
                    navigate('/product?id=2')
                } else {
                    toast('Error', 'Oopsie, we only take a max of 2 burgers per order.')
                }
            })
            .catch(err => {
                console.error(err?.message || err)
                navigate('/product?id=2')
            })
        } catch (err) {
            console.error(err?.message || err)

            const addPendingRes = await addPendingOrder()
            const { status }    = await addPendingRes

            if (status === 200) {
                updatePendingCustom()
            }
        }
    }

    useEffect(() => {
        if (isEmptyArray(invoices)) {
            setProductOrderQty(0)
        } 
        
        // else {
        //     invoices?.map((invoice) => {
        //         invoice.productId === productId 
        //             ?   setProductOrderQty(invoice.quantity)
        //             :   setProductOrderQty(0)
        //     })
        // }
    }, [])

    return (
        <div className="absolute bottom-0 w-full">
            {
                product.name === "standard" &&
                    <div className="bg-gray-100 flex flex-row">
                        <div className="flex flex-row items-center justify-between w-5/12 p-1 md:p-3 ">
                            <button
                                type        = "button"
                                className   = "disabled:opacity-50"
                                onClick     = {() => handleDecrement()}
                                tabIndex    = {0}
                                aria-label  = "Minus Icon - Click to Remove One Item"
                                disabled    = {orderQuantity <= 1}
                            >
                                <MinusOrder0 
                                    className="md:w-6 md:h-6 sm:w-5 sm:h-5 xs:w-5 xs:h-5 xxs:w-4 xxs:h-4" 
                                    aria-label={orderQuantity <= 1 ? "Minus Icon Button - disabled" : ""} 
                                    tabIndex={0}
                                />
                            </button>

                            <span
                                className     = "h-fit inline-flex bg-gray-100 font-futura-bold text-gray-700 text-center md:text-lg sm:text-[15px] xs:text-sm xxs:text-sm mt-[3px]"
                                name          = "orderQuantity"
                                type          = "number"
                                aria-readonly = {true}
                                aria-label    = {`Order quantity - ${orderQuantity}`}
                                tabIndex      = {0}
                            >
                                {orderQuantity}
                            </span>

                            <button
                                type       = "button"
                                className  = "disabled:opacity-50"
                                onClick    = {() => handleIncrement()}
                                aria-label = "Add Icon - Add One Item"
                                tabIndex   = {0}
                            >
                                <AddOrder0 className="md:w-6 md:h-5 sm:w-5 xs:w-5 xs:h-5 xs:h-5 xxs:w-4 xxs:h-4" />
                            </button>
                        </div>

                        <div className="w-7/12 h-full">
                            <button
                                type      = "button"
                                onClick   = {() => handleAddToCart(orderQuantity)}
                                className = "h-full add-to-cart-btn button-sm disabled:opacity-50"
                                disabled  = {orderQuantity > 2 || orderQuantity === 0 }
                            >
                                ADD TO CART
                            </button>
                        </div>
                    </div>
            }
           
            {
                product.name !== "standard" &&
                <button
                    type      = "button"
                    onClick   = {() => handleCustomize()}
                    className = "add-to-cart-btn button-sm disabled:opacity-50"
                >
                    CUSTOMIZE YOUR BURGER
                </button> 
            }
        </div>
    )
}

export default ProductControls
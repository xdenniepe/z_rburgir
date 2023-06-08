import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthCtx, useOrderCtx } from '../../../../hooks'
import { getLocalStorageItem } from '../../../../utilities/helpers'
import { request } from '../../../../services/request'
import { AddOrder0, MinusOrder0 } from '../../../../utilities/icons'
import { GET, POST } from '../../../../utilities/constants'
import { SET_INVOICES, SET_TOTAL_ITEMS, TOGGLE_IS_CART_FULL } from '../../../../reducers/orderReducer'
import api from '../../../../services/api'

const ProductControl = ({ toast, product }) => {
    const { state, dispatch } = useOrderCtx()
    const { user } = useAuthCtx().state
    const [orderQuantity, setOrderQUantity] = useState(1)

    const vmId = getLocalStorageItem('selectedVendingMachine')

    const navigate = useNavigate()

    const getInvoices = () => {
		request({
            url   : api.CART_ITEMS,
            method: GET,
            params: {
                userId: user?.userId,
            }
		}).then(response => {
            let totalItems = 0

			response?.data.map((cartItem) => {
				totalItems = totalItems + cartItem.quantity
			})

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
		}).catch( (cartError) => {
            console.log(cartError)
		})
	}

    const handleDecrement = () => {

        const updatedQty = orderQuantity - 1

        if (orderQuantity !== 0) {
            setOrderQUantity(updatedQty)
        } 
    }
    
    const handleIncrement = () => {

        const updatedQty = orderQuantity + 1
        if (state.totalItems + 1 >= 2 || orderQuantity === 2) {
            toast('Error', 'Oopsie, we only take a max of 2 burgers per order.')
        } else {
            setOrderQUantity(updatedQty)
        }
    }

    const updateCart = () => {
        let totalOrderQty = 0

        request({
            url: api.GET_ORDER_QUANTITY,
            method: GET,
            params: {
                orderId : state.order.orderId
            }
        }).then((orderQuantityResponse) => {
            totalOrderQty = orderQuantityResponse.data

            dispatch({
                type   : SET_TOTAL_ITEMS,
                payload: totalOrderQty
            })

            if (totalOrderQty < 2) {
                addOrder(orderQuantity)
            } else {
                toast('Error', 'Oopsie, we only take a max of 2 burgers per order.')
            }
        }).catch(() => {
            addOrder(orderQuantity)
        })
    }

    const addOrder = (orderQuantity) => {
        const options = getLocalStorageItem('options')

        const customCondiments = options?.length ? options: []

        request({
            url    : api.ADD_ORDERS,
            method : POST,
            data   : {
                quantity              : orderQuantity,
                orderId               : state?.order?.orderId,
                productId             : product.productId,
                vendingMachineId      : vmId.value,
                name                  : product.name.toUpperCase(),
                productOrderCondiments: customCondiments
            } 
        }).then(() => {
            setOrderQUantity(1)
            toast('Success', 'Order has been added to your cart.')
            localStorage.removeItem('options')
            getInvoices()
        }).catch(() => {
            toast('Error', 'Network error, please try again later.')
        })
    }

    return(
        <div className="flex flex-col md:flex-row justify-between items-center absolute bottom-15 w-full 2xl:pb-[8rem] xl:pb-[8rem] lg:pb-[8rem] md:pb-[8rem] sm:pb-[7rem] xs:pb-24 xxs:pb-24 px-4 3xs:pb-[100px]">
            <div className="flex flex-row bottom-0 w-full">
                <div className="w-1/2 bg-[#EDE8E4] flex flex-row justify-center items-center drop-shadow-md">
                    <button
                        type        = "button"
                        className   = "disabled:opacity-50 p-2"
                        onClick     = {() => handleDecrement()}
                        tabIndex    = {0}
                        aria-label  = "Minus Icon - Click to Remove One Item"
                        disabled    = {orderQuantity <= 1}
                    >
                        <MinusOrder0 
                            className="md:w-[22.82px] md:h-[22.82px] sm:w-[17.82px] sm:h-[17.82px] xs:w-[17.82px] xs:h-[17.82px] xxs:w-[17.82px] xxs:h-[17.82px] 3xs:w-[17.82px] 3xs:h-[17.82px]"
                            aria-label={orderQuantity <= 1 ? "Minus Icon Button - disabled" : ""} 
                            tabIndex={0}
                        />
                    </button>
                    <input
                        className     = "mt-0 bg-[#EDE8E4] font-futura-bold text-center md:text-lg sm:text-base xs:text-sm xxs:text-sm"
                        name          = "orderQuantity"
                        type          = "number"
                        min           = {1}
                        max           = {2}
                        readOnly      = {true}
                        value         = {orderQuantity}
                        aria-readonly = {true}
                        aria-label    = {`Order quantity - ${orderQuantity}`}
                    />
                    <button
                        type       = "button"
                        className  = "disabled:opacity-50 p-2"
                        onClick    = {() => handleIncrement()}
                        aria-label = "Add Icon - Add One Item"
                        tabIndex   = {0}
                    >
                        <AddOrder0 className="md:w-[22.82px] md:h-[22.82px] sm:w-[17.82px] sm:h-[17.82px] xs:w-[17.82px] xs:h-[17.82px] xxs:w-[17.82px] xxs:h-[17.82px] 3xs:w-[17.82px] 3xs:h-[17.82px]" />
                    </button>
                </div>
                <div className="w-1/2 drop-shadow-md">
                    <Link
                        to        = {'/products'}
                        type      = "button"
                        onClick   = {() => updateCart()}
                        className = "add-to-cart-btn button-lg h-[52px] disabled:opacity-50 h-full 3xs:text-[10px] md:text-[19px] sm:text-sm xs:text-sm xxs:text-xs"
                        tabIndex  = {0}
                    >
                        ADD TO CART
                    </Link>
                </div>
            </div>
        </div> 
    )
}

export default ProductControl
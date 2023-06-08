import React, { useRef } from 'react'
import { useOrderCtx } from '../../../../hooks'
import { request } from '../../../../services/request'
import { capitalizeFirstLowercaseRest, mutateCondimentsToString } from '../../../../utilities/helpers'
import { AddOrder, MinusOrder, Trash } from '../../../../utilities/icons'
import { DELETE, PATCH } from '../../../../utilities/constants'
import { SET_TOTAL_ITEMS } from '../../../../reducers/orderReducer'
import api from '../../../../services/api'

const OrderCard = (props) => {
    const { orderId, productId, productOrderId, quantity, name, subtotal, getInvoices, vendingMachineId, getComputation, toast, renderCouponTotal, condimentOrder } = props

    const { state, dispatch } = useOrderCtx()
        
    const orderRef = useRef(null)

    const updateProductOrder = (config) => {
        request({
            ...config
        }).then((response) => {
            dispatch({
                type   : SET_TOTAL_ITEMS,
                payload: response.data.quantity
            })
            getInvoices()
        }).catch(error => {
            const { response } = error
            console.log(`${response.config.method.toUpperCase()} ${response.config.url}`, response)
        })
    }

    const handleIncrement = () => {
        if (state.totalItems === 2 ) {
            toast('Error', 'Oopsie, we only take a max of 2 burgers per order.')
        } else {
            const config          = {
                url: `${api.PRODUCT_ORDERS}/${productOrderId}`
            }
    
            try  {
                if (quantity < 3) {
                    const updatedQuantity = quantity + 1
                    renderCouponTotal
                    getComputation()
                    config.method = PATCH
                    config.data   = {
                        productId       : productId,
                        order           : `${api.ORDERS}/${orderId}`,
                        quantity        : updatedQuantity,
                        vendingMachineId: vendingMachineId,
                    }
                } 
    
                updateProductOrder(config)
                toast('Success', 'Order has been added.')
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleDecrement = () => {
        const updatedQuantity = quantity - 1
        let config          = {
            url: `${api.PRODUCT_ORDERS}/${productOrderId}`
        }

        if (updatedQuantity > 0) {
            getComputation()
            renderCouponTotal
            config.method = PATCH
            config.data   = {
                productId        : productId,
                order            : `${api.ORDERS}/${orderId}`,
                quantity         : updatedQuantity,
                vendingMachineId : vendingMachineId,
            }
        } else {
            config.method = DELETE
        }
       
        updateProductOrder(config)
        restartFocusOnRemoval(updatedQuantity)
        if(!updatedQuantity) {
            let delayDebounce
            delayDebounce = setTimeout(() => {
                toast('Success', 'Order has been removed from cart.')
            }, 1000)
            return () => {
                delayDebounce && clearTimeout(delayDebounce)
            }
        } else {
            let delayDebounce
            delayDebounce = setTimeout(() => {
                toast('Success', 'Order has been updated from cart.')
            }, 1000)
            return () => {
                delayDebounce && clearTimeout(delayDebounce)
            }

        }
    }

    const handleDelete = () => {
        const config          = {
            url: `${api.PRODUCT_ORDERS}/${productOrderId}`
        }

        try  {
            
            const updatedQuantity = quantity + 1
            renderCouponTotal
            getComputation()
            config.method = DELETE
            config.data   = {
                productId       : productId,
                order           : `${api.ORDERS}/${orderId}`,
                quantity        : updatedQuantity,
                vendingMachineId: vendingMachineId,
            }
             
            updateProductOrder(config)
            toast('Success', 'Order has been removed from your cart.')
        } catch (err) {
            console.log(err)
        }

    }

    const restartFocusOnRemoval = (qty) => {
        if(!qty) {
            let delayDebounce

            delayDebounce = setTimeout(() => {
                if(orderRef && orderRef.current){
                    orderRef.current.focus()
                }
            }, 3600)

            return () => {
                delayDebounce && clearTimeout(delayDebounce)
            }
        }
    }

    return (
        <div className="w-full pb-0 bg-robo-secondary">
            <div className="w-full h-fit flex flex-row gap-4 lg:gap-5 md:gap-5 sm:gap-4 xs:gap-3 xxs:gap-2 3xs:gap-2">
                <div className="xl:w-[140px] lg:w-[140px] md:w-[140px] sm:w-[140px] xs:w-[120px] xxs:w-[100px] xl:h-[100px] lg:h-[100px] md:h-[100px] sm:h-[100px] xs:h-[80px] xxs:h-[70px]">
                    <img 
                        className  = "object-cover h-full w-full" 
                        src        = "https://roboburgerdev.blob.core.windows.net/email-templates/melty-cheese.jpg"  
                        alt        = {name} 
                        aria-label = {`${name} RoboBurger Image`}
                        role       = "image"
                        tabIndex   = {0}
                    />
                </div>
                <div className="flex flex-col justify-between w-full xl:h-[100px] lg:h-[100px] md:h-[100px] sm:h-[100px] xs:h-[80px] xxs:h-[70px]">
                    <div className="w-full" role = "text" aria-label = {name +  "RoboBurger with" + mutateCondimentsToString(condimentOrder) + "-" + subtotal.toFixed(2) + " USD" } tabIndex={0}>
                        <div className="flex flex-col justify-between mt-[10px]">
                            <div className="flex flex-row justify-between">
                                <p 
                                    className   = "w-fit font-futura-bold uppercase text-robo-currency md:text-base sm:text-xs xs:text-[12px] xxs:text-xxs tracking-tighter" 
                                    aria-hidden = {true}  
                                >
                                    { capitalizeFirstLowercaseRest(name) + " roboburger"}
                                </p>
                                <p 
                                    className   = "w-fit text-robo-currency text-right md:text-base sm:text-xs xs:text-[12px] xxs:text-xxs tracking-tighter" 
                                    aria-hidden = {true}
                                >
                                    {`$${subtotal.toFixed(2)}`}
                                </p>
                            </div>

                            <div>
                                {   
                                    condimentOrder?.length > 0 
                                        &&   <p className="md:text-base sm:text-sm xs:text-xs xxs:text-xxs text-gray-200 h-[25px] tracking-wider" aria-hidden={true}>
                                                {
                                                    condimentOrder.sort((condimentA, condimemtB) => {
                                                        return condimentA.optionsTypeId - condimemtB.optionsTypeId 
                                                    }).map(({ name }, index) => {
                                                        let condimentName = name === 'cheese' ? 'melty cheese sauce' : name

                                                        if (index === 0) {
                                                            condimentName = capitalizeFirstLowercaseRest(condimentName)
                                                        }

                                                        return (
                                                            <span 
                                                                className = "md:text-base sm:text-sm xs:text-xs xxs:text-xxs text-gray-200"
                                                                key       = {name}
                                                            >
                                                                {condimentName} 
                                                                {index < condimentOrder.length - 1 ? ',' : ''}
                                                                &nbsp;
                                                            </span>
                                                        )
                                                    })
                                                }
                                            </p>                                    
                                }
                            </div>
                        </div>
                    </div>
                
                    <div className="relative flex flex-row items-center justify-start pb-2">
                        <button
                            className  = "rounded-full cursor-pointer"
                            onClick    = {() => handleDecrement()}
                            aria-label = {`Minus Icon - ${quantity <= 1 ? 'Click to remove order' : 'Click to remove one item'}`}
                            tabIndex   = {0}
                            role       = "button"
                        >
                            <MinusOrder className="lg:w-8 lg:h-8 md:w-8 md:h-8 sm:w-7 sm:h-7 xs:w-6 xs:h-6 xxs:w-5 xxs:h-5" />
                        </button>

                        <p className="sr-only ml-12" tabIndex={0} role="text">{`Order quantity: ${quantity}`}</p>
                        
                        <input
                            className     = "w-10 md:w-9 indent-0 md:indent-1 rounded-md text-black text-center xxs:w-8 md:text-lg sm:text-[24px] xs:text-[20px] xxs:text-[16px] 3xs:text-[12px]"
                            name          = "orderQuantity"
                            type          = "number"
                            min           = {1}
                            max           = {2}
                            readOnly      = {true}
                            value         = {quantity}
                            aria-hidden   = {true}
                            tabIndex      = {1}
                        />

                        <button
                            className  = "rounded-full cursor-pointer"
                            onClick    = {() => handleIncrement()}
                            aria-label = "Add Icon - Add One Item"
                            tabIndex   = {0}
                            role       = "button"
                        >
                            <AddOrder className="md:w-8 md:h-8 sm:w-7 sm:h-7 xs:w-6 xs:h-6 xxs:w-5 xxs:h-5 stroke-[#469946]" />
                        </button>

                        <button
                            className  = "rounded-full cursor-pointer flex right-0 absolute"
                            onClick    = {() => handleDelete()}
                            aria-label = "Delete Icon"
                            tabIndex   = {0}
                            role       = "button"
                        >
                            <Trash className="md:w-8 md:h-8 sm:w-7 sm:h-7 xs:w-6 xs:h-6 xxs:w-5 xxs:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderCard

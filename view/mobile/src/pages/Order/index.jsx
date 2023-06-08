import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useOrderCtx } from '../../hooks'
import { getSumOfArray, isEmptyObject } from '../../utilities/helpers'
import { request } from '../../services/request'
import { Button } from '../../components/Common'
import { GET } from '../../utilities/constants'
import { SET_INVOICES, SET_TOTAL_ITEMS, TOGGLE_IS_CART_FULL } from '../../reducers/orderReducer'
import BackButton from '../../components/Common/BackButton'
import EmptyCart from '../../components/EmptyState/EmptyCart'
import LocationChanger from '../../components/Common/LocationChanger'
import PickupHeader from '../../components/Header/PickupHeader'
import OrderCard from './components/OrderCard'
import OrderCouponCodeInput from './components/OrderCouponCodeInput'
import OrderCouponMessage from './components/OrderCouponMessage'
import OrderTransactionBreakdown from './components/OrderTransactionBreakdown'
import api from '../../services/api'

const Order = props => {
    const { renderSr, setHasLoaded, toast }   = props
    const { state, dispatch }                 = useOrderCtx()
    const couponCode                          = useRef(null)
    const couponRef                           = useRef(null)
    const deleteCoupon                        = useRef(null)
    const total                               = useMemo(() => getSumOfArray(state?.invoices?.map(invoice => invoice.total), 2), [state.invoices])
    const subtotal                            = useMemo(() => getSumOfArray(state?.invoices?.map(invoice => invoice.subtotal), 2), [state.invoices])
    const tax                                 = (total - subtotal).toFixed(2)
    const [apply, setApply]                   = useState(false)
    const [code, setCode]                     = useState('')
    const [coupon, setCoupon]                 = useState({})
    const [couponInvalid, setCouponInvalid]   = useState('')
    const [couponDiscount, setCouponDiscount] = useState('0.00 USD')
    const [tempTotal, setTempTotal]           = useState(parseFloat(total))
    const [ariaDiscount, setAriaDiscount]     = useState('') 

    const navigate = useNavigate()

    const labelProp = {
        buttonlabel: 'Redeem Button - Activate Coupon Code'
    }
   
    const couponUseRef = () => {
        if(couponRef && couponRef.current){
            couponRef.current.focus()
        }
    }

    const getComputation = useCallback(() => {
        if (coupon) {
            const discountValue = (total * (coupon.discountPercentage/100)).toFixed(2)
            setTempTotal((total - discountValue).toFixed(2))
            setCouponDiscount(`-$${discountValue}`)
            setAriaDiscount(discountValue)
        }
    }, [coupon, total])

    const getCouponMessage = () => (
        <OrderCouponMessage 
            coupon          = {coupon} 
            couponInvalid   = {couponInvalid} 
            couponRef       = {couponRef} 
            deleteCoupon    = {deleteCoupon} 
            couponDiscount  = {couponDiscount} 
            total           = {total} 
            setCoupon       = {setCoupon} 
            setTempTotal    = {setTempTotal}
        />
    )
    
	const getInvoices = () => {
		request({
            url    : api.CART_ITEMS,
            method : GET,
            params : {
                userId: state?.order?.userId
            }
		}).then(response => {
			let totalItems = 0
			
			response?.data.map((cartItem) => (
				totalItems = totalItems + cartItem.quantity
			))

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
                payload: totalItems === 2 ? true : false
            })
		}).catch(error => {
            const { response } = error
            console.log(`${response.config.method.toUpperCase()} ${response.config.url}`, response)
		})
	}

    const handleApplyCoupon = () => {
        if (code) {
            request({
                url    : `${api.COUPONS}`,
                method : GET,
                params : {
                    code: couponCode.current.value
                }
            }).then(response => {
                if (response.data) {
                    setCouponInvalid('')
                    setCoupon(response.data)
                } else {
                    setCouponInvalid('This coupon code does not exist or has already expired.')
                }
                couponUseRef()
            }).catch(error => {
                console.log('error')
                setCouponInvalid('This coupon code does not exist or has already expired.')
                console.log(error)
            })
        }   
    }

    const handleChange = () => {
        setApply(true)
        setCode(couponCode.current.value)
    }

    const handleClearCoupon = () => {
        setCode('')
        setCouponInvalid('')
    }

    const renderCouponCodeInput = () => (
        <OrderCouponCodeInput 
            apply             = {apply}
            couponCode        = {couponCode}
            couponInvalid     = {couponInvalid}
            handleApplyCoupon = {handleApplyCoupon}
            handleChange      = {handleChange}
            labelProp         = {labelProp}
        />
    )

    const renderCouponTotal = useMemo(() => (
        <span 
            aria-label = {`${!isEmptyObject(coupon) ? `${tempTotal} USD` : `${total} USD`}`}
            className  = "md:text-base sm:text-[16px] xs:text-[16px] xxs:text-[16px]"
            role       = "text"
        > 
            {!isEmptyObject(coupon) ? `$${tempTotal}` : `$${total}`}
        </span>
    ), [coupon, tempTotal, total])

    useEffect(() => {
        setHasLoaded(true)
    }, [])

    useEffect(() => {
        getCouponMessage()
        getComputation()
    }, [coupon, total, tempTotal])

    return (
        total <= 0 
            ?   <div className="px-0 h-screen w-full">
                    {renderSr()}

                    <BackButton />
                    
                    <EmptyCart />
                </div>
            :   <>
                    <div className="px-0 h-screen w-full"> 
                        {renderSr()}

                        <BackButton title="Checkout" />

                        <PickupHeader />
                        
                        <div className="h-full relative flex flex-col p-[20px] gap-5 md:gap-8 bg-[#FFFF] overflow-y-auto overflow-x-hidden lg:px-64 ">
                            {
                                state?.invoices?.map((invoice, index) => {  
                                    return (
                                        <OrderCard 
                                            {...invoice} 
                                            key               = {index}  
                                            getInvoices       = {getInvoices} 
                                            getComputation    = {getComputation} 
                                            toast             = {toast}
                                            renderCouponTotal = {renderCouponTotal}
                                        />
                                    )
                                })
                            }
                                                                                
                            <div className="flex flex-col gap-5 w-full">
                                <div>
                                    <LocationChanger />
                                </div>
                                       

                                <OrderCouponCodeInput 
                                    apply             = {apply}
                                    code              = {code}
                                    couponCode        = {couponCode}
                                    couponInvalid     = {couponInvalid}
                                    handleApplyCoupon = {handleApplyCoupon}
                                    handleChange      = {handleChange}
                                    handleClearCoupon = {handleClearCoupon}
                                    labelProp         = {labelProp}
                                />
                                
                                <OrderTransactionBreakdown
                                    code                  = {code}
                                    coupon                = {coupon}      
                                    couponDiscount        = {couponDiscount} 
                                    couponInvalid         = {couponInvalid} 
                                    couponRef             = {couponRef} 
                                    deleteCoupon          = {deleteCoupon}
                                    renderCouponCodeInput = {renderCouponCodeInput}
                                    renderCouponTotal     = {renderCouponTotal}
                                    subtotal              = {subtotal}
                                    setTempTotal          = {setTempTotal}
                                    tax                   = {tax}
                                    tempTotal             = {tempTotal}
                                    total                 = {total} 
                                    ariaDiscount          = {ariaDiscount}
                                />
                            </div>

                            <div className="flex justify-center pb-24 h-fit w-full mt-[14px]">
                                <Link
                                    to = {coupon?.couponCode ? '/payment?promocode=' + coupon.couponCode : '/payment'}
                                    className = "flex justify-center items-center button-default bg-robo-primaryTwo text-white md:text-xl sm:text-lg xs:text-[18px] xss:text-[18px] 3xs:text-[17px] xxs:text-base"
                                    type    = "button"
                                >
                                    CONTINUE TO PAYMENT
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
    )
}

export default Order

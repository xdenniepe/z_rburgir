import React from 'react'

const OrderCouponMessage = ({ coupon, couponInvalid }) => {
    return coupon && couponInvalid
        ? 
        <div className="relative absolute" aria-live="polite">
            <p className="text-red-700 text-md mx-5 mt-5 text-center">
                {couponInvalid}
            </p>
        </div> 
        :
        null
}

export default OrderCouponMessage

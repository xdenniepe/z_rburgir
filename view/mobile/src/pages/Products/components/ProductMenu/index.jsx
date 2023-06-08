import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLocationCtx, useOrderCtx } from '../../../../hooks'
import { isEmptyObject } from '../../../../utilities/helpers'
import { ShoppingBag } from '../../../../utilities/icons'
import Button from '../../../../components/Common/Button'
import LocationChanger from '../../../../components/Common/LocationChanger'
import ProductCard from '../ProductCard'
import { Link } from 'react-router-dom'

const ProductMenu = ({ toast }) => {
    const { selectedVendingMachine } = useLocationCtx().state
    const { totalItems }             = useOrderCtx().state
    const { pathname }               = useLocation()

    const isHome = pathname === '/home'

    const navigate = useNavigate()

    return (
        <div className={`relative flex flex-col xl:px-64 lg:px-6 md:gap-12 xs:gap-10 xxs:gap-10 h-full w-full overflow-y-auto md:pb-[110px] sm:pb-24 xs:pb-20 xxs:pb-20 px-4  ${pathname === '/home' ? 'gap-4' : 'justify-between'}`}>
            <div className="relative w-full h-fit">
                <div className="lg:relative md:relative absolute block w-full">
                    <LocationChanger />
                </div>
                
                <div className={`relative z-[1] ${isHome ? 'lg:pt-8 md:pt-6 sm:mt-[76px] xs:mt-[76px] xxs:mt-[76px]' : 'lg:pt-8 md:pt-6 sm:mt-[100px] xs:mt-[95px] xxs:mt-[93px]'} w-full h-fit`}>
                    <ProductCard toast={toast} />
                </div>
            </div>

            <div className="w-full h-fit">
                <div className={`relative h-fit w-full ${isHome ? 'sm:mt-2 xs:-mt-4 xxs:-mt-4' : ''}`}>
                    <div className="absolute bottom-3 xs:bottom-2 xxs:bottom-[5px]">
                        <span 
                            aria-label = {`Shopping bag icon ${totalItems > 0 ? "with " + totalItems + "items" : 'is empty' }`} 
                            className  = "flex items center justify-center pl-7 pb-2 relative" 
                            href       = "#" 
                            role       = "button" 
                            tabIndex   = {0}
                        >
                            <ShoppingBag className="h-[30px] w-[30px] xs:h-[28px] xs:w-[28px] xxs:h-[25px] xxs:w-[25px] stroke-[#EDE8E4]" />
                            <span className="absolute text-white top-[11px] xs:top-[10px] xxs:top-[9px] text-[14px] xs:text-[12px] xxs:text-[12px] text-center font-futura">
                                {totalItems ? totalItems : ''}
                            </span>
                        </span>
                    </div>
                    <div>
                    <Link
                        to         = "/order"
                        className  = "flex justify-center items-center xl:w-[500px] xl:mx-auto text-white bg-robo-primaryTwo button-default tracking-wide md:text-xl sm:text-lg xs:text-[18px] xss:text-[18px] 3xs:text-[17px] xxs:text-base"
                        aria-label = "Login button"
                        role       = "buton"
                    >
                        CHECKOUT
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductMenu

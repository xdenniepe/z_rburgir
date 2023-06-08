import React from 'react'
import { Information } from '../../../../utilities/icons'
import { useNavigate, Link } from 'react-router-dom'
import ProductControls from '../ProductControls'

const ProductDescription = ({ product, productCondiments, toast }) => {
    const { name } = product

    const isStandard        = name === 'standard'
    const customDescription = 'Customize your ingredients'
    const containerAria     = isStandard ? 'with ketchup, mustard, melty cheese sauce' : customDescription
    const description       = isStandard ? 'Ketchup, mustard, \n melty cheese sauce' : customDescription

    const navigate = useNavigate()

    return (
        <div className="relative w-full h-full flex flex-col gap-1 m-0 pt-4">
            <div className="relative">
                <span 
                    aria-label = {`${name} roboburger ${containerAria}`}
                    className  = "flex flex-col justify-center w-full" 
                    role       = "text"
                    tabIndex   = {0}
                > 
                    <p
                        aria-hidden = {true}
                        className   = "w-full h-fit font-futura-bold text-robo-currency md:text-xl sm:text-[13.5px] xs:text-[11.5px] xxs:text-[9.5px] tracking-tighter"
                    >
                        {name && `${(name)} roboburger`.toUpperCase()} 
                    </p>

                    <p
                        aria-hidden = {true}
                        className   = {`${isStandard && 'whitespace-pre-line'} md:text-lg sm:text-sm xs:text-xs xxs:text-xxs text-gray-200 tracking-[1.12px] mt-[5px]`}
                    >
                        {description}
                    </p>
                </span>


                {
                    isStandard ? (
                        <Link
                            aria-label = "Information Icon - Nutrition Facts Details"
                            className  = "absolute opacity-70 bottom-0.5 right-0" 
                            to         = {'/nutritionfacts?id=1'} 
                            tabIndex   = {0}
                            role       = "link"
                        > 
                            <Information className="w-5 h-5 md:w-8 md:h-8" /> 
                        </Link>
                    ) : null
                }
            </div>

            <ProductControls 
                product           = {product} 
                productCondiments = {productCondiments}
                toast             = {toast} 
            />
        </div>
    )
}

export default ProductDescription
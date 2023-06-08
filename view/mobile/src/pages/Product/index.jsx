import React, { useEffect, useState } from 'react'   
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useProductCtx } from '../../hooks'
import { ChevronLeft } from '../../utilities/icons'
import { isEmptyObject } from '../../utilities/helpers'
import ProductControl from './components/ProductControl'
import ProductOptions from './components/ProductOptions'

const Product = ({ toast, renderSr, setHasLoaded }) => {
    const { condiments, products } = useProductCtx().state
    const [serachParams]           = useSearchParams()
    const [product, setProduct]    = useState([{}])

    const navigate = useNavigate()

    const getProduct = () => {
        let prod = products?.filter((product) => product?.productId === parseInt(serachParams.get("id")))
        
        if (!isEmptyObject(prod)) {
            setProduct(prod[0])
        } else {
            navigate('/products')
        }
    }

    useEffect(() => {
        getProduct()
        setHasLoaded(true)
    }, [serachParams])

    return(
        <div>
            {renderSr()}
            <div className="xxs:flex xxs:items-center xxs:justify-center w-full bg-product-bg  bg-cover bg-center md:h-[284px] sm:h-[284px] xs:h-[284px] xxs:h-[184px] 3xs:h-[164px]">
                <button 
                    type    = "button"
                    onClick = {() => {
                        navigate(-1)
                    }}
                    className  = "flex bg-[#F5F5F5] justify-start absolute top-2 left-2 p-1"
                    aria-label = "Back Arrow Icon - Click to Exit out of Screen"
                    tabIndex   = {0}
                >
                    <ChevronLeft className="h-[16px] w-[16px]" />
                </button>
                <p className="sr-only" aria-label="Robot Chef Holding A Burger Image Banner" tabIndex={0}/>
            </div>
            <div className="3xs:pb-[50px] md:pb-20 sm:pb-[56px] xs:pb-14 xxs:pb-14">
                <div className="justify-center text-center mt-[39px]">
                    <div tabIndex={0} aria-label="Let's customize your burger - Choose up to 3 condiments">
                        <div className='flex flex-row justify-center text-center gap-3'>
                            <h1 className   = "tracking-wide font-medium md:text-2xl 3xs:text-[18px] xxs:text-[19px] xs:text-[22px] sm:text-[22px] text-robo-primaryTwo" 
                                aria-label  = "Let's customize your burger"
                                aria-hidden = {true}
                            > 
                                Let's customize your burger 
                            </h1> 
                        </div>

                        <div className='flex flex-row justify-center text-center gap-3'>
                            <p 
                                className   = "3xs:text-xs md:text-lg sm:text-sm xs:text-sm xxs:text-sm text-gray-200 tracking-wide" 
                                aria-label  = "Choose up to 3 condiments"
                                aria-hidden = {true}
                            > 
                                Choose up to 3 condiments 
                            </p>
                        </div>
                    </div>

                    <ProductOptions toast={toast} condiments={condiments} />
                </div>
            </div>

            <div className="text-center pb-[30px]">
                <Link 
                    to         = {'/nutritionfacts?id='+product.productId} 
                    tabIndex   = {0} 
                    role       = "link"
                    aria-label = "View Allergens & Nutrition - 2027 kilo joules / 484 kilo calories - Click to view allergens and nutrition facts"
                >
                    <p 
                        className   = "text-[#663B02] font-futura-bold sm:text-base xs:text-[15px] xxs:text-[14px] 3xs:text-[13px]" 
                        aria-label  = "View Allergens & Nutrition - " 
                        aria-hidden = {true}
                    >
                        View Allergens & Nutrition
                    </p>
                    
                    <p 
                        className   = "text-gray-200 font-light sm:text-sm xs:text-[13px] xxs:text-[12px] 3xs:text-[11px] mt-[6px] tracking-[1.12px]" 
                        aria-label  = "" 
                        aria-hidden = {true}
                    >
                        2027 kj / 484 kcal
                    </p>
                </Link>
            </div>

            <ProductControl toast={toast} product={product} />
        </div>
    )

}

export default Product
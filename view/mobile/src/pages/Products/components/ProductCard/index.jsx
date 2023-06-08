import React, { useContext } from 'react'
import ProductContext from '../../../../contexts/productContext'
import ProductDescription from '../ProductDescription'
import ProductImage from '../ProductImage'

const ProductCard = ({ toast }) => {
    const { products, condiments } = useContext(ProductContext).state
    
    return (
        <div className="w-full h-full flex flex-col gap-4 md:gap-6 sm:gap-5 xs:gap-4 xxs:gap-4 3xs:gap-4 border-b border-gray-500 border-none p-5 md:p-5 sm:px-5 sm:py-6 xs:px-4 xs:py-5 xxs:px-4 xxs:py-5 bg-white z-10">
        {
            products.map(product => (
                <div className="w-full h-fit flex flex-row gap-5 md:gap-6 sm:gap-5 xs:gap-4 xxs:gap-4 3xs:gap-4 py-2" key={product.name}>
                    <div className="w-5/12 md:w-1/3 sm:w-3/8 lg:h-80 md:h-52 sm:h-36 xs:h-30 xxs:h-24">
                        <ProductImage name={product.name} />
                    </div>
                    
                    <div className="w-7/12 md:w-2/3 sm:w-5/8 lg:h-80 md:h-52 sm:h-36 xs:h-30 xxs:h-24">
                        <ProductDescription 
                            product           = {product} 
                            productCondiments = {condiments}
                            toast             = {toast} 
                        />
                    </div>
                </div>
            ))
        }
        </div>
    )
}

export default ProductCard
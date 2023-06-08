import React from 'react'

const ProductImage = ({ name }) => {
    return (
        <div className="xxs:flex xxs:items-center w-full h-full">
            <img 
                className  = "object-cover w-full h-full" 
                src        = "https://roboburgerdev.blob.core.windows.net/email-templates/melty-cheese.jpg"  
                alt        = "Image of a RoboBurger"  
                aria-label = {`${name} RoboBurger Image`} 
                tabIndex   = {0}
            />
        </div>
    )   
}

export default ProductImage
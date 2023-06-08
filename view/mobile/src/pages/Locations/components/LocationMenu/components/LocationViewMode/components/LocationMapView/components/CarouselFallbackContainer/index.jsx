import React from 'react'

const CarouselFallbackContainer = ({ children }) => (
    <div className="absolute relative bg-transparent h-fit z-[2] bottom-56 sm:bottom-56 xs:bottom-52 xxs:bottom-48 py-4 w-full xl:px-64">
        {children}
    </div>
) 

export default CarouselFallbackContainer
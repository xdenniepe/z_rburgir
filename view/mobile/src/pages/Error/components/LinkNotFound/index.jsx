import React from 'react'
import { BackButton } from '../../../../components/Common'
import { PageNotFound } from '../../../../utilities/icons'

const LinkNotFound = () => {
    return (
        <div className="h-screen flex flex-col md:p-8 bg-[#ffff] overflow-y-scroll overflow-x-hidden">
            <BackButton />
            <div className={`right-0 w-full absolute top-[28px] py-4 px-6.5 border-b border-[#707070] border-opacity-50`}> </div> 
            <div className="h-screen mt-[15rem] sm:mt-[15rem] xs:mt-[12rem] xss:mt-[10rem] 3xs:mt-[10rem] items-center text-center justify-center">
                <h1 className="text-center justify-center font-futura-bold text-[30px]">Uh-Oh!</h1>
                <PageNotFound className="w-[350px] h-[148px] mx-auto mt-[69.12px]" />
                <h1 className="text-center justify-center text-[24px] mt-[57.31px]">Page not found</h1>
            </div>
        </div>
    )
}

export default LinkNotFound
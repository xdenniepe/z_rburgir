import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BackButton } from '../../components/Common'

const ContactUs = ({ renderSr, setHasLoaded, setSidebarOpen }) => {
    const { pathname } = useLocation()
    
    useEffect(() => {
        setHasLoaded(true)

        window.scrollTo(0, 0)
    }, []) 

    return (
        <>
            { renderSr() }
            <div className="flex">
                <div className="w-full h-[61px] absolute top-0 border-b border-[#707070] border-opacity-20">  
                    <p className="flex text-center justify-center w-full absolute top-[19.5px] leading-[22px] font-futura-bold tracking-[1.22px] text-[#3A2103] text-[15px]" aria-label="Contact Us" tabIndex={0}> CONTACT US </p>
                </div>
                
                <BackButton 
                    pathname       = {pathname} 
                    setSidebarOpen = {setSidebarOpen} 
                />

                <div className="px-[55px] leading-[22px] mt-[124px] text-left flex flex-col gap-4 tracking-[1.12px] leading-[25px] mb-[50px] text-[15px] md:text-[18px] lg:text-[18px] text-[#37250D]">
                    <p className="mb-[7px]" aria-label="For immediate customer support call or text: 862 244 3742 " tabIndex={0}> For immediate customer support call or text: <span className="font-futura-bold"> 862 244 3742 </span> </p>
                    <p  aria-label="For general inquires: contact@theroboburger.com" tabIndex={0} > For general inquires: <span className="font-futura-bold"> contact@theroboburger.com </span> </p>
                </div>
            </div>
        </>
    )
}

export default ContactUs
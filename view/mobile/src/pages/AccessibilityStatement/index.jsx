import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BackButton } from '../../components/Common'

const AccessibilityStatement = ({ renderSr, setHasLoaded, setSidebarOpen }) => {
    const { pathname } = useLocation()

    useEffect(() => {
		setHasLoaded(true)

		window.scrollTo(0, 0)
	}, [])

    return (
        <>
            { renderSr() }
            <div className="flex sm:mb-10 xs:pb-[70px] xxs:pb-[90px] 3xs:pb-[110px]">
                <div className="w-full h-[61px] absolute top-0 border-b border-[#707070] border-opacity-20">  
                    <p className="flex text-center justify-center w-full absolute top-[19.5px] leading-[22px] font-futura-bold tracking-[1.22px] text-[#3A2103] text-[15px]" aria-label="Accessibility Statement" tabIndex={0}> ACCESSIBILITY STATEMENT </p>
                </div>

                <BackButton 
                    pathname       = {pathname} 
                    setSidebarOpen = {setSidebarOpen} 
                />
                
                <div className="px-[55px] leading-[22px] mt-[124px] text-left flex flex-col gap-10 tracking-[1.12px] leading-[25px] mb-[50px]">
                    <p className="text-[15px] md:text-[20px] lg:text-[20px] text-[#3A2103]" aria-label="our commitment to accessibility" tabIndex={0}>
                    OUR COMMITMENT TO ACCESSIBILITY
                    </p>
                    <p className="text-[14px] md:text-[18px] lg:text-[18px] text-[#37250D]" aria-label="RoboBurger is committed to making our website and/or mobile app content accessible and user friendly to everyone. If you are having difficulty viewing or navigating the content on this website 
                    or mobile application, or notice any content, feature, or functionality that you believe is not fully accessible to individuals challenged with impairments or disabilities, please email our team at contact@theroboburger.com
                    with “Accessibility Request” in the subject line and provide a description of the specific feature you feel is not fully accessible or a suggestion for improvement." tabIndex={0}>
                    RoboBurger is committed to making our website and/or mobile app content accessible and user friendly to everyone. If you are having difficulty viewing or navigating the content on this website 
                    or mobile application, or notice any content, feature, or functionality that you believe is not fully accessible to individuals challenged with impairments or disabilities, please email our team at contact@theroboburger.com
                    with “Accessibility Request” in the subject line and provide a description of the specific feature you feel is not fully accessible or a suggestion for improvement. 
                    </p>
                    <p className="text-[14px] md:text-[18px] lg:text-[18px] text-[#37250D]" aria-label="We take your feedback seriously and will consider it as we evaluate 
                    ways to accommodate all our customers and our overall accessibility policies." tabIndex={0} >
                    We take your feedback seriously and will consider it as we evaluate 
                    ways to accommodate all our customers and our overall accessibility policies.
                    </p>
                </div>
            </div>
        </>
    )
}

export default AccessibilityStatement
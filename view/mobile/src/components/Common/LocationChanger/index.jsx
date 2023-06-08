import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLocationCtx, useOrderCtx } from '../../../hooks'
import { LocationPinWithLogo, LocationPin } from '../../../utilities/icons'
import LocationSwitcher from './components/LocationSwitcher'
import { isEmptyObject } from '../../../utilities/helpers'

const LocationChanger = () => {
    const { invoices } = useOrderCtx().state
    const { pathname } = useLocation()
    const { state }    = useLocationCtx()
    const { selectedVendingMachine } = state
    const { label } = selectedVendingMachine

    const [ buttonLabel, setButtonLabel ] = useState("Select")
    
    const getContainerClassName = isProductsPage => {
        const common = 'bg-white h-[52px] flex justify-center items-center relative'

        return isProductsPage
            ? `${common} mt-[31px] sm:mt-[31px] xs:mt-[26px] xxs:mt-6`
            : `${common} border border-robo-primaryTwo/35 border-1`
    }

    const isProductsPage     = pathname === '/products'
    const containerClassName = getContainerClassName(isProductsPage)

    const renderLocation = () => {
       if (label) {
            return label
       } else {
            return `${invoices[0]?.vmLocation}, ${invoices[0]?.vmAddress}, ${invoices[0]?.vmCity}`
       }
    }

    useEffect(() => {
        if ((pathname === '/home' && label) || (pathname === '/products' && label)) {
            setButtonLabel("Change")
        } 

        if (pathname === '/order') {
            setButtonLabel("Change")
        }
    }, [])
 
    return (
        <div className={containerClassName}>
            <div className="w-full h-full absolute" aria-label="Location Dropdown" role="image" tabIndex={0}>
            </div>
            
            <div className="relative flex flex-row gap-2 w-full items-center lg:text-base xs:text-base xxs:text-base md:text-lg text-base">
                {  pathname !== '/home' ?
                    <>
                        <div className="pl-5 pr-2">
                            <LocationPinWithLogo className="h-7 w-5" role="text" aria-label="Location Icon" tabIndex={0}/> 
                        </div>
                        <p className={`text-base tracking-wide text-ellipsis text-[#000000] pt-1`}> 
                            { renderLocation() } 
                        </p> 
                    </>
                    :
                    <>
                        <div className="pl-5 w-fit" role="text" aria-label="Location Icon" tabIndex={0}>
                            {
                                isEmptyObject(selectedVendingMachine) ? 
                                    <LocationPin className="h-5 w-5" fill="transparent" stroke="#8D8D8D" strokeWidth="15" /> 
                                :
                                    <LocationPinWithLogo className="h-7 w-5" role="text" aria-label="Location Icon" tabIndex={0}/> 
                            }
                        </div> 
                        <p className={`${isEmptyObject(selectedVendingMachine) ? 'text-gray-200' : 'text-[#000000]' } tracking-wide text-base pt-1 text-ellipsis`}> 
                            { isEmptyObject(selectedVendingMachine) ? 'Find a RoboBurger near you' : label }
                        </p>
                    </>
                } 
            </div>

            <div className="absolute right-0 top-3.5">
                <LocationSwitcher selectedVendingMachine = {selectedVendingMachine} buttonLabel={buttonLabel} />
            </div> 
        </div>
    )
}

export default LocationChanger

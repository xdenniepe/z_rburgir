import React from 'react'
import { useLocationCtx } from '../../../../../hooks'
import { isEmptyArray } from '../../../../../utilities/helpers'

const LocationFallback = () => {
    const { isLoading, state } = useLocationCtx()
    const { isLocationEnabled, locationViewMode, vendingMachines } = state
    
    const isList = locationViewMode === 'list'

    const getContainerClassName = isList => {
        return isList
            ?   'absolute w-full z-[1] mt-[100px] sm:mt-[100px] xs:mt-[95px] xxs:mt-[93px] xl:px-64'
            :   'z-20 px-4'
    }

    const getFallbackText = (isLocationEnabled, isLoading, vendingMachines) => {
        if (isLocationEnabled === false) {
            return 'Turn on location services to allow RoboBurger to determine your location, or search for an address.'
        }

        return (!isLoading && isEmptyArray(vendingMachines)) 
            ?   <span>There are no RoboBurgers here, <br/> please provide another address.</span>  
            :   'Loading...'
    }

    const containerClassName = getContainerClassName(isList)
    const fallbackText       = getFallbackText(isLocationEnabled, isLoading, vendingMachines)

    return (
        <div className={containerClassName}> 
            <p className={`flex items-center ${!isList ? 'md:h-[121px] sm:h-[116px] xs:h-[102px] xxs:h-[89px] 3xs:h-[89px]' : 'md:h-[121px] h-[80px]'} w-full bg-white text-center text-gray-200 text-sm xs:text-xs xxs:text-xs 3xs:text-xs`}> 
                <span className="w-full tracking-widest px-1"> {fallbackText} </span> 
            </p> 
        </div>
    )
}

export default LocationFallback

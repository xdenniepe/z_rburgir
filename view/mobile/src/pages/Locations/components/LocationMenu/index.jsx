import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocationCtx } from '../../../../hooks'
import { isEmptyObject } from '../../../../utilities/helpers'
import { List, Map } from '../../../../utilities/icons'
import LocationSearchBar from '../../../../components/Common/LocationSearchBar'
import LocationViewMode from './components/LocationViewMode'

const LocationMenu = () => {
    const { setLocationViewMode, state } = useLocationCtx()
    const { isLocationEnabled, locationViewMode, userLocation } = state

    const isListView     = locationViewMode === 'list'
    const ariaLabel      = isListView ? 'Map Icon' : 'Menu Icon'
    const props          = { className: isListView ? 'h-full w-full' : 'h-5 w-5', fill: 'black' }
    const viewButtonRef  = useRef(null)

    const handleClick = useCallback(() => {
        setLocationViewMode(isListView ? 'map' : 'list')
    }, [setLocationViewMode, locationViewMode])

    const ViewButtonIcon = useMemo(() => isListView ? Map : List, [locationViewMode])

    useEffect(() => {
        if (viewButtonRef.current) {
            viewButtonRef.current.addEventListener('click', handleClick)

            return () => viewButtonRef.current?.removeEventListener('click', handleClick)
        }
    }, [viewButtonRef.current, handleClick])

    return (
        <div className="h-full w-full px-4">
            <div className="flex flex-col relative h-full w-full">
                <div className="absolute block flex flex-row gap-4 h-fit w-full justify-between items-start z-[2] mt-[31px] sm:mt-[31px] xs:mt-[26px] xxs:mt-6 xl:px-64">
                    <div className="grow">
                        <LocationSearchBar />          
                    </div>

                    {
                        !isEmptyObject(userLocation) && isLocationEnabled !== false
                            &&  <div className="w-fit">
                                    <button 
                                        aria-label = {ariaLabel}
                                        className  = "h-[52px] w-[49px] p-3 pl-3.5 bg-white button-touch"
                                        ref        = {viewButtonRef}
                                        type       = "button"
                                    >
                                        <ViewButtonIcon {...props} />
                                    </button>   
                                </div>
                    }
                </div>

                <LocationViewMode isListView={isListView} />                
            </div>
        </div>
    )
}

export default LocationMenu

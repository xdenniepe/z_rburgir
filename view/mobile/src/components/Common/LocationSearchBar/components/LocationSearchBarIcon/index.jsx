import React, { memo } from 'react'
import { LocationBarIcon as LocationPin, LocationPinWithLogo } from '../../../../../utilities/icons'
import { useLocationCtx } from '../../../../../hooks'

const LocationSearchBarIcon = ({ isSelected }) => {
    const { locationSearchInput } = useLocationCtx().state

    return !isSelected || locationSearchInput === '' 
        ?   <div className="bg-white flex items-center pl-5 w-fit" role="text" aria-label="Location Icon" tabIndex={0}>
                <LocationPin className="h-5 w-5" fill="transparent" stroke="#8D8D8D" />
            </div> 
        :   <div className="bg-white pl-5 pr-2" role="text" aria-label="Location Icon" tabIndex={0}>
                <LocationPinWithLogo className="h-7 w-5" />
            </div>
}

export default memo(LocationSearchBarIcon)
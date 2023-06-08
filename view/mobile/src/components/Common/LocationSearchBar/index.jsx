import React, { useCallback, useRef, useState } from 'react'
import { useEffectOnce, useLocationCtx, useUpdateEffect } from '../../../hooks'
import { className, isEmptyObject } from '../../../utilities/helpers'
import { ClearCircle, LocationArrow, LocationBarIcon as LocationPin } from '../../../utilities/icons'
import LocationSearchBarIcon from './components/LocationSearchBarIcon'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

const LocationSearchBar = () => {
    const { setLocationSearchInput, setUserLocation, state } = useLocationCtx()
    const { locationSearchInput, userLocation }              = state

    const [address, setAddress]       = useState('')
    const [isSelected, setIsSelected] = useState(false)

    const buttonsClassName = 'h-8 w-8 mx-3 flex justify-center items-center'
    const inputRef         = useRef(null)

    const formatCoordsToAddress = () => {
        const { latitude, longitude } = userLocation
            
        const coords = {
            lat: latitude,
            lng: longitude
        }

        const geocoder = new google.maps.Geocoder()

        geocoder.geocode({ location: coords })
            .then(res => {
                setAddress(res.results[0].formatted_address)
                setLocationSearchInput(res.results[0].formatted_address)
                
            })
            .catch(err => console.error(err?.message || err))
    }

    const handleChange = address => {
        setAddress(address)

        if (!address.length && isSelected) {
            setIsSelected(false)
        }
    }

    const handleClearInput = () => {
        setAddress('')
        setIsSelected(false)
    }

    const handleError = err => {
        console.error('Places error handler -> ', err?.message || err)
    }

    const handleSelect = address => {
        setAddress(address)
        setLocationSearchInput(address)
        setIsSelected(true)
        
        inputRef.current.blur()  

        geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then(({ lat, lng }) => {
            const data = {
                latitude : lat,
                longitude: lng
            }

            setUserLocation(data)
        }).catch(err => console.error('Error -> ', err?.message || err))
    }

    const handleUnselect = useCallback(() => {
        if (isSelected) {
            setIsSelected(false)
        } 
    }, [isSelected])

    const renderPlacesChildren = ({ getInputProps, getSuggestionItemProps, loading, suggestions }) => (
        <div className="text-base bg-white w-full" onClick={() => handleUnselect()}>
            <div className="flex flex-row w-full items-center xs:text-base xxs:text-base md:text-lg text-base">
                <LocationSearchBarIcon isSelected={isSelected} />
                
                <input 
                    {...getInputProps({
                        placeholder: 'Find a RoboBurger near you',
                        className  : className(
                            'placeholder:text-gray-200 w-full tracking-wide text-md flex h-[52px] border-none focus:outline-none indent-2 w-full text-black',
                            isSelected ? 'font-futura-medium' : 'pl-2'
                        )
                    })} 
                    ref   = {inputRef}
                    value = {address}
                />

                {
                    address
                        ?   <button className={buttonsClassName} onClick={() => handleClearInput()} type="button">
                                <ClearCircle className="h-5 w-5" fill="#707070" aria-label="Remove Icon - Click to remove location" role="text" tabIndex={0}/>
                            </button> 
                        :   <button className={buttonsClassName}>
                                <LocationArrow className="h-6 w-6" fill="transparent" stroke="#8D8D8D"  aria-label="Location Arrow Icon" role="text" tabIndex={0} />
                            </button>
                
                }
            </div>
            
            {
                suggestions.length
                    ?   <div className="drop-shadow-lg tracking-wide w-full">
                            {      
                                suggestions.map(suggestion => {           
                                    const style = suggestion.active
                                        ? { backgroundColor: '#EDE8E4', cursor: 'pointer', color: '#3A2103' }
                                        : { backgroundColor: 'white', cursor: 'pointer', color: '#3A2103' };
            
                                    return (
                                        <div 
                                            className = "relative flex flex-row items-center sm:text-sm xs:text-xs xxs:text-xs 3xs:text-xs text-base pl-1 h-[52px] xs:h-[45px] xxs:h-[45px] 3xs:h-[45px] w-full" 
                                            key       = {suggestion.description} 
                                            {...getSuggestionItemProps(suggestion, {style})} 
                                        >
                                            <div className="pl-4">
                                                <LocationPin className="h-4 w-4" fill="#C50100" />
                                            </div>
            
                                            <p className="absolute w-full truncate pl-10 pr-2 font-futura"> {suggestion.description} </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    :   loading ? <div className="drop-shadow-lg sm:text-sm xs:text-xs xxs:text-xs 3xs:text-xs text-base pl-1 h-[52px] text-center"> Loading... </div>
                    :   null
            }
        </div>
    )

    useEffectOnce(() => {
        if (!isEmptyObject(userLocation) && !locationSearchInput) {
            formatCoordsToAddress()
            setIsSelected(true)
        } else if (locationSearchInput) {
            setAddress(locationSearchInput)
            setIsSelected(true)
        }
    })

    useUpdateEffect(() => {
        if (!isEmptyObject(userLocation) && !locationSearchInput) {
            formatCoordsToAddress()
            setIsSelected(true)
        }
    }, [userLocation])

    return (
        <div className="flex justify-center items-center text-black w-full">
            <PlacesAutocomplete
                highlightFirstSuggestion
                onChange = {e => handleChange(e)}
                onError  = {e => handleError(e)}
                onSelect = {e => handleSelect(e)}
                value    = {address}
            >
                {renderPlacesChildren}
            </PlacesAutocomplete>
        </div> 
    )  
}

export default LocationSearchBar

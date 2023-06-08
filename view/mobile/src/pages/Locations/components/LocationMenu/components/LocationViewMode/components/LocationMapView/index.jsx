import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocationCtx } from '../../../../../../../../hooks'
import { GoogleMap, Marker, MarkerClusterer, InfoWindow } from '@react-google-maps/api'
import { IMAGES, MAP_CONTAINER } from '../../../../../../../../utilities/constants'
import Carousel from './components/Carousel'
import CarouselFallbackContainer from './components/CarouselFallbackContainer'
import InfoWindowContent from './components/InfoWindowContent'
import LocationFallback from '../../../../../Common/LocationFallback'

const LocationMapView = ({ setIsOpenModal, setVendingMachine }) =>  {
    const { isLoading, mapOptions, state }  = useLocationCtx()
    const { userLocation, vendingMachines } = state
    
    const [activeMarker, setActiveMarker] = useState(null)
    const [map, setMap]                   = useState(null)

    const initialUserMarker = useRef(null)
    const newUserMarker     = useRef(null)
    
    const userIconProps = {
        anchor    : new window.google.maps.Point(17, 46), 
        scaledSize: new window.google.maps.Size(45.7, 45.7), 
        url       : 'https://roboburgerdev.blob.core.windows.net/public-images/pulsing-marker.gif'
    }
    
    const vendingMachineIconProps = {
        anchor    : new window.google.maps.Point(17, 46), 
        scaledSize: new window.google.maps.Size(27, 34), 
        url       : IMAGES.LOCATIONMARKER
    }

    const setMarker = markerRef => {
        const coords     = getCoords(userLocation)
        const userMarker = getMarkerInstance(userIconProps, coords)

        userMarker.addListener('click', () => {
            map.panTo(coords)
        })

        userMarker.setMap(map)

        map.panTo(coords)
        map.setZoom(12)

        markerRef.current = userMarker
    }

    const getCoords = userLocation => {
        const { latitude: lat, longitude: lng } = userLocation

        return { lat, lng }
    }

    const getMarkerInstance = useCallback((userIconProps, coords) => {
        const userMarkerProps = {
            icon    : userIconProps,
            position: coords,
            zIndex  : 3
        }     
    
        return new google.maps.Marker(userMarkerProps)
    }, [])

    const handleClick = () => setActiveMarker(null)
 
    const handleLoad = useCallback(map => { 
        const bounds = new window.google.maps.LatLngBounds()

        vendingMachines.forEach(vm => bounds.extend({ lat: vm.latitude, lng: vm.longitude }))
        
        map.fitBounds(bounds)

        setMap(map)
    }, [])

    useEffect(() => {
        if (initialUserMarker.current && activeMarker) {
            initialUserMarker.current.addListener('click', () => {
                if (activeMarker) {
                    setActiveMarker(null)
                }
            })
        }
    }, [activeMarker, initialUserMarker.current])

    useEffect(() => {
        if (newUserMarker.current && activeMarker) {
            newUserMarker.current.addListener('click', () => {
                if (activeMarker) {
                    setActiveMarker(null)
                }
            })
        }
    }, [activeMarker, newUserMarker.current])

    useEffect(() => {
        if (map) {
            setMarker(initialUserMarker)
        }
    }, [map])

    useEffect(() => {
        if (initialUserMarker.current) {
            initialUserMarker.current.setMap(null)
        }

        if (map) {
            setMarker(newUserMarker)

            return () => {
                newUserMarker?.current?.setMap(null)
            }
        }
    }, [userLocation, map])

    useEffect(() => {
        if (activeMarker && map) {
            const clickListener = google.maps.event.addListener(map, 'click', handleClick)

            return () => {
                google.maps.event.removeListener(clickListener)
            }
        }
    }, [activeMarker, map])

    return (
        <div className="absolute relative bg-red-200 w-screen h-full -left-4 -top-20 z-[1]">
            <GoogleMap 
                defaultCenter     = {userLocation} 
                mapContainerStyle = {MAP_CONTAINER} 
                onLoad            = {handleLoad} 
                options           = {mapOptions} 
            > 
                <MarkerClusterer> 
                    {
                        clusterer => vendingMachines.map(vm => {
                            const coordinates = {
                                lat: vm.latitude,
                                lng: vm.longitude
                            }
                            
                            return (
                                <Marker 
                                    clusterer = {clusterer} 
                                    icon      = {vendingMachineIconProps} 
                                    key       = {vm.location}
                                    onClick   = {() => { 
                                        setActiveMarker(vm.location)
                                    }} 
                                    position  = {coordinates} 
                                    title     = {vm.location}
                                    zIndex    = {2}
                                >
                                    {
                                        activeMarker === vm.location
                                            ?   <InfoWindow 
                                                    onCloseClick = {handleClick}
                                                    options      = {{
                                                        minWidth: 280
                                                    }}
                                                >
                                                    <InfoWindowContent 
                                                        vm                 = {vm}  
                                                        setIsOpenModal     = {setIsOpenModal} 
                                                        setVendingMachine  = {setVendingMachine} 
                                                    />
                                                </InfoWindow> 
                                            :   null
                                    }
                                </Marker> 
                            )
                        })
                    }
                    </MarkerClusterer> 
            </GoogleMap> 

            <CarouselFallbackContainer>
                {
                    !isLoading && vendingMachines.length > 0 ? (
                        <Carousel
                            setIsOpenModal     = {setIsOpenModal} 
                            setVendingMachine  = {setVendingMachine}
                        />
                    ) : <LocationFallback />
                }
            </CarouselFallbackContainer>
        </div>
    )
}

export default LocationMapView

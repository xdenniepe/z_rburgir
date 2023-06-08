import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMAGES } from '../../utilities/constants'

const SplashScreen = ({ renderSr }) => {
    const navigate = useNavigate()

    const initSplash = () => {
        setTimeout(() => {
            navigate('/landingpage')
        }, 4000)
    }

    useEffect(() => {
        initSplash()
    }, [])
    
    return ( 
        <>
            {renderSr()}
            <picture>
                <source className="h-screen w-full" media="(min-width:720px)" srcSet={IMAGES.LARGEROBOLOADING} alt="loading image" aria-label="Grilled burgers at the press of a button" tabIndex={0} role="img"/>
                <img src={IMAGES.ROBOLOADING} className="h-screen w-full object-cover object-top" alt="loading image" aria-label="Grilled burgers at the press of a button" tabIndex={0} role="img"/>
            </picture>
        </>
    )
}

export default SplashScreen
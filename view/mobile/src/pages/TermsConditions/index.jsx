import React, { useEffect } from 'react'

const TermsConditions = ({ setHasLoaded, renderSr }) => {
    useEffect(() => {
        setHasLoaded(true)
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            {renderSr()}
            <div className="text-md sm:text-sm md:text-md lg:text-lg text-robo-currency m-2 p-4 my-3" aria-label="Terms and Conditions">
            </div>
        </>
    )
}

export default TermsConditions
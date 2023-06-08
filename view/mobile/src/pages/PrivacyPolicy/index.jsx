import React, { useEffect } from 'react'

const PrivacyPolicy = (props) => {
    const { setHasLoaded, renderSr } = props

	useEffect(() => {
		setHasLoaded(true)
		window.scrollTo(0, 0)
	}, [])

    return (
        <>
            {renderSr()}
            <div className="text-md sm:text-sm md:text-md lg:text-lg text-robo-currency m-2 p-4 my-3" aria-label="privacy policy">
            </div>
        </>
    )
}

export default PrivacyPolicy
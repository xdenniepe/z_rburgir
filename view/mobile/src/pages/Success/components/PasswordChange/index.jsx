import React from 'react'
import { IMAGES } from '../../../../utilities/constants'

const PasswordChange = () => {
	return (
		<div className="w-full">
			<div className="flex w-full justify-center items-center mb-10">
				<img 
					aria-label = "Check Icon"
					className  = "h-[128.43px] w-[128.43px]"
					src        = {IMAGES.CHECKCIRCLE} 
					tabIndex   = {0}
				/>
			</div>

			<div className="w-full text-robo-primaryTwo text-center space-y-2">
				<p className="text-2xl"> Success! </p>
				<p 
					aria-label = "Your password has been changed!"
					className  = "text-sm tracking-[1.44px] leading-[23.5px]"
					tabIndex   = {0}
				>
					Your password has been changed!
				</p>
			</div>
		</div>
	)
}

export default PasswordChange

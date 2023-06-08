import React, { memo } from 'react'
import { displayError } from '../../../../../utilities/helpers'

const InputError = ({ formik, name }) => {
	const errMessage = displayError(formik, name) 

	return errMessage ? (
		<label 
			aria-live = "assertive"
			className = "font-normal text-sm text-[#c12026] tracking-[1.12px] mt-[13px] block" 
			tabIndex  = {0} 
		>
			{errMessage}
		</label>
	) : null
}

export default memo(InputError)

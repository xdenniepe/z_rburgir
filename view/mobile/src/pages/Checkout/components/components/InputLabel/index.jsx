import React, { memo } from 'react'

const InputLabel = ({ label }) => {
	return (
		<span aria-label={label} className="relative" role="text" tabIndex={0}>
			<span 
				className = "capitalize text-robo-primaryTwo text-sm font-normal tracking-wide mb-3.5 block tracking-[1.12px] mt-[22px] sm:mt-[22px] xs:mt-[18px] xxs:mt-[16px] 3xs:mt-[14px]"
				// htmlFor   = {name} 
			>
				{`${label}*`}
			</span>
		</span>
	)
}

export default memo(InputLabel)

import React from 'react'
import { autoCapitalize } from '../../../utilities/helpers'

const Button = props => {
    /**
     * type     = String
     * label    = String
     * classes  = String (className)
     */
    const { type, label, classes, ariaLabel } = props

    return (   
        <button 
            type          = {type}
            className     = {`button-default ${classes ? classes : 'font-semibold text-white'}`}
            aria-label    = {ariaLabel}
            {...props}
        >
            {label ? autoCapitalize(label) : ''}
        </button>    
    )
}

export default Button

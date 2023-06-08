import React from 'react'
import InputContainer from '../components/InputContainer'
import InputError from '../components/InputError'
import InputLabel from '../components/InputLabel'
import MaskedInput from 'react-text-mask'

const InputMasked = ({ altPlaceholder, formik, label, mask, name, placeholder}) => {    
    const labelId = `${name}-label`

    return (
        <div>
            <InputLabel label={label} labelId={labelId} name={name} />
            
            <InputContainer>
                <MaskedInput 
                    // aria-describedby = {labelId}
                    // aria-label       = {placeholder}
                    className   = "bg-transparent placeholder-[#757575] tracking-[1.44px] focus:outline-none px-[18px] xs:px-4 xxs:px-4 absolute inset-0 field-font-size"
                    guide       = {false}
                    id          = {name}
                    role        = "textbox"
                    type        = "text"
                    mask        = {mask}
                    placeholder = {altPlaceholder || placeholder}
                    aria-label  = {label}
                    {...formik.getFieldProps(name)} 
                />
            </InputContainer>

            <InputError formik={formik} name={name} />
        </div>
    )
}

export default InputMasked
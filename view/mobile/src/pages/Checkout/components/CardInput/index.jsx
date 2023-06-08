import React from 'react'
import InputContainer from '../components/InputContainer'
import InputError from '../components/InputError'
import InputLabel from '../components/InputLabel'

const CardInput = ({ formik, label, name, placeholder }) => {
    const labelId = `${name}-label`

    return (
        <div>
            <InputLabel label={label} labelId={labelId} name={name} />

            <InputContainer>
                <input 
                    aria-describedby = {labelId}
                    aria-label       = {label}                   
                    className        = "bg-transparent placeholder-[#757575] tracking-[1.44px] focus:outline-none px-[18px] xs:px-4 xxs:px-4 absolute inset-0 field-font-size"
                    id               = {name}
                    maxLength        = {50}
                    placeholder      = {placeholder}
                    role             = "textbox"
                    tabIndex         = {0}
                    type             = "text"
                    {...formik.getFieldProps(name)}
                />     
            </InputContainer>           

            <InputError formik={formik} name={name} />
        </div>
    )
}

export default CardInput

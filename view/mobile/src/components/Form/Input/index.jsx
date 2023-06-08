import React from 'react'
import { className, displayError, getInputClasses } from '../../../utilities/helpers'

const Input = (props) => {
    /**
     * id = String
     * name = String
     * label = String
     * type = String
     * formik = Formik function
     * labelclass = String (classname)
     * containerclass = String (classname)
     * inputclass = String (classname)
     * error = String
     * errorclass = String
     * optional = Boolean
     */
    const { id, name, label, type, containerclass, inputclass, formik, errorclass, onKeyUp, maxLength, bgclass} = props
    
    const hiddenLabel = ['Enter Code', 'Enter Email', 'Enter Email or Phone Number' ]

    return (
        <div className="relative sm:mt-[22px] xs:mt-[18px] xxs:mt-[16px] 3xs:mt-[14px]">
            <span className={`text-robo-primaryTwo text-sm font-normal tracking-wide px-1 ${className(hiddenLabel.includes(label) ? 'hidden' : "")}`} aria-live="off" aria-label={label} tabIndex={0} role="text"> {label} </span>
            <div className={`relative ${bgclass ? bgclass : 'bg-[#FFFFFF]'} h-[66px] sm:h-[66px] xs:h-[55px] xxs:h-[44px] 3xs:h-[42px] border p-4 sm:p-4 xs:p-3 xxs:p-3 3xs:p-3 mt-2 xs:mt-[0.2rem] xxs:mt-[0.2rem] 3xs:mt-[0.2rem] text-base border-gray-100 tracking-wider xxs:text-xxs ${formik ? getInputClasses(formik, id) : ' '} ${containerclass}`}>
                <input 
                    type             = {type}
                    name             = {name}
                    onKeyUp          = {onKeyUp}
                    placeholder      = {label}
                    className        = {`disabled:opacity-100 autofill:bg-robo-primary block w-full h-full appearance-none focus:outline-none bg-transparent ${inputclass} md:text-xl sm:text-lg xs:text-base xxs:text-base tracking-[1.44px] ${props?.disabled ? 'text-[#757575]' : ''}`}
                    maxLength        = {maxLength ? maxLength : 50}
                    role             = "textbox"
                    aria-describedby = "errormessage"   
                    tabIndex         = {0}                
                    {...formik ? formik.getFieldProps(id) : null}
                    {...props}
                />
            
            </div>
            <div className={`text-red-700 font-normal mt-1.5 px-1 tracking-[1.12px] leading-[15px] sm:text-xs xs:text-xs xxs:text-xs md:text-base ${errorclass && errorclass}`}>
                {
                    displayError(formik, id) &&
                    <p id="errormessage" tabIndex={displayError(formik, id) !== ' ' ? 0 : 1} aria-live="assertive">{ formik ? displayError(formik, id) : ' '}</p>
                }
            </div>
        </div>
    )
}

export default Input

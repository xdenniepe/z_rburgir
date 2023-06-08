import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useOutsideClick from '../../../hooks/useOutsideClick'
import { displayError, getInputClasses } from '../../../utilities/helpers'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import { passwordRegex } from '../../../utilities/constants'
import clsx from 'clsx'

const Password = ({ hidecriteria, ...props }) => {
    /**
     * id = String
     * name = String
     * label = String
     * error = String
     * showcriteria = Boolean
     * formik = Formik function
     * labelclass = String (classname)
     * containerclass = String (classname)
     * inputclass = String (classname)
     */
    const { id, name, label, containerclass, inputclass, labelclass, formik, errorclass, showcriteria, error, bgclass, ariaLabel} = props
    const location = useLocation()
    const passwordRef                     = useRef(null)
    const [showPassword, setshowPassword] = useState(false)
    const [srError, setSrError]           = useState([])
    const isClickedOutside                = useOutsideClick(passwordRef)
    
    const passwordHints = 'Must be at least 8 characters. Must have at least 1 lowercase letter. Must have at least 1 uppercase letter. Must have at least 1 number. Must have at least 1 special character.'
    const srErrorHolder = srError.sort(() => Math.random() - 0.5)

    let eyeOn  = 'Show Icon - Show Password'
    let eyeOff = 'Hide Icon - Hide Password'

    const handleshowPassword = () => {
        setshowPassword(!showPassword)
    }

    useEffect(() => {
        setSrError([])

        passwordRegex.map((data) => {
            if (!formik.values.password.match(data.regex)) {
                setSrError( prev => [...new Set([...prev, data.accessibility])])
            } else if (formik.values.password.length < 8) {
                setSrError( prev => [...new Set([...prev, 'You need to input at least 8 characters.'])])
            }
        })
    }, [formik.values.password, formik.touched.password])

    useEffect(() => {
        setshowPassword(false)
    }, [formik.isSubmitting])

    useEffect(() => {
        if (isClickedOutside && hidecriteria && passwordRef.current && location.pathname === '/settings') {
            hidecriteria()
        }
    }, [isClickedOutside])

    const hiddenLabel = ['/settings', '/signin', '/signup']

    return (
        <div className={`relative sm:mt-[22px] xs:mt-[18px] xxs:mt-[16px] 3xs:mt-[14px]`} ref={passwordRef}>
            <span className={`text-robo-primaryTwo text-sm font-normal tracking-wide px-1 ${(hiddenLabel.includes(location.pathname) ? '' : 'hidden')}`} aria-live="off" aria-label={label} tabIndex={0} role="text"> {label} </span>
            <div className={`text-black ${bgclass ? bgclass : 'bg-[#FFFFFF]'} h-[66px] sm:h-[66px] xs:h-[55px] xxs:h-[44px] 3xs:h-[42px] relative p-4 sm:p-4 xs:p-3 xxs:p-3 3xs:p-3 mt-2 xs:mt-[0.2rem] xxs:mt-[0.2rem] 3xs:mt-[0.2rem] border text-base border-gray-100 focus-within:border-gray-200 tracking-wider ${formik ? getInputClasses(formik, id) : ' '} ${containerclass}`}>
                <input
                    aria-describedby = {name === 'password' ? 'password-hints' : ''}
                    autoComplete     = "new-password"
                    type             = {showPassword ? 'text' : 'password'}
                    role             = "textbox"
                    name             = {name}
                    placeholder      = {label  + "*"}
                    maxLength        = {50}
                    className        = {`block w-10/12 h-full appearance-none focus:outline-none bg-transparent ${inputclass} md:text-xl sm:text-lg xs:text-base xxs:text-base tracking-[1.44px]`}
                    {...formik ? formik.getFieldProps(id) : null}
                    {...props}  
                />

                <div className="absolute right-4 top-[11px] sm:top-[11px] xs:top-[5px] xxs:-top-[1px] 3xs:-top-[7px]  h-[44px] w-[44px] flex items-center justify-center">
                    <button 
                        type         = "button" 
                        role         = "switch" 
                        aria-checked = "false" 
                        className    = "h-6 w-6 button-touch cursor-pointer" 
                        onClick      = {() => handleshowPassword()}
                    >
                        <p className="sr-only"> {showPassword ? eyeOn : eyeOff} </p>
                        {showPassword ? <EyeIcon className="text-gray-500" /> : <EyeOffIcon className="text-gray-500" />}
                    </button>
                </div>

                {/* Special Errors  */}
                <div className={`absolute top-7 pt-5 -mr-2 text-red-700 mt-2 font-normal tracking-tight text-sm ${errorclass && errorclass}
                    ${clsx({ 'hidden': (!(error || showcriteria) && formik) })}`} >
                    {error}
                </div>
            </div>
            <div className={`text-red-700 mt-1.5 px-1 font-normal tracking-[1.12px] sm:text-xs xs:text-xs xxs:text-xs text-base leading-[15px] ${errorclass && errorclass}`} aria-describedby="password-red-700s">
                    {formik && showcriteria !== "true" ? displayError(formik, id) : ' '}
                    <p id="password-errors" className="sr-only" aria-atomic="true" tabIndex={!displayError(formik, id) ? 1 : 0} aria-label={displayError(formik, id) ? 'Pleast provide your password' : ''}> 
                        {showcriteria && formik.values.password ? srErrorHolder : ''} 
                    </p>
            </div>

            <PasswordCriteria hidden={showcriteria === "true" ? false : true} values={formik.values} />
        </div>
    )
}

const PasswordCriteria = props => {
    const { hidden, values } = props

    return (
        <div hidden={hidden} className="text-gray-500 mt-2 text-sm text-sm px-1 tracking-wide">
            <p id="password-hints" className="sr-only" hidden={true}> 
                Must be at least 8 characters. Must have at least 1 lowercase letter. Must have at least 1 uppercase letter. Must have at least 1 number. Must have at least 1 special character. 
            </p>
            <h3 className="font-futura-bold"> Your password must have: </h3>
            <ul className="space-y-3 mt-3">
                <div className="flex items-center">
                    <div className="w-6">
                        {
                            values.password.length >= 8
                                ?   <CheckCircleIcon className="h-5 w-5 mr-2 text-green-700" />
                                :   <XCircleIcon className="h-5 w-5 mr-2 text-red-800" />
                        }
                    </div>

                    <li> Minimum of 8 characters </li>
                </div>

                {
                    passwordRegex.map((data, index) => {
                        return (
                            <div key={`_${index}`} className="flex items-center text-sm">
                                <div className="w-6">
                                    {
                                        values.password.match(data.regex)
                                        ?   <CheckCircleIcon className="h-5 w-5 mr-2 text-green-700" />
                                        :   <XCircleIcon className="h-5 w-5 mr-2 text-red-800" />
                                    }
                                </div>
                                <li> {data.description} </li>
                            </div>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Password

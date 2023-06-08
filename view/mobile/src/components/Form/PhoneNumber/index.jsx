import React, { useEffect, useState } from 'react'
import { useAuthCtx, useUpdateEffect } from '../../../hooks'
import { useLocation } from 'react-router-dom'
import { displayError } from '../../../utilities/helpers'
import Input, { getCountries, getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input/input-mobile'
import en from 'react-phone-number-input/locale/en.json'
import 'react-phone-number-input/style.css'

const PhoneNumber = ({ formik, id, label, name, onFocus }) => {
    const ALAND = 'Åland Islands'

    const { user }          = useAuthCtx().state
    const { pathname }      = useLocation()
    const { values }        = formik
    const [input, setInput] = useState({ callCode: '1', country: 'US', phoneNumber: ''})
    
    const phoneNumberStatus = user?.phoneNumberStatus
    const userPhoneNumber   = user?.phoneNumber

    const isActive          = phoneNumberStatus === 'ACT'
    const isSettings        = pathname === '/settings'
    const isSignIn          = pathname === '/signin'

    const countries = getCountries()
        .sort((countryA, countryB) => {
            /**
             * When sorting alphabetically, sort does not read "Å" as alphabet but a special character.
             * "Å" is only on "Åland Islands" islands.
             * To sort it alphabetically, we will replace "Å" with "A" then revert it back to "Åland Islands"
             */
             
            const origA    = en[countryA] 
            const origB    = en[countryB] 
            const isAlandA = origA === ALAND
            const isAlandB = origB === ALAND

            const resetCountries = () => {
                en[countryA] = origA 
                en[countryB] = origB 
            }

            if (isAlandA) {
                en[countryA] = 'Aland Islands'
            }

            if (isAlandB) {
                en[countryB] = 'Aland Islands'
            }

            if (en[countryA] < en[countryB]) {
                resetCountries()

                return -1
            }
            if (en[countryA] > en[countryB]) {
                resetCountries()

                return 1
            }
        
            return 0
        })

    const removePlusSign = value => {
       return value.slice(1)
    }

    const handleCountryChange = e => {
        const { value } = e.target

        if (!value) {
            setInput(({
                callCode   : '', 
                country    : '', 
                phoneNumber: ''
            }))

            return 
        }

        setInput(input => ({
            ...input, 
            callCode   : getCountryCallingCode(value),
            country    : value,
            phoneNumber: ''
        }))

        formik.setFieldValue(id, '')

    }

    const handleChange = value => {
        formik.setFieldValue(id, value ? removePlusSign(value) : '') 

        setInput(input => ({
            ...input, 
            phoneNumber: value ? value : ''
        }))
    }

    const handleClick = () => { 
        if (id.toString() in formik.touched) return

        formik.setFieldTouched(id)
    }

    const maxNumber = () => {
        if (input.callCode.length === 0) {
           return 17
        } else if (input.callCode.length === 3) {
           return 12
        } else if (input.callCode.length === 2 && (input.country === 'PH' || input.country === 'SG')) {
            return 16
        } else if (input.callCode.length === 2 && input.country !== 'AT' ) {
            return 13
        } else if (input.callCode.length === 1) {
            return 15
        } else {
            return 14
        }
    }

    useEffect(() => {
        if ((userPhoneNumber && isSettings) || (isSettings && input.phoneNumber)) {
            const { country, countryCallingCode } = parsePhoneNumber(userPhoneNumber)
            
            setInput({
                callCode   : countryCallingCode,
                country    : country,
                phoneNumber: userPhoneNumber
            })
        } else {
            
            setInput({
                callCode   : 1,
                country    : 'US',
                phoneNumber: ''
            })
            formik.setFieldValue(id, "") 
        }
    }, [userPhoneNumber])

    useUpdateEffect(() => {
        if (isSignIn && values?.email) {
            setInput({
                ...input,
                phoneNumber: ''
            })
        }
    }, [values?.email])

    return (
        <div className="relative sm:mt-[22px] xs:mt-[18px] xxs:mt-[16px] 3xs:mt-[14px]">
            <span className="text-robo-primaryTwo text-sm font-normal tracking-wide px-1" aria-label={label} role="text" tabIndex={0}> {label} </span>
            <div className={`${isSettings ? 'bg-white' :  'bg-slate-50'} flex flex-row h-[66px] sm:h-[66px] xs:h-[55px] xxs:h-[44px] 3xs:h-[42px] mt-2 xs:mt-[0.2rem] xxs:mt-[0.2rem] 3xs:mt-[0.2rem] relative border p-4 sm:p-4 xs:p-3 xxs:p-3 3xs:p-3 border-gray-100 tracking-wider`}> 
                <div className={`relative flex flex-row items-center justify-start pr-2 ${input.country ? 'w-[58px]' : 'sm:w-[99px] xs:w-[96px] xxs:w-[96px] 3xs:w-[96px] w-[99px]' }`}>
                    {
                        input.country 
                            &&  <div className={`w-fit h-fit ${isActive ? 'opacity-50' : ''}`}>
                                    <img src={`https://flagicons.lipis.dev/flags/4x3/${input.country.toLowerCase()}.svg`} className="h-6 border border-black" role="img" aria-label={`${en[input.country]} flag`} tabIndex={0} aria-live="off" />
                                </div>
                    }

                    <select
                        className = {`text-[#9ca3af] font-futura bg-slate-50 focus:outline-none absolute right-0 md:text-xl sm:text-lg xs:text-base xxs:text-base ${input.country ? 'w-5' : 'w-full'}`}
                        readOnly  = {isActive}
                        value     = {input.country}
                        onChange  = {e => handleCountryChange(e)}
                        aria-label="Select phone number country code"
                        tabIndex  = {0}
                    >
                        <option aria-hidden={true} value="">
                            Country
                        </option>

                        {
                            countries.map(country => (
                                <option key={country} value={country}>
                                    {en[country]}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <span 
                    className={`w-fit h-fit my-auto ml-[4px] md:text-xl sm:text-lg xs:text-base xxs:text-base tracking-[1.44px] 
                                ${isActive ? 'text-[#757575]' : ''} ${!input.phoneNumber && 'text-[#9ca3af]'} font-futura`} 
                    aria-label={`${input.callCode}`} 
                    tabIndex={0} 
                    role="text"
                > 
                    +{input.callCode}
                </span>

                <Input
                    international
                    readOnly    = {isActive}
                    name        = {name}
                    type        = "text"
                    value       = {input.phoneNumber}
                    placeholder = "Enter Number"
                    role        = "textbox"
                    tabIndex    = {0}
                    onChange    = {value => handleChange(value)}
                    onClick     = {() => handleClick()}
                    onFocus     = {onFocus}
                    country     = {input.country}   
                    maxLength   = {maxNumber()}    
                    className   = {`${isActive ? 'text-[#757575]' : ''} bg-transparent focus:outline-none w-2/3 md:text-xl sm:text-lg xs:text-base xxs:text-base indent-2 tracking-[1.44px] font-futura my-auto`}
                />
            </div>

            <div className="text-red-700 px-1 font-normal mt-1.5 tracking-[1.12px] leading-[15px] sm:text-xs xs:text-xs xxs:text-xxs text-base">
                <p id="errormessage" tabIndex={displayError(formik, id) !== ' ' ? 0 : 1}> 
                    {formik ? displayError(formik, id) : ' '} 
                </p>
            </div>
        </div>
    )
}

export default PhoneNumber
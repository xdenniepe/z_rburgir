import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthCtx } from '../../../../hooks'
import { includePlus } from '../../../../utilities/helpers'

const UserVerifyButton = ({ formik, sendUserVerification, fieldStatus }) => {
    const { user }   = useAuthCtx().state
    const { values } = formik

    const buttonRef = useRef(null)

    const navigate = useNavigate()

    const handleClick = () => {
        let objProp = ''
        let propVal = ''

        if (fieldStatus === 'emailStatus') {
            objProp = 'email'
            propVal = values.email
        } else if (fieldStatus === 'phoneNumberStatus') {
            objProp = 'phoneNumber'
            propVal = includePlus(values.phoneNumber)
        }

        const valueObject = {
            [objProp]: propVal
        }

        sendUserVerification(user, valueObject, navigate)
    }

    useEffect(() => {
        const ref = buttonRef.current

        if (ref) {
            ref.addEventListener('click', handleClick)
        
            return () => ref.removeEventListener('click', handleClick)
        }
    }, [buttonRef.current])

    return (
          
        <div className="absolute bottom-1.5 right-1 h-[66px] sm:h-[66px] xs:h-[55px] xxs:h-[44px] 3xs:h-[42px] bg-transparent flex justify-center items-center">
            <button 
                className = "font-futura-medium tracking-widest underline h-fit w-fit bg-white px-3 pt-0.5"
                ref       = {buttonRef}  
                type      = "button"
            >
                Verify
            </button>
        </div>
    )
}

export default UserVerifyButton

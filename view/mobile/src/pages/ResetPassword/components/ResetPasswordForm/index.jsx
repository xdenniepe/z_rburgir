import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAuthCtx } from '../../../../hooks'
import { resetSchema } from '../../../../validation/schema'
import { request } from '../../../../services/request'
import { Password } from '../../../../components/Form'
import { POST } from '../../../../utilities/constants'
import api from '../../../../services/api'

const ResetPasswordForm = () => {
    const { resetPassword, verifyAccount, getAuthType } = useAuthCtx()
    const { code } = useParams()
    const [showCriteria, setShowCriteria] = useState(false)
    
    const location = useLocation()      
       
    const navigate = useNavigate()

    const labelProps = [
        { passwordLabel: 'Input New Password.' },
        { passwordLabel: 'Confirm Input New Password.' },
    ]

    const initialValues = {
        password       : '',
        confirmPassword: ''
    }

    const handleHideCriteria = () => {
        setShowCriteria(false)
    }

    const handlePasswordCriteria = () => {
        setShowCriteria(true)
    }

    const handleSubmit = async ({ password }, { resetForm, setSubmitting, setFieldError}) => {
        const authType = await getAuthType(location.state.credential)

        request({
            url   : api.LOGIN,
            method: POST,
            data  : {
                username : location.state.credential,
                password : password,
                loginType: authType === 'email' ? 'email' : 'phone_number'
            }
        })
        .then(async ({ data }) => {
            if (data === '') {
                try {
                    const resetRes   = await resetPassword(code, password)
                    const { status } = resetRes

                    if (status === 200) {
                        setSubmitting(false)
                        navigate('/success?message=passwordchange')
                    } else {
                        console.err(err?.message || err)
                        resetForm()
                        setSubmitting(false)
                    }  

                } catch (err) {
                    console.log(err?.message || err)
                    resetForm()
                    setSubmitting(false)
                }        
            } else {
                setFieldError('password', 'New password cannot be your old password') 
                setFieldError('confirmPassword', 'New password cannot be your old password') 
            }
        })
    }

    const formik = useFormik({
        initialValues,
        validationSchema: resetSchema,
        onSubmit        : handleSubmit,
        validateOnBlur  : false
    })

    const { isValid, isSubmitting, values } = formik

    useEffect(() => {
        verifyAccount(code)
    }, [code])

    return (
        <form onSubmit={formik.handleSubmit} className="w-full max-h-fit">
            <div>
                <Password 
                    label         = "New Password" 
                    id            = "password" 
                    name          = "password" 
                    formik        = {formik} 
                    onFocus       = {handlePasswordCriteria} 
                    showcriteria  = {showCriteria.toString()} 
                    props         = {labelProps[0]} 
                    aria-required = {true} 
                />

                <Password 
                    label         = "Confirm Password" 
                    id            = "confirmPassword" 
                    name          = "confirmPassword" 
                    onFocus       = {handleHideCriteria} 
                    formik        = {formik} 
                    props         = {labelProps[1]} 
                    aria-required = {true} 
                />
            </div>

            <div className="mt-10 relative sm:mt-[31px] xs:mt-[26px] xxs:mt-[24px] 3xs:mt-[22px]">
                <button
                    aria-label = "Confirm"
                    className  = "button-default bg-robo-primaryTwo text-robo-primaryThree disabled:opacity-75"
                    disabled   = {!isValid || isSubmitting || (!values.password && !values.confirmPassword)}
                    type       = "submit"
                >
                    CONFIRM
                </button>
            </div> 
        </form>
    )
}

export default ResetPasswordForm

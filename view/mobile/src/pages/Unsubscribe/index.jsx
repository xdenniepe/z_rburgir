import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthCtx } from '../../hooks'
import { UnsubscribeEmail } from '../../utilities/icons'

const Unsubscribe = ({ toast }) => {
    const { unsubscribeEmailAccount, setUser, dispatch } = useAuthCtx()
    const [queryParams] = useSearchParams()
    
    const code = queryParams.get('code')

    const navigate = useNavigate()

    const handleClick = () => {
        unsubscribeEmailAccount(code).then(res => {
            if (res.status === 200) {
                setUser(dispatch, res.data)
                navigate('/success?message=unsubscribesuccess')
            } else {
                toast('Error', 'Invalid unsubscription link.')
                
                setTimeout(() => {
                    navigate('/signin')
                },1000)
            }
        })
        .catch(() => {
            toast('Error', 'Unsubscription link expired.')
            
            setTimeout(() => {
                navigate('/signin')
            }, 1000)
        })
    }
   
    return (
        <div className="container-class px-10 bg-[#ede8e4] items-center">
            <div className="w-full lg:w-1/5">
            <p className="text-lg tacking-[1.44px] font-futura-bold text-center" aria-label="Do you want to unsubscribe?" tabIndex={0}>
                Do you want to unsubscribe?
            </p>
            <div className="flex justify-center mt-[48px]" aria-label="Unsubscribe envelope" tabIndex={0}>
                <UnsubscribeEmail/>
            </div>
            <p className="text-base tracking-[0.77px] leading-[23.5px] text-center mt-[48px]" aria-label="If you unsubscribe, Roboburger will no longer send you marketing emails" tabIndex={0}>
                If you unsubscribe, Roboburger will no longer send you marketing emails
            </p>
            <button
                    aria-label = "ARIA LABEL"
                    className  = "mt-[29px] tracking-widest uppercase flex items-center justify-center text-robo-primaryThree bg-robo-primaryTwo w-full h-[66px] sm:text-xl xs:text-xl xxs:text-lg 3xs:text-base font-futura"
                    onClick    = {() => handleClick()}
                    type       = "button"
                >
                     UNSUBSCRIBE
            </button>
            </div>
        </div>
    )
}

export default Unsubscribe
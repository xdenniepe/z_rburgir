import { useNavigate } from 'react-router-dom'
import { Button } from '../../Common'
import { BurgerIcon, NoReceiptIcon } from '../../../utilities/icons'

const EmptyCart = ({ emptyPage }) => {
    const navigate = useNavigate()

    return (
        <div className={`h-screen px-10 overflow-y-auto bg-white`}> 

            {
                emptyPage === "receipt" ?
                    <>
                        <div className={`right-0 w-full absolute top-[60px] px-6.5 border-b border-[#707070] border-opacity-50`}> </div>   
                        <h1 className = "w-full text-center text-3xl font-futura-bold tracking-[2.42px] relative mt-28 sm:mt-[230px] xs:mt-[150px] xxs:mt-[150px] 3xs:mt-[150px] mt-[230px]" aria-label = "Oops!" tabIndex = {0}> 
                            Oops!
                        </h1>

                        <div className="flex flex-col items-center justify-center sm:mt-[80px] xs:mt-[80px] xxs:mt-[70px] 3xs:mt-[60px] mt-[80px]" aria-label = "Receipt Image" tabIndex = {0} >
                            <NoReceiptIcon  className="h-[80px] w-[132.47px] " />
                        </div>
                        
                        <p className="relative font-futura-medium text-lg tracking-wide text-center sm:mt-[45px] xs:mt-[45px] xxs:mt-[45px] 3xs:mt-[45px] mt-[45px]" aria-label = "no receipts yet" tabIndex = {0}> 
                            No Receipts Yet
                        </p>
                    </>
                :

                    <>
                        <div className={`right-0 w-full absolute top-[60px] px-6.5 border-b border-[#707070] border-opacity-50`}> </div>  
                         <h1 className = "w-full text-center text-[22px] font-futura-medium tracking-widest relative mt-28 sm:mt-[230px] xs:mt-[150px] xxs:mt-[150px] 3xs:mt-[150px] mt-[230px] " aria-label = "your shopping bag is empty" tabIndex = {0}> 
                            Your shopping bag is empty 
                        </h1>

                        <div className="flex flex-col items-center justify-center  sm:mt-[60px] xs:mt-[35px] xxs:mt-[35px] 3xs:mt-[35px] mt-[60.95px]" aria-label = "Robo Burger Image" tabIndex = {0} >
                            <BurgerIcon className="h-[132.47px] w-[132.47px] "/>
                        </div>
                        
                        <p className="relative font-futura-medium text-lg tracking-[1.28px] text-center sm:mt-[60px] xs:mt-[35px] xxs:mt-[35px] 3xs:mt-[35px] mt-[60.95px]" aria-label = "find a roboburger near you" tabIndex = {0}> 
                            Find a RoboBurger near you  
                        </p>

                        <Button 
                            classes = "button-checkout bg-robo-primaryTwo text-white tracking-wide text-base sm:mt-[47.5px] xs:mt-[37.5px] xxs:mt-[37.5px] 3xs:mt-[37.5px] mt-[47.5px] "
                            label   = "shop now"    
                            type    = "button"
                            onClick = {() => navigate('/products')}
                        />
                    </>
            }
        </div>
    )
}

export default EmptyCart

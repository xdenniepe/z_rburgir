import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocationCtx, useOrderCtx } from '../../../../../hooks'
import { Dialog, Transition } from '@headlessui/react'
import { RoboBot, CloseSquare } from '../../../../../utilities/icons'
import { Button } from '../../../../../components/Common'

const CheckLocationModal = ({ isModalOpen, setIsModalOpen, vendingMachine }) => {
    const { selectVendingMachine } = useLocationCtx()
    const { apis, orderId, state } = useOrderCtx()
    const { clearUserCart } = apis
    const { invoices } = state

    const navigate = useNavigate()

    const handleLocationSwitch = () => {
        if (orderId) {
            clearUserCart(orderId)
        }
        
        selectVendingMachine(vendingMachine)
    }

    const handleUsePrevLocation = () => {
        const vm = {}

        vm.vendingMachineId = invoices[0]?.vendingMachineId
        vm.location         = invoices[0]?.vmLocation
        vm.address          = invoices[0]?.vmAddress
        vm.city             = invoices[0]?.vmCity

        selectVendingMachine(vm)     
    }

    return (
        <Transition
            show = {isModalOpen} 
        >
            <Dialog 
                className  = "relative z-50 inset-0"
                onClose    = {() => setIsModalOpen(false)}
                tabIndex   = {0}
                role       = "div"
                aria-label = "Switch Location Modal"
            >
                <div className="fixed inset-0 bg-black/25 " aria-hidden="true" />

                <div id="location-modal" className="fixed inset-0 flex items-center justify-center px-4">
                    <Transition.Child
                        as        = "div"   
                        className = "relative h-fit w-full md:w-2/3 rounded rounded-xl bg-white px-[44px] py-[66px] xs:py-[55px] xxs:py-[44px] overflow-y-auto"
                        enter     = "ease-in duration-300"
                        enterFrom = "ease-in scale-0"
                        enterTo   = "ease-in scale-100"
                        leave     = "ease-out duration-150"
                        leaveFrom = "ease-out scale-100"
                        leaveTo   = "ease-out scale-0"
                    >
                        <div className="flex flex-col justify-center items-center">
                            <button className="absolute top-2 right-2" onClick={() => setIsModalOpen(false)}>
                                <CloseSquare className="h-5 w-5"/>
                            </button>
                            <RoboBot className="h-32 w-32" aria-label="Robot Head Icon" role="text" tabIndex={0} />
                            
                            <p className="font-futura-bold text-robo-currency text-[14px] tracking-wide"> 
                                WARNING! 
                            </p>

                            <p className="font-futura-medium text-robo-currency text-xs tracking-wide text-center py-5 sm:px-4">
                                You have already selected items from <b>{invoices[0]?.vmLocation}, {invoices[0]?.vmAddress}, {invoices[0]?.vmCity}</b>. If you continue, your previous selections will be removed.
                            </p>

                            <div className="flex flex-col gap-[22px] xs:gap-[18px] xxs:gap-4 w-full">
                                <Link
                                    to      = "/products"
                                    className = "flex justify-center items-center button-default text-white bg-robo-primaryTwo tracking-wide text-sm xs:text-xs sm:text-sm xxs:text-xs"   
                                    type    = "button"
                                    onClick = {() => handleLocationSwitch()}
                                >
                                    SWITCH LOCATION
                                </Link>

                                <Link
                                    to      = "/products"
                                    className = "flex justify-center items-center button-default text-robo-currency bg-robo-primaryOne tracking-wide text-sm xs:text-xs sm:text-sm xxs:text-xs"    
                                    type    = "button"
                                    onClick = {() => handleUsePrevLocation()}
                                >
                                KEEP CURRENT LOCATION
                                </Link>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default CheckLocationModal

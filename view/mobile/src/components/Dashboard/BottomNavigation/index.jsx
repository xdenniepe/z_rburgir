import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocationCtx } from '../../../hooks'
import { className, isEmptyObject, setLocalStorageItem } from '../../../utilities/helpers'
import { Home, Qrcode, Bag, Settings, RobologoRed } from '../../../utilities/icons'

const BottomNavigation = ({ hidden, sidebarOpen, setSidebarOpen }) => {
	const navigate     = useNavigate()
	const { pathname } = useLocation()

	const { selectedVendingMachine } = useLocationCtx().state

	const tabs = [
		{
			arialabel : 'Home Icon - Check the Menu',
			badgeCount: 0,
			icon	  : Home,
			name 	  : 'Home',
			path1	  : '/home',
			path2	  : '/dashboard',
		},
		{
			arialabel : 'Cart Icon - Check Items In Cart',
			icon	  : Bag,
			name	  : 'Cart',
			path1	  : '/order',
			path2	  : '/payment',
			path3	  : '/orderreview',
		}
	]

	const getActivePaths = () => {
		switch (pathname) {
			case '/settings'	 	  :
			case '/contact'	  	 	  :
			case '/termsandconditions':
            case '/privacypolicy'	  :
            case '/accessibility'	  :
				return 'text-red-800 group-hover:text-red-800'
			default:
				return 'text-black group-hover:text-black'
		}
	}

	const handleClick = () => {
		setSidebarOpen(true)
		setLocalStorageItem('openpath', pathname)
	}

	const legalities = ['/contact', '/purchasehistory', '/accessibility']

	return (
		<div className={`fixed h-[76.75px] md:h-[80px] w-full -bottom-[5px] shadow3 bg-white z-50`} hidden={hidden}>
			<nav className="flex justify-evenly align-items-center" aria-label="tabs">
				{
					tabs.map(tab => (
						<button
							key	      = {tab.name}
							className = {
								`${tab.name === 'Cart' && 'mr-[3px]'} relative w-1/5 flex flex-col items-center justify-center cursor-pointer 
								${className(
									(pathname === tab.path1) 
										?	'text-red-800'
										:	'text-robo-primaryTwo hover:text-red-800 hover:border-gray-50', 
											'group inline-flex items-center py-4 px-1',
								)}`
							}
							aria-current = {tab.current ? 'page' : undefined}
							role		 = {`button` + tab.name} 
							aria-label	 = {tab.arialabel}
							onClick	     = {() => {
								navigate(tab.path1)
							}}	
						>
							<tab.icon
								fill      = {(pathname === tab.path1 || pathname === tab.path2 || pathname === tab.path3) ? '#A10601' : '#8D8D8D'}
								className = {
									`flex align-content-center primary-icon z-10 h-[24px] w-[26px] -mt-1
									${className(
										(pathname === tab.path1) 
											?	'stroke-red-800 shadow1'
											:	'text-black group-hover:text-black stroke-[#8D8D8D]',	
										(tab.name === 'Cart') 
											?	'stroke-0'
											:	'',
									)}
								`}
								aria-hidden = "true"
							/>
							<div className={`text-sm md:text-lg mt-[6px]`}> {tab.name} </div>
						</button>
					))
				} 

				<button 
					aria-label = "Robo Burger Logo"
					className  = {`relative w-1/5 flex flex-col items-center justify-center cursor-pointer -mt-4 rounded-full max-w-[83px] bg-white h-22 ${className((pathname === '/locations' || pathname === '/products' ) ? 'text-red-800' : '' )}`}
					id         = "Order" 
					onClick	   = {() => navigate(isEmptyObject(selectedVendingMachine) ? '/locations' : '/products')}	
					tabIndex   = {0}
					type	   = "button" 
				>	
					<RobologoRed 
						aria-label = "Robo Logo"
						className  = {`flex align-content-center z-10 h-[60px] w-[60px] -mt-[15px] ml-1 ${className((pathname === '/locations' || pathname === '/products' ) ? 'shadow2' : 'grayIcon opacity-30' )}`} 
					/> 
					<div className="text-sm md:text-lg -mt-[3px]"> Order </div>
                </button>

				<button 
					className 	 = "w-1/5 flex flex-col items-center justify-center cursor-pointer -mt-1 ml-[5px]"
					id        	 = "show-sidebar" 
					type	  	 = "button" 
					role	  	 = "switch" 
					aria-label   = "Utilities Icon - Check Profile"
					tabIndex	 = {0}
					onClick      = {() => handleClick()}  
				>
					<p aria-live="polite" className="sr-only"> {sidebarOpen ? 'Open sidebar' : ''} </p>
					<Settings 
						aria-hidden = "false" 
						aria-label  = "Gear Icon - User Profile" 
						className   = {`flex align-content-center primary-icon h-[24px] w-[26px]  ${getActivePaths()}`} 
						fill        = {legalities.includes(pathname) ? '#A10601' : '#8D8D8D'}
						role        = "link" 
					/>
					<div className={`text-sm md:text-lg mt-[6px] ${legalities.includes(pathname) ? 'text-[#A10601]' : 'text-robo-primaryTwo'}`}> Settings </div>
                </button>

				<button 
					aria-label = "Scan QR Icon - Check your order's QR code"
					className  = {`w-1/5 flex flex-col items-center justify-center cursor-pointer -mt-1 text-robo-primaryTwo stroke-[#8D8D8D] ${className(pathname == '/scan') ? 'text-red-800'  : ''}`}
					id         = "QR" 
					onClick	   = {() => navigate('/scan')}	
					tabIndex   = {0}
					type	   = "button" 
				>	
					<Qrcode 
						aria-label = "QR Code" 
						className  = {`flex align-content-center primary-icon h-[24px] w-[26px] z-10  ${className(pathname === '/scan') ? 'stroke-red-800 shadow1'  : ''}`} 
						fill       = {(pathname === '/scan') ? '#A10601' : '#8D8D8D'} 
					/> 
					<div className={`text-sm md:text-lg mt-[6px] ${className(pathname === '/scan') ? 'text-red-800'  : ''}`}> Scan </div>
                </button>
			</nav>
		</div>
		
	)
}

export default BottomNavigation

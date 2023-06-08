import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft} from '../../../utilities/icons'

const BackButton = ({ pathname, to, setSidebarOpen, title }) => {
    const navigate = useNavigate()

    /**
     * to          = String (path)
     * classes     = String (className)
     * iconClasses = String (className)
     */

    const handleClick = useCallback((pathname, to) => {
        navigate(to ? to : -1)

        switch(pathname) {
            case '/accessibility'  :
            case '/contact'        :
            case '/purchasehistory':
            case '/settings'       :
                setSidebarOpen(true)
                break;
        }
    }, [])

    return ( 
        <div className="flex justify-center items-center flex-wrap">
            <button onClick={() => handleClick(pathname, to)} className="flex flex-col" aria-label="Back Arow Icon - Click to Go to Previous Page" tabIndex={0} role="button">
                <ChevronLeft className="items-start absolute top-4 left-[27px] opacity-80 h-7 w-7" />
            </button>

            {title && 
                <div className="flex justify-center items-center h-[65px] w-full">
                    <h1 
                        className  = "text-black text-[18px] tracking-wide uppercase" 
                        aria-label = {title + "header"} 
                        tabIndex   = {0}
                        role       = "text"
                    >
                        {title}
                    </h1>
                </div>
            }
        </div>
       
    )  

}

export default BackButton


 
import React, { useEffect } from 'react'
import { getLocalStorageItem } from '../../utilities/helpers'
import PickupHeader from '../../components/Header/PickupHeader'
import ProductMenu from './components/ProductMenu'

const Products = ({ renderSr, setHasLoaded, setSidebarOpen, toast }) => {
    useEffect(() => {
        if (getLocalStorageItem('firstload')) {
            setSidebarOpen(false)
            localStorage.removeItem('firstload')
        }
        
        setHasLoaded(true)
        setSidebarOpen(false)
    }, [])

    return (
        <div className="container-class relative bg-map-bg bg-cover bg-no-repeat pt-[23px] overflow-hidden">
            {renderSr()}
            <div className="absolute w-full h-full pt-4 pb-26">
                <PickupHeader />
                <ProductMenu toast={toast}/>
            </div>
        </div>
    )
}

export default Products

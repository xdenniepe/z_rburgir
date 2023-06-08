import { useEffect, useReducer } from 'react'
import { request } from '../services/request'
import { GET } from '../utilities/constants'
import { getLocalStorageItem, isEmptyArray, setLocalStorageItem } from '../utilities/helpers'
import ProductContext from '../contexts/productContext'
import ProductReducer, { initialState, initializer, GET_CONDIMENTS, GET_PRODUCTS,  } from '../reducers/productReducer'
import api from '../services/api'

const ProductProvider = ({ children }) => {
	const [state, dispatch]        = useReducer(ProductReducer, initialState, initializer)
	const { products, condiments } = state

	const getCondiments = () => {
		request({
			url   : api.CONDIMENTS,
			method: GET
		}).then(res => {
            const condiments = res.data

            const mustard = condiments[1]
            condiments[1] = condiments[0]
            condiments[0] = mustard

			dispatch({
				type: GET_CONDIMENTS,
				payload: condiments
			})
		}).catch(error => console.log(error))
	}

	const getProducts =  () => {
		request({
			url   : api.PRODUCTS,
			method: GET
		}).then(products => {
			dispatch({
				type   : GET_PRODUCTS,
				payload: products.data
			})
		}).catch(error => console.log(error))
	}
	
	useEffect(() => {
		setLocalStorageItem('products', products)
	}, [products])

	useEffect(() => {
		setLocalStorageItem('condiments', condiments)
	}, [condiments])

	const apis = {
		getCondiments,
		getProducts
	}

	const providerValues = {
		apis,
		state
	}

	return (
		<ProductContext.Provider value={providerValues}>
			{ children }
		</ProductContext.Provider>
	)
}

export default ProductProvider
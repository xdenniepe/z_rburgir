import axios  from 'axios'
import axiosInstance  from './axios'
import { DELETE, GET, PATCH, POST, PUT }  from '../utilities/constants'

export const source = axios.CancelToken.source()

export const request = config => {
    if (config.method === GET) {
        return axiosInstance.get(config.url, { params: config.params }, { cancelToken: config.cancelToken })
    } else if (config.method === POST) {
        return axiosInstance.post(config.url, config.data, { params: config.params })
    } else if (config.method === PATCH) {
        return axiosInstance.patch(config.url, config.data)
    } else if (config.method === PUT) {
        return axiosInstance.put(config.url, config.data, { headers: config.headers })
    } else if (config.method === DELETE) {
        return axiosInstance.delete(config.url)
    }
}

export const cancelRequest = () => source.cancel('Request Cancelled')

export const multipleRequest = requests => axios.all(requests)

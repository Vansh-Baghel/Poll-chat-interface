import axios from 'axios'
import { toast } from 'sonner'

// Create an instance of axios
const api = axios.create({ baseURL: process.env.VITE_API_URL })

// Add a request interceptor to include the token in the header
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    },
)

// Add a response interceptor to handle errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            window.location.href = '/login'
            window.localStorage.removeItem('token')
        }
        toast.error(error.response.data.error)
        return Promise.reject(error)
    },
)

export default api

import axios from 'axios'

const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL
  : '/api'

const request = axios.create({
  baseURL,
  timeout: 10000,
})

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request


import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  // headers: {
  //   Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRUeXBlIjozLCJ1c2VyaWQiOiI0NyIsInBsYXRmb3JtIjozLCJsb2dpbl91c2VyX2tleSI6IjQzYjliY2I5OTc5NTVjYWJjMjYxZGM2ZDM3MDA1YjhiIn0.d_DDvFMKDxs_dmDgBUhN6xfBNepngsNX4kbVEsfdlLw'
  // }
})

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request


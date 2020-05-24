import axios from 'axios'
import Swal from 'sweetalert2'

let baseURL = 'https://toavicoursework.herokuapp.com/api'


export const axiosInstance = axios.create({ baseURL, withCredentials: true })

axiosInstance.interceptors.request.use(
  config => {

    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  err => Promise.reject(err)
)

export const apiHelper = axiosInstance

export const Toast = Swal.mixin({
  toast: true,
  background: '#e6e6e6',
  scrollbarPadding: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 5000,
  showClass: {
    popup: 'animate__animated animate__fadeInDown'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp'
  }
})

import axios from "axios"

const apiTarget = import.meta.env.VITE_API_TARGET || "http://localhost:7071"

const axiosInstance = axios.create({
  baseURL: `${apiTarget}/api`,
})

export default axiosInstance
import axios from "axios"

const axiosInstance = axios.create({
    // TODO: change to prod backend url
    baseURL: "http://localhost:8000",
})

export default axiosInstance
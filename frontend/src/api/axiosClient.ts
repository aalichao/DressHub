import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export default axiosClient;
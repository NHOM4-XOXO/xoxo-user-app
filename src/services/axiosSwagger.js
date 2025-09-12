import axios from "axios";

const swaggerApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://xoxo.id.vn",
})

export default swaggerApi;
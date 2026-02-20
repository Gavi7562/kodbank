import axios from 'axios';

const api = axios.create({
    baseURL: 'https://kodbank-t3mi.vercel.app/api',
    withCredentials: true, // Important for cookies (JWT)
});

export default api;

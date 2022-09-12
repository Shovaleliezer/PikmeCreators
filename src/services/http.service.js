import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3030/api/'

var axios = Axios.create({
    withCredentials: true
})

export const httpService = {
    get(endpoint, data) {
        return request(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return request(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return request(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return request(endpoint, 'DELETE', data)
    }
}

async function request(endpoint, method = 'GET', data = null) {
    try {
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: (method === 'GET') ? data : null
        })
        return res.data
    } catch (err) {
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
        }
        throw err
    }
}
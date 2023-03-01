import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://pikmeserver.herokuapp.com/'
    : '//localhost:3030/'
    // '//localhost:3030/'

var axios = Axios.create({
    withCredentials: false
})

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    try {
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: (method === 'GET') ? data : null,
        })
        return res.data
    } catch (err) {
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
        }
        throw err
    }
}
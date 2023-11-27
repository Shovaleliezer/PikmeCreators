import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production' ?
    'https://pikme-server-7vdz.onrender.com/'
    : '//localhost:3030/'
// : 'https://pikme-server-7vdz.onrender.com/'

var axios = Axios.create({
    withCredentials: true
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
    },
    addEvent

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
        throw err
    }
}

async function addEvent(formData) {
    const res = await axios({
        url: process.env.NODE_ENV === 'production' ? 'https://pikme-heavy-server.onrender.com/handle-events/create-event'
        : '//localhost:3031/handle-events/create-event',
        // : 'https://pikme-heavy-server.onrender.com/handle-events/create-event',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': `multipart/form-data`,
        },
    })
    return res.data
}
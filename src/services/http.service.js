import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://pikme-server-7vdz.onrender.com/'
    : '//localhost:3030/'

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

export async function agoraAquire(options,channel) {
    try {
        const res = await axios({
            url: `https://api.agora.io/v1/apps/${options.appId}/cloud_recording/acquire`,
            method: 'POST',
            data: {
                cname: options.cname,
                uid:options.uid,
                channel: channel,
                clientRequest: {
                    resourceExpiredHour: 24,
                    region:'EU'
                }
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ZWU5YWY2MDlhMzQwNDIzNzk5MjE3MWZmNjIzMmVkODU6ZGZmZmY5ZmM3NjhiNDUwZWFlYzllMmNjNmI2MTYyNGI='
            }
        })
        console.log('response', res.data)
        return res.data
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

// key：ee9af609a3404237992171ff6232ed85
// secret：dffff9fc768b450eaec9e2cc6b61624b
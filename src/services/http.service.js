import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'production' ?
    'https://pikme-server-7vdz.onrender.com/'
    : '//localhost:3030/'

const HEAVY_URL = process.env.NODE_ENV === 'production' ?
    'https://pikme-server-7vdz.onrender.com/'
    : '//localhost:3031/'


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
    compressAndUpload
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

export async function compressAndUpload(formData) {
    const res = await axios({
        url: HEAVY_URL + 'handle-video/compress',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': `multipart/form-data`,
        },
    })
    return res.data
}



























export async function agoraAquire(options, channel) {
    try {
        const res = await axios({
            url: `https://api.agora.io/v1/apps/${options.appId}/cloud_recording/acquire`,
            method: 'POST',
            data: {
                cname: options.cname,
                uid: '134',
                channel: channel,
                clientRequest: {
                    resourceExpiredHour: 24,
                    region: 'EU'
                }
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ZWU5YWY2MDlhMzQwNDIzNzk5MjE3MWZmNjIzMmVkODU6ZGZmZmY5ZmM3NjhiNDUwZWFlYzllMmNjNmI2MTYyNGI='
            }
        })
        return res.data
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export async function agoraQuery(options, sid, resourceId) {
    const url = `https://api.agora.io/v1/apps/${options.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/query`
    try {
        const res = await axios({
            url,
            method: 'GET',
            headers: {
                'Authorization': 'Basic ZWU5YWY2MDlhMzQwNDIzNzk5MjE3MWZmNjIzMmVkODU6ZGZmZmY5ZmM3NjhiNDUwZWFlYzllMmNjNmI2MTYyNGI='
            }
        })
        return res.data
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

//!!!!!!!!!!!!   get the new amazon key and secret key from the server !!!!!!!!!!!!!!!!!!!!

export async function agoraStart(options, resourceId) {
    try {
        const res = await axios({
            url: `https://api.agora.io//v1/apps/${options.appId}/cloud_recording/resourceid/${resourceId}/mode/mix/start`,
            method: 'POST',
            data: {
                cname: options.cname,
                uid: '134',
                "clientRequest": {
                    token: '',
                    "recordingConfig": {
                        "maxIdleTime": 30,
                        "streamTypes": 2,
                        "audioProfile": 1,
                        "channelType": 1,
                        "videoStreamType": 0,
                        "transcodingConfig": {
                            "height": 640,
                            "width": 360,
                            "bitrate": 600,
                            "fps": 15,
                            "mixedVideoLayout": 1,
                            "backgroundColor": "#FF0000"
                        },
                        "subscribeVideoUids": [options.uid, '134'],
                        "subscribeAudioUids": [options.uid, '134'],
                    },
                    recordingFileConfig: {
                        avFileType: ["hls"],
                    },
                    storageConfig: {
                        "vendor": 1,
                        "region": 7,
                        "bucket": "agora-records132",
                        "accessKey": "",
                        "secretKey": "",
                    },
                }
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ZWU5YWY2MDlhMzQwNDIzNzk5MjE3MWZmNjIzMmVkODU6ZGZmZmY5ZmM3NjhiNDUwZWFlYzllMmNjNmI2MTYyNGI='
            }
        })
        return res.data
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export async function agoraStop(options, sid, resourceId) {
    console.log('2', resourceId)
    const url = `http://api.agora.io/v1/apps/${options.appId}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`
    try {
        const res = await axios({
            url,
            method: 'POST',
            data: {
                cname: options.cname,
                uid: '134',
                "clientRequest": {
                    "async_stop": true
                }
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ZWU5YWY2MDlhMzQwNDIzNzk5MjE3MWZmNjIzMmVkODU6ZGZmZmY5ZmM3NjhiNDUwZWFlYzllMmNjNmI2MTYyNGI='
            }
        })
        return res.data
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

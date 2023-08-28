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

export async function agoraAquire(options, channel) {
    try {
        const res = await axios({
            url: `https://api.agora.io/v1/apps/${options.appId}/cloud_recording/acquire`,
            method: 'POST',
            data: {
                cname: options.cname,
                uid: options.uid,
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


export async function agoraStart(options, resourceId) {
    try {
        const res = await axios({
            url: `https://api.agora.io//v1/apps/${options.appId}/cloud_recording/resourceid/${resourceId}/mode/mix/start`,
            method: 'POST',
            data: {
                cname: options.cname,
                uid: options.uid,
                "clientRequest": {
                    // "token": "007eJxTYNCO9Ew6I1UZ4X1pXfmVlJla21mveW2rqpt5TffYT6cjk20UGNJMUk0Mk00tzU1TUkwSLcwSjY3MUk2STYzMTIwMkhNNzuS/TmkIZGRYWC/EzMgAgSC+BIMZUGeqcbJJqlmyaaqxsUWysaGlcXKiAQMDAAi3JLo=",
                    token: '',
                    // recordingConfig: {
                    //     "maxIdleTime": 30,
                    //     "streamTypes": 2,
                    //     streamMode:'standard',
                    //     "channelType": 1,
                    //     "videoStreamType": 0,
                    //     "subscribeUidGroup": 0,
                    //     subscribeVideoUids: [options.uid],
                    //     subscribeAudioUids: [options.uid],
                    // },
                    "recordingConfig": {
                        "maxIdleTime": 30,
                        "streamTypes": 2,
                        "audioProfile": 1,
                        "channelType": 0,
                        "videoStreamType": 0,
                        "transcodingConfig": {
                            "height": 640,
                            "width": 360,
                            "bitrate": 500,
                            "fps": 15,
                            "mixedVideoLayout": 1,
                            "backgroundColor": "#FF0000"
                        },
                        
                        "subscribeUidGroup": 0
                    },

                    storageConfig: {
                        "vendor": 1,
                        "region": 7,
                        "bucket": "agora-records132",
                        "accessKey": "AKIAYOFXLUAL6G5IZNEY",
                        "secretKey": "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",
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
                uid: options.uid,
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

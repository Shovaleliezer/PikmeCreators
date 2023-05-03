import { httpService } from './http.service.js'

export const adminService = {
    authorize,
    getWaitingEvents,
}
async function authorize(phone) {
    const isAdmin = await httpService.get('handle-admin/authorize/' + phone)
    return isAdmin
}

async function getWaitingEvents() {
    const events = await httpService.get('handle-admin/get-waiting-events')
    return events
}
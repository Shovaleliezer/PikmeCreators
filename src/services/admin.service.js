import { httpService } from './http.service.js'

export const adminService = {
    authorize,
    getWaitingEvents,
    acceptEvent,
    rejectEvent,
    getCurrentEvents,
    announceWinner,
    cancelEvent
}

async function acceptEvent(eventId) {
    const confirm = await httpService.post('handle-admin/accept/' + eventId)
    return confirm
}

async function rejectEvent(eventId) {
    const confirm = await httpService.post('handle-admin/reject/' + eventId)
    return confirm
}

async function authorize(phone) {
    const isAdmin = await httpService.get('handle-admin/authorize/' + phone)
    return isAdmin
}

async function getWaitingEvents() {
    const events = await httpService.get('handle-admin/get-waiting-events')
    return events
}

async function getCurrentEvents(){
    const events = await httpService.get('handle-admin/get-current-events')
    return events
}

async function announceWinner(eventId){
    const winner = await httpService.post('handle-admin/announce-winner/' + eventId)
    return winner
}

async function cancelEvent(){
    const cancel = await httpService.post('handle-admin/cancel-event')
    return cancel
}
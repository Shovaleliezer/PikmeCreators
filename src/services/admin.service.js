import { httpService } from './http.service.js'

export const adminService = {
    authorize,
    getWaitingEvents,
    acceptEvent,
    rejectEvent,
    getCurrentEvents,
    announceWinner,
    announceWinnerFund,
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

async function announceWinner(eventId,teamWon){
    const payings = await httpService.post('handle-admin/announce-winner/' + eventId,{teamWon})
    return payings
}

async function announceWinnerFund(eventId,prize){
    const payings = await httpService.post('handle-admin/announce-winner/' + eventId,{prize})
    return payings
}

async function cancelEvent(){
    const cancel = await httpService.post('handle-admin/cancel-event')
    return cancel
}
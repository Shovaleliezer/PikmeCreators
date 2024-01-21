import { httpService } from './http.service.js'

export const adminService = {
    authorize,
    getWaitingEvents,
    acceptEvent,
    rejectEvent,
    acceptShow,
    rejectShow,
    confirmPayment,
    getCurrentEvents,
    getPaymentEvents,
    getBanned,
    getShows,
    getMyShows,
    unbanUser,
    announceWinner,
    announceWinnerFund,
    changeShare,
    getHistory,
    cancelEvent,
    getGlobalShow,
    banUser,
    cancelShow,
    getByPhone
}

async function acceptEvent(eventId) {
    const confirm = await httpService.post('handle-admin/accept/' + eventId)
    return confirm
}

async function rejectEvent(eventId) {
    const confirm = await httpService.post('handle-admin/reject/' + eventId)
    return confirm
}

async function acceptShow(showId) {
    const confirm = await httpService.post('handle-admin/accept-show/' + showId)
    return confirm
}

async function rejectShow(showId) {
    const confirm = await httpService.post('handle-admin/reject-show/' + showId)
    return confirm
}

async function cancelShow(showId) {
    const confirm = await httpService.post('handle-admin/cancel-show/' + showId)
    return confirm
}

async function authorize(id) {
    const isAdmin = await httpService.post('handle-admin/authorize/' + id)
    return isAdmin
}

async function getWaitingEvents() {
    const events = await httpService.get('handle-admin/get-waiting-events')
    return events
}

async function getMyShows() {
    const shows = await httpService.get('handle-admin/get-my-shows')
    return shows
}

async function getHistory(from = 0) {
    const events = await httpService.get('handle-admin/get-history/' + from)
    return events
}

async function confirmPayment(id) {
    const confirm = await httpService.get('handle-admin/confirm-payment/' + id)
    return confirm
}

async function getGlobalShow(showId) {
    const event = await httpService.get(`handle-admin/get-show-stream/${showId}`)
    return event
}

async function getPaymentEvents() {
    const events = await httpService.get('handle-admin/get-payment-events')
    return events
}

async function getCurrentEvents() {
    const events = await httpService.get('handle-admin/get-current-events')
    return events
}

async function getBanned() {
    const banned = await httpService.get('handle-admin/get-banlist')
    return banned
}

async function getByPhone(phone) {
    const user = await httpService.get('handle-admin/get-by-phone/' + phone)
    return user
}

async function announceWinner(eventId, teamWon) {
    const payings = await httpService.post('handle-admin/announce-winner/' + eventId, { teamWon })
    return payings
}

async function banUser(phone) {
    const banned = await httpService.post('handle-admin/ban-user/' + phone)
    return banned
}

async function unbanUser(phone) {
    const unbanned = await httpService.post('handle-admin/unban-user/' + phone)
    return unbanned
}

async function getShows(from = 0) {
    const shows = await httpService.get('handle-admin/get-shows/' + from)
    return shows
}

async function announceWinnerFund(eventId, shareWithCommunity) {
    const payings = await httpService.post('handle-admin/announce-winner-fund/' + eventId, { shareWithCommunity })
    return payings
}

async function changeShare(eventId) {
    const confirm = await httpService.post('handle-admin/change-share/' + eventId)
    return confirm
}

async function cancelEvent(id) {
    const cancel = await httpService.post('handle-admin/cancel-event/' + id)
    return cancel
}
import { httpService } from './http.service.js'

export const eventService = {
    addEvent,
    deleteEvent,
    endEvent,
    editEvent,
    startEvent,
    getById,
    getAnalytics,
    confirm,
    getGlobalEvent,
    payCreator,
    setDistribution
}


async function addEvent(details) {
    const event = await httpService.post('handle-event/create-event', details)
    if (event) return event
}

async function deleteEvent(id) {
    const confirm = await httpService.post('handle-event/delete-unapproved-event/' + id)
    return confirm
}

async function endEvent(id, shareWithCommunity) {
    const end = await httpService.post('handle-event/end-event/' + id, { shareWithCommunity })
    return end
}

async function payCreator(eventId, details) {
    const confirm = await httpService.put('handle-event/pay-creator/' + eventId, { details })
    return confirm
}

async function startEvent(id) {
    const confirm = await httpService.post('handle-event/start-event/' + id)
    return confirm
}

async function editEvent(id, event) {
    const newEv = await httpService.post('handle-event/edit-event/' + id, event)
    return newEv
}

async function getById(eventId) {
    const event = await httpService.get('handle-event/get-event-creator/' + eventId)
    return event
}

async function getAnalytics(eventId) {
    const analytics = await httpService.get('handle-event/get-event-analytics/' + eventId)
    return analytics
}

async function setDistribution(eventId, shareWithCommunity) {
    const event = await httpService.put('handle-event/set-fund-distribution/' + eventId, { shareWithCommunity })
    return event
}

async function getGlobalEvent(eventId) {
    const event = await httpService.get(`handle-event/get-event-stream/${eventId}`)
    return event
}

async function confirm(creatorId, id) {
    const event = await httpService.put('handle-event/accept-event/' + id, { creatorId })
    if (event) return event
}


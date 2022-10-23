import { httpService } from './http.service.js'

export const eventService = {
    query,
    getById,
    addEvent,
    sellTickets
}
window.cs = eventService

async function query(filter) {
    const events = await httpService.get(`handle-event/get-events`, filter)
    return events
}

async function getById(eventId) {
    const event = await httpService.get(`handle-event/get-event/${eventId}`)
    return event
}

async function addEvent(event) {
    const uploadedEvent = await httpService.post('handle-event/create-event', event)
    return uploadedEvent
}

async function sellTickets(eventId, details) {
    const event = await httpService.post('handle-event/sell-ticket/' + eventId, details)
    return event
}
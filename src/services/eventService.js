import { httpService } from './http.service.js'

export const eventService = {
    query,
    getById,
}
window.cs = eventService

async function query(filter) {
    let events = await httpService.get('https/fgsfgdfggf', filter)
    return events
}

async function getById(eventId) {
    const stay = await httpService.get(`/${eventId}`)
    return stay
}
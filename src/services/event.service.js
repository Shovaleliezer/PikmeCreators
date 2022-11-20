import { httpService } from './http.service.js'

export const eventService = {
    addEvent,
    getById
}

async function addEvent(details, address) {
    const event = await httpService.post('handle-event/create-event', details)
    const newCreator = await httpService.post('handle-creator/update-creator-events/' + address, {event})
    if(event && newCreator) return event
}

async function getById(eventId) {
    const event = await httpService.get('handle-event/get-event/' + eventId)
    return event
}
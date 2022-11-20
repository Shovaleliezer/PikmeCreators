import { httpService } from './http.service.js'

export const eventService = {
    addEvent
}

async function addEvent(details, address) {
    const event = await httpService.post('handle-event/create-event', details)
    const newCreator = await httpService.post('handle-creator/update-creator-events/' + address, {event})
    return newCreator
}
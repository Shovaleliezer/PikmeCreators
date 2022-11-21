import { httpService } from './http.service.js'

export const eventService = {
    addEvent,
    getById,
    confirm
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

async function confirm(creator,id) {
    const event = await httpService.put('handle-event/accept-event/' + id, {team2:creator})
    const newCreator = await httpService.post('handle-creator/update-creator-events/' + creator.walletAddress, {event})
    if(event && newCreator) return event
}
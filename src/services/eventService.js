import { httpService } from './http.service.js'

export const eventService = {
    query,
    getById,
    addEvent
}
window.cs = eventService

async function query(filter) {
    if (typeof filter === 'string'){
        const events = await httpService.get('handle-event/get-events')
        //to do: actuallt filter
        return events
    }
    else{
        const events = await httpService.get(`handle-event/get-events`,filter)
        return events
    }
}

async function getById(eventId) {
    const stay = await httpService.get(`/${eventId}`)
    return stay
}

async function addEvent(event) {
    const uploadedEvent = await httpService.post('handle-event/create-event',event)
    return uploadedEvent
}
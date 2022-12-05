import { httpService } from './http.service.js'

export const eventService = {
    addEvent,
    deleteEvent,
    getById,
    confirm
}

async function addEvent(details, address) {
    const event = await httpService.post('handle-event/create-event', details)
  
    if(event) return event
}

async function deleteEvent(id) {
    const confirm = await httpService.post('handle-event/delete-unapproved-event/'+id)
    return confirm
}

async function getById(eventId) {
    const event = await httpService.get('handle-event/get-event/' + eventId)
    return event
}

async function confirm(creator,id) {
    const event = await httpService.put('handle-event/accept-event/' + id, {playerToAdd:creator})
    
    if(event) return event
}
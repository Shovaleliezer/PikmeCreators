import { httpService } from './http.service.js'

export const eventService = {
    addEvent,
    deleteEvent,
    endEvent,
    editEvent,
    endEvent,
    getById,
    confirm
}

async function addEvent(details) {
    const event = await httpService.post('handle-event/create-event', details)
  
    if(event) return event
}

async function deleteEvent(id) {
    const confirm = await httpService.post('handle-event/delete-unapproved-event/'+id)
    return confirm
}

async function endEvent(id) {
    const end = await httpService.post('handle-event/end-event/'+id)
    return end
}

async function editEvent(id,event) {
    const newEv = await httpService.post('handle-event/edit-event/' +  id, event)
    return newEv
}

async function getById(eventId) {
    const event = await httpService.get('handle-event/get-event-creator/' + eventId)
    return event
}

async function confirm(creator,id) {
    const event = await httpService.put('handle-event/accept-event/' + id, {playerToAdd:creator})
    
    if(event) return event
}


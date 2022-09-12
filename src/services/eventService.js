import { httpService } from './http.service.js'

const STAY_KEY = 'stay'

export const stayService = {
    query,
    getById,
    addStay,
}
window.cs = stayService

async function query(filterBy) {
    let stays = await httpService.get(STAY_KEY, filterBy)
    return stays
}

async function getById(stayId) {
    const stay = await httpService.get(STAY_KEY + `/${stayId}`)
    return stay
}

async function addStay(stay) {
    const addedStay = await httpService.post(STAY_KEY, stay)
    return addedStay
}

import { httpService } from './http.service.js'

export const userService = {
    handleAccount,
    updateAccount,
    getUserEvents,
    getUserStats,
    checkIsCreator,
    addCreator,
    editCreator,
    getStreamTokenClient,
    deleteCreatorEvent
}
window.cs = userService


async function handleAccount(address) {
    const uploadedEvent = await httpService.post('handle-account/wallet-connect/' + address, { address })
    return uploadedEvent
}

async function updateAccount(address, update) {
    const updatedUser = await httpService.post('handle-account/update-address-info/' + address, update)
    return updatedUser
}

async function getUserEvents(address) {
    const events = await httpService.get('handle-account/get-tickets/' + address)
    return events
}

async function getUserStats(address) {
    const stats = await httpService.get('handle-account/get-stats/' + address)
    return stats
}

async function checkIsCreator(address) {
    const isCreator = await httpService.get('handle-creator/is-creator/' + address)
    return isCreator
}

async function addCreator(address, creator) {
    const newCreator = await httpService.post('handle-creator/add-creator/' + address, creator)
    return newCreator
}

async function deleteCreatorEvent(eventId, creatorAddress) {
    const confirm = await httpService.post('handle-creator/remove-creator-events/' + creatorAddress, { eventId })
    return confirm
}

async function editCreator(address, creator) {
    const newCreator = await httpService.post('handle-creator/update-info/' + address, creator)
    return newCreator
}
async function getStreamTokenClient({ uid, role, channel }) {
    const token = await httpService.get(`rtc/${channel}/${role}/uid/${uid}`)
    return token
}   
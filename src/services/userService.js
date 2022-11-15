import { httpService } from './http.service.js'

export const userService = {
    handleAccount,
    updateAccount,
    getUserEvents,
    getUserStats,
    checkIsCreator,
    addCreator
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
    console.log(address, creator)
    const isCreator = await httpService.post('handle-creator/add-creator/' + address,creator)
    return isCreator
}
import { httpService } from './http.service.js'

export const userService = {
    handleAccount,
    updateAccount
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
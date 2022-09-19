import { httpService } from './http.service.js'

export const userService = {
    handleAccount
}
window.cs = userService


async function handleAccount(address) {
    const uploadedEvent = await httpService.post('handle-account/wallet-connect/'+ address,{address})
    return uploadedEvent
}
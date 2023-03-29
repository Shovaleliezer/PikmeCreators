import { httpService } from './http.service.js'

export const userService = {
    handleAccount,
    updateAccount,
    getUserEvents,
    getUserStats,
    checkIsCreator,
    addCreator,
    editCreator,
    isAddressValid,
    getStreamTokenClient,
    deleteCreatorEvent,
    validateOTP,
    sendOTP,
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

async function editCreator(phone, creator) {
    const newCreator = await httpService.post('handle-creator/update-info/' + phone, creator)
    return newCreator
}

async function getStreamTokenClient({ uid, role, channel }) {
    const token = await httpService.get(`rtc/${channel}/${role}/uid/${uid}`)
    return token
}

async function isAddressValid(address) {
    try {
        const valid = await httpService.get('handle-creator/check-wallet-address/' + address)
        return valid.exist
    }
    catch {
        return true
    }
}

async function sendOTP(phone) {
    try {
        const confirm = await httpService.post('handle-creator/send-otp', { phone })
        return confirm
    } catch (err) {
        return err
    }
}

async function validateOTP(phone, otp) {
    try {
        const creator = await httpService.post('handle-creator/get-creator/' + phone, { otp })
        return creator
    }
    catch (err) {
        return err
    }
}
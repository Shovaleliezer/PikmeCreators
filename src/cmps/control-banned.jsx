import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { adminService } from "../services/admin.service"
import { Error } from "../pages/error"
import { formatDateHour } from "../services/utils"
import { setUpperPopup } from "../store/actions/general.actions"

export function ControlBanned() {
    const dispatch = useDispatch()
    const [banned, setbanned] = useState(null)
    const [error, setError] = useState(false)
    const [creator, setCreator] = useState(null)
    const phoneRef = useRef(null)

    useEffect(() => {
        loadbanned()
    }, [])

    const loadbanned = async () => {
        try {
            const loadedBanned = await adminService.getBanned()
            setbanned(loadedBanned)
        }
        catch {
            setError(true)
        }
    }

    const removeBan = async (phone, clear = false) => {
        try {
            const name = await adminService.unbanUser(phone)
            const bn = banned.filter(b => b.phone !== phone)
            setbanned(bn)
            dispatch(setUpperPopup('banRemoved-' + name))
            if (clear) {
                setCreator(null)
                phoneRef.current.value = ''
            }
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    const banUser = async (phone) => {
        try {
            const name = await adminService.banUser(phone)
            dispatch(setUpperPopup('banned-' + name))
            setCreator(null)
            phoneRef.current.value = ''
            const bn = [...banned, creator]
            setbanned(bn)
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    const searchCreator = async (e) => {
        try {
            e.preventDefault()
            const creator = await adminService.getByPhone(phoneRef.current.value)
            setCreator(creator)
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    if (error) return <Error />

    if (!banned) return <div className="loader"><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div></div>

    try {
        return (<>
            <div className="control-current control-history">
                <p className="list-count">banned players : <span>{banned.length}</span></p>
                <form className="creator-search" onSubmit={searchCreator}>
                    <input type="text" ref={phoneRef} placeholder="Enter phone number" />
                    <button className="search"><span className="material-symbols-outlined">search</span></button>
                </form>
                {(!creator && phoneRef?.current?.value) && <p className="not-found" style={{ marginLeft: '10px' }}>No player found</p>}

                {creator && <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Phone</td>
                            <td>Address</td>
                            <td>Joined since</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody style={{ zIndex: '1001' }}>
                        <tr>
                            <td>{creator.nickName}</td>
                            <td>{creator.phone}</td>
                            <td>{creator.walletAddress}</td>
                            <td>{formatDateHour(creator.createdAt)}</td>
                            <td>
                                {creator.banned && <div className="remove-ban" onClick={() => removeBan(creator.phone, true)}>Remove ban</div>}
                                {!creator.banned && <div className="remove-ban" onClick={() => banUser(creator.phone)}>Ban</div>}
                            </td>
                        </tr>
                    </tbody>
                </table>}
                {banned.length > 0 && <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Phone</td>
                            <td>Address</td>
                            <td>Joined since</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody style={{ zIndex: '1001' }}>
                        {banned.map((creator, idx) => <tr key={idx}>
                            <td>{creator.nickName}</td>
                            <td>{creator.phone}</td>
                            <td>{creator.walletAddress}</td>
                            <td>{formatDateHour(creator.createdAt)}</td>
                            <td><div className="remove-ban" onClick={() => removeBan(creator.phone)}>Remove ban</div></td>
                        </tr>)}
                    </tbody>
                </table>}
            </div>
        </>)
    }
    catch (err){
        console.log(err)
        return <Error />
    }
}
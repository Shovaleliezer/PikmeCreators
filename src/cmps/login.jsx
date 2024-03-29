import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { userService } from "../services/user.service"
import { setUpperPopup } from "../store/actions/general.actions"
import { Error } from "../pages/error"
import { countryList } from "../services/data.service"

export function Login(props) {
    const dispatch = useDispatch()
    const [phone, setPhone] = useState(null)
    const [code, setCode] = useState({
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: ''
    })
    const countryRef = useRef()
    const phoneRef = useRef()

    useEffect(() => {
        if (Object.values(code).every(val => val !== '')) submitCode(false)
    }, [code])

    const handlePhone = async (ev) => {
        if (ev) ev.preventDefault()
        const formatted = countryRef.current.value + (phoneRef.current.value[0] == 0 ? phoneRef.current.value.slice(1) : phoneRef.current.value)
        try {
            const confirm = await userService.sendOTP(Number(formatted))
            if (confirm.name === 'AxiosError') dispatch(setUpperPopup('errorServer'))
            else if (confirm.response) setPhone(formatted)
            else dispatch(setUpperPopup('invalidPhone'))
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    const submitCode = async (ev) => {
        if (ev) ev.preventDefault()
        const formatted = code[0] + code[1] + code[2] + code[3] + code[4] + code[5]
        props.handleCreatorPhone(phone, formatted)
    }

    const handleCode = (ev) => {
        const { value, name } = ev.target

        if (value && value.length === 6) {
            setCode({ 0: value[0], 1: value[1], 2: value[2], 3: value[3], 4: value[4], 5: value[5] })
            document.getElementById(5).focus()
            return
        }

        for (let i = 0; i < Number(name); i++) if (code[i] === '') {
            document.getElementById(i).focus()
            return
        }

        if ((Number(value) >= 0 && Number(value) <= 9)) {
            if (value !== '' && name !== '5') document.getElementById(Number(name) + 1).focus()
            setCode({ ...code, [name]: value })
        }
    }

    const onDelete = (ev) => {
        const { key, target } = ev
        if (key === 'Backspace' && target.value === '' && target.name !== '0') document.getElementById(Number(target.name) - 1).focus()
    }

    const slots = [0, 1, 2, 3, 4, 5]

    try {
        return (
            <section className="login">
                <h1>Login</h1>
                {!phone && <form onSubmit={handlePhone}>
                    <p>Phone number</p>
                    <div className="phone-wrapper">
                        <select ref={countryRef} >
                            {countryList.map(country => <option key={country.country} value={country.code}>{country.iso} +{country.code}</option>)}
                        </select>
                        <input type='number' ref={phoneRef} placeholder='enter number' required />
                    </div>
                    <h5>A 6 digit OTP will be sent via SMS to verify your mobile number.</h5>
                    <button>Continue</button>
                </form>}
                {phone && <>
                    <h5 style={{ marginBottom: '8px' }}>Enter the code you received to</h5>
                    <p style={{ opacity: '1' }}>{phone}</p>
                    <form className="code" onSubmit={submitCode}>
                        {slots.map(num => <input key={num} autoFocus={num === 0 ? true : false} id={num} type="number" name={num} className="digit" value={code[num]} onChange={handleCode} onKeyDown={onDelete} />)}
                    </form>
                    <h4 onClick={() => { setPhone(null); setCode({ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' }) }}><span className="material-symbols-outlined">chevron_left</span>Back</h4>
                    <button onClick={submitCode}>Continue</button>
                </>}
            </section>
        )
    }
    catch {
        return <Error />
    }
}
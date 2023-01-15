import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { userService } from "../services/userService"
import { setUpperPopup } from "../store/actions/general.actions"
import { Error } from "../pages/error"
import { countryList } from "../services/phone.service"

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

    if (window.OTPCredential) { 
        console.log('feature!')
        window.addEventListener('DOMContentLoaded', e => {
          const ac = new AbortController()
          navigator.credentials.get({
            otp: { transport:['sms'] },
            signal: ac.signal
          }).then(otp => {
            alert(otp.code)
          }).catch(err => {
            console.log(err)
          });
        })
      } else {
        alert('WebOTP not supported!.')
      }

    useEffect(() => {
        if (Object.values(code).every(val => val !== '')) submitCode(false)
    }, [code])

    const handlePhone = async (ev) => {
        if(ev) ev.preventDefault()
        const formatted = countryRef.current.value + (phoneRef.current.value[0] == 0 ? phoneRef.current.value.slice(1) : phoneRef.current.value)
        try {
            const confirm = await userService.sendOTP(Number(formatted))
            if (confirm.response) setPhone(formatted)
            else dispatch(setUpperPopup('invalidPhone'))
        }
        catch {
            dispatch(setUpperPopup('errorServer'))
        }
    }

    const submitCode = async (ev) => {
        if(ev) ev.preventDefault()
        const formatted = code[0] + code[1] + code[2] + code[3] + code[4] + code[5]
        props.handleCreatorPhone(phone, formatted)
    }

    const handleCode = (ev) => {
        const { value, name } = ev.target
        if (value === '' && name !== '0') document.getElementById(Number(name) - 1).focus()
        if ((Number(value) >= 0 && Number(value) <= 9)) {
            if (value !== '' && name !== '5') document.getElementById(Number(name) + 1).focus()
            setCode({ ...code, [name]: value })
        }
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
                        {slots.map(num => <input key={num} autoFocus={num === 0 ? true : false} id={num} type="number" name={num} className="digit" value={code[num]} onChange={handleCode} />)}
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
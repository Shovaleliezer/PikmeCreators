import { useState, useRef } from "react"
import { Error } from "./error"
import { countryList } from "../services/phone.service"

export function Login() {
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

    const handlePhone = (ev) => {
        ev.preventDefault()
        const countryCode = countryRef.current.value
        const phone = phoneRef.current.value
        setPhone('+' + countryCode + '-' + phone)
    }

    const handleCode = (ev) => {
        const { value, name } = ev.target
        if (value === '' && name !== '0') document.getElementById(Number(name) - 1).focus()
        if ((Number(value) >= 0 && Number(value) <= 9)) {
            if (value !== '' && name !== '5') document.getElementById(Number(name) + 1).focus()
            setCode({ ...code, [name]: value })
        }
    }

    const submitCode = (ev) => {
        ev.preventDefault()
        console.log(code[0] + code[1] + code[2] + code[3] + code[4] + code[5])
    }

    const arr = [0, 1, 2, 3, 4, 5]

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
                    <h5 style={{marginBottom:'8px'}}>Enter the code you received to</h5>
                    <p style={{opacity:'1'}}>{phone}</p>
                    <form className="code" onSubmit={submitCode}>
                        {arr.map(num => <input key={num} id={num} type="number" name={num} className="digit" value={code[num]} onChange={handleCode} />)}
                    </form>
                    <h4 onClick={() => {setPhone(null);setCode({0:'',1:'',2:'',3:'',4:'',5:''})}}><span className="material-symbols-outlined">chevron_left</span>Back</h4>
                    <button onClick={submitCode}>Continue</button>
                </>}
            </section>
        )
    }
    catch {
        return <Error />
    }
}
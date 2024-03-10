import { useState, useEffect } from "react"
import { Stream } from './stream'
import { AgoraStream } from "./stream2"

export function StreamWrapper() {
    const [isNarrow, setIsNarrow] = useState(window.innerWidth < 550)

    useEffect(() => {
        window.addEventListener('resize', onRotate)
        document.documentElement.style.setProperty('--visibility', 'hidden')
        if (window.innerWidth < 1100) {
            const main = document.querySelector('.main-layout')
            if (main) main.classList.add("main-stream")
            const header = document.querySelector('.header')
            if (header) header.classList.add("non-appear")
        }
        return () => {
            window.removeEventListener("resize", onRotate)
            document.documentElement.style.setProperty('--visibility', 'visible')
            document.documentElement.style.setProperty('--volume', '100%')
            const main = document.querySelector('.main-layout')
            if (main) main.classList.remove("main-stream")
            const header = document.querySelector('.header')
            if (header) header.classList.remove("non-appear")
        }
    }, [])

    const onRotate = () => {
        if (window.innerWidth > 550 && isNarrow === true) setIsNarrow(false)
    }

    if (isNarrow) return (<div className="center-fixed rotate-phone">
        <svg width="100" height="100" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 0H2.5C1.83703 0 1.20114 0.263394 0.732114 0.732114C0.263366 1.20109 0 1.83703 0 2.5V27.5C0 28.163 0.263394 28.7989 0.732114 29.2679C1.20109 29.7366 1.83703 30 2.5 30H13.5C14.163 30 14.7989 29.7366 15.2679 29.2679C15.7366 28.7989 16 28.163 16 27.5V2.5C16 1.83703 15.7366 1.20114 15.2679 0.732114C14.7989 0.263366 14.163 0 13.5 0ZM15 27.5C15 27.8978 14.842 28.2795 14.5607 28.5607C14.2795 28.8419 13.8977 29 13.5 29H2.50003C2.10226 29 1.72054 28.8419 1.43934 28.5607C1.15814 28.2794 1.00006 27.8977 1.00006 27.5V2.5C1.00006 2.10223 1.15809 1.72051 1.43934 1.43931C1.72059 1.15811 2.10231 1.00003 2.50003 1.00003H4.00003V1.50003C4.00003 1.63262 4.05271 1.75985 4.14646 1.8536C4.24021 1.94735 4.36744 2.00003 4.50003 2.00003H11.5C11.6326 2.00003 11.7599 1.94735 11.8536 1.8536C11.9473 1.75985 12 1.63262 12 1.50003V1.00003H13.5C13.8978 1.00003 14.2795 1.15806 14.5607 1.43931C14.8419 1.72057 15 2.10229 15 2.5V27.5Z" fill="white" />
            <path d="M27.5 14.0001H18C17.7239 14.0001 17.5 14.2239 17.5 14.5001C17.5 14.7762 17.7239 15.0001 18 15.0001H27.5C27.8978 15.0001 28.2795 15.1581 28.5607 15.4393C28.8419 15.7206 29 16.1023 29 16.5V18H28.5C28.2239 18 28 18.2239 28 18.5V25.5C28 25.6326 28.0527 25.7599 28.1464 25.8536C28.2402 25.9473 28.3674 26 28.5 26H29V27.5C29 27.8978 28.8419 28.2795 28.5607 28.5607C28.2794 28.8419 27.8977 29 27.5 29H17C16.7239 29 16.5 29.2239 16.5 29.5C16.5 29.7761 16.7239 30 17 30H27.5C28.163 30 28.7989 29.7366 29.2679 29.2679C29.7366 28.7989 30 28.163 30 27.5V16.5C30 15.837 29.7366 15.2011 29.2679 14.7321C28.7989 14.2634 28.163 14 27.5 14V14.0001Z" fill="white" />
            <path d="M19.1002 5.79994C19.1957 5.92471 19.3433 5.99838 19.5002 5.99994C19.6084 6.00061 19.714 5.96556 19.8002 5.89994C20.0212 5.73431 20.0658 5.42092 19.9002 5.19994L19.1102 4.13988C20.8678 4.43988 22.5049 5.23097 23.8321 6.42182C25.1592 7.61268 26.1223 9.15485 26.6102 10.8701L25.2502 10.0701C25.1357 9.9868 24.9915 9.95599 24.8531 9.98501C24.7145 10.0142 24.5951 10.1006 24.5239 10.223C24.4526 10.3453 24.4368 10.4921 24.4799 10.6267C24.523 10.7616 24.6212 10.8716 24.7502 10.9299L26.9002 12.2C26.9752 12.2464 27.062 12.2705 27.1502 12.2701H27.2801C27.4098 12.2424 27.5198 12.1578 27.5801 12.0399L28.8502 9.88995C28.9895 9.65178 28.9143 9.3462 28.6801 9.20001C28.4395 9.06251 28.133 9.14242 27.9902 9.37991L27.4801 10.25C26.8922 8.43529 25.8176 6.81654 24.3737 5.57014C22.9297 4.32351 21.1714 3.49694 19.2902 3.17997L20.2902 2.41992V2.42014C20.5112 2.25429 20.5558 1.9409 20.3902 1.72014C20.2246 1.49916 19.9112 1.45429 19.6902 1.62014L17.6902 3.12014C17.4694 3.28576 17.4246 3.59916 17.5902 3.82014L19.1002 5.79994Z" fill="white" />
        </svg>
        <h1>Please rotate your phone, make sure auto rotate is on.</h1>
    </div>)

    else return <AgoraStream />
}
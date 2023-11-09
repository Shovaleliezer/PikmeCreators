
export function Ban() {
    return (
        <div className='error'>
            <img src={require('../style/imgs/error.png')} />
            <h1>Your account is banned.</h1>
            <p>contact our support team <span onClick={() => window.gist.chat('open')}>here</span>.</p>
        </div>
    )
}
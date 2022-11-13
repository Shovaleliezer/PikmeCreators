import { useSelector, useDispatch } from 'react-redux'
import { setMenu, setPopup } from "../store/actions/general.actions"
import { setIsConnected, setNickName, setAbout, setAddress, setImage } from '../store/reducers/userReducer'
import { userService } from '../services/userService'

export function WalletConnect({ from }) {
    const dispatch = useDispatch()
    const { mode } = useSelector((storeState) => storeState.generalModule)
    const { ethereum } = window

    if (ethereum) {
        window.ethereum.on('accountsChanged', async (accounts) => {
            if (!accounts[0]) {
                dispatch(setIsConnected(false))
            }
        })
    }

    const connectWallet = async () => {
        try {
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            })
            const res = await userService.handleAccount(accounts[0])
            if (res) {
                dispatch(setAbout(res.about))
                dispatch(setAddress(res.walletAddress))
                dispatch(setNickName(res.nickName))
                dispatch(setIsConnected(true))
                dispatch(setImage(res.image))
                dispatch(setPopup('connected'))
            }
            else {
                dispatch(setIsConnected(false))
            }
        } catch (error) {
            dispatch(setIsConnected(false))
        }
    }

    return (
        <div className={`wallet-connect ${mode.type}`} style={{ marginBottom: from === 'popup' ? '0' : '25vh' }}>
            <h1>Connect your wallet</h1>
            <p>If you do not have any wallet, you can create one right <a href="https://metamask.io/" target="_blank">here</a>.</p>
            <section>
                <div onClick={connectWallet}><img src={require('../style/imgs/metamask-logo.png')} /><p>Metamask</p></div>
                <div><img src={require('../style/imgs/walletconnect-logo.png')} /><p>WalletConnect</p></div>
                <div><img src={require('../style/imgs/binance-logo.png')} /><p>Binance</p></div>
                <div><p>Your wallet not here? go to <span onClick={() => { dispatch(setMenu('help')); dispatch(setPopup('')) }}>Help</span>.</p></div>
            </section>
        </div>
    )
}
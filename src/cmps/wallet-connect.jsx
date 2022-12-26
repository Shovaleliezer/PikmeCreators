import { useSelector, useDispatch } from 'react-redux'
import { setMenu, setPopup } from "../store/actions/general.actions"
import { setIsConnected, setAddress, resetState } from '../store/reducers/userReducer'
import { setConnectPhase } from '../store/actions/tutorial.actions'
import { userService } from '../services/userService'
import { TutorialConnect } from './tutorial-connect'

export function WalletConnect({ from, handleCreatorAddress }) {
    const dispatch = useDispatch()
    const { mode } = useSelector((storeState) => storeState.generalModule)
    const { ethereum } = window
    const { connectPhase } = useSelector((state) => state.tutorialModule)

    if (connectPhase === 0) dispatch(setConnectPhase(1))

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
            const res = await userService.checkIsCreator(accounts[0])
            if (res) {
                if (connectPhase === 2) dispatch(setConnectPhase(3))
                handleCreatorAddress(accounts[0])
            }

            else {
                dispatch(setIsConnected(true))
                dispatch(setAddress(accounts[0]))
            }
        }
        catch (error) {
            dispatch(setIsConnected(false))
            dispatch(resetState())
        }
    }

    return (<>
        {connectPhase < 3 && <div className="screen-tutorial" />}
        {connectPhase === 1 && <TutorialConnect />}
        <div className={`wallet-connect ${mode.type}`} style={{ marginBottom: from === 'popup' ? '0' : '25vh', zIndex: connectPhase === 2 ? '1001' : '0' }}>
            <h1>Connect your wallet</h1>
            <p>If you do not have any wallet, you can create one right <a href="https://metamask.io/" target="_blank">here</a>.</p>
            <section>
                <div onClick={() => connectWallet()}><img src={require('../style/imgs/metamask-logo.png')} /><p>Metamask</p></div>
                <div><img src={require('../style/imgs/walletconnect-logo.png')} /><p>WalletConnect</p></div>
                <div><img src={require('../style/imgs/binance-logo.png')} /><p>Binance</p></div>
                <div><p>Your wallet not here? go to <span onClick={() => { dispatch(setMenu('help')); dispatch(setPopup('')) }}>Help</span>.</p></div>
            </section>
        </div>
    </>)
}
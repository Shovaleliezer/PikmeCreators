import { useSelector,useDispatch } from 'react-redux'
import { setMenu } from "../store/actions/general.actions" 

export function WalletConnect({connectWallet}) {
    const { mode } = useSelector((storeState) => storeState.generalModule)
    const dispatch = useDispatch()
    let back = mode.type==='dark'? mode.background : '#D4D4D4'

    return (
        <div className={`wallet-connect ${mode.type}`} >
           <h1>Connect your wallet</h1>
           <p>If you do not have any wallet, you can create one right <a href="https://metamask.io/" target="_blank">here</a>.</p>
           <section style={{background:back}}>
            <div onClick={connectWallet}><img src={require('../style/imgs/metamask-logo.png')}/><p>Metamask</p></div>
            <div><img src={require('../style/imgs/walletconnect-logo.png')}/><p>WalletConnect</p></div>
            <div><img src={require('../style/imgs/binance-logo.png')}/><p>Binance</p></div>
            <div><p>Your wallet not here? go to <span onClick={()=>dispatch(setMenu('help'))}>Help</span>.</p></div>
           </section>
        </div>
    )
}
import { isMobile } from 'react-device-detect'

export function ExtensionConnect({mode}) {
    return(
        <div className={`extension center ${mode.type}`}>
    <img className='extension-img' src={require('../style/imgs/metamask-big.png')} />
    <p> Metamask wallet support could not be detected, in order to connect your wallet please install it
      <a href={isMobile ? "https://play.google.com/store/apps/details?id=io.metamask" : "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"}
        className='main-color' target="_blank">  here.</a></p>
    <p>Once installed, <span onClick={() => window.location.reload()} className='main-color clickable underline'> refresh the page</span>.</p>
  </div>
    )
}
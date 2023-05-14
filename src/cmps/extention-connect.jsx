import { isMobile } from 'react-device-detect'

export function ExtensionConnect() {

  function getOSLink() {
      let platform = window.navigator?.userAgentData?.platform || window.navigator.platform
      let macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
      let iosPlatforms = ['iPhone', 'iPad', 'iPod']
      let link = null

    if (macosPlatforms.indexOf(platform) !== -1) link = 'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202'
    else if (iosPlatforms.indexOf(platform) !== -1) link = 'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202'
    else link = 'https://play.google.com/store/apps/details?id=io.metamask'
    return link;
  }

  return (
    <div className='extension center'>
      <img className='extension-img' src={require('../style/imgs/metamask-big.png')} />
      <p> Metamask wallet support could not be detected. in order to connect your wallet please install it
        <a href={isMobile ? getOSLink()
          : "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"}
          className='main-color' target="_blank"> here.</a></p>
      <p>If you use a mobile device, open Metamask application browser <a href='https://metamask.app.link/dapp/pikme.tv/#/' className='main-color'>here.</a></p>
      <p>If you use a PC, <span onClick={() => window.location.reload()} className='main-color clickable underline'>refresh the page </span>once Chrome Metamask extension is installed.</p>
    </div>
  )
}
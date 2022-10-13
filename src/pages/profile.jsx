
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"

import { userService } from '../services/userService'
import { uploadService } from '../services/upload.service'

import { setIsConnected, setNickName, setAbout, setAddress, resetState, setImage } from '../store/reducers/userReducer'

import { WalletConnect } from '../cmps/wallet-connect'
import { ExtensionConnect } from '../cmps/extention-connect'
import { ProfileCredits } from '../cmps/profile-credits'
import { ProfileHistory } from '../cmps/profile-history'
import { ProfileSettings } from '../cmps/profile settings'
import { ProfileTickets } from '../cmps/profile-tickets'

export function Profile(props) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const isConnected = useSelector((state) => state.user.isConnected)
  const options = ['history', 'credits', 'tickets', 'settings']
  const [selected, setSelected] = useState('history')
  const [haveMetamask, sethaveMetamask] = useState(false)
  const { ethereum } = window;
  if (ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (!accounts[0]) {
        dispatch(setIsConnected(false))
      }
    });
  }

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();
    setSelected('history')
  }, []);

  const disconnectWallet = async () => {
    try {
      dispatch(resetState());
      dispatch(setIsConnected(false))
    }
    catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });


      const res = await userService.handleAccount(accounts[0])
      if (res) {
        dispatch(setAbout(res.about))
        dispatch(setAddress(res.walletAddress))
        dispatch(setNickName(res.nickName))
        dispatch(setIsConnected(true))
        dispatch(setImage(res.image))
      }
      else {
        dispatch(setIsConnected(false))

      }


    } catch (error) {
      dispatch(setIsConnected(false))
    }
  }
  const imgChange = async (ev) => {
    const uploadedImage = await uploadService.uploadImg(ev.target.files[0])
    const updatedUser = await userService.updateAccount(user.address, { image: uploadedImage.secure_url })
    dispatch(setImage(updatedUser.image))
  }

  const logOut = async () => {
    await disconnectWallet()
    dispatch(resetState())

  }

  if (!ethereum) return <ExtensionConnect mode={props.mode} />
  else if (!isConnected) return <WalletConnect connectWallet={connectWallet} />


  else return (
    <section className={`profile ${props.mode.type}`}>

      <section className='img-holder'>
        <img className='profile-banner' src='https://wallpaperaccess.com/full/1282257.jpg' />
        <img className='user-img noselect' src={user.image} />
        <div className='user-img img-cover noselect'>
          <input accept="image/png, image/jpeg" type="file" id="img" onChange={imgChange} />
          <label htmlFor='img'><span className="material-symbols-outlined clickable">edit</span></label>
        </div>
      </section>

      <section className='details'>
        <h1>{user.nickName.charAt(0).toUpperCase() + user.nickName.slice(1)}</h1>
        <div>
          <span className="material-symbols-outlined">account_balance_wallet</span>
          {user.address.slice(0, 4)}...{user.address.slice(38, 42)}
        </div>
      </section>

      <section className='profile-options'>
        {options.map(opt => <p onClick={() => setSelected(opt)} className={selected === opt ? 'main-color clickable' : 'clickable'}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}</p>)}
      </section>

      {selected === 'history' && <ProfileHistory/>}
      {selected === 'credits' && <ProfileCredits/>}
      {selected === 'settings' && <ProfileSettings/>}
      {selected === 'tickets' && <ProfileTickets/>}



      {/* <button onClick={logOut}>Disconnect</button> */}
    </section>
  )
}
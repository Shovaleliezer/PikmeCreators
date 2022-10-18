
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux"

import { userService } from '../services/userService'
import { uploadService } from '../services/upload.service'

import { setIsConnected, setNickName, setAbout, setAddress, resetState, setImage } from '../store/reducers/userReducer'

import { WalletConnect } from '../cmps/wallet-connect'
import { ExtensionConnect } from '../cmps/extention-connect'
import { ProfileTable } from '../cmps/profile-table'
import { ProfileStats } from '../cmps/profile-stats'

export function Profile(props) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const isConnected = useSelector((state) => state.user.isConnected)
  const options = ['history', 'user stats', 'upcoming events']
  const [selected, setSelected] = useState('history')
  const [nameEdit, setNameEdit] = useState(false)
  const nameRef = useRef()
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
  const nickNameChange = async (ev) => {
    ev.preventDefault()
    const updatedUser = await userService.updateAccount(user.address, { nickName: nameRef.current.value })
    dispatch(setNickName(updatedUser.nickName))
    setNameEdit(false)
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

      <div className='profile-wrapper'>
        <section className='details'>
          <h1><span onClick={() => setNameEdit(!nameEdit)} className="material-symbols-outlined clickable noselect">edit</span>
            {' ' + user.nickName.charAt(0).toUpperCase() + user.nickName.slice(1)}</h1>
          {nameEdit && <form onSubmit={nickNameChange} >
            <input className={props.mode.type} autoFocus maxLength="15" type='text' placeholder='Enter your new nickname' ref={nameRef} />
            <button className={props.mode.type}><span className="material-symbols-outlined">chevron_right</span></button></form>}
          <div>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            {user.address.slice(0, 4)}...{user.address.slice(38, 42)}
          </div>
        </section>

        <section className='profile-options'>
          {options.map(opt => <p key={opt} onClick={() => setSelected(opt)} className={selected === opt ? 'main-color clickable' : 'clickable'}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}</p>)}
        </section>

        {selected === 'history' && <ProfileTable history={user.history} mode={props.mode} isHistory={true}/>}
        {selected === 'user stats' && <ProfileStats/>}
        {selected === 'upcoming events' && <ProfileTable history={user.history} mode={props.mode} isHistory={false}/>}
      </div>
      {/* <button onClick={logOut}>Disconnect</button> */}
    </section>
  )
}
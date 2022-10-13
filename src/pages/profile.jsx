
import { useState, useEffect } from 'react'
import { userService } from '../services/userService'
import { useDispatch, useSelector } from "react-redux"
import { setIsConnected, setNickName, setAbout, setAddress, resetState, setImage } from '../store/reducers/userReducer'
import { WalletConnect } from '../cmps/wallet-connect'
import { ExtensionConnect } from '../cmps/extention-connect'
import { uploadService } from '../services/upload.service'

export function Profile(props) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const isConnected = useSelector((state) => state.user.isConnected)
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
    const updatedUser = await userService.updateAccount(user.address,{image:uploadedImage.secure_url})
    dispatch(setImage(updatedUser.image))  
  }

  if (!ethereum) return <ExtensionConnect mode={props.mode} />
  else if (!isConnected) return <WalletConnect connectWallet={connectWallet} />

  else return (
    <section className={`profile ${props.mode.type}`}>
      <img className='profile-banner' src='https://wallpaperaccess.com/full/1282257.jpg' />
      <img className='user-img noselect' src={user.image} />
      <div className='user-img img-cover noselect'>
        <input accept="image/png, image/jpeg" type="file" id="img" onChange={imgChange}/>
        <label htmlFor='img'><span className="material-symbols-outlined clickable">edit</span></label>
        </div>


      <h3>Wallet Address:{user.address.slice(0, 4)}...{user.address.slice(38, 42)}</h3>
      <p>Welcome back {user.nickName}</p>
      <button onClick={disconnectWallet}>Disconnect</button>
    </section>
  )
}
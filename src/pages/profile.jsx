
import { useState, useEffect } from 'react';
import { userService } from '../services/userService'
import { useDispatch, useSelector } from "react-redux";

import { setIsConnected, setNickName,setBalance, setHistory, setAbout, setAddress, resetState } from '../store/reducers/userReducer';

export function Profile() {
  const dispatch = useDispatch();
  const accountAddress = useSelector((state) => state.user.address);
  const isConnected = useSelector((state) => state.user.isConnected);
  const nickName = useSelector((state) => state.user.nickName);
  const [haveMetamask, sethaveMetamask] = useState(true);
  const { ethereum } = window;

  window.ethereum.on('accountsChanged', async (accounts) => {
    console.log("acc log", accounts[0])
    if (!accounts[0]){
        dispatch(setIsConnected(false))
    }
    });
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
      if(res){
        dispatch(setAbout(res.about))
        dispatch(setAddress(res.walletAddress))
        dispatch(setNickName(res.nickName))
        dispatch(setIsConnected(true))
       
      }
      else{
        dispatch(setIsConnected(false))
      
      }
      

    } catch (error) {
        dispatch(setIsConnected(false))
    }
  };

  return (
    <div >
      <header >
        {haveMetamask ? (
          <div >
            {isConnected ? (
              <div >
                <div >
                  <h3>Wallet Address:</h3>
                  <p>
                    {accountAddress.slice(0, 4)}...
                    {accountAddress.slice(38, 42)}
                  </p>
                </div>
                <div >
                  <h3>your name:</h3>
                  <p>{nickName}</p>
                </div>
              </div>
            ) : (
              <p>logo</p>
            )}
            {isConnected ? (
              <button  onClick={disconnectWallet}>
              Disconnect
            </button>
              
            ) : (
              <button  onClick={connectWallet}>
                Connect
              </button>
            )}
          </div>
        ) : (
          <p>Please Install MataMask</p>
        )}
      </header>
    </div>
  );
}


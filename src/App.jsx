import Login from './components/login';
import Main from './components/Main';
import AlertBox from './components/alertBox';
import InitialiseWalletAndPin from './components/initialiseWalletAndPin';
import CreateNewWallet from './components/createNewWallet';
import './index.css'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'

let sdk = new W3SSdk();

const App = () => {
  const [user, setUser] = useState(null);
  const [activeWallet, setActiveWallet] = useState('')
  const [wallets, setWallets] = useState([])
  const [tokens, setTokens] = useState([])

  const [showCreateWallet, setShowCreateWallet] = useState(null)
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [reloadOnOk, setReloadOnOk] = useState(true);
  const [alertStatus, setAlertStatus] = useState('success');
  const [pageLoading, setPageLoading] = useState(true)

  window.onsignin = async function (googleUser) {
    try {
      setPageLoading(true)
      localStorage.setItem('loginToken', googleUser.credential)
      const response = await axios.get('/api/validateSignin', { params: { credential: googleUser.credential } })
      setUser(response.data.profile)
      if (!response.data.initialised) {
        setShowCreateWallet('firstWallet')
        setPageLoading(false)
      } else {
        displayMainData(response.data)
      }
    } catch (e) {
      alertError(e, true)
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (localStorage.getItem('loginToken')) {
        try {
          const response = await axios.get('/api/getUserData', { params: { credential: localStorage.getItem('loginToken') } })
          setUser(response.data.profile)
          if (!response.data.initialised) {
            setShowCreateWallet('firstWallet')
          } else {
            displayMainData(response.data)
          }
        } catch (e) {
          alertError(e, true)
        } finally {
          setPageLoading(false); // Marking loading as complete
        }
      } else {
        setPageLoading(false); // Marking loading as complete
      }
    };

    checkLoggedIn();
  }, []);
  
  async function sleep(ms) { return new Promise((resolve) => setTimeout(() => resolve(), ms)) }
  const executeChallange = ({ appId, userToken, encryptionKey, challengeId, current = true, reloadIfDone = false }) => {
    /*sdk.setThemeColor({
      backdrop: '#000',
      backdropOpacity: 0.5,
      divider: 'aliceblue',
      bg: '#000c18',
      textMain: 'aliceblue',
      textMain2: 'aliceblue',
      textAuxiliary: 'silver',
      textAuxiliary2: 'silver',
      textSummary: 'aliceblue',
      textSummaryHighlight: 'aliceblue',
      textPlaceholder: 'silver',
      dropdownBg: '#000c18',
      inputBg: '#10192c',
      inputBgDisabled: '#071020',
      recoverPinHint: 'aliceblue'
    })*/
    sdk.setOnForgotPin(restorePin, true)
    sdk.setAppSettings({ appId })
    sdk.setAuthentication({ userToken, encryptionKey })

    sdk.execute(challengeId, async (error, result) => {
      if (error) {
        setPageLoading(false)
        return alertError(error, reloadIfDone)
      }
      reqData(current ? activeWallet?.id : undefined)
      setPageLoading(false)
      setAlertMessage(`${result.type} ${result.status}`)
      setReloadOnOk(reloadIfDone)
      setAlertStatus('success')
      setShowAlert(true)
    })
  }
  const displayMainData = async (data) => {
    console.log(data.wallets.length)
    if (!data?.wallets?.length) {
      console.log('fetching after 5 sec')
      await sleep(5000)
      console.log('fetching...')
      await reqData()
      return
    }
    setWallets(data.wallets)
    setActiveWallet(data.wallets?.[0])
    console.log(data.tokensForFirstWallet)
    setTokens(data.tokensForFirstWallet)
    setPageLoading(false)
  }

  const alertError = (error, reload) => {
    setReloadOnOk(reload)
    console.log(error)
    if (error?.response?.data?.status === 401) {
      localStorage.removeItem('loginToken')
      setUser(null)
      setReloadOnOk(true)
    }
    setAlertMessage(error?.response?.data?.message || error.message || error)
    setAlertStatus('failure')
    setShowAlert(true)
    setPageLoading(false)
  }

  const initialise_create_wallet = async (event, endpoint, reloadIfDone) => {
    try {
      event.preventDefault()
      const formData = new FormData(event.target)
      let retrivedData = {}
      for (let [key, value] of formData.entries()) {
        retrivedData[key] = value;
      }
      setPageLoading(true)
      const response = await axios.get('/api/' + endpoint, { params: { ...retrivedData, credential: localStorage.getItem('loginToken') } })
      executeChallange({ ...response.data, current: false, reloadIfDone })
    } catch (e) {
      alertError(e, endpoint === "initialiseCreatedUser")
    } finally {
      setShowCreateWallet(null)
    }
  }

  async function fetchTransactions(date, page) {
    try {
      const { data } = await axios.get('/api/fetchTransactions', { params: { walletId: activeWallet?.id, date, page, credential: localStorage.getItem('loginToken') } })
      return data;
    } catch (e) {
      alertError(e, false)
    }
  }
  async function sendTransaction({ destination, amount, tokenId, balance, walletId }) {
    try {
      setPageLoading(true)
      const response = await axios.get('/api/sendTransaction', { params: { credential: localStorage.getItem('loginToken'), destination, amount, tokenId, walletId } })
      executeChallange({ ...response.data })
    } catch (e) {
      alertError(e, false)
    }
  }
  async function changePin() {
    try {
      setPageLoading(true)
      const response = await axios.get('/api/changePin', { params: { credential: localStorage.getItem('loginToken') } })
      executeChallange({ ...response.data })
    } catch (e) {
      alertError(e, false)
    }
  }
  async function restorePin() {
    try {
      setPageLoading(true)
      const response = await axios.get('/api/restorePin', { params: { credential: localStorage.getItem('loginToken') } })
      executeChallange({ ...response.data })
    } catch (e) {
      alertError(e, false)
    }
  }

  async function fetchTokens() {
    try {
      setPageLoading(true)
      const response = await axios.get('/api/getTokens', { params: { id: activeWallet?.id, credential: localStorage.getItem('loginToken') } })
      setTokens(response.data.tokenBalances)
      setPageLoading(false)
    } catch (e) {
      alertError(e, false)
    }
  }

  async function reqData(firstWalletId) {
    try {
      setPageLoading(true)
      const response = await axios.get('/api/getUserData', { params: { credential: localStorage.getItem('loginToken'), firstWalletId } })
      setUser(response.data.profile)
      displayMainData(response.data)
    } catch (e) {
      alertError(e, true)
    }
  }
  const logout = () => {
    localStorage.removeItem('loginToken')
    setUser(null)
    setAlertMessage('Logged out successfully!')
    setReloadOnOk(true)
    setAlertStatus('success')
    setShowAlert(true)
    setShowCreateWallet(null)
  }
  const LoadingDiv = () => {
    return (
      <div className='popupBackdrop'>
        <i className="demo-icon icon-spinner animate-spin" style={{ fontSize: '200px' }}>&#xe806;</i>
      </div>
    )
  }
  return (
    <div>
      {user ? <Main user={user} logout={logout} wallets={wallets} activeWallet={activeWallet} tokens={tokens} fetchTransactions={fetchTransactions} sendTransaction={sendTransaction} setShowCreateWallet={setShowCreateWallet} changePin={changePin} restorePin={restorePin} fetchTokens={fetchTokens} reqData={reqData} /> : <Login />}
      {showAlert && <AlertBox alertMessage={alertMessage} reloadOnOk={reloadOnOk} setShowAlert={setShowAlert} status={alertStatus} />}
      {showCreateWallet === "firstWallet" && <InitialiseWalletAndPin initialiseWalletAndPin={initialise_create_wallet} username={user?.name} />}
      {showCreateWallet === "newWallet" && <CreateNewWallet createNewWallet={initialise_create_wallet} setShowCreateWallet={setShowCreateWallet} />}
      {pageLoading && <LoadingDiv />}
    </div>
  );
};

export default App;
import './Main.css'
import { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import Footer from './footer';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const Main = ({ user, logout, wallets, activeWallet, tokens, fetchTransactions, sendTransaction, setShowCreateWallet, changePin, restorePin, fetchTokens, reqData }) => {
  const [maxLength, setMaxLength] = useState(19);
  const spanRef = useRef(null);
  const [mainToken, setMainToken] = useState(tokens? tokens[0] : {})
  const [otherTokens, setOtherTokens] = useState(tokens?.filter(t => t?.token?.id !== tokens?.[0]?.token?.id))
  const [bottomInfo, showBottomInfo] = useState('tokens')
  const [transactions, setTransactions] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [tokenNames, setTokenNames] = useState({})
  
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [transactionToken, setTransactionToken] = useState(null)

  const [nextButtonDisabled, setNextButtonDisabled] = useState(false)
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  let chooseWalletsHeight = 0
  
  useEffect(() => {
    if (spanRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      setMaxLength(Math.floor(spanWidth / 9));
    }
    setMainToken(tokens? tokens[0] : {})
    setOtherTokens(tokens?.filter(t => t.token.id !== tokens[0].token.id))
    let x = {}
    tokens?.forEach((tkn) => {
      x[tkn.token.id] = tkn.token.symbol
    })
    setTokenNames(x)
  }, [activeWallet, tokens]);

  const formatString = (str) => {
    if (!str) return '';
    if (str.length <= maxLength) {
      return str;
    } else {
      const middle = maxLength / 2 - 3;
      const start = str.slice(0, middle);
      const end = str.slice(-middle);
      return start + '...' + end;
    }
  };
  const imgSources = {
    'ETH-SEPOLIA': 'ethereum.svg',
    'AVAX-FUJI': 'avalanche.svg',
    'MATIC-AMOY': 'matic.svg',
    'USDC': 'usdc.svg',
    'EURC': 'eurc.svg'
  }
  const blockchainExpplorer = {
    'ETH-SEPOLIA': 'https://sepolia.etherscan.io/tx/',
    'AVAX-FUJI': 'https://testnet.snowtrace.io/tx/',
    'MATIC-AMOY': 'https://amoy.polygonscan.com/tx/'
  }
  function chooseWallets(){
    chooseWalletsHeight = chooseWalletsHeight ? 0 : '280px'
    document.querySelector('.icon-down-open').style.transform = chooseWalletsHeight ? 'rotate(180deg)' : 'rotate(0deg)'
    document.querySelector('#selectWallet').style.height = chooseWalletsHeight
    document.querySelector('#selectWallet').style.borderWidth = chooseWalletsHeight ? '1px' : 0
  }
  function switchWallets(id, event){
    event.stopPropagation();
    chooseWalletsHeight = 0
    document.querySelector('.icon-down-open').style.transform = 'rotate(0deg)'
    document.querySelector('#selectWallet').style.height = chooseWalletsHeight
    document.querySelector('#selectWallet').style.borderWidth = chooseWalletsHeight ? '1px' : 0
    reqData(id)
    showBottomInfo('tokens')
  }

  const TransactionDialog = () =>{
    async function submitTransaction(event){
      event.preventDefault()
      fetchTokens()
      const formData = new FormData(event.target)
      let retrivedData = {}
      for (let [key, value] of formData.entries()) { 
        retrivedData[key] = value;
      }
      await sendTransaction({...retrivedData, tokenId: transactionToken.token.id, balance: transactionToken.amount})
      setShowTransactionDialog(false)
    }
    return(
      <div className="popupBackdrop">
      <div className='gradientBorder'>
      <i className="demo-icon cancel-transaction" onClick={()=>setShowTransactionDialog(false)}>&#xe802;</i>
      <div id='transactionDialog'>
        <header>Send {transactionToken.token.symbol}</header>
        <form onSubmit={submitTransaction} id='transactionForm'>
          <div className='inputLabelDiv'>
            <label htmlFor='senderWalletId'>From Wallet:</label>
            <input type='text' readOnly value={activeWallet?.id} id='senderWalletId' name='walletId' required/>
          </div>
          <div className='inputLabelDiv'>
            <label htmlFor='reciepientAddress'>Reciepient Address:</label>
            <input type="text" id='recipientAddress' name='destination' required/>
          </div>
          <div className='inputLabelDiv'>
            <label htmlFor='amount'>Token Amount: </label>
            <div className='amountNbalance'>
              <div>
                <input type="number" id='amount' name='amount'step="any"required/>
                <img src={imgSources[transactionToken.token?.symbol]} alt={transactionToken.token?.symbol} />
              </div>
              <span>Balance: {parseFloat(transactionToken.amount).toFixed(4)} <img src={imgSources[transactionToken.token?.symbol]} alt={transactionToken.token?.symbol} /></span>
          </div>
          </div>
          <input type='submit' value='Send'/>
        </form>
      </div>
      </div>
      </div>
    )
  }
  const SwitchWalletsDiv = () => {
    let listedWallet = (wallet, number) => {
      return(
        <div className='listedWallet' id={wallet.id} key={wallet.id} style={{backgroundImage: `url(${imgSources[wallet.blockchain]})`}} onClick={(event)=>switchWallets(wallet.id, event)}>
          <div className='walletInfo'>
          <span className='name'>{formatString(wallet.name || 'Wallet #' + number)}</span>
          <span className='id'>{formatString(wallet.id)}</span>
          <span className='description'>{wallet.refId}</span>
          </div>
        </div>
      )
    }
    let walletList = []
    for (let i = 0;  i < wallets?.length; i++) {
      walletList.push(listedWallet(wallets[i], i + 1))
    }
    return(
      <div id='selectWallet'>
        <div>
        {walletList}
        </div>
      </div>
    )
  }
  const SettingsDiv = () => {
    return (
      <div className='settingsDiv'>
        <span onClick={changePin}><i className="demo-icon icon-edit">&#xe80A;</i> Change Pin</span>
        <span onClick={restorePin}><i className="demo-icon icon-arrowa-cw">&#xe809;</i> Restore Pin</span>
        <span onClick={logout}><i className="demo-icon icon-logout">&#xe800;</i> Logout</span>
      </div>
    )
  }
  const BasicDatePicker = () => {
    return (
      <div id="fetchBefore" data-tooltip-id="calendar" data-tooltip-content="Fetch transactions before date (inclusive)" data-tooltip-place="bottom">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker defaultValue={dayjs()} onChange={(e)=> trFetcher(e, null)} disableFuture />
        </LocalizationProvider>
      </div>
    );
  }
  const Tokens = () => {
    let TokenDivs = []
    otherTokens?.forEach((tkn) => {
      TokenDivs.push(
        <div key={tkn?.token?.symbol} className='tokenContainer'>
          <div className='token'>
            <img alt={tkn?.token?.symbol} src={imgSources[tkn?.token?.symbol]} />
            <span className='tokenAmount'>
            {parseFloat(tkn?.amount).toFixed(4)}
            <span>{tkn?.token?.symbol}</span>
            </span>
          </div>
          <button onClick={()=>{setTransactionToken(tkn); setShowTransactionDialog(true)}} data-tooltip-id="sendToken" data-tooltip-content={"Send " + tkn?.token?.symbol} data-tooltip-place="bottom"><i className="demo-icon icon-right">&#xe808;</i></button>
        </div>
      )
    })
    return (
      <div className='bottomList'>
        {TokenDivs}
      </div>
    )
  }
  const Transactions = () => {
      let TrDivs = []
      transactions.forEach((transaction) => {
        TrDivs.push(
          <a key={transaction.id} id={transaction.id} target="_blank" rel="noreferrer" href={blockchainExpplorer[transaction.blockchain] + transaction.txHash}>
            <div className={"transaction " + transaction.state}>
              <div className='icon_dest'>
              <i className={"demo-icon icon-right " + transaction.transactionType}>&#xe808;</i>
              <div className='d_o_s'>
                <span className='dest'>
                  {transaction.transactionType === "OUTBOUND" ? transaction.destinationAddress : transaction.sourceAddress}
                </span>
                <div>
                  <span className='operation'>{transaction.operation}</span>
                  <span className={'state '+transaction.state}>{transaction.state}</span>
                </div>
              </div>
              </div>
              <div className='date_time'>
                <span className='date'><span>🗓️</span>{new Date(transaction.createDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span className='time'>{new Date(transaction.createDate).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: 12 })}</span>
              </div>
              <div className='amount_token'>
                <img src={imgSources[tokenNames[transaction.tokenId]]} alt={tokenNames[transaction.tokenId]} />
                <span>{parseFloat(transaction.amounts[0]).toFixed(4)}</span>
              </div>
            </div>
          </a>
        )
      })
      return (
        <div className='bottomList'>
          {!loadingTransactions && (TrDivs.length ? TrDivs : <div style={{height: "100%", width: "100%", display: "flex", justifyContent:"center", alignItems:"center"}}>No Transaction History</div>)}
          {loadingTransactions && <div style={{height: "100%", width: "100%",  display: "flex", justifyContent:"center", alignItems:"center"}}><i className="demo-icon icon-spinner animate-spin" style={{fontSize: '50px'}}>&#xe806;</i></div>}
          {!loadingTransactions && (TrDivs.length ? <div className='navigateButton'>
            <button id='prevPage' disabled={prevButtonDisabled} onClick={()=>trFetcher(null, 'prev')}><i className="demo-icon icon-down-open">&#xe803;</i>Previous Page</button>
            <button id='nextPage' disabled={nextButtonDisabled} onClick={()=>trFetcher(null, 'next')}>Next Page<i className="demo-icon icon-down-open">&#xe803;</i></button>
          </div> : '')}
        </div>
      )
  }
  async function trFetcher(date, page){
    setLoadingTransactions(true)
    showBottomInfo('transactions'); document.querySelector('.selected')?.classList?.remove('selected'); document.getElementById('showTransactionsSwitch').classList.add('selected');
    function enable_disable_buttons(type, lastOfType){
      setNextButtonDisabled((type === "next" && lastOfType) || (!type && lastOfType))
      setPrevButtonDisabled((type === "prev" && lastOfType) || (!type))
    }
    if(date){
      const dateObj = new Date(date || Date.now())
      dateObj.setHours(23, 59, 59);
      let response = await fetchTransactions(dateObj.toISOString(), null)
      setTransactions(response?.transactions)
      enable_disable_buttons(response?.type, response?.lastOfType)
    } else if (page) {
      let lastId;
      if(page === 'prev') lastId = transactions[0].id
      if(page === 'next') lastId = transactions[transactions.length - 1].id
      let response = await fetchTransactions(null, { type: page, lastId})
      setTransactions(response?.transactions)
      enable_disable_buttons(response?.type, response?.lastOfType)
    } else {
      let response = await fetchTransactions(null, null)
      setTransactions(response?.transactions)
      enable_disable_buttons(response?.type, response?.lastOfType)
    }
    setLoadingTransactions(false)
  }
  return (
    <div className='main'>
      <h1 className='mainHead shrink'>
        <img src="./Logo.svg" alt='Logo' className='headLogo' />
        Sphere
      </h1>
      <div className="heading">
        <div id="profile"><img alt='profile pic' src={user?.picture} />Welcome, <span>{user?.name}!</span></div>
        <div id='activeWallet' onClick={chooseWallets} ref={spanRef}>
          <img alt= {activeWallet?.blockchain} src={imgSources[activeWallet?.blockchain]} />
          <span>{formatString(activeWallet?.name || activeWallet?.id, 19)}</span>
          <i data-tooltip-id="switchWallets" data-tooltip-content="Switch Wallets" data-tooltip-place="bottom" className="demo-icon icon-down-open">&#xe803;</i>
          <SwitchWalletsDiv />
        </div>
        <div className='icons'>
          <span>
            <i onClick={()=>{setShowCreateWallet('newWallet')}} className="demo-icon icon-plus" data-tooltip-id="addWallet" data-tooltip-content="Create new wallet" data-tooltip-place="bottom">&#xe807;</i>
          </span>
          <span>
            <i onClick={(event) => { setShowSettings(!showSettings); event.target.style.transform = showSettings ? 'rotate(0deg)' : 'rotate(90deg)' }} className="demo-icon icon-settings" data-tooltip-id="settings" data-tooltip-content="Settings" data-tooltip-place="bottom">&#xe804;</i>
          </span>
        </div>
        {showSettings && <SettingsDiv />}
      </div>
      <div className='middle'>
        <div id='mainToken'>
          <img src={imgSources[mainToken?.token?.blockchain]} alt={mainToken?.token?.blockchain} />
          {parseFloat(mainToken?.amount).toFixed(4)}
          <span>{mainToken?.token?.symbol}</span>
        </div>
        <div className='address' onClick={(event) => { navigator.clipboard.writeText(activeWallet?.address); event.target.innerHTML = "Copied to clipboard!"; setTimeout(() => event.target.innerHTML = `${activeWallet?.address}<span>📋</span>`, 2000) }} data-tooltip-id="copy" data-tooltip-content="Copy to Clipboard" data-tooltip-place="bottom">{activeWallet?.address}<span>📋</span></div>
        <div className='buttons'>
          <button onClick={()=>{setTransactionToken(mainToken); setShowTransactionDialog(true)}} id='sendToken'>Send {mainToken?.token?.symbol}</button>
          <button onClick={fetchTokens} id='refreshTokens'>Refresh Tokens</button>
          <a href='https://faucet.circle.com/' target='_blank' rel="noreferrer"><img alt="faucet" src="faucet.svg" data-tooltip-id="faucet" data-tooltip-content="Get USDC and EURC tokens from faucet" data-tooltip-place="bottom"/></a>
        </div>
      </div>
      <div className='bottom'>
        <header className='switchTokensTransactions'>
          <div className='switchSelector selected' id="showTokensSwitch" onClick={(event) => { showBottomInfo('tokens'); document.querySelector('.selected').classList.remove('selected'); event.target.classList.add('selected');}}>Tokens</div>
          <div className='switchSelector' id="showTransactionsSwitch" data-tooltip-id="fetchTransactions" data-tooltip-content="Fetch latest transactions" data-tooltip-place="bottom" onClick={async (event) => {
            if(event.target.id !== 'showTransactionsSwitch') return;
            trFetcher(null, null)
          }}>Transactions <BasicDatePicker /><Tooltip id="fetchTransactions" /></div>
        </header>
        {bottomInfo === 'tokens' && <Tokens />}
        {bottomInfo === 'transactions' && <Transactions />}
      </div>
      {showTransactionDialog && <TransactionDialog />}
      <Footer />
      <Tooltip id="switchWallets" />
      <Tooltip id="addWallet" />
      <Tooltip id="settings" />
      <Tooltip id="sendToken" />
      <Tooltip id="copy" />
      <Tooltip id="calendar" />
      <Tooltip id="faucet" />
    </div>
  );
};
export default Main;

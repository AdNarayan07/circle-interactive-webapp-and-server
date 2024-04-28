import './walletForm.css'
import { useState } from 'react';

const WalletForm = ({createFunction, submitValue, endpoint, reloadIfDone}) => {
  const Eth = 
  <div className='chain'>
    <img alt="Ehereum" src='./ethereum.svg' className='chainLogo small'/>
    Ethereum Sepolia
  </div>

  const Avax = 
  <div className='chain'>
    <img alt="Avalanche" src='./avalanche.svg' className='chainLogo small'/>
    Avalanche Fuji
  </div>

  const Matic = 
  <div className='chain'>
    <img alt="Matic" src='./matic.svg' className='chainLogo small'/>
    Matic Amoy
  </div>

  const [SelectedChain, setSelectedChain] = useState(Eth)

  const handleRadioChange = (event) => {
    setSelectedChain({Eth, Avax, Matic}[event.target.id])
    event.target.parentElement.style.height = 0
    event.target.parentElement.style.padding = "0 20px"
    event.target.parentElement.style.borderWidth = "0 1px"
  }

  const showRadioDiv = () => {
    let radioDiv = document.getElementById('radioDiv')
    radioDiv.style.height = "200px";
    radioDiv.style.padding = "20px 20px";
    radioDiv.style.borderWidth = "1px 1px";
  }
  return (
    <div className='gradientBorder'>
    <form onSubmit={(event)=>createFunction(event, endpoint, reloadIfDone)} id="createWallet">
      <header>Create a new wallet</header>
      <div className='inputLabelDiv'>
      <label htmlFor="chain">Choose the Blockchain:</label>
      <div id='chain' tabIndex={0} onClick={showRadioDiv}>{SelectedChain}<i className="demo-icon icon-down-open">&#xe803;</i></div>
      </div>
      <div id='radioDiv'>
        <header>Choose the Blockchain</header>
        <input type='radio' name='blockchain' value='ETH-SEPOLIA' id='Eth' defaultChecked onClick={handleRadioChange}/><label htmlFor='Eth' tabIndex={0}>{Eth}</label>
        <input type='radio' name='blockchain' value='AVAX-FUJI' id='Avax' onClick={handleRadioChange}/><label htmlFor='Avax' tabIndex={0}>{Avax}</label>
        <input type='radio' name='blockchain' value='MATIC-AMOY' id='Matic' onClick={handleRadioChange}/><label htmlFor='Matic' tabIndex={0}>{Matic}</label>
      </div>
      <div className='inputLabelDiv'>
      <label htmlFor="walletname">Wallet Name <span>(optional)</span>:</label>
      <input type="text" id="walletname" name="name" placeholder='Enter a custom name for your wallet'/>
      </div>
      <div className='inputLabelDiv'>
      <label htmlFor="walletdescription">Wallet Description <span>(optional)</span>:</label>
      <input type="text" id="walletdescription" name="description" placeholder='Enter a description for your wallet'/>
      </div>
      <input type="submit" value={submitValue}/>
    </form>
    </div>
)
};

export default WalletForm;
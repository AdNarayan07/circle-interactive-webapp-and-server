import React from 'react';
import './login.css'
import Footer from './footer';

const Login = () => {
  return (
    <div id='loginDiv'>
      <h1 className='mainHead'>
        <img src="./Logo.svg" alt="Logo" className='headLogo'/>
        Sphere
      </h1>
      <p className='sss'>
      Simple . Seamless . Secure
      </p>
      <div className='login'>
      <p>
        Get Started with your own wallet for USDC and EURC tokens
      </p>
      <div id="g_id_onload"
        data-client_id="700574123464-a7hdticirleue0efbt0astfpk2bvtqu6.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="onsignin"
        data-nonce=""
        data-auto_prompt="false">
      </div>
      <div className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="filled_blue"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left">
      </div>
      </div>
      <div className='blockchains'>
        <div className='chain'>
          <img src='./ethereum.svg' alt='Ehereum' className='chainLogo'/>
          Ethereum Sepolia
        </div>
        <div className='chain'>
          <img src='./avalanche.svg' alt='Avalanche' className='chainLogo'/>
          Avalanche Fuji
        </div>
        <div className='chain'>
          <img src='./matic.svg' alt='Matic' className='chainLogo'/>
          Matic Amoy
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

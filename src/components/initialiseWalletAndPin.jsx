import WalletForm from "./walletForm";
import './walletCreate.css'

const InitialiseWalletAndPin = ({ initialiseWalletAndPin, username }) => {
  return (
    <div className="popupBackdrop">
      <div>
        <h1 className="welcomeHead">
          Welcome aboard, <span>{username?.split(' ')[0]}</span>
        </h1>
        <p className="getStarted">
          Let's get you started!
        </p>
        <WalletForm createFunction={initialiseWalletAndPin} submitValue="Get Started" endpoint="initialiseCreatedUser" reloadIfDone={true}/>
      </div>
    </div>
  );
};

export default InitialiseWalletAndPin;
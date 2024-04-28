import WalletForm from "./walletForm";
import './walletCreate.css'

const CreateNewWallet = ({createNewWallet, setShowCreateWallet}) => {
  return (
    <div className="popupBackdrop">
      <div>
        <i className="demo-icon icon-cancel" onClick={()=>setShowCreateWallet(null)}>&#xe802;</i> 
        <WalletForm createFunction={createNewWallet} submitValue="Create" endpoint="createNewWallet" reloadIfDone={false}/>
      </div>
    </div>
  );
};

export default CreateNewWallet;
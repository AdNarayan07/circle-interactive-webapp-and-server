import './alertBox.css'
const AlertBox = ({ alertMessage, reloadOnOk, setShowAlert, status }) => {
  const handleOK = () => {
    if (reloadOnOk) window.location.reload()
    else setShowAlert(false);
  }
  return (
    <div className="popupBackdrop">
      <div className={'alertBox ' + status}>
        <header><i className="demo-icon icon-warning">&#xe801;</i></header>
        <p>{alertMessage}</p>
        <button onClick={handleOK} className={'button ' + status}>OK</button>
      </div>
    </div>
  )
};

export default AlertBox;
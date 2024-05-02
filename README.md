
# [🌐 Sphere - Your Secure Space](https://sphere-wallet.onrender.com)

👉 Link to Web App: https://sphere-wallet.onrender.com

`Note: App might take some time to load if render marks it inactive.`

Sphere Wallet is a digital wallet for managing USDC and EURC  tokens.

Powered By <a href="https://www.circle.com/en/">Circle</a> , it supports wallets on 3 blockchains:
| Blockchain | Wallet Type | Supported Tokens |
|:-----------------:|:-----------------:|:-----------------:|
|  Ethereum Sepolia    | SCA    | <img src="https://sphere-wallet.onrender.com/ethereum.svg" alt="ETH" height="20"> <img src="https://sphere-wallet.onrender.com/usdc.svg" alt="EURC" height="20"> <img src="https://sphere-wallet.onrender.com/eurc.svg" alt="USDC" height="20">    |
|  Avalanche Fuji  | EOA    | <img src="https://sphere-wallet.onrender.com/avalanche.svg" alt="AVAX" height="20"> <img src="https://sphere-wallet.onrender.com/usdc.svg" alt="EURC" height="20"> <img src="https://sphere-wallet.onrender.com/eurc.svg" alt="USDC" height="20">    |
|    Matic Amoy  | SCA    | <img src="https://sphere-wallet.onrender.com/matic.svg" alt="MATIC" height="20"> <img src="https://sphere-wallet.onrender.com/usdc.svg" alt="EURC" height="20">    |


## Code Walkthrough:
### Engines and Libraries Used:

* **Backend**:
    * Server `Node.js`
    * `Express.js` for serving the react build and handling client API requests.
    * `@circle-fin/user-controlled-wallets` for making API requests to Circle.
    * `Nodemailer v6.9.13` for sending notification emails to client.

* **Frontend**:
    * `React v18.2.0` for building web app.
    * `@circle-fin/w3s-pw-web-sdk v1.0.10` for executing challanges on client-side.
    * `Axios v1.6.8` for making API request to backend server.

along with other dependencies.

### Directory Map:
* **[`/functions`](/functions)**
    * **[`/functions/API.js`](/functions/API.js):** Object containing functions for handling API requests from client.
    * **[`/functions/circle-functions.js`](/functions/circle-functions.js):** Object containing functions to interact with circle's API.
    * **[`/functions/validateSignatureAndNotify.js`](/functions/validateSignatureAndNotify.js)** Function to handle Circle's Webhook response and send an email notification to client.

* **[`/public:`](/public)** Images and files to be served at client-side.
* **[`/src:`](/src)** React components, Icon-fonts and main framework to build client-side application.
* **[`/circle-server.js:`](/circle-server.js)** Entry point of the app. Serves react build, handles API and Webhook requests.


## Wallet Functionalities:
### Core Functionalities:

1. **Wallet Creation:** 
<a id="userInitialisation"></a>
    * **On First Sign-in:**
        - Client makes an API request to [`/initialiseCreatedUser`](/functions/API.js#L24-L36) endpoint with wallet info in params.
        - The server [creates a challenge ID to initialize the user and create its first wallet](/functions/circle-functions.js#L19-L33) on the selected blockchain.
    * **Subsequent Wallet Creations:**
        - On submitting a [form to create](/src/components/WalletForm.jsx) a new wallet, the client makes an API request to [`/createNewWallet`](/functions/API.js#L112-L123) endpoint with wallet info in params.
        - The server [creates a challenge for the creation of a new wallet](/functions/circle-functions.js#L42-L54).
    * Response Handling:
        - The server responds with the necessary information.
        - The client [executes the challenge](/src/App.jsx#L69-L104).

2. **Wallet Transfers:**

    - On submitting the [transactionForm](/src/components/Main.jsx#L82-L125), the client makes an API request to [`/sendTransaction`](/functions/API.js#L133-L143) endpoint with form information in params.
    - The server [creates a challange for outbound transfer](/functions/circle-functions.js#L78-L95) function and responds with response data.
    - The client [executes the challange](/src/App.jsx#L69-L104) and alerts the user.

3. **Wallet Recovery:**
    - The client makes request to [`/restorePin`](/functions/API.js#L102-L111) endpoint on click of `Restore Pin` Button.
    - The server [creates a challange for pin restoration](/functions/circle-functions.js#L118-L125) and responds with the data.
    - The client executes the challange.
    - This process also gets triggered when "Forgot Pin?" button is clicked while executing any challange.

### More Features:
1. **Signin With Google:**
    * Allows the users to seamlessly login and signup with their google accounts. 
    * It also enables us to send email notifications to users.
    * **Flow:**
        - After [acquiring signin credential](/src/App.jsx#L27-L42), the client make an API request to [`/validateSignin`](/functions/API.js#L3-L23) end point.
        - Server decodes the JWT and acquires email id, then creates user using the same.
        - Server then tries to [fetch the user](/functions/circle-functions.js#L6-L11). If the user account is created on circle, it sends a response with user data and client displays the data to user.
        - If the user account is unavailable, circle responds with error code `404`. Server catches it and [creates a new user on circle](/functions/circle-functions.js#L12-L17), then sends the data to client.
        - If the user account is created but not initialised, the client, instead of showing user data, shows the [form for user initialisation](/src/components/initialiseWalletAndPin.jsx). After submitting the form, the [user is initialised](/#userInitialisation) and server responds with user data.

2. **Email Notifications:**
    * App sends email notifications to the user Id to welcome the user aboard and keep them informed about completed transactions and wallet creations on their account.
    * Server first verifies the `post` request sent by [Circle Webooks](https://console.circle.com/webhooks) and if successful, [sends an email](/functions/validateSignatureAndNotify.js) using predefined templates.

3. **Listing Transactions:**
    * Users can see records for transactions on their wallets and visit blockchain explorer for more details.
    * They also can filter the transactions before a date and navigate between pages.
    * Upon request to [`/fetchTransactions`](/functions/API.js#L58-L91) API endpoint, server [makes a request to circle](/functions/circle-functions.js#L97-L107) and returns 10 transactions per page.
    * The client then show the data to user.

4. **Change Pin:**
    * Users can change their by clicking `Settings` > `Change Pin` making an API call to [`/changePin`](/functions/API.js#L92-L101) endpoint.
    * The server then [`creates a challange for pin update`](/functions/API.js#L109-L116) and responds with the data. Client executes the challange.

* **`Note:`** On each API request, the client also sends the user credential, which is verified everytime to make sure the request is legitimate.
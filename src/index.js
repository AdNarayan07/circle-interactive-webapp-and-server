import React from 'react';
import {createRoot} from 'react-dom/client'
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
<GoogleOAuthProvider clientId="<700574123464-a7hdticirleue0efbt0astfpk2bvtqu6.apps.googleusercontent.com>">
    <React.StrictMode>
        <img src='./bg.jpg'/>
        <App />
    </React.StrictMode>
</GoogleOAuthProvider>
);
/*
 *
 *  * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  * SPDX-License-Identifier: MIT-0
 *
 */

import React from "react";
import ReactDOM from "react-dom";
import './index.css';
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";

import Amplify from "aws-amplify";
import {Auth} from "aws-amplify";

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import defaultTheme from "./theme/defaultTheme";

import App from "./App";
import config from "./config";

window.LOG_LEVEL='INFO';
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REACT_APP_REGION,
    userPoolId: config.cognito.REACT_APP_USER_POOL_ID,
    identityPoolId: config.cognito.REACT_APP_IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.REACT_APP_APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REACT_APP_REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.REACT_APP_IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "api",
        endpoint: config.apiGateway.REACT_APP_BASE_API,
        region: config.cognito.REACT_APP_REGION,
      },
      {
        name: "api-data-plane",
        endpoint: config.apiGateway.REACT_APP_DATA_PLANE_API,
        region: config.cognito.REACT_APP_REGION,
      }
    ]
  }
});

ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Router>
          <App theme={defaultTheme}/>
        </Router>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

registerServiceWorker();

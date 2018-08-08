import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'typeface-roboto'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import lightGreen from '@material-ui/core/colors/lightGreen'
import lightBlue from '@material-ui/core/colors/lightBlue'

const theme = createMuiTheme({
  palette: {
    secondary: {
      light: lightGreen[500],
      main: lightGreen[800],
      dark: lightGreen[900]
    },
    primary: {
      light: lightBlue[400],
      main: lightBlue[600],
      dark: lightBlue[800]
    }
  },
  appBar: {
    height: 50
  }
})

const UI = () => (
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>
)

ReactDOM.render(<UI />, document.getElementById('root'))
registerServiceWorker()

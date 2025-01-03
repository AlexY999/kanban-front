import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux';
import App from './App'
import './index.css'
import { store } from './redux/store';


ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </ChakraProvider>,
)

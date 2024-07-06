import React from 'react';
import { SnackbarProvider } from 'notistack';
import GlobalProvider from '../../Contexts/GlobalProvider';
import { Provider } from 'react-redux';
import store from '../../store';


export default function Context({ children }) {
    return (
        <SnackbarProvider dense autoHideDuration={1000} maxSnack={1} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}>
            <Provider store={store}>
                <GlobalProvider>
                    {children}
                </GlobalProvider>
            </Provider>
        </SnackbarProvider>
    );
}

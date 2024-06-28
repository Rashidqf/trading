import React, { createContext, useContext } from 'react';
import useGlobal2 from '../Hooks/useGlobal2';
import useAcount from '../Hooks/useAcount';
import useOrder from '../Hooks/useOrder';
import useHistory from '../Hooks/useHistory';
import useTrade from '../Hooks/useTrade';

const globalCtx = createContext();
const GlobalProvider = ({ children }) => {
    return (
        <globalCtx.Provider value={{ ...useGlobal2(), ...useAcount(), ...useOrder(), ...useHistory(), ...useTrade() }}>
            {children}
        </globalCtx.Provider>
    );
};
export default GlobalProvider;
export const useGlobalCtx = () => useContext(globalCtx);
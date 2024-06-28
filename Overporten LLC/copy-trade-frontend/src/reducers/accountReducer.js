import { createSlice } from "@reduxjs/toolkit";

const accoutSlice = createSlice({
    name: 'account',
    initialState: {
        accounts: [],
        loading: true,
        pagination: {
            page: 1,
            total: 0,
        },
    },
    reducers: {
        setValue: (state, action) => {
            state[action.payload.target] = action.payload.value;
        },
        addAcount: (state, action) => {
            state.accounts = [action.payload, ...state.accounts];
        },
        updateAcount: (state, action) => {
            state.accounts = state.accounts.map((a) => a.id === action.payload.id ? { ...a, ...action.payload } : a);
        },
        deleteAcount: (state, action) => {
            state.accounts = state.accounts.filter((a) => a.id !== action.payload.id);
        },
    },
});

export const {
    setValue,
    addAcount,
    updateAcount,
    deleteAcount,
} = accoutSlice.actions;
export default accoutSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const invoiceModalDataSlice = createSlice({
  name: 'invoiceModalData',
  initialState: {
    developers: [],
    bankAccounts: [],
    isDevelopersLoaded: false,
    isBankAccountsLoaded: false,
  },
  reducers: {
    setDevelopers: (state, action) => {
      state.developers = action.payload;
      state.isDevelopersLoaded = true;
    },
    setBankAccounts: (state, action) => {
      state.bankAccounts = action.payload;
      state.isBankAccountsLoaded = true;
    },
  },
});

export const { setDevelopers, setBankAccounts } = invoiceModalDataSlice.actions;
export default invoiceModalDataSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 1,
  pageSize: 50,
  totalLeads: 0,
  totalPages: 0,
  doc: [],
  activeTab: "All",
  searchQuery: "",
  loading: false,
  error: null,
  formValues: {},
  isFormReset: false,
  tagValues: [],
  displayAdvSearchData: false,
  displaySearchData: false,
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    updateLeads: (state, action) => {
      const { currentPage, leads, pageSize } = action.payload;
      state.currentPage = currentPage;
      state.doc = leads?.doc ?? [];
      state.totalLeads = leads?.totalLeads || 0;
      state.totalPages = leads?.totalPages || 0;
      state.pageSize = pageSize;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.currentPage = 1;
      state.displayAdvSearchData = false;
      state.displaySearchData = false;
      state.searchQuery = "";
      state.formValues = {};
      state.tagValues = [];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      state.displayAdvSearchData = false;
      state.displaySearchData = !!action.payload;
    },
    setFormValues: (state, action) => {
      state.formValues = action.payload;
      state.currentPage = 1;
      state.displayAdvSearchData = Object.keys(action.payload).length > 0;
      state.displaySearchData = false;
    },
    setIsFormReset: (state, action) => {
      state.isFormReset = action.payload;
    },
    setGetTagValues: (state, action) => {
      state.tagValues = action.payload;
    },
    clearAdvancedSearch: (state) => {
      state.displayAdvSearchData = false;
      state.displaySearchData = false;
      state.searchQuery = "";
      state.formValues = {};
      state.tagValues = [];
      state.isFormReset = true;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  updateLeads,
  setLoading,
  setError,
  setActiveTab,
  setSearchQuery,
  setFormValues,
  setIsFormReset,
  setGetTagValues,
  clearAdvancedSearch,
  setPageSize,
  setCurrentPage,
} = leadsSlice.actions;

export default leadsSlice.reducer;
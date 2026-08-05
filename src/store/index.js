import { configureStore } from "@reduxjs/toolkit";
import { useDispatch , useSelector } from "react-redux";
import authSliceReducer from './Authslice.js';
import notificationSliceReducer from './notificationSlice.js';

const reduxStore = configureStore({
    reducer: {
        auth: authSliceReducer,
        notifications: notificationSliceReducer,
    },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export default reduxStore;
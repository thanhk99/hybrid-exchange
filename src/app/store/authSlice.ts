import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { KEY_CONFIG } from "../lib/constants"

interface AuthState {
    isAuthenticated: boolean
    accessToken: string | null
    refreshToken: string | null
    userId: string | null
    email: string | null
    deviceInfo?: string | null
}

const initialState : AuthState = {
    isAuthenticated: false,
    accessToken:  null,
    refreshToken:  null,
    userId:  null,
    email:  null,
    deviceInfo:  null,
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action : PayloadAction<{
            accessToken : string
            refreshToken : string
            userId : string
            email : string
            deviceInfo : string
        }>) => {
           state.isAuthenticated = true
           state.accessToken = action.payload.accessToken
           state.refreshToken = action.payload.refreshToken
           state.userId = action.payload.userId
           state.email = action.payload.email
           state.deviceInfo = action.payload.deviceInfo
        },
        logout : (state) =>{
            state.isAuthenticated = false
            state.accessToken = null
            state.refreshToken = null
            state.userId = null
            state.email = null
            state.deviceInfo = null
            localStorage.clear();
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
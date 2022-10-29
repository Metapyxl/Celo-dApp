import { Auth } from 'aws-amplify';
import * as React from "react";
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useReducer } from 'react';

const fakeProfileHash = 'E13d044cBE13d044cBE13d044cB';

const fetchUser = createAsyncThunk(
    'users/fetchUser',
    async (cognitoId: string) => {
        await setTimeout(() => {
            console.log(cognitoId)

        }, 1000)
        return {
            userName: "Jonathan Cannon",
            profileHash: fakeProfileHash
        }
    }
)

const fetchBlockchainProfile = createAsyncThunk(
    'users/fetchBlockchainProfile',
    async (cognitoId: string) => {


    }
)

export const initialState = {
    userName: null,
    profileHash: null,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // setProfile: (state, action) => {
        //     state.profile = action.payload
        // },
        // decrement: (state) => {
        //     state.value -= 1
        // },
        // incrementByAmount: (state, action) => {
        //     state.value += action.payload
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            const { payload: { userName, profileHash } } = action
            state.userName = userName
            state.profileHash = profileHash
        })
    },
})

export const appReducer = appSlice.reducer

const AppStateContainer = ({ children }) => {
    const [{ profileHash }, dispatch] = useReducer(appReducer, initialState)
    // fetch user profile from getUser endpoint- includes profile address

    React.useEffect(() => {
        Auth.currentAuthenticatedUser().then(({ username }) => {

            return dispatch(fetchUser(username));
        });
    }, [])

    // fetch profile card from blockchain using profile address
    React.useEffect(() => {

        // ...

    }, [profileHash])

    return children
}

export default AppStateContainer

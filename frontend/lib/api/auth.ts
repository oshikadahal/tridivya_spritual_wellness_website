//backend api call only

import axios from "./axios"; // important axios instanceeeeeeeeeeeeeeee
import {API} from "./endpoints";

export const registerUser = async (registerDate: any) => {
    try{
        const response = await axios.post (
            API.AUTH.REGISTER, // backend route path
            registerDate   // data to send to bakend 
        );

        return response.data; // response ko body
        //what is returned from backend -controller

    } catch (err: Error | any) {
        //if 4xx or 5xx counts as  error
        throw new Error 
        (
            err.response ?.data?.message // from backend
            || err.message // general error message 
            || "Registration failed"
        );

    }
}

export const loginUser = async (loginData: any) => {
    try {
        const response = await axios.post(
            API.AUTH.LOGIN, // backend route path
            loginData   // data to send to backend 
        );

        return response.data; // response from backend
        //includes success, message, data (user), and token

    } catch (err: Error | any) {
        //if 4xx or 5xx counts as error
        throw new Error(
            err.response?.data?.message // from backend
            || err.message // general error message 
            || "Login failed"
        );
    }
}


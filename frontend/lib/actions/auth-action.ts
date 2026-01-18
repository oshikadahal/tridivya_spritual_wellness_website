// server sid processing 
"use server"
import {registerUser, loginUser} from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";

export const handleRegister = async (formData : any) => {
    try{
        // Split full name into firstName and lastName
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // if only one name, use it for both
        
        // Generate username from email (remove @domain)
        const username = formData.email.split('@')[0];

        // Create payload matching backend expectations
        const payload = {
            firstName,
            lastName,
            username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        };

        //handle data from component form
        const result = await registerUser(payload);
        //handle how to send back to component
        if (result.success) {
            return {
            success : true,
            message : "Registration successful",
            data : result.data 
            }
        };
        return {
            success : false,
            message :result.message || "Registration failed"
        }


    } catch (err : Error | any) {
        return {
            success : false,
            message : err.message || "Registration failed"
        }
    }
    
}


        // Create payload matching backend expectations
export const handleLogin = async (formData: any) => {
    try{
        // handle data from component form
        const result = await loginUser(formData); // change
        // handle how to send data back to component
        if(result.success){
            await setAuthToken(result.token) 
            await setUserData(result.data)
            
            return {
                success: true, 
                message: "Login successful", // change
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Login failed" // change
        }
    }catch(err: Error | any){
        return {
            success: false, message: err.message || "Login failed" // change
        }
    }
}

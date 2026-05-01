import  api  from '../api/client'
import type { LoginResponse, registerResponse } from '../types/auth';

type Register={
    first_name: string
    last_name: string
    email: string
    phone_no: string      
    password: string
}
export const LoginService= async(
    credentials: { email: string; password: string })
    : Promise<LoginResponse>=>{
    const { data } =await api.post("/auth/login",credentials)
    return data
}

export const RegisterService= async(
    credentials: Register)
    : Promise<registerResponse>=>{
    const { data } =await api.post("/auth/register",credentials)
    return data
}


import  api  from '../api/client'
import type { LoginResponse } from '../types/auth';


export const LoginService= async(
    credentials: { email: string; password: string })
    : Promise<LoginResponse>=>{
    const { data } =await api.post("/auth/login",credentials)
    return data
}

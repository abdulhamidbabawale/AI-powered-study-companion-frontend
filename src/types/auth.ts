
export type LoginResponse={
    "message": string,
    "access_token": string,
    "token_type": string,
    "user": {
            "first_name": string,
            "last_name": string,
            "email": string,
            // "role": user["role"],
    }
}

export type registerResponse={
    "message": string,
    "user_id":string
}
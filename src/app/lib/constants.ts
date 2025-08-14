//API Constants 
export const API_CONFIG = {
    BASE_URL : "http://127.0.0.1:8000",
    TIMEOUT: 10000,
    ENDPOINTS: { 
        AUTH: {
            LOGIN: '/api/v1/auth/login',
            SIGNUP : '/api/v1/auth/signup',
            LOGOUT :'/api/v1/auth/logout',
            REFRESH : '/api/v1/auth/refresh',
            EXISTEMAIL: '/api/v1/auth/existEmail'
        },
        USER: {
            GETPROFILE:'/api/v1/user/getProfile'
        }
    }
}

export const KEY_CONFIG = {
    ACCESS_TOKEN_KEY:"a_tk",
    REFRESH_TOKEN_KEY: "r_tk",
    DEVICE_ID_KEY: "d_id"
}
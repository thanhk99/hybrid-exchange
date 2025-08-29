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
            GETPROFILE: '/api/v1/user/getProfile',
            UPDATE_PROFILE: '/api/v1/user/updateProfile',
            UPDATE_AVATAR: '/api/v1/user/avatar',
            SECURITY: '/api/v1/user/security',
            SETTINGS: '/api/v1/user/settings',
            CHANGE_PASSWORD: '/api/v1/user/change-password',
            TOGGLE_2FA: '/api/v1/user/2fa',
            DEVICES: '/api/v1/user/devices'
        },
        FUNDING: {
            TOTAL: '/api/v1/funding/total',
            HISTORY: '/api/v1/funding/history',
            CHART_DATA: '/api/v1/funding/chart'
        },
        BALANCE: {
            OVERVIEW: '/api/v1/balance/overview',
            ASSETS: '/api/v1/balance/assets'
        },
        NOTIFICATIONS: {
            LIST: '/api/v1/notifications',
            MARK_READ: '/api/v1/notifications/read'
        },
        MARKET: {
            PRICES: '/api/v1/market/prices',
            TRENDING: '/api/v1/market/trending'
        }
    }
}

export const KEY_CONFIG = {
    ACCESS_TOKEN_KEY:"a_tk",
    REFRESH_TOKEN_KEY: "r_tk",
    DEVICE_ID_KEY: "d_id"
}
// backend route paths

export const API= {
    AUTH:{
        REGISTER:"/api/auth/register",
        LOGIN :"/api/auth/login",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: "/api/auth/reset-password",
        UPDATE_PROFILE: (id: string) => `/api/auth/${id}`,
        GET_PROFILE: "/api/auth/profile",
        UPDATE_PROFILE_PICTURE: "/api/auth/update-profile",
        DELETE_PROFILE_PICTURE: "/api/auth/profile/picture",
    },
    ADMIN: {
        USERS: "/api/admin/users",
        USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
        CREATE_USER: "/api/admin/users",
        UPDATE_USER: (id: string) => `/api/admin/users/${id}`,
        DELETE_USER: (id: string) => `/api/admin/users/${id}`,
        GET_PROFILE: "/api/admin/profile",
        UPDATE_PROFILE: "/api/admin/profile",
        DELETE_PROFILE_PICTURE: "/api/admin/profile/picture",
    }
}
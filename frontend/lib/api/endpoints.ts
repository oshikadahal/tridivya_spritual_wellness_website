// backend route paths

export const API= {
    AUTH:{
        REGISTER:"/api/auth/register",
        LOGIN :"/api/auth/login",
        UPDATE_PROFILE: (id: string) => `/api/auth/${id}`,
    },
    ADMIN: {
        USERS: "/api/admin/users",
        USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
        CREATE_USER: "/api/admin/users",
        UPDATE_USER: (id: string) => `/api/admin/users/${id}`,
        DELETE_USER: (id: string) => `/api/admin/users/${id}`,
    }
}
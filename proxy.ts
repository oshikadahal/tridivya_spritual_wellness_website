import {NextRequest, NextResponse} from 'next/server';
import {getUserData,getAuthToken} from "./frontend/lib/cookie";
const publicPaths = ["/login","/register","/forgot-password"];
const adminPaths =["/admin"];
const userPaths = ["/user"];

export async function proxy (req: NextRequest) {
    //logic here 

    const {pathname } = req.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData () : null;

    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
    const isUserPath = userPaths.some(path => pathname.startsWith(path));
    
    // Redirect to login if not authenticated and trying to access protected routes
    if (!user && !isPublicPath) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If user is authenticated
    if (user && token) {
        // Check admin routes - only admin role can access
        if (isAdminPath && user.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        
        // User routes - any authenticated user can access
        if (isUserPath) {
            return NextResponse.next();
        }
        
        // If logged in user tries to access login/register, redirect to home
        if (isPublicPath && (pathname === "/login" || pathname === "/register")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next(); // continue granted 
}

export const config = {
    matcher : [
        //list of path to apply rules/proxy 
        "/admin/:path*",
        "/user/:path*",
        "/login",
        "/register"
    ],
}
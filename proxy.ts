import {NextRequest, NextResponse} from 'next/server';
import {getUserData,getAuthToken} from "./frontend/lib/cookie";
const publicPaths = ["/login","/register","/forgot-password"];

export async function proxy (req: NextRequest) {
    //logic here 

    const {pathname } = req.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData () : null;

    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    if (!isPublicPath && !user) {
        if(pathname == "/login") {
            return NextResponse.redirect (new URL ("/",req.url));
        }

        return NextResponse.next(); // continue granted 

    } 
    
}
export const config = {
    matcher : [
        //list of path to apply rules/proxy 
        "/admin/:path*",
        "/login",
        "/register"
    ],
}
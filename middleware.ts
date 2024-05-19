import { JwtPayload, jwtDecode } from "jwt-decode";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {

    let token = request.cookies.get("token")?.value;

    let decodedToken: JwtPayload | null = null;

    if (token && token != "null") {
        decodedToken = jwtDecode(token);
    }

    function validateToken(tokenExp: number | undefined) {
        if (!tokenExp) {
            return false;
        } else {
            return (Date.now() / 1000) < tokenExp;
        }
    }

    const isTokenValid: boolean | null = decodedToken
        && decodedToken !== null
        && validateToken(decodedToken?.exp)

    if ((request.nextUrl.pathname == '/' || request.nextUrl.pathname.startsWith("/dashboard"))
        && !isTokenValid
    ) {
        request.cookies.delete("usuario");
        const response = NextResponse.redirect(new URL("/login", request.nextUrl.origin));
        response.cookies.delete("usuario");

        return response;
    }

    if ((request.nextUrl.pathname == '/' || request.nextUrl.pathname.includes("/login"))
        && isTokenValid) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
    }

    
    if (request.nextUrl.pathname == '/dashboard' && decodedToken) {
        // Search for user farms. Use fetch
        const usuarioValue = request.cookies.get("usuario")?.value;
        const idUsuario= usuarioValue ? JSON.parse(usuarioValue).idUsuario : undefined;
        if (!idUsuario) return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
        
        
        // Hardcoded value for players
        if (usuarioValue && JSON.parse(usuarioValue).userTypeID === 2) 
            return NextResponse.redirect(new URL("/onboarding", request.nextUrl.origin));
        
        const data = await fetch(
            `http://localhost:3000/api/Partida?Filters=IdUsuario%3D%3D${idUsuario}`,
            { headers: { Authorization: `Bearer ${token}` }, })
            .then((res) => res.json())
            .catch((err) => console.log(err));

        if (data && data.length===0) {
            return NextResponse.redirect(new URL("/onboarding", request.nextUrl.origin));
        }        
    }
}
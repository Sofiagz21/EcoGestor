import { JwtPayload, jwtDecode } from "jwt-decode";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    let decodedToken: JwtPayload | null = null;

    if (token && token !== "null") {
        try {
            decodedToken = jwtDecode<JwtPayload>(token);
        } catch (error) {
            console.error("Invalid token", error);
            decodedToken = null;
        }
    }

    function validateToken(tokenExp: number | undefined): boolean {
        if (!tokenExp) {
            return false;
        }
        return (Date.now() / 1000) < tokenExp;
    }

    const isTokenValid = decodedToken && validateToken(decodedToken.exp);

    if ((request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith("/dashboard")) && !isTokenValid) {
        const response = NextResponse.redirect(new URL("/login", request.nextUrl.origin));
        response.cookies.delete("usuario");
        return response;
    }

    if ((request.nextUrl.pathname === '/' || request.nextUrl.pathname.includes("/login")) && isTokenValid) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
    }

    if (request.nextUrl.pathname === '/dashboard' && decodedToken) {
        const usuarioValue = request.cookies.get("usuario")?.value;
        const idUsuario = usuarioValue ? JSON.parse(usuarioValue).idUsuario : undefined;
        const userTypeID = usuarioValue ? JSON.parse(usuarioValue).idRol : undefined;

        if (!idUsuario) {
            return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
        }

        // Redirigir al onboarding si el usuario es del tipo jugador (userTypeID === 2)
        if (userTypeID === 2) {
            return NextResponse.redirect(new URL("/onboarding", request.nextUrl.origin));
        }

        // Verificar si el usuario tiene partidas
        try {
            const response = await fetch(
                `http://localhost:3000/api/Partida?Filters=IdUsuario%3D%3D${idUsuario}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();

            if (data.length === 0) {
                return NextResponse.redirect(new URL("/onboarding", request.nextUrl.origin));
            }
        } catch (error) {
            console.error("Error fetching user games:", error);
            return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
        }
    }

    // If the user is an admin, redirect to the dashboard
    if (request.nextUrl.pathname === '/login' && isTokenValid && decodedToken) {
        const usuarioValue = request.cookies.get("usuario")?.value;
        const userTypeID = usuarioValue ? JSON.parse(usuarioValue).idRolUsuario : undefined;

        if (userTypeID === 1) { // Assuming 1 is the admin user type ID
            return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
        }
    }

    // If no conditions are met, continue to the requested page
    return NextResponse.next();
}

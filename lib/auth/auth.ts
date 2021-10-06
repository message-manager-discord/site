import fetch from "unfetch";
export const logout = async () => 
    fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`, {credentials: "include"})

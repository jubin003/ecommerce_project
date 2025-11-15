export const logout= ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userID");
    window.location.href="/"
}
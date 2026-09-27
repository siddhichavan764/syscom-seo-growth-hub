const token =
    localStorage.getItem("syscom_token");

if (!token) {
    window.location.href = "login.html";
}
function logout() {

    localStorage.removeItem("syscom_token");
    localStorage.removeItem("syscom_user");

    window.location.href =
        "login.html";


}
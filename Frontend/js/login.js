document
    .getElementById("loginForm")
    .addEventListener("submit", async(event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("loginMessage");

        message.textContent = "Logging in...";

        try {

            const result = await apiRequest(
                "/auth/login", {
                    method: "POST",

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            localStorage.setItem(
                "syscom_token",
                result.token
            );

            localStorage.setItem(
                "syscom_user",
                JSON.stringify(result.user)
            );

            message.textContent =
                "Login successful. Redirecting...";

            window.location.href =
                "dashboard.html";

        } catch (error) {

            message.textContent =
                error.message;

        }
    });
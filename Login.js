document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email && password) {
            // Handle login logic here
            alert(`Email: ${email}\nPassword: ${password}`);
        } else {
            alert("Please fill in both fields.");
        }
    });
});

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const errorMsg = document.getElementById("errorMsg");
    if (!username) {
        errorMsg.style.display = "block";
        return;
    }
    errorMsg.style.display = "none";
    // Save username in localStorage (simple client-side auth)
    localStorage.setItem("chatUsername", username);
    // Redirect to rooms page
    window.location.href = "rooms.html";
});

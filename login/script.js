document.addEventListener("DOMContentLoaded", function () {
  const signUpButton = document.getElementById("signUpButton");
  const signInButton = document.getElementById("signInButton");
  const signInForm = document.getElementById("signIn");
  const signUpForm = document.getElementById("signup");

  signUpButton.addEventListener("click", () => toggleForm("signup"));
  signInButton.addEventListener("click", () => toggleForm("signin"));

  function toggleForm(formType) {
    signInForm.style.display = formType === "signup" ? "none" : "block";
    signUpForm.style.display = formType === "signup" ? "block" : "none";
  }

  function showAlert(message, formId, type = "success") {
    const form = document.getElementById(formId);
    if (!form) return;

    const existingAlert = form.querySelector(".alert-message");
    if (existingAlert) existingAlert.remove();

    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-message ${type}`;
    alertDiv.textContent = message;
    Object.assign(alertDiv.style, {
      marginTop: "15px",
      padding: "10px",
      borderRadius: "5px",
      textAlign: "center",
      fontSize: "14px",
      color: "#fff",
      backgroundColor: type === "success" ? "rgb(125,125,235)" : "#dc3545",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    });

    const submitButton = form.querySelector(".btn");
    submitButton.insertAdjacentElement("afterend", alertDiv);

    setTimeout(() => alertDiv.remove(), 3000);
  }

  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const API_URL = "https://testing-ecommerce-3fbd.onrender.com/api/auth";

  // Basic client-side validation
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return password.length >= 8; // Example: minimum 8 characters
  }

  // SIGNUP
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fName = document.getElementById("fName").value.trim();
    const lName = document.getElementById("lName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;

    if (!validateEmail(email)) {
      showAlert("Please enter a valid email address.", "signupForm", "error");
      return;
    }
    if (!validatePassword(password)) {
      showAlert("Password must be at least 8 characters long.", "signupForm", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fName, lName, email, phone, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        showAlert("Registration successful! Please log in.", "signupForm");
        setTimeout(() => {
          signupForm.reset();
          toggleForm("signin");
        }, 2000);
      } else {
        showAlert(data.message || "Registration failed. Please try again.", "signupForm", "error");
      }
    } catch (error) {
      showAlert("Network error. Please try again later.", "signupForm", "error");
    }
  });

  // LOGIN
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value.trim();
    const password = document.getElementById("passwordLogin").value;

    if (!validateEmail(email)) {
      showAlert("Please enter a valid email address.", "loginForm", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        showAlert("Login successful!", "loginForm");
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            email,
            profilePhoto: data.profilePhoto || "https://via.placeholder.com/40",
            token: data.token, // Assuming backend returns a token
          })
        );
        setTimeout(() => {
          window.location.href = "../home.html";
        }, 2000);
      } else {
        showAlert(data.message || "Invalid email or password.", "loginForm", "error");
      }
    } catch (error) {
      showAlert("Network error. Please try again later.", "loginForm", "error");
    }
  });
});
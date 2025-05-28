document.addEventListener("DOMContentLoaded", function () {
  const signUpButton = document.getElementById("signUpButton");
  const signInButton = document.getElementById("signInButton");
  const signInForm = document.getElementById("signIn");
  const signUpForm = document.getElementById("signup");

  signUpButton.addEventListener("click", () => toggleForm("signup"));
  signInButton.addEventListener("click", () => toggleForm("signin"));

  function toggleForm(formType) {
    if (formType === "signup") {
      signInForm.style.display = "none";
      signUpForm.style.display = "block";
    } else {
      signUpForm.style.display = "none";
      signInForm.style.display = "block";
    }
  }

  // Function to create and display an alert message below the submit button
  function showAlert(message, formId, type = "success") {
    const form = document.getElementById(formId);
    if (!form) return;

    // Remove any existing alert
    const existingAlert = form.querySelector(".alert-message");
    if (existingAlert) existingAlert.remove();

    // Create alert element
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-message ${type}`;
    alertDiv.textContent = message;
    alertDiv.style.marginTop = "15px";
    alertDiv.style.padding = "10px";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.textAlign = "center";
    alertDiv.style.fontSize = "14px";
    alertDiv.style.color = "#fff";
    alertDiv.style.backgroundColor = type === "success" ? "rgb(125,125,235)" : "#dc3545";
    alertDiv.style.backdropFilter = "blur(8px)";
    alertDiv.style.border = "1px solid rgba(255, 255, 255, 0.2)";

    // Insert alert after the submit button
    const submitButton = form.querySelector(".btn");
    submitButton.insertAdjacentElement("afterend", alertDiv);

    // Remove alert after 3 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const API_URL = "http://192.168.0.106:5000/api/auth";

  // SIGNUP
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fName = document.getElementById("fName").value;
    const lName = document.getElementById("lName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fName, lName, email, phone, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        showAlert("Registration successful! Please log in.", "signupForm");
        signupForm.reset(); // Clear fields
        setTimeout(() => {
          toggleForm("signin"); // Switch to login form
        }, 2000);
      } else {
        showAlert(data.message || "Registration failed. Please try again.", "signupForm", "error");
      }
    } catch (error) {
      showAlert("An error occurred. Please try again.", "signupForm", "error");
    }
  });

  // LOGIN
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        showAlert("Login successful!", "loginForm");
        // Save user info to localStorage
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            email,
            profilePhoto: "https://via.placeholder.com/40", // Default profile photo
          })
        );
        // Redirect to home page after a short delay to show the alert
        setTimeout(() => {
          window.location.href = "../home.html";
        }, 2000);
      } else {
        showAlert(data.message || "Login failed. Please check your credentials.", "loginForm", "error");
      }
    } catch (error) {
      showAlert("An error occurred. Please try again.", "loginForm", "error");
    }
  });
});
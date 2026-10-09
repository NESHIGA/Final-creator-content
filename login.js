const API_BASE = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://localhost:5000"
  : "";
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value.trim();

  const message =
    document.getElementById("loginMessage");


  // Clear old message
  message.textContent = "";
  message.className = "message";


  // ============================
  // BASIC VALIDATION
  // ============================

  if (!email) {

    message.textContent =
      "Please enter your email address.";

    message.classList.add("error");

    return;
  }


  if (!password) {

    message.textContent =
      "Please enter your password.";

    message.classList.add("error");

    return;
  }


  // ============================
  // LOGIN REQUEST
  // ============================

  try {

    const response = await fetch(
      API_BASE + "/api/auth/login",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          email: email,

          password: password

        })

      }
    );


    // Convert response to JSON
    const result =
      await response.json();


    // Console for debugging
    console.log(
      "Login response:",
      result
    );


    // ============================
    // BACKEND ERROR
    // ============================

    if (!response.ok) {

      const errorMessage =
        result?.data?.message ||
        result?.message ||
        "Invalid email or password.";

      throw new Error(errorMessage);

    }


    // ============================
    // GET TOKEN
    // ============================

    /*
      Supports both:

      {
        data: {
          token: "...",
          user: {}
        }
      }

      AND

      {
        token: "...",
        user: {}
      }
    */

    const token =
      result?.data?.token ||
      result?.token;


    const user =
      result?.data?.user ||
      result?.user;


    // ============================
    // TOKEN CHECK
    // ============================

    if (!token) {

      throw new Error(
        "Login successful, but authentication token was not received."
      );

    }


    // ============================
    // SAVE TOKEN
    // ============================

    localStorage.setItem(
      "token",
      token
    );


    // ============================
    // SAVE USER
    // ============================

    if (user) {

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

    }


    // ============================
    // SUCCESS MESSAGE
    // ============================

    message.textContent =
      "Login successful! Welcome to CreatorOS AI.";

    message.classList.add("success");


    // ============================
    // REDIRECT TO INDEX
    // ============================

    // location.replace() does NOT keep login.html in history,
    // so the browser can never come back to it after login.
    setTimeout(function () {

      window.location.replace(
        "index.html"
      );

    }, 700);


  } catch (error) {

    // ============================
    // ERROR HANDLING
    // ============================

    console.error(
      "Login Error:",
      error
    );


    message.textContent =
      error.message ||
      "Something went wrong. Please try again.";

    message.classList.add("error");

  }

});
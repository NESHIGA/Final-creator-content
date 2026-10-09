const API_BASE = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://localhost:5000"
  : "";
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  const message =
    document.getElementById("registerMessage");


  message.textContent = "";
  message.className = "message";


  // Check password
  if (password !== confirmPassword) {

    message.textContent = "Passwords do not match.";
    message.classList.add("error");

    return;
  }


  // Password length
  if (password.length < 6) {

    message.textContent =
      "Password must be at least 6 characters.";

    message.classList.add("error");

    return;
  }


  try {

    const response = await fetch(
      API_BASE + "/api/auth/register",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          name: name,
          email: email,
          password: password

        })

      }
    );


    const result = await response.json();


    if (!response.ok) {

      throw new Error(
        result.message || "Registration failed"
      );

    }


    message.textContent =
      "Account created successfully!";

    message.classList.add("success");


    // Go to login page
    setTimeout(() => {

      window.location.href = "login.html";

    }, 1000);


  } catch (error) {

    console.error(
      "Registration Error:",
      error
    );


    message.textContent =
      error.message ||
      "Something went wrong.";

    message.classList.add("error");

  }

});
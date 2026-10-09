const API_BASE = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://localhost:5000"
  : "";
const registerForm = document.getElementById("registerForm");
const roleField = document.getElementById("role");
const creatorFields = document.getElementById("creatorFields");
const startingPriceField = document.getElementById("creatorStartingPrice");

function updateCreatorFields() {
  const isCreator = roleField.value === "creator";
  creatorFields.hidden = !isCreator;
  startingPriceField.required = isCreator;
}

roleField.addEventListener("change", updateCreatorFields);
updateCreatorFields();

registerForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

    const role =
      document.getElementById("role").value;

    const creatorProfile = role === "creator" ? {
      location: document.getElementById("creatorLocation").value.trim(),
      specialization: document.getElementById("creatorSpecialization").value,
      contentTypes: document.getElementById("creatorContentTypes").value,
      tools: document.getElementById("creatorTools").value,
      startingPrice: document.getElementById("creatorStartingPrice").value
    } : undefined;

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
          password: password,
          role: role,
          creatorProfile: creatorProfile

        })

      }
    );


    const result = await response.json().catch(() => null);

    if (!result) {
      throw new Error("The server returned an invalid response. Please try again later.");
    }


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
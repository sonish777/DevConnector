import "@babel/polyfill";
import axios from "axios";

$(document).on("click", "#login", async (e) => {
  e.preventDefault();
  $("#eemail").text("");
  $("#epassword").text("");
  var email = $("#email").val();
  var password = $("#password").val();
  if (email === "") {
    $("#eemail").text("Please provide your email");
  }
  if (password === "") {
    return $("#epassword").text("Please provide your password");
  }
  $("#login").val("Logging in...");

  const data = {
    email: email,
    password: password,
  };

  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/users/login",
      data: data,
    });

    if (result.data.status === "success") {
      window.setTimeout(() => {
        window.location.assign("/dashboard");
      }, 1500);
    }
  } catch (error) {
    alert(error.response.data.message);
    $("#login").val("Login");
  }
});

$(document).on("click", "#logout", async (e) => {
  e.preventDefault();
  $("#logouttext").text("Logging out");
  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/users/logout",
    });

    console.log(result);
    if (result.data.status === "success") {
      window.setTimeout(() => {
        alert("Logged out successfully");
        window.location.assign("/");
      }, 1500);
    }
  } catch (error) {
    console.log(error.response);
    $("#logouttext").text("Logout");
  }
});

$(document).on("click", "#register", async (e) => {
  e.preventDefault();
  $("#ename").text("");
  $("#eemail").text("");
  $("#epassword").text("");
  $("#ecpassword").text("");
  var name = $("#name").val();
  var email = $("#email").val();
  var password = $("#password").val();
  var confirmPassword = $("#confirmPassword").val();
  if (name === "") $("#ename").text("* Enter your name");
  if (email === "") $("#eemail").text("* Enter your email");
  if (password === "") $("#epassword").text("* Enter your password");
  if (confirmPassword === "")
    return $("#ecpassword").text("* Please confirm your password");

  if (password !== confirmPassword) {
    return $("#ecpassword").text("Passwords do not match");
  }

  $("#register").val("REGISTERING...");
  const user = {
    name,
    email,
    password,
  };

  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/users/",
      data: user,
    });

    if (result.data.status === "success") {
      window.setTimeout(() => {
        window.location.assign("/create-profile");
      }, 1500);
    }
  } catch (error) {
    alert(error.response.data.message);
    $("#register").val("Register");
  }
});

$(document).on("click", "#createProfile", async (e) => {
  e.preventDefault();
  var status = $("#status").val();
  var company = $("#company").val();
  var website = $("#website").val();
  var location = $("#location").val();
  var skills = $("#skills").val();
  var githubUsername = $("#githubUsername").val();
  var bio = $("#bio").val();
  var twitter = $("#twitter").val();
  var facebook = $("#facebook").val();
  var linkedin = $("#linkedin").val();
  var instagram = $("#instagram").val();
  var youtube = $("#youtube").val();

  const body = {
    status,
    company,
    website,
    location,
    skills,
    githubUsername,
    bio,
    twitter,
    facebook,
    linkedin,
    instagram,
    youtube,
  };
  $("#createProfile").val("UPDATING...");
  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/profiles",
      data: body,
    });

    if (result.data.status === "success") {
      console.log(result);
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    console.log(error);
    $("#createProfile").val("Submit");
    alert(error.response.data.message);
  }
});

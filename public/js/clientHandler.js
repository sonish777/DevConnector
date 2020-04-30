import "@babel/polyfill";
import axios from "axios";
import { showAlertBox } from "./alert.js";

$(document).on("click", "#ham-icon", () => {
  $("#backdrop").fadeIn();
  $(".side-nav").animate({
    width: "toggle",
  });
});

$(document).on("click", "#backdrop", () => {
  $("#backdrop").fadeOut();
  $(".side-nav").animate({
    width: "toggle",
  });
});

$(document).on("click", "#login", async (e) => {
  // showAlertBox("Hello", "fail");
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
      showAlertBox("Logged in successfully", "success");
      window.setTimeout(() => {
        window.location.assign("/dashboard");
      }, 1600);
    }
  } catch (error) {
    // alert(error.response.data.message);
    showAlertBox(error.response.data.message, "fail");
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
      showAlertBox("Logged out successfully", "success");
      window.setTimeout(() => {
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
      showAlertBox("Registered successfully", "success");
      window.setTimeout(() => {
        window.location.assign("/create-profile");
      }, 1500);
    }
  } catch (error) {
    // alert(error.response.data.message);
    showAlertBox(error.resonse.data.message, "fail");
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
  var image = $("#avatarFile").prop("files")[0];

  const form = new FormData();
  form.append("image", image);
  form.append("status", status);
  form.append("company", company);
  form.append("website", website);
  form.append("location", location);
  form.append("skills", skills);
  form.append("githubUsername", githubUsername);
  form.append("bio", bio);
  form.append("twitter", twitter);
  form.append("facebook", facebook);
  form.append("linkedin", linkedin);
  form.append("youtube", youtube);
  form.append("instagram", instagram);

  console.log(form);

  $("#createProfile").val("UPDATING...");
  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/profiles",
      data: form,
    });

    if (result.data.status === "success") {
      // console.log(result);
      showAlertBox("Profile updated successfully", "success");
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    console.log(error);
    $("#createProfile").val("Submit");
    // alert(error.response.data.message);
    showAlertBox(error.response.data.message, "fail");
  }
});

$(document).on("click", "#addEducation", async (e) => {
  e.preventDefault();
  const school = $("#school").val();
  const degree = $("#degree").val();
  const fieldOfStudy = $("#fieldOfStudy").val();
  const from = $("#fromDate").val();
  const to = $("#toDate").val();
  const description = $("#description").val();
  const current = $("#current").is(":checked");

  $("#addEducation").val("SUBMITTING...");
  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/profiles/education",
      data: {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        description,
        current,
      },
    });

    if (result.data.status === "success") {
      showAlertBox("Education credentials added", "success");
      window.setTimeout(() => {
        // alert("Your education credentials has been addeds successfully !");
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    // alert(error.response.data.message);
    showAlertBox(error.response.data.message, "fail");
    $("#addEducation").val("Submit");
  }
});

$(document).on("click", "#deleteEducation", async function (e) {
  e.preventDefault();
  const eduId = $(this).data("eduid");
  const school = $(this).data("title");
  if (confirm(`Are you sure you want to delete '${school}' ?`)) {
    $("#deleteEducation").text("REMOVING...");
    try {
      const result = await axios({
        method: "DELETE",
        url: `http://localhost:8000/api/profiles/education/${eduId}`,
      });
      if (result.data.status === "success") {
        // alert("Education credential deleted");
        showAlertBox("Education credentials deleted", "success");
        window.setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      // alert("Something went wrong ! Please try again");
      showAlertBox("Something went wrong", "fail");
      $("#deleteEducation").text("Delete");
    }
  }
});

$(document).on("click", "#giveLike", async function (e) {
  e.preventDefault();
  const postId = $(this).data("postid");
  if (!postId) {
    return showAlertBox("Something went wrong", "fail");
  }
  try {
    const result = await axios({
      method: "PATCH",
      url: `http://localhost:8000/api/posts/${postId}/like`,
    });
    if (result.data.status === "success") {
      showAlertBox("Post liked", "success");
      let likes = $(this).find("#likeCount").text();
      likes = likes * 1 + 1;
      $(this).find("#likeCount").text(likes);
      $(this).find("#likeIcon").css("color", "blue");
    }
  } catch (error) {
    // alert(error.response.data.message);
    showAlertBox(error.response.data.message, "fail");
  }
});

$(document).on("click", "#removeLike", async function (e) {
  e.preventDefault();
  const postId = $(this).data("postid");
  // console.log($(this).prev().find("#likeCount").text());
  if (!postId) {
    // return alert("Something went wrong");
    return showAlertBox("Something went wrong", "fail");
  }
  try {
    const result = await axios({
      method: "PATCH",
      url: `http://localhost:8000/api/posts/${postId}/unlike`,
    });
    if (result.data.status === "success") {
      showAlertBox("Post unliked", "success");
      // console.log("HELLO");
      // console.log($(this).prev());

      let likes = $(this).prev().prev().find("#likeCount").text();
      likes = likes * 1 - 1;
      $(this).prev().prev().find("#likeCount").text(likes);
      $(this).prev().prev().find("#likeIcon").css("color", "");
    }
  } catch (error) {
    // alert(error.response.data.message);
    showAlertBox(error.response.data.message, "fail");
  }
});

$(document).on("mouseover", "#giveLike", function () {
  // alert();
  // console.log($(this).next());
  // console.log($(this).closest(".like-lists"));
  $(this).next().fadeIn();
});

$(document).on("mouseleave", "#giveLike", () => {
  $(".like-lists").fadeOut();
});

$(document).on("click", "#post", async (e) => {
  e.preventDefault();
  let text = $("#postText").val();
  text = text.trim();
  if (text.length <= 0) {
    // return alert("Post cannot be empty !");
    return showAlertBox("Post cannot be empty", "fail");
  }
  const data = {
    text,
  };
  try {
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api/posts",
      data,
    });
    if (result.data.status === "success") {
      // alert("Post created");
      showAlertBox("Post created", "success");
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    // alert(error.response.data.message);
    showAlertBox("Something went wrong", "fail");
  }
});

$(document).on("click", "#removePost", async function (e) {
  const postId = $(this).data("postid");
  if (!postId) {
    return showAlertBox("Something went wrong", "fail");
  }

  if (confirm("Are you sure you want to remove the post ?")) {
    try {
      const result = await axios({
        method: "DELETE",
        url: `http://localhost:8000/api/posts/${postId}`,
      });
      // console.log(result);
      if (result.status === 204) {
        // alert("Post removed");
        showAlertBox("Post removed", "success");
        window.setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      // alert(error.response.data.message);
      showAlertBox(error.response.data.message, "fail");
    }
  }
});

$(document).on("click", "#postComment", async function (e) {
  e.preventDefault();
  let commentText = $("#commentText").val();
  commentText = commentText.trim();
  if (commentText.length <= 0) {
    return showAlertBox("Comment cannot be empty", "fail");
  }
  const postId = $(this).data("postid");
  const data = {
    text: commentText,
  };
  try {
    const result = await axios({
      method: "PATCH",
      url: `http://localhost:8000/api/posts/${postId}/comment`,
      data,
    });
    if (result.data.status === "success") {
      // alert("Comment posted");
      showAlertBox("Comment posted", "success");
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    // console.log(error.response.data.message);
    showAlertBox(error.response.data.message, "fail");
  }
});

$(document).on("click", "#removeComment", async function (e) {
  const commmentId = $(this).data("commentid");
  const postId = $(this).data("postid");

  if (!commmentId || !postId) {
    return showAlertBox("Something went wrong", "fail");
  }
  try {
    const result = await axios({
      method: "DELETE",
      url: `http://localhost:8000/api/posts/${postId}/comment/${commmentId}`,
    });
    if (result.data.status === "success") {
      // alert("Comment removed");
      showAlertBox("Commment removed", "success");
      window.setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    // alert(error.response.data.message);
    showAlertBox(error.response.data.message, "fail");
  }
});

// $(document).on("keypress", "postText", (e) => {
//   alert();
// });

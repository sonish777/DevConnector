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
      window.setTimeout(() => {
        alert("Your education credentials has been addeds successfully !");
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    alert(error.response.data.message);
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
        alert("Education credential deleted");
        window.location.reload();
      }
    } catch (error) {
      alert("Something went wrong ! Please try again");
      $("#deleteEducation").text("Delete");
    }
  }
});

$(document).on("click", "#giveLike", async function (e) {
  e.preventDefault();
  const postId = $(this).data("postid");
  if (!postId) {
    return alert("Something went wrong");
  }
  try {
    const result = await axios({
      method: "PATCH",
      url: `http://localhost:8000/api/posts/${postId}/like`,
    });
    if (result.data.status === "success") {
      let likes = $(this).find("#likeCount").text();
      likes = likes * 1 + 1;
      $(this).find("#likeCount").text(likes);
      $(this).find("#likeIcon").css("color", "blue");
    }
  } catch (error) {
    alert(error.response.data.message);
  }
});

$(document).on("click", "#removeLike", async function (e) {
  e.preventDefault();
  const postId = $(this).data("postid");
  // console.log($(this).prev().find("#likeCount").text());
  if (!postId) {
    return alert("Something went wrong");
  }
  try {
    const result = await axios({
      method: "PATCH",
      url: `http://localhost:8000/api/posts/${postId}/unlike`,
    });
    if (result.data.status === "success") {
      let likes = $(this).prev().find("#likeCount").text();
      likes = likes * 1 - 1;
      $(this).prev().find("#likeCount").text(likes);
      $(this).prev().find("#likeIcon").css("color", "");
    }
  } catch (error) {
    alert(error.response.data.message);
  }
});

$(document).on("click", "#post", async (e) => {
  e.preventDefault();
  let text = $("#postText").val();
  text = text.trim();
  if (text.length <= 0) {
    return alert("Post cannot be empty !");
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
      alert("Post created");
      window.location.reload();
    }
  } catch (error) {
    alert(error.response.data.message);
  }
});

$(document).on("click", "#removePost", async function (e) {
  const postId = $(this).data("postid");
  if (!postId) {
    return alert("Something went wrong");
  }

  if (confirm("Are you sure you want to remove the post ?")) {
    try {
      const result = await axios({
        method: "DELETE",
        url: `http://localhost:8000/api/posts/${postId}`,
      });
      // console.log(result);
      if (result.status === 204) {
        alert("Post removed");
        window.location.reload();
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }
});

$(document).on("click", "#postComment", async function (e) {
  e.preventDefault();
  let commentText = $("#commentText").val();
  commentText = commentText.trim();
  if (commentText.length <= 0) {
    return alert("Comment cannot be empty");
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
      alert("Comment posted");
      window.location.reload();
    }
  } catch (error) {
    console.log(error.response.data.message);
  }
});

$(document).on("click", "#removeComment", async function (e) {
  const commmentId = $(this).data("commentid");
  const postId = $(this).data("postid");

  if (!commmentId || !postId) {
    return alert("Something went wrong");
  }
  try {
    const result = await axios({
      method: "DELETE",
      url: `http://localhost:8000/api/posts/${postId}/comment/${commmentId}`,
    });
    if (result.data.status === "success") {
      alert("Comment removed");
      window.location.reload();
    }
  } catch (error) {
    alert(error.response.data.message);
  }
});

// $(document).on("keypress", "postText", (e) => {
//   alert();
// });

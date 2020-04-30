export const showAlertBox = (message, type) => {
  // console.log("INSIDE ALERT");
  $(".alert-box").text(message);
  if (type === "success") {
    $(".alert-box")
      .removeClass("alert-box-danger")
      .addClass("alert-box-success");
  } else if (type === "fail") {
    $(".alert-box")
      .removeClass("alert-box-success")
      .addClass("alert-box-danger");
  }

  $(".alert-box").fadeIn();
  window.setTimeout(() => {
    $(".alert-box").fadeOut(1600);
  }, 1000);
};

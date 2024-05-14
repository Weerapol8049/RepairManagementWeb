//import { API_LOGIN } from "./flagment/api.js";

function init() {
  const loginButton = document.getElementById("login-form-submit");
  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    login();
  });
}
window.onload = init;

function login() {
  const loginErrorMsg = document.getElementById("login-error-msg");

  const username = document.getElementById("username-field").value;
  const password = document.getElementById("password-field").value;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  //const id = 5637147577;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://starmark.work/RepairManagementAPI/api/login");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      UserName: username,
      Password: password,
      RecId: id
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      //console.log(objects);
      if (objects.Status == "OK") {
        if (objects.Permission == true) {
          localStorage.setItem("RecId", id);
          window.location.href = "index.html";
        } else location.href = "accessPage.html";
      } else {
        loginErrorMsg.style.opacity = 1;
      }
    }
  };
}

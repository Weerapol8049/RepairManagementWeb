//import { API_LOGIN } from "./flagment/api.js";

function init() {
	
	const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");
	const parm = id.split('-');
	
	const recid = parm[0];
	const level = parm[1];
	const _username = parm[2];
	
	
	const decodeUsername = atob(_username);
	
	document.getElementById("username-field").value = decodeUsername;
	
    const loginButton = document.getElementById("login-form-submit");
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        login(recid, level);
    });
  }
  window.onload = init;

  function login(recid, level){
    const loginErrorMsg = document.getElementById("login-error-msg");
	
    const username = document.getElementById("username-field").value;
    const password = document.getElementById("password-field").value;
    //const id = 5637147577;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://starmark.work/RepairManagementAPI/api/login");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
        UserName: username,
        Password: password,
        RecId: recid,
		Level: level
        })
    );
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);

        if (objects.Status == "OK") {
            if (objects.Permission == true) {
				localStorage.setItem("RecId", recid);
				localStorage.setItem("Level", level);
				window.location.href = "index.html";
            } else {
				location.href = "accessPage.html";
			}
        } else {
            loginErrorMsg.style.opacity = 1;
        }
        }
    };

  }


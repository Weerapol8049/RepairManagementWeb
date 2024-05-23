import { API_REPAIR, API_ACCEPT, API_APPROVE, API_SEND_APPROVE, API_REJECT } from "./flagment/api.js";

function init() {
  // const queryString = window.location.search;

  // const urlParams = new URLSearchParams(queryString);
  // const id = urlParams.get("id");

  const id = localStorage.getItem("RecId");
  const level = localStorage.getItem("Level");
  const recId = document.getElementById("lblRecId").innerHTML;

  load(id, level);

  var btnApprove = document.getElementById("btnApproved");
  btnApprove.addEventListener("click", function () {
    accept(recId);
  });
  
  var btnApproveLv4 = document.getElementById("btnApprovedLV4");
  btnApproveLv4.addEventListener("click", function () {
    approveLv4(recId);
  });
  
  var btnReject = document.getElementById("btnReject");
  btnReject.addEventListener("click", function () {
    reject(recId);
  });

  var btnClose = document.getElementById("btnClose");
  btnClose.addEventListener("click", function () {
    close();
  });
}
window.onload = init;

async function load(id, level) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", API_REPAIR + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(this.responseText);
      //console.log(response);

      for (let row of response) {
        let recid = row["RecId"].toString();
        let division = row["Division"];
        let branch = row["Branch"];
        let department = row["DepartmentName"];
        let issue = row["IssueName"];
        let saction = row["SactionName"];
        let text = row["Text"];
        let repairId = row["RepairId"];
        let centerDate = row["TransDate"].toLocaleString();
        let response = row["ResponsibleName"];
        let custName = row["CustName"];
        let bono = row["BoNo"];
        let salesId = row["SalesId"];
        let approved = row["Approved"];
        let approvedDate = row["ApprovedDate"].toLocaleString();
		let accepted = row["Accepted"];
		let rejected = row["Rejected"];
        let solution = row["Solution"];

        const dCenter = new Date(centerDate);
        var centerDateObject = moment(dCenter).format("DD/MM/YYYY");
        var _centerDate = centerDateObject.toString();

        const dApproved = new Date(approvedDate);
        var approvedDateObject = moment(dApproved).format("DD/MM/YYYY");
        var _approvedDate = approvedDateObject.toString();

        document.getElementById("lblRecId").innerHTML = recid;
        document.getElementById("spanDivision").innerHTML = division;
        document.getElementById("lblDepartment").innerHTML = department;
        document.getElementById("lblIssue").innerHTML = issue;
        document.getElementById("lblSaction").innerHTML = saction;
        document.getElementById("lblText").innerHTML = text;
        document.getElementById("hRepairId").innerHTML =
          " ใบแจ้งซ่อม " + repairId;
        document.getElementById("spanDateCenter").innerHTML =
          " วันที่ " + _centerDate;
        //document.getElementById("").innerHTML = response;
        document.getElementById("lblCustomer").innerHTML = custName;
        document.getElementById("lblBoNo").innerHTML = bono;
        document.getElementById("lblSO").innerHTML = salesId;
        document.getElementById("lblBranch").innerHTML = branch;
	
		if (level == "Accept"){
			visibleControl(level, accepted, rejected, solution);
		}
		else if (level == "Approve") {
			visibleControl(level, approved, rejected, solution);
		}
		
      /*   if (accepted == 1 ) {
			if (approved == 1)
				visibleApprove(solution, level);
			else
				visibleAccept(solution, level);
        } */

      }
    }
  };
}

function visibleControl(level, value, reject, solution){
	
	if (level == "Accept" && value == 1){
		document.getElementById("btnApproved").hidden = true;
		document.getElementById("btnReject").hidden = true;
		document.getElementById("btnClose").hidden = false;
		
		document.getElementById("spanStatus").hidden = false;
		document.getElementById("spanStatus").innerHTML = "ยอมรับ";
			
		document.getElementById("rowSolution").hidden = false;
		document.getElementById("txtSolution").value = solution;
	}
	else if (level == "Accept" && value == 0)
	{
		document.getElementById("btnApproved").hidden = false;
		document.getElementById("btnReject").hidden = false;
		document.getElementById("btnClose").hidden = true;
		
		document.getElementById("spanStatus").hidden = true;
		
		document.getElementById("rowSolution").hidden = true;
		
		if (reject == 1){
			document.getElementById("btnApproved").hidden = true;
			document.getElementById("btnReject").hidden = true;
			document.getElementById("btnClose").hidden = false;
		
			document.getElementById("spanStatusReject").hidden = false;
			document.getElementById("spanStatusReject").innerHTML = "ปฏิเสธ";
			
			document.getElementById("rowSolution").hidden = false;
			document.getElementById("lblSolution").innerHTML = "สาเหตุที่ปฏิเสธ";
			document.getElementById("txtSolution").value = solution;
		}

	}
	else if (level == "Approve" && value == 1)
	{
		document.getElementById("btnApprovedLV4").hidden = true;
		document.getElementById("btnApproved").hidden = true;
		document.getElementById("btnReject").hidden = true;
		document.getElementById("btnClose").hidden = false;
		
		document.getElementById("spanStatus").hidden = false;
		document.getElementById("spanStatus").innerHTML = "อนุมัติ";
		
		document.getElementById("rowSolution").hidden = false;
		document.getElementById("txtSolution").value = solution;
	}
	else if (level == "Approve" && value == 0)
	{
		document.getElementById("btnApprovedLV4").hidden = false;
		document.getElementById("btnApproved").hidden = true;
		document.getElementById("btnReject").hidden = false;
		document.getElementById("btnClose").hidden = true;
		
		document.getElementById("spanStatus").hidden = false;
		document.getElementById("spanStatus").innerHTML = "ยอมรับ";
		
		document.getElementById("rowSolution").hidden = false;
		document.getElementById("txtSolution").value = solution;
	}
	
	

}

function accept(recid) {

  Swal.fire({
    title: "ยืนยันยอมรับ",
    //text: "You won't be able to revert this!",
    icon: "info",
    html: `
    <div class="row col-md-12">
        <div class="col-sm-2">
            <label class="control-label font-weight-bold">วิธีแก้ไข</label>
        </div>
        <div class="col">
            <input type="text" class="form-control" id="solution">
        </div>
    </div>
      `,
    //input: "text",
    showCancelButton: true,
    confirmButtonColor: "#41BD23",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "ยอมรับ",
    cancelButtonText: "ยกเลิก"
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(document.getElementById("solution").value);
      let solution = document.getElementById("solution").value;

      const xhttp = new XMLHttpRequest();
      xhttp.open("POST", API_ACCEPT);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
        JSON.stringify({
          RecId: recid,
          Solution: solution
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          
          const objects = JSON.parse(this.responseText);
          if (objects.Status == "OK") {
            Swal.fire("ยอมรับสำเร็จ", "บันทึกข้อมูลแก้ไข", "success").then(
              () => {
                visibleAccept(solution);
				sendToApprove(recid);
              }
            );
          } else {
            Swal.fire({
              icon: "error",
              title: objects.Status
              //text: 'Something went wrong!',
            });
          }
        }
      };
    }
  });
}

function reject(recid) {

  Swal.fire({
    title: "ยืนยันปฏิเสธ",
    //text: "You won't be able to revert this!",
    icon: "info",
    html: `
    <div class="row col-md-12">
        <div class="col-sm-2">
            <label class="control-label font-weight-bold">สาเหตุ</label>
        </div>
        <div class="col">
            <input type="text" class="form-control" id="solution">
        </div>
    </div>
      `,
    //input: "text",
    showCancelButton: true,
    confirmButtonColor: "red",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "ปฏิเสธ",
    cancelButtonText: "ยกเลิก"
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(document.getElementById("solution").value);
      let solution = document.getElementById("solution").value;

      const xhttp = new XMLHttpRequest();
      xhttp.open("POST", API_REJECT);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
        JSON.stringify({
          RecId: recid,
          Solution: solution
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          
          const objects = JSON.parse(this.responseText);
          if (objects.Status == "OK") {
            Swal.fire("ปฏิเสธสำเร็จ", "บันทึกข้อมูลการปฏิเสธ", "success").then(
              () => {
				//visibleControl();
				//sendToApprove(recid);
              }
            );
          } else {
            Swal.fire({
              icon: "error",
              title: objects.Status
              //text: 'Something went wrong!',
            });
          }
        }
      };
    }
  });
}

function sendToApprove(recId){
	const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_SEND_APPROVE);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      RecId: recId
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      if (objects.Status == "OK") {
		  console.log(objects.Message);
      } else {
      }
    }
  };
}

function approveLv4(recid) {

  Swal.fire({
    title: "ยืนยันการอนุมัติ",
    //text: "You won't be able to revert this!",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#41BD23",
    cancelButtonColor: "#CFCECE",
    confirmButtonText: "อนุมัติ",
    cancelButtonText: "ยกเลิก"
  }).then((result) => {
    if (result.isConfirmed) {
      const xhttp = new XMLHttpRequest();
      xhttp.open("POST", API_APPROVE);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
        JSON.stringify({
          RecId: recid
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          
          const objects = JSON.parse(this.responseText);
          if (objects.Status == "OK") {
            Swal.fire("อนุมัติสำเร็จ", "บันทึกข้อมูลแก้ไข", "success").then(
              () => {
                visibleApprove("", 4);
              }
            );
          } else {
            Swal.fire({
              icon: "error",
              title: objects.Status
              //text: 'Something went wrong!',
            });
          }
        }
      };
    }
  });
}

function approved(recId) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", API_ACCEPT);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      RecId: recId
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      if (objects.Status == "OK") {
		  console.log(objects.Message);
      } else {
      }
    }
  };
}

//not use
function visibleAccept(solution, level) {
	console.log(level);
	document.getElementById("btnApproved").hidden = true;
	document.getElementById("btnReject").hidden = true;
	document.getElementById("btnClose").hidden = false;
	
	document.getElementById("rowSolution").hidden = false;
	document.getElementById("txtSolution").value = solution;
	document.getElementById("spanStatus").hidden = false;
}
//not use
function visibleApprove(solution, level) {
	console.log(level);
    if (level == "Approve")
	{
		document.getElementById("btnApprovedLV4").hidden = true;
		document.getElementById("btnApproved").hidden = true;
		document.getElementById("btnReject").hidden = true;
		document.getElementById("btnClose").hidden = false;
	}
	else {
		document.getElementById("btnApprovedLV4").hidden = false;
		document.getElementById("btnApproved").hidden = true;
		document.getElementById("btnReject").hidden = false;
		document.getElementById("btnClose").hidden = true;
	} 
	
	document.getElementById("rowSolution").hidden = false;
	document.getElementById("txtSolution").value = solution;
	document.getElementById("spanStatus").hidden = false;
	document.getElementById("spanStatus").innerHTML = "อนุมัติ";
}

function close() {
  window.open("", "_parent", "");
  window.close();
}

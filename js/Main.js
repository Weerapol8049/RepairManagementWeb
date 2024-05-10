import { API_REPAIR, API_UPDATE } from "./flagment/api.js";

function init() {
  const queryString = window.location.search;
  //console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  //console.log(id);

  load(id);

  var btnApprove = document.getElementById("btnApproved");
  btnApprove.addEventListener("click", function () {
    approve(document.getElementById("lblRecId").innerHTML);
  });

  var btnClose = document.getElementById("btnClose");
  btnClose.addEventListener("click", function () {
    close();
  });
}
window.onload = init;

async function load(id) {
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

        if (approved == 1) {
          visible(solution);
        }
      }
    }
  };
}

function approve(recid) {
  console.log("Approve");
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
      xhttp.open("POST", API_UPDATE);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(
        JSON.stringify({
          RecId: recid,
          Solution: solution
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          //console.log(this.responseText);
          var trHTML = "";
          const objects = JSON.parse(this.responseText);
          if (objects.Status == "OK") {
            Swal.fire("ยอมรับสำเร็จ", "บันทึกข้อมูลแก้ไข", "success").then(
              () => {
                visible(solution);
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

function visible(solution) {
  document.getElementById("btnApproved").hidden = true;
  document.getElementById("btnReject").hidden = true;
  document.getElementById("btnClose").hidden = false;
  document.getElementById("rowSolution").hidden = false;
  document.getElementById("txtSolution").value = solution;
}

function close() {
  window.open("", "_parent", "");
  window.close();
}

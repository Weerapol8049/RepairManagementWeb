function init() {
  var btnClose = document.getElementById("btnClose");
  btnClose.addEventListener("click", function () {
    close();
  });
}
window.onload = init;

function close() {
  window.open("", "_parent", "");
  window.close();
}

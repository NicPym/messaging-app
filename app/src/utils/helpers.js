function getInnerHtml(id) {
  return document.getElementById(id).innerHTML;
}

function setInnerHtml(id, html) {
  document.getElementById(id).innerHTML = html;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

function prependHtml(id, html) {
  document.getElementById(id).innerHTML =
    html + document.getElementById(id).innerHTML;
}

function appendHtml(id, html) {
  document.getElementById(id).innerHTML =
    document.getElementById(id).innerHTML + html;
}

function setOnClick(id, callback) {
  document.getElementById(id).onclick = callback;
}

function formatDate(date) {
  let d = new Date();
  let ret = date.toISOString().slice(0, 10);
  ret += " " + d.getHours() + ":" + d.getMinutes();
  return ret;
}

module.exports = {
  getInnerHtml,
  setInnerHtml,
  setCookie,
  getCookie,
  deleteAllCookies,
  deleteCookie,
  prependHtml,
  appendHtml,
  setOnClick,
  formatDate,
};

import conversationService from "./conversationService";

export function getInnerHtml(id) {
  return document.getElementById(id).innerHTML;
}

export function setInnerHtml(id, html) {
  document.getElementById(id).innerHTML = html;
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let c of ca) {
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function deleteAllCookies() {
  let cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export function prependHtml(id, html) {
  document.getElementById(id).innerHTML =
    html + document.getElementById(id).innerHTML;
}

export function appendHtml(id, html) {
  document.getElementById(id).innerHTML =
    document.getElementById(id).innerHTML + html;
}

export function setOnClick(id, callback) {
  document.getElementById(id).onclick = callback;
}

export function formatDate(date) {
  let d = new Date();
  let ret = date.toISOString().slice(0, 10);
  ret += " " + d.getHours() + ":" + d.getMinutes();
  return ret;
}

export function login() {
  document.location.href = "/auth/login";
}

export function logout() {
  deleteAllCookies();
  document.location.href = "/";
}

export function sendMessage() {
  let input = document.getElementById("messageToSend");
  conversationService.sendMessage(
    input.value
  );
  input.value = "";
}

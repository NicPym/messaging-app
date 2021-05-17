import conversationService from "./conversationService";

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
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"; // omg lol
  }
}

export function setInnerHtml(id, html) {
  let element = document.getElementById(id);
  if (element) {
    element.innerHTML = html;
  }
}

export function prependHtml(id, html) {
  let element = document.getElementById(id);
  if (element && html) {
    element.innerHTML = html + element.innerHTML;
  }
}

export function appendHtml(id, html) {
  let element = document.getElementById(id);
  if (element && html) {
    element.innerHTML = element.innerHTML + html;
  }
}

export function setOnClick(id, callback) {
  let element = document.getElementById(id);
  if (element && callback) {
    element.onclick = callback;
  }
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
  if (input) {
    conversationService.sendMessage(
      input.value
    );
    input.value = "";
  }
}

export function getToken() {
  return getCookie("token");
}

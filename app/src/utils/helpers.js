import conversationService from "./conversationService";
import dateFormat from "dateformat";

export const getCookie = (cname) => {
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
};

export const deleteAllCookies = () => {
  let cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"; // omg lol
  }
};

export const setInnerHtml = (id, html) => {
  let element = document.getElementById(id);
  if (element) {
    element.innerHTML = html;
  }
};

export const prependHtml = (id, html) => {
  let element = document.getElementById(id);
  if (element && html) {
    element.innerHTML = html + element.innerHTML;
  }
};

export const appendHtml = (id, html) => {
  let element = document.getElementById(id);
  if (element && html) {
    element.innerHTML = element.innerHTML + html;
  }
};

export const setOnClick = (id, callback) => {
  let element = document.getElementById(id);
  if (element && callback) {
    element.onclick = callback;
  }
};

export const setOnInput = (id, callback) => {
  let element = document.getElementById(id);
  if (element && callback) {
    element.oninput = callback;
  }
};

export const formatDate = (date) => {
  return dateFormat(date, "yyyy-mm-dd HH:MM");
};

export const login = () => {
  document.location.href = "/auth/login";
};

export const logout = () => {
  deleteAllCookies();
  document.location.href = "/";
};

export const imgLoad = (url) => {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.responseType = "blob";
    request.onload = () => {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(
          Error(
            "Image didn't load successfully; error code:" + request.statusText
          )
        );
      }
    };
    request.onerror = () => {
      reject(Error("There was a network error."));
    };
    request.send();
  });
};

export const sendMessage = () => {
  let input = document.getElementById("messageToSend");
  if (input) {
    conversationService.sendMessage(input.value);
    input.value = "";
  }
};

export const getToken = () => {
  return getCookie("token");
};

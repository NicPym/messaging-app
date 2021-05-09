function getInnerHtml(id) {
    return document.getElementById(id).innerHTML
}

function setInnerHtml(id, html) {
    document.getElementById(id).innerHTML = html;
}

function setCookie(cname, object) {
    object = JSON.stringify(object)
    window.localStorage.setItem(cname, object)
}

function getCookie(cname) {
    return JSON.parse(window.localStorage.getItem(cname));
}

function deleteCookie(cname) {
    window.localStorage.removeItem(cname);
}

function prependHtml(id, html) {
    document.getElementById(id).innerHTML = html + document.getElementById(id).innerHTML;
}

function appendHtml(id, html) {
    document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + html;
}

function setOnClick(id, callback) {
    document.getElementById(id).onclick = callback;
}

function formatDate(date) {
    let d = new Date()
    let ret = date.toISOString().slice(0, 10)
    ret += " "+ d.getHours()+":"+d.getMinutes()
    return ret
}

module.exports = {
    getInnerHtml,
    setInnerHtml,
    setCookie,
    getCookie,
    deleteCookie,
    prependHtml,
    appendHtml,
    setOnClick,
    formatDate
};
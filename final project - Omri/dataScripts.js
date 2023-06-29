document.addEventListener('DOMContentLoaded', checkIfAdmin)
document.getElementById('submitSearchUsers').addEventListener('click', displayUsers)
function displayUsers(){
    let prefix = document.getElementById('searchUsers').value;
    if (!prefix) prefix = 'display all'
    fetch(`/displayusers/${prefix}`, {method: 'GET'})
        .then(res => res.json())
        .then((value) => {
            if (value === 'fail'){
                document.location.href = '/home.html';
                window.alert("no permissions")
                return;
            }
            document.getElementById('aaa').innerHTML = "";
            stringifyUsers(value);
        })

}
function stringifyUsers(data){
    for (let user in data) {
        document.getElementById('aaa').innerHTML += `<tr id=\"${user}\"></tr>`
        document.getElementById(user).innerHTML += `<td>${user}</td>\n` +
            `                <td>${data[user]['pass']}</td>\n` +
            `                <td>${data[user]['mail']}</td>\n` +
            `                <td>${stringifyObj(data[user]['cartItems'])}</td>\n` +
            `                <td>${stringifyObj(data[user]['buyHistory'])}</td>\n` +
            `                <td>${stringifyArray(data[user]['logHistory'])}</td>`
    }
}
function stringifyArray(arr){
    let str = ""
    for (let key of arr){
        str += key + '<br>'
    }
    return str;
}
function stringifyObj(obj){
    let str = "";
    for (let key in obj){
        str += key +":   " + obj[key] + '<br>'
    }
    return str
}
async function checkIfAdmin(){
    if (!document.cookie) document.location.href = '/home.html'
    await fetch('/checkifadmin', {method: 'GET'})
        .then(res => res.json())
        .then(value => {

            if (value !== 'admin') {
                document.location.href = '/home.html';
                window.alert('no permissions');
            }
        })
}

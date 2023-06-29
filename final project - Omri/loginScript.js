document.addEventListener('DOMContentLoaded', checkCookies);
document.getElementById('login').addEventListener('click', ()=> {
    let user = document.getElementById('username').value;
    let pass = document.getElementById('password').value;
    let rememberMe = document.getElementById('rememberMe').checked;
    let obj = {'user': user, 'pass': pass, 'rememberMe': rememberMe};
    fetch(`/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
        .then(res=> res.json())
        .then((value) => {
            if (value === "success") {
                //window.alert(res.cookie);
                document.location.href = 'home.html';
            } else window.alert("password or username are incorrect");
        })
});
function checkCookies(){
    fetch('/checkcookies', {method: 'GET'})
        .then(res => res.json())
        .then((value) =>{
            if (value) document.location.href = '/home.html'
        })
    }
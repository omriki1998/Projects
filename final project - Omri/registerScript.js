document.getElementById('register').addEventListener('click', ()=>{
    let user = document.getElementById('username').value;
    let pass = document.getElementById('password').value;
    let confirmPass = document.getElementById('confirmPass').value;
    let mail = document.getElementById('mail').value;
    let obj = {'user': user, 'pass': pass, 'confirmPass': confirmPass, 'mail': mail};
    fetch(`/register`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then((value)=>{
            if (value === "success") document.location.href = 'login.html';
            else window.alert(value);
        })
    })

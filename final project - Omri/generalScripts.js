/*log out*/
document.getElementById('out').addEventListener('click', ()=>{
    fetch('/logout', {method: 'POST'})
        .then(res => res.json())
        .then(value => {
            if (value === "success") document.location.href = 'login.html';
            else window.alert("error")
        })
})
/*actions taken on page load*/
document.addEventListener('DOMContentLoaded', loadPage)
async function loadPage() {
    if (document.cookie) {
        await fetch('/checkifadmin', {method: 'GET'})
            .then(res => res.json())
            .then (value => {
                if (value !== 'admin') document.querySelector('#dataNavBar').remove();
            })
        document.querySelector('#registerNavBar').remove();
        document.querySelector('#in').remove();
    }
    else {
        document.querySelector('#out').remove();
        document.querySelector('#dataNavBar').remove();
    }
}


/*proceed to checkout*/
document.addEventListener('DOMContentLoaded', displaySummary)
document.getElementById('completeCheckOut').addEventListener('click', completeCheckOut)
document.getElementById('close').addEventListener('click', hidePopUp)
/*display cart summary and checks cookies*/
function displaySummary(){
    fetch('/checkcookies', {method: 'GET'})
        .then(res => res.json())
        .then((value) => {
            if (!value) {
                window.alert("Must Log In");
                document.location.href = '/login.html';
                return;
            }
        }).then(()=> {
        fetch('/proceedtocheckout', {method: 'GET'})
            .then(res => res.json())
            .then((value) => {
                document.getElementById('totalPrice').innerHTML += value.toString();
                document.getElementById('finalPrice').innerHTML += value.toString();
            })
    })
}
/*hides the pop up after close*/
function hidePopUp(){
    document.getElementById('modal-container').classList.remove('show');
    document.querySelector('.loader').classList.add('show');
    setInterval(()=>{
        document.location.href = 'home.html';
    }, 3000)
}
/*complete the check out and go back to home page*/
function completeCheckOut(){
    fetch('/completecheckout', {method: 'GET'})
        .then(res => res.json())
        .then((value)=>{
            if (value === 'success') {
                document.getElementById('modal-container').classList.add('show');
            }
            else window.alert(value)
        })
}
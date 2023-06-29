document.getElementById('send').addEventListener('click', addMess)

function addMess() {
    let message = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        content: document.getElementById('messContent').value
    }
    if (!message['name'] || !message['email'] || !message['content']) {
        window.alert('at least one detail is missing');
        return;
    }
    fetch('/contactus', {method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)})
        .then(res => res.json())
        .then((value)=>{
            window.alert(value);
            document.location.href = '/home.html';
        })
    alert("Message has been sent!");
}

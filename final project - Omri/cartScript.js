/*load cart*/
let Xs = [];
document.addEventListener('DOMContentLoaded', displayCart)
function displayCart() {
    fetch('/displaycart', {method: 'GET'})
        .then(res => res.json())
        .then((cart) => {
            if (cart === 'must log in') {
                window.alert(cart);
                document.location.href = 'login.html'
                return;
            }
            document.getElementById('aaa').innerHTML = "";
            for (let item in cart) {
                console.log(cart)
                let count = cart[item]['count'];
                let price = cart[item]['price'];
                document.getElementById('aaa').innerHTML += `<tr id=\"${item}\"></tr>`
                document.getElementById(item).innerHTML += "<td><a href=\"#\"><i class=\"far fa-times-circle x\"></i></a></td>\n" +
                    `                <td><img src=${cart[item]['img']}></td>\n` +
                    `                <td>${cart[item]['des']}</td>\n` +
                    `                <td>${price}$</td>\n` +
                    `                <td>${count}</td>\n` +
                    `                <td>${price * count}$</td>`
            }
            Xs = document.querySelectorAll('.x')
            for (let X of Xs){
                document.addEventListener('click', removeItem)
            }
        })

}
/*remove item*/
function removeItem(event){
    if (event.target?.parentElement?.parentElement?.parentElement?.id.includes('pro')) {
        let item = event.target.parentElement.parentElement.parentElement.id;
        fetch(`/removeitem/${item}`, {method: 'POST'})
            .then(displayCart)
    }
}

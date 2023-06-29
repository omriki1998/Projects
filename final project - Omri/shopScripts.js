/*declaring the event listeners on all items in shop*/
document.addEventListener('DOMContentLoaded', listenToItems)
document.getElementById('submitSearch').addEventListener('click', listenToItems)
/*this function initializes all event listeners on items and removes the admin only part for users*/
function listenToItems(){
    let search = document.getElementById('searchItems').value;
    if (!search) search = 'all';
    fetch(`/displayshop/${search}`, {method: 'GET'})
        .then(res => res.json())
        .then(displayShop)
        .then(()=> {
        let products = document.querySelectorAll('.pro');
        products.forEach(item => {
            item.addEventListener('click', addToCart);
        });
        fetch('/checkifadmin', {method: 'GET'})
            .then(res => res.json())
            .then((value) => {
                if (value !== 'admin') document.getElementById('adminOnly').remove()
                else {
                    document.getElementById('submitItem').addEventListener('click', addItemToShop)
                    document.getElementById('submitRemove').addEventListener('click', removeItemFromShop)
                }
            })
    })
}
/*display the shop*/
function displayShop (shop){
    let proContainer = document.querySelector('.pro-container');
    proContainer.innerHTML = "";
    for (let item in shop){
        proContainer.innerHTML += `<div class=\"pro ${item}\">\n` +
            `                <img class=\"a ${item}\" id=\"${item}\" src=\"${shop[item]['img']}\" alt=\"\">\n` +
            `                <div class=\"des ${item}\">\n` +
            `                    <p class=\"brandName ${item}\">${shop[item]['name']}</p>\n` +
            `                    <p class=\"description ${item}\">${shop[item]['des']}</p>\n` +
            `                    <p class=\"priceTag ${item}\">${shop[item]['price']}$</p>\n` +
            "                </div>\n" +
            "            </div>"
    }
}
/*adds item to cart*/
function addToCart(event) {
    let modal = document.getElementById('modal-container')
    modal.classList.add('show');
    document.getElementById('yes').onclick = ()=>
    {
        let product = event.target.className.split(" ")[1];
        fetch(`/addtocart/${product}`, {method: 'POST'})
            .then(res => res.json())
            .then(value => {
                if (value === "must log in") {
                    window.alert("must log-in in order to add items to cart");
                    document.location.href = '/login.html';
                }
                modal.classList.remove('show');
            })
    }
    document.getElementById('no').onclick = ()=>
    {
        modal.classList.remove('show');
    }

}
/*adds new item to shop*/
function addItemToShop() {
    let name = document.getElementById('newBrandName').value;
    let des = document.getElementById('newDescription').value;
    let img = document.getElementById('newImgUrl').value;
    let price = document.getElementById('newPrice').value;
    let newItem = {'name': name, 'des': des, 'img': img, 'price': price}
    fetch(`/addnewitem`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem)
    })
        .then(res => res.json())
        .then((value)=>{
            if (value === "success") listenToItems();
            else window.alert(value)
        })
}
/*removes the item from shop*/
function removeItemFromShop(){
    let item = document.getElementById('itemToRemove').value;
    fetch(`/removeitemfromshop/${item}`, {method:'POST'})
        .then(res => res.json())
        .then((value)=>{
            if (value === 'success') listenToItems();
            else window.alert(value);
        })
}
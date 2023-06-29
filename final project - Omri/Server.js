const fs = require('fs')
const express = require('express');
const app = express();
app.listen(3000);

app.use('/', express.static(__dirname + '/',{index:'login.html'}));
app.use(express.json());

const session = {};
let itemNum = 8;

/*initialize the products*/
{
    let products = {}
    products['pro1'] = {'name': 'Women Shoes', 'des': 'Jet Mach 2 AC Women Babolat', 'price': 120, 'img': 'img/products/womenShoes.jpg'};
    products['pro2'] = {'name': 'Men Shoes', 'des': 'Propulse Range AC Men Babolat', 'price': 140, 'img': 'img/products/menShoes.jpg'};
    products['pro3'] = {'name': 'Junior Shoes', 'des': 'Jet Mach 3 AC Junior Babolat', 'price': 110, 'img': 'img/products/juniorShoes.jpg'};
    products['pro4'] = {'name': 'Tennis Racket', 'des': 'Babolat Pure Drive Tennis Racket', 'price': 200, 'img': 'img/products/blueRacket.jpg'};
    products['pro5'] = {'name': 'Tennis Racket', 'des': 'Babolat Pure Aero Tennis Racket', 'price': 200, 'img': 'img/products/yellowRacket.jpg'};
    products['pro6'] = {'name': 'Tennis Racket', 'des': 'Babolat Pure Aero Rafa Tennis Racket', 'price': 220, 'img': 'img/products/yellowRafaRacket.jpg'};
    products['pro7'] = {'name': 'Tennis Racket', 'des': 'Babolat Pure Strike Tennis Racket', 'price': 180, 'img': 'img/products/redRacket.jpg'};
    products['pro8'] = {'name': 'Tennis Balls', 'des': 'Gold Championship X3 Tennis Balls', 'price': 10, 'img': 'img/products/balls.jpg'};
    fs.writeFileSync('productsDB.json', JSON.stringify(products, null, 2));
}
/*initialize the admin user*/
{
    let users = {};
    users['admin'] = {'pass': 'admin',
                      'cartItems': {},
                      'logHistory': [],
                      'buyHistory': {},
                      'cartPrice': 0,
                      'mail': 'shaked.omri@gmail.com'
                     };
    fs.writeFileSync("usersDB.json", JSON.stringify(users, null, 2));
}
/*initialize the messages file*/
{
    let messages = {};
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
}
/*registeration*/
app.post('/register',  (req,res)=>{
    let user = req.body.user;
    let pass = req.body.pass;
    let confirmPass = req.body.confirmPass;
    let mail = req.body.mail;
    let data = fs.readFileSync('usersDB.json','utf-8');
    let usersDict = JSON.parse(data);
    let regStatus = checkValidRegistration(user, pass, confirmPass, mail, usersDict);
    switch (regStatus){
        case 1: res.end(JSON.stringify("passwords do not match")); break;
        case 2: res.end(JSON.stringify("password too short")); break;
        case 3: res.end(JSON.stringify("username too short")); break
        case 4: res.end(JSON.stringify("choose a different username")); break;
        case 5: res.end(JSON.stringify("enter valid mail")); break;
        case 6:
            usersDict[user] = {'pass': pass, 'cartItems': {}, 'logHistory': [], 'buyHistory': {}, 'cartPrice': 0, 'mail': mail};
            fs.writeFileSync("usersDB.json", JSON.stringify(usersDict, null, 2))
            res.end(JSON.stringify("success"));
    }
});
/*log in*/
app.post('/login',(req,res)=>{
    let user = req.body.user;
    let pass = req.body.pass;
    let rememberMe = req.body.rememberMe;
    let data = JSON.parse(fs.readFileSync("usersDB.json", "utf-8"));
    let bool = false;
    let cookiePass = cookieGenerator();
    for (let username in data){
        if (user === username){
            if (data[user]['pass'] === pass) {
                session[cookiePass] = user;
                data[user]['logHistory'].push(new Date(Date.now()));
                fs.writeFileSync('usersDB.json', JSON.stringify(data, null, 2));
                let time;
                if (rememberMe) time = 1000*60*60*24*10;
                else time = 1000*60*30
                res.cookie('cookiePass=' ,cookiePass, {expires: new Date(Date.now() + time)})
                setTimeout(()=>{
                    delete session[cookiePass];
                }, time);
                bool = true;
            }
        }
    }
    if (bool) res.end(JSON.stringify("success"));
    else res.end(JSON.stringify("fail"));
})
/*add item to cart*/
app.post('/addtocart/:item', (req, res)=>{
    let cookie = req.headers.cookie.slice(-10); //get the cookie password
    if (!checkCookie(cookie)) res.end(JSON.stringify("must log in"));
    else {
        let item = req.params.item;
        let username = session[cookie];
        let data = JSON.parse(fs.readFileSync('usersDB.json', 'utf-8'))
        let items = JSON.parse(fs.readFileSync('productsDB.json', 'utf-8'));
        if (!data[username]['cartItems'][item]) {
            data[username]['cartItems'][item] = {};
            data[username]['cartItems'][item] = data[username]['cartItems'][item] = 1;
        }
        else (data[username]['cartItems'][item]++);
        data[username]['cartPrice'] += items[item]['price'];
        fs.writeFileSync('usersDB.json', JSON.stringify(data), null, 2);
        res.end(JSON.stringify("success"));
    }
})
/*display the cart*/
app.get('/displaycart', (req, res)=>{
    let cookiePass = req.headers.cookie.slice(-10);
    if (!checkCookie(cookiePass)) res.end(JSON.stringify("must log in"));
    else {
        let username = session[cookiePass];
        let data = JSON.parse(fs.readFileSync('usersDB.json', 'utf-8'));
        let allProducts = JSON.parse(fs.readFileSync('productsDB.json', 'utf-8'))
        let cart = data[username]['cartItems'];
        let responseObj = {};
        for (let item in cart) {
            responseObj[item] = allProducts[item];
            if (!responseObj[item]['count']) responseObj[item] = Object.assign(responseObj[item], {'count': data[username]['cartItems'][item]})
            else (responseObj[item]['count']++)
            console.log(responseObj)
        }
        res.end(JSON.stringify(responseObj));
    }
})
/*remove item from cart*/
app.post('/removeitem/:item', (req, res)=>{
    let cookiePass = req.headers.cookie.slice(-10);
    if (!checkCookie(cookiePass)) res.end("must log in");
    let username = session[cookiePass];
    let item = req.params.item;
    let data = JSON.parse(fs.readFileSync('usersDB.json', 'utf-8'));
    let items = JSON.parse(fs.readFileSync('productsDB.json', 'utf-8'));
    let itemToRemove = data[username]['cartItems'][item];
    console.log(data[username]['cartItems'])
    delete data[username]['cartItems'][item];
    data[username]['cartPrice'] -= items[item]['price'] * itemToRemove;
    fs.writeFileSync('usersDB.json', JSON.stringify(data, null, 2));
    res.end(JSON.stringify(data));
})
/*log out*/
app.post('/logout', (req, res)=>{
    delete session[req.headers.cookie.slice(-10)]
    res.clearCookie('cookiePass');
    res.end(JSON.stringify("success"));
})
/*proceed to check out*/
app.get('/proceedtocheckout', (req, res)=>{
    let cookiePass = req.headers.cookie.slice(-10);
    if (!checkCookie(cookiePass)) res.end("must log in");
    else {
        let username = session[cookiePass];
        let data = JSON.parse(fs.readFileSync('usersDB.json', 'utf-8'))
        res.end(JSON.stringify(data[username]['cartPrice']))
    }
})
/*checks if the user is admin*/
app.get('/checkifadmin', (req, res)=>{
    let cookiePass = req.headers.cookie.slice(-10);
    let username = session[cookiePass];
    if (!username) username = 'a'
    res.end(JSON.stringify(username));
})
/*display the items in the shop*/
app.get('/displayshop/:search', (req, res)=> {
    let search = req.params.search;
    let products = JSON.parse(fs.readFileSync('productsDB.json', 'utf-8'));
    if (search !== 'all') {
        for (let product in products) {
            let item = products[product]
            if (!item['des'].toLowerCase().includes(search.toLowerCase()) && !item['name'].includes(search)) {
                delete products[product];
            }
        }
    }
    res.end(JSON.stringify(products));
})
/*adds new item to the shop*/
app.post('/addnewitem', (req, res)=>{
    let name = req.body.name;
    let des = req.body.des;
    let img = req.body.img;
    let price = Number(req.body.price);
    if (price) {
        let products = JSON.parse(fs.readFileSync('productsDB.json', 'utf-8'));
        let newItem = 'pro' + (1 + itemNum).toString();
        itemNum++;
        products[newItem] = {'name': name, 'des': des, 'price': price, 'img': img};
        fs.writeFileSync('productsDB.json', JSON.stringify(products, null, 2));
        res.end(JSON.stringify("success"));
    } else res.end(JSON.stringify("Illegal Price"))
})
/*remove item from shop*/
app.post('/removeitemfromshop/:item', (req, res)=>{
    let item = req.params.item;
    let products = JSON.parse(fs.readFileSync('productsDB.json', 'utf-8'));
    if (item in products){
        delete products[item];
        fs.writeFileSync('productsDB.json', JSON.stringify(products, null, 2))
        res.end(JSON.stringify("success"));
    }
    else {
        res.end(`no product with name ${item} found`)
    }
})
/*complete checkout*/
app.get('/completecheckout', (req, res)=>{
    let cookie = req.headers.cookie.slice(-10); //get the cookie password
    let username = session[cookie];
    let data = JSON.parse(fs.readFileSync('usersDB.json', 'utf-8'));
    if (!data[username]['cartPrice']) res.end(JSON.stringify("Cart Is Empty"));
    else{
        let products = JSON.parse(fs.readFileSync('productsDB.json', 'utf-8'));
        let shoppingCart = data[username]['cartItems'];
        for (let item in shoppingCart) {
            let itemDescription = products[item]['des'];
            if (data[username]['buyHistory'][itemDescription]) data[username]['buyHistory'][itemDescription] += data[username]['cartItems'][item];
            else data[username]['buyHistory'][itemDescription] = data[username]['cartItems'][item];
        }
        data[username]['cartPrice'] = 0;
        data[username]['cartItems'] = {};
        fs.writeFileSync('usersDB.json', JSON.stringify(data, null, 2))
        res.end(JSON.stringify("success"));
    }
})
/*display the users with given prefix for the admin*/
app.get('/displayusers/:prefix', (req, res)=> {
    let cookie = req.headers.cookie.slice(-10);
    if (session[cookie] !== 'admin') res.end(JSON.stringify('fail'));
    else {
        let prefix = req.params.prefix;
        let data = JSON.parse(fs.readFileSync('usersDB.json', 'utf-8'));
        if (prefix !== 'display all') {
            for (let username in data) {
                if (!username.startsWith(prefix)) delete data[username];
            }
        }
        res.end(JSON.stringify(data));
    }
})
/*check cookies*/
app.get('/checkcookies', (req, res)=>{
    let cookie = req.headers.cookie.slice(-10);
    res.end(JSON.stringify(checkCookie(cookie)));
})
/*adds a message to the system*/
app.post('/contactus', (req, res)=>{
    console.log(req.body)
    let message = req.body.content;
    let email = req.body.email;
    let name = req.body.name
    console.log(name)
    let data = JSON.parse(fs.readFileSync('messages.json', 'utf-8'));
    if (!data[email]) data[email] = {name: name, message: message}
    else {
        data[email]['message'] += ' //new message// ' + message;
    }
    fs.writeFileSync('messages.json', JSON.stringify(data, null, 2));
    res.end('success');
})
let checkValidRegistration = (user, pass, confirmPass, mail, userDict)=>{
    if (pass !== confirmPass) return 1; //case pass != confirm pass
    if (pass.length < 3) return 2; //case pass too short
    if (user.length < 2) return 3; // case username too short
    for (let username in userDict){
        if (username == user) return 4; //case username is taken
    }
    if (!mail.includes('@')) return 5; //case invalid email
    return 6 //case registration is good
}
function checkCookie(cookie){
    if (session[cookie]) return true;
    else return false;
}
function cookieGenerator(){
    let charSET = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let n = charSET.length;
    let pass = ''
    for (let i = 0; i<10; i++){
        pass += charSET.charAt(Math.floor(Math.random() * n));
    }
    return pass;
}

console.log("the server is running on: http://localhost:3000" );


/** **/
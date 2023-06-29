let image = document.getElementById('slideImg');
let images = ['img/products/menShoes.jpg', 'img/products/yellowRafaRacket.jpg', 'img/products/juniorShoes.jpg'];
let descriptions = ["Propulse Range AC Men Babolat", "Babolat Pure Aero Rafa Tennis Racket", "Jet Mach 3 AC Junior Babolat"];
let p =["In blue & yellow", "In multi. Rafa Nadal's racket", "In purple"]

let current = 0;
image.src = images[current];
document.getElementById('imgH').innerText = descriptions[current];
document.getElementById('imgP').innerText = p[current];

 function slideshow(){
    current++;
    current = current%3;
    image.src = images[current];
    document.getElementById('imgH').innerText = descriptions[current];
    document.getElementById('imgP').innerText = p[current];
    }
setInterval(slideshow, 3500);

document.getElementById('out').addEventListener('click', ()=>{
   fetch('/logout', {method: 'POST'})
       .then(res => res.json())
       .then(value => {
          if (value === "success") document.location.href = 'login.html';
          else window.alert("no")
       })
})
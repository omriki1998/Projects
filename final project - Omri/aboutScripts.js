let contentomri = document.getElementById("content-omri");
let contentEinav = document.getElementById("content-einav");
let whoAreWe = document.getElementById("whoAreWe");
let button1 = document.getElementById("show-more-omri");
let button2 = document.getElementById("show-more-einav");



button1.onclick =  clickIt1;
button2.onclick = clickIt2;

function clickIt1(){
     if(contentomri.className === "open"){
        contentomri.className = "";
         let resize = setTimeout(resizeWhoWeAre, 600);
        button1.innerHTML = "KNOW MORE ABOUT OMRI"
     }else{
        let timeout = setTimeout(openOmri, 800);
     }
 }
 function clickIt2(){
    if(contentEinav.className === "open"){
        contentEinav.className = "";
        let resize = setTimeout(resizeWhoWeAre, 600);
            button2.innerHTML = "KNOW MORE ABOUT EINAV"
    }else{
        let timeOut = setTimeout(openEinav, 800);
    }
}

 async function openOmri(){
    contentomri.className = "open";
    whoAreWe.className = "open"
    button1.innerHTML = "Show Less"
}
 async function openEinav(){
    contentEinav.className = "open";
    whoAreWe.className = "open"
    button2.innerHTML = "Show Less"

}
 async function resizeWhoWeAre(){
    if(contentomri.className === "" && contentEinav.className === ""){
        whoAreWe.className = "";
    }
}
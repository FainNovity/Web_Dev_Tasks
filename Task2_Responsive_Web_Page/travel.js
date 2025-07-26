var extra= document.getElementsByClassName('extra');
   var card = document.getElementsByClassName('card'); 
var box = document.getElementsByClassName('box');
for(var i=0;i<box.length;i++){
 document.getElementsByClassName('layer')[i].style.width= parseInt(document.querySelectorAll('.box')[i].querySelectorAll('.card').length)*52+"vh";
}


setInterval(()=>{
    for(var i=0;i<extra.length;i++){
    
        if(window.getComputedStyle(extra[i]).display=="inline"){
       card[i].parentElement.style.backgroundImage = document.getElementsByClassName('card')[i].style.backgroundImage;
           
        }
    }
},10);

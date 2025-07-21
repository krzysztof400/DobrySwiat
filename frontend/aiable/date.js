
const future =new Date(2030,9,24,17,58,26)
function animate(){ 

    requestAnimationFrame(animate);
    let time = future-Date.now()
    let years = Math.floor(time/ (1000 * 60 * 60 * 24*365))
    let days = Math.floor(time/ (1000 * 60 * 60 * 24))
    let hrs = Math.floor(time/ (1000 * 60 * 60 ))
    let minutes=Math.floor(time/ (1000 * 60))
    let seconds = Math.floor(time/ (1000))
    document.querySelector(".counter").innerHTML=years+" lat"+"<br>"+days+" dni"+"<br>"+hrs+" godzin"+"<br>"+minutes+" minut"+"<br>"+seconds+" sekund"
 





}
animate()
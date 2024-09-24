var tl = new gsap.timeline({})
const pfps=[
    'url(./pfps/1.jpg)', 
    'url(./pfps/2.jpg)', 
    'url(./pfps/3.jpg)', 
    'url(./pfps/4.jpg)', 
    'url(./pfps/5.jpg)', 
    'url(./pfps/6.jpg)', 
    'url(./pfps/7.jpg)', 
    'url(./pfps/8.jpg)', 
    'url(./pfps/9.jpg)', 
    'url(./pfps/10.jpg)' 
]
const names=[
    "Dawid Konopnicki",
    "Bernadetta Wisilowicz",
    "Jan Herman Tarasiewicz",
    "Æ-13TpU Junior",
    "Moshe Weingart",
    'George "Nowe Dziecię" Kieślowski',
    "Nikita Szakszewicz",
    "Abraham Załuski",
    "Mariola Kwak",
    "Angelika Kmiecik-Koniecpolska",
   
 
   
  

 
   
  
   
]
const messages=[
    "Dobrego Świata!",
    "Kocham swoją rodzinę!",
    "Panie przebacz nam za nasze grzechy.",
    "Bestialstwo, istne bestialstwo się wydarzyło",
    "Kocham Wielkiego Ojca Jeremiah.",
    "Kochani, dziś przyłapałem mojego syna na przęglądaniu aplikacji Tik Tok. Ktoś doradziłby stosowną karę?<br>Czasami czuję że niedługo nadejdzie ten dzień....",
    "Dzisiejsza inkantacja przebiegła pomyślnie, mam dużo przemyśleń na temat śmierci... <br>Chciałby ktoś to ze mną skonfrontować??? Zapraszam do debaty.",
    "Nienawidzę komuny z całego mego serca, nie dam się poskromić komuszym pomiotom..<br> Uważajcie na policje. Ściany mają uszy.",
    "Dobrymi chęciami piekło jest wybrukowane! Pamiętajcie o tym.",
    "Drodzy wierni! Relacja z ostatniej chwili, mała Marysia doznała duchowego uniesienia...<br>Jeremiah uleczył moją kość biodrową, dziękuję Ci Ojcze, dziękuję Ci Boże. ",
    "Ostatni będą pierwszymi.",
    "Dobrego Świata!"
]
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
function check(){

    if(document.querySelector(".messBox")){     
        tl.to(".messBox",{marginTop:100+"%",duration:1,onComplete:messChange})
        tl.to(".messBox",{marginTop:0+"%",duration:1})
    }
}
function messChange(){
    let pfp=document.querySelector('.avatar')
    let name = document.querySelector('.name')
    let mess=document.querySelector('.messText')
    let date=document.querySelector('.date')
    let i =getRandomArbitrary(0,names.length)
    let now = new Date(Date.now())
    let hour =now.getHours();
    let minute= now.getMinutes();
    if(minute<10){
        minute="0"+minute
    }
    if(hour<10){
        hour = "0"+hour
    }
       now = hour+":"+minute+"<br>"+now.getDay()+"."+now.getMonth()+"."+now.getFullYear()
       date.innerHTML=now
       pfp.style.backgroundImage=pfps[i];
       name.innerHTML=names[i];
       mess.innerHTML=messages[i]
}


setInterval(check, getRandomArbitrary(30000,60000));
messChange()
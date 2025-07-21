let pytania = [
    "Posiadasz niecne zamiary?",
    "Czy boisz się Boga, człowieku?",
    "Jakie masz poglądy?",
    "Czy okłamałbyś bliską osobę jeśli uznałbyś, że przez wyjawienie prawdy byłoby jej przykro?",
    "Co sprawia że człowiek jest wolny?",
    "Oddał/abyś swoje życie w imię Dobrej Sprawy?",
    "Czym Przybysze (rasa szara) zaznaczyli się w historii ludzkości?",
    "Przyjmujesz Ojca Jeremiah jako swojego Duchowego Zwiechrznika?",
    "Co twoim zdaniem powinno się zrobić by uczynić świat lepszym? ",
    "Ile masz pieniędzy?(zł)"
]
let pytanie=0;
let wynik=0;
function question(ans){
   if(pytanie==pytania.length){
    results()
   }
   else{
    if(ans==0){
        wynik++
        nextQuestion()
    }
    else if(ans==3){
        nextQuestion()
    }
    else if(ans==4){
        console.log()
        if(document.querySelector("#money").value>10000){
            wynik++
        }
        else{
            if(wynik>0){
                wynik--
            }
        }
        results()
    }
    else{
        if(wynik>0){
            wynik--
        }
        nextQuestion()
    }

}
    

}
function nextQuestion(){
    let list = document.querySelector(".answerWrapper")
    list.children[pytanie].classList.remove("answerVisible");
    pytanie++
    list.children[pytanie].classList.add("answerVisible");
    document.querySelector(".question").innerHTML=pytania[pytanie];
}


function results(){
    document.querySelector(".testWrapper").style.visibility="hidden"
    document.querySelector(".testWrapper").style.opacity=0
    wynik = (wynik/9)*100
    wynik=Math.floor(wynik)
    document.querySelector(".resultWrapper").style.visibility="visible"
    document.documentElement.style.setProperty('--pos', wynik+"%")
    document.querySelector(".procent").innerHTML="TWOJA DUSZA JEST CZYSTA W "+wynik+"%";
    document.querySelector(".procent").style.visibility="visible"


    if(wynik<20){
        setTimeout(navigator.geolocation.getCurrentPosition(showPosition),1000)
        document.querySelector(".czystosc").innerHTML="CZYSTOŚĆ DUCHA: <h2>KOMUNISTYCZNA</h2>"
        document.querySelector(".opis").innerHTML="Twoja czystość duszy jest na poziomie przeciętnego komunisty. Powodzenia w dalszym zjadaniu dzieci! "
    }
    else if(wynik>20&&wynik<40){
        document.querySelector(".czystosc").innerHTML="CZYSTOŚĆ DUCHA: <h2>KARYGODNA</h2>"
        document.querySelector(".opis").innerHTML="Twoja dusza jest karygodnie zaniedbana. Musisz poświęcić życie w dobrej sprawie, by odkupić swoje grzechy"
    }
    else if(wynik>40&&wynik<60){
        document.querySelector(".czystosc").innerHTML="CZYSTOŚĆ DUCHA: <h2>DOSTATECZNA</h2>"
        document.querySelector(".opis").innerHTML="Masz przed sobą wiele do poprawy. Na szczęście Boża Łaska jest wieczna. Wyrzuć z siebie ducha komunizmu, przeproś swoją matkę, wpłać datek na dowolny cel charytatywny lub do naszej organizacji."
    }
    else if(wynik>60&&wynik<80){
        document.querySelector(".czystosc").innerHTML="CZYSTOŚĆ DUCHA: <h2>PRZYZWOITA</h2>"
        document.querySelector(".opis").innerHTML="Jesteś nieco grzesznym zwolennikiem wolności. Masz co poprawić w swoim zachowaniu, jednakże jesteś na dobrej drodze."
    }
    else if(wynik>80&&wynik<100){
        document.querySelector(".czystosc").innerHTML="CZYSTOŚĆ DUCHA: <h2>DOBRY CZŁOWIEK</h2> "
        document.querySelector(".opis").innerHTML="Tylko dobry człowiek może pochwalić się taką czystością duszy. Trzymaj tak dalej, a dostąpisz Zbawienia. "
    }
    else{
        document.querySelector(".czystosc").innerHTML="CZYSTOŚĆ DUCHA: <h2>PROROK</h2>"
        document.querySelector(".opis").innerHTML="בקרוב תיפתח העין השלישית שלך"
    }
    
    }
    function showPosition(position){
        alert("Latitude: " + position.coords.latitude +
        " Longitude: " + position.coords.longitude)
    }
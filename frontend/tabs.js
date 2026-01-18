

let i =0,j=0,page=0;
console.log()

function tabs(){
    if(i){
        gsap.to('.tabList',{height:0+"vh",duration:.3})
        gsap.to('.tabList',{height:0+"vh",delay:.2,width:0+"vw",duration:.3}) 
        i=0;
        
    }
    else{
        if(document.body.clientWidth<=600){
            gsap.to('.tabList',{width:100+"vw",duration:.3})
            gsap.to('.tabList',{height:100+"vh",delay:.2,duration:.5})
        }
        else{
            gsap.to('.tabList',{width:20+"vw",duration:.3})
            gsap.to('.tabList',{height:90+"vh",delay:.2,duration:.5})
        }
       
        i=1
        
    }
   
}
function Ctabs(){
    i=1;
    tabs()
}
function Otabs(){
    i=0;
    tabs()
}


function prevPage(){
    pageHide()
    if(page>0){
        page--
      
    }
    else{
        page=0
    }
    setTimeout( function() { pageChange(); }, 400);
    setTimeout( function() { pageAppear(); }, 1000);
 
}
function nxtPage(){

    pageHide()

    if(page<pages.length-1){
        page++
      
    }
    else{
        page=0
    }
    setTimeout( function() { pageChange(); }, 400);
    setTimeout( function() { pageAppear(); }, 1000);

}


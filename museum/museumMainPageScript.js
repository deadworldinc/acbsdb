window.onload = function() {
    let firstYearLink = document.getElementById("firstYearLink");
    let secondYearLink = document.getElementById("secondYearLink");
    let thirdYearLink = document.getElementById("thirdYearLink");
    let fourthYearLink = document.getElementById("fourthYearLink");
    let fifthYearLink = document.getElementById("fifthYearLink");

    let firstSourceLink = document.getElementById("firstSourceLink");
    let secondSourceLink = document.getElementById("secondSourceLink");
    let thirdSourceLink = document.getElementById("thirdSourceLink");

    let buttonImenamiGeroev = document.getElementById("buttonImenamiGeroev");
    let buttonGospitali = document.getElementById("buttonGospitali");
    let buttonJivopis = document.getElementById("buttonJivopis");
    let buttonPromishlennost = document.getElementById("buttonPromishlennost");
    let buttonChtobiPomnili = document.getElementById("buttonChtobiPomnili");
    let buttonPamyatniki = document.getElementById("buttonPamyatniki");

    let buttonOpenGoogleMaps = document.getElementById("buttonOpenGoogleMaps");

    let museumHeader = document.getElementById("museumHeader");
    let websiteInfo = document.getElementById("websiteInfo");
    let museumHeaderClickCounter = 0;

    firstYearLink.onclick = function() {
        window.open("/museum/years/1941.html");
    }

    secondYearLink.onclick = function() {
        window.open("/museum/years/1942.html");
    }

    thirdYearLink.onclick = function() {
        window.open("/museum/years/1943.html");
    }

    fourthYearLink.onclick = function() {
        window.open("/museum/years/1944.html");
    }

    fifthYearLink.onclick = function() {
        window.open("/museum/years/1945.html");
    }

    buttonImenamiGeroev.onclick = function() {
        window.open("/museum/imenamiGeroev/imenamiGeroev.html", "_self");
    }

    buttonGospitali.onclick = function() {
        window.open("/museum/gospitali/gospitali.html", "_self")
    }

    buttonJivopis.onclick = function() {
        window.open("/museum/jivopis/jivopis.html", "_self");
    }

    buttonPromishlennost.onclick = function() {
        window.open("/museum/promishlennost/promishlennost.html", "_self");
    }

    buttonChtobiPomnili.onclick = function() {
        window.open("/museum/uchastniki/uchastniki.html", "_self");
    }

    buttonPamyatniki.onclick = function() {
        window.open("/museum/pamyatniki/pamyatniki.html", "_self");
    }

    buttonLiteratura.onclick = function() {
        window.open("/museum/literatura/literatura.html", "_self");
    }

    firstSourceLink.onclick = function(){
        window.open("https://цбс.абакан.рф/museum-41-45/image/vstuplenie/22.pdf");
    }

    secondSourceLink.onclick = function() {
        openErrorPage();
    }

    thirdSourceLink.onclick = function() {
        openErrorPage();
    }

    buttonOpenGoogleMaps.onclick = function() {
        window.open("https://www.google.ru/maps/@53.713084,91.466097,3a,75y,268.93h,77.93t/data=!3m4!1e1!3m2!1s-KbWKN6IBpX9pNFfuteq1g!2e0!6m1!1e1");
    }

    function openErrorPage() {
        window.open("404.html");
    }
    
    Fancybox.bind("[data-fancybox]", {
        
    });

    museumHeader.onclick = function() {
        museumHeaderClickCounter++;
        if(museumHeaderClickCounter == 10) {
            websiteInfo.style.display = "block";
            websiteInfo.scrollIntoView();
            museumHeaderClickCounter = 0;
        }
    }
}
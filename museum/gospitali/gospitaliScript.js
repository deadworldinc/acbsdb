window.onload = function() {
    let buttonGospitaliInfo = document.getElementById("buttonGospitaliInfo");
    let buttonKrasnoarmeyci = document.getElementById("buttonKrasnoarmeyci");

    buttonGospitaliInfo.onclick = function() {
        window.open("/museum/gospitali/pages/gospitaliInfo.html");
    }

    buttonKrasnoarmeyci.onclick = function() {
        window.open("/museum/gospitali/pages/krasnoarmeyci.html");
    }

    Fancybox.bind("[data-fancybox]", {
        
    });
}
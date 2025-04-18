window.onload = function() {
    let domojakovContainer = document.getElementById("domojakovContainer");
    let kilchichakovContainer = document.getElementById("kilchichakovContainer");
    let popovContainer = document.getElementById("popovContainer");
    let ugujakovContainer = document.getElementById("ugujakovContainer");
    let cukanovaContainer = document.getElementById("cukanovaContainer");
    let suvorovContainer = document.getElementById("suvorovContainer");
    let makarenkoContainer = document.getElementById("makarenkoContainer");
    let perekreshenkoContainer = document.getElementById("perekreshenkoContainer");
    let chebodaevContainer = document.getElementById("chebodaevContainer");
    let tihonovContainer = document.getElementById("tihonovContainer");

    domojakovContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/domojakov.html");
    }

    kilchichakovContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/kilchichakov.html");
    }

    popovContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/popov.html");
    }

    ugujakovContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/ugujakov.html");
    }

    cukanovaContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/cukanova.html");
    }

    suvorovContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/suvorov.html");
    }
    
    makarenkoContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/makarenko.html");
    }

    perekreshenkoContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/perekreshenko.html");
    }

    chebodaevContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/chebodaev.html");
    }

    tihonovContainer.onclick = function() {
        window.open("/museum/imenamiGeroev/pages/tihonov.html");
    }

    Fancybox.bind("[data-fancybox]", {
        
    });
}
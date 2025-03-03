let termine = JSON.parse(localStorage.getItem("termine")) || {};
function alleEreignisseAusgeben(){
    const länge = Object.keys(termine).length;
    for(let i = 1; i <= länge; i++){
        let ereignisName = "ereignis"+i;
        let ereignis = termine[ereignisName];
        anzeige.innerHTML += `<li id="ereignisse${i}" class="ereignisseAnzeigen"><div class="betreffAnzeige">${ereignis.betreff}</div><div class="zeit"><div>${ereignis.datum}</div>${ereignis.startZeit} - ${ereignis.endZeit}</div></li><br>`;
    }
}

function zurücksetzen2(){                //Button unsichtbar Fenster
    window.location.href = "index.html";
}
function date(){                //Datumsausgabe oberer Rand
const dateAktuell = new Date();
const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
};
const datum = dateAktuell.toLocaleDateString("de-DE", options);
const dateElement = document.getElementById("date");
dateElement.innerHTML = datum;
}
setInterval(date, 10000);

function zeitAusgabe(verzweigung){                //Zeit & Class ausgabe tabelle & Terminerstellungsfenster
    const aktuell = new Date();
    const minuten = aktuell.getMinutes();
    const stunden = aktuell.getHours();
    const tag = aktuell.getDate();
    const monat = aktuell.getMonth() + 1;
    const jahr = aktuell.getFullYear();
    let zusatzZahlTag = "";
    let zusatzZahlMonat = "";
    let zusatzZahlStartStunde = "";
    let zusatzZahlMinute = "";
    let zusatzZahlEndStunde = "";
    let stundenEnd = stunden + 1;
    if(tag < 10){
        zusatzZahlTag = 0;
    }
    if(monat < 10){
        zusatzZahlMonat = 0;
    }
    if(stunden < 10){
        zusatzZahlStartStunde = 0;
    }
    if(minuten < 10){
        zusatzZahlMinute = 0;
    }
    if(stundenEnd < 10){
        zusatzZahlEndStunde = 0;
    }
    if(stunden === 24){
        stundenEnd = 0;
    }

    datum.value = `${jahr}-${zusatzZahlMonat}${monat}-${zusatzZahlTag}${tag}`;
    startZeit.value = `${zusatzZahlStartStunde}${stunden}:${zusatzZahlMinute}${minuten}`;
    endZeit.value = `${zusatzZahlEndStunde}${stundenEnd}:${zusatzZahlMinute}${minuten}`;

    //Berechnung Datums-Vorhersage
    for(let i = 1; i <= 7; i++){
        let tagClassZaehler = tag + i - 1;
        let zusatzZahlTagClassZaehler = "";
        let monatClassZaehler = monat;
        let zusatzZahlMonatClassZaehler = "";
        let jahrClassZaehler = jahr;
        let tagNormal = "";
        let monatNormal = "";

        const monatsTage = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        if(jahr % 4 === 0 && (jahr % 100 !== 0 || jahr % 400 === 0)){
            monatsTage[1] = 29;
        }

        let anzahlMonatsTage = monatsTage[monat-1];

        if(tagClassZaehler <= anzahlMonatsTage){
            tagNormal = tagClassZaehler;
        }
        if(tagClassZaehler > anzahlMonatsTage){
            tagNormal = tagClassZaehler - anzahlMonatsTage;
            monatNormal = monatClassZaehler++;
        }
        if(monatClassZaehler <= 12){
            monatNormal = monatClassZaehler;
        }
        if(monatClassZaehler > 12){
            monatNormal = monatClassZaehler - 12;
        }
        if(monatClassZaehler > 12){
            jahrClassZaehler++;
        }

        if(tagNormal < 10){
            zusatzZahlTagClassZaehler = 0;
        }
        if(monatNormal < 10){
            zusatzZahlMonatClassZaehler = 0;
        }

        document.getElementById(`tagEreignisse${i}`).className = `${jahrClassZaehler}-${zusatzZahlMonatClassZaehler}${monatNormal}-${zusatzZahlTagClassZaehler}${tagNormal}`;
        //Schleife zur ausgabe
        if(verzweigung === 1){
        const länge = Object.keys(termine).length;
        for(let i = 1; i <= länge; i++){
            let ereignisName = "ereignis"+i;
            let ereignis = termine[ereignisName];
            let datum = `${jahrClassZaehler}-${zusatzZahlMonatClassZaehler}${monatNormal}-${zusatzZahlTagClassZaehler}${tagNormal}`;

            if(ereignis.datum === datum){
                let pruefung = document.getElementsByClassName(datum);
                pruefung[0].innerHTML += `<li id="ereignisse${i}" class="ereignisse">${ereignis.betreff}</li>`;
                
                
                const anfangsZeitStunden = termine["ereignis"+i].startZeit.substr(0, 2) * 60;
                const anfangsZeitMinuten = termine["ereignis"+i].startZeit.substr(3, 5);
                const anfangsZeitinsgesamt = parseFloat(anfangsZeitStunden) + parseFloat(anfangsZeitMinuten);
                const anfangsZeitprozentual = anfangsZeitinsgesamt / 1440 * (100-6.8);      //prozent

                const endZeitStunden = termine["ereignis"+i].endZeit.substr(0, 2) * 60;
                const endZeitMinuten = termine["ereignis"+i].endZeit.substr(3, 5);
                const endZeitinsgesamt = parseFloat(endZeitStunden) + parseFloat(endZeitMinuten);
                const endZeitprozentual = endZeitinsgesamt / 1440 * (100-6.8);              //prozent

                const differenzZeitprozentual = endZeitprozentual - anfangsZeitprozentual;

                let blockID = "ereignisse" + i;
                let getID = document.getElementById(blockID);
                getID.style.height = differenzZeitprozentual + "%";
                getID.style.marginTop = anfangsZeitprozentual + "vh";    
                }
            }
        }
    }
}

function auswahlFenster1(){              //Button sichbar Fenster
    auswahlHintergrund.style.display = "flex";
    anzeigeAlles.style.display = "none";
    neuesElement.style.display = "none";
    zeitAusgabe();
}

function auswahlFenster2(){
    window.location.href = "ereignisUebersicht.html";
    alleEreignisseAusgeben();
}

function zurücksetzen1(){                //Button unsichtbar Fenster
    auswahlHintergrund.style.display = "none";
    anzeigeAlles.style.display = "block";
    neuesElement.style.display = "block";
    betreff.value = "";
    startZeit.value = "";
    endZeit.value = "";
}

let termine = JSON.parse(localStorage.getItem("termine")) || {};

function hinzufügen(){              //neue Ereignisse hinzufügen
    const länge = Object.keys(termine).length;
    let idZahlHinz = länge + 1;
    if(länge === 0){
        idZahlHinz = 1;
    }
    let startZeitStunden = document.getElementById("startZeit").value.substr(0, 2);
    let endZeitStunden = document.getElementById("startZeit").value.substr(0, 2);
    let startZeitMinuten = document.getElementById("startZeit").value.substr(3, 5);
    let endZeitMinuten = document.getElementById("startZeit").value.substr(3, 5);

    //Prüfen!!!
    if(betreff.value !== "" && datum.value !== "" && startZeit.value !== "" && endZeit.value !== "" && startZeitStunden <= endZeitStunden || startZeitMinuten < endZeitMinuten){

        let pruefung = 1;
        let anzahlDaBleiben = "";
        let anzahlAenderungen = "";
        let neuesEreignis = {"betreff": betreff.value, "datum": datum.value, "startZeit": startZeit.value, "endZeit": endZeit.value};
        if(pruefung === 1){
            let neuesEreignisDate = new Date(neuesEreignis.datum + 'T' + neuesEreignis.startZeit);
        
            for(let i = 1; i <= länge; i++){
                const ereignisName = "ereignis" + i;
                const ereignis = termine[ereignisName];
                
                let ereignisDate = new Date(ereignis.datum + 'T' + ereignis.startZeit);
        
                if(ereignisDate < neuesEreignisDate){
                    anzahlDaBleiben++;
                    console.log(anzahlDaBleiben);
                }
                if(ereignisDate > neuesEreignisDate){
                    anzahlAenderungen++;
                    console.log(anzahlAenderungen);
                }
            }
            //Differenz aus beiden
            //"nach" umbenennen (+B)
            //wieder umbenennen (-B)
        }
        termine["ereignis"+idZahlHinz] = neuesEreignis;
        localStorage.setItem('termine', JSON.stringify(termine));   
    }

    //location.reload();        //wieder einstellen
    zurücksetzen1();
    //ereignisse();
    zeitAusgabe(1);
}

function aktuelleUhrzeit(){             //Aktuelle Uhrzeit Achse
    const aktuelleUhrzeit = new Date();
    const stunden = aktuelleUhrzeit.getHours();
    const minuten = aktuelleUhrzeit.getMinutes();

    const vergangeneMinuten = stunden * 60 + minuten;
    const prozentual = vergangeneMinuten / 1440 * 100;

    timeviewInhalt.style.height = prozentual + "%";
}
setTimeout(aktuelleUhrzeit, 500);
setInterval(aktuelleUhrzeit, 60000);


function tabelle(){
    const aktuell = new Date();
    let wochentag = aktuell.getDay();
    const wochentagNamen = ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"];
    for(let i = 1; i <= 7; i++){
        const elementID = document.getElementById("tag"+i);
        elementID.innerHTML = wochentagNamen[wochentag];
        wochentag++;
        if(wochentag > 6){
            wochentag = 0;
        }
    }
    zeitAusgabe(1);
}

function alleEreignisseAusgeben(){
    const länge = Object.keys(termine).length;
    for(let i = 1; i <= länge; i++){
        let ereignisName = "ereignis"+i;
        let ereignis = termine[ereignisName];
        anzeige.innerHTML += `<li id="ereignisse${i}" class="ereignisseAnzeigen"><div class="betreffAnzeige">${ereignis.betreff}:</div><div class="zeit">${ereignis.startZeit} - ${ereignis.endZeit}</div></li><br>`;
    }
}//weiter
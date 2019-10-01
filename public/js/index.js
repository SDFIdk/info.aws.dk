"use strict";

var util = require('dawa-util')
    , URL = require('url-parse')
    , queryString = require('query-string')
    , dom = require('incremental-dom')
    , bbr = require('./bbrkodelister.js');


var eo = dom.elementOpen,
    ec = dom.elementClose,
    ev = dom.elementVoid,
    text = dom.text;

const listetableclasses= 'table table-hover'
    , tableclasses= 'table table-borderless table-hover'
    , theadclasses= 'thead-dark';

let ressource= null;
var visSide= function(container) {

  let arr= dawaUrl.pathname.split('/');
  ressource= arr[1].toLowerCase();
  console.log(arr);
  console.log(ressource);
  if (ressource === 'bbr') {
    ressource= ressource + '/' + arr[2].toLowerCase();
  }
  console.log(ressource);

  const title = document.getElementById('title');
  title.innerText= 'Danmarks ' + flertal(ressource);

  query.format= 'json';
  delete query.struktur;
  dawaUrl.set('query',queryString.stringify(query));

  let urltext= dawaUrl.toString();

  fetch(urltext).then( function(response) {
    if (response.status === 200) {
      response.json().then( function ( data ) {
        visInfo(container, ressource, data);
      });
    }
    else {      
      dom.patch(container, () => {html('<h1>Ukendt ressource: ' + ressource + '</h1>')});
    }
  });
}

function visData(data, visEnKort, visEn, ressource, compare, kort=true) {  
  if (Array.isArray(data) && data.length !== 1) {      
    dom.patch(container, visListe(data, visEnKort, ressource, compare, kort)); 
  } 
  else if (Array.isArray(data) && data.length === 1) {      
    dom.patch(container, visEn(data[0], ressource)); 
  }
  else {
    dom.patch(container, visEn(data, ressource)); 
  }
}

function visInfo(container, ressource, data) {
  let label= "";
  switch (ressource) {
  case 'bbr/bygninger':
    visData(data, visAdresseKort, visAdresse, ressource, adresseCompare);
    break;
  case 'adresser':
    visData(data, visAdresseKort, visAdresse, ressource, adresseCompare);
    break;
  case 'adgangsadresser':
    visData(data, visAdgangsadresseKort, visAdgangsadresse, ressource, adgangsadresseCompare);
    break;    
  case 'navngivneveje':    
    visData(data, visNavngivnevejKort, visNavngivnevej, ressource, null);
    break;  
  case 'vejstykker':      
    visData(data, visVejstykkeKort, visVejstykke, ressource, null);
    break;    
  case 'vejnavne':      
    visData(data, visVejnavnKort, visVejnavn, ressource, vejnavneCompare, false);
    break;   
  case 'supplerendebynavne2': 
    visData(data, visSupplerendeBynavnKort, visSupplerendeBynavn, ressource, null);
    break;  
  case 'ejerlav': 
    visData(data, visEjerlavetKort, visEjerlavet, ressource, null);
    break;
  case 'jordstykker':
    visData(data, visJordstykkeKort, visJordstykke, ressource, null);
    break;  
  case 'bygninger':
    visData(data, visBygningKort, visBygning, ressource, null);
    break;  
  case 'postnumre': 
    visData(data, visPostnummerKort, visPostnummer, ressource, null);
    break;
  case 'sogne':
  case 'politikredse':
  case 'retskredse':
    visData(data, visDAGIKort, visDAGI(ressource), flertal(ressource), null);
    break;
  case 'regioner':
    visData(data, visRegionKort, visRegion, ressource, null);
    break;  
  case 'landsdele': 
    visData(data, visLandsdelKort, visLandsdel, ressource, null);
    break;  
  case 'kommuner':
    visData(data, visKommuneKort, visKommune, ressource, null);
    break;
  case 'afstemningsomraader': 
    visData(data, visAfstemningsområdeKort, visAfstemningsområde, flertal(ressource), null);
    break;
  case 'menighedsraadsafstemningsomraader':
    visData(data, visMenighedsraadsafstemningsområdeKort, visMenighedsraadsafstemningsområde, flertal(ressource), null);
    break;
  case 'opstillingskredse':
    visData(data, visOpstillingskredsKort, visOpstillingskreds, ressource, null);
    break;
  case 'storkredse':
    visData(data, visStorkredsKort, visStorkreds, ressource, null);
    break; 
  case 'valglandsdele':
    visData(data, visValglandsdelKort, visValglandsdel, ressource, null);
    break;
  case 'bebyggelser':
    visData(data, visBebyggelseKort, visBebyggelse, ressource, null);
    break;    
  case 'stednavne':
    visData(data, visStednavnKort, visStednavn, ressource, null);
   break;    
  case 'stednavne2':
    visData(data, visStednavn2Kort, visStednavn2, flertal(ressource), null);
    break;      
  case 'steder':
    visData(data, visStedKort, visSted, ressource, null);
    break;       
  case 'stednavntyper':
    visData(data, visStednavntypeKort, visStednavntype, ressource, null, false);
    break; 
  default: 
    dom.patch(container, () => {html('<h1>Ukendt ressource: ' + ressource + '</h1>')});
  }
}

function ental(ressource) {
  let tekst= "";
  switch (ressource) {
  case 'adresser':
    tekst= 'adresse';
    break;
  case 'adgangsadresser':
    tekst= 'adgangsadresse';
    break;    
  case 'navngivneveje':    
    tekst= 'navngiven vej';
    break;  
  case 'vejstykker':      
    tekst= 'vejstykke';
    break;    
  case 'vejnavne':      
    tekst= 'vejnavn';
    break;     
  case 'supplerendebynavne2': 
    tekst= 'supplerende bynavn';
    break;  
  case 'ejerlav': 
    tekst= 'ejserlav';
    break;
  case 'jordstykker':
    tekst= 'jordstykke';
    break;  
  case 'postnumre': 
    tekst= 'postnummer';
    break;
  case 'sogne':
    tekst= 'sogn';
    break;
  case 'bygninger':
    tekst= 'bygning';
    break;
  case 'politikredse':
    tekst= 'politikreds';
    break;
  case 'retskredse':
    tekst= 'retskreds';
    break;
  case 'regioner':
    tekst= 'region';
    break;
  case 'landsdele':
    tekst= 'landsdel';
    break;
  case 'kommuner':
    tekst= 'kommune';
    break;
  case 'afstemningsomraader': 
    tekst= 'afstemningsområde';
    break;
  case 'menighedsraadsafstemningsomraader':
    tekst= 'menighedsrådsafstemningsområde';
    break;
  case 'opstillingskredse':
    tekst= 'opstillingskreds';
    break;
  case 'storkredse':
    tekst= 'storkreds';
    break; 
  case 'valglandsdele':
    tekst= 'valglandsdel';
    break;
  case 'bebyggelser':
    tekst= 'bebyggelse';
    break;    
  case 'stednavne':
    tekst= 'stednavn';
   break;    
  case 'stednavne2':
    tekst= 'stednavn';
    break;      
  case 'steder':
    tekst= 'sted';
    break;       
  case 'stednavntyper':
    tekst= 'stednavntype';
    break; 
  default:    
    html('<h1>Ukendt ressource: ' + ressource + '</h1>');
  }
  return tekst;
}

function flertal(ressource) {
  let tekst= "";
  switch (ressource) {
  case 'adresser':
    tekst= 'adresser';
    break;
  case 'adgangsadresser':
    tekst= 'adgangsadresser';
    break;    
  case 'navngivneveje':    
    tekst= 'navngiven veje';
    break;  
  case 'vejstykker':      
    tekst= 'vejstykker';
    break;   
  case 'vejnavne':      
    tekst= 'vejnavne'; 
    break;
  case 'supplerendebynavne2': 
    tekst= 'supplerende bynavne';
    break;  
  case 'ejerlav': 
    tekst= 'ejerlav';
    break;
  case 'jordstykker':
    tekst= 'jordstykker';
    break;  
  case 'postnumre': 
    tekst= 'postnumre';
    break;
  case 'bygninger':
    tekst= 'bygning';
    break;
  case 'sogne':
    tekst= 'sogne';
    break;
  case 'politikredse':
    tekst= 'politikredse';
    break;
  case 'retskredse':
    tekst= 'retskredse';
    break;
  case 'regioner':
    tekst= 'regioner';
    break;
  case 'landsdele':
    tekst= 'landsdele';
    break;
  case 'kommuner':
    tekst= 'kommuner';
    break;
  case 'afstemningsomraader': 
    tekst= 'afstemningsområder';
    break;
  case 'menighedsraadsafstemningsomraader':
    tekst= 'menighedsrådsafstemningsområder';
    break;
  case 'opstillingskredse':
    tekst= 'opstillingskredse';
    break;
  case 'storkredse':
    tekst= 'storkredse';
    break; 
  case 'valglandsdele':
    tekst= 'valglandsdele';
    break;
  case 'bebyggelser':
    tekst= 'bebyggelser';
    break;    
  case 'stednavne':
    tekst= 'stednavne';
   break;    
  case 'stednavne2':
    tekst= 'stednavne';
    break;      
  case 'steder':
    tekst= 'steder';
    break;      
  case 'stednavntyper':
    tekst= 'stednavntyper';
    break; 
  default:    
    tekst= 'Ukendt ressource: ' + ressource;
  }
  return tekst;
}


function html(content) {
  const el = dom.elementOpen('html-blob');
  if (el.__cachedInnerHtml !== content) {
    el.__cachedInnerHtml = content;
    el.innerHTML = content;
  }
  dom.skip()
  dom.elementClose('html-blob');
}

function statusTekst(status) {
  let tekst= "";
  switch (status) {
  case 1:
    tekst= 'Gældende';
    break;
  case 2:
    tekst= 'Nedlagt';
    break;
  case 3:
    tekst= 'Foreløbig';
    break;
  case 4:
    tekst= 'Henlagt';
    break;
  }
  return tekst;
}

function nøjagtighedTekst(bogstav) {
  let tekst= 'Ukendt nøjagtighedsklasse';
  switch (bogstav) {
  case 'A':
    tekst= 'Absolut placeret';
    break;
  case 'B':
    tekst= 'Beregnet placering';
    break;
  }
  return tekst;
}

function beliggenhedNøjagtighedTekst(bogstav) {
  let tekst= 'Ukendt nøjagtighedsklasse';
  switch (bogstav) {
  case 'A':
    tekst= 'Manuelt sat, følger IKKE GeoDanmark';
    break;
  case 'B':
    tekst= 'Maskinelt sat, ud fra GeoDanmark';
    break;
  case 'C':
    tekst= 'Manuelt sat, kommer til at følge GeoDanmark';
    break;
  }
  return tekst;
}

function kildeTekst(kilde) {
  let tekst= 'Ukendt kilde';
  switch (kilde) {
  case 1:
    tekst= 'Oprettet maskinelt fra teknisk kort';
    break;
  case 2:
    tekst= 'Oprettet maskinelt fra af matrikelnummer tyngdepunkt';
    break;
  case 3:
    tekst= 'Eksternt indberettet af konsulent på vegne af kommunen';
    break;
  case 4:
    tekst= 'Eksternt indberettet af kommunes kortkontor o.l.';
    break;
  case 5:
    tekst= 'Oprettet af teknisk forvaltning';
    break;
  }
  return tekst;
}
 
function arealberegningsmetodeTekst(bogstav) {
  let tekst= 'Ukendt arealberegningsmetode';
  switch (bogstav) {
  case 'o':
    tekst= 'Arealet er beregnet efter opmåling';
    break;
  case 's':
    tekst= 'Arealet er beregnet efter konstruktion i større målforhold, dvs. større end det analoge matrikelkort';
    break;
  case 'k':
    tekst= 'Arealet er beregnet på grundlag af kort';
    break;
  }
  return tekst;
} 

function vejarealberegningsmetodeTekst(bogstav) {
  let tekst= 'Ukendt vejarealberegningsmetode';
  switch (bogstav) {
  case 'b':
    tekst= 'Vejareal på jordstykket er beregnet (og kan være 0)';
    break;
  case 'e':
    tekst= 'Der er konstateret vej på jordstykket, men areal er ikke beregnet';
    break;
  case 'u':
    tekst= 'Det er ukendt, om der findes vej på jordstykket';
    break;
  }
  return tekst;
}

function vandarealberegningsmetodeTekst(bogstav) {
  let tekst= 'Ukendt vandarealberegningsmetode';
  switch (bogstav) {
  case 'incl':
    tekst= 'Vandareal på jordstykket et inkluderet i det registrerede areal for jordstykket';
    break;
  case 'excl':
    tekst= 'Vandareal på jordstykket er ikke inkluderet i det registrerede areal for jordstykket';
    break;
  case 'ukendt':
    tekst= 'Vandareal er ikke oplyst';
    break;
  }
  return tekst;
}

function tekniskstandardTekst(standard) {
  let tekst= 'Ukendt teknisk standard';
  switch (standard) {
  case 'UF':
    tekst= 'Adgangspunkt uspecificeret eller foreløbig';
    break;
  case 'TN':
    tekst= 'Adgangspunkt inden for bygningsomrids';
    break;
  case 'TK':
    tekst= 'Adgangspunkt ved bygningsfacade mod vej';
    break;
  case 'TD':
    tekst= 'Adgangspunkt ved indgangsdør til bygning';
    break;
  case 'VU':
    tekst= 'Vejpunkt er uspecificeret eller ukendt';
    break;
  case 'VN':
    tekst= 'Vejpunkt i vejtilslutningspunkt';
    break;
  case 'V0':
    tekst= 'Vejpunkt på vej med korrekt vejkode. Stor sikkerhed for korrekt vejpunkt';
    break;
  case 'V1':
    tekst= 'Vejpunkt på vej med korrekt vejkode. Adgang til adgangspunkt via indkørselsvej eller sti';
    break;
  case 'V2':
    tekst= 'Vejpunkt på vej med korrekt vejkode. Risiko for at skulle krydse stier';
    break;
  case 'V3':
    tekst= 'Vejpunkt på vej med korrekt vejkode. Risiko for at skulle krydse andre veje';
    break;
  case 'V4':
    tekst= 'Vejpunkt på vej med korrekt vejkode. Risiko for at skulle krydse et enkelt teknisk anlæg eller trafikhegn';
    break;
  case 'V5':
    tekst= 'Vejpunkt på vej med korrekt vejkode. Risiko for at skulle krydse et større antal bygninger eller jordstykker. Risiko for at skulle krydse fysiske forhindringer';
    break;
  case 'V6':
    tekst= 'Vejpunkt på mindre indkørselsvej med korrekt vejkode. Risiko for at skulle krydse fysiske forhindringer';
    break;
  case 'V7':
    tekst= 'Vejpunkt på vej med forkert vejkode, men på samme matrikelnummer. Risiko for at skulle krydse fysiske forhindringer';
    break;
  case 'V8':
    tekst= 'Vejpunkt på sti med korrekt vejkode. Risiko for at skulle krydse fysiske forhindringer';
    break;
  case 'V9':
    tekst= 'Vejpunkt på vej eller indkørselsvej med forkert kommunekode eller vejkode. Risiko for at skulle krydse fysiske forhindringer';
    break;
  case 'VX':
    tekst= 'Vejpunkt på vej. Stor usikkerhed om korrekthed';
    break;
  case 'NO':
    tekst= 'Vejnavnebeliggenhed omskriver adresser, GeoDanmark vejmidter eller er konstrueret';
    break;
  }
  return tekst;
}

function statusFarve(status) {
  let tekst= "";
  switch (status) {
  case 1:
    tekst= 'badge-success';
    break;
  case 2:
    tekst= 'badge-dark';
    break;
  case 3:
    tekst= 'badge-warning';
    break;
  case 4:
    tekst= 'badge-dark';
    break;
  }
  return tekst;
}


function darstatusFarve(status) {
  let tekst= "";
  switch (status) {
  case 3:
  case "gældende":
    tekst= 'badge-success';
    break;
  case 2:
  case "foreløbig":
    tekst= 'badge-warning';
    break;
  }
  return tekst;
}

function darstatusTekst(status) {
  let tekst= "";
  switch (status) {
  case 1:
    tekst= 'Intern forberedelse';
    break;
  case 2:
    tekst= 'Foreløbig';
    break;
  case 3:
    tekst= 'Gældende';
    break;
  case 4:
    tekst= 'Nedlagt';
    break;
  case 5:
    tekst= 'Henlagt';
    break;
  case 6:
    tekst= 'Slettet';
    break;
  case 7:
    tekst= 'Ikke i brug';
    break;
  case 8:
    tekst= 'I brug';
    break;
  case 5:
    tekst= 'Udgået';
    break;
  }
  return tekst;
}

function badge(tekst, type, url, overskrift) {
  eo(overskrift?'th':'td');
    if (url) {
      eo('a', null, null,
        'href', url);
    };
    eo('span', null, null,
      'class', 'badge badge-pill '+type);
      text(tekst);
    ec('span');
    if (url) {
      ec('a'); 
    }
  ec(overskrift?'th':'td');
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function strong(value){
  return '<strong>' + value + '</strong>';
}

function em(value){
  return '<em>' + value + '</em>';
}

function indrykningsStyle(indrykninger) {
  return 'padding-left:' + indrykninger*2 + 'em';
};

function visKodeNavn(navn, ref, indrykninger) {
  eo('tr');
    if (indrykninger) {
      eo('td', null, null, 'style', indrykningsStyle(indrykninger));
    }
    else {
      eo('td');
    }
      html(navn + ': ' + strong(ref.kode + " " + ref.navn));
    ec('td');
    badge('info', 'badge-primary', ref.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', ref.href.replace('dawa','vis'));
    badge('data', 'badge-primary', ref.href);
  ec('tr');
}

function visNummerNavn(navn, ref) { 
  eo('tr');
    eo('td');
      html(navn + ': ' + strong(ref.nummer + " " + ref.navn));
    ec('td');
    badge('info', 'badge-primary', ref.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', ref.href.replace('dawa','vis'));
    badge('data', 'badge-primary', ref.href);
  ec('tr');
}

function visBogstavNavn(navn, ref) { 
  eo('tr');
    eo('td');
      html(navn + ': ' + strong(ref.bogstav + " " + ref.navn));
    ec('td');
    badge('info', 'badge-primary', ref.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', ref.href.replace('dawa','vis'));
    badge('data', 'badge-primary', ref.href);
  ec('tr');
}


function visOverskrift(overskrift, kort=true) {
  eo('thead', null, null,
      'class', theadclasses);    
    eo('tr');
      eo('th');
        html(strong(overskrift));
      ec('th');          
      eo('th');ec('th');
      if (kort) {
        badge('kort', 'badge-primary', url.href.replace('info','vis'), true);
      }
      else {               
        eo('th');ec('th');
      }
      badge('data', 'badge-primary', url.href.replace('info','dawa'), true);
    ec('tr'); 
  ec('thead');
}

function danNavbar(overskrift, infotekst, viskortmenu=true) {  
  const navoverskrift = document.getElementById('navoverskrift');
  navoverskrift.innerText= capitalizeFirstLetter(flertal(ressource));
  navoverskrift.href= url; 
  
  let href= new URL(dawaUrl.toString());
  let hrefquery= queryString.parse(href.query);
  delete hrefquery.struktur;

  const json = document.getElementById('json');
  hrefquery.format= 'json';
  href.set('query',queryString.stringify(hrefquery));
  json.href= href.toString(); 

  const geojson = document.getElementById('geojson');
  hrefquery.format= 'geojson';
  href.set('query',queryString.stringify(hrefquery));
  geojson.href= href.toString();

  const ndjson = document.getElementById('ndjson');
  hrefquery.format= 'json';
  hrefquery.ndjson= true;
  href.set('query',queryString.stringify(hrefquery));
  ndjson.href= href.toString();
  delete hrefquery.ndjson;

  const csv = document.getElementById('csv');
  hrefquery.format= 'csv';
  href.set('query',queryString.stringify(hrefquery));
  csv.href= href.toString();

  const vispåkort = document.getElementById('vispåkort');
  if (viskortmenu) {
    vispåkort.href= dawaUrl.toString().replace('dawa','vis');
  }
  else {
    vispåkort.hidden= true;
  }

  const apidokumentation = document.getElementById('apidokumentation');
  apidokumentation.href= 'https://dawa.aws.dk/dok/api/' + ental(ressource); 

  let visinfoboks= true;
  if (query.infoboks) {
    visinfoboks= (query.infoboks === 'true');
  }
  if (visinfoboks) {
    const jumbotron = document.getElementById('jumbotron');
    let tekst= null;
    if (infotekst) {
      tekst= infotekst;
    }
    else {
      tekst= jumbotrontekst(ressource);
    } 
    if (tekst) {
      jumbotron.insertAdjacentHTML('afterbegin', tekst);
      jumbotron.hidden= false;
    }
    else {
      jumbotron.hidden= true;
    }
  }
}


function jumbotrontekst(ressource) {
  let tekst= "";
  switch (ressource) {
  case 'adresser': 
    tekst= `
      <h1 class="display-5">Danmarks adresser</h1>
      <p class="lead">En adresse er en sammensat betegnelse, som udpeger og benævner en bestemt adgangsvej til et ubebygget areal, en bygning, en del af en bygning, et teknisk anlæg el.lign. Den sammensatte betegnelse, som en adresse udgør, består af vejnavn, husnummer, en eventuel etagebetegnelse og en eventuel dørbetegnelse, et eventuelt supplerende bynavn samt det postnummer med tilhørende navn på postnummerområdet, som adressen er beliggende i. (<a href="https://www.retsinformation.dk/Forms/R0710.aspx?id=186325">Adresselovens §6</a>)</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller adressedata og -funktionalitet via et <a href='http://dawa.aws.dk/dok/api/adresse'>adresse API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete, datavask og reverse geokodnng af adresser samt udstilling af deres geografiske placering.</p>`;
    break;
  case 'adgangsadresser':
    tekst= `
      <h1 class="display-5">Danmarks adgangsadresser</h1>
      <p class="lead">En adgangsadresse er populært sagt en adresse uden etagebetegnelse og dørbetegnelse</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller adgangsadressedata og -funktionalitet via et <a href='http://dawa.aws.dk/dok/api/adresse'>adgangsadresse API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete, datavask og reverse geokodnng af adgangsadresser samt udstilling af deres geografiske placering.</p>`;
    break;
  case 'navngivneveje': 
    tekst= `
      <h1 class="display-5">Danmarks navngivne veje</h1>
      <p class="lead">En navngiven vej er et samlet færdselsareal, uafhængigt af kommunegrænser, for hvilket der er fastsat ét vejnavn.</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller data og funktionalitet om navngivne veje via et <a href='http://dawa.aws.dk/dok/api/navngivenvej'>navngiven vej API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodnng af navngivne veje samt udstilling af deres geografiske placering.</p>`;
    break;
  case 'vejstykker': 
    tekst= `
      <h1 class="display-5">Danmarks vejstykker</h1>
      <p class="lead">Et vejstykke er en vej begrænset en kommunes kommunegrænser, for hvilket der er fastsat ét vejnavn.</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller data og funktionalitet om vejstykker via et <a href='http://dawa.aws.dk/dok/api/vejstykke'>vejstykke API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodnng af vejstykker samt udstilling af deres geografiske placering.</p>`;
    break;
  case 'supplerendebynavne2':  
    tekst= `
      <h1 class="display-5">Danmarks supplerende bynavne</h1>
      <p class="lead">Et supplerende bynavn er et lokalt stednavn som indgår i adressebetegnelsen for at præcisere den geografiske beliggenhed af en gruppe adresser.</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller data og funktionalitet om supplerende bynavne via et <a href='http://dawa.aws.dk/dok/api/vejstykke'>supplerende bynavne API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodnng af supplerende bynavn samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'ejerlav': 
    tekst= null;
    break;
  case 'jordstykker':
    tekst= null;
    break;  
  case 'postnumre':  
    tekst= `
      <h1 class="display-5">Danmarks postnumre</h1>
      <p class="lead">Danmark er inddelt i <a href='https://info.aws.dk/postnumre'>postnumre</a>, hvis oprindelige formål var at lette sorteringen af posten. Et postnummer er i Danmark et firecifret tal, som knyttes til et geografisk område.</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller postnummerdata og -funktionalitet via et <a href='http://dawa.aws.dk/dok/api/postnummer'>postnummer API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodnng af postnumre samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'sogne': 
    tekst= `
      <h1 class="display-5">Danmarks sogne</h1>
      <p class="lead"><a href='https://info.aws.dk/sogne'>Sogne i Danmark</a> betegner Folkekirkens sogne. Sogn er betegnelsen for et geografisk område med en fælles kirke. Normalt hører der én kirke til hver sogn, men enkelte sogn har dog mere end en kirke.</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller sognedata og -funktionalitet via et <a href='http://dawa.aws.dk/dok/api/sogn'>sogne API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodnng af sogne samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'politikredse':
    tekst= null;
    break;
  case 'retskredse':
    tekst= null;
    break;
  case 'regioner':
    tekst= null;
    break;
  case 'landsdele':
    tekst= null;
    break;
  case 'kommuner':
    tekst= `
      <h1 class="display-5">Danmarks kommuner</h1>
      <p class="lead">Danmark er inddelt i <a href='https://info.aws.dk/kommuner?udenforkommuneinddeling=false'>98 kommuner</a>. <a href='https://vis.aws.dk/stednavne2/1233766a-0e2c-6b98-e053-d480220a5a3f/Ertholmene'>Ertholmene</a>, er den eneste del af Danmark, som ikke hører under en kommune, men ejes og administreres af Forsvarsministeriet.</p>
      <hr class="my-4">
      <p>Data og funktionalitet vedrørende kommunerne udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/kommune'>kommune API</a>. API'et understøtter bl.a. opslag, indtastning med autocomplete og reverse geokodnng af kommuner samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'afstemningsomraader': 
    tekst= null;
    break;
  case 'menighedsraadsafstemningsomraader':
    tekst= null;
    break;
  case 'opstillingskredse':
    tekst= null;
    break;
  case 'storkredse':
    tekst= null;
    break; 
  case 'valglandsdele':
    tekst= null;
    break;
  case 'bebyggelser':
    tekst= null;
    break;    
  case 'stednavne':
    tekst= null;
   break;    
  case 'stednavne2':
    tekst= null;
    break;      
  case 'steder':
    tekst= null;
    break;      
  case 'stednavntyper':
    tekst= null;
    break; 
  default:   
    tekst= null;
  }
  return tekst;
}

function visListe(data, visEnkeltKort, overskrift, compare, kort=true) {
  return function() {
    danNavbar(overskrift, null, kort);
    eo('table',null,null,
      'class', listetableclasses);
     //visOverskrift('<em>' + capitalizeFirstLetter(overskrift) + '</em>', kort);
      eo('tbody');
      if (compare) data.sort(compare);
      for (let i= 0; i<data.length; i++) {
        visEnkeltKort(data[i], 0);
      }       
      eo('tr', null, null,
        'class', 'table-secondary');
        eo('td');
          html(strong(data.length + " " + overskrift));
        ec('td');
        for (let i= 0; i<3; i++) {
          eo('td');
          ec('td');
        }
      ec('tr');
      ec('tbody');
    ec('table');
  }
}

function visAdresseKort(adresse, indrykninger= 0) {  
  eo('tr');
    eotd(indrykninger);
      eo('span', null, null,
        'class', 'badge badge-pill '+statusFarve(adresse.status));
        text(statusTekst(adresse.status));
      ec('span');
      adresse.vejnavn
      html('<br/>' + util.formatHelAdresse(adresse,false));
    ec('td');
    badge('info', 'badge-primary', adresse.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', adresse.href.replace('dawa','vis'));
    badge('data', 'badge-primary', adresse.href);
  ec('tr');
}

function visAdresse(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses);
      danNavbar(ressource,'<h2><address>' + util.formatHelAdresse(data, false) + '</address></h2');
      eo('tbody'); 
        eo('tr');
          eo('td');
            html('Status: ');
            eo('span', null, null,
                    'class', 'badge badge-pill '+statusFarve(data.status));
                    text(statusTekst(data.status));
            ec('span');
          ec('td');
        ec('tr');                
        eo('tr');
          eo('td');
            html('Id: ' + strong(data.id));
          ec('td');
        ec('tr');  
        eo('tr');
          let oprettet= new Date(data.historik.oprettet);
          eo('td');
            html('Oprettet d. ' + strong(oprettet.toLocaleString()));
          ec('td');
        ec('tr');  
        eo('tr');
          let ændret= new Date(data.historik.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');
        if (data.historik.ikrafttrædelse) { 
          eo('tr');
            let ikrafttrædelse= new Date(data.historik.ikrafttrædelse);
            eo('td');
              html('Ikrafttrådt d. ' + strong(ikrafttrædelse.toLocaleString()));
            ec('td');
          ec('tr');
        }
        if (data.historik.nedlagt) { 
          eo('tr');
            let nedlagt= new Date(data.historik.nedlagt);
            eo('td');
              html('Nedlagt d. ' + strong(nedlagt.toLocaleString()));
            ec('td');
          ec('tr');
        }
        eo('tr');
          eo('td');
            html('Adgangsadresse: ');
          ec('td');
          badge('info', 'badge-primary', data.adgangsadresse.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.adgangsadresse.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.adgangsadresse.href);
        ec('tr');
        adgangsadresseIndhold(data.adgangsadresse, 1); 
      ec('tbody'); 
    ec('table');
  }
}

function visAdgangsadresseKort(adgangsadresse) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+statusFarve(adgangsadresse.status));
        text(statusTekst(adgangsadresse.status));
      ec('span');
      html('<br/>' + util.formatAdgangsadresse(adgangsadresse, false));
    ec('td');
    badge('info', 'badge-primary', adgangsadresse.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', adgangsadresse.href.replace('dawa','vis'));
    badge('data', 'badge-primary', adgangsadresse.href);
  ec('tr');
}

function onClick(event) {
  let e= event;
  window.location.href = 'https://dr.dk';
}

function eotd(indrykninger= 0) {  
  if (indrykninger) {
    eo('td', null, null, 'style', indrykningsStyle(indrykninger)); //, 'onclick', onClick);
  }
  else {
    eo('td'); //, null, null, 'onclick', onClick);
  };    
}

function adgangsadresseIndhold(data, indrykninger= 0)
{    
  eo('tr');
    eotd(indrykninger);
      html('Status: ');
      eo('span', null, null,
              'class', 'badge badge-pill '+statusFarve(data.status));
              text(statusTekst(data.status));
      ec('span');
    ec('td');
  ec('tr');       
  eo('tr');
    eotd(indrykninger);
      html('Id: ' + strong(data.id));
    ec('td');
  ec('tr');  
  eo('tr');
    let oprettet= new Date(data.historik.oprettet);
    eotd(indrykninger);
      html('Oprettet d. ' + strong(oprettet.toLocaleString()));
    ec('td');
  ec('tr');  
  eo('tr');
    let ændret= new Date(data.historik.ændret);    
    eotd(indrykninger);;
      html('Ændret d. ' + strong(ændret.toLocaleString()));
    ec('td');
  ec('tr');
  if (data.historik.ikrafttrædelse) { 
    eo('tr');
      let ikrafttrædelse= new Date(data.historik.ikrafttrædelse);   
      eotd(indrykninger);;
        html('Ikrafttrådt d. ' + strong(ikrafttrædelse.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.historik.nedlagt) { 
    eo('tr');
      let nedlagt= new Date(data.historik.nedlagt);
      eo('td');
        html('Nedlagt d. ' + strong(nedlagt.toLocaleString()));
      ec('td');
    ec('tr');
  }
  eo('tr');    
    eotd(indrykninger);; 
        html('Navngiven vej: ' + strong(data.vejstykke.navn));
     ec('td');
    badge('info', 'badge-primary', data.navngivenvej.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.navngivenvej.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.navngivenvej.href);
  ec('tr'); 
  eo('tr');    
    eotd(indrykninger);;
      html('Vejstykke: ' + strong(data.vejstykke.kode + " " + data.vejstykke.navn));
    ec('td');
    badge('info', 'badge-primary', data.vejstykke.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.vejstykke.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.vejstykke.href);
  ec('tr');
  if (data.supplerendebynavn2) { 
    eo('tr');      
    eotd(indrykninger);;
        html('Supplerende bynavn: ' + strong(data.supplerendebynavn));
      ec('td');
      badge('info', 'badge-primary', data.supplerendebynavn2.href.replace('dawa.aws.dk',host));
      badge('kort', 'badge-primary', data.supplerendebynavn2.href.replace('dawa','vis'));
      badge('data', 'badge-primary', data.supplerendebynavn2.href);
    ec('tr');
  }
  eo('tr');    
    eotd(indrykninger);;
      html('Postnummer: ' + strong(data.postnummer.nr + " " + data.postnummer.navn));
    ec('td');
    badge('info', 'badge-primary', data.postnummer.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.postnummer.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.postnummer.href);
  ec('tr');
  if (data.stormodtagerpostnummer) {
    eo('tr');      
    eotd(indrykninger);;
        html('Stormodtagerpostnummer: ' + strong(data.stormodtagerpostnummer.nr + " " + data.stormodtagerpostnummer.navn));
      ec('td');
      badge('info', 'badge-primary', data.stormodtagerpostnummer.href.replace('dawa.aws.dk',host));
      eo('td');
      ec('td');
     // badge('kort', 'badge-primary', data.stormodtagerpostnummer.href.replace('dawa','vis'));
      badge('data', 'badge-primary', data.stormodtagerpostnummer.href);
    ec('tr');
  }
  visKodeNavn('Kommune', data.kommune, indrykninger);
  visKodeNavn('Sogn', data.sogn, indrykninger);
  if (data.landsdel) {
    eo('tr');    
      eotd(indrykninger);;
        html('Landsdel: ' + strong(data.landsdel.nuts3 + " " + data.landsdel.navn));
      ec('td');
      badge('info', 'badge-primary', data.landsdel.href.replace('dawa.aws.dk',host));
      badge('kort', 'badge-primary', data.landsdel.href.replace('dawa','vis'));
      badge('data', 'badge-primary', data.landsdel.href);
    ec('tr');
  }
  visKodeNavn('Region', data.region, indrykninger);
  visKodeNavn('Retskreds', data.retskreds, indrykninger);
  visKodeNavn('Politikreds', data.politikreds, indrykninger);
  eo('tr');    
    eotd(indrykninger);;
      html('Afstemningsområde: ' + strong(data.afstemningsområde.nummer + " " + data.afstemningsområde.navn));
    ec('td');
    badge('info', 'badge-primary', data.afstemningsområde.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.afstemningsområde.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.afstemningsområde.href);
  ec('tr');
  visKodeNavn('Opstillingskreds', data.opstillingskreds, indrykninger);
  eo('tr');    
    eotd(indrykninger);;
      html('Storkreds: ' + strong(data.storkreds.nummer + " " + data.storkreds.navn));
    ec('td');
    badge('info', 'badge-primary', data.storkreds.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.storkreds.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.storkreds.href);
  ec('tr');
  eo('tr');    
    eotd(indrykninger);;
      html('Valglandsdel: ' + strong(data.valglandsdel.bogstav + " " + data.valglandsdel.navn));
    ec('td');
    badge('info', 'badge-primary', data.valglandsdel.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.valglandsdel.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.valglandsdel.href);
  ec('tr');
  let txtBygningsid= 'bygning';
  eo('tr', null, null, 'id', txtBygningsid, 'style', 'display: none'); 
    getBygning(txtBygningsid, data.id, indrykninger);
    eo('td'); ec('td');
    eo('td'); ec('td');
    eo('td'); ec('td');
    eo('td'); ec('td');
  ec('tr');
  eo('tr');    
    eotd(indrykninger);;
      html('Jordstykke: ' + strong(data.jordstykke.matrikelnr + " " + data.jordstykke.ejerlav.navn));
    ec('td');
    badge('info', 'badge-primary', data.jordstykke.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.jordstykke.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.jordstykke.href);
  ec('tr');
  visKodeNavn('Ejerlav', data.jordstykke.ejerlav, indrykninger);
  if (data.bebyggelser) {
    data.bebyggelser.forEach(bebyggelse => {          
      eo('tr');        
      eotd(indrykninger);;
          html(capitalizeFirstLetter(bebyggelse.type) + ': ' + strong(bebyggelse.navn));
        ec('td');
        badge('info', 'badge-primary', bebyggelse.href.replace('dawa.aws.dk',host));
        badge('kort', 'badge-primary', bebyggelse.href.replace('dawa','vis'));
        badge('data', 'badge-primary', bebyggelse.href);
      ec('tr');
    })
  }       
  eo('tr');    
    eotd(indrykninger);;
      html('Zone: ' + strong(data.zone));
    ec('td');
  ec('tr');         
  eo('tr');    
    eotd(indrykninger);;
      html('Brofast: ' + strong(data.brofast?"Ja":"Nej"));
    ec('td');
  ec('tr');          
  eo('tr');    
    eotd(indrykninger);;
      html('Adgangspunkt:');
    ec('td');
  ec('tr');              
  eo('tr');    
    eotd(indrykninger+1);;
      html('Id: ' + strong(data.adgangspunkt.id));
    ec('td');
  ec('tr'); 
  eo('tr');
    let apændret= new Date(data.adgangspunkt.ændret);
    eotd(indrykninger+1);
      html('Ændret d. ' + strong(apændret.toLocaleString()));
    ec('td');
  ec('tr');            
  eo('tr');    
    eotd(indrykninger+1);;
      html('Højde (m.o.h.): ' + strong(data.adgangspunkt.højde));
    ec('td');
  ec('tr');                
  eo('tr');    
    eotd(indrykninger+1);;
      html('Nøjagtighed: ' + strong(data.adgangspunkt.nøjagtighed + ' - ' + nøjagtighedTekst(data.adgangspunkt.nøjagtighed)));
    ec('td');
  ec('tr');                    
  eo('tr');    
    eotd(indrykninger+1);;
      html('Kilde: ' + strong(data.adgangspunkt.kilde + ' - ' + kildeTekst(data.adgangspunkt.kilde)));
    ec('td');
  ec('tr');                 
  eo('tr');    
    eotd(indrykninger+1);;
      html('Teknisk standard: ' + strong(data.adgangspunkt.tekniskstandard + ' - ' + tekniskstandardTekst(data.adgangspunkt.tekniskstandard)));
    ec('td');
  ec('tr');                   
  eo('tr');    
    eotd(indrykninger+1);;
      html('Tekstretning: ' + strong(data.adgangspunkt.tekstretning));
    ec('td');
  ec('tr');            
  eo('tr');    
    eotd(indrykninger);;
      html('Vejpunkt:');
    ec('td');
  ec('tr');              
  eo('tr');    
    eotd(indrykninger+1);;
      html('Id: ' + strong(data.vejpunkt.id));
    ec('td');
  ec('tr'); 
  // eo('tr');
  //   let apændret= new Date(data.vejpunkt.ændret);
  //   eotd(indrykninger+1);
  //     html('Ændret d. ' + strong(apændret.toLocaleString()));
  //   ec('td');
  // ec('tr');           
  eo('tr');    
    eotd(indrykninger+1);;
      html('Nøjagtighed: ' + strong(data.vejpunkt.nøjagtighed + ' - ' + nøjagtighedTekst(data.vejpunkt.nøjagtighed)));
    ec('td');
  ec('tr');                    
  eo('tr');    
    eotd(indrykninger+1);;
      html('Kilde: ' + strong(data.vejpunkt.kilde));
    ec('td');
  ec('tr');                 
  eo('tr');    
    eotd(indrykninger+1);;
      html('Teknisk standard: ' + strong(data.vejpunkt.tekniskstandard + ' - ' + tekniskstandardTekst(data.vejpunkt.tekniskstandard)));
    ec('td');
  ec('tr');
}

function getBygning(id, adgangsadresseid, indrykninger) {
  const url= dawaUrl.origin + '/bygninger?adgangsadresseid=' + adgangsadresseid;
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( data ) {
        if (data.length > 0) {
          let element= document.getElementById(id);           
          element.style.display = "table-row";
          dom.patch(element, () => {
            eotd(indrykninger);
                html('Bygning: ');
            ec('td');
            badge('info', 'badge-primary', url.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', url.replace('dawa','vis'));
            badge('data', 'badge-primary', url); 
          });
        }
      });
    };
  });
}

function visAdgangsadresse(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); 
      danNavbar(ressource,'<h2><address>' + util.formatAdgangsadresse(data, false) + '</address></h2');
      eo('tbody');
        adgangsadresseIndhold(data);
        eo('tr');
          eo('td');
            html('Tilknyttede adresser');
          ec('td');
          let adrurl= origin + "/adresser?adgangsadresseid=" + data.id;
          badge('info', 'badge-primary', adrurl);
          badge('kort', 'badge-primary', adrurl.replace('info','vis'));
          badge('data', 'badge-primary', adrurl.replace('info','dawa'));
        ec('tr');
      ec('tbody'); 
      let adgangsadressensadresser= 'adgangsadressensadresser';
      eo('tbody', null, null, 'id', adgangsadressensadresser);
          getAdresser(adgangsadressensadresser, data.id);
      ec('tbody'); 
    ec('table');
  }
}

function adgangsadresseCompare(a, b) {

  let apostnr= parseInt(a.postnummer.nr);
  let bpostnr= parseInt(b.postnummer.nr);

  let dif= apostnr - bpostnr;

  if (dif > 0) {
    return 1;
  }
  else if (dif < 0) {
    return -1;
  } 


  if (a.vejstykke.navn < b.vejstykke.navn) {
    return -1;
  }
  if (a.vejstykke.navn > b.vejstykke.navn) {
    return 1;
  }


  var reHusnr = /(\d+)([A-ZÆØÅ]?)/;

  var aArray = a.husnr.match(reHusnr);
  var bArray = b.husnr.match(reHusnr);

  let ahusnr= parseInt(aArray[1]);
  let bhusnr= parseInt(bArray[1]);

  dif= ahusnr - bhusnr;

  if (dif > 0) {
    return 1;
  }
  else if (dif < 0) {
    return -1;
  } 

  let aBogstav= aArray[2];
  let bBogstav= bArray[2];

  if (aBogstav < bBogstav) {
    return -1;
  }
  if (aBogstav > bBogstav) {
    return 1;
  }

  return 0;
}

function etage2int(etage) {
  if (!etage) {
    return -9999;
  }
  if (etage.match(/^\d+$/)) {
    return parseInt(etage);
  }
  else if (etage.match(/^st$/)) {
    return 0;
  }
  else if (etage.match(/^kl$/)) {
    return -1;
  }
  let ar= etage.match(/^k(\d+)$/);
  return -parseInt(ar[1]);
}

function dør2str(dør) {
  if (!dør) {
    dør= '';
  }
  else if (dør === 'tv') {
    return ' ';
  }
  else if (dør === 'mf') {
    return '  ';
  }
  else if (dør == 'th') {
    return '   ';
  }
  return dør;
}

function adresseCompare(a, b) {

  let aa= adgangsadresseCompare(a.adgangsadresse, b.adgangsadresse);
  if (aa !== 0) return aa;

  let aetage= etage2int(a.etage);
  let betage= etage2int(b.etage);

  let dif= aetage - betage;

  if (dif > 0) {
    return 1;
  }
  else if (dif < 0) {
    return -1;
  } 

  let adør= dør2str(a.dør);
  let bdør= dør2str(b.dør);

  if (adør < bdør) {
    return -1;
  }
  if (adør > bdør) {
    return 1;
  }

  return 0;
}

function getAdresser(id, adgangsadresseid) {
  const url= dawaUrl.origin + "/adresser?adgangsadresseid=" + adgangsadresseid;;
  fetch(url).then( function(response) {
    response.json().then( function ( data ) {
      dom.patch(document.getElementById(id), () => {
        data.sort(adresseCompare);
        data.forEach(adresse => {
          visAdresseKort(adresse,1); 
          // eo('tr'); 
          //   eotd(1);
          //     html(strong(adresse.kode + " " + adresse.navn));
          //   ec('td');
          //   badge('info', 'badge-primary', adresse.href.replace('dawa.aws.dk',host));
          //   badge('kort', 'badge-primary', adresse.href.replace('dawa','vis'));
          //   badge('data', 'badge-primary', adresse.href);
          // ec('tr');
        });   
      });
    });
  });
}                

function visNavngivnevejKort(navngivenvej) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+darstatusFarve(navngivenvej.darstatus));
        text(navngivenvej.darstatus);
      ec('span');
      html('<br/>' + strong(navngivenvej.navn + ' (' + navngivenvej.administrerendekommune.kode + ' ' +  navngivenvej.administrerendekommune.navn + ')'));
    ec('td');
    badge('info', 'badge-primary', navngivenvej.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', navngivenvej.href.replace('dawa','vis'));
    badge('data', 'badge-primary', navngivenvej.href);
  ec('tr');
}

function visNavngivnevej(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.navn + ' (' + data.administrerendekommune.kode + ' ' +  data.administrerendekommune.navn + ')' + '</h2');
      eo('tbody');
        eo('tr');
          eo('td');
            html('Status: '); 
            eo('span', null, null,
              'class', 'badge badge-pill '+darstatusFarve(data.darstatus));
              text(data.darstatus);
            ec('span');
          ec('td');
        ec('tr');            
        eo('tr');
          eo('td');
            html('Id: ' + strong(data.id));
          ec('td');
        ec('tr');         
        eo('tr');
          let oprettet= new Date(data.historik.oprettet);
          eo('td');
            html('Oprettet d. ' + strong(oprettet.toLocaleString()));
          ec('td');
        ec('tr');  
        eo('tr');
          let ændret= new Date(data.historik.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');
        if (data.historik.ikrafttrædelse) { 
          eo('tr');
            let ikrafttrædelse= new Date(data.historik.ikrafttrædelse);
            eo('td');
              html('Ikrafttrådt d. ' + strong(ikrafttrædelse.toLocaleString()));
            ec('td');
          ec('tr');
        }
        if (data.historik.nedlagt) { 
          eo('tr');
            let nedlagt= new Date(data.historik.nedlagt);
            eo('td');
              html('Nedlagt d. ' + strong(nedlagt.toLocaleString()));
            ec('td');
          ec('tr');
        }   
        visKodeNavn('Administrende kommune', data.administrerendekommune);             
        eo('tr');
          eo('td');
            html('Adresseringsnavn: ' + strong(data.adresseringsnavn));
          ec('td');
        ec('tr');               
        eo('tr');
          eo('td');
            html('Udtalt vejnavn: ' + strong(data.udtaltvejnavn));
          ec('td');
        ec('tr');                  
        eo('tr');
          eo('td');
            html('Retskrivningskontrol: ' + strong(data.retskrivningskontrol));
          ec('td');
        ec('tr');
        if (data.vejstykker) {                     
          eo('tr');
            eo('td');
              html('Vejstykker: ');
            ec('td');
          ec('tr');
          data.vejstykker.forEach(vejstykke => {          
            eo('tr');
              eo('td', null, null, 'style', 'padding-left:2em ');
                html(strong(vejstykke.kode + " " + data.navn + " (" + vejstykke.kommunekode + ")"));
              ec('td');
              badge('info', 'badge-primary', vejstykke.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', vejstykke.href.replace('dawa','vis'));
              badge('data', 'badge-primary', vejstykke.href);
            ec('tr');
          }) 
        }
        if (data.postnumre) { eo('tr');
          eo('td');
              html('Postnumre: ');
            ec('td');
          ec('tr');
          data.postnumre.forEach(postnummer => {          
            eo('tr');
              eo('td', null, null, 'style', 'padding-left:2em ');
                html(strong(postnummer.nr + " " + postnummer.navn));
              ec('td');
              badge('info', 'badge-primary', postnummer.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', postnummer.href.replace('dawa','vis'));
              badge('data', 'badge-primary', postnummer.href);
            ec('tr');
          }) 
        }                    
        eo('tr');
          eo('td');
            html('Beliggenhedens oprindelse: ');
          ec('td');
        ec('tr');          
        eo('tr');
          eo('td', null, null, 'style', 'padding-left:2em ');
            let registreret= new Date(data.beliggenhed.oprindelse.registrering);
            html('Registreret d. ' + strong(registreret.toLocaleString()));
          ec('td');
        ec('tr');               
        eo('tr');
          eo('td', null, null, 'style', 'padding-left:2em ');
            html('Kilde: ' + strong(data.beliggenhed.oprindelse.kilde));
          ec('td');
        ec('tr');
        eo('tr');
          eo('td', null, null, 'style', 'padding-left:2em ');
            html('Nøjagtighedsklasse: ' + strong(data.beliggenhed.oprindelse.nøjagtighedsklasse + ' - ' + beliggenhedNøjagtighedTekst(data.beliggenhed.oprindelse.nøjagtighedsklasse)));
          ec('td');
        ec('tr');          
        eo('tr');
          eo('td', null, null, 'style', 'padding-left:2em ');
            html('Teknisk standard: ' + strong(data.beliggenhed.oprindelse.tekniskstandard + ' - ' + tekniskstandardTekst(data.beliggenhed.oprindelse.tekniskstandard)));
          ec('td');
        ec('tr');         
      ec('tbody'); 
    ec('table');
  }
}


function visBygningKort(bygning) {  
  eo('tr');
    eo('td');
      html(strong('Bygning ' + bygning.id));
    ec('td');
    badge('info', 'badge-primary', bygning.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', bygning.href.replace('dawa','vis'));
    badge('data', 'badge-primary', bygning.href);
  ec('tr');
}

function visBygning(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + em('Bygning: ') + strong(data.id) + '</h2');
      eo('tbody');          
        eo('tr');
          eo('td');
            html('Id: ' + strong(data.id));
          ec('td');
        ec('tr');
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');             
        eo('tr');
          eo('td');
            html('Bygningstype: ' + strong(data.bygningstype));
          ec('td');
        ec('tr');               
        eo('tr');
          eo('td');
            html('3D metode: ' + strong(data.metode3d));
          ec('td');
        ec('tr');                  
        eo('tr');
          eo('td');
            html('Målested: ' + strong(data.målested));
          ec('td');
        ec('tr');                
        eo('tr');
          eo('td');
            html('Synlig: ' + strong(data.synlig?'ja':'nej'));
          ec('td');
        ec('tr');                     
        eo('tr');
          eo('td');
            html('Overlap: ' + strong(data.overlap?'ja':'nej'));
          ec('td');
        ec('tr');                         
        eo('tr');
          eo('td');
            html('Kommuner: ');
          ec('td');
        ec('tr');
        data.kommuner.forEach(kommune => {          
          eo('tr');
            eotd(1);
              html(strong(kommune.kode + " " + kommune.navn));
            ec('td');
            badge('info', 'badge-primary', kommune.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', kommune.href.replace('dawa','vis'));
            badge('data', 'badge-primary', kommune.href);
          ec('tr');
        });                       
        eo('tr');
          eo('td');
            html('Indeholdte adgangsadresser: ');
          ec('td');
        ec('tr');
          data.adgangsadresser.forEach(adgangsadresse => {          
            eo('tr');
              eotd(1);
                html(strong(adgangsadresse.adressebetegnelse));
              ec('td');
              badge('info', 'badge-primary', adgangsadresse.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', adgangsadresse.href.replace('dawa','vis'));
              badge('data', 'badge-primary', adgangsadresse.href);
            ec('tr');
          }) 
      ec('tbody'); 
    ec('table');
  }
}

function visVejstykkeKort(data) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+darstatusFarve(data.darstatus));
        text(darstatusTekst(data.darstatus));
      ec('span');
      html('<br/>' + strong(data.kode + ' ' + data.navn + ' (' + data.kommune.kode + ' ' +  data.kommune.navn + ')'));
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visVejstykke(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.kode + ' ' + data.navn + ' (' + data.kommune.kode + ' ' +  data.kommune.navn + ')' + '</h2');
      eo('tbody'); 
        eo('tr');
          eo('td');
            html('Status: '); 
            eo('span', null, null,
              'class', 'badge badge-pill '+darstatusFarve(data.darstatus));
              text(darstatusTekst(data.darstatus));
            ec('span');
          ec('td');
        ec('tr');             
        eo('tr');
          eo('td');
            html('Id: ' + strong(data.id));
          ec('td');
        ec('tr');   
        eo('tr');
          let oprettet= new Date(data.historik.oprettet);
          eo('td');
            html('Oprettet d. ' + strong(oprettet.toLocaleString()));
          ec('td');
        ec('tr');  
        eo('tr');
          let ændret= new Date(data.historik.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');            
        eo('tr');
          eo('td');
            html('Adresseringsnavn: ' + strong(data.adresseringsnavn));
          ec('td');
        ec('tr');        
        visKodeNavn('Kommune', data.kommune); 
        eo('tr');
          eo('td');
            html('Navngiven vej: ' + strong(data.navn));
          ec('td');
          badge('info', 'badge-primary', data.navngivenvej.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.navngivenvej.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.navngivenvej.href);
        ec('tr');
        if (data.postnumre) {                     
          eo('tr');
            eo('td');
              html('Postnumre: ');
            ec('td');
          ec('tr');
          data.postnumre.forEach(postnummer => {          
            eo('tr');
              eo('td', null, null, 'style', 'padding-left:2em ');
                html(strong(postnummer.nr + " " + postnummer.navn));
              ec('td');
              badge('info', 'badge-primary', postnummer.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', postnummer.href.replace('dawa','vis'));
              badge('data', 'badge-primary', postnummer.href);
            ec('tr');
          }) 
        } 
      ec('tbody'); 
    ec('table');
  }
}

function vejnavneCompare(a, b) {

  if (a.navn < b.navn) {
    return -1;
  }
  if (a.navn > b.navn) {
    return 1;
  }

  return 0;
}

function visVejnavnKort(data) {  
  eo('tr');
    eo('td');
      html(strong(data.navn));
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visVejnavn(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.navn + '</h2', false);
      eo('tbody');                       
        eo('tr');
          eo('td');
            html('Kommuner: ');
          ec('td');
        ec('tr');
        data.kommuner.forEach(kommune => {          
          eo('tr');
            eo('td', null, null, 'style', 'padding-left:2em ');
              html(strong(kommune.kode + " " + kommune.navn));
            ec('td');
            badge('info', 'badge-primary', kommune.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', kommune.href.replace('dawa','vis'));
            badge('data', 'badge-primary', kommune.href);
          ec('tr');
        });
        if (data.postnumre) {                     
          eo('tr');
            eo('td');
              html('Postnumre: ');
            ec('td');
          ec('tr');
          data.postnumre.forEach(postnummer => {          
            eo('tr');
              eo('td', null, null, 'style', 'padding-left:2em ');
                html(strong(postnummer.nr + " " + postnummer.navn));
              ec('td');
              badge('info', 'badge-primary', postnummer.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', postnummer.href.replace('dawa','vis'));
              badge('data', 'badge-primary', postnummer.href);
            ec('tr');
          }) 
        } 
      ec('tbody'); 
    ec('table');
  }
}

function visSupplerendeBynavnKort(data) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+darstatusFarve(data.darstatus));
        text(darstatusTekst(data.darstatus));
      ec('span');
      html('<br/>' + strong(data.navn));
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visSupplerendeBynavn(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.navn + '</h2'); 
      eo('tbody');
        eo('tr');
          eo('td');
            html('Status: '); 
            eo('span', null, null,
              'class', 'badge badge-pill '+darstatusFarve(data.darstatus));
              text(darstatusTekst(data.darstatus));
            ec('span');
          ec('td');
        ec('tr');             
        eo('tr');
          eo('td');
            html('DAGI id: ' + strong(data.dagi_id));
          ec('td');
        ec('tr');    
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');    
        visKodeNavn('Kommune', data.kommune);          
        eo('tr');
          eo('td');
            html('Postnumre: ');
          ec('td');
        ec('tr');
          data.postnumre.forEach(postnummer => {          
            eo('tr');
              eo('td', null, null, 'style', 'padding-left:2em ');
                html(strong(postnummer.nr + " " + postnummer.navn));
              ec('td');
              badge('info', 'badge-primary', postnummer.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', postnummer.href.replace('dawa','vis'));
              badge('data', 'badge-primary', postnummer.href);
            ec('tr');
          })       
      ec('tbody'); 
    ec('table');
  }
}

function visEjerlavetKort(ejerlavet) {  
  eo('tr');
    eo('td');
      html(strong(ejerlavet.kode + ' ' +ejerlavet.navn));
    ec('td');
    badge('info', 'badge-primary', ejerlavet.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', ejerlavet.href.replace('dawa','vis'));
    badge('data', 'badge-primary', ejerlavet.href);
  ec('tr');
}

function visEjerlavet(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.kode + ' ' +data.navn + '</h2'); 
      eo('tbody'); 
      ec('tbody'); 
    ec('table');
  }
}


function visJordstykkeKort(data) {  
  eo('tr');
    eo('td');
      html(data.matrikelnr + ' ' + data.ejerlav.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visJordstykke(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.matrikelnr + ' ' + data.ejerlav.navn + '</h2'); 
      eo('tbody');  
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');   
        visKodeNavn('Ejerlav', data.ejerlav);
        visKodeNavn('Sogn', data.sogn);
        visKodeNavn('Kommune', data.kommune);
        visKodeNavn('Region', data.region);
        visKodeNavn('Retskreds', data.retskreds);
        if (data.moderjordstykke) { 
          let id= 'moderjordstykke';                  
          eo('tr', null, null, 'id', id);
            eo('td');
            html('Moderjordstykke: ' + strong(data.moderjordstykke));
            ec('td');
            getJordstykke(id, data.moderjordstykke);
          ec('tr');
        } 
        eo('tr');
          eo('td');
            html('Fælleslod: ' + strong(data.fælleslod?'Ja':'Nej'));
          ec('td');
        ec('tr');                  
        eo('tr');
          eo('td');
            html('Registreret areal: ' + strong(data.registreretareal));
          ec('td');
        ec('tr');              
        eo('tr');
          eo('td');
            html('Arealberegningsmetode: ' + strong(data.arealberegningsmetode + ' - ' + arealberegningsmetodeTekst(data.arealberegningsmetode)));
          ec('td');
        ec('tr');               
        eo('tr');
          eo('td');
            html('Vejareal: ' + strong(data.vejareal));
          ec('td');
        ec('tr');                   
        eo('tr');
          eo('td');
            html('Vejarealberegningsmetode: ' + strong(data.vejarealberegningsmetode + ' - ' + vejarealberegningsmetodeTekst(data.vejarealberegningsmetode)));
          ec('td');
        ec('tr');                   
        eo('tr');
          eo('td');
            html('Vandarealberegningsmetode: ' + strong(data.vandarealberegningsmetode + ' - ' + vandarealberegningsmetodeTekst(data.vandarealberegningsmetode)));
          ec('td');
        ec('tr');        
        eo('tr');
          eo('td');
            html('ESR ejendomsnnummer: ' + strong(data.esrejendomsnr));
          ec('td');
        ec('tr');                   
        eo('tr');
          eo('td');
            html('Udvidet ESR ejendomsnnummer: ' + strong(data.udvidet_esrejendomsnr));
          ec('td');
        ec('tr');         
        eo('tr');
          eo('td');
            html('SFE ejendomsnnummer: ' + strong(data.sfeejendomsnr));
          ec('td');
        ec('tr');              
      ec('tbody');
      let tilknyttedeJordstykker= 'tilknyttedeJordstykker';
      eo('tbody', null, null, 'id', tilknyttedeJordstykker);
          getTilknyttedeJordstykker(tilknyttedeJordstykker, data.featureid);
      ec('tbody'); 
    ec('table');
  }
}

function getTilknyttedeJordstykker(id, moderjorstykke) {
  const url= dawaUrl.origin + '/jordstykker?moderjordstykke=' + moderjorstykke;;
  fetch(url).then( function(response) {
    response.json().then( function ( data ) {
      if (data.length > 0) {
        dom.patch(document.getElementById(id), () => {                  
          eo('tr');
            eo('td');
              html('Børnejordstykker: ');
            ec('td');
          ec('tr');
          data.forEach(jordstykke => {  
            eo('tr'); 
              eotd(1);
                html(strong(jordstykke.matrikelnr + " " + jordstykke.ejerlav.navn));
              ec('td');
              badge('info', 'badge-primary', jordstykke.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', jordstykke.href.replace('dawa','vis'));
              badge('data', 'badge-primary', jordstykke.href);
            ec('tr');
          });
        });  
      }; 
    });
  });
}        

function getJordstykke(id, featureid) {
  const url= dawaUrl.origin + '/jordstykker?featureid=' + featureid;
  fetch(url).then( function(response) {
    response.json().then( function ( data ) {
      dom.patch(document.getElementById(id), () => {
        eo('td');
        html('Moderjordstykke: ' + strong(data[0].featureid));
        ec('td');
        badge('info', 'badge-primary', url.replace('dawa.aws.dk',host));
        badge('kort', 'badge-primary', url.replace('dawa','vis'));
        badge('data', 'badge-primary', url);
      });
    });
  });
}

function visDAGIKort(data) {  
  eo('tr');
    eo('td');
      html(data.kode + ' ' + data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visDAGI(ressource) {
  return function (data) {
    return function() {
      eo('table',null,null,
        'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.kode + ' ' + data.navn + '</h2');
        eo('tbody');          
          eo('tr');
            eo('td');
              html('DAGI id: ' + strong(data.dagi_id));
            ec('td');
          ec('tr');  
          eo('tr');
            let ændret= new Date(data.ændret);
            eo('td');
              html('Ændret d. ' + strong(ændret.toLocaleString()));
            ec('td');
          ec('tr');         
        ec('tbody'); 
      ec('table');
    }
  }
}

function visKommuneKort(data) {  
  eo('tr');
    eo('td');
      html(data.kode + ' ' + data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visKommune(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.kode + ' ' + data.navn + '</h2'); 
      eo('tbody');   
        eo('tr');
          eo('td');
            html('DAGI id: ' + strong(data.dagi_id));
          ec('td');
        ec('tr');  
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');              
        eo('tr');
          eo('td');
            html('Udenfor kommuneinddeling: ' + strong(data.udenforkommuneinddeling?'Ja':'Nej'));
          ec('td');
        ec('tr'); 
        let id= 'kommuneregion';          
        eo('tr', null, null, 'id', id);
          eo('td');
            html('Regionskode: ' + strong(data.regionskode));
            getRegion(id, data.regionskode);
          ec('td');
        ec('tr');         
      ec('tbody'); 
    ec('table');
  }
}

function getRegion(id, regionskode) {
  const url= dawaUrl.origin + '/regioner/' + regionskode;
  fetch(url).then( function(response) {
    response.json().then( function ( data ) {
      dom.patch(document.getElementById(id), () => {
        eo('td');
            html('Region: ' + strong(data.kode + ' ' + data.navn));
        ec('td');
        badge('info', 'badge-primary', url.replace('dawa.aws.dk',host));
        badge('kort', 'badge-primary', url.replace('dawa','vis'));
        badge('data', 'badge-primary', url);
      });
    });
  });
}


function visLandsdelKort(data) {  
  eo('tr');
    eo('td');
      html(strong(data.navn));
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visLandsdel(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.navn + '</h2');   
      eo('tbody');        
        eo('tr');
          eo('td');
            html('NUTS 3: ' + strong(data.nuts3));
          ec('td');
        ec('tr');            
        eo('tr');
          eo('td');
            html('DAGI id: ' + strong(data.dagi_id));
          ec('td');
        ec('tr');    
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');    
        visKodeNavn('Region', data.region);
      ec('tbody'); 
    ec('table');
  }
}

function visRegionKort(data) {  
  eo('tr');
    eo('td');
      html(data.kode + ' ' + data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visRegion(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.kode + ' ' + data.navn + '</h2');   
      eo('tbody');   
        eo('tr');
          eo('td');
            html('DAGI id: ' + strong(data.dagi_id));
          ec('td');
        ec('tr');  
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');                   
        eo('tr');
          eo('td');
            html('Kommuner: ');
          ec('td');
        ec('tr');
      ec('tbody'); 
      let regionskommuner= 'regionskommuner';
      eo('tbody', null, null, 'id', regionskommuner);
          getKommuner(regionskommuner, data.kode);
      ec('tbody'); 
    ec('table');
  }
}

function getKommuner(id, regionskode) {
  const url= dawaUrl.origin + '/kommuner?regionskode=' + regionskode;;
  fetch(url).then( function(response) {
    response.json().then( function ( data ) {
      dom.patch(document.getElementById(id), () => {
        data.forEach(kommune => { 
          eo('tr'); 
            eotd(1);
              html(strong(kommune.kode + " " + kommune.navn));
            ec('td');
            badge('info', 'badge-primary', kommune.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', kommune.href.replace('dawa','vis'));
            badge('data', 'badge-primary', kommune.href);
          ec('tr');
        });   
      });
    });
  });
}                 

function visAfstemningsområdeKort(data) {  
  eo('tr');
    eo('td');
      html(data.kommune.kode + ' ' + data.nummer + ' ' + data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visAfstemningsområde(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.nummer + ' ' + data.navn + '</h2'); 
      eo('tbody');          
        eo('tr');
          eo('td');
            html('DAGI id: ' + strong(data.dagi_id));
          ec('td');
        ec('tr');    
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');      
        eo('tr');
          eo('td');
            html('Afstemningssted: ' + strong(data.afstemningssted.navn + ', ' + data.afstemningssted.adgangsadresse.adressebetegnelse));
          ec('td');
          badge('info', 'badge-primary', data.afstemningssted.adgangsadresse.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.afstemningssted.adgangsadresse.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.afstemningssted.adgangsadresse.href);
        ec('tr');   
        visNummerNavn('Opstillingskreds', data.opstillingskreds);  
        visNummerNavn('Storkreds', data.storkreds);         
        visBogstavNavn('Valglandsdel', data.valglandsdel); 
        visKodeNavn('Kommune', data.kommune);
        visKodeNavn('Region', data.region); 
      ec('tbody'); 
    ec('table');
  }
}

function visMenighedsraadsafstemningsområdeKort(data) {  
  eo('tr');
    eo('td');
      html(data.kommune.kode + ' ' + data.nummer + ' ' + data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visMenighedsraadsafstemningsområde(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.nummer + ' ' + data.navn + '</h2'); 
      eo('tbody');        
        eo('tr');
          eo('td');
            html('DAGI id: ' + strong(data.dagi_id));
          ec('td');
        ec('tr');  
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr'); 
        visKodeNavn('Kommune', data.kommune);
        visKodeNavn('Sogn', data.sogn); 
      ec('tbody'); 
    ec('table');
  }
}

function visOpstillingskredsKort(data) {  
  eo('tr');
    eo('td');
      html(data.nummer + ' ' + data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host),);
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visOpstillingskreds(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.nummer + ' ' + data.navn + '</h2');
      eo('tbody');        
        eo('tr');
          eo('td');
            html('DAGI id: ' + strong(data.dagi_id));
          ec('td');
        ec('tr');
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');         
        eo('tr');
          eo('td');
            html('Valgkredsnummer: ' + strong(data.valgkredsnummer));
          ec('td');
        ec('tr');   
        visNummerNavn('Storkreds', data.storkreds);         
        visBogstavNavn('Valglandsdel', data.valglandsdel);
        visKodeNavn('Region', data.region); 
        visKodeNavn('Kredskommune', data.kredskommune);                      
        eo('tr');
          eo('td');
            html('Kommuner: ');
          ec('td');
        ec('tr');
        data.kommuner.forEach(kommune => {          
          eo('tr');
            eo('td', null, null, 'style', 'padding-left:2em ');
              html(strong(kommune.kode + " " + kommune.navn));
            ec('td');
            badge('info', 'badge-primary', kommune.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', kommune.href.replace('dawa','vis'));
            badge('data', 'badge-primary', kommune.href);
          ec('tr');
        });
        eo('tr');
          eo('td');
            html('Afstemningsområder: ');
          ec('td');
        ec('tr');
      ec('tbody'); 
      let opstillingskredsafstemningsområder= 'opstillingskredsafstemningsområder';
      eo('tbody', null, null, 'id', opstillingskredsafstemningsområder);
          getAfstemningsområder(opstillingskredsafstemningsområder, data.nummer);
      ec('tbody'); 
    ec('table');
  }
}

function getAfstemningsområder(id, opstillingskredsnummer) {
  const url= dawaUrl.origin + '/afstemningsomraader?opstillingskredsnummer=' + opstillingskredsnummer;;
  fetch(url).then( function(response) {
    response.json().then( function ( data ) {
      dom.patch(document.getElementById(id), () => {
        data.forEach(afstemningsområde => { 
          eo('tr'); 
            eotd(1);
              html(strong(afstemningsområde.nummer + " " + afstemningsområde.navn));
            ec('td');
            badge('info', 'badge-primary', afstemningsområde.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', afstemningsområde.href.replace('dawa','vis'));
            badge('data', 'badge-primary', afstemningsområde.href);
          ec('tr');
        });   
      });
    });
  });
}       

function visStorkredsKort(data) {  
  eo('tr');
    eo('td');
      html(data.nummer + ' ' + data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visStorkreds(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.nummer + ' ' + data.navn + '</h2');
      eo('tbody'); 
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr'); 
        visKodeNavn('Region', data.region);             
        visBogstavNavn('Valglandsdel', data.valglandsdel);
        eo('tr');
          eo('td');
            html('Opstillingskredse: ');
          ec('td');
        ec('tr');
      ec('tbody'); 
      let storkredsopstillingskredse= 'storkredsopstillingskredse';
      eo('tbody', null, null, 'id', storkredsopstillingskredse);
          getOpstillingskredse(storkredsopstillingskredse, data.nummer);
      ec('tbody'); 
    ec('table');
  }
}

function getOpstillingskredse(id, storkredsnummer) {
  const url= dawaUrl.origin + '/opstillingskredse?storkredsnummer=' + storkredsnummer;;
  fetch(url).then( function(response) {
    response.json().then( function ( data ) {
      dom.patch(document.getElementById(id), () => {
        data.forEach(opstillingskreds => { 
          eo('tr'); 
            eotd(1);
              html(strong(opstillingskreds.nummer + " " + opstillingskreds.navn));
            ec('td');
            badge('info', 'badge-primary', opstillingskreds.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', opstillingskreds.href.replace('dawa','vis'));
            badge('data', 'badge-primary', opstillingskreds.href);
          ec('tr');
        });   
      });
    });
  });
}       

function visValglandsdelKort(data) {  
  eo('tr');
    eo('td');
      html(data.bogstav + ' ' + data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visValglandsdel(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.bogstav + ' ' + data.navn + '</h2');
      eo('tbody'); 
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');
        eo('tr');
            eo('td');
              html('Storkredse: ');
            ec('td');
          ec('tr');
        ec('tbody'); 
        let valglandsdelestorkredse= 'valglandsdelestorkredse';
      eo('tbody', null, null, 'id', valglandsdelestorkredse);
          getStorkredse(valglandsdelestorkredse, data.bogstav);
      ec('tbody'); 
    ec('table');
  }
}

function getStorkredse(id, valglandsdelsbogstav) {
  const url= dawaUrl.origin + '/storkredse?valglandsdelsbogstav=' + valglandsdelsbogstav;;
  fetch(url).then( function(response) {
    response.json().then( function ( data ) {
      dom.patch(document.getElementById(id), () => {
        data.forEach(storkreds => { 
          eo('tr'); 
            eotd(1);
              html(strong(storkreds.nummer + " " + storkreds.navn));
            ec('td');
            badge('info', 'badge-primary', storkreds.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', storkreds.href.replace('dawa','vis'));
            badge('data', 'badge-primary', storkreds.href);
          ec('tr');
        });   
      });
    });
  });
}            

function visPostnummerKort(data) {  
  eo('tr');
    eo('td');
      html(data.nr + ' ' + data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visPostnummer(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.nr + ' ' + data.navn + '</h2');
      eo('tbody');
        if (data.stormodtageradresser) {                      
          eo('tr');
            eo('td');
              html('Stormodtageradresser: ');
            ec('td');
          ec('tr');
            data.stormodtageradresser.forEach(aa => {          
              eo('tr', null, null, 'id', aa.id);
                eo('td', null, null, 'style', 'padding-left:2em ');
                  html(strong(aa.id));
                  getStormodtager(aa.id, aa.href);
                ec('td');
              ec('tr');
            })   
          }                        
        eo('tr');
          eo('td');
            html('Kommuner: ');
          ec('td');
        ec('tr');
          data.kommuner.forEach(kommune => {          
            eo('tr');
              eo('td', null, null, 'style', 'padding-left:2em ');
                html(strong(kommune.kode + " " + kommune.navn));
              ec('td');
              badge('info', 'badge-primary', kommune.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', kommune.href.replace('dawa','vis'));
              badge('data', 'badge-primary', kommune.href);
            ec('tr');
          })      
      ec('tbody'); 
    ec('table');
  }
}

function getStormodtager(id, href) {
  const url= href;
  fetch(url).then( function(response) {
    response.json().then( function ( data ) {
      dom.patch(document.getElementById(id), () => {
        eo('td', null, null, 'style', 'padding-left:2em ');
            html(strong(util.formatAdgangsadresse(data,true)));
        ec('td');
        badge('info', 'badge-primary', url.replace('dawa.aws.dk',host));
        badge('kort', 'badge-primary', url.replace('dawa','vis'));
        badge('data', 'badge-primary', url);
      });
    });
  });
}


function visStednavnKort(data) {  
  eo('tr');
    eo('td');
      html(data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visStednavn(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.navn + '</h2');
      eo('tbody');          
        eo('tr');
          eo('td');
            html('Id: ' + strong(data.id));
          ec('td');
        ec('tr');  
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');        
        eo('tr');
          eo('td');
            html('Hovedtype: ' + strong(data.hovedtype));
          ec('td');
        ec('tr');              
        eo('tr');
          eo('td');
            html('Undertype: ' + strong(capitalizeFirstLetter(data.undertype)));
          ec('td');
        ec('tr');           
        eo('tr');
          eo('td');
            html('Navnestatus: ' + strong(data.navnestatus));
          ec('td');
        ec('tr'); 
        var keys = Object.keys(data.egenskaber);
        keys.forEach(key => {                          
          eo('tr');
            eo('td');
              html(capitalizeFirstLetter(key) + ': ' + strong(data.egenskaber[key]));
            ec('td');
          ec('tr');
        })                                
        eo('tr');
          eo('td');
            html('Kommuner: ');
          ec('td');
        ec('tr');
          data.kommuner.forEach(kommune => {          
            eo('tr');
              eo('td', null, null, 'style', 'padding-left:2em ');
                html(strong(kommune.kode + " " + kommune.navn));
              ec('td');
              badge('info', 'badge-primary', kommune.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', kommune.href.replace('dawa','vis'));
              badge('data', 'badge-primary', kommune.href);
            ec('tr');
          })      
      ec('tbody'); 
    ec('table');
  }
}


function visBebyggelseKort(data) {  
  eo('tr');
    eo('td');
      html(data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visBebyggelse(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.navn + '</h2');
      eo('tbody');         
        eo('tr');
          eo('td');
            html('Id: ' + strong(data.id));
          ec('td');
        ec('tr');      
        eo('tr');
          let ændret= new Date(data.ændret);
          eo('td');
            html('Ændret d. ' + strong(ændret.toLocaleString()));
          ec('td');
        ec('tr');     
        eo('tr');
          eo('td');
            html('Type: ' + strong(capitalizeFirstLetter(data.type)));
          ec('td');
        ec('tr'); 
      ec('tbody'); 
    ec('table');
  }
}


function visStednavn2Kort(data) {  
  eo('tr');
    eo('td');
      html(data.navn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visStednavn2(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.navn + '</h2');
      eo('tbody');    
        eo('tr');
          eo('td');
            html('Navnestatus: ' + strong(data.navnestatus));
          ec('td');
        ec('tr');    
        eo('tr');
          eo('td');
            html('Brugsprioritet: ' + strong(data.brugsprioritet));
          ec('td');
        ec('tr'); 
        eo('tr');
          eo('td');
            html('Sted: ' + strong(data.sted.primærtnavn));
          ec('td');
          badge('info', 'badge-primary', data.sted.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.sted.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.sted.href);
        ec('tr'); 
        stedIndhold(data.sted, 1);
      ec('tbody'); 
    ec('table');
  }
}

function visStedKort(data) {  
  eo('tr');
    eo('td');
      html(data.primærtnavn);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function stedIndhold(data,indrykninger) { 
  eo('tr');    
    eotd(indrykninger);
      html('Id: ' + strong(data.id));
    ec('td');
  ec('tr');   
  eo('tr');
    let ændret= new Date(data.ændret);
    eotd(indrykninger);
      html('Ændret d. ' + strong(ændret.toLocaleString()));
    ec('td');
  ec('tr');                           
  eo('tr');
    eotd(indrykninger);
      html('Primært navn: ' + strong(data.primærtnavn));
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host).replace('steder','stednavne2') + '/' + data.primærtnavn);
    badge('kort', 'badge-primary', 'https://vis.aws.dk/stednavne2/' + data.id + '/' + data.primærtnavn);
    badge('data', 'badge-primary', 'https://data.aws.dk/stednavne2/' + data.id + '/' + data.primærtnavn);
  ec('tr');      
  eo('tr');
    eotd(indrykninger);
      html('Hovedtype: ' + strong(data.hovedtype));
    ec('td');
  ec('tr');              
  eo('tr');
    eotd(indrykninger);
      html('Undertype: ' + strong(capitalizeFirstLetter(data.undertype)));
    ec('td');
  ec('tr');           
  eo('tr');
    eotd(indrykninger);
      html('Navnestatus: ' + strong(data.primærnavnestatus));
    ec('td');
  ec('tr'); 
  if (data.sekundærenavne.length > 0)  {                          
    eo('tr');
      eotd(indrykninger);
        html('Sekundære navne: ');
      ec('td');
    ec('tr');
    data.sekundærenavne.forEach(seknavn => {                          
      eo('tr');
        eotd(indrykninger+1);
          html(strong(seknavn.navn + ' (' + seknavn.navnestatus + ')'));
        ec('td');
        badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host).replace('steder','stednavne2') + '/' + seknavn.navn);
        badge('kort', 'badge-primary', 'https://vis.aws.dk/stednavne2/' + data.id + '/' + seknavn.navn);
        badge('data', 'badge-primary', 'https://data.aws.dk/stednavne2/' + data.id + '/' + seknavn.navn);
      ec('tr');
    })  
  }            
  var keys = Object.keys(data.egenskaber);
  keys.forEach(key => {                          
    eo('tr');
      eotd(indrykninger);
        html(capitalizeFirstLetter(key) + ': ' + strong(data.egenskaber[key]));
      ec('td');
    ec('tr');
  })                              
  eo('tr');
    eotd(indrykninger);
      html('Kommuner: ');
    ec('td');
  ec('tr');
    data.kommuner.forEach(kommune => {          
      eo('tr');
        eotd(indrykninger+1);
          html(strong(kommune.kode + " " + kommune.navn));
        ec('td');
        badge('info', 'badge-primary', kommune.href.replace('dawa.aws.dk',host));
        badge('kort', 'badge-primary', kommune.href.replace('dawa','vis'));
        badge('data', 'badge-primary', kommune.href);
      ec('tr');
    })      
}

function visSted(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.primærtnavn + '</h2');
      eo('tbody');
        stedIndhold(data, 0);
      ec('tbody'); 
    ec('table');
  }
}

function visStednavntypeKort(data) {  
  eo('tr');
    eo('td');
      html(data.hovedtype);
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visStednavntype(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.hovedtype + '</h2', false);
      eo('tbody');                          
        eo('tr');
          eo('td');
            html('Undertyper: ');
          ec('td');
        ec('tr');
        data.undertyper.forEach(undertype => {                          
          eo('tr');
            eotd(1);
              html(strong(undertype));
            ec('td');
          ec('tr');
        })  
      ec('tbody'); 
    ec('table');
  }
}

let url= new URL(window.location.href); 
let host= url.host;
let origin= url.origin;
if (url.hostname === 'localhost') {
  url.set('host','info.aws.dk:80'); 
} 
let dawaUrl= new URL(url);
let query= queryString.parse(dawaUrl.query);

let miljø= query.m;
if (!miljø) miljø= 'dawa';
dawaUrl.set('host',dawaUrl.host.replace('info',miljø));
const container = document.getElementById('side');
visSide(container);
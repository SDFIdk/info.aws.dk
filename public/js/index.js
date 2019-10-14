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

function eotd(indrykninger= 0) {  
  if (indrykninger) {
    eo('td', null, null, 'style', indrykningsStyle(indrykninger)); //, 'onclick', onClick);
  }
  else {
    eo('td'); //, null, null, 'onclick', onClick);
  };    
}

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
    visData(data, visBBRBygningKort, visBBRBygning, ressource, null);
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
  case 'bbr/bygninger':
    tekst= 'BBR bygning';
    break;
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
  case 'bbr/bygninger':
    tekst= 'BBR bygninger';
    break;
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
  case 'bbr/bygninger':
    tekst= null;
    break;
  case 'adresser': 
    tekst= `
      <h1 class="display-5">Danmarks adresser</h1>
      <p class="lead">En adresse er en sammensat betegnelse, som udpeger og benævner en bestemt adgangsvej til et ubebygget areal, en bygning, en del af en bygning, et teknisk anlæg el.lign. Den sammensatte betegnelse, som en adresse udgør, består af vejnavn, husnummer, en eventuel etagebetegnelse og en eventuel dørbetegnelse, et eventuelt supplerende bynavn samt det postnummer med tilhørende navn på postnummerområdet, som adressen er beliggende i. (<a href="https://www.retsinformation.dk/Forms/R0710.aspx?id=186325">Adresselovens §6</a>)</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller adressedata og -funktionalitet via et <a href='http://dawa.aws.dk/dok/api/adresse'>adresse API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete, datavask og reverse geokodning af adresser samt udstilling af deres geografiske placering.</p>`;
    break;
  case 'adgangsadresser':
    tekst= `
      <h1 class="display-5">Danmarks adgangsadresser</h1>
      <p class="lead">En adgangsadresse er populært sagt en adresse uden etagebetegnelse og dørbetegnelse</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller adgangsadressedata og -funktionalitet via et <a href='http://dawa.aws.dk/dok/api/adresse'>adgangsadresse API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete, datavask og reverse geokodning af adgangsadresser samt udstilling af deres geografiske placering.</p>`;
    break;
  case 'navngivneveje': 
    tekst= `
      <h1 class="display-5">Danmarks navngivne veje</h1>
      <p class="lead">En navngiven vej er et samlet færdselsareal, uafhængigt af kommunegrænser, for hvilket der er fastsat ét vejnavn.</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller data og funktionalitet om navngivne veje via et <a href='http://dawa.aws.dk/dok/api/navngivenvej'>navngiven vej API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af navngivne veje samt udstilling af deres geografiske placering.</p>`;
    break;
  case 'vejstykker': 
    tekst= `
      <h1 class="display-5">Danmarks vejstykker</h1>
      <p class="lead">Et vejstykke er en vej begrænset en kommunes kommunegrænser, for hvilket der er fastsat ét vejnavn.</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller data og funktionalitet om vejstykker via et <a href='http://dawa.aws.dk/dok/api/vejstykke'>vejstykke API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af vejstykker samt udstilling af deres geografiske placering.</p>`;
    break;
  case 'supplerendebynavne2':  
    tekst= `
      <h1 class="display-5">Danmarks supplerende bynavne</h1>
      <p class="lead">Et supplerende bynavn er et lokalt stednavn som indgår i adressebetegnelsen for at præcisere den geografiske beliggenhed af en gruppe adresser.</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller data og funktionalitet om supplerende bynavne via et <a href='http://dawa.aws.dk/dok/api/vejstykke'>supplerende bynavne API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af supplerende bynavn samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'ejerlav':
    tekst= `
      <h1 class="display-5">Danmarks ejerlav</h1>
      <p class="lead">Ejerlav er en betegnelse for en del af et jordstykkes matrikelnummer. Tidligere var det en betegnelse for det fællesskab, som en landsbys gårde havde omkring dyrkningen af landsbyens jorde.</p>
      <hr class="my-4">
      <p>Data og funktionalitet om ejerlav udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/ejerlav'>ejerlavs API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af ejerlav samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'jordstykker':
    tekst= `
      <h1 class="display-5">Danmarks jordstykker</h1>
      <p class="lead">Et jordstykke er et areal betegnet ved et matrikelnummer.</p>
      <hr class="my-4">
      <p>Jordstykkedata og -funktionalitet udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/jordstykke'>jordstykke API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af jordstykker samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'postnumre':  
    tekst= `
      <h1 class="display-5">Danmarks postnumre</h1>
      <p class="lead">Danmark er inddelt i <a href='https://info.aws.dk/postnumre'>postnumre</a>, hvis oprindelige formål var at lette sorteringen af posten. Et postnummer er i Danmark et firecifret tal, som knyttes til et geografisk område.</p>
      <hr class="my-4">
      <p><a href='https://dawa.aws.dk'>DAWA</a> udstiller postnummerdata og -funktionalitet via et <a href='http://dawa.aws.dk/dok/api/postnummer'>postnummer API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af postnumre samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'sogne': 
    tekst= `
      <h1 class="display-5">Danmarks sogne</h1>
      <p class="lead"><a href='https://info.aws.dk/sogne'>Sogne i Danmark</a> betegner Folkekirkens sogne. Sogn er betegnelsen for et geografisk område med en fælles kirke. Normalt hører der én kirke til hver sogn, men enkelte sogn har dog mere end en kirke.</p>
      <hr class="my-4">
      <p>Sognedata og -funktionalitet udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/sogn'>sogne API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af sogne samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'politikredse': 
    tekst= `
      <h1 class="display-5">Danmarks politikredse</h1>
      <p class="lead">Danmark er opdelt i <a href='https://info.aws.dk/politikredse'>12 politikredse</a>. Hver politikreds har en hovedpolitistation, der er døgnbemandet.</p>
      <hr class="my-4">
      <p>Data og funktionalitet om politikredse udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/politikreds'>politikreds API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af politikredse samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'retskredse':
    tekst= `
      <h1 class="display-5">Danmarks retskredse</h1>
      <p class="lead">Danmark er opdelt i <a href='https://info.aws.dk/retskredse'>24 retskredse</a>. En retskreds er det område, der hører til en bestemt domstol. Det er typisk bestemt ud fra det geografiske område, men kan også bestemmes ud fra sagstypen.</p>
      <hr class="my-4">
      <p>Data og funktionalitet om retskredse udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/retskreds'>retskreds API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af retskredse samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'regioner':
    tekst= `
      <h1 class="display-5">Danmarks regioner</h1>
      <p class="lead">Danmark er opdelt i <a href='https://info.aws.dk/regioner'>5 regioner</a>. Regionernes hovedopgaver er sundhedsvæsenet, regional udvikling samt drift af visse sociale institutioner.</p>
      <hr class="my-4">
      <p>Data og funktionalitet om regioner udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/region'>regions API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af regioner samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'landsdele':
    tekst= `
      <h1 class="display-5">Danmarks landsdele</h1>
      <p class="lead">Danmark er opdelt i <a href='https://info.aws.dk/landsdele'>11 landsdele</a>. Landsdelene er en underopdeling af <a href='https://info.aws.dk/regioner'>regionerne</a>, implementeret som en del af <a href='https://en.wikipedia.org/wiki/Nomenclature_of_Territorial_Units_for_Statistics'>NUTS</a> og anvendes til statistiske formål</p>
      <hr class="my-4">
      <p>Data og funktionalitet om landsdelene udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/landsdel'>landsdels API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af landsdele samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'kommuner':
    tekst= `
      <h1 class="display-5">Danmarks kommuner</h1>
      <p class="lead">Danmark er inddelt i <a href='https://info.aws.dk/kommuner?udenforkommuneinddeling=false'>98 kommuner</a>. <a href='https://vis.aws.dk/stednavne2/1233766a-0e2c-6b98-e053-d480220a5a3f/Ertholmene'>Ertholmene</a>, er den eneste del af Danmark, som ikke hører under en kommune, men ejes og administreres af Forsvarsministeriet.</p>
      <hr class="my-4">
      <p>Data og funktionalitet vedrørende kommunerne udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/kommune'>kommune API</a>. API'et understøtter bl.a. opslag, indtastning med autocomplete og reverse geokodning af kommuner samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'afstemningsomraader':
    tekst= `
      <h1 class="display-5">Danmarks afstemningsområder</h1>
      <p class="lead">Geografisk inddeling af kommunerne i områder, hvor vælgere stemmer til Folketings-, EUog Kommunevalg, samt til folkeafstemninger. I hvert afstemningsområde foregår afstemningen på ét afstemningssted.</p>
      <hr class="my-4">
      <p>Data og funktionalitet om afstemningsområder udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='https://dawa.aws.dk/dok/api/afstemningsomr%C3%A5de'>afstemningsområde API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af afstemningsområder samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'menighedsraadsafstemningsomraader':
    tekst= `
      <h1 class="display-5">Danmarks menighedsrådsafstemningsområder</h1>
      <p class="lead">Kirkeministeriet fastlægger menighedsrådsafstemningsområder, når der er valg til menighedsrådene, i de sogne, hvor der skal være afstemningsvalg til menighedsrådet. </p>
      <hr class="my-4">
      <p>Data og funktionalitet om menighedsrådsafstemningsområder udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='http://dawa.aws.dk/dok/api/menighedsr%C3%A5dsafstemningsomr%C3%A5de'>menighedsrådsafstemningsområde API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af menighedsrådsafstemningsområder samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'opstillingskredse':
    tekst= `
      <h1 class="display-5">Danmarks opstillingskredse</h1>
      <p class="lead">Danmark er inddelt i <a href='https://info.aws.dk/valglandsdele'>3 valglandsdele</a> og <a href='https://info.aws.dk/storkredse'>10 storkredse</a>, der igen er opdelt i <a href='https://info.aws.dk/opstillingskredse'>92 mindre opstillingskredse</a>, ved et folketingsvalg.</p>
      <p>Inddelingen bruges ved beregningen af, hvor mange folketingsmedlemmer der skal vælges i de forskellige områder af landet. Metoden skal sikre, at alle egne repræsenteres i Folketinget, og at partiernes valgresultater på landsplan afspejles i Folketinget.</p>
      <hr class="my-4">
      <p>Data og funktionalitet om opstillingskredse udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='https://dawa.aws.dk/dok/api/opstillingskreds'>opstillingskreds API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af opstillingskredse samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'storkredse':
    tekst= `
      <h1 class="display-5">Danmarks storkredse</h1>
      <p class="lead">Danmark er inddelt i <a href='https://info.aws.dk/valglandsdele'>3 valglandsdele</a> og <a href='https://info.aws.dk/storkredse'>10 storkredse</a>, der igen er opdelt i <a href='https://info.aws.dk/opstillingskredse'>92 mindre opstillingskredse</a>, ved et folketingsvalg.</p>
      <p>Inddelingen bruges ved beregningen af, hvor mange folketingsmedlemmer der skal vælges i de forskellige områder af landet. Metoden skal sikre, at alle egne repræsenteres i Folketinget, og at partiernes valgresultater på landsplan afspejles i Folketinget.</p>
      <hr class="my-4">
      <p>Data og funktionalitet om storkredse udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='https://dawa.aws.dk/dok/api/storkreds'>storkreds API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af storkredse samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'valglandsdele':
    tekst= `
      <h1 class="display-5">Danmarks valglandsdele</h1>
      <p class="lead">Danmark er inddelt i <a href='https://info.aws.dk/valglandsdele'>3 valglandsdele</a> og <a href='https://info.aws.dk/storkredse'>10 storkredse</a>, der igen er opdelt i <a href='https://info.aws.dk/opstillingskredse'>92 mindre opstillingskredse</a>, ved et folketingsvalg.</p>
      <p>Inddelingen bruges ved beregningen af, hvor mange folketingsmedlemmer der skal vælges i de forskellige områder af landet. Metoden skal sikre, at alle egne repræsenteres i Folketinget, og at partiernes valgresultater på landsplan afspejles i Folketinget.</p>
      <hr class="my-4">
      <p>Data og funktionalitet om valglandsdele udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='https://dawa.aws.dk/dok/api/valglandsdel'>valglandsdel API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af valglandsdele samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'bebyggelser':
    tekst= `
      <h1 class="display-5">Danmarks bebyggelser</h1>
      <p class="lead">Danmarks bebyggelser indeholder forskellige former for bebyggelser som f.eks. <a href='https://info.aws.dk/bebyggelser?type=by'>byer</a>, <a href='https://info.aws.dk/bebyggelser?type=bydel'>bydele</a>, <a href='https://info.aws.dk/bebyggelser?type=sommerhusområde'>sommerhusområder</a> og <a href='https://info.aws.dk/bebyggelser?type=kolonihave'>kolonihaver</a>.</p>
      <p>Data og funktionalitet om bebyggelser udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='https://dawa.aws.dk/dok/api/bebyggelse'>bebyggelse API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af bebyggelser samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'stednavne':
    tekst= `
      <h1 class="display-5">Danske stednavne</h1>
      <p class="lead">Et stednavn er et navn på en lokalitet, f.eks. en by, et vandløb eller en skov.</p>
      <p>Data og funktionalitet om danske stednavne udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='https://dawa.aws.dk/dok/api/stednavn'>stednavne API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af stednavne samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'stednavne2':
    tekst= `
      <h1 class="display-5">Danske stednavne</h1>
      <p class="lead">Et stednavn er et navn på en lokalitet, f.eks. en by, et vandløb eller en skov.</p>
      <p>Data og funktionalitet om danske stednavne udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='https://dawa.aws.dk/dok/api/stednavn2'>stednavne API</a>. API'et understøtter bl.a. download, opslag, indtastning med autocomplete og reverse geokodning af stednavne samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'steder':
    tekst= `
      <h1 class="display-5">Danske steder</h1>
      <p class="lead">Et sted er en lokalitet, som er blandt de danske stednavne.  Et sted har et primært navn, men kan også have et eller flere sekundære navne.</p>
      <p>Data og funktionalitet om danske steder udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='https://dawa.aws.dk/dok/api/sted'>stednavne API</a>. API'et understøtter bl.a. download, opslag og reverse geokodning af steder samt udstilling af deres geografiske grænser.</p>`;
    break;
  case 'stednavntyper':
    tekst= `
      <h1 class="display-5">Stednavntyper</h1>
      <p class="lead">Stednavntyper opdeler danske stednavne i hoved- og undertyper.</p>
      <p>Data og funktionalitet om stednavntyper udstilles af <a href='https://dawa.aws.dk'>DAWA</a> via et <a href='https://dawa.aws.dk/dok/api/stednavntype'>stednavntype API</a>. API'et understøtter bl.a. download og opslag af stednavntyper.</p>`;
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
          html(strong(data.length + " " + flertal(overskrift)));
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

//-----------------------------------------------------------------------------------------------------------------
// DAR

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
  ec('tbody'); 
  let visBBRBygning= 'visBBRBygning';
  eo('tbody', null, null, 'id', visBBRBygning);
    getBBRBygningFraAdgangsadresseid(visBBRBygning,data.id);
  ec('tbody'); 
  eo('tbody'); 
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

//-----------------------------------------------------------------------------------------------------------
// GeoDanmark

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


//-----------------------------------------------------------------------------------------------------------
// Matrikelkortet

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

//-----------------------------------------------------------------------------------------------------------
// DAGI

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

function getKommune(id, kode) {
  const url= dawaUrl.origin + '/kommuner/' + kode;;
  fetch(url).then( function(response) {
    response.json().then( function ( kommune ) {
      dom.patch(document.getElementById(id), () => {
        eo('tr'); 
          eo('td');
            html('Kommune: ' + strong(kommune.kode + " " + kommune.navn));
          ec('td');
          badge('info', 'badge-primary', kommune.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', kommune.href.replace('dawa','vis'));
          badge('data', 'badge-primary', kommune.href);
        ec('tr');
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

//-----------------------------------------------------------------------------------------------------------
// Stednavne

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

//-----------------------------------------------------------------------------------------------------------
// BBR 


function BBRStatusFarve(status) {
  let tekst= "";
  status= parseInt(status);
  switch (status) {
  case 1:
    // "Start";
    tekst= 'badge-warning';
    break;
  case 2:
    // "Projekteret";
    tekst= 'badge-warning';
    break;
  case 3:
    // "Under opførsel";
    tekst= 'badge-warning';
    break;
  case 4:
    // "Sagsgrund";
    tekst= 'badge-warning';
    break;
  case 5:
    // "Oprettet";
    tekst= 'badge-warning';
    break;
  case 6:
    // "Opført";
    tekst= 'badge-success';
    break;
  case 7:
    // "Gældende";
    tekst= 'badge-success';
    break;
  case 8:
    // "Godkendt";
    tekst= 'badge-success';
    break;
  case 9:
    // "Afsluttet";
    tekst= 'badge-success';
    break;
  case 10:
    // "Slettet";
    tekst= 'badge-dark';
    break;
  case 11:
    // "Fejlregistreret";
    tekst= 'badge-dark';
    break;
  case 12:
    // "Midlertidig Afsluttet";
    tekst= 'badge-warning';
    break;
  case 13:
    // "Delvis Afsluttet";
    tekst= 'badge-warning';
    break;
  case 14:
    // "Henlagt";
    tekst= 'badge-dark';
    break;
  case 15:
    // "Modtaget";
    tekst= 'badge-warning';
    break;
  case 16:
    // "UnderBehandling";
    tekst= 'badge-warning';
    break;
  case 17:
    // "Afvist";
    tekst= 'badge-dark';
    break;
  case 18:
    // "Udført";
    tekst= 'badge-warning';
    break;
  case 19:
    // "Foreløbig";
    tekst= 'badge-warning';
    break;
  default:
    // "Ukendt kode";
    tekst= 'badge-dark';
  }
  return tekst;
}


function getAdgangsadresse(id, adgangsadresseid) {
  const url= dawaUrl.origin + "/adgangsadresser/" + adgangsadresseid + "?medtagnedlagte";
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( adgangsadresse ) {
        dom.patch(document.getElementById(id), () => {
          eo('tr'); 
            eo('td');
              html('Adgangsadresse: ' + strong(util.formatAdgangsadresse(adgangsadresse, true)));
            ec('td');
            badge('info', 'badge-primary', adgangsadresse.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', adgangsadresse.href.replace('dawa','vis'));
            badge('data', 'badge-primary', adgangsadresse.href);
          ec('tr');
        });
      });
    }
  });
} 

function getJordstykke(label, id) {
  const url= dawaUrl.origin + "/jordstykker?featureid=" + id;
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( jordstykker ) {
        if (jordstykker.length === 1) {
          let jordstykke= jordstykker[0]; 
          dom.patch(document.getElementById(label), () => {
            eo('tr'); 
              eo('td');
                html('Jordstykke: ' + strong(jordstykke.matrikelnr + ' ' + jordstykke.ejerlav.navn));
              ec('td');
              badge('info', 'badge-primary', jordstykke.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', jordstykke.href.replace('dawa','vis'));
              badge('data', 'badge-primary', jordstykke.href);
            ec('tr');
          });
        }
      });
    }
  });
} 


function getBBRBygningFraAdgangsadresseid(id, adgangsadresseid) {
  const url= dawaUrl.origin + "/bbr/bygninger?husnummer_id=" + adgangsadresseid + "&medtagnedlagte";
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( bygninger ) {
        if (bygninger.length > 0) {
          let bygning= bygninger[0];
          dom.patch(document.getElementById(id), () => {
            eo('tr'); 
              eo('td');
                html('BBR bygning');
              ec('td');
              badge('info', 'badge-primary', bygning.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', bygning.href.replace('dawa','vis'));
              badge('data', 'badge-primary', bygning.href);
            ec('tr');
          });
        }
      });
    }
  });
} 


function visBBRBygningKort(bygning) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(bygning.status));
        text(bbr.getLivscyklus(bygning.status));
      ec('span');
      html('<br/>' + 'Bygning fra ' + bygning.byg026Opførelsesår);
    ec('td');
    let href= 'https://' + host + '/bbr/bygninger/' + bygning.id;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', href.replace('dawa','vis'));
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRBygning(data) {
  return function() {
    danNavbar(ressource,'<h2>' + bbr.getBygAnvendelse(data.byg021BygningensAnvendelse) + '</h2');
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBRBygningIndhold(data);
      //   eo('tr');
      //     eo('td');
      //       html('Tilknyttede adresser');
      //     ec('td');
      //     let adrurl= origin + "/adresser?adgangsadresseid=" + data.id;
      //     badge('info', 'badge-primary', adrurl);
      //     badge('kort', 'badge-primary', adrurl.replace('info','vis'));
      //     badge('data', 'badge-primary', adrurl.replace('info','dawa'));
      //   ec('tr');
      // ec('tbody'); 
      // let adgangsadressensadresser= 'adgangsadressensadresser';
      // eo('tbody', null, null, 'id', adgangsadressensadresser);
      //     getAdresser(adgangsadressensadresser, data.id);
      ec('tbody'); 
    ec('table');
  }
}

function BBRBygningIndhold(data, indrykninger= 0)
{    
  eo('tr');
    eotd(indrykninger);
      html('Status: ');
      eo('span', null, null,
              'class', 'badge badge-pill '+BBRStatusFarve(data.status));
              text(bbr.getLivscyklus(data.status));
      ec('span');
    ec('td');
  ec('tr');       
  eo('tr');
    eotd(indrykninger);
      html('Id: ' + strong(data.id));
    ec('td');
  ec('tr');
  if (data.husnummer) {
    ec('tbody'); 
    let adgangsadresse= 'adgangsadresse';
    eo('tbody', null, null, 'id', adgangsadresse);
      getAdgangsadresse(adgangsadresse, data.husnummer.id);
    ec('tbody'); 
    eo('tbody'); 
  }
  if (data.jordstykke) {
    ec('tbody'); 
    let label= 'jordstykke';
    eo('tbody', null, null, 'id', label);
      getJordstykke(label, data.jordstykke.id);
    ec('tbody');
    eo('tbody');  
  }
  if (data.kommune) {
    ec('tbody'); 
    let label= 'kommune';
    eo('tbody', null, null, 'id', label);
      getKommune(label, data.kommune.kode);
    ec('tbody');
    eo('tbody');  
  }
  //visKodeNavn('Kommune', data.kommunekode, indrykninger);
  //visKodeNavn('Sogn', data.sogn, indrykninger);
  if (data.byg007Bygningsnummer > 0) {
    eo('tr');
      eotd(indrykninger);
        html('Bygningsnummer: ' + strong(data.byg007Bygningsnummer));
      ec('td');
    ec('tr');
  }
  if (data.byg021BygningensAnvendelse) {
    eo('tr');
      eotd(indrykninger);
        html('Anvendelse: ' + strong(bbr.getBygAnvendelse(data.byg021BygningensAnvendelse)));
      ec('td');
    ec('tr');
  }
  if (data.byg024AntalLejlighederMedKøkken) {
    eo('tr');
      eotd(indrykninger);
        html('Antal lejligheder med køkken: ' + strong(data.byg024AntalLejlighederMedKøkken));
      ec('td');
    ec('tr');
  }
  if (data.byg025AntalLejlighederUdenKøkken) {
    eo('tr');
      eotd(indrykninger);
        html('Antal lejligheder uden køkken: ' + strong(data.byg025AntalLejlighederUdenKøkken));
      ec('td');
    ec('tr');
  }
  if (data.byg026Opførelsesår) {
    eo('tr');
      eotd(indrykninger);
        html('Opførelsesår: ' + strong(data.byg026Opførelsesår));
      ec('td');
    ec('tr');
  }
  if (data.byg027OmTilbygningsår) {
    eo('tr');
      eotd(indrykninger);
        html('Ombygningsår: ' + strong(data.byg027OmTilbygningsår));
      ec('td');
    ec('tr');
  }
  if (data.byg029DatoForMidlertidigOpførtBygning) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg029DatoForMidlertidigOpførtBygning);
        html('Midlertidig opført d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg030Vandforsyning) {
    eo('tr');
      eotd(indrykninger);
        html('Vandforsyning: ' + strong(bbr.getBygVandforsyning(data.byg030Vandforsyning)));
      ec('td');
    ec('tr');
  }
  if (data.byg031Afløbsforhold) {
    eo('tr');
      eotd(indrykninger);
        html('Afløbsforhold: ' + strong(bbr.getAfloebsforhold(data.byg031Afløbsforhold)));
      ec('td');
    ec('tr');
  }
  if (data.byg032YdervæggensMateriale) {
    eo('tr');
      eotd(indrykninger);
        html('Ydervæg: ' + strong(bbr.getYdervaeggenesMateriale(data.byg032YdervæggensMateriale)));
      ec('td');
    ec('tr');
  }
  if (data.byg033Tagdækningsmateriale) {
    eo('tr');
      eotd(indrykninger);
        html('Tagdækning: ' + strong(bbr.getTagdaekningsmateriale(data.byg033Tagdækningsmateriale)));
      ec('td');
    ec('tr');
  }
  if (data.byg034SupplerendeYdervæggensMateriale) {
    eo('tr');
      eotd(indrykninger);
        html('Supplerende ydervæg: ' + strong(bbr.getYdervaeggenesMateriale(data.byg034SupplerendeYdervæggensMateriale)));
      ec('td');
    ec('tr');
  }
  if (data.byg035SupplerendeTagdækningsMateriale) {
    eo('tr');
      eotd(indrykninger);
        html('Supplerende tagdækning: ' + strong(bbr.getTagdaekningsmateriale(data.byg035SupplerendeTagdækningsMateriale)));
      ec('td');
    ec('tr');
  }
  if (data.byg036AsbestholdigtMateriale) {
    eo('tr');
      eotd(indrykninger);
        html('Asbest: ' + strong(bbr.getAsbestholdigtMateriale(data.byg036AsbestholdigtMateriale)));
      ec('td');
    ec('tr');
  }
  if (data.byg037KildeTilBygningensMaterialer) {
    eo('tr');
      eotd(indrykninger);
        html('Kilde til materialer: ' + strong(bbr.getKildeTilOplysninger(data.byg037KildeTilBygningensMaterialer)));
      ec('td');
    ec('tr');
  }
  if (data.byg038SamletBygningsareal>0) {
    eo('tr');
      eotd(indrykninger);
        html('Samlet bygningsareal: ' + strong(data.byg038SamletBygningsareal));
      ec('td');
    ec('tr');
  }
  if (data.byg039BygningensSamledeBoligAreal>0) {
    eo('tr');
      eotd(indrykninger);
        html('Samlet boligareal: ' + strong(data.byg039BygningensSamledeBoligAreal));
      ec('td');
    ec('tr');
  }
  if (data.byg040BygningensSamledeErhvervsAreal>0) {
    eo('tr');
      eotd(indrykninger);
        html('Samlet erhvervsareal: ' + strong(data.byg040BygningensSamledeErhvervsAreal));
      ec('td');
    ec('tr');
  }
  if (data.byg041BebyggetAreal>0) {
    eo('tr');
      eotd(indrykninger);
        html('Samlet bebygget areal: ' + strong(data.byg041BebyggetAreal));
      ec('td');
    ec('tr');
  }
  if (data.byg042ArealIndbyggetGarage>0) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af indbygget garage: ' + strong(data.byg042ArealIndbyggetGarage));
      ec('td');
    ec('tr');
  }
  if (data.byg043ArealIndbyggetCarport>0) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af indbygget carport: ' + strong(data.byg043ArealIndbyggetCarport));
      ec('td');
    ec('tr');
  }
  if (data.byg044ArealIndbyggetUdhus>0) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af indbygget udhus: ' + strong(data.byg044ArealIndbyggetUdhus));
      ec('td');
    ec('tr');
  }
  if (data.byg045ArealIndbyggetUdestueEllerLign>0) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af indbygget udestue el.: ' + strong(data.byg045ArealIndbyggetUdestueEllerLign));
      ec('td');
    ec('tr');
  }
  if (data.byg046SamletArealAfLukkedeOverdækningerPåBygningen>0) {
    eo('tr');
      eotd(indrykninger);
        html('Samlet areal af lukkede overdækninger: ' + strong(data.byg046SamletArealAfLukkedeOverdækningerPåBygningen));
      ec('td');
    ec('tr');
  }
  if (data.byg047ArealAfAffaldsrumITerrænniveau>0) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af affaldsrum i terrænniveau: ' + strong(data.byg047ArealAfAffaldsrumITerrænniveau));
      ec('td');
    ec('tr');
  }
  if (data.byg048AndetAreal>0) {
    eo('tr');
      eotd(indrykninger);
        html('Andet areal: ' + strong(data.byg048AndetAreal));
      ec('td');
    ec('tr');
  }
  if (data.byg049ArealAfOverdækketAreal>0) {
    eo('tr');
      eotd(indrykninger);
        html('Overdækket areal: ' + strong(data.byg049ArealAfOverdækketAreal));
      ec('td');
    ec('tr');
  }
  if (data.byg050ArealÅbneOverdækningerPåBygningenSamlet>0) {
    eo('tr');
      eotd(indrykninger);
        html('Samlet areal af åbne overdækninger: ' + strong(data.byg050ArealÅbneOverdækningerPåBygningenSamlet));
      ec('td');
    ec('tr');
  }
  if (data.byg051Adgangsareal>0) {
    eo('tr');
      eotd(indrykninger);
        html('Adgangsareal: ' + strong(data.byg051Adgangsareal));
      ec('td');
    ec('tr');
  }
  if (data.byg052BeregningsprincipCarportAreal) {
    eo('tr');
      eotd(indrykninger);
        html('Beregningsprincip af carportareal: ' + strong(bbr.getBeregningsprincipForArealAfCarport(data.byg052BeregningsprincipCarportAreal)));
      ec('td');
    ec('tr');
  }
  if (data.byg053BygningsarealerKilde) {
    eo('tr');
      eotd(indrykninger);
        html('Kilde til bygningsarealer: ' + strong(bbr.getKildeTilOplysninger(data.byg053BygningsarealerKilde)));
      ec('td');
    ec('tr');
  }
  if (data.byg054AntalEtager>0) {
    eo('tr');
      eotd(indrykninger);
        html('Antal etager: ' + strong(data.byg054AntalEtager));
      ec('td');
    ec('tr');
  }
  if (data.byg055AfvigendeEtager) {
    eo('tr');
      eotd(indrykninger);
        html('Afvigende etager: ' + strong(bbr.getAfvigendeEtager(data.byg055AfvigendeEtager)));
      ec('td');
    ec('tr');
  }
  if (data.byg056Varmeinstallation) {
    eo('tr');
      eotd(indrykninger);
        html('Varmeinstallation: ' + strong(bbr.getBygVarmeinstallation(data.byg056Varmeinstallation)));
      ec('td');
    ec('tr');
  }
  if (data.byg057Opvarmningsmiddel) {
    eo('tr');
      eotd(indrykninger);
        html('Opvarmningsmiddel: ' + strong(bbr.getOpvarmningsmiddel(data.byg057Opvarmningsmiddel)));
      ec('td');
    ec('tr');
  }
  if (data.byg058SupplerendeVarme) {
    eo('tr');
      eotd(indrykninger);
        html('Supplerende varme: ' + strong(bbr.getSupplerendeVarme(data.byg058SupplerendeVarme)));
      ec('td');
    ec('tr');
  }
  if (data.byg069Sikringsrumpladser>0) {
    eo('tr');
      eotd(indrykninger);
        html('Sikringsrumpladser: ' + strong(data.byg069Sikringsrumpladser));
      ec('td');
    ec('tr');
  }
  if (data.byg070Fredning) {
    eo('tr');
      eotd(indrykninger);
        html('Fredning: ' + strong(bbr.getFredning(data.byg070Fredning)));
      ec('td');
    ec('tr');
  }
  if (data.byg071BevaringsværdighedReference) {
    eo('tr');
      eotd(indrykninger);
        html('Bevaringsværdighedsreference: ' + strong(data.byg071BevaringsværdighedReference));
      ec('td');
    ec('tr');
  }
  if (data.byg094Revisionsdato) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg094Revisionsdato);
        html('Revisionsdato: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg111StormrådetsOversvømmelsesSelvrisiko) {
    eo('tr');
      eotd(indrykninger);
        html('Stormrådets oversvømmelses selvrisiko: ' + strong(bbr.getOversvoemmelsesselvrisiko(data.byg111StormrådetsOversvømmelsesSelvrisiko)));
      ec('td');
    ec('tr');
  }
  if (data.byg112DatoForRegistreringFraStormrådet) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg112DatoForRegistreringFraStormrådet);
        html('Registrering fra stormrådet d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg113Byggeskadeforsikringsselskab) {
    eo('tr');
      eotd(indrykninger);
        html('Byggeskadeforsikringsselskab: ' + strong(bbr.getByggeskadeforsikringsselskab(data.byg113Byggeskadeforsikringsselskab)));
      ec('td');
    ec('tr');
  }
  if (data.byg114DatoForByggeskadeforsikring) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg114DatoForByggeskadeforsikring);
        html('Byggeskadeforsikring d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg119Udledningstilladelse) {
    eo('tr');
      eotd(indrykninger);
        html('Udledningstilladelse: ' + strong(bbr.getUdledningstilladelse(data.byg119Udledningstilladelse)));
      ec('td');
    ec('tr');
  }
  if (data.byg121OmfattetAfByggeskadeforsikring) {
    eo('tr');
      eotd(indrykninger);
        html('Omfattet af byggeskadeforsikring: ' + strong(bbr.getOmfattetAfByggeskadeforsikring(data.byg121OmfattetAfByggeskadeforsikring)));
      ec('td');
    ec('tr');
  }
  if (data.byg122Gyldighedsdato) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg122Gyldighedsdato);
        html('Gyldighedsdato: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg123MedlemskabAfSpildevandsforsyning) {
    eo('tr');
      eotd(indrykninger);
        html('Medlemsskab af aplidevandforsyning: ' + strong(bbr.getMedlemsskabAfSplidevandforsyning(data.byg123MedlemskabAfSpildevandsforsyning)));
      ec('td');
    ec('tr');
  }
  if (data.byg124PåbudVedrSpildevandsafledning) {
    eo('tr');
      eotd(indrykninger);
        html('Påbud vedr. spildevandsafledning: ' + strong(bbr.getRensningspaabud(data.byg124PåbudVedrSpildevandsafledning)));
      ec('td');
    ec('tr');
  }
  if (data.byg125FristVedrSpildevandsafledning) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg125FristVedrSpildevandsafledning);
        html('Frist vedr. spildevandsafledning: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg126TilladelseTilUdtræden) {
    eo('tr');
      eotd(indrykninger);
        html('Tilladelse til udtræden: ' + strong(bbr.getTilladelseTilUdtraeden(data.byg126TilladelseTilUdtræden)));
      ec('td');
    ec('tr');
  }
  if (data.byg127DatoForTilladelseTilUdtræden) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg127DatoForTilladelseTilUdtræden);
        html('Tilladelse til udtræden d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg128TilladelseTilAlternativBortskaffelseEllerAfledning) {
    eo('tr');
      eotd(indrykninger);
        html('Tilladelse til alternativ bortskaffelse: ' + strong(bbr.getTilladelseTilAlternativBortskaffelseEllerAfledning(data.byg128TilladelseTilAlternativBortskaffelseEllerAfledning)));
      ec('td');
    ec('tr');
  }
  if (data.byg129DatoForTilladelseTilAlternativBortskaffelseEllerAfledning) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg129DatoForTilladelseTilAlternativBortskaffelseEllerAfledning);
        html('Tilladelse til alternativ bortskaffelse d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg130ArealAfUdvendigEfterisolering>0) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af udvendig efterisolering: ' + strong(data.byg130ArealAfUdvendigEfterisolering));
      ec('td');
    ec('tr');
  }
  if (data.byg131DispensationFritagelseIftKollektivVarmeforsyning) {
    eo('tr');
      eotd(indrykninger);
        html('Tilladelse til alternativ bortskaffelse: ' + strong(bbr.getDispensationFritagelseIftKollektivVarmeforsyning(data.byg131DispensationFritagelseIftKollektivVarmeforsyning)));
      ec('td');
    ec('tr');
  }
  if (data.byg132DatoForDispensationFritagelseIftKollektivVarmeforsyning) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg132DatoForDispensationFritagelseIftKollektivVarmeforsyning);
        html('Dispensationsfritagelse ift. kollektivvarmeforsyning d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg133KildeTilKoordinatsæt) {
    eo('tr');
      eotd(indrykninger);
        html('Kilde til koordinatsæt: ' + strong(bbr.getKildeTilKoordinatsaet(data.byg133KildeTilKoordinatsæt)));
      ec('td');
    ec('tr');
  }
  if (data.byg134KvalitetAfKoordinatsæt) {
    eo('tr');
      eotd(indrykninger);
        html('Kvalitet af koordinatsæt: ' + strong(bbr.getKvalitetAfKoordinatsaet(data.byg134KvalitetAfKoordinatsæt)));
      ec('td');
    ec('tr');
  }
  if (data.byg135SupplerendeOplysningOmKoordinatsæt) {
    eo('tr');
      eotd(indrykninger);
        html('Supplerende oplysning om koordinatsæt: ' + strong(bbr.getSupplerendeOplysningerOmKoordinatsaet(data.byg135SupplerendeOplysningOmKoordinatsæt)));
      ec('td');
    ec('tr');
  }
  if (data.byg136PlaceringPåSøterritorie) {
    eo('tr');
      eotd(indrykninger);
        html('Placering: ' + strong(bbr.getPaaSoeTerritorie(data.byg136PlaceringPåSøterritorie)));
      ec('td');
    ec('tr');
  }
  if (data.byg137BanedanmarkBygværksnummer) {
    eo('tr');
      eotd(indrykninger);
        html('Banedanmarks bygværksnummer: ' + strong(data.byg137BanedanmarkBygværksnummer));
      ec('td');
    ec('tr');
  }
  if (data.byg140ServitutForUdlejningsEjendomDato) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.byg140ServitutForUdlejningsEjendomDato);
        html('Servitut for udlejningsejendom d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.byg150Gulvbelægning) {
    eo('tr');
      eotd(indrykninger);
        html('Gulvbelægning: ' + strong(bbr.getSupplerendeOplysningerOmKoordinatsaet(data.byg150Gulvbelægning)));
      ec('td');
    ec('tr');
  }
  if (data.byg151Frihøjde) {
    eo('tr');
      eotd(indrykninger);
        html('Frihøjde: ' + strong(data.byg151Frihøjde));
      ec('td');
    ec('tr');
  }
  if (data.byg152ÅbenLukketKonstruktion) {
    eo('tr');
      eotd(indrykninger);
        html('Konstruktion: ' + strong(bbr.getKonstruktion(data.byg152ÅbenLukketKonstruktion)));
      ec('td');
    ec('tr');
  }
  if (data.byg153Konstruktionsforhold) {
    eo('tr');
      eotd(indrykninger);
        html('Konstruktionsforhold: ' + strong(bbr.getKonstruktionsforhold(data.byg153Konstruktionsforhold)));
      ec('td');
    ec('tr');
  }
  if (data.byg301TypeAfFlytning) {
    eo('tr');
      eotd(indrykninger);
        html('Type af flytning: ' + strong(data.byg301TypeAfFlytning));
      ec('td');
    ec('tr');
  }
  if (data.byg302Tilflytterkommune>0) {
    eo('tr');
      eotd(indrykninger);
        html('Tilflytterkommune: ' + strong(data.byg302Tilflytterkommune));
      ec('td');
    ec('tr');
  }
  if (data.byg403ØvrigeBemærkningerFraStormrådet>0) {
    eo('tr');
      eotd(indrykninger);
        html('Øvrige bemærkninger fra stormrådet: ' + strong(data.byg403ØvrigeBemærkningerFraStormrådet));
      ec('td');
    ec('tr');
  }
  if (data.byg406Koordinatsystem) {
    eo('tr');
      eotd(indrykninger);
        html('Koordinatsystem: ' + strong(bbr.getKoordinatsystem(data.byg406Koordinatsystem)));
      ec('td');
    ec('tr');
  }
  if (data.byg500Notatlinjer) {
    eo('tr');
      eotd(indrykninger);
        html('Notatlinjer: ' + strong(data.byg500Notatlinjer));
      ec('td');
    ec('tr');
  }
}

//-----------------------------------------------------------------------------------------------------------
// Main

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
"use strict";

var util = require('dawa-util')
    , URL = require('url-parse')
    , queryString = require('query-string')
    , dom = require('incremental-dom')
    , bbr = require('./bbrkodelister.js')
    , _ = require('underscore');


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
  case 'bbr/tekniskeanlaeg':
    visData(data, visBBRTekniskAnlægKort, visBBRTekniskAnlæg, ressource, null);
    break;
  case 'bbr/opgange':
    visData(data, visBBROpgangKort, visBBROpgang, ressource, null, false);
    break;
  case 'bbr/etager':
    visData(data, visBBREtageKort, visBBREtage, ressource, bbrEtageCompare, false);
    break;
  case 'bbr/enheder':
    visData(data, visBBREnhedKort, visBBREnhed, ressource, null, false);
    break;
  case 'bbr/bygningpaafremmedgrund':
    visData(data, visBBRBygningPåFremmedGrundKort, visBBRBygningPåFremmedGrund, ressource, null, false);
    break;
  case 'bbr/ejendomsrelationer':
    visData(data, visBBREjendomsRelationKort, visBBREjendomsRelation, ressource, null, false);
    break;
  case 'bbr/grunde':
    visData(data, visBBRGrundKort, visBBRGrund, ressource, null, false);
    break;
  case 'bbr/grundjordstykke':
    visData(data, visBBRGrundJordstykkeKort, visBBRGrundJordstykke, ressource, null, false);
    break;
  case 'bbr/fordelingsarealer':
    visData(data, visBBRFordelingsarealKort, visBBRFordelingsareal, ressource, null, false);
    break;
  case 'bbr/fordelingaffordelingsarealer':
    visData(data, visBBRFordelingAfFordelingsarealKort, visBBRFordelingAfFordelingsareal, ressource, null, false);
    break;
  case 'bbr/enhedejerlejlighed':
    visData(data, visBBREnhedEjerlejlighedKort, visBBREnhedEjerlejlighed, ressource, null, false);
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
  case 'vejnavnpostnummerrelationer':      
    visData(data, visVejnavnpostnummerrelationerKort, visVejnavnpostnummerrelationer, ressource, vejnavnpostnummerrelationerCompare);
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
  case 'darhistorik':
    visData(data, visDarhistorikKort, visDarhistorik, ressource, null, false);
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
  case 'bbr/tekniskeanlaeg':
    tekst= 'BBR teknisk anlæg';
    break;
  case 'bbr/opgange':
    tekst= 'BBR opgang';
    break;
  case 'bbr/etager':
    tekst= 'BBR etage';
    break;
  case 'bbr/enheder':
    tekst= 'BBR enhed';
    break;
  case 'bbr/bygningpaafremmedgrund':
    tekst= 'BBR Bygning på fremmed grund';
    break;
  case 'bbr/ejendomsrelationer':
    tekst= 'BBR Ejendomsrelation';
    break;
  case 'bbr/grunde':
    tekst= 'BBR grund';
    break;
  case 'bbr/grundjordstykke':
    tekst= 'BBR grundjordstykke';
    break;
  case 'bbr/fordelingsarealer':
    tekst= 'BBR fordelingsareal';
    break;
  case 'bbr/fordelingaffordelingsarealer':
    tekst= 'BBR fordeling af fordelingsarealer';
    break;
  case 'bbr/enhedejerlejlighed':
    tekst= 'BBR enhedejerlejlighed';
    break;
  case 'adresser':
    tekst= 'adresse';
    break;
  case 'adgangsadresser':
    tekst= 'adgangsadresse';
    break;    
  case 'navngivneveje':    
    tekst= 'navngivenvej';
    break;  
  case 'vejstykker':      
    tekst= 'vejstykke';
    break;     
  case 'vejnavnpostnummerrelationer':      
    tekst= 'vejnavnpostnummerrelation';
    break;       
  case 'vejnavne':      
    tekst= 'vejnavn';
    break;     
  case 'supplerendebynavne2': 
    tekst= 'supplerende bynavn';
    break;  
  case 'ejerlav': 
    tekst= 'ejerlav';
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
  case 'darhistorik':
    tekst= 'darhistorik';
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
  case 'bbr/tekniskeanlaeg':
    tekst= 'BBR tekniske anlæg';
    break;
  case 'bbr/opgange':
    tekst= 'BBR opgange';
    break;
  case 'bbr/etager':
    tekst= 'BBR etager';
    break;
  case 'bbr/enheder':
    tekst= 'BBR enheder';
    break;
  case 'bbr/bygningpaafremmedgrund':
    tekst= 'BBR Bygninger på fremmed grund';
    break;
  case 'bbr/ejendomsrelationer':
    tekst= 'BBR Ejendomsrelationer';
    break;
  case 'bbr/grunde':
    tekst= 'BBR grunde';
    break;
  case 'bbr/grundjordstykke':
    tekst= 'BBR grundjordstykker';
    break;
  case 'bbr/fordelingsarealer':
    tekst= 'BBR fordelingsarealer';
    break;
  case 'bbr/fordelingaffordelingsarealer':
    tekst= 'BBR fordelinger af fordelingsarealer';
    break;
  case 'bbr/enhedejerlejlighed':
    tekst= 'BBR enhedejerlejligheder';
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
  case 'vejnavnpostnummerrelationer':      
    tekst= 'vejnavnpostnummerrelationer';
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
  case 'darhistorik':
    tekst= 'darhistorik';
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
    tekst= 'Arealet er beregnet efter opmåling';
    break;
  case 's':
    tekst= 'Arealet er beregnet efter konstruktion i større målforhold, dvs. større end det analoge matrikelkort';
    break;
  case 'k':
    tekst= 'Arealet er beregnet på grundlag af kort';
    break;
  }
  return tekst;
} 

function vejarealberegningsmetodeTekst(bogstav) {
  let tekst= 'Ukendt vejarealberegningsmetode';
  switch (bogstav) {
  case 'b':
    tekst= 'Vejareal på jordstykket er beregnet (og kan være 0)';
    break;
  case 'e':
    tekst= 'Der er konstateret vej på jordstykket, men areal er ikke beregnet';
    break;
  case 'u':
    tekst= 'Det er ukendt, om der findes vej på jordstykket';
    break;
  }
  return tekst;
}

function vandarealberegningsmetodeTekst(bogstav) {
  let tekst= 'Ukendt vandarealberegningsmetode';
  switch (bogstav) {
  case 'incl':
    tekst= 'Vandareal på jordstykket et inkluderet i det registrerede areal for jordstykket';
    break;
  case 'excl':
    tekst= 'Vandareal på jordstykket er ikke inkluderet i det registrerede areal for jordstykket';
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

function danNavbar(overskrift, infotekst, viskortmenu=true, formater=null, link=null) {  
  const navoverskrift = document.getElementById('navoverskrift');
  navoverskrift.innerText= capitalizeFirstLetter(flertal(ressource));
  navoverskrift.href= url; 
  
  let href= new URL(dawaUrl.toString());
  let hrefquery= queryString.parse(href.query);
  delete hrefquery.struktur;

  if (formater) {
    let elements= document.getElementsByClassName('dropdown-divider');
    for (let i= 0; i<elements.length; i++) {
      elements[i].hidden= true;
    }
  }

  const json = document.getElementById('json');
  json.hidden= !(formater === null || formater.includes('json'));
  hrefquery.format= 'json';
  href.set('query',queryString.stringify(hrefquery));
  json.href= href.toString(); 

  const geojson = document.getElementById('geojson');
  geojson.hidden= !(formater === null || formater.includes('geojson'));
  hrefquery.format= 'geojson';
  href.set('query',queryString.stringify(hrefquery));
  geojson.href= href.toString();

  const ndjson = document.getElementById('ndjson');
  ndjson.hidden= !(formater === null || formater.includes('ndjson'));
  hrefquery.format= 'json';
  hrefquery.ndjson= true;
  href.set('query',queryString.stringify(hrefquery));
  ndjson.href= href.toString();
  delete hrefquery.ndjson;

  const csv = document.getElementById('csv');
  csv.hidden= !(formater === null || formater.includes('csv'));
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
      if (link) {
        jumbotron.insertAdjacentHTML('beforeend', link);
      }
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
  case 'bbr/tekniskeanlaeg  ':
    tekst= null;
    break;
  case 'bbr/opgange':
    tekst= null;
    break;
  case 'bbr/etager':
    tekst= null;
    break;
  case 'bbr/enheder':
    tekst= null;
    break;
  case 'bbr/bygningpaafremmedgrund':
    tekst= null;
    break;
  case 'bbr/ejendomsrelationer':
    tekst= null;
    break;
  case 'bbr/grunde':
    tekst= null;
    break;
  case 'bbr/grundjordstykke':
    tekst= null;
    break;
  case 'bbr/fordelingsarealer':
    tekst= null;
    break;
  case 'bbr/fordelingaffordelingsarealer':
    tekst= null;
    break;
  case 'bbr/enhedejerlejlighed':
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
  case 'darhistorik':
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
      let historiklink= `<a class="btn btn-primary btn-sm float-right" href="https://info.aws.dk/darhistorik?entitet=adresse&id=${data.id}" role="button">Historik</a>`;
      danNavbar(ressource,'<h2><address>' + util.formatHelAdresse(data, false) + '</address></h2', true, null, historiklink);
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
        ec('tbody'); 
        let visBBREnhed= 'visBBREnhed';
        eo('tbody', null, null, 'id', visBBREnhed);
          getBBREnhedFraAdresseid(visBBREnhed,data.id);
        ec('tbody'); 
        eo('tbody'); 
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
    getBBRBygningViaOpgang(visBBRBygning,data.id, indrykninger);
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
                html('GeoDanmark bygning: ');
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
      let historiklink= `<a class="btn btn-primary btn-sm float-right" href="https://info.aws.dk/darhistorik?entitet=husnummer&id=${data.id}" role="button">Historik</a>`;
      danNavbar(ressource,'<h2><address>' + util.formatAdgangsadresse(data, false) + '</address></h2', true, null, historiklink);
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



function bbrEtageCompare(a, b) {
  let aint= etage2int(a.eta006BygningensEtagebetegnelse);
  let bint= etage2int(b.eta006BygningensEtagebetegnelse);
  if (aint < bint) {
    return -1;
  }
  if (aint > bint) {
    return 1;
  }
  return 0;
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
      let historiklink= `<a class="btn btn-primary btn-sm float-right" href="https://info.aws.dk/darhistorik?entitet=navngivenvej&id=${data.id}" role="button">Historik</a>`;
      danNavbar(ressource,'<h2>' + data.navn + ' (' + data.administrerendekommune.kode + ' ' +  data.administrerendekommune.navn + ')' + '</h2', true, null, historiklink);
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


function visVejnavnpostnummerrelationerKort(data) {  
  eo('tr');
    eo('td');
      html('<br/>' + strong(data.betegnelse));
    ec('td');
    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
    badge('data', 'badge-primary', data.href);
  ec('tr');
}

function visVejnavnpostnummerrelationer(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      danNavbar(ressource,'<h2>' + data.betegnelse + '</h2');
      eo('tbody');           
        eo('tr');
          eo('td');
            html('Postnummer: ' + strong(data.postnummer.nr + " " + data.postnummer.navn));
          ec('td');
          badge('info', 'badge-primary', data.postnummer.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.postnummer.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.postnummer.href);
        ec('tr');
        if (data.kommuner) {                     
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

function vejnavnpostnummerrelationerCompare(a, b) {

  if (a.vejnavn < b.vejnavn) {
    return -1;
  }
  if (a.vejnavn > b.vejnavn) {
    return 1;
  }

  if (a.postnummer.nr < b.postnummer.nr) {
    return -1;
  }
  if (a.postnummer.nr > b.postnummer.nr) {
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


function visDarhistorikKort(adresse, indrykninger= 0) {  
  // Darhistorik er altid en og ikke en liste
}

function listobjekt(data, indrykninger= 0) {
  function compare(a,b) {
    let aobj= data[a] instanceof Object; 
    let bobj= data[b] instanceof Object; 
    if (aobj === bobj) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      // a must be equal to b
      return 0;
    }
    else {
      if (aobj) {
        return 1
      }
      return -1;
    }
  }
  let keys= _.keys(data); 
  if (!Array.isArray(data)) {
    keys= keys.sort(compare);
  } 
  keys.forEach(key => {
    eo('tr');
      eo('td', null, null, 'style', indrykningsStyle(indrykninger) + '; padding-top: 0em; padding-bottom: 0em');
        if ((data[key] instanceof Object) && ! (data[key] instanceof String)) {
          html(key + ': ');
          listobjekt(data[key], indrykninger+1);
        }
        else {
          html(key + ': ' + strong(data[key]));
        }
      ec('td');
    ec('tr');   
  })
}

function databody(data) {  
  eo('table',null,null,
  'class', tableclasses);
  eo('tbody');

  listobjekt(data, 0);
  
  ec('tbody'); 
  ec('table');
}


function ændringsbody(ændringer) {  
  eo('table',null,null,
  'class', 'table table-bordered');
  eo('thead');
  eo('tr');
  eo('th');
    html('Attribut');
  ec('th');
  eo('th');
    html('Fra');
  ec('th');
  eo('th');
   html('Til');
  ec('th');
  ec('tr');
  ec('thead');
  eo('tbody');
  function compare(a,b) {
    let aobj= a.gammelværdi instanceof Object; 
    let bobj= b.gammelværdi instanceof Object; 
    if (aobj === bobj) {
      if (a.attribut < b.attribut) {
        return -1;
      }
      if (a.attribut > b.attribut) {
        return 1;
      }
      // a must be equal to b
      return 0;
    }
    else {
      if (aobj) {
        return 1
      }
      return -1;
    }
  }
  ændringer.sort(compare)
  ændringer.forEach(ændring => {
    eo('tr');
    eo('td');
      html(ændring.attribut);
    ec('td');
    eo('td');  
      if (ændring.gammelværdi instanceof Object) {
        listobjekt(ændring.gammelværdi, 0);
      }
      else {
        html(strong(ændring.gammelværdi));
      }    
    ec('td');
    eo('td');       
    if (ændring.nyværdi instanceof Object) {
      listobjekt(ændring.nyværdi, 0);
    }
    else {
      html(strong(ændring.nyværdi));
    }    
    ec('td');
    ec('tr');
  })
  
  ec('tbody'); 
  ec('table');
}

function card(id, parentid, header, body, data) {
  eo('div',null,null, 'class', 'card');
    eo('div',null,null, 'id', id+'header', 'class', 'card-header');
      eo('h2',null,null, 'class', 'mb-0');
        eo('button',null,null, 'class', 'btn btn-light', 'type', 'button', 'data-toggle', 'collapse', 'data-target', '#'+id+'body', 'aria-expanded', 'true', 'aria-controls', id+'body');
          eo('h5',null,null, 'class', 'card-title');
            html(header);
          ec('h5');
        ec('button');
      ec('h2');
    ec('div');
    eo('div',null,null, 'id', id+'body', 'class', 'collapse', 'aria-labelledby', id+'header', 'data-parent', '#'+parentid);
      eo('div',null,null, 'class', 'card-body');
        body(data);
      ec('div');
    ec('div');
  ec('div');
}

function danressourcenavn(entitet) {
  let ressource= '';
  switch (entitet)  {
  case 'adresse':
    ressource= 'adresser';
    break;
  case 'husnummer':
    ressource= 'adgangsadresser';
    break;
  case 'navngivenvej':
    ressource= 'navngivneveje';
    break;    
  }
  return ressource;
}

function visDarhistorikEntitet(data, titel, id, entitet) {
  // se i https://getbootstrap.com/docs/4.4/components/collapse/
  let ressourcenavn= danressourcenavn(entitet);
  let link= `<a class="btn btn-primary btn-sm float-right" href="https://info.aws.dk/${ressourcenavn}?id=${id}&medtagnedlagte" role="button">${titel}</a>`;
  danNavbar(ressource,'<h2>' + titel + ' ' + id + '</h2', false, ['json'], link);
  let oprettet= new Date(data.oprettettidspunkt);  
  eo('div', null, null, 'id', 'darhistorik', 'class', 'accordion');
    card('inital','darhistorik', oprettet.toLocaleString() + ' - Oprettet', databody, data.initielværdi);
    data.historik.forEach((tidspunkt, index) => {
      let ændret= new Date(tidspunkt.ændringstidspunkt);
      let attributer= tidspunkt.ændringer.map(æ => æ.attribut).join(', ');        
      card('historik'+index,'darhistorik', ændret.toLocaleString() + ' - Ændringer af: ' + strong(attributer), ændringsbody, tidspunkt.ændringer);
    })
    card('aktuel','darhistorik', 'Aktuel', databody, data.aktuelværdi);
    if (data.fremtidigværdi) {    
      card('fremtidig','darhistorik', 'Fremtidig', databody, data.fremtidigværdi);
    }
  ec('div');  
}

function visDarhistorik(data) {
  return function() {
    let entitet= query.entitet;
    switch (entitet) {
    case 'adresse':
      visDarhistorikEntitet(data, 'Adresse', data.initielværdi.adresse_id, entitet);
      break;
    case 'husnummer':
      visDarhistorikEntitet(data, 'Husnummer', data.initielværdi.husnummer_id, entitet);
      break;
    case 'navngivenvej':
      visDarhistorikEntitet(data, 'Navngiven vej', data.initielværdi.navngivenvej_id, entitet);
      break;
    default:
      alert('Ukendt entitet i DarHistorik: ' + entitet);
      break;
    }
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
        ec('tbody'); 
        let visBBRBygning= 'visBBRBygning';
        eo('tbody', null, null, 'id', visBBRBygning);
          getBBRBygning(visBBRBygning,data.bbrbygning.id);
        ec('tbody'); 
        eo('tbody');                          
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
            getModerjordstykke(id, data.moderjordstykke);
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
        eo('tr');
          eo('td');
            html('BFE nummer: ' + strong(data.bfenummer));
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

function getModerjordstykke(id, featureid) {
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

function getKommune(id, kode, indrykninger= 0) {
  const url= dawaUrl.origin + '/kommuner/' + kode;;
  fetch(url).then( function(response) {
    response.json().then( function ( kommune ) {
      dom.patch(document.getElementById(id), () => {
        eo('tr'); 
          eotd(indrykninger);
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


function getAdgangsadresse(id, adgangsadresseid, indrykninger= 0) {
  const url= dawaUrl.origin + "/adgangsadresser/" + adgangsadresseid + "?medtagnedlagte";
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( adgangsadresse ) {
        dom.patch(document.getElementById(id), () => {
          eo('tr'); 
            eotd(indrykninger);
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

function getAdresse(id, adresseid, indrykninger= 0) {
  const url= dawaUrl.origin + "/adresser/" + adresseid + "?medtagnedlagte";
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( adresse ) {
        dom.patch(document.getElementById(id), () => {
          eo('tr'); 
            eotd(indrykninger);
              html('Adresse: ' + strong(adresse.adressebetegnelse));
            ec('td');
            badge('info', 'badge-primary', adresse.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', adresse.href.replace('dawa','vis'));
            badge('data', 'badge-primary', adresse.href);
          ec('tr');
        });
      });
    }
  });
}

function getEtage(id, href, indrykninger= 0) {
  fetch(href).then( function(response) {
    if (response.ok) {
      response.json().then( function ( etage ) {
        dom.patch(document.getElementById(id), () => {
          eo('tr'); 
            eotd(indrykninger);
              html('Etage: ' + strong(etage.eta006BygningensEtagebetegnelse));
            ec('td');
            badge('info', 'badge-primary', etage.href.replace('dawa.aws.dk',host));
            eo('td'); ec('td');
            badge('data', 'badge-primary', etage.href);
          ec('tr');
        });
      });
    }
  });
} 

function getOpgang(id, href, indrykninger= 0) {
  fetch(href).then( function(response) {
    if (response.ok) {
      response.json().then( function ( opgang ) {
        dom.patch(document.getElementById(id), () => {
          eo('tr'); 
            eotd(indrykninger);
              html('Opgang');
            ec('td');
            badge('info', 'badge-primary', opgang.href.replace('dawa.aws.dk',host));
            eo('td'); ec('td');
            badge('data', 'badge-primary', opgang.href);
          ec('tr');
        });
      });
    }
  });
} 

function getJordstykke(label, id, indrykninger= 0) {
  const url= dawaUrl.origin + "/jordstykker?featureid=" + id;
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( jordstykker ) {
        if (jordstykker.length === 1) {
          let jordstykke= jordstykker[0]; 
          dom.patch(document.getElementById(label), () => {
            eo('tr'); 
              eotd(indrykninger);
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

async function getGrundJordstykker(label, grund_id, indrykninger= 0) {
  let url= dawaUrl.origin + "/bbr/grundjordstykke?grund_id=" + grund_id;
  let response = await fetch(url);
  if (response.ok) {
    let grundjordstykker= await response.json();
    let jordstykkerequests= [];
    for (let i= 0; i<grundjordstykker.length; i++) {
      jordstykkerequests.push(fetch( dawaUrl.origin + '/jordstykker?featureid=' + grundjordstykker[i].jordstykke.id))
    }
    let responses= await Promise.all(jordstykkerequests);
    for (let i= 0; i<responses.length; i++) {      
      responses[i]= responses[i].json();
    }    
    let jordstykker= await Promise.all(responses);
    dom.patch(document.getElementById(label), () => {
      eo('tr');  
        eotd(indrykninger);
          html('Tilknyttede jordstykker:');
        ec('td');
      ec('tr');  
      for (let i= 0; i<jordstykker.length; i++) {
        eo('tr'); 
          eotd(indrykninger+1);
            html(strong(jordstykker[i][0].matrikelnr + ' ' + jordstykker[i][0].ejerlav.navn));
          ec('td');
          badge('info', 'badge-primary', jordstykker[i][0].href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', jordstykker[i][0].href.replace('dawa','vis'));
          badge('data', 'badge-primary', jordstykker[i][0].href);
        ec('tr');
      }
    });
  }
} 

async function getBBRBygningsOpgange(label, id, indrykninger= 0) {
  let url= dawaUrl.origin + "/bbr/opgange?bygning_id=" + id;
  let response = await fetch(url);
  if (response.ok) {
    let opgange= await response.json();
    if (opgange.length === 0) return; 
    let adgangsadresserequests= [];
    for (let i= 0; i<opgange.length; i++) {
      adgangsadresserequests.push(fetch(opgange[i].husnummer.href))
    }
    let responses= await Promise.all(adgangsadresserequests);
    for (let i= 0; i<responses.length; i++) {      
      responses[i]= responses[i].json();
    }    
    let adgangsadresser= await Promise.all(responses);
    for (let i= 0; i<adgangsadresser.length; i++) {
      adgangsadresser[i].opgang= opgange[i];
    }
    adgangsadresser.sort(adgangsadresseCompare);
    dom.patch(document.getElementById(label), () => {
      eo('tr');  
        eotd(indrykninger);
          html('Opgange:');
        ec('td');
      ec('tr');  
      for (let i= 0; i<adgangsadresser.length; i++) {
        eo('tr'); 
          eotd(indrykninger+1);
            html(strong(util.formatAdgangsadresse(adgangsadresser[i], true)));
          ec('td');
          badge('info', 'badge-primary', adgangsadresser[i].opgang.href.replace('dawa.aws.dk',host));
          eo('td'); ec('td');
          badge('data', 'badge-primary', adgangsadresser[i].opgang.href);
        ec('tr');
      }
    });
  }
} 

async function getBBRBygningsEtager(label, id, indrykninger= 0) {
  let url= dawaUrl.origin + "/bbr/etager?bygning_id=" + id;
  let response = await fetch(url);
  if (response.ok) {
    let etager= await response.json();
    if (etager.length === 0) return; 
    dom.patch(document.getElementById(label), () => {
      eo('tr');  
        eotd(indrykninger);
          html('Etager:');
        ec('td');
      ec('tr'); 
      etager.sort(bbrEtageCompare); 
      for (let i= 0; i<etager.length; i++) {
        eo('tr'); 
          eotd(indrykninger+1);
            html(strong(etager[i].eta006BygningensEtagebetegnelse));
          ec('td');
          badge('info', 'badge-primary', etager[i].href.replace('dawa.aws.dk',host));
          eo('td'); ec('td');
          badge('data', 'badge-primary', etager[i].href);
        ec('tr');
      }
    });
  }
} 

async function getBBRBygningsTekniskeAnlæg(label, id, qparameter, indrykninger= 0) {
  let url= dawaUrl.origin + "/bbr/tekniskeanlaeg?" + qparameter + '=' + id;
  let response = await fetch(url);
  if (response.ok) {
    let tekniskeanlæg= await response.json();
    if (tekniskeanlæg.length === 0) return; 
    dom.patch(document.getElementById(label), () => {
      eo('tr');  
        eotd(indrykninger);
          html('Tekniske anlæg:');
        ec('td');
      ec('tr'); 
      for (let i= 0; i<tekniskeanlæg.length; i++) {
        eo('tr'); 
          eotd(indrykninger+1);
            html(strong(bbr.getKlassifikation(tekniskeanlæg[i].tek020Klassifikation) + ' fra ' + tekniskeanlæg[i].tek024Etableringsår));
          ec('td');
          badge('info', 'badge-primary', tekniskeanlæg[i].href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', tekniskeanlæg[i].href.replace('dawa','vis'));
          badge('data', 'badge-primary', tekniskeanlæg[i].href);
        ec('tr');
      }
    });
  }
} 

async function getBBREnheder(label, id, qparameter, indrykninger= 0) {
  let url= dawaUrl.origin + "/bbr/enheder?" + qparameter + '=' + id;
  let response = await fetch(url);
  if (response.ok) {
    let enheder= await response.json();
    if (enheder.length === 0) return; 
    dom.patch(document.getElementById(label), () => {
      eo('tr');  
        eotd(indrykninger);
          html('Enheder:');
        ec('td');
      ec('tr'); 
      for (let i= 0; i<enheder.length; i++) {
        eo('tr'); 
          eotd(indrykninger+1);
            html(strong(bbr.getEnhAnvendelse(enheder[i].enh020EnhedensAnvendelse)));
          ec('td');
          badge('info', 'badge-primary', enheder[i].href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', enheder[i].href.replace('dawa','vis'));
          badge('data', 'badge-primary', enheder[i].href);
        ec('tr');
      }
    });
  }
} 

function getBBRBygningFraAdgangsadresseid(label, adgangsadresseid, indrykninger= 0) {
  const url= dawaUrl.origin + "/bbr/bygninger?husnummer_id=" + adgangsadresseid   + "&medtagnedlagte";
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( bygninger ) {
        if (bygninger.length > 0) {
          let bygning= bygninger[0];
          dom.patch(document.getElementById(label), () => {
            eo('tr'); 
              eotd(indrykninger);
              html('BBR bygning: ' + strong(bbr.getBygAnvendelse(bygning.byg021BygningensAnvendelse)));
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

function getBBREnhed(label, url, indrykninger= 0) {
  try {
    fetch(url).then( function(response) {
      if (response.ok) {
        response.json().then( function ( enhed ) {
          dom.patch(document.getElementById(label), () => {
            eo('tr'); 
              eotd(indrykninger);
              html('BBR enhed: ' + strong(bbr.getEnhAnvendelse(enhed.enh020EnhedensAnvendelse)));
              ec('td');
              badge('info', 'badge-primary', enhed.href.replace('dawa.aws.dk',host));
              eo('td'); ec('td');
              badge('data', 'badge-primary', enhed.href);
            ec('tr');
          });
        });
      }
    });
  }
  catch (e) {
    console.log(e);
  }
}

function getBBREnhedFraAdresseid(label, adresseid, indrykninger= 0) {
  const url= dawaUrl.origin + "/bbr/enheder?adresse_id=" + adresseid   + "&medtagnedlagte";
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( enheder ) {
        if (enheder.length > 0) {
          let enhed= enheder[0];
          dom.patch(document.getElementById(label), () => {
            eo('tr'); 
              eotd(indrykninger);
              html('BBR enhed: ' + strong(bbr.getEnhAnvendelse(enhed.enh020EnhedensAnvendelse)));
              ec('td');
              badge('info', 'badge-primary', enhed.href.replace('dawa.aws.dk',host));
              eo('td'); ec('td');
              badge('data', 'badge-primary', enhed.href);
            ec('tr');
          });
        }
      });
    }
  });
}

function getBBRBygningViaOpgang(label, adgangsadresseid, indrykninger= 0) {
  const url= dawaUrl.origin + "/bbr/opgange?husnummer_id=" + adgangsadresseid;
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( opgange ) {
        if (opgange.length > 0) {
          let opgang= opgange[0];
          fetch(opgang.bygning.href).then( function(response) {
            if (response.ok) {
              response.json().then( function ( bygning ) {
                dom.patch(document.getElementById(label), () => {
                  eo('tr'); 
                    eotd(indrykninger);
                    html('BBR bygning: ' + strong(bbr.getBygAnvendelse(bygning.byg021BygningensAnvendelse)));
                    ec('td');
                    badge('info', 'badge-primary', bygning.href.replace('dawa.aws.dk',host));
                    badge('kort', 'badge-primary', bygning.href.replace('dawa','vis'));
                    badge('data', 'badge-primary', bygning.href);
                  ec('tr');
                });
              });
            };
          });
        }
      });
    }
  });
}

function getBBRBygning(label, id, indrykninger= 0) {
  const url= dawaUrl.origin + "/bbr/bygninger/" + id;
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( bygning ) {
        dom.patch(document.getElementById(label), () => {
          eo('tr'); 
              eotd(indrykninger);
              html('BBR bygning: ' + strong(bbr.getBygAnvendelse(bygning.byg021BygningensAnvendelse) + ' fra ' + bygning.byg026Opførelsesår));
            ec('td');
            badge('info', 'badge-primary', bygning.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', bygning.href.replace('dawa','vis'));
            badge('data', 'badge-primary', bygning.href);
          ec('tr');
        });
      });
    }
  });
} 

function getBBRGrund(label, url, indrykninger= 0) {
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( grund ) {
        dom.patch(document.getElementById(label), () => {
          eo('tr'); 
              eotd(indrykninger);
              html('BBR grund: ' + strong(grund.id));
            ec('td');
            badge('info', 'badge-primary', grund.href.replace('dawa.aws.dk',host));
            eo('td'); ec('td');
            badge('data', 'badge-primary', grund.href);
          ec('tr');
        });
      });
    }
  });
} 

function getBBRBygningsFordelingsareal(label, id, indrykninger= 0) {
  const url= dawaUrl.origin + "/bbr/fordelingsarealer?bygning_id=" + id;
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( data ) {
        if (data.length > 0) {
          dom.patch(document.getElementById(label), () => {
            eo('tr'); 
                eotd(indrykninger);
                html('BBR Fordelingsareal: ' + strong(data[0].for005Navn));
              ec('td');
              badge('info', 'badge-primary', data[0].href.replace('dawa.aws.dk',host));
              eo('td'); ec('td');
              badge('data', 'badge-primary', data[0].href);
            ec('tr');
          });
        }
      });
    }
  });
}

function getBBRFordelingsareal(label, url, indrykninger= 0) {
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( data ) {
        dom.patch(document.getElementById(label), () => {
          eo('tr'); 
              eotd(indrykninger);
              html('BBR Fordelingsareal: ' + strong(data.for005Navn));
            ec('td');
            badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
            eo('td'); ec('td');
            badge('data', 'badge-primary', data.href);
          ec('tr');
        });
      });
    }
  });
} 

function getBBRBygningsEjendomsrelation(label, id, indrykninger= 0) {
  const url= dawaUrl.origin + "/bbr/bygningpaafremmedgrund?bygning_id=" + id;
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( data ) {
        if (data.length > 0) {
          fetch(data[0].bygningPåFremmedGrund.href).then( function(response) {
            if (response.ok) {
              response.json().then( function ( data ) {
                dom.patch(document.getElementById(label), () => {
                  eo('tr'); 
                    eotd(indrykninger);
                      html('BFE nummer: ' + strong(data.bfeNummer));
                    ec('td');
                    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
                    eo('td'); ec('td');
                    badge('data', 'badge-primary', data.href);
                  ec('tr');
                }); 
                // ec('tbody');
                // eo('tbody');
                //   BBREjendomsRelationIndhold(data, indrykninger+1);
                // ec('tbody');
                // eo('tbody');
              });
            }
          });
        }
      });
    }
  });
} 

function getBBRBygningsEjerlejlighed(label, url, indrykninger= 0) {
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( data ) {
        dom.patch(document.getElementById(label), () => {
          eo('tr'); 
            eotd(indrykninger);
              html('Ejerlejligheds BFE nummer: ' + strong(data.bfeNummer));
            ec('td');
            badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
            eo('td'); ec('td');
            badge('data', 'badge-primary', data.href);
          ec('tr');
        }); 
        // ec('tbody');
        // eo('tbody');
        //   BBREjendomsRelationIndhold(data, indrykninger+1);
        // ec('tbody');
        // eo('tbody');
      });
    }
  });
} 


function getBBREnhedsEjendomsrelation(label, id, indrykninger= 0) {
  const url= dawaUrl.origin + "/bbr/enhedejerlejlighed?enhed_id=" + id;
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( data ) {
        if (data.length > 0) {
          fetch(data[0].ejerlejlighed.href).then( function(response) {
            if (response.ok) {
              response.json().then( function ( data ) {
                dom.patch(document.getElementById(label), () => {
                  eo('tr'); 
                    eotd(indrykninger);
                      html('BFE nummer: ' + strong(data.bfeNummer));
                    ec('td');
                    badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
                    eo('td'); ec('td');
                    badge('data', 'badge-primary', data.href);
                  ec('tr');
                }); 
                // ec('tbody');
                // eo('tbody');
                //   BBREjendomsRelationIndhold(data, indrykninger+1);
                // ec('tbody');
                // eo('tbody');
              });
            }
          });
        }
      });
    }
  });
} 

function getBBREjendomsrelation(label, url, indrykninger= 0) {
  fetch(url).then( function(response) {
    if (response.ok) {
      response.json().then( function ( data ) {
        dom.patch(document.getElementById(label), () => {
          eo('tr'); 
            eotd(indrykninger);
              html('BFE nummer: ' + strong(data.bfeNummer));
            ec('td');
            badge('info', 'badge-primary', data.href.replace('dawa.aws.dk',host));
            eo('td'); ec('td');
            badge('data', 'badge-primary', data.href);
          ec('tr');
        }); 
        // ec('tbody');
        // eo('tbody');
        //   BBREjendomsRelationIndhold(data, indrykninger+1);
        // ec('tbody');
        // eo('tbody');
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
      html('<br/>' + bbr.getBygAnvendelse(bygning.byg021BygningensAnvendelse) + ' fra ' + bygning.byg026Opførelsesår);
    ec('td');
    let href= 'https://' + host + '/bbr/bygninger/' + bygning.id;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', href.replace('dawa','vis'));
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRBygning(data) {
  return function() {
    danNavbar(ressource,'<h2>' + bbr.getBygAnvendelse(data.byg021BygningensAnvendelse) + ' fra ' + data.byg026Opførelsesår + '</h2');
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBRBygningIndhold(data);
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
  if (data.grund) {
    ec('tbody'); 
    let label= 'bbrgrund';
    eo('tbody', null, null, 'id', label);
      getBBRGrund(label, data.grund.href);
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
  ec('tbody'); 
  let label= 'ejendomsrelation';
  eo('tbody', null, null, 'id', label);
    getBBRBygningsEjendomsrelation(label, data.id);
  ec('tbody');
  eo('tbody');
  if (data.ejerlejlighed) {
    ec('tbody'); 
    label= 'ejerlejlighed';
    eo('tbody', null, null, 'id', label);
      getBBRBygningsEjerlejlighed(label, data.ejerlejlighed.href);
    ec('tbody');
    eo('tbody');
  } 
  ec('tbody'); 
  label= 'fordelingsareal';
  eo('tbody', null, null, 'id', label);
    getBBRBygningsFordelingsareal(label, data.id);
  ec('tbody');
  eo('tbody'); 
  ec('tbody'); 
  label= 'opgange';
  eo('tbody', null, null, 'id', label);
    getBBRBygningsOpgange(label, data.id);
  ec('tbody');
  eo('tbody'); 
  ec('tbody'); 
  label= 'etager';
  eo('tbody', null, null, 'id', label);
    getBBRBygningsEtager(label, data.id);
  ec('tbody');
  eo('tbody'); 
  ec('tbody'); 
  label= 'tekniskeanlæg';
  eo('tbody', null, null, 'id', label);
    getBBRBygningsTekniskeAnlæg(label, data.id, 'bygning_id');
  ec('tbody');
  eo('tbody');
}


function visBBRTekniskAnlægKort(tekanl) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(tekanl.status));
        text(bbr.getLivscyklus(tekanl.status));
      ec('span');
      html('<br/>' + bbr.getKlassifikation(tekanl.tek020Klassifikation) + ' fra ' + tekanl.tek024Etableringsår);
    ec('td');
    let href= 'https://' + host + '/bbr/tekniskeanlaeg/' + tekanl.id;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', href.replace('dawa','vis'));
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRTekniskAnlæg(data) {
  return function() {
    danNavbar(ressource,'<h2>' + bbr.getKlassifikation(data.tek020Klassifikation) + '</h2');
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBRTekniskAnlægIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBRTekniskAnlægIndhold(data, indrykninger= 0)
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
  if (data.bygning) {
    ec('tbody'); 
    let visBBRBygning= 'visBBRBygning';
    eo('tbody', null, null, 'id', visBBRBygning);
      getBBRBygning(visBBRBygning,data.bygning.id);
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
  if (data.tek007Anlægsnummer > 0) {
    eo('tr');
      eotd(indrykninger);
        html('Anlægsnummer: ' + strong(data.tek007Anlægsnummer));
      ec('td');
    ec('tr');
  }
  if (data.tek020Klassifikation) {
    eo('tr');
      eotd(indrykninger);
        html('Klassifikation: ' + strong(bbr.getKlassifikation(data.tek020Klassifikation)));
      ec('td');
    ec('tr');
  }
  if (data.tek021FabrikatType) {
    eo('tr');
      eotd(indrykninger);
        html('Fabrikattype: ' + strong(data.tek021FabrikatType));
      ec('td');
    ec('tr');
  }
  if (data.tek022EksternDatabase) {
    eo('tr');
      eotd(indrykninger);
        html('Ekstern database: ' + strong(data.tek022EksternDatabase));
      ec('td');
    ec('tr');
  }
  if (data.tek023EksternNøgle) {
    eo('tr');
      eotd(indrykninger);
        html('Ekstern nøgle: ' + strong(data.tek023EksternNøgle));
      ec('td');
    ec('tr');
  }
  if (data.tek024Etableringsår) {
    eo('tr');
      eotd(indrykninger);
        html('Etableringsår: ' + strong(data.tek024Etableringsår));
      ec('td');
    ec('tr');
  }
  if (data.tek025TilOmbygningsår) {
    eo('tr');
      eotd(indrykninger);
        html('Til-/Ombygningsår: ' + strong(data.tek025TilOmbygningsår));
      ec('td');
    ec('tr');
  }
  if (data.tek026StørrelsesklasseOlietank) {
    eo('tr');
      eotd(indrykninger);
        html('Olietankens størrelsesklasse: ' + strong(bbr.getStoerrelsesklasse(data.tek026StørrelsesklasseOlietank)));
      ec('td');
    ec('tr');
  }
  if (data.tek027Placering) {
    eo('tr');
      eotd(indrykninger);
        html('Placering: ' + strong(bbr.getStoerrelsesklasse(data.tek027Placering)));
      ec('td');
    ec('tr');
  }
  if (data.tek028SløjfningOlietank) {
    eo('tr');
      eotd(indrykninger);
        html('Sløjfning af Olietank: ' + strong(bbr.getStoerrelsesklasse(data.tek028SløjfningOlietank)));
      ec('td');
    ec('tr');
  }
  if (data.tek030Fabrikationsnummer) {
    eo('tr');
      eotd(indrykninger);
        html('Tankens fabrikationsnummer: ' + strong(data.tek030Fabrikationsnummer));
      ec('td');
    ec('tr');
  }
  if (data.tek031Typegodkendelsesnummer) {
    eo('tr');
      eotd(indrykninger);
        html('Tankens typegodkendelsesnummer: ' + strong(data.tek031Typegodkendelsesnummer));
      ec('td');
    ec('tr');
  }
  if (data.tek032Størrelse) {
    eo('tr');
      eotd(indrykninger);
        html('Tankens størrelse: ' + strong(data.tek032Størrelse));
      ec('td');
    ec('tr');
  }
  if (data.tek033Type) {
    eo('tr');
      eotd(indrykninger);
        html('Tankens type: ' + strong(bbr.getTypeAfVaegge(data.tek033Type)));
      ec('td');
    ec('tr');
  }
  if (data.tek034IndholdOlietank) {
    eo('tr');
      eotd(indrykninger);
        html('Tankens indhold: ' + strong(bbr.getTypeAfVaegge(data.tek034IndholdOlietank)));
      ec('td');
    ec('tr');
  }
  if (data.tek035SløjfningsfristOlietank) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.tek035SløjfningsfristOlietank);
        html('Sløjfningsfrist d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.tek036Rumfang) {
    eo('tr');
      eotd(indrykninger);
        html('Rumfang: ' + strong(data.tek036Rumfang));
      ec('td');
    ec('tr');
  }
  if (data.tek037Areal) {
    eo('tr');
      eotd(indrykninger);
        html('Areal: ' + strong(data.tek037Areal));
      ec('td');
    ec('tr');
  }
  if (data.tek038Højde) {
    eo('tr');
      eotd(indrykninger);
        html('højde: ' + strong(data.tek038Højde));
      ec('td');
    ec('tr');
  }
  if (data.tek039Effekt) {
    eo('tr');
      eotd(indrykninger);
        html('Efekt: ' + strong(data.tek039Effekt));
      ec('td');
    ec('tr');
  }
  if (data.tek040Fredning) {
    eo('tr');
      eotd(indrykninger);
        html('Fredningstype: ' + strong(bbr.getFredning(data.tek040Fredning)));
      ec('td');
    ec('tr');
  }
  if (data.tek042Revisionsdato) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.tek042Revisionsdato);
        html('Geometrirevision d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.tek045Koordinatsystem) {
    eo('tr');
      eotd(indrykninger);
        html('Koordinatsystem: ' + strong(bbr.getKoordinatsystem(data.tek045Koordinatsystem)));
      ec('td');
    ec('tr');
  }
  if (data.tek067Fabrikationsår) {
    eo('tr');
      eotd(indrykninger);
        html('Tankens fabrikationssår: ' + strong(data.tek067Fabrikationsår));
      ec('td');
    ec('tr');
  }
  if (data.tek068Materiale) {
    eo('tr');
      eotd(indrykninger);
        html('Tankens materiale: ' + strong(bbr.getMateriale(data.tek068Materiale)));
      ec('td');
    ec('tr');
  }
  if (data.tek069SupplerendeIndvendigKorrosionsbeskyttelse) {
    eo('tr');
      eotd(indrykninger);
        html('Korresionsbeskyttelse: ' + strong(bbr.getSupplerendeIndvendigKorrosionsbeskyttelse(data.tek069SupplerendeIndvendigKorrosionsbeskyttelse)));
      ec('td');
    ec('tr');
  }
  if (data.tek070DatoForSenestUdførteSupplerendeIndvendigKorrosionsbeskyttelse) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.tek070DatoForSenestUdførteSupplerendeIndvendigKorrosionsbeskyttelse);
        html('Korrosionsbeskyttelse d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.tek072Sløjfningsår) {
    eo('tr');
      eotd(indrykninger);
        html('Tankens sløjfningsår: ' + strong(data.tek072Sløjfningsår));
      ec('td');
    ec('tr');
  }
  if (data.tek073Navhøjde) {
    eo('tr');
      eotd(indrykninger);
        html('Vindnøllens højde ved nav: ' + strong(data.tek073Navhøjde));
      ec('td');
    ec('tr');
  }
  if (data.tek074Vindmøllenummer) {
    eo('tr');
      eotd(indrykninger);
        html('Vindmøllenummer: ' + strong(data.tek074Vindmøllenummer));
      ec('td');
    ec('tr');
  }
  if (data.tek075Rotordiameter) {
    eo('tr');
      eotd(indrykninger);
        html('Rotordiameter: ' + strong(data.tek075Rotordiameter));
      ec('td');
    ec('tr');
  }
  if (data.tek076KildeTilKoordinatsæt) {
    eo('tr');
      eotd(indrykninger);
        html('Kilde til koordinatsæt: ' + strong(bbr.getKildeTilKoordinatsaet(data.tek076KildeTilKoordinatsæt)));
      ec('td');
    ec('tr');
  }
  if (data.tek077KvalitetAfKoordinatsæt) {
    eo('tr');
      eotd(indrykninger);
        html('Kvalitet af koordinatsæt: ' + strong(bbr.getKvalitetAfKoordinatsaet(data.tek077KvalitetAfKoordinatsæt)));
      ec('td');
    ec('tr');
  }
  if (data.tek078SupplerendeOplysningOmKoordinatsæt) {
    eo('tr');
      eotd(indrykninger);
        html('Supplerende oplysning om koordinatsæt: ' + strong(bbr.getSupplerendeOplysningerOmKoordinatsaet(data.tek078SupplerendeOplysningOmKoordinatsæt)));
      ec('td');
    ec('tr');
  }
  if (data.tek101Gyldighedsdato) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.tek101Gyldighedsdato);
        html('Vurderingsgyldighedsdato d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.tek102FabrikatVindmølle) {
    eo('tr');
      eotd(indrykninger);
        html('Vindmøllens fabrikat: ' + strong(data.tek102FabrikatVindmølle));
      ec('td');
    ec('tr');
  }
  if (data.tek103FabrikatOliefyr) {
    eo('tr');
      eotd(indrykninger);
        html('Oliefyrets fabrikat: ' + strong(data.tek103FabrikatOliefyr));
      ec('td');
    ec('tr');
  }
  if (data.tek104FabrikatSolcelleanlægSolvarme) {
    eo('tr');
      eotd(indrykninger);
        html('Solcelle- eller solvarmeanlægs fabrikat: ' + strong(data.tek104FabrikatSolcelleanlægSolvarme));
      ec('td');
    ec('tr');
  }
  if (data.tek105OverdækningTank) {
    eo('tr');
      eotd(indrykninger);
        html('Overdækning af tank: ' + strong(data.tek105OverdækningTank));
      ec('td');
    ec('tr');
  }
  if (data.tek106InspektionsdatoTank) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.tek106InspektionsdatoTank);
        html('Tank inspiceret d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.tek107PlaceringPåSøterritorie) {
    eo('tr');
      eotd(indrykninger);
        html('Placering: ' + strong(bbr.getPaaSoeTerritorie(data.tek107PlaceringPåSøterritorie)));
      ec('td');
    ec('tr');
  }
  if (data.tek110Driftstatus) {
    eo('tr');
      eotd(indrykninger);
        html('Driftsstatus: ' + strong(bbr.getDriftstatus(data.tek110Driftstatus)));
      ec('td');
    ec('tr');
  }
  if (data.tek111DatoForSenesteInspektion) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.tek111DatoForSenesteInspektion);
        html('Seneste inspektionsdato d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.tek112InspicerendeVirksomhed) {
    eo('tr');
      eotd(indrykninger);
        html('Inspectionsvirksomhed: ' + strong(data.tek112InspicerendeVirksomhed));
      ec('td');
    ec('tr');
  }
  if (data.tek500Notatlinjer) {
    eo('tr');
      eotd(indrykninger);
        html('Notatlinjer: ' + strong(data.tek500Notatlinjer));
      ec('td');
    ec('tr');
  }
}


function visBBROpgangKort(data) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(data.status));
        text(bbr.getLivscyklus(data.status));
      ec('span');
      html('<br/>' + data.husnummer.id + ' <-> ' + data.bygning.id);
    ec('td');
    let href= data.href;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBROpgang(data) {
  return function() {
    danNavbar(ressource,'<h2>Husnummer id:' + data.husnummer.id + ' <-> Bygnings id: ' + data.bygning.id + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBROpgangIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBROpgangIndhold(data, indrykninger= 0)
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
  if (data.husnummer.id) {
    ec('tbody'); 
    let adgangsadresse= 'adgangsadresse';
    eo('tbody', null, null, 'id', adgangsadresse);
      getAdgangsadresse(adgangsadresse, data.husnummer.id);
    ec('tbody'); 
    eo('tbody'); 
  }  
  if (data.bygning) {
    ec('tbody'); 
    let visBBRBygning= 'visBBRBygning';
    eo('tbody', null, null, 'id', visBBRBygning);
      getBBRBygning(visBBRBygning,data.bygning.id);
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
  if (data.opg020Elevator) {
    eo('tr');
      eotd(indrykninger);
        html('Elevator: ' + strong(bbr.getElevator(data.opg020Elevator)));
      ec('td');
    ec('tr');
  }
  if (data.opg021HusnummerFunktion) {
    eo('tr');
      eotd(indrykninger);
        html('Husnummerets funktion: ' + strong(bbr.getHusnummerRolle(data.opg021HusnummerFunktion)));
      ec('td');
    ec('tr');
  }
  if (data.opg500Notatlinjer) {
    eo('tr');
      eotd(indrykninger);
        html('Notatlinjer: ' + strong(data.opg500Notatlinjer));
      ec('td');
    ec('tr');
  } 
  ec('tbody'); 
  let label= 'enheder';
  eo('tbody', null, null, 'id', label);
    getBBREnheder(label, data.id, 'opgang_id');
  ec('tbody');
  eo('tbody');
}

function visBBREtageKort(data) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(data.status));
        text(bbr.getLivscyklus(data.status));
      ec('span');
      html('<br/>' + data.eta006BygningensEtagebetegnelse);
    ec('td');
    let href= data.href;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBREtage(data) {
  return function() {
    danNavbar(ressource,'<h2>Etage: ' + data.eta006BygningensEtagebetegnelse + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBREtageIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBREtageIndhold(data, indrykninger= 0)
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
  if (data.bygning) {
    ec('tbody'); 
    let visBBRBygning= 'visBBRBygning';
    eo('tbody', null, null, 'id', visBBRBygning);
      getBBRBygning(visBBRBygning,data.bygning.id);
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
  if (data.eta006BygningensEtagebetegnelse) {
    eo('tr');
      eotd(indrykninger);
        html('Etagebetegnelse: ' + strong(data.eta006BygningensEtagebetegnelse));
      ec('td');
    ec('tr');
  }
  if (data.eta025Etagetype) {
    eo('tr');
      eotd(indrykninger);
        html('Etagetype: ' + strong(bbr.getEtageType(data.eta025Etagetype)));
      ec('td');
    ec('tr');
  }
  if (data.eta020SamletArealAfEtage) {
    eo('tr');
      eotd(indrykninger);
        html('Samlet areal: ' + strong(data.eta020SamletArealAfEtage));
      ec('td');
    ec('tr');
  }
  if (data.eta021ArealAfUdnyttetDelAfTagetage) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af udnyttet del af tagetage: ' + strong(data.eta021ArealAfUdnyttetDelAfTagetage));
      ec('td');
    ec('tr');
  }
  if (data.eta022Kælderareal) {
    eo('tr');
      eotd(indrykninger);
        html('Kælderareal: ' + strong(data.eta022Kælderareal));
      ec('td');
    ec('tr');
  }
  if (data.eta023ArealAfLovligBeboelseIKælder) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af lovlig beboelse i kælder: ' + strong(data.eta023ArealAfLovligBeboelseIKælder));
      ec('td');
    ec('tr');
  }
  if (data.eta024EtagensAdgangsareal) {
    eo('tr');
      eotd(indrykninger);
        html('Adgangsareal: ' + strong(data.eta024EtagensAdgangsareal));
      ec('td');
    ec('tr');
  }
  if (data.eta026ErhvervIKælder ) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af erhverv i kælder: ' + strong(data.eta026ErhvervIKælder  ));
      ec('td');
    ec('tr');
  }
  if (data.opg500Notatlinjer) {
    eo('tr');
      eotd(indrykninger);
        html('Notatlinjer: ' + strong(data.opg500Notatlinjer));
      ec('td');
    ec('tr');
  }
  ec('tbody'); 
  let label= 'enheder';
  eo('tbody', null, null, 'id', label);
    getBBREnheder(label, data.id, 'etage_id');
  ec('tbody');
  eo('tbody');
}

function visBBREnhedKort(enhed) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(enhed.status));
        text(bbr.getLivscyklus(enhed.status));
      ec('span');
      html('<br/>' + bbr.getEnhAnvendelse(enhed.enh020EnhedensAnvendelse));
    ec('td');
    let href= 'https://' + host + '/bbr/enheder/' + enhed.id;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBREnhed(enhed) {
  return function() {
    danNavbar(ressource,'<h2>' + bbr.getEnhAnvendelse(enhed.enh020EnhedensAnvendelse) + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBREnhedIndhold(enhed);
      ec('tbody'); 
    ec('table');
  }
}

function BBREnhedIndhold(data, indrykninger= 0)
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
  if (data.adresse) {
    ec('tbody'); 
    let adresse= 'adresse';
    eo('tbody', null, null, 'id', adresse);
      getAdresse(adresse, data.adresse.id);
    ec('tbody'); 
    eo('tbody'); 
  }
  if (data.etage) {
    ec('tbody'); 
    let etage= 'etage';
    eo('tbody', null, null, 'id', etage);
      getEtage(etage, data.etage.href);
    ec('tbody'); 
    eo('tbody'); 
  }
  if (data.opgang) {
    ec('tbody'); 
    let opgang= 'opgang';
    eo('tbody', null, null, 'id', opgang);
      getOpgang(opgang, data.opgang.href);
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
  if (data.enh020EnhedensAnvendelse) {
    eo('tr');
      eotd(indrykninger);
        html('Anvendelse: ' + strong(bbr.getEnhAnvendelse(data.enh020EnhedensAnvendelse)));
      ec('td');
    ec('tr');
  }
  if (data.enh023Boligtype) {
    eo('tr');
      eotd(indrykninger);
        html('Boligtype: ' + strong(bbr.getBoligtype(data.enh023Boligtype)));
      ec('td');
    ec('tr');
  }
  if (data.enh024KondemneretBoligenhed) {
    eo('tr');
      eotd(indrykninger);
        html('Kondemneret?: ' + strong(bbr.getKondemneretBoligenhed(data.enh024KondemneretBoligenhed)));
      ec('td');
    ec('tr');
  }
  if (data.enh025OprettelsesdatoForEnhedensIdentifikation) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.enh025OprettelsesdatoForEnhedensIdentifikation);
        html('Oprettet d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.enh026EnhedensSamledeAreal) {
    eo('tr');
      eotd(indrykninger);
        html('Samlet areal: ' + strong(data.enh026EnhedensSamledeAreal));
      ec('td');
    ec('tr');
  }
  if (data.enh027ArealTilBeboelse) {
    eo('tr');
      eotd(indrykninger);
        html('Beboelsesareal: ' + strong(data.enh027ArealTilBeboelse));
      ec('td');
    ec('tr');
  }
  if (data.enh028ArealTilErhverv) {
    eo('tr');
      eotd(indrykninger);
        html('Erhvervsareal: ' + strong(data.enh028ArealTilErhverv));
      ec('td');
    ec('tr');
  }  
  if (data.enh030KildeTilEnhedensArealer) {
    eo('tr');
      eotd(indrykninger);
        html('Kilde til areal: ' + strong(bbr.getKildeTilOplysninger(data.enh030KildeTilEnhedensArealer)));
      ec('td');
    ec('tr');
  }
  if (data.enh031AntalVærelser) {
    eo('tr');
      eotd(indrykninger);
        html('Antal værelser: ' + strong(data.enh031AntalVærelser));
      ec('td');
    ec('tr');
  } 
  if (data.enh032Toiletforhold) {
    eo('tr');
      eotd(indrykninger);
        html('Toiletforhold: ' + strong(bbr.getToiletforhold(data.enh032Toiletforhold)));
      ec('td');
    ec('tr');
  }
  if (data.enh033Badeforhold) {
    eo('tr');
      eotd(indrykninger);
        html('Badeforhold: ' + strong(bbr.getBadeforhold(data.enh033Badeforhold)));
      ec('td');
    ec('tr');
  }
  if (data.enh034Køkkenforhold) {
    eo('tr');
      eotd(indrykninger);
        html('Køkkenforhold: ' + strong(bbr.getKoekkenforhold(data.enh034Køkkenforhold)));
      ec('td');
    ec('tr');
  }
  if (data.enh035Energiforsyning) {
    eo('tr');
      eotd(indrykninger);
        html('Energiforsyning: ' + strong(bbr.getEnergiforsyning(data.enh035Energiforsyning)));
      ec('td');
    ec('tr');
  }
  if (data.enh039AndetAreal) {
    eo('tr');
      eotd(indrykninger);
        html('Andet areal: ' + strong(data.enh039AndetAreal));
      ec('td');
    ec('tr');
  }  
  if (data.enh041LovligAnvendelse) {
    eo('tr');
      eotd(indrykninger);
        html('Lovlig anvendelse: ' + strong(bbr.getLovligAnvendelse(data.enh041LovligAnvendelse)));
      ec('td');
    ec('tr');
  }
  if (data.enh042DatoForTidsbegrænsetDispensation) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.enh042DatoForTidsbegrænsetDispensation);
        html('Tidsbegrænset dispensation d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.enh044DatoForDelvisIbrugtagningsTilladelse) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.enh044DatoForDelvisIbrugtagningsTilladelse);
        html('Delvis ibrugtagningstilladelse d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  } 
  if (data.enh045Udlejningsforhold) {
    eo('tr');
      eotd(indrykninger);
        html('Udlejningsforhold : ' + strong(bbr.getUdlejningsforhold(data.enh045Udlejningsforhold)));
      ec('td');
    ec('tr');
  }
  if (data.enh046OffentligStøtte) {
    eo('tr');
      eotd(indrykninger);
        html('Offentlig støtte: ' + strong(bbr.getOffentligStoette(data.enh046OffentligStøtte)));
      ec('td');
    ec('tr');
  }
  if (data.enh047IndflytningDato) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.enh047IndflytningDato);
        html('Indflyningsdato: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }
  if (data.enh048GodkendtTomBolig) {
    eo('tr');
      eotd(indrykninger);
        html('Godkendt tom bolig: ' + strong(bbr.getGodkendtTomBolig(data.enh048GodkendtTomBolig)));
      ec('td');
    ec('tr');
  }
  if (data.enh051Varmeinstallation) {
    eo('tr');
      eotd(indrykninger);
        html('Varmeinstalation: ' + strong(bbr.getVarmeinstallation(data.enh051Varmeinstallation)));
      ec('td');
    ec('tr');
  }
  if (data.enh052Opvarmningsmiddel) {
    eo('tr');
      eotd(indrykninger);
        html('Opvarmningsmiddel: ' + strong(bbr.getOpvarmningsmiddel(data.enh052Opvarmningsmiddel)));
      ec('td');
    ec('tr');
  }
  if (data.enh053SupplerendeVarme) {
    eo('tr');
      eotd(indrykninger);
        html('Supplerende varme: ' + strong(bbr.getSupplerendeVarme(data.enh053SupplerendeVarme)));
      ec('td');
    ec('tr');
  }  
  if (data.enh060EnhedensAndelFællesAdgangsareal) {
    eo('tr');
      eotd(indrykninger);
        html('Andel i fælles adgangsareal: ' + strong(data.enh060EnhedensAndelFællesAdgangsareal));
      ec('td');
    ec('tr');
  }   
  if (data.enh061ArealAfÅbenOverdækning) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af åben overdækning: ' + strong(data.enh061ArealAfÅbenOverdækning));
      ec('td');
    ec('tr');
  }    
  if (data.enh062ArealAfLukketOverdækningUdestue) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af lukket overdækning: ' + strong(data.enh062ArealAfLukketOverdækningUdestue));
      ec('td');
    ec('tr');
  }      
  if (data.enh063AntalVærelserTilErhverv) {
    eo('tr');
      eotd(indrykninger);
        html('Antal værelser til erhverv: ' + strong(data.enh063AntalVærelserTilErhverv));
      ec('td');
    ec('tr');
  }        
  if (data.enh065AntalVandskylledeToiletter) {
    eo('tr');
      eotd(indrykninger);
        html('Antal vandskyllende toiletter: ' + strong(data.enh065AntalVandskylledeToiletter));
      ec('td');
    ec('tr');
  }          
  if (data.enh066AntalBadeværelser) {
    eo('tr');
      eotd(indrykninger);
        html('Antal badeværelser: ' + strong(data.enh066AntalBadeværelser));
      ec('td');
    ec('tr');
  }             
  if (data.enh067Støjisolering) {
    eo('tr');
      eotd(indrykninger);
        html('Støjisolering år: ' + strong(data.enh067Støjisolering));
      ec('td');
    ec('tr');
  }  
  if (data.enh068FlexboligTilladelsesart) {
    eo('tr');
      eotd(indrykninger);
        html('Flexboligtilladelsesart: ' + strong(bbr.getTilladelsesart(data.enh068FlexboligTilladelsesart)));
      ec('td');
    ec('tr');
  } 
  if (data.enh069FlexboligOphørsdato) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.enh069FlexboligOphørsdato);
        html('Flexbolig ophørt d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }            
  if (data.enh070ÅbenAltanTagterrasseAreal) {
    eo('tr');
      eotd(indrykninger);
        html('Areal af åben altan: ' + strong(data.enh070ÅbenAltanTagterrasseAreal));
      ec('td');
    ec('tr');
  }   
  if (data.enh071AdresseFunktion) {
    eo('tr');
      eotd(indrykninger);
        html('Adressens funktion: ' + strong(bbr.getAdresseRolle(data.enh071AdresseFunktion)));
      ec('td');
    ec('tr');
  } 
  if (data.enh101Gyldighedsdato) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.enh101Gyldighedsdato);
        html('Gyldighedsdato: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }            
  if (data.enh102HerafAreal1) {
    eo('tr');
      eotd(indrykninger);
        html('Heraf areal 1: ' + strong(data.enh102HerafAreal1));
      ec('td');
    ec('tr');
  }                 
  if (data.enh102HerafAreal2) {
    eo('tr');
      eotd(indrykninger);
        html('Heraf areal 2: ' + strong(data.enh102HerafAreal2));
      ec('td');
    ec('tr');
  }                 
  if (data.enh128FysiskArealTilErhverv) {
    eo('tr');
      eotd(indrykninger);
        html('Heraf areal 3: ' + strong(data.enh302HerafAreal1));
      ec('td');
    ec('tr');
  } 
  if (data.enh105SupplerendeAnvendelseskode1) {
    eo('tr');
      eotd(indrykninger);
        html('Supperende anvendelse 1: ' + strong(bbr.getEnhAnvendelse(data.enh105SupplerendeAnvendelseskode1)));
      ec('td');
    ec('tr');
  }   
  if (data.enh105SupplerendeAnvendelseskode2) {
    eo('tr');
      eotd(indrykninger);
        html('Supperende anvendelse 2: ' + strong(bbr.getEnhAnvendelse(data.enh105SupplerendeAnvendelseskode2)));
      ec('td');
    ec('tr');
  }   
  if (data.enh105SupplerendeAnvendelseskode3) {
    eo('tr');
      eotd(indrykninger);
        html('Supperende anvendelse 3: ' + strong(bbr.getEnhAnvendelse(data.enh105SupplerendeAnvendelseskode3)));
      ec('td');
    ec('tr');
  }                 
  if (data.enh127FysiskArealTilBeboelse) {
    eo('tr');
      eotd(indrykninger);
        html('Fysisk areal til beboelse: ' + strong(data.enh127FysiskArealTilBeboelse));
      ec('td');
    ec('tr');
  }                  
  if (data.enh128FysiskArealTilErhverv) {
    eo('tr');
      eotd(indrykninger);
        html('Fysisk areal til erhverv: ' + strong(data.enh128FysiskArealTilErhverv));
      ec('td');
    ec('tr');
  } 
  if (data.enh500Notatlinjer) {
    eo('tr');
      eotd(indrykninger);
        html('Notatlinjer: ' + strong(data.enh500Notatlinjer));
      ec('td');
    ec('tr');
  } 
  ec('tbody'); 
  let label= 'tekniskeanlæg';
  eo('tbody', null, null, 'id', label);
    getBBRBygningsTekniskeAnlæg(label, data.id, 'enhed_id');
  ec('tbody');
  eo('tbody');
  ec('tbody'); 
  label= 'ejendomsrelation';
  eo('tbody', null, null, 'id', label);
    getBBREnhedsEjendomsrelation(label, data.id);
  ec('tbody');
  eo('tbody'); 
}


function visBBRBygningPåFremmedGrundKort(data) {  
  eo('tr');
    eo('td');
      // eo('span', null, null,
      //   'class', 'badge badge-pill '+BBRStatusFarve(data.status));
      //   text(bbr.getLivscyklus(data.status));
      // ec('span');
      html('<br/>' + data.bygning.id + ' <-> ' + data.bygningPåFremmedGrund.id);
    ec('td');
    let href= data.href;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRBygningPåFremmedGrund(data) {
  return function() {
    danNavbar(ressource,'<h2>Bygning id:' + data.bygning.id + ' <-> Ejendomsrelations id: ' + data.bygningPåFremmedGrund.id + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBRBygningPåFremmedGrundIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBRBygningPåFremmedGrundIndhold(data, indrykninger= 0)
{    
  // eo('tr');
  //   eotd(indrykninger);
  //     html('Status: ');
  //     eo('span', null, null,
  //             'class', 'badge badge-pill '+BBRStatusFarve(data.status));
  //             text(bbr.getLivscyklus(data.status));
  //     ec('span');
  //   ec('td');
  // ec('tr');       
  eo('tr');
    eotd(indrykninger);
      html('Id: ' + strong(data.id));
    ec('td');
  ec('tr');
  if (data.bygning) {
    ec('tbody'); 
    let visBBRBygning= 'visBBRBygning';
    eo('tbody', null, null, 'id', visBBRBygning);
      getBBRBygning(visBBRBygning,data.bygning.id);
    ec('tbody'); 
    eo('tbody');
  }
  if (data.bygningPåFremmedGrund) {
    ec('tbody'); 
    let label= 'Ejendomsrelation';
    eo('tbody', null, null, 'id', label);
      getBBREjendomsrelation(label, data.bygningPåFremmedGrund.href);
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
}

function visBBREjendomsRelationKort(data) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(data.status));
        text(bbr.getLivscyklus(data.status));
      ec('span');
      html('<br/>Ejendomsrelation: ' + data.id);
    ec('td');
    let href= data.href;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBREjendomsRelation(data) {
  return function() {
    danNavbar(ressource,'<h2>Ejendomsrelation: ' + data.id + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBREjendomsRelationIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBREjendomsRelationIndhold(data, indrykninger= 0)
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
  if (data.ejendomstype) {
    eo('tr');
      eotd(indrykninger);
        html('Ejendomstype: ' + strong(data.ejendomstype));
      ec('td');
    ec('tr');
  }
  if (data.ejendommensEjerforholdskode) {
    eo('tr');
      eotd(indrykninger);
        html('Ejerforhold: ' + strong(bbr.getEjerforholdskode(data.ejendommensEjerforholdskode)));
      ec('td');
    ec('tr');
  }
  if (data.bfeNummer) {      
    eo('tr');
      eotd(indrykninger);
        html('BFE nummer: ' + strong(data.bfeNummer));
      ec('td');
    ec('tr');
  }
  if (data.ejendomsnummer) {      
    eo('tr');
      eotd(indrykninger);
        html('ESR ejendomsnummer: ' + strong(data.ejendomsnummer));
      ec('td');
    ec('tr');
  }
  if (data.ejerlejlighedsnummer) {
    eo('tr');
      eotd(indrykninger);
        html('Ejerlejlighedsnummer: ' + strong(data.ejerlejlighedsnummer));
      ec('td');
    ec('tr');
  }
  if (data.tinglystAreal) {
    eo('tr');
      eotd(indrykninger);
        html('Tinglyst areal: ' + strong(data.tinglystAreal));
      ec('td');
    ec('tr');
  }
  if (data.vurderingsejendomsnummer) {
    eo('tr');
      eotd(indrykninger);
        html('Vurderingsejendomsnummer: ' + strong(data.vurderingsejendomsnummer));
      ec('td');
    ec('tr');
  }
  if (data.kommune) {
    ec('tbody'); 
    let label= 'erkommune';
    eo('tbody', null, null, 'id', label);
      getKommune(label, data.kommune.kode, indrykninger);
    ec('tbody');
    eo('tbody');  
  }
}

function visBBREnhedKort(enhed) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(enhed.status));
        text(bbr.getLivscyklus(enhed.status));
      ec('span');
      html('<br/>' + bbr.getEnhAnvendelse(enhed.enh020EnhedensAnvendelse));
    ec('td');
    let href= 'https://' + host + '/bbr/enheder/' + enhed.id;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRGrundKort(grund) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(grund.status));
        text(bbr.getLivscyklus(grund.status));
      ec('span');
      html('<br/>' + 'Grund');
    ec('td');
    let href= 'https://' + host + '/bbr/grunde/' + grund.id;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRGrund(data) {
  return function() {
    danNavbar(ressource,'<h2>' + 'Grund' + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBRGrundIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBRGrundIndhold(data, indrykninger= 0)
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
  if (data.kommune) {
    ec('tbody'); 
    let label= 'kommune';
    eo('tbody', null, null, 'id', label);
      getKommune(label, data.kommune.kode);
    ec('tbody');
    eo('tbody');  
  }
  if (data.bestemtFastEjendom) {
    ec('tbody'); 
    let label= 'Ejendomsrelation';
    eo('tbody', null, null, 'id', label);
      getBBREjendomsrelation(label, data.bestemtFastEjendom.href);
    ec('tbody');
    eo('tbody');  
  }
  if (data.gru009Vandforsyning) {
    eo('tr');
      eotd(indrykninger);
        html('Vandforsyning: ' + strong(bbr.getGruVandforsyning(data.gru009Vandforsyning)));
      ec('td');
    ec('tr');
  }
  if (data.gru010Afløbsforhold) {
    eo('tr');
      eotd(indrykninger);
        html('Afløbsforhold: ' + strong(bbr.getAfloebsforhold(data.gru010Afløbsforhold)));
      ec('td');
    ec('tr');
  }
  if (data.gru021Udledningstilladelse) {
    eo('tr');
      eotd(indrykninger);
        html('Udledningstilladels: ' + strong(bbr.getUdledningstilladelse(data.gru021Udledningstilladelse)));
      ec('td');
    ec('tr');
  }
  if (data.gru022MedlemskabAfSpildevandsforsyning ) {
    eo('tr');
      eotd(indrykninger);
        html('Medlemskab af spildevandsforsyning: ' + strong(bbr.getMedlemsskabAfSplidevandforsyning(data.gru022MedlemskabAfSpildevandsforsyning )));
      ec('td');
    ec('tr');
  }
  if (data.gru023PåbudVedrSpildevandsafledning ) {
    eo('tr');
      eotd(indrykninger);
        html('Påbud vedr. spildevandsafledning: ' + strong(bbr.getRensningspaabud(data.gru023PåbudVedrSpildevandsafledning )));
      ec('td');
    ec('tr');
  }
  if (data.gru024FristVedrSpildevandsafledning) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.gru024FristVedrSpildevandsafledning);
        html('Frist vedr. spildevandsafledning: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }  
  if (data.gru025TilladelseTilUdtræden) {
    eo('tr');
      eotd(indrykninger);
        html('Tilladelse til udtrædeng: ' + strong(bbr.getRensningspaabud(data.gru025TilladelseTilUdtræden)));
      ec('td');
    ec('tr');
  }
  if (data.gru026DatoForTilladelseTilUdtræden) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.gru026DatoForTilladelseTilUdtræden);
        html('Tilladelse til udtræden d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }   
  if (data.gru027TilladelseTilAlternativBortskaffelseEllerAfledning) {
    eo('tr');
      eotd(indrykninger);
        html('Tilladelse til alternativ bortskaffelse: ' + strong(bbr.getTilladelseTilAlternativBortskaffelseEllerAfledning(data.gru027TilladelseTilAlternativBortskaffelseEllerAfledning)));
      ec('td');
    ec('tr');
  }
  if (data.gru028DatoForTilladelseTilAlternativBortskaffelseEllerAfledning) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.gru028DatoForTilladelseTilAlternativBortskaffelseEllerAfledning);
        html('Tilladelse til alternativ bortskaffelse d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  }    
  if (data.gru029DispensationFritagelseIftKollektivVarmeforsyning) {
    eo('tr');
      eotd(indrykninger);
        html('Dispensation ift. kollektiv varmeforsyning: ' + strong(bbr.getDispensationFritagelseIftKollektivVarmeforsyning(data.gru029DispensationFritagelseIftKollektivVarmeforsyning)));
      ec('td');
    ec('tr');
  }
  if (data.gru030DatoForDispensationFritagelseIftKollektivVarmeforsyning) {
    eo('tr');
      eotd(indrykninger);
        let dato= new Date(data.gru030DatoForDispensationFritagelseIftKollektivVarmeforsyning);
        html('Dispensation ift. kollektiv varmeforsyning d.: ' + strong(dato.toLocaleString()));
      ec('td');
    ec('tr');
  } 
  if (data.gru500Notatlinjer) {
    eo('tr');
      eotd(indrykninger);
        html('Notatlinjer: ' + strong(data.gru500Notatlinjer));
      ec('td');
    ec('tr');
  } 
  ec('tbody'); 
  let label= 'jordstykker';
  eo('tbody', null, null, 'id', label);
    getGrundJordstykker(label, data.id, indrykninger);
  ec('tbody');
  eo('tbody'); 
  ec('tbody'); 
  label= 'tekniskeanlæg';
  eo('tbody', null, null, 'id', label);
    getBBRBygningsTekniskeAnlæg(label, data.id, 'grund_id');
  ec('tbody');
  eo('tbody'); 
}

function visBBRGrundJordstykkeKort(data) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(data.status));
        text(bbr.getLivscyklus(data.status));
      ec('span');
      html('<br/>' + data.grund.id + ' <-> ' + data.jordstykke.id);
    ec('td');
    let href= data.href;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRGrundJordstykke(data) {
  return function() {
    danNavbar(ressource,'<h2>Grund id:' + data.grund.id + ' <-> Jordstykke featureid: ' + data.jordstykke.id + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBRGrundJordstykkeIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBRGrundJordstykkeIndhold(data, indrykninger= 0)
{    
  // eo('tr');
  //   eotd(indrykninger);
  //     html('Status: ');
  //     eo('span', null, null,
  //             'class', 'badge badge-pill '+BBRStatusFarve(data.status));
  //             text(bbr.getLivscyklus(data.status));
  //     ec('span');
  //   ec('td');
  // ec('tr');       
  eo('tr');
    eotd(indrykninger);
      html('Id: ' + strong(data.id));
    ec('td');
  ec('tr');
  if (data.grund.id) {
    ec('tbody'); 
    let label= 'grund';
    eo('tbody', null, null, 'id', label);
      getBBRGrund(label, data.grund.href);
    ec('tbody'); 
    eo('tbody'); 
  }  
  if (data.jordstykke) {
    ec('tbody'); 
    let label= 'jordstykke';
    eo('tbody', null, null, 'id', label);
      getJordstykke(label,data.jordstykke.id);
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
}

function visBBRFordelingsarealKort(data) {  
  eo('tr');
    eo('td');
      eo('span', null, null,
        'class', 'badge badge-pill '+BBRStatusFarve(data.status));
        text(bbr.getLivscyklus(data.status));
      ec('span');
      html('<br/>Fordelingsareal: ' + data.for005Navn);
    ec('td');
    let href= data.href;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRFordelingsareal(data) {
  return function() {
    danNavbar(ressource,'<h2>Fordelingsareal: ' + data.for005Navn + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBRFordelingsarealIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBRFordelingsarealIndhold(data, indrykninger= 0)
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
  if (data.for005Navn) {
    eo('tr');
      eotd(indrykninger);
        html('Navn: ' + strong(data.for005Navn));
      ec('td');
    ec('tr');
  }
  if (data.for002Fordelingsarealnummer) {
    eo('tr');
      eotd(indrykninger);
        html('Fordelingsarealnummer: ' + strong(data.for002Fordelingsarealnummer));
      ec('td');
    ec('tr');
  }
  if (data.for003ArealTilFordeling) {
    eo('tr');
      eotd(indrykninger);
        html('Areal til fordeling: ' + strong(data.for003ArealTilFordeling));
      ec('td');
    ec('tr');
  }
  if (data.for004FordelingsNøgle) {
    eo('tr');
      eotd(indrykninger);
        html('Fordelingsnøgle: ' + strong(bbr.getFordelingsnoegle(data.for004FordelingsNøgle)));
      ec('td');
    ec('tr');
  }
  if (data.for006Rest) {
    eo('tr');
      eotd(indrykninger);
        html('Rest: ' + strong(data.for006Rest));
      ec('td');
    ec('tr');
  }
  if (data.for500Notatlinjer) {
    eo('tr');
      eotd(indrykninger);
        html('Notatlinjer: ' + strong(data.for500Notatlinjer));
      ec('td');
    ec('tr');
  }
  if (data.bygning) {
    ec('tbody'); 
    let visBBRBygning= 'visBBRBygning';
    eo('tbody', null, null, 'id', visBBRBygning);
      getBBRBygning(visBBRBygning,data.bygning.id);
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
}

function visBBRFordelingAfFordelingsarealKort(data) {  
  eo('tr');
    eo('td');
      // eo('span', null, null,
      //   'class', 'badge badge-pill '+BBRStatusFarve(data.status));
      //   text(bbr.getLivscyklus(data.status));
      // ec('span');
      html('<br/>Fordeling af fordelingsareal: ' + data.id);
    ec('td');
    let href= data.href;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRFordelingAfFordelingsareal(data) {
  return function() {
    danNavbar(ressource,'<h2>Fordeling af fordelingsareal: ' + data.id + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBRFordelingAfFordelingsarealIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBRFordelingAfFordelingsarealIndhold(data, indrykninger= 0)
{    
  // eo('tr');
  //   eotd(indrykninger);
  //     html('Status: ');
  //     eo('span', null, null,
  //             'class', 'badge badge-pill '+BBRStatusFarve(data.status));
  //             text(bbr.getLivscyklus(data.status));
  //     ec('span');
  //   ec('td');
  // ec('tr');       
  eo('tr');
    eotd(indrykninger);
      html('Id: ' + strong(data.id));
    ec('td');
  ec('tr');
  if (data.beboelsesArealFordeltTilEnhed) {
    eo('tr');
      eotd(indrykninger);
        html('Beboelsesareal fordelt til enhed: ' + strong(data.beboelsesArealFordeltTilEnhed));
      ec('td');
    ec('tr');
  }
  if (data.erhvervsArealFordeltTilEnhed) {
    eo('tr');
      eotd(indrykninger);
        html('Erhversareal fordelt til enhed: ' + strong(data.erhvervsArealFordeltTilEnhed));
      ec('td');
    ec('tr');
  }
  if (data.fordelingsareal) {
    ec('tbody'); 
    let label= 'visBBRFordelingsareal';
    eo('tbody', null, null, 'id', label);
      getBBRFordelingsareal(label,data.fordelingsareal.href);
    ec('tbody'); 
    eo('tbody');
  }
  if (data.enhed) {
    ec('tbody'); 
    let label= 'visBBREnhed';
    eo('tbody', null, null, 'id', label);
      getBBREnhed(label,data.enhed.href);
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
}


function visBBREnhedEjerlejlighedKort(data) {  
  eo('tr');
    eo('td');
      // eo('span', null, null,
      //   'class', 'badge badge-pill '+BBRStatusFarve(data.status));
      //   text(bbr.getLivscyklus(data.status));
      // ec('span');
      html('<br/>EnhedEjerlejlighed: ' + data.id);
    ec('td');
    let href= data.href;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBREnhedEjerlejlighed(data) {
  return function() {
    danNavbar(ressource,'<h2>EnhedEjerlejlighed: ' + data.id + '</h2', false);
    eo('table',null,null,
      'class', tableclasses); 
      eo('tbody');
        BBREnhedEjerlejlighedIndhold(data);
      ec('tbody'); 
    ec('table');
  }
}

function BBREnhedEjerlejlighedIndhold(data, indrykninger= 0)
{    
  // eo('tr');
  //   eotd(indrykninger);
  //     html('Status: ');
  //     eo('span', null, null,
  //             'class', 'badge badge-pill '+BBRStatusFarve(data.status));
  //             text(bbr.getLivscyklus(data.status));
  //     ec('span');
  //   ec('td');
  // ec('tr');       
  eo('tr');
    eotd(indrykninger);
      html('Id: ' + strong(data.id));
    ec('td');
  ec('tr');
  if (data.ejerlejlighed) {
    ec('tbody'); 
    let label= 'Ejendomsrelation';
    eo('tbody', null, null, 'id', label);
      getBBREjendomsrelation(label, data.ejerlejlighed.href);
    ec('tbody');
    eo('tbody');  
  }
  if (data.enhed) {
    ec('tbody'); 
    let label= 'visBBREnhed';
    eo('tbody', null, null, 'id', label);
      getBBREnhed(label,data.enhed.href);
    ec('tbody'); 
    eo('tbody');
  }
  if (data.bestemtFastEjendom) {
    ec('tbody'); 
    let label= 'Ejendomsrelation';
    eo('tbody', null, null, 'id', label);
      getBBREjendomsrelation(label, data.bestemtFastEjendom.href);
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

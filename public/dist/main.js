/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(2)
    , URL = __webpack_require__(4)
    , queryString = __webpack_require__(7)
    , dom = __webpack_require__(11);


var eo = dom.elementOpen,
    ec = dom.elementClose,
    ev = dom.elementVoid,
    text = dom.text;

const listetableclasses= 'table table-hover'
    , tableclasses= 'table table-borderless table-hover'
    , theadclasses= 'thead-dark';

var visSide= function(container) {

  let arr= dawaUrl.pathname.split('/');
  let ressource= arr[1];

  query.format= 'json';
  delete query.struktur;
  dawaUrl.set('query',queryString.stringify(query));

  let urltext= dawaUrl.toString();

  fetch(urltext).then( function(response) {
    response.json().then( function ( data ) {
      visInfo(container, ressource, data);
    });
  });
}

function visData(data, visEnKort, visEn, ressource, compare) {  
  if (Array.isArray(data) && data.length !== 1) {      
    dom.patch(container, visListe(data, visEnKort, ressource, compare)); 
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
    visData(data, visDAGIKort, visDAGI(ressource), flertal(ressource), ressource, null);
    break;
  case 'regioner':
    visData(data, visRegionKort, visRegion, ressource, null);
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
  default:    
    html('<h1>Ukendt ressource: ' + ressource + '</h1>');
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
  case 'politikredse':
    tekst= 'politikreds';
    break;
  case 'retskredse':
    tekst= 'retskreds';
    break;
  case 'regioner':
    tekst= 'region';
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
  case 'supplerendebynavne2': 
    tekst= 'supplerende bynavne';
    break;  
  case 'ejerlav': 
    tekst= 'ejserlav';
    break;
  case 'jordstykker':
    tekst= 'jordstykker';
    break;  
  case 'postnumre': 
    tekst= 'postnumre';
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
    tekst= 'bebyggelse';
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
  default:    
    html('<h1>Ukendt ressource: ' + ressource + '</h1>');
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
  case "gældende":
    tekst= 'badge-success';
    break;
  case "foreløbig":
    tekst= 'badge-warning';
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


function visOverskrift(overskrift) {
  eo('thead', null, null,
      'class', theadclasses);    
    eo('tr');
      eo('th');
        html(strong(overskrift));
      ec('th');          
      eo('th');ec('th');
      badge('kort', 'badge-primary', url.href.replace('info','vis'), true);
      badge('data', 'badge-primary', url.href.replace('info','dawa'), true);
    ec('tr'); 
  ec('thead');
}

function visListe(data, visEnkeltKort, overskrift, compare) {
  return function() {
    eo('table',null,null,
      'class', listetableclasses);
      visOverskrift('<em>' + capitalizeFirstLetter(overskrift) + '</em>');
      eo('tbody');
      for (let i= 0; i<data.length; i++) {
        if (compare) data.sort(compare);
        visEnkeltKort(data[i], 0);
      }
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th'); 
            html(em('Adresse') + '<br/>' + '<strong>' + util.formatHelAdresse(data, false) + '</strong>');
          ec('th');
          eo('th');
          ec('th'); 
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr'); 
      ec('thead')
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
      'class', tableclasses); //table-striped'); //) table-dark');
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th'); 
            html(em('Adgangsadresse') + '<br/>' + '<strong>' + util.formatAdgangsadresse(data, false) + '</strong>');
          ec('th');
          eo('th');
          ec('th')
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');
      ec('thead');
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th'); 
            html(em('Navngiven vej') + '<br/>' + strong(data.navn + ' (' + data.administrerendekommune.kode + ' ' +  data.administrerendekommune.navn + ')'));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');
      ec('thead');
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
            html('Nøjagtighedsklasse: ' + strong(data.beliggenhed.oprindelse.nøjagtighedsklasse + ' - ' + nøjagtighedTekst(data.beliggenhed.oprindelse.nøjagtighedsklasse)));
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th'); 
            html(em('Bygning') + '<br/>' + strong(data.id));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');
      ec('thead');
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
      html(strong(data.kode + ' ' + data.navn + ' (' + data.kommune.kode + ' ' +  data.kommune.navn + ')'));
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th'); 
            html(em('Vejstykke') + '<br/>' + strong(data.kode + ' ' + data.navn + ' (' + data.kommune.kode + ' ' +  data.kommune.navn + ')'));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');
      ec('thead'); 
      eo('tbody');          
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

function visSupplerendeBynavnKort(data) {  
  eo('tr');
    eo('td');
      html(data.navn);
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Supplerende bynavn') + '<br/>' +strong(data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr'); 
      ec('thead');  
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Ejerlav') + '<br/>' + strong(data.kode + ' ' +data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr'); 
      ec('thead'); 
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Jordstykke') + '<br/>' + strong(data.matrikelnr + ' ' + data.ejerlav.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');
      ec('thead'); 
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
        eo('tr');
          eo('td');
            html('Fælleslod: ' + strong(data.fælleslod?'Ja':'Nej'));
          ec('td');
        ec('tr');
        if (data.moderjordstykke) {                   
          eo('tr');
            eo('td');
            html('Moderjordstykke: ' + strong(data.moderjordstykke));
            ec('td');
            // badge('info', 'badge-primary', postnummer.href.replace('dawa.aws.dk',host));
            // badge('kort', 'badge-primary', postnummer.href.replace('dawa','vis'));
            // badge('data', 'badge-primary', postnummer.href);
          ec('tr');
        }                   
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
        eo('thead', null, null,
          'class', theadclasses);
          eo('tr');
            eo('th');
              html(em(capitalizeFirstLetter(ental(ressource))) + '<br/>' + strong(data.kode + ' ' + data.navn));
            ec('th');
            eo('th');
            ec('th');
            badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
            badge('data', 'badge-primary', data.href, true);
          ec('tr'); 
        ec('thead');
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Kommune') + '<br/>' + strong(data.kode + ' ' + data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');
      ec('thead'); 
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Region') + '<br/>' + strong(data.kode + ' ' + data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');
      ec('thead'); 
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Afstemningsområde') + '<br/>' + strong(data.nummer + ' ' + data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');       
      ec('thead'); 
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Menighedsrådsafstemningsområde') + '<br/>' + strong(data.nummer + ' ' + data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');       
      ec('thead'); 
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Opstillingskreds') + '<br/>' + strong(data.nummer + ' ' + data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');       
      ec('thead');  
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Storkreds') + '<br/>' + strong(data.nummer + ' ' + data.navn));
          ec('th');          
          eo('th');
          ec('th');
         // badge('Opstillingskredse', 'badge-primary', origin + '/opstillingskredse?storkredsnummer='+data.nummer);
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');    
      ec('thead'); 
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Valglandsdele') + '<br/>' + strong(data.bogstav + ' ' + data.navn));
          ec('th');
          eo('th');
          ec('th');
        //  badge('Storkredse', 'badge-primary', origin + '/storkredse?Valglandsdelnummer='+data.nummer);
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');  
      ec('thead');
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Postnummer') + '<br/>' + strong(data.nr + ' ' + data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href,true);
        ec('tr');   
      ec('thead');  
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
      eo('thead', null, null,
        'class', theadclasses);   
      ec('thead');
        eo('tr');
          eo('th');
            html(em('Stednavn') + '<br/>' + strong(data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr'); 
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
      eo('thead', null, null,
        'class', theadclasses); 
        eo('tr');
          eo('th');
            html(em('Bebyggelse') + '<br/>' + strong(data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr'); 
      ec('thead');      
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Stednavn') + '<br/>' + strong(data.navn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');
      ec('thead');  
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
    data.sekundærenavne.forEach(navn => {                          
      eo('tr');
        eotd(indrykninger);
          html(strong(navn));
        ec('td');
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
      eo('thead', null, null,
        'class', theadclasses);
        eo('tr');
          eo('th');
            html(em('Sted') + '<br/>' + strong(data.primærtnavn));
          ec('th');
          eo('th');
          ec('th');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'), true);
          badge('data', 'badge-primary', data.href, true);
        ec('tr');  
      ec('thead'); 
      eo('tbody');
        stedIndhold(data, 0);
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var URLSearchParams = __webpack_require__(3);

exports.corssupported= function () {
  return "withCredentials" in (new XMLHttpRequest());
}

function formatAa(vejnavn,husnr,supplerendebynavn,postnr,postnrnavn,enlinje) {
	let separator= (enlinje || typeof enlinje === 'undefined')?", ":"<br/>";
	supplerendebynavn= supplerendebynavn?separator + supplerendebynavn:"";
	return vejnavn + " " + husnr + supplerendebynavn + separator + postnr + " " + postnrnavn
}

exports.formatAdgangsadresse= function (record, enlinje) {
	if (record.vejstykke) {
		return formatAa(record.vejstykke.navn, record.husnr, record.supplerendebynavn, record.postnummer.nr, record.postnummer.navn, enlinje);
	}
	else {
		return formatAa(record.vejnavn, record.husnr, record.supplerendebynavn, record.postnr, record.postnrnavn, enlinje);
	}	
}

exports.formatAdresse= function (mini, enlinje) {
	let separator= (enlinje || typeof enlinje === 'undefined')?", ":"<br/>";
	let etagedør= (mini.etage?", "+mini.etage+".":"") + (mini.dør?" "+mini.dør:"");

	let supplerendebynavn= mini.supplerendebynavn?separator + mini.supplerendebynavn:"";
	return mini.vejnavn + " " + mini.husnr + etagedør + supplerendebynavn + separator + mini.postnr + " " + mini.postnrnavn
}

exports.formatHelAdresse= function (adresse, enlinje) {
	let separator= (enlinje || typeof enlinje === 'undefined')?", ":"<br/>";
	let etagedør= (adresse.etage?", "+adresse.etage+".":"") + (adresse.dør?" "+adresse.dør:"");

	let supplerendebynavn= adresse.adgangsadresse.supplerendebynavn?separator + adresse.adgangsadresse.supplerendebynavn:"";
	return adresse.adgangsadresse.vejstykke.navn + " " + adresse.adgangsadresse.husnr + etagedør + supplerendebynavn + separator + adresse.adgangsadresse.postnummer.nr + " " + adresse.adgangsadresse.postnummer.navn
}

exports.danUrl= function (path, query) { 
  var params = new URLSearchParams();
  Object.keys(query).forEach(function(key) {params.set(key, query[key])});
  return path + "?" + params.toString();
}

exports.getQueryVariable= function (variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0; i<vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
Copyright (C) 2015 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


function URLSearchParams(query) {
  var
    index, key, value,
    pairs, i, length,
    dict = Object.create(null)
  ;
  this[secret] = dict;
  if (!query) return;
  if (typeof query === 'string') {
    if (query.charAt(0) === '?') {
      query = query.slice(1);
    }
    for (
      pairs = query.split('&'),
      i = 0,
      length = pairs.length; i < length; i++
    ) {
      value = pairs[i];
      index = value.indexOf('=');
      if (-1 < index) {
        appendTo(
          dict,
          decode(value.slice(0, index)),
          decode(value.slice(index + 1))
        );
      } else if (value.length){
        appendTo(
          dict,
          decode(value),
          ''
        );
      }
    }
  } else {
    if (isArray(query)) {
      for (
        i = 0,
        length = query.length; i < length; i++
      ) {
        value = query[i];
        appendTo(dict, value[0], value[1]);
      }
    } else {
      for (key in query) {
         appendTo(dict, key, query[key]);
      }
    }
  }
}

var
  isArray = Array.isArray,
  URLSearchParamsProto = URLSearchParams.prototype,
  find = /[!'\(\)~]|%20|%00/g,
  plus = /\+/g,
  replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  },
  replacer = function (match) {
    return replace[match];
  },
  iterable = isIterable(),
  secret = '__URLSearchParams__:' + Math.random()
;

function appendTo(dict, name, value) {
  if (name in dict) {
    dict[name].push('' + value);
  } else {
    dict[name] = isArray(value) ? value : ['' + value];
  }
}

function decode(str) {
  return decodeURIComponent(str.replace(plus, ' '));
}

function encode(str) {
  return encodeURIComponent(str).replace(find, replacer);
}

function isIterable() {
  try {
    return !!Symbol.iterator;
  } catch(error) {
    return false;
  }
}

URLSearchParamsProto.append = function append(name, value) {
  appendTo(this[secret], name, value);
};

URLSearchParamsProto.delete = function del(name) {
  delete this[secret][name];
};

URLSearchParamsProto.get = function get(name) {
  var dict = this[secret];
  return name in dict ? dict[name][0] : null;
};

URLSearchParamsProto.getAll = function getAll(name) {
  var dict = this[secret];
  return name in dict ? dict[name].slice(0) : [];
};

URLSearchParamsProto.has = function has(name) {
  return name in this[secret];
};

URLSearchParamsProto.set = function set(name, value) {
  this[secret][name] = ['' + value];
};

URLSearchParamsProto.forEach = function forEach(callback, thisArg) {
  var dict = this[secret];
  Object.getOwnPropertyNames(dict).forEach(function(name) {
    dict[name].forEach(function(value) {
      callback.call(thisArg, value, name, this);
    }, this);
  }, this);
};

URLSearchParamsProto.keys = function keys() {
  var items = [];
  this.forEach(function(value, name) { items.push(name); });
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value};
    }
  };

  if (iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

URLSearchParamsProto.values = function values() {
  var items = [];
  this.forEach(function(value) { items.push(value); });
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value};
    }
  };

  if (iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

URLSearchParamsProto.entries = function entries() {
  var items = [];
  this.forEach(function(value, name) { items.push([name, value]); });
  var iterator = {
    next: function() {
      var value = items.shift();
      return {done: value === undefined, value: value};
    }
  };

  if (iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

if (iterable) {
  URLSearchParamsProto[Symbol.iterator] = URLSearchParamsProto.entries;
}

/*
URLSearchParamsProto.toBody = function() {
  return new Blob(
    [this.toString()],
    {type: 'application/x-www-form-urlencoded'}
  );
};
*/

URLSearchParamsProto.toJSON = function toJSON() {
  return {};
};

URLSearchParamsProto.toString = function toString() {
  var dict = this[secret], query = [], i, key, name, value;
  for (key in dict) {
    name = encode(key);
    for (
      i = 0,
      value = dict[key];
      i < value.length; i++
    ) {
      query.push(name + '=' + encode(value[i]));
    }
  }
  return query.join('&');
};

module.exports = global.URLSearchParams || URLSearchParams;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var required = __webpack_require__(5)
  , qs = __webpack_require__(6)
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address) {          // Sanitize what is left of the address
    return address.replace('\\', '/');
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var location = global && global.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address) {
  var match = protocolre.exec(address);

  return {
    protocol: match[1] ? match[1].toLowerCase() : '',
    slashes: !!match[2],
    rest: match[3]
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} location Location defaults for relative paths.
 * @param {Boolean|Function} parser Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '');
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      if (~(index = address.indexOf(parse))) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';
  if (url.auth) {
    instruction = url.auth.split(':');
    url.username = instruction[0] || '';
    url.password = instruction[1] || '';
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (/:\d+$/.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    default:
      url[part] = value;
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.origin = url.protocol && url.host && url.protocol !== 'file:'
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result = protocol + (url.slashes ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  }

  result += url.host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.qs = qs;

module.exports = Url;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    if (key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(value));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(8);
var objectAssign = __webpack_require__(9);
var decodeComponent = __webpack_require__(10);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

function extract(str) {
	var queryStart = str.indexOf('?');
	if (queryStart === -1) {
		return '';
	}
	return str.slice(queryStart + 1);
}

function parse(str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^[?#&]/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeComponent(val);

		formatter(decodeComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	if (opts.sort === false) {
		opts.sort = function () {};
	}

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort(opts.sort).map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

exports.parseUrl = function (str, opts) {
	return {
		url: str.split('?')[0] || '',
		query: parse(extract(str), opts)
	};
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
/**
 * @preserve
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0.
 */



Object.defineProperty(exports, '__esModule', { value: true });

const __assign = Object.assign || function (target) {
    for (var source, i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (var prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
}

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var symbols = {
  default: '__default'
};

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A cached reference to the hasOwnProperty function.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * A constructor function that will create blank objects.
 */
function Blank() {}
Blank.prototype = Object.create(null);
/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param map The map to check.
 * @param property The property to check.
 * @return Whether map has property.
 */
function has(map, property) {
  return hasOwnProperty.call(map, property);
}
/**
 * Creates an map object without a prototype.
 */
// tslint:disable-next-line:no-any
function createMap() {
  // tslint:disable-next-line:no-any
  return new Blank();
}
/**
 * Truncates an array, removing items up until length.
 * @param arr The array to truncate.
 * @param length The new length of the array.
 */
function truncateArray(arr, length) {
  while (arr.length > length) {
    arr.pop();
  }
}

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns the namespace to use for the attribute.
 */
function getNamespace(name) {
    if (name.lastIndexOf('xml:', 0) === 0) {
        return 'http://www.w3.org/XML/1998/namespace';
    }
    if (name.lastIndexOf('xlink:', 0) === 0) {
        return 'http://www.w3.org/1999/xlink';
    }
    return undefined;
}
/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 */
// tslint:disable-next-line:no-any
function applyAttr(el, name, value) {
    if (value == null) {
        el.removeAttribute(name);
    } else {
        var attrNS = getNamespace(name);
        if (attrNS) {
            el.setAttributeNS(attrNS, name, String(value));
        } else {
            el.setAttribute(name, String(value));
        }
    }
}
/**
 * Applies a property to a given Element.
 */
// tslint:disable-next-line:no-any
function applyProp(el, name, value) {
    // tslint:disable-next-line:no-any
    el[name] = value;
}
/**
 * Applies a value to a style declaration. Supports CSS custom properties by
 * setting properties containing a dash using CSSStyleDeclaration.setProperty.
 */
function setStyleValue(style, prop, value) {
    if (prop.indexOf('-') >= 0) {
        style.setProperty(prop, value);
    } else {
        // TODO(tomnguyen) Figure out why this is necessary.
        // tslint:disable-next-line:no-any
        style[prop] = value;
    }
}
/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param el
 * @param name The attribute's name.
 * @param  style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
function applyStyle(el, name, style) {
    if (typeof style === 'string') {
        el.style.cssText = style;
    } else {
        el.style.cssText = '';
        var elStyle = el.style;
        for (var prop in style) {
            if (has(style, prop)) {
                setStyleValue(elStyle, prop, style[prop]);
            }
        }
    }
}
/**
 * Updates a single attribute on an Element.
 * @param el
 * @param name The attribute's name.
 * @param value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
function applyAttributeTyped(el, name, value) {
    var type = typeof value;
    if (type === 'object' || type === 'function') {
        applyProp(el, name, value);
    } else {
        applyAttr(el, name, value);
    }
}
/**
 * A publicly mutable object to provide custom mutators for attributes.
 * NB: The result of createMap() has to be recast since closure compiler
 * will just assume attributes is "any" otherwise and throws away
 * the type annotation set by tsickle.
 */
var attributes = createMap();
// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes[symbols.default] = applyAttributeTyped;
attributes['style'] = applyStyle;
/**
 * Calls the appropriate attribute mutator for this attribute.
 */
function updateAttribute(el, name, value) {
    var mutator = attributes[name] || attributes[symbols.default];
    mutator(el, name, value);
}

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var DEBUG = true;

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Keeps track whether or not we are in an attributes declaration (after
 * elementOpenStart, but before elementOpenEnd).
 */
var inAttributes = false;
/**
 * Keeps track whether or not we are in an element that should not have its
 * children cleared.
 */
var inSkip = false;
/**
 * Makes sure that there is a current patch context.
 */
function assertInPatch(functionName, context) {
    if (!context) {
        throw new Error('Cannot call ' + functionName + '() unless in patch.');
    }
}
/**
 * Makes sure that a patch closes every node that it opened.
 * @param openElement
 * @param root
 */
function assertNoUnclosedTags(openElement, root) {
    if (openElement === root) {
        return;
    }
    var currentElement = openElement;
    var openTags = [];
    while (currentElement && currentElement !== root) {
        openTags.push(currentElement.nodeName.toLowerCase());
        currentElement = currentElement.parentNode;
    }
    throw new Error('One or more tags were not closed:\n' + openTags.join('\n'));
}
/**
 * Makes sure that node being outer patched has a parent node.
 */
function assertPatchOuterHasParentNode(parent) {
    if (!parent) {
        console.warn('patchOuter requires the node have a parent if there is a key.');
    }
}
/**
 * Makes sure that the caller is not where attributes are expected.
 */
function assertNotInAttributes(functionName) {
    if (inAttributes) {
        throw new Error(functionName + '() can not be called between ' + 'elementOpenStart() and elementOpenEnd().');
    }
}
/**
 * Makes sure that the caller is not inside an element that has declared skip.
 */
function assertNotInSkip(functionName) {
    if (inSkip) {
        throw new Error(functionName + '() may not be called inside an element ' + 'that has called skip().');
    }
}
/**
 * Makes sure that the caller is where attributes are expected.
 */
function assertInAttributes(functionName) {
    if (!inAttributes) {
        throw new Error(functionName + '() can only be called after calling ' + 'elementOpenStart().');
    }
}
/**
 * Makes sure the patch closes virtual attributes call
 */
function assertVirtualAttributesClosed() {
    if (inAttributes) {
        throw new Error('elementOpenEnd() must be called after calling ' + 'elementOpenStart().');
    }
}
/**
 * Makes sure that tags are correctly nested.
 */
function assertCloseMatchesOpenTag(currentNameOrCtor, nameOrCtor) {
    if (currentNameOrCtor !== nameOrCtor) {
        throw new Error('Received a call to close "' + nameOrCtor + '" but "' + currentNameOrCtor + '" was open.');
    }
}
/**
 * Makes sure that no children elements have been declared yet in the current
 * element.
 */
function assertNoChildrenDeclaredYet(functionName, previousNode) {
    if (previousNode !== null) {
        throw new Error(functionName + '() must come before any child ' + 'declarations inside the current element.');
    }
}
/**
 * Checks that a call to patchOuter actually patched the element.
 * @param maybeStartNode The value for the currentNode when the patch
 *     started.
 * @param currentNode The currentNode when the patch finished.
 * @param expectedNextNode The Node that is expected to follow the
 *    currentNode after the patch;
 * @param  expectedPrevNode The Node that is expected to preceed the
 *    currentNode after the patch.
 */
function assertPatchElementNoExtras(maybeStartNode, maybeCurrentNode, expectedNextNode, expectedPrevNode) {
    assert(maybeStartNode);
    var startNode = maybeStartNode;
    // tslint:disable-next-line:no-unnecessary-type-assertion
    var currentNode = maybeCurrentNode;
    var wasUpdated = currentNode.nextSibling === expectedNextNode && currentNode.previousSibling === expectedPrevNode;
    var wasChanged = currentNode.nextSibling === startNode.nextSibling && currentNode.previousSibling === expectedPrevNode;
    var wasRemoved = currentNode === startNode;
    if (!wasUpdated && !wasChanged && !wasRemoved) {
        throw new Error('There must be exactly one top level call corresponding ' + 'to the patched element.');
    }
}
/**
 * Updates the state of being in an attribute declaration.
 * @return the previous value.
 */
function setInAttributes(value) {
    var previous = inAttributes;
    inAttributes = value;
    return previous;
}
/**
 * Updates the state of being in a skip element.
 * @return the previous value.
 */
function setInSkip(value) {
    var previous = inSkip;
    inSkip = value;
    return previous;
}
/**
 * Asserts that a value exists and is not null or undefined. goog.asserts
 * is not used in order to avoid dependencies on external code.
 */
function assert(val) {
    if (process.env.NODE_ENV !== 'production' && !val) {
        throw new Error('Expected value to be defined');
    }
    return val;
}

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var notifications = {
  nodesCreated: null,
  nodesDeleted: null
};

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A context object keeps track of the state of a patch.
 */
var Context = /** @class */function () {
    function Context() {
        this.created = [];
        this.deleted = [];
    }
    Context.prototype.markCreated = function (node) {
        this.created.push(node);
    };
    Context.prototype.markDeleted = function (node) {
        this.deleted.push(node);
    };
    /**
     * Notifies about nodes that were created during the patch operation.
     */
    Context.prototype.notifyChanges = function () {
        if (notifications.nodesCreated && this.created.length > 0) {
            notifications.nodesCreated(this.created);
        }
        if (notifications.nodesDeleted && this.deleted.length > 0) {
            notifications.nodesDeleted(this.deleted);
        }
    };
    return Context;
}();

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Checks if the node is the root of a document. This is either a Document
 * or ShadowRoot. DocumentFragments are included for simplicity of the
 * implementation, though we only want to consider Documents or ShadowRoots.
 * @param node The node to check.
 * @return True if the node the root of a document, false otherwise.
 */
function isDocumentRoot(node) {
    return node.nodeType === 11 || node.nodeType === 9;
}
/**
 * Checks if the node is an Element. This is faster than an instanceof check.
 * @param node The node to check.
 * @return Whether or not the node is an Element.
 */
function isElement(node) {
    return node.nodeType === 1;
}
/**
 * Checks if the node is a text node. This is faster than an instanceof check.
 * @param node The node to check.
 * @return Whether or not the node is a Text.
 */
function isText(node) {
    return node.nodeType === 3;
}
/**
 * @param  node The node to start at, inclusive.
 * @param  root The root ancestor to get until, exclusive.
 * @return The ancestry of DOM nodes.
 */
function getAncestry(node, root) {
    var ancestry = [];
    var cur = node;
    while (cur !== root) {
        var n = cur;
        ancestry.push(n);
        cur = n.parentNode;
    }
    return ancestry;
}
/**
 * return The root node of the DOM tree that contains this node.
 */
var getRootNode =
// tslint:disable-next-line:no-any b/79476176
Node.prototype.getRootNode || function () {
    // tslint:disable-next-line:no-unnecessary-type-assertion b/77361044
    var cur = this;
    var prev = cur;
    while (cur) {
        prev = cur;
        cur = cur.parentNode;
    }
    return prev;
};
/**
 * @param node The node to get the activeElement for.
 * @return The activeElement in the Document or ShadowRoot
 *     corresponding to node, if present.
 */
function getActiveElement(node) {
    var root = getRootNode.call(node);
    return isDocumentRoot(root) ? root.activeElement : null;
}
/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param node The reference node to get the activeElement for.
 * @param root The root to get the focused path until.
 */
function getFocusedPath(node, root) {
    var activeElement = getActiveElement(node);
    if (!activeElement || !node.contains(activeElement)) {
        return [];
    }
    return getAncestry(activeElement, root);
}
/**
 * Like insertBefore, but instead instead of moving the desired node, instead
 * moves all the other nodes after.
 * @param parentNode
 * @param node
 * @param referenceNode
 */
function moveBefore(parentNode, node, referenceNode) {
    var insertReferenceNode = node.nextSibling;
    var cur = referenceNode;
    while (cur !== null && cur !== node) {
        var next = cur.nextSibling;
        parentNode.insertBefore(cur, insertReferenceNode);
        cur = next;
    }
}

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 */
var NodeData = /** @class */function () {
    function NodeData(nameOrCtor, key, text) {
        /**
         * An array of attribute name/value pairs, used for quickly diffing the
         * incomming attributes to see if the DOM node's attributes need to be
         * updated.
         */
        // tslint:disable-next-line:no-any
        this._attrsArr = null;
        /**
         * Whether or not the statics have been applied for the node yet.
         */
        this.staticsApplied = false;
        this.nameOrCtor = nameOrCtor;
        this.key = key;
        this.text = text;
    }
    NodeData.prototype.hasEmptyAttrsArr = function () {
        var attrs = this._attrsArr;
        return !attrs || !attrs.length;
    };
    NodeData.prototype.getAttrsArr = function (length) {
        return this._attrsArr || (this._attrsArr = new Array(length));
    };
    return NodeData;
}();
/**
 * Initializes a NodeData object for a Node.
 */
function initData(node, nameOrCtor, key, text) {
    var data = new NodeData(nameOrCtor, key, text);
    node['__incrementalDOMData'] = data;
    return data;
}
/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 */
function getData(node, key) {
    return importSingleNode(node, key);
}
function isDataInitialized(node) {
    return Boolean(node['__incrementalDOMData']);
}
function getKey(node) {
    assert(node['__incrementalDOMData']);
    return getData(node).key;
}
/**
 * Imports single node and its subtree, initializing caches.
 */
function importSingleNode(node, fallbackKey) {
    if (node['__incrementalDOMData']) {
        return node['__incrementalDOMData'];
    }
    var nodeName = isElement(node) ? node.localName : node.nodeName;
    var key = isElement(node) ? node.getAttribute('key') || fallbackKey : null;
    var text = isText(node) ? node.data : undefined;
    var data = initData(node, nodeName, key, text);
    if (isElement(node)) {
        recordAttributes(node, data);
    }
    return data;
}
/**
 * Imports node and its subtree, initializing caches.
 */
function importNode(node) {
    importSingleNode(node);
    for (var child = node.firstChild; child; child = child.nextSibling) {
        importNode(child);
    }
}
/**
 * Clears all caches from a node and all of its children.
 */
function clearCache(node) {
    node['__incrementalDOMData'] = null;
    for (var child = node.firstChild; child; child = child.nextSibling) {
        clearCache(child);
    }
}
/**
 * Records the element's attributes.
 * @param node The Element that may have attributes
 * @param data The Element's data
 */
function recordAttributes(node, data) {
    var attributes = node.attributes;
    var length = attributes.length;
    if (!length) {
        return;
    }
    var attrsArr = data.getAttrsArr(length);
    // Use a cached length. The attributes array is really a live NamedNodeMap,
    // which exists as a DOM "Host Object" (probably as C++ code). This makes the
    // usual constant length iteration very difficult to optimize in JITs.
    for (var i = 0, j = 0; i < length; i += 1, j += 2) {
        var attr = attributes[i];
        var name = attr.name;
        var value = attr.value;
        attrsArr[j] = name;
        attrsArr[j + 1] = value;
    }
}

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Gets the namespace to create an element (of a given tag) in.
 */
function getNamespaceForTag(tag, parent) {
    if (tag === 'svg') {
        return 'http://www.w3.org/2000/svg';
    }
    if (tag === 'math') {
        return 'http://www.w3.org/1998/Math/MathML';
    }
    if (parent == null) {
        return null;
    }
    if (getData(parent).nameOrCtor === 'foreignObject') {
        return null;
    }
    return parent.namespaceURI;
}
/**
 * Creates an Element.
 * @param doc The document with which to create the Element.
 * @param nameOrCtor The tag or constructor for the Element.
 * @param key A key to identify the Element.
 * @param  typeId The type identifier for the Element.
 */
function createElement(doc, parent, nameOrCtor, key) {
    var el;
    if (typeof nameOrCtor === 'function') {
        el = new nameOrCtor();
    } else {
        var namespace = getNamespaceForTag(nameOrCtor, parent);
        if (namespace) {
            el = doc.createElementNS(namespace, nameOrCtor);
        } else {
            el = doc.createElement(nameOrCtor);
        }
    }
    initData(el, nameOrCtor, key);
    return el;
}
/**
 * Creates a Text Node.
 * @param doc The document with which to create the Element.
 * @return
 */
function createText(doc) {
    var node = doc.createTextNode('');
    initData(node, '#text', null);
    return node;
}

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var context = null;
var currentNode = null;
var currentParent = null;
var doc = null;
var focusPath = [];
/**
 * Used to build up call arguments. Each patch call gets a separate copy, so
 * this works with nested calls to patch.
 */
var argsBuilder = [];
/**
 * TODO(sparhami) We should just export argsBuilder directly when Closure
 * Compiler supports ES6 directly.
 */
function getArgsBuilder() {
    return argsBuilder;
}
/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 */
function patchFactory(run) {
    var f = function (node, fn, data) {
        var prevContext = context;
        var prevDoc = doc;
        var prevFocusPath = focusPath;
        var prevArgsBuilder = argsBuilder;
        var prevCurrentNode = currentNode;
        var prevCurrentParent = currentParent;
        var previousInAttributes = false;
        var previousInSkip = false;
        context = new Context();
        doc = node.ownerDocument;
        argsBuilder = [];
        currentParent = node.parentNode;
        focusPath = getFocusedPath(node, currentParent);
        if (process.env.NODE_ENV !== 'production') {
            previousInAttributes = setInAttributes(false);
            previousInSkip = setInSkip(false);
        }
        try {
            var retVal = run(node, fn, data);
            if (process.env.NODE_ENV !== 'production') {
                assertVirtualAttributesClosed();
            }
            return retVal;
        } finally {
            doc = prevDoc;
            argsBuilder = prevArgsBuilder;
            currentNode = prevCurrentNode;
            currentParent = prevCurrentParent;
            focusPath = prevFocusPath;
            context.notifyChanges();
            // Needs to be done after assertions because assertions rely on state
            // from these methods.
            setInAttributes(previousInAttributes);
            setInSkip(previousInSkip);
            context = prevContext;
        }
    };
    return f;
}
/**
 * Patches the document starting at node with the provided function. This
 * function may be called during an existing patch operation.
 */
var patchInner = patchFactory(function (node, fn, data) {
    currentNode = node;
    enterNode();
    fn(data);
    exitNode();
    if (process.env.NODE_ENV !== 'production') {
        assertNoUnclosedTags(currentNode, node);
    }
    return node;
});
/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 */
var patchOuter = patchFactory(function (node, fn, data) {
    // tslint:disable-next-line:no-any
    var startNode = { nextSibling: node };
    var expectedNextNode = null;
    var expectedPrevNode = null;
    if (process.env.NODE_ENV !== 'production') {
        expectedNextNode = node.nextSibling;
        expectedPrevNode = node.previousSibling;
    }
    currentNode = startNode;
    fn(data);
    if (process.env.NODE_ENV !== 'production') {
        assertPatchOuterHasParentNode(currentParent);
        assertPatchElementNoExtras(startNode, currentNode, expectedNextNode, expectedPrevNode);
    }
    if (currentParent) {
        clearUnvisitedDOM(currentParent, getNextNode(), node.nextSibling);
    }
    return startNode === currentNode ? null : currentNode;
});
/**
 * Checks whether or not the current node matches the specified nameOrCtor and
 * key.
 * @param matchNode A node to match the data to.
 * @param nameOrCtor The name or constructor to check for.
 * @param key The key used to identify the Node.
 * @return True if the node matches, false otherwise.
 */
function matches(matchNode, nameOrCtor, key) {
    var data = getData(matchNode, key);
    // Key check is done using double equals as we want to treat a null key the
    // same as undefined. This should be okay as the only values allowed are
    // strings, null and undefined so the == semantics are not too weird.
    // tslint:disable-next-line:triple-equals
    return nameOrCtor == data.nameOrCtor && key == data.key;
}
/**
 * Finds the matching node, starting at `node` and looking at the subsequent
 * siblings if a key is used.
 * @param node The node to start looking at.
 * @param nameOrCtor The name or constructor for the Node.
 * @param key The key used to identify the Node.
 */
function getMatchingNode(matchNode, nameOrCtor, key) {
    if (!matchNode) {
        return null;
    }
    if (matches(matchNode, nameOrCtor, key)) {
        return matchNode;
    }
    if (key) {
        while (matchNode = matchNode.nextSibling) {
            if (matches(matchNode, nameOrCtor, key)) {
                return matchNode;
            }
        }
    }
    return null;
}
/**
 * Creates a Node and marking it as created.
 * @param nameOrCtor The name or constructor for the Node.
 * @param key The key used to identify the Node.
 * @return The newly created node.
 */
function createNode(nameOrCtor, key) {
    var node;
    if (nameOrCtor === '#text') {
        node = createText(doc);
    } else {
        node = createElement(doc, currentParent, nameOrCtor, key);
    }
    context.markCreated(node);
    return node;
}
/**
 * Aligns the virtual Node definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param nameOrCtor The name or constructor for the Node.
 * @param key The key used to identify the Node.
 */
function alignWithDOM(nameOrCtor, key) {
    var existingNode = getMatchingNode(currentNode, nameOrCtor, key);
    var node = existingNode || createNode(nameOrCtor, key);
    // If we are at the matching node, then we are done.
    if (node === currentNode) {
        return;
    }
    // Re-order the node into the right position, preserving focus if either
    // node or currentNode are focused by making sure that they are not detached
    // from the DOM.
    if (focusPath.indexOf(node) >= 0) {
        // Move everything else before the node.
        moveBefore(currentParent, node, currentNode);
    } else {
        currentParent.insertBefore(node, currentNode);
    }
    currentNode = node;
}
/**
 * Clears out any unvisited Nodes in a given range.
 * @param maybeParentNode
 * @param startNode The node to start clearing from, inclusive.
 * @param endNode The node to clear until, exclusive.
 */
function clearUnvisitedDOM(maybeParentNode, startNode, endNode) {
    var parentNode = maybeParentNode;
    var child = startNode;
    while (child !== endNode) {
        var next = child.nextSibling;
        parentNode.removeChild(child);
        context.markDeleted(child);
        child = next;
    }
}
/**
 * Changes to the first child of the current node.
 */
function enterNode() {
    currentParent = currentNode;
    currentNode = null;
}
/**
 * @return The next Node to be patched.
 */
function getNextNode() {
    if (currentNode) {
        return currentNode.nextSibling;
    } else {
        return currentParent.firstChild;
    }
}
/**
 * Changes to the next sibling of the current node.
 */
function nextNode() {
    currentNode = getNextNode();
}
/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
function exitNode() {
    clearUnvisitedDOM(currentParent, getNextNode(), null);
    currentNode = currentParent;
    currentParent = currentParent.parentNode;
}
/**
 * Makes sure that the current node is an Element with a matching nameOrCtor and
 * key.
 *
 * @param nameOrCtor The tag or constructor for the Element.
 * @param key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @return The corresponding Element.
 */
function open(nameOrCtor, key) {
    nextNode();
    alignWithDOM(nameOrCtor, key);
    enterNode();
    return currentParent;
}
/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 */
function close() {
    if (process.env.NODE_ENV !== 'production') {
        setInSkip(false);
    }
    exitNode();
    return currentNode;
}
/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 */
function text() {
    nextNode();
    alignWithDOM('#text', null);
    return currentNode;
}
/**
 * Gets the current Element being patched.
 */
function currentElement() {
    if (process.env.NODE_ENV !== 'production') {
        assertInPatch('currentElement', doc);
        assertNotInAttributes('currentElement');
    }
    return currentParent;
}
/**
 * @return The Node that will be evaluated for the next instruction.
 */
function currentPointer() {
    if (process.env.NODE_ENV !== 'production') {
        assertInPatch('currentPointer', doc);
        assertNotInAttributes('currentPointer');
    }
    // TODO(tomnguyen): assert that this is not null
    return getNextNode();
}
/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
function skip() {
    if (process.env.NODE_ENV !== 'production') {
        assertNoChildrenDeclaredYet('skip', currentNode);
        setInSkip(true);
    }
    currentNode = currentParent.lastChild;
}

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 */
var ATTRIBUTES_OFFSET = 3;
/**
 * Used to keep track of the previous values when a 2-way diff is necessary.
 * This object is reused.
 * TODO(sparhamI) Scope this to a patch so you can call patch from an attribute
 * update.
 */
var prevAttrsMap = createMap();
/**
 * Applies the statics. When importing an Element, any existing attributes that
 * match a static are converted into a static attribute.
 * @param node The Element to apply statics for.
 * @param data The Element's data
 * @param statics The statics array,
 */
function applyStatics(node, data, statics) {
    data.staticsApplied = true;
    if (!statics || !statics.length) {
        return;
    }
    if (data.hasEmptyAttrsArr()) {
        for (var i = 0; i < statics.length; i += 2) {
            updateAttribute(node, statics[i], statics[i + 1]);
        }
        return;
    }
    for (var i = 0; i < statics.length; i += 2) {
        prevAttrsMap[statics[i]] = i + 1;
    }
    var attrsArr = data.getAttrsArr(0);
    var j = 0;
    for (var i = 0; i < attrsArr.length; i += 2) {
        var name = attrsArr[i];
        var value = attrsArr[i + 1];
        var staticsIndex = prevAttrsMap[name];
        if (staticsIndex) {
            // For any attrs that are static and have the same value, make sure we do
            // not set them again.
            if (statics[staticsIndex] === value) {
                delete prevAttrsMap[name];
            }
            continue;
        }
        // For any attrs that are dynamic, move them up to the right place.
        attrsArr[j] = name;
        attrsArr[j + 1] = value;
        j += 2;
    }
    // Anything after `j` was either moved up already or static.
    truncateArray(attrsArr, j);
    for (var name in prevAttrsMap) {
        updateAttribute(node, name, statics[prevAttrsMap[name]]);
        delete prevAttrsMap[name];
    }
}
/**
 * @param  nameOrCtor The Element's tag or constructor.
 * @param  key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 * @param varArgs, Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return The corresponding Element.
 */
function elementOpen(nameOrCtor, key,
// Ideally we could tag statics and varArgs as an array where every odd
// element is a string and every even element is any, but this is hard.
// tslint:disable-next-line:no-any
statics) {
    var varArgs = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        varArgs[_i - 3] = arguments[_i];
    }
    if (process.env.NODE_ENV !== 'production') {
        assertNotInAttributes('elementOpen');
        assertNotInSkip('elementOpen');
    }
    var node = open(nameOrCtor, key);
    var data = getData(node);
    if (!data.staticsApplied) {
        applyStatics(node, data, statics);
    }
    var attrsLength = Math.max(0, arguments.length - ATTRIBUTES_OFFSET);
    var hadNoAttrs = data.hasEmptyAttrsArr();
    if (!attrsLength && hadNoAttrs) {
        return node;
    }
    var attrsArr = data.getAttrsArr(attrsLength);
    /*
     * Checks to see if one or more attributes have changed for a given Element.
     * When no attributes have changed, this is much faster than checking each
     * individual argument. When attributes have changed, the overhead of this is
     * minimal.
     */
    var i = ATTRIBUTES_OFFSET;
    var j = 0;
    for (; i < arguments.length; i += 2, j += 2) {
        var name = arguments[i];
        if (hadNoAttrs) {
            attrsArr[j] = name;
        } else if (attrsArr[j] !== name) {
            break;
        }
        var value = arguments[i + 1];
        if (hadNoAttrs || attrsArr[j + 1] !== value) {
            attrsArr[j + 1] = value;
            updateAttribute(node, name, value);
        }
    }
    /*
     * Items did not line up exactly as before, need to make sure old items are
     * removed. This can happen if using conditional logic when declaring
     * attrs through the elementOpenStart flow or if one element is reused in
     * the place of another.
     */
    if (i < arguments.length || j < attrsArr.length) {
        var attrsStart = j;
        for (; j < attrsArr.length; j += 2) {
            prevAttrsMap[attrsArr[j]] = attrsArr[j + 1];
        }
        for (j = attrsStart; i < arguments.length; i += 2, j += 2) {
            var name = arguments[i];
            var value = arguments[i + 1];
            if (prevAttrsMap[name] !== value) {
                updateAttribute(node, name, value);
            }
            attrsArr[j] = name;
            attrsArr[j + 1] = value;
            delete prevAttrsMap[name];
        }
        truncateArray(attrsArr, j);
        /*
         * At this point, only have attributes that were present before, but have
         * been removed.
         */
        for (var name in prevAttrsMap) {
            updateAttribute(node, name, undefined);
            delete prevAttrsMap[name];
        }
    }
    return node;
}
/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param nameOrCtor The Element's tag or constructor.
 * @param key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 */
function elementOpenStart(nameOrCtor, key, statics) {
    var argsBuilder = getArgsBuilder();
    if (process.env.NODE_ENV !== 'production') {
        assertNotInAttributes('elementOpenStart');
        setInAttributes(true);
    }
    argsBuilder[0] = nameOrCtor;
    argsBuilder[1] = key;
    argsBuilder[2] = statics;
}
/**
 * Allows you to define a key after an elementOpenStart. This is useful in
 * templates that define key after an element has been opened ie
 * `<div key('foo')></div>`.
 */
function key(key) {
    var argsBuilder = getArgsBuilder();
    if (process.env.NODE_ENV !== 'production') {
        assertInAttributes('key');
        assert(argsBuilder);
    }
    argsBuilder[1] = key;
}
/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between elementOpenStart and elementOpenEnd.
 */
// tslint:disable-next-line:no-any
function attr(name, value) {
    var argsBuilder = getArgsBuilder();
    if (process.env.NODE_ENV !== 'production') {
        assertInAttributes('attr');
    }
    argsBuilder.push(name);
    argsBuilder.push(value);
}
/**
 * Closes an open tag started with elementOpenStart.
 * @return The corresponding Element.
 */
function elementOpenEnd() {
    var argsBuilder = getArgsBuilder();
    if (process.env.NODE_ENV !== 'production') {
        assertInAttributes('elementOpenEnd');
        setInAttributes(false);
    }
    assert(argsBuilder);
    var node = elementOpen.apply(null, argsBuilder);
    truncateArray(argsBuilder, 0);
    return node;
}
/**
 * Closes an open virtual Element.
 *
 * @param nameOrCtor The Element's tag or constructor.
 * @return The corresponding Element.
 */
function elementClose(nameOrCtor) {
    if (process.env.NODE_ENV !== 'production') {
        assertNotInAttributes('elementClose');
    }
    var node = close();
    if (process.env.NODE_ENV !== 'production') {
        assertCloseMatchesOpenTag(getData(node).nameOrCtor, nameOrCtor);
    }
    return node;
}
/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param nameOrCtor The Element's tag or constructor.
 * @param key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param statics An array of attribute name/value pairs of the static
 *     attributes for the Element. Attributes will only be set once when the
 *     Element is created.
 * @param varArgs Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return The corresponding Element.
 */
function elementVoid(nameOrCtor, key,
// Ideally we could tag statics and varArgs as an array where every odd
// element is a string and every even element is any, but this is hard.
// tslint:disable-next-line:no-any
statics) {
    var varArgs = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        varArgs[_i - 3] = arguments[_i];
    }
    elementOpen.apply(null, arguments);
    return elementClose(nameOrCtor);
}
/**
 * Declares a virtual Text at this point in the document.
 *
 * @param value The value of the Text.
 * @param varArgs
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return The corresponding text node.
 */
function text$1(value) {
    var varArgs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        varArgs[_i - 1] = arguments[_i];
    }
    if (process.env.NODE_ENV !== 'production') {
        assertNotInAttributes('text');
        assertNotInSkip('text');
    }
    var node = text();
    var data = getData(node);
    if (data.text !== value) {
        data.text = value;
        var formatted = value;
        for (var i = 1; i < arguments.length; i += 1) {
            /*
             * Call the formatter function directly to prevent leaking arguments.
             * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
             */
            var fn = arguments[i];
            formatted = fn(formatted);
        }
        node.data = formatted;
    }
    return node;
}

/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

exports.applyAttr = applyAttr;
exports.applyProp = applyProp;
exports.attributes = attributes;
exports.close = close;
exports.currentElement = currentElement;
exports.currentPointer = currentPointer;
exports.open = open;
exports.patch = patchInner;
exports.patchInner = patchInner;
exports.patchOuter = patchOuter;
exports.skip = skip;
exports.skipNode = nextNode;
exports.getKey = getKey;
exports.clearCache = clearCache;
exports.importNode = importNode;
exports.isDataInitialized = isDataInitialized;
exports.notifications = notifications;
exports.symbols = symbols;
exports.attr = attr;
exports.elementClose = elementClose;
exports.elementOpen = elementOpen;
exports.elementOpenEnd = elementOpenEnd;
exports.elementOpenStart = elementOpenStart;
exports.elementVoid = elementVoid;
exports.text = text$1;
exports.key = key;

//# sourceMappingURL=incremental-dom-cjs.js.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ]);
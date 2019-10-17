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
    , dom = __webpack_require__(11)
    , bbr = __webpack_require__(13);


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
            badge('kort', 'badge-primary', etage.href.replace('dawa','vis'));
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
            badge('kort', 'badge-primary', opgang.href.replace('dawa','vis'));
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

function getBBREnhedFraAdresseid(label, adresseid, indrykninger= 0) {
  const url= dawaUrl.origin + "/bbr/enheder?adresseIdentificerer_id=" + adresseid   + "&medtagnedlagte";
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
              badge('kort', 'badge-primary', enhed.href.replace('dawa','vis'));
              badge('data', 'badge-primary', enhed.href);
            ec('tr');
          });
        }
      });
    }
  });
}

function getBBRBygningViaOpgang(label, adgangsadresseid, indrykninger= 0) {
  const url= dawaUrl.origin + "/bbr/opgange?adgangFraHusnummer_id=" + adgangsadresseid;
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
            badge('kort', 'badge-primary', grund.href.replace('dawa','vis'));
            badge('data', 'badge-primary', grund.href);
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
                    badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
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
            badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
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
    danNavbar(ressource,'<h2>' + bbr.getBygAnvendelse(data.byg021BygningensAnvendelse) + '</h2');
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
        html('Placering: ' + strong(bbr.getDriftstatus(data.tek110Driftstatus)));
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
      html('<br/>' + data.adgangFraHusnummer.id + ' <-> ' + data.bygning.id);
    ec('td');
    let href= data.href;
    badge('info', 'badge-primary', href.replace('dawa.aws.dk',host));
    eo('td'); ec('td');
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBROpgang(data) {
  return function() {
    danNavbar(ressource,'<h2>Husnummer id:' + data.adgangFraHusnummer.id + ' <-> Bygnings id: ' + data.bygning.id + '</h2');
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
  if (data.adgangFraHusnummer.id) {
    ec('tbody'); 
    let adgangsadresse= 'adgangsadresse';
    eo('tbody', null, null, 'id', adgangsadresse);
      getAdgangsadresse(adgangsadresse, data.adgangFraHusnummer.id);
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
    danNavbar(ressource,'<h2>Etage: ' + data.eta006BygningensEtagebetegnelse + '</h2');
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
    danNavbar(ressource,'<h2>' + bbr.getEnhAnvendelse(enhed.enh020EnhedensAnvendelse) + '</h2');
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
  if (data.adresseIdentificerer) {
    ec('tbody'); 
    let adresse= 'adresse';
    eo('tbody', null, null, 'id', adresse);
      getAdresse(adresse, data.adresseIdentificerer.id);
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
    danNavbar(ressource,'<h2>Bygning id:' + data.bygning.id + ' <-> Ejendomsrelations id: ' + data.bygningPåFremmedGrund.id + '</h2');
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
    danNavbar(ressource,'<h2>Ejendomsrelation: ' + data.id + '</h2');
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
    badge('kort', 'badge-primary', href.replace('dawa','vis'));
    badge('data', 'badge-primary', href);
  ec('tr');
}

function visBBRGrund(data) {
  return function() {
    danNavbar(ressource,'<h2>' + 'Grund' + '</h2');
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
    danNavbar(ressource,'<h2>Grund id:' + data.grund.id + ' <-> Jordstykke featureid: ' + data.jordstykke.id + '</h2');
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


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getAdresseRolle"] = getAdresseRolle;
/* harmony export (immutable) */ __webpack_exports__["getAdressestatus"] = getAdressestatus;
/* harmony export (immutable) */ __webpack_exports__["getAfloebsforhold"] = getAfloebsforhold;
/* harmony export (immutable) */ __webpack_exports__["getAfvigendeEtager"] = getAfvigendeEtager;
/* harmony export (immutable) */ __webpack_exports__["getArealtype"] = getArealtype;
/* harmony export (immutable) */ __webpack_exports__["getArtskode"] = getArtskode;
/* harmony export (immutable) */ __webpack_exports__["getAsbestholdigtMateriale"] = getAsbestholdigtMateriale;
/* harmony export (immutable) */ __webpack_exports__["getBadeforhold"] = getBadeforhold;
/* harmony export (immutable) */ __webpack_exports__["getBBRMessageAarsagskode"] = getBBRMessageAarsagskode;
/* harmony export (immutable) */ __webpack_exports__["getBBRMessageNiveau"] = getBBRMessageNiveau;
/* harmony export (immutable) */ __webpack_exports__["getBBRMessageType"] = getBBRMessageType;
/* harmony export (immutable) */ __webpack_exports__["getBeregningsprincipForArealAfCarport"] = getBeregningsprincipForArealAfCarport;
/* harmony export (immutable) */ __webpack_exports__["getBoligtype"] = getBoligtype;
/* harmony export (immutable) */ __webpack_exports__["getBygAfloebsforhold"] = getBygAfloebsforhold;
/* harmony export (immutable) */ __webpack_exports__["getBygAnvendelse"] = getBygAnvendelse;
/* harmony export (immutable) */ __webpack_exports__["getByggesagskode"] = getByggesagskode;
/* harmony export (immutable) */ __webpack_exports__["getByggeskadeforsikringsselskab"] = getByggeskadeforsikringsselskab;
/* harmony export (immutable) */ __webpack_exports__["getBygherreForhold"] = getBygherreForhold;
/* harmony export (immutable) */ __webpack_exports__["getBygningSortering"] = getBygningSortering;
/* harmony export (immutable) */ __webpack_exports__["getBygSupplerendeVarme"] = getBygSupplerendeVarme;
/* harmony export (immutable) */ __webpack_exports__["getBygVandforsyning"] = getBygVandforsyning;
/* harmony export (immutable) */ __webpack_exports__["getBygVarmeinstallation"] = getBygVarmeinstallation;
/* harmony export (immutable) */ __webpack_exports__["getDispensationFritagelseIftKollektivVarmeforsyning"] = getDispensationFritagelseIftKollektivVarmeforsyning;
/* harmony export (immutable) */ __webpack_exports__["getDriftstatus"] = getDriftstatus;
/* harmony export (immutable) */ __webpack_exports__["getEjendomstype"] = getEjendomstype;
/* harmony export (immutable) */ __webpack_exports__["getEjerforholdskode"] = getEjerforholdskode;
/* harmony export (immutable) */ __webpack_exports__["getElevator"] = getElevator;
/* harmony export (immutable) */ __webpack_exports__["getEnergiforsyning"] = getEnergiforsyning;
/* harmony export (immutable) */ __webpack_exports__["getEnhAnvendelse"] = getEnhAnvendelse;
/* harmony export (immutable) */ __webpack_exports__["getEnhedHvorSkalEnhedVises"] = getEnhedHvorSkalEnhedVises;
/* harmony export (immutable) */ __webpack_exports__["getEnhedSortering"] = getEnhedSortering;
/* harmony export (immutable) */ __webpack_exports__["getEnhSupplerendeVarme"] = getEnhSupplerendeVarme;
/* harmony export (immutable) */ __webpack_exports__["getEnhVarmeinstallation"] = getEnhVarmeinstallation;
/* harmony export (immutable) */ __webpack_exports__["getEtageSortering"] = getEtageSortering;
/* harmony export (immutable) */ __webpack_exports__["getEtageType"] = getEtageType;
/* harmony export (immutable) */ __webpack_exports__["getFordelingsnoegle"] = getFordelingsnoegle;
/* harmony export (immutable) */ __webpack_exports__["getForretningsHaendelse"] = getForretningsHaendelse;
/* harmony export (immutable) */ __webpack_exports__["getForretningsOmraade"] = getForretningsOmraade;
/* harmony export (immutable) */ __webpack_exports__["getForretningsProcess"] = getForretningsProcess;
/* harmony export (immutable) */ __webpack_exports__["getForretningsProcessUI"] = getForretningsProcessUI;
/* harmony export (immutable) */ __webpack_exports__["getForretningsProcessUIBygningEnhed"] = getForretningsProcessUIBygningEnhed;
/* harmony export (immutable) */ __webpack_exports__["getFredning"] = getFredning;
/* harmony export (immutable) */ __webpack_exports__["getGodkendtTomBolig"] = getGodkendtTomBolig;
/* harmony export (immutable) */ __webpack_exports__["getGruAfloebsforhold"] = getGruAfloebsforhold;
/* harmony export (immutable) */ __webpack_exports__["getGrundSortering"] = getGrundSortering;
/* harmony export (immutable) */ __webpack_exports__["getGrundViewType"] = getGrundViewType;
/* harmony export (immutable) */ __webpack_exports__["getGruVandforsyning"] = getGruVandforsyning;
/* harmony export (immutable) */ __webpack_exports__["getGulvbelaegning"] = getGulvbelaegning;
/* harmony export (immutable) */ __webpack_exports__["getHenvendelserDirekteIndberetning"] = getHenvendelserDirekteIndberetning;
/* harmony export (immutable) */ __webpack_exports__["getHusnummerRolle"] = getHusnummerRolle;
/* harmony export (immutable) */ __webpack_exports__["getHusnummerType"] = getHusnummerType;
/* harmony export (immutable) */ __webpack_exports__["getIndberetningRolle"] = getIndberetningRolle;
/* harmony export (immutable) */ __webpack_exports__["getIndhold"] = getIndhold;
/* harmony export (immutable) */ __webpack_exports__["getKilde"] = getKilde;
/* harmony export (immutable) */ __webpack_exports__["getKildeTilKoordinatsaet"] = getKildeTilKoordinatsaet;
/* harmony export (immutable) */ __webpack_exports__["getKildeTilOplysninger"] = getKildeTilOplysninger;
/* harmony export (immutable) */ __webpack_exports__["getKlassifikation"] = getKlassifikation;
/* harmony export (immutable) */ __webpack_exports__["getKodeForMereEndEnLejlighed"] = getKodeForMereEndEnLejlighed;
/* harmony export (immutable) */ __webpack_exports__["getKoekkenforhold"] = getKoekkenforhold;
/* harmony export (immutable) */ __webpack_exports__["getKommuneFelterNiveau"] = getKommuneFelterNiveau;
/* harmony export (immutable) */ __webpack_exports__["getKommunekode"] = getKommunekode;
/* harmony export (immutable) */ __webpack_exports__["getKondemneretBoligenhed"] = getKondemneretBoligenhed;
/* harmony export (immutable) */ __webpack_exports__["getKonstruktion"] = getKonstruktion;
/* harmony export (immutable) */ __webpack_exports__["getKonstruktionsforhold"] = getKonstruktionsforhold;
/* harmony export (immutable) */ __webpack_exports__["getKoordinatsystem"] = getKoordinatsystem;
/* harmony export (immutable) */ __webpack_exports__["getKvalitetAfKoordinatsaet"] = getKvalitetAfKoordinatsaet;
/* harmony export (immutable) */ __webpack_exports__["getLivscyklus"] = getLivscyklus;
/* harmony export (immutable) */ __webpack_exports__["getLovligAnvendelse"] = getLovligAnvendelse;
/* harmony export (immutable) */ __webpack_exports__["getMateriale"] = getMateriale;
/* harmony export (immutable) */ __webpack_exports__["getMedlemsskabAfSplidevandforsyning"] = getMedlemsskabAfSplidevandforsyning;
/* harmony export (immutable) */ __webpack_exports__["getMidlertidigOprettelseEllerFuldfoersel"] = getMidlertidigOprettelseEllerFuldfoersel;
/* harmony export (immutable) */ __webpack_exports__["getNiveau"] = getNiveau;
/* harmony export (immutable) */ __webpack_exports__["getNiveauType"] = getNiveauType;
/* harmony export (immutable) */ __webpack_exports__["getOffentligStoette"] = getOffentligStoette;
/* harmony export (immutable) */ __webpack_exports__["getOmfattetAfByggeskadeforsikring"] = getOmfattetAfByggeskadeforsikring;
/* harmony export (immutable) */ __webpack_exports__["getOpgangSortering"] = getOpgangSortering;
/* harmony export (immutable) */ __webpack_exports__["getOpvarmningsmiddel"] = getOpvarmningsmiddel;
/* harmony export (immutable) */ __webpack_exports__["getOversvoemmelsesselvrisiko"] = getOversvoemmelsesselvrisiko;
/* harmony export (immutable) */ __webpack_exports__["getPaaSoeTerritorie"] = getPaaSoeTerritorie;
/* harmony export (immutable) */ __webpack_exports__["getPlacering"] = getPlacering;
/* harmony export (immutable) */ __webpack_exports__["getPlaceringAfCursor"] = getPlaceringAfCursor;
/* harmony export (immutable) */ __webpack_exports__["getRensningspaabud"] = getRensningspaabud;
/* harmony export (immutable) */ __webpack_exports__["getSagsniveau"] = getSagsniveau;
/* harmony export (immutable) */ __webpack_exports__["getSagstype"] = getSagstype;
/* harmony export (immutable) */ __webpack_exports__["getSikkerhedsklassifikation"] = getSikkerhedsklassifikation;
/* harmony export (immutable) */ __webpack_exports__["getSloejfning"] = getSloejfning;
/* harmony export (immutable) */ __webpack_exports__["getStandardSoegniveau"] = getStandardSoegniveau;
/* harmony export (immutable) */ __webpack_exports__["getStartside"] = getStartside;
/* harmony export (immutable) */ __webpack_exports__["getStoerrelsesklasse"] = getStoerrelsesklasse;
/* harmony export (immutable) */ __webpack_exports__["getSupplerendeAnvendelseskode"] = getSupplerendeAnvendelseskode;
/* harmony export (immutable) */ __webpack_exports__["getSupplerendeIndvendigKorrosionsbeskyttelse"] = getSupplerendeIndvendigKorrosionsbeskyttelse;
/* harmony export (immutable) */ __webpack_exports__["getSupplerendeOplysningerOmKoordinatsaet"] = getSupplerendeOplysningerOmKoordinatsaet;
/* harmony export (immutable) */ __webpack_exports__["getSupplerendeVarme"] = getSupplerendeVarme;
/* harmony export (immutable) */ __webpack_exports__["getTagdaekningsmateriale"] = getTagdaekningsmateriale;
/* harmony export (immutable) */ __webpack_exports__["getTekniskAnlaegBygningSortering"] = getTekniskAnlaegBygningSortering;
/* harmony export (immutable) */ __webpack_exports__["getTekniskAnlaegEnhedSortering"] = getTekniskAnlaegEnhedSortering;
/* harmony export (immutable) */ __webpack_exports__["getTekniskAnlaegMatrikelSortering"] = getTekniskAnlaegMatrikelSortering;
/* harmony export (immutable) */ __webpack_exports__["getTilladelsesart"] = getTilladelsesart;
/* harmony export (immutable) */ __webpack_exports__["getTilladelseTilAlternativBortskaffelseEllerAfledning"] = getTilladelseTilAlternativBortskaffelseEllerAfledning;
/* harmony export (immutable) */ __webpack_exports__["getTilladelseTilUdtraeden"] = getTilladelseTilUdtraeden;
/* harmony export (immutable) */ __webpack_exports__["getToiletforhold"] = getToiletforhold;
/* harmony export (immutable) */ __webpack_exports__["getTypeAfVaegge"] = getTypeAfVaegge;
/* harmony export (immutable) */ __webpack_exports__["getUdledningstilladelse"] = getUdledningstilladelse;
/* harmony export (immutable) */ __webpack_exports__["getUdlejningsforhold"] = getUdlejningsforhold;
/* harmony export (immutable) */ __webpack_exports__["getUdskrivningsmatrikel"] = getUdskrivningsmatrikel;
/* harmony export (immutable) */ __webpack_exports__["getVandforsyning"] = getVandforsyning;
/* harmony export (immutable) */ __webpack_exports__["getVarmeinstallation"] = getVarmeinstallation;
/* harmony export (immutable) */ __webpack_exports__["getYdervaeggenesMateriale"] = getYdervaeggenesMateriale;

function getAdresseRolle(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Fastsat til denne";
		break;
	case 1:
		navn= "Kun vejledende";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getAdressestatus(kode) {
	switch (kode) { 
	case 0:
		navn= "Har husnummer (adresse)";
		break;
	case 1:
		navn= "Markeret til at få husnummer (adresse)";
		break;
	case 2:
		navn= "Uden husnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getAfloebsforhold(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Fælleskloakeret: spildevand + tag- og overfladevand";
		break;
	case 2:
		navn= "Fælleskloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 3:
		navn= "Fælleskloakeret: spildevand";
		break;
	case 4:
		navn= "Fælleskloakeret: tag- og overfladevand";
		break;
	case 5:
		navn= "Separatkloakeret: spildevand + tag- og overfladevand";
		break;
	case 6:
		navn= "Separatkloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 7:
		navn= "Separatkloakeret: spildevand";
		break;
	case 8:
		navn= "Separatkloakeret: tag- og overfladevand";
		break;
	case 9:
		navn= "Spildevandskloakeret: Spildevand";
		break;
	case 10:
		navn= "Afløb til spildevandsforsyningens renseanlæg";
		break;
	case 11:
		navn= "Afløb til fællesprivat spildevandsanlæg";
		break;
	case 12:
		navn= "Afløb til fællesprivat kloakledning med tilslutning til spv. renseanlæg";
		break;
	case 20:
		navn= "Afløb til samletank";
		break;
	case 21:
		navn= "Afløb til samletank for toiletvand og mek. rensning af øvr. spildevand";
		break;
	case 29:
		navn= "Mekanisk rensning med nedsivningsanlæg med tilladelse";
		break;
	case 30:
		navn= "Mekanisk rensning med nedsivningsanlæg (tilladelse ikke påkrævet)";
		break;
	case 31:
		navn= "Mekanisk rensning med privat udledn. dir. til vandløb, sø eller hav";
		break;
	case 32:
		navn= "Mekanisk og biologisk rensning (ældre anlæg uden renseklasse)";
		break;
	case 70:
		navn= "Udledning uden rensning direkte til vandløb, søer eller havet";
		break;
	case 75:
		navn= "Blandet afløbsforhold på ejendommen (er specificeret på bygningen)";
		break;
	case 80:
		navn= "Anden type afløb";
		break;
	case 90:
		navn= "Ingen udledning";
		break;
	case 101:
		navn= "SOP: Minirenseanlæg med direkte udledning";
		break;
	case 102:
		navn= "SOP: Minirenseanlæg med udledning til markdræn";
		break;
	case 103:
		navn= "SOP: Minirenseanlæg med nedsivning i faskine";
		break;
	case 104:
		navn= "SOP: Nedsivning til sivedræn";
		break;
	case 105:
		navn= "SOP: Samletank";
		break;
	case 106:
		navn= "SOP: Pileanlæg med nedsivning (uden membran)";
		break;
	case 107:
		navn= "SOP: Pileanlæg uden udledning (med membran)";
		break;
	case 108:
		navn= "SOP: Beplantede filteranlæg med nedsivning i faskine";
		break;
	case 109:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og direkte udledning";
		break;
	case 110:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og udledning til markdræn";
		break;
	case 190:
		navn= "SOP: Andet";
		break;
	case 201:
		navn= "SO: Biologisk sandfilter med direkte udledning";
		break;
	case 202:
		navn= "SO: Biologisk sandfilter med udledning til markdræn";
		break;
	case 203:
		navn= "SO: Minirensanlæg med direkte udledning";
		break;
	case 204:
		navn= "SO: Minirenseanlæg med udledning til markdræn";
		break;
	case 205:
		navn= "SO: Beplantede filteranlæg med direkte udledning";
		break;
	case 206:
		navn= "SO: Beplantede filteranlæg med udledning til markdræn";
		break;
	case 290:
		navn= "SO: Andet";
		break;
	case 301:
		navn= "OP: Minirenseanlæg med direkte udledning";
		break;
	case 302:
		navn= "OP: Minirenseanlæg med udledning til markdræn";
		break;
	case 390:
		navn= "OP: Andet";
		break;
	case 401:
		navn= "O: Rodzoneanlæg med direkte udledning";
		break;
	case 402:
		navn= "O: Rodzoneanlæg med udledning til markdræn";
		break;
	case 403:
		navn= "O: Minirenseanlæg med direkte udledning";
		break;
	case 404:
		navn= "O: Minirenseanlæg med udledning til markdræn";
		break;
	case 490:
		navn= "O: Andet";
		break;
	case 501:
		navn= "Øvrige renseløsninger: Mekanisk med direkte udledning";
		break;
	case 502:
		navn= "Øvrige renseløsninger: Mekanisk med udledning til markdræn";
		break;
	case 503:
		navn= "Øvrige renseløsninger: Ældre nedsivningsanlæg med nedsivning til sivebrønd";
		break;
	case 504:
		navn= "Øvrige renseløsninger: Udledning til jordoverfladen";
		break;
	case 505:
		navn= "Øvrige renseløsninger: Urenset";
		break;
	case 590:
		navn= "Øvrige renseløsninger: Andet";
		break;
	case 601:
		navn= "Anden type afløb (større end 30 PE med egen udledning)";
		break;
	case 701:
		navn= "Intet afløb";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getAfvigendeEtager(kode) {
	switch (kode) { 
	case 0:
		navn= "Bygningen har ikke afvigende etager";
		break;
	case 10:
		navn= "Bygningen har afvigende etager";
		break;
	case 11:
		navn= "Bygningen indeholder hems";
		break;
	case 12:
		navn= "Bygningen indeholder dobbelt højt rum";
		break;
	case 13:
		navn= "Bygningen indeholder indskudt etage";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getArealtype(kode) {
	switch (kode) { 
	case 1:
		navn= "Type 1";
		break;
	case 2:
		navn= "Type 2";
		break;
	case 3:
		navn= "Type 3";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getArtskode(kode) {
	switch (kode) { 
	case 0:
		navn= "Vigtigste matrikelnummer på ejendommen (normalt med evt. bygning)";
		break;
	case 1:
		navn= "Andre matrikelnumre på ejendommen";
		break;
	case 2:
		navn= "Kode for ejerlejlighed";
		break;
	case 3:
		navn= "Bygning på matrikelnummer (på lejet grund)";
		break;
	case 4:
		navn= "Del af matrikelnummer (parcel) – [kan være fælleslod]";
		break;
	case 5:
		navn= "Umatrikuleret areal";
		break;
	case 6:
		navn= "Umatrikuleret havneareal";
		break;
	case 7:
		navn= "Umatrikuleret jernbaneareal";
		break;
	case 8:
		navn= "Bygning på umatrikuleret areal";
		break;
	case 9:
		navn= "Bygning på umatrikuleret havneareal";
		break;
	case 10:
		navn= "Bygning på umatrikuleret jernbaneareal";
		break;
	case 20:
		navn= "Andet afgivet areal, f. eks. lejet grund";
		break;
	case 21:
		navn= "Tilskyllet";
		break;
	case 22:
		navn= "Bortskyllet";
		break;
	case 23:
		navn= "Eksproprieret til";
		break;
	case 24:
		navn= "Eksproprieret fra";
		break;
	case 25:
		navn= "Dokumenteret arealafvigelse tillagt";
		break;
	case 26:
		navn= "Dokumenteret arealafvigelse afgivet";
		break;
	case 27:
		navn= "Tillagt ved jordfordeling";
		break;
	case 28:
		navn= "Afgivet ved jordfordeling";
		break;
	case 30:
		navn= "(Foreløbig) Vigtigste matrikelnummer på ejendommen (normalt med evt. bygning)";
		break;
	case 31:
		navn= "(Foreløbig) Andre matrikelnumre på ejendommen";
		break;
	case 32:
		navn= "(Foreløbig) Kode for ejerlejlighed";
		break;
	case 33:
		navn= "(Foreløbig) Bygning på matrikelnummer (på lejet grund)";
		break;
	case 34:
		navn= "(Foreløbig) Del af matrikelnummer (parcel)";
		break;
	case 35:
		navn= "(Foreløbig) Umatrikuleret areal";
		break;
	case 36:
		navn= "(Foreløbig) Umatrikuleret havneareal";
		break;
	case 37:
		navn= "(Foreløbig) Umatrikuleret jernbaneareal";
		break;
	case 38:
		navn= "(Foreløbig) Bygning på umatrikuleret havneareal";
		break;
	case 39:
		navn= "(Foreløbig) Bygning på umatrikuleret havneareal";
		break;
	case 40:
		navn= "(Foreløbig) Bygning på umatrikuleret jernbaneareal";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getAsbestholdigtMateriale(kode) {
	let navn= "";
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Asbestholdigt ydervægsmateriale";
		break;
	case 2:
		navn= "Asbestholdigt tagdækningsmateriale";
		break;
	case 3:
		navn= "Asbestholdigt ydervægs- og tagdækningsmateriale";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBadeforhold(kode) {
	let navn= '';
	switch (kode) { 
	case "C":
		navn= "Adgang til badeværelse";
		break;
	case "D":
		navn= "Hverken badeværelse eller adgang til badeværelse";
		break;
	case "V":
		navn= "Badeværelser i enheden";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBBRMessageAarsagskode(kode) {
	switch (kode) { 
	case 20:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af ejerskifte.";
		break;
	case 30:
		navn= "Denne BBR-Meddelelse er udskrevet efter rekvisition.";
		break;
	case 31:
		navn= "Denne BBR-Andelsboligudskrift er udskrevet på grund af rekvisition.";
		break;
	case 40:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af afsluttet byggesag.";
		break;
	case 41:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af indflytning.";
		break;
	case 45:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af ændring uden byggesag.";
		break;
	case 46:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af opdeling af lejligheder.";
		break;
	case 47:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af sammenlægning af lejligheder.";
		break;
	case 48:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af opdeling/ændret opdeling i ejerlejligheder.";
		break;
	case 50:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af, at kommunen har foretaget rettelser af registreringen i BBR. ";
		break;
	case 51:
		navn= "De har til kommunen anmeldt et byggeri som ikke er færdigmeldt. Denne BBR-Meddelelse udskrives… ";
		break;
	case 70:
		navn= "Denne BBR-Meddelelse er udskrevet på grund af matrikulære ændringer.";
		break;
	case 80:
		navn= "Denne BBR-Meddelelse er udskrevet fordi ejer selv eller andre har rettet, slettet eller tilføjet… ";
		break;
	case 81:
		navn= "Denne BBR-Meddelelse er udskrevet fordi skatteforvaltningen har rettet, slettet eller tilføjet… ";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBBRMessageNiveau(kode) {
	switch (kode) { 
	case 0:
		navn= "Ejendom";
		break;
	case 1:
		navn= "Grund";
		break;
	case 2:
		navn= "Bygning";
		break;
	case 3:
		navn= "Enhed";
		break;
	case 4:
		navn= "Teknisk Anlæg";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBBRMessageType(kode) {
	switch (kode) { 
	case 0:
		navn= "BBR-Meddelelse";
		break;
	case 1:
		navn= "Registerudskrift";
		break;
	case 2:
		navn= "Andelsboligudskrift";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBeregningsprincipForArealAfCarport(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Carportareal er målt efter tagflade";
		break;
	case 2:
		navn= "Carportarealet er målt ½ meter inde på åbne sider";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBoligtype(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case "E":
		navn= "Andet (bl.a. institutioner og erhverv)";
		break;
	case 1:
		navn= "Egentlig beboelseslejlighed (boligenhed med eget køkken)";
		break;
	case 2:
		navn= "Blandet erhverv og bolig med eget køkken";
		break;
	case 3:
		navn= "Enkeltværelse (boligenhed med fast kogeinstallation, fælles køkken eller intet køkken).";
		break;
	case 4:
		navn= "Fællesbolig eller fælleshusholdning";
		break;
	case 5:
		navn= "Sommer-/fritidsbolig";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygAfloebsforhold(kode) {
	switch (kode) { 
	case 1:
		navn= "Fælleskloakeret: spildevand + tag- og overfladevand";
		break;
	case 2:
		navn= "Fælleskloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 3:
		navn= "Fælleskloakeret: spildevand";
		break;
	case 4:
		navn= "Fælleskloakeret: tag- og overfladevand";
		break;
	case 5:
		navn= "Separatkloakeret: spildevand + tag- og overfladevand";
		break;
	case 6:
		navn= "Separatkloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 7:
		navn= "Separatkloakeret: spildevand";
		break;
	case 8:
		navn= "Separatkloakeret: tag- og overfladevand";
		break;
	case 9:
		navn= "Spildevandskloakeret: Spildevand";
		break;
	case 10:
		navn= "Afløb til spildevandsforsyningens renseanlæg";
		break;
	case 11:
		navn= "Afløb til fællesprivat spildevandsanlæg";
		break;
	case 12:
		navn= "Afløb til fællesprivat kloakledning med tilslutning til spv. renseanlæg";
		break;
	case 20:
		navn= "Afløb til samletank";
		break;
	case 21:
		navn= "Afløb til samletank for toiletvand og mek. rensning af øvr. spildevand";
		break;
	case 29:
		navn= "Mekanisk rensning med nedsivningsanlæg med tilladelse";
		break;
	case 30:
		navn= "Mekanisk rensning med nedsivningsanlæg (tilladelse ikke påkrævet)";
		break;
	case 31:
		navn= "Mekanisk rensning med privat udledn. dir. til vandløb, sø eller hav";
		break;
	case 32:
		navn= "Mekanisk og biologisk rensning (ældre anlæg uden renseklasse)";
		break;
	case 70:
		navn= "Udledning uden rensning direkte til vandløb, søer eller havet";
		break;
	case 75:
		navn= "Blandet afløbsforhold på ejendommen (er specificeret på bygningen)";
		break;
	case 80:
		navn= "Anden type afløb";
		break;
	case 90:
		navn= "Ingen udledning";
		break;
	case 101:
		navn= "SOP: Minirenseanlæg med direkte udledning";
		break;
	case 102:
		navn= "SOP: Minirenseanlæg med udledning til markdræn";
		break;
	case 103:
		navn= "SOP: Minirenseanlæg med nedsivning i faskine";
		break;
	case 104:
		navn= "SOP: Nedsivning til sivedræn";
		break;
	case 105:
		navn= "SOP: Samletank";
		break;
	case 106:
		navn= "SOP: Pileanlæg med nedsivning (uden membran)";
		break;
	case 107:
		navn= "SOP: Pileanlæg uden udledning (med membran)";
		break;
	case 108:
		navn= "SOP: Beplantede filteranlæg med nedsivning i faskine";
		break;
	case 109:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og direkte udledning";
		break;
	case 110:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og udledning til markdræn";
		break;
	case 190:
		navn= "SOP: Andet";
		break;
	case 201:
		navn= "SO: Biologisk sandfilter med direkte udledning";
		break;
	case 202:
		navn= "SO: Biologisk sandfilter med udledning til markdræn";
		break;
	case 203:
		navn= "SO: Minirensanlæg med direkte udledning";
		break;
	case 204:
		navn= "SO: Minirenseanlæg med udledning til markdræn";
		break;
	case 205:
		navn= "SO: Beplantede filteranlæg med direkte udledning";
		break;
	case 206:
		navn= "SO: Beplantede filteranlæg med udledning til markdræn";
		break;
	case 290:
		navn= "SO: Andet";
		break;
	case 301:
		navn= "OP: Minirenseanlæg med direkte udledning";
		break;
	case 302:
		navn= "OP: Minirenseanlæg med udledning til markdræn";
		break;
	case 390:
		navn= "OP: Andet";
		break;
	case 401:
		navn= "O: Rodzoneanlæg med direkte udledning";
		break;
	case 402:
		navn= "O: Rodzoneanlæg med udledning til markdræn";
		break;
	case 403:
		navn= "O: Minirenseanlæg med direkte udledning";
		break;
	case 404:
		navn= "O: Minirenseanlæg med udledning til markdræn";
		break;
	case 490:
		navn= "O: Andet";
		break;
	case 501:
		navn= "Øvrige renseløsninger: Mekanisk med direkte udledning";
		break;
	case 502:
		navn= "Øvrige renseløsninger: Mekanisk med udledning til markdræn";
		break;
	case 503:
		navn= "Øvrige renseløsninger: Ældre nedsivningsanlæg med nedsivning til sivebrønd";
		break;
	case 504:
		navn= "Øvrige renseløsninger: Udledning til jordoverfladen";
		break;
	case 505:
		navn= "Øvrige renseløsninger: Urenset";
		break;
	case 590:
		navn= "Øvrige renseløsninger: Andet";
		break;
	case 601:
		navn= "Anden type afløb (større end 30 PE med egen udledning)";
		break;
	case 701:
		navn= "Intet afløb";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygAnvendelse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 110:
		navn= "Stuehus til landbrugsejendom";
		break;
	case 120:
		navn= "Fritliggende enfamilieshus (parcelhus)";
		break;
	case 121:
		navn= "Sammenbygget enfamiliehus";
		break;
	case 130:
		navn= "(UDFASES) Række-, kæde-, eller dobbelthus (lodret adskillelse mellem enhederne).";
		break;
	case 131:
		navn= "Række- og kædehus";
		break;
	case 132:
		navn= "Dobbelthus";
		break;
	case 140:
		navn= "Etagebolig-bygning, flerfamiliehus eller to-familiehus";
		break;
	case 150:
		navn= "Kollegium";
		break;
	case 160:
		navn= "Boligbygning til døgninstitution";
		break;
	case 185:
		navn= "Anneks i tilknytning til helårsbolig.";
		break;
	case 190:
		navn= "Anden bygning til helårsbeboelse";
		break;
	case 210:
		navn= "(UDFASES) Bygning til erhvervsmæssig produktion vedrørende landbrug, gartneri, råstofudvinding o. lign ";
		break;
	case 211:
		navn= "Stald til svin";
		break;
	case 212:
		navn= "Stald til kvæg, får mv.";
		break;
	case 213:
		navn= "Stald til fjerkræ";
		break;
	case 214:
		navn= "Minkhal";
		break;
	case 215:
		navn= "Væksthus";
		break;
	case 216:
		navn= "Lade til foder, afgrøder mv.";
		break;
	case 217:
		navn= "Maskinhus, garage mv.";
		break;
	case 218:
		navn= "Lade til halm, hø mv.";
		break;
	case 219:
		navn= "Anden bygning til landbrug mv.";
		break;
	case 220:
		navn= "(UDFASES) Bygning til erhvervsmæssig produktion vedrørende industri, håndværk m.v. (fabrik, værksted o.lign.) ";
		break;
	case 221:
		navn= "Bygning til industri med integreret produktionsapparat";
		break;
	case 222:
		navn= "Bygning til industri uden integreret produktionsapparat";
		break;
	case 223:
		navn= "Værksted";
		break;
	case 229:
		navn= "Anden bygning til produktion";
		break;
	case 230:
		navn= "(UDFASES) El-, gas-, vand- eller varmeværk, forbrændingsanstalt m.v.";
		break;
	case 231:
		navn= "Bygning til energiproduktion";
		break;
	case 232:
		navn= "Bygning til forsyning- og energidistribution";
		break;
	case 233:
		navn= "Bygning til vandforsyning";
		break;
	case 234:
		navn= "Bygning til håndtering af affald og spildevand";
		break;
	case 239:
		navn= "Anden bygning til energiproduktion og -distribution";
		break;
	case 290:
		navn= "(UDFASES) Anden bygning til landbrug, industri etc.";
		break;
	case 310:
		navn= "(UDFASES) Transport- og garageanlæg (fragtmandshal, lufthavnsbygning, banegårdsbygning, parkeringshus). Garage med plads til et eller to køretøjer registreres med anvendelseskode 910 ";
		break;
	case 311:
		navn= "Bygning til jernbane- og busdrift";
		break;
	case 312:
		navn= "Bygning til luftfart";
		break;
	case 313:
		navn= "Bygning til parkering- og transportanlæg";
		break;
	case 314:
		navn= "Bygning til parkering af flere end to køretøjer i tilknytning til boliger";
		break;
	case 315:
		navn= "Havneanlæg";
		break;
	case 319:
		navn= "Andet transportanlæg";
		break;
	case 320:
		navn= "(UDFASES) Bygning til kontor, handel, lager, herunder offentlig administration";
		break;
	case 321:
		navn= "Bygning til kontor";
		break;
	case 322:
		navn= "Bygning til detailhandel";
		break;
	case 323:
		navn= "Bygning til lager";
		break;
	case 324:
		navn= "Butikscenter";
		break;
	case 325:
		navn= "Tankstation";
		break;
	case 329:
		navn= "Anden bygning til kontor, handel og lager";
		break;
	case 330:
		navn= "(UDFASES) Bygning til hotel, restaurant, vaskeri, frisør og anden servicevirksomhed";
		break;
	case 331:
		navn= "Hotel, kro eller konferencecenter med overnatning";
		break;
	case 332:
		navn= "Bed & breakfast mv.";
		break;
	case 333:
		navn= "Restaurant, café og konferencecenter uden overnatning";
		break;
	case 334:
		navn= "Privat servicevirksomhed som frisør, vaskeri, netcafé mv.";
		break;
	case 339:
		navn= "Anden bygning til serviceerhverv";
		break;
	case 390:
		navn= "(UDFASES) Anden bygning til transport, handel etc";
		break;
	case 410:
		navn= "(UDFASES) Bygning til biograf, teater, erhvervsmæssig udstilling, bibliotek, museum, kirke o. lign. ";
		break;
	case 411:
		navn= "Biograf, teater, koncertsted mv.";
		break;
	case 412:
		navn= "Museum";
		break;
	case 413:
		navn= "Bibliotek";
		break;
	case 414:
		navn= "Kirke eller anden bygning til trosudøvelse for statsanerkendte trossamfund";
		break;
	case 415:
		navn= "Forsamlingshus";
		break;
	case 416:
		navn= "Forlystelsespark";
		break;
	case 419:
		navn= "Anden bygning til kulturelle formål";
		break;
	case 420:
		navn= "(UDFASES) Bygning til undervisning og forskning (skole, gymnasium, forskningslabratorium o.lign.). ";
		break;
	case 421:
		navn= "Grundskole";
		break;
	case 422:
		navn= "Universitet";
		break;
	case 429:
		navn= "Anden bygning til undervisning og forskning";
		break;
	case 430:
		navn= "(UDFASES) Bygning til hospital, sygehjem, fødeklinik o. lign.";
		break;
	case 431:
		navn= "Hospital og sygehus";
		break;
	case 432:
		navn= "Hospice, behandlingshjem mv.";
		break;
	case 433:
		navn= "Sundhedscenter, lægehus, fødeklinik mv.";
		break;
	case 439:
		navn= "Anden bygning til sundhedsformål";
		break;
	case 440:
		navn= "(UDFASES) Bygning til daginstitution";
		break;
	case 441:
		navn= "Daginstitution";
		break;
	case 442:
		navn= "Servicefunktion på døgninstitution";
		break;
	case 443:
		navn= "Kaserne";
		break;
	case 444:
		navn= "Fængsel, arresthus mv.";
		break;
	case 449:
		navn= "Anden bygning til institutionsformål";
		break;
	case 490:
		navn= "(UDFASES) Bygning til anden institution, herunder kaserne, fængsel o. lign.";
		break;
	case 510:
		navn= "Sommerhus";
		break;
	case 520:
		navn= "(UDFASES) Bygning til feriekoloni, vandrehjem o.lign. bortset fra sommerhus";
		break;
	case 521:
		navn= "Feriecenter, center til campingplads mv.";
		break;
	case 522:
		navn= "Bygning med ferielejligheder til erhvervsmæssig udlejning";
		break;
	case 523:
		navn= "Bygning med ferielejligheder til eget brug";
		break;
	case 529:
		navn= "Anden bygning til ferieformål";
		break;
	case 530:
		navn= "(UDFASES) Bygning i forbindelse med idrætsudøvelse (klubhus, idrætshal, svømmehal o. lign.) ";
		break;
	case 531:
		navn= "Klubhus i forbindelse med fritid og idræt";
		break;
	case 532:
		navn= "Svømmehal";
		break;
	case 533:
		navn= "Idrætshal";
		break;
	case 534:
		navn= "Tribune i forbindelse med stadion";
		break;
	case 535:
		navn= "Rideskole";
		break;
	case 539:
		navn= "Anden bygning til idrætformål";
		break;
	case 540:
		navn= "Kolonihavehus";
		break;
	case 585:
		navn= "Anneks i tilknytning til fritids- og sommerhus";
		break;
	case 590:
		navn= "Anden bygning til fritidsformål";
		break;
	case 910:
		navn= "Garage (med plads til et eller to køretøjer)";
		break;
	case 920:
		navn= "Carport";
		break;
	case 930:
		navn= "Udhus";
		break;
	case 940:
		navn= "Drivhus";
		break;
	case 950:
		navn= "Fritliggende overdækning";
		break;
	case 960:
		navn= "Fritliggende udestue";
		break;
	case 970:
		navn= "Tiloversbleven landbrugsbygning";
		break;
	case 990:
		navn= "Faldefærdig bygning";
		break;
	case 999:
		navn= "Ukendt bygning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getByggesagskode(kode) {
	switch (kode) { 
	case 1:
		navn= "BR - Tilladelsessag uden ibrugtagningstilladelse";
		break;
	case 2:
		navn= "BR - Anmeldelsessag (garager, carporte, udhuse og nedrivning)";
		break;
	case 3:
		navn= "BR - Tilladelsessag med ibrugtagningstilladelse";
		break;
	case 4:
		navn= "BR - Tilladelsessag landbrugsbygning";
		break;
	case 5:
		navn= "BR - Anmeldelsessag (øvrige)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getByggeskadeforsikringsselskab(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ingen byggeskadeforsikring";
		break;
	case 1:
		navn= "Tryg";
		break;
	case 2:
		navn= "Topdanmark";
		break;
	case 4:
		navn= "Codan";
		break;
	case 5:
		navn= "If Forsikring";
		break;
	case 6:
		navn= "Alm. Brand";
		break;
	case 7:
		navn= "Danske Forsikring";
		break;
	case 8:
		navn= "Caplloyd A/S";
		break;
	case 10:
		navn= "Købstædernes Forsikring";
		break;
	case 11:
		navn= "ALKA";
		break;
	case 12:
		navn= "Frida Forsikring Agentur";
		break;
	case 13:
		navn= "NemForsikring";
		break;
	case 14:
		navn= "AXA";
		break;
	case 15:
		navn= "Husejernes Forsikring";
		break;
	case 16:
		navn= "Garbo";
		break;
	case 17:
		navn= "Marsh og McLennan Agency A/S";
		break;
	case 18:
		navn= "First Marine";
		break;
	case 99:
		navn= "Ingen forsikring på grund af dispensation";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygherreForhold(kode) {
	switch (kode) { 
	case 10:
		navn= "Privatpersoner eller interessentskab";
		break;
	case 20:
		navn= "Alment boligselskab";
		break;
	case 30:
		navn= "Aktie-, anpart- eller andet selskab (undtagen interessent­skab)";
		break;
	case 40:
		navn= "Forening, legat eller selvejende institution";
		break;
	case 41:
		navn= "Privat andelsboligforening";
		break;
	case 50:
		navn= "Den kommune, hvori ejendommen er beliggende";
		break;
	case 60:
		navn= "Anden primærkommune";
		break;
	case 70:
		navn= "Region";
		break;
	case 80:
		navn= "Staten";
		break;
	case 90:
		navn= "Andet, herunder moderejendomme for bebyggelser, der er op­delt i ejerlejligheder samt ejendomme, der ejes af flere ka­te­gorier af ejere ";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygningSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Bygnings nummer";
		break;
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Postnummer";
		break;
	case 5:
		navn= "Postdistrikt";
		break;
	case 6:
		navn= "Anvendelseskode (samt som klartekst i tooltip)";
		break;
	case 9:
		navn= "Sagsnummer";
		break;
	case 10:
		navn= "Opførelsesår";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygSupplerendeVarme(kode) {
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Varmepumpeanlæg";
		break;
	case 2:
		navn= "Ovne til fast brændsel (brændeovn o. lign.)";
		break;
	case 3:
		navn= "Ovne til flydende brændsel";
		break;
	case 4:
		navn= "Solpaneler";
		break;
	case 5:
		navn= "Pejs";
		break;
	case 6:
		navn= "Gasradiator";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 10:
		navn= "Biogasanlæg";
		break;
	case 80:
		navn= "Andet";
		break;
	case 90:
		navn= "Bygningen har ingen supplerende varme";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygVandforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Alment vandforsyningsanlæg (tidligere offentligt)";
		break;
	case 2:
		navn= "Privat, alment vandforsyningsanlæg";
		break;
	case 3:
		navn= "Enkeltindvindingsanlæg (egen boring til 1 eller 2 ejendomme)";
		break;
	case 4:
		navn= "Brønd";
		break;
	case 6:
		navn= "Ikke alment vandforsyningsanlæg (forsyner < 10 ejendomme)";
		break;
	case 7:
		navn= "Blandet vandforsyning";
		break;
	case 9:
		navn= "Ingen vandforsyning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getBygVarmeinstallation(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Fjernvarme/blokvarme (radiatorsystemer el. varmluftanlæg)";
		break;
	case 2:
		navn= "Centralvarme fra eget anlæg, et-kammer fyr";
		break;
	case 3:
		navn= "Ovne (kakkelovne, kamin, brændeovne o.l.)";
		break;
	case 5:
		navn= "Varmepumpe";
		break;
	case 6:
		navn= "Centralvarme med to fyringsenheder (fast og olie eller gas)";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 8:
		navn= "Gasradiator";
		break;
	case 9:
		navn= "Ingen varmeinstallation";
		break;
	case 99:
		navn= "Blandet (Kræver specifikation på enhedsniveau)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getDispensationFritagelseIftKollektivVarmeforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Dispensation er tidsbegrænset";
		break;
	case 2:
		navn= "Dispensationen er ikke tidsbegrænset";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getDriftstatus(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "I drift";
		break;
	case 2:
		navn= "Ikke i drift";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEjendomstype(kode) {
	switch (kode) { 
	case 1:
		navn= "Matrikuleret Areal";
		break;
	case 2:
		navn= "BPFG";
		break;
	case 3:
		navn= "Ejerlejlighed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEjerforholdskode(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 10:
		navn= "Privatpersoner eller interessentskab";
		break;
	case 20:
		navn= "Alment boligselskab";
		break;
	case 30:
		navn= "Aktie-, anpart- eller andet selskab (undtagen interessent­skab)";
		break;
	case 40:
		navn= "Forening, legat eller selvejende institution";
		break;
	case 41:
		navn= "Privat andelsboligforening";
		break;
	case 50:
		navn= "Den kommune, hvori ejendommen er beliggende";
		break;
	case 60:
		navn= "Anden primærkommune";
		break;
	case 70:
		navn= "Region";
		break;
	case 80:
		navn= "Staten";
		break;
	case 90:
		navn= "Andet, herunder moderejendomme for bebyggelser, der er opdelt i ejerlejligheder samt ejendomme, der ejes af flere kategorier af ejere ";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getElevator(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Der er ikke elevator i opgangen/bygningen";
		break;
	case 1:
		navn= "Der findes person- eller vareelevator i opgangen/bygningen";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnergiforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Gas fra værk";
		break;
	case 2:
		navn= "230 V el fra værk";
		break;
	case 3:
		navn= "400 V el fra værk";
		break;
	case 4:
		navn= "Både 230 V el og gas fra værk";
		break;
	case 5:
		navn= "Både 400 V el og gas fra værk";
		break;
	case 6:
		navn= "Hverken el eller gas fra værk";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhAnvendelse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 110:
		navn= "Stuehus til landbrugsejendom";
		break;
	case 120:
		navn= "Fritliggende enfamilieshus (parcelhus).";
		break;
	case 121:
		navn= "Sammenbygget enfamiliehus";
		break;
	case 130:
		navn= "(UDFASES) Række-, kæde- eller dobbelthus (lodret adskillelse mellem enhederne).";
		break;
	case 131:
		navn= "Række- og kædehus";
		break;
	case 132:
		navn= "Dobbelthus";
		break;
	case 140:
		navn= "Bolig i etageejendom, flerfamiliehus eller to-familiehus";
		break;
	case 150:
		navn= "Kollegiebolig";
		break;
	case 160:
		navn= "Bolig i døgninstitution";
		break;
	case 185:
		navn= "Anneks i tilknytning til helårsbolig";
		break;
	case 190:
		navn= "Anden enhed til helårsbeboelse";
		break;
	case 210:
		navn= "(UDFASES) Erhvervsmæssig produktion vedrørende landbrug, skovbrug, gartneri, råstofudvinding og lign. ";
		break;
	case 211:
		navn= "Stald til svin";
		break;
	case 212:
		navn= "Stald til kvæg, får mv.";
		break;
	case 213:
		navn= "Stald til fjerkræ";
		break;
	case 214:
		navn= "Minkhal";
		break;
	case 215:
		navn= "Væksthus";
		break;
	case 216:
		navn= "Lade til foder, afgrøder mv.";
		break;
	case 217:
		navn= "Maskinhus, garage mv.";
		break;
	case 218:
		navn= "Lade til halm, hø mv.";
		break;
	case 219:
		navn= "Anden enhed til landbrug mv.";
		break;
	case 220:
		navn= "(UDFASES) Erhvervsmæssig produktion vedrørende industri, håndværk m.v. (fabrik, værksted o. lign.) ";
		break;
	case 221:
		navn= "Enhed til industri med integreret produktionsapparat";
		break;
	case 222:
		navn= "Enhed til industri uden integreret produktionsapparat";
		break;
	case 223:
		navn= "Værksted";
		break;
	case 229:
		navn= "Anden enhed til produktion";
		break;
	case 230:
		navn= "(UDFASES) El-, gas-, vand- eller varmeværk, forbrændingsanstalt o. lign.";
		break;
	case 231:
		navn= "Enhed til energiproduktion";
		break;
	case 232:
		navn= "Enhed til forsyning- og energidistribution";
		break;
	case 233:
		navn= "Enhed til vandforsyning";
		break;
	case 234:
		navn= "Enhed til håndtering af affald og spildevand";
		break;
	case 239:
		navn= "Anden enhed til energiproduktion og -distribution";
		break;
	case 290:
		navn= "(UDFASES) Anden enhed til produktion og lager i forbindelse med landbrug, industri o. lign. ";
		break;
	case 310:
		navn= "(UDFASES) Transport- og garageanlæg (fragtmandshal, lufthavnsbygning,banegårdsbygning o. lign.) ";
		break;
	case 311:
		navn= "Enhed til jernbane- og busdrift";
		break;
	case 312:
		navn= "Enhed til luftfart";
		break;
	case 313:
		navn= "Enhed til parkerings- og transportanlæg";
		break;
	case 314:
		navn= "Enhed til parkering af flere end to køretøjer i tilknytning til boliger";
		break;
	case 315:
		navn= "Havneanlæg";
		break;
	case 319:
		navn= "Andet transportanlæg";
		break;
	case 320:
		navn= "(UDFASES) Engroshandel og lager.";
		break;
	case 321:
		navn= "Enhed til kontor";
		break;
	case 322:
		navn= "Enhed til detailhandel";
		break;
	case 323:
		navn= "Enhed til lager";
		break;
	case 324:
		navn= "Butikscenter";
		break;
	case 325:
		navn= "Tankstation";
		break;
	case 329:
		navn= "Anden enhed til kontor, handel og lager";
		break;
	case 330:
		navn= "(UDFASES) Detailhandel m.v.";
		break;
	case 331:
		navn= "Hotel, kro eller konferencecenter med overnatning";
		break;
	case 332:
		navn= "Bed & breakfast mv.";
		break;
	case 333:
		navn= "Restaurant, café og konferencecenter uden overnatning";
		break;
	case 334:
		navn= "Privat servicevirksomhed som frisør, vaskeri, netcafé mv.";
		break;
	case 339:
		navn= "Anden enhed til serviceerhverv";
		break;
	case 340:
		navn= "(UDFASES) Pengeinstitut, forsikringsvirksomhed m.v.";
		break;
	case 350:
		navn= "(UDFASES) Kontor og liberale erhverv bortset fra offentlig administration (kontorer for advokater, rådgivende ingeniører, klinikker o.lign.) ";
		break;
	case 360:
		navn= "(UDFASES) Offentlig administration.";
		break;
	case 370:
		navn= "(UDFASES) Hotel, restauration, vaskeri, frisør og anden servicevirksomhed.";
		break;
	case 390:
		navn= "(UDFASES) Anden enhed til handel, transport etc.";
		break;
	case 410:
		navn= "(UDFASES) Biograf, teater, erhvervsmæssig udstilling m.v.";
		break;
	case 411:
		navn= "Biograf, teater, koncertsted mv.";
		break;
	case 412:
		navn= "Museum";
		break;
	case 413:
		navn= "Bibliotek";
		break;
	case 414:
		navn= "Kirke eller anden enhed til trosudøvelse for statsanerkendte trossamfund";
		break;
	case 415:
		navn= "Forsamlingshus";
		break;
	case 416:
		navn= "Forlystelsespark";
		break;
	case 419:
		navn= "Anden enhed til kulturelle formål";
		break;
	case 420:
		navn= "(UDFASES) Bibliotek, museum, kirke o. lign.";
		break;
	case 421:
		navn= "Grundskole";
		break;
	case 422:
		navn= "Universitet";
		break;
	case 429:
		navn= "Anden enhed til undervisning og forskning";
		break;
	case 430:
		navn= "(UDFASES) Undervisning og forskning (skole, gymnasium, forskningslaboratorium).";
		break;
	case 431:
		navn= "Hospital og sygehus";
		break;
	case 432:
		navn= "Hospice, behandlingshjem mv.";
		break;
	case 433:
		navn= "Sundhedscenter, lægehus, fødeklinik mv.";
		break;
	case 439:
		navn= "Anden enhed til sundhedsformål";
		break;
	case 440:
		navn= "(UDFASES) Hospital, fødeklinik o. lign.";
		break;
	case 441:
		navn= "Daginstitution";
		break;
	case 442:
		navn= "Servicefunktion på døgninstitution";
		break;
	case 443:
		navn= "Kaserne";
		break;
	case 444:
		navn= "Fængsel, arresthus mv.";
		break;
	case 449:
		navn= "Anden enhed til institutionsformål";
		break;
	case 450:
		navn= "(UDFASES) Daginstitution.";
		break;
	case 490:
		navn= "(UDFASES) Anden institution, herunder kaserne, fængsel m.v.";
		break;
	case 510:
		navn= "Sommerhus.";
		break;
	case 520:
		navn= "(UDFASES) Enhed til feriekoloni, vandrehjem o.lign. bortset fra sommerhus";
		break;
	case 521:
		navn= "Feriecenter, center til campingplads mv.";
		break;
	case 522:
		navn= "Ferielejlighed til erhvervsmæssig udlejning";
		break;
	case 523:
		navn= "Ferielejlighed til eget brug";
		break;
	case 529:
		navn= "Anden enhed til ferieformål";
		break;
	case 530:
		navn= "(UDFASES) Enhed i forbindelse med idrætsudøvelse (klubhus, idrætshal, svømmehal o. lign.). ";
		break;
	case 531:
		navn= "Klubhus i forbindelse med fritid- og idræt";
		break;
	case 532:
		navn= "Svømmehal";
		break;
	case 533:
		navn= "Idrætshal";
		break;
	case 534:
		navn= "Tribune i forbindelse med stadion";
		break;
	case 535:
		navn= "Rideskole";
		break;
	case 539:
		navn= "Anden enhed til idrætsformål";
		break;
	case 540:
		navn= "Kolonihavehus";
		break;
	case 585:
		navn= "Anneks i tilknytning til fritids- og sommerhus";
		break;
	case 590:
		navn= "Anden enhed til fritidsformål";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhedHvorSkalEnhedVises(kode) {
	switch (kode) { 
	case 0:
		navn= "Vis Enheder under Opgange";
		break;
	case 1:
		navn= "Vis Enheder under Etager";
		break;
	case 2:
		navn= "Vis Enheder under både Opgange og Etager";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhedSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Bygnings nummer";
		break;
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Etage";
		break;
	case 5:
		navn= "Side/dør";
		break;
	case 6:
		navn= "Postnummer";
		break;
	case 7:
		navn= "Postdistrikt";
		break;
	case 8:
		navn= "Anvendelseskode (samt som klartekst i tooltip)";
		break;
	case 10:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhSupplerendeVarme(kode) {
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Varmepumpeanlæg";
		break;
	case 2:
		navn= "Ovne til fast brændsel (brændeovn o. lign.)";
		break;
	case 3:
		navn= "Ovne til flydende brændsel";
		break;
	case 4:
		navn= "Solpaneler";
		break;
	case 5:
		navn= "Pejs";
		break;
	case 6:
		navn= "Gasradiator";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 10:
		navn= "Biogasanlæg";
		break;
	case 80:
		navn= "Andet";
		break;
	case 90:
		navn= "Bygningen har ingen supplerende varme";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEnhVarmeinstallation(kode) {
	switch (kode) { 
	case 1:
		navn= "Fjernvarme/blokvarme (radiatorsystemer el. varmluftanlæg)";
		break;
	case 2:
		navn= "Centralvarme fra eget anlæg, et-kammer fyr";
		break;
	case 3:
		navn= "Ovne (kakkelovne, kamin, brændeovne o.l.)";
		break;
	case 5:
		navn= "Varmepumpe";
		break;
	case 6:
		navn= "Centralvarme med to fyringsenheder (fast og olie eller gas)";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 8:
		navn= "Gasradiator";
		break;
	case 9:
		navn= "Ingen varmeinstallation";
		break;
	case 99:
		navn= "Blandet (Kræver specifikation på enhedsniveau)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEtageSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Etagebetegnelse";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getEtageType(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke tagetage";
		break;
	case 1:
		navn= "Tagetage";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getFordelingsnoegle(kode) {
	switch (kode) { 
	case 1:
		navn= "Manuel fordeling";
		break;
	case 2:
		navn= "Ligelig fordeling";
		break;
	case 3:
		navn= "Institutions fordeling";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsHaendelse(kode) {
	switch (kode) { 
	case "BUH":
		navn= "Bygning uden Husnummer";
		break;
	case "BYG":
		navn= "Bygning";
		break;
	case "ENH":
		navn= "Enhed";
		break;
	case "GRU":
		navn= "Grund";
		break;
	case "SAG":
		navn= "BBR-sag";
		break;
	case "TEK":
		navn= "Teknisk Anlæg";
		break;
	case "TUH":
		navn= "Teknisk Anlæg uden Husnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsOmraade(kode) {
	switch (kode) { 
	case "BBR":
		navn= "54.15.05.05";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsProcess(kode) {
	switch (kode) { 
	case 0:
		navn= "Ikke angivet";
		break;
	case 1:
		navn= "Oprettet grundet nybyggeri";
		break;
	case 2:
		navn= "Opdateret grundet til/ombygning";
		break;
	case 3:
		navn= "Opdateret grundet nedrivning";
		break;
	case 4:
		navn= "Fejlrettelse af faktiske fejlregistreringer og udeladelser";
		break;
	case 5:
		navn= "Faktisk udført ændring uden byggesagsbehandling";
		break;
	case 6:
		navn= "Opdeling af enheder";
		break;
	case 7:
		navn= "Sammenlægning af enheder";
		break;
	case 8:
		navn= "Opdateret som følge af digital indberetning fra borger mm.";
		break;
	case 9:
		navn= "Opdateret som følge af digital indberetning fra SKAT";
		break;
	case 10:
		navn= "Anmeldelsessag";
		break;
	case 11:
		navn= "Tilladelsessag";
		break;
	case 12:
		navn= "Opdateret grundet ændring i grunddataregister: Matriklen";
		break;
	case 13:
		navn= "Opdateret grundet ændring i grunddataregister: DAR";
		break;
	case 14:
		navn= "Opdateret grundet ændring i grunddataregister: Ejerfortegnelsen";
		break;
	case 15:
		navn= "Opdateret grundet ændring i grunddataregister: Ejendomsbeliggenhedsregisteret";
		break;
	case 16:
		navn= "Automatisk lukning af anmeldelsessag";
		break;
	case 17:
		navn= "Flytning af underliggende elementer på matrikel (Matrikulær ændring)";
		break;
	case 18:
		navn= "Fordelingsareal af fordelingsareal";
		break;
	case 19:
		navn= "Opdateret grundet ændret Sikkerhedsklassificering";
		break;
	case 20:
		navn= "Fremdatering af indflytning";
		break;
	case 21:
		navn= "Opdatering af indberetning";
		break;
	case 22:
		navn= "ESR Event Processering";
		break;
	case 23:
		navn= "AWS Event Processering";
		break;
	case 24:
		navn= "Indberetnings services";
		break;
	case 25:
		navn= "SKATServices";
		break;
	case 26:
		navn= "EnergiindberetningProcessering";
		break;
	case 27:
		navn= "EJDbATilknytningHusnummerService";
		break;
	case 28:
		navn= "BPFG Tilknyttet gennem Ajorføring hos MU";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsProcessUI(kode) {
	switch (kode) { 
	case 4:
		navn= "Fejlrettelse af faktiske fejlregistreringer og udeladelser";
		break;
	case 5:
		navn= "Faktisk udført ændring uden byggesagsbehandling";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getForretningsProcessUIBygningEnhed(kode) {
	switch (kode) { 
	case 4:
		navn= "Fejlrettelse af faktiske fejlregistreringer og udeladelser";
		break;
	case 5:
		navn= "Faktisk udført ændring uden byggesagsbehandling";
		break;
	case 6:
		navn= "Opdeling af enheder";
		break;
	case 7:
		navn= "Sammenlægning af enheder";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getFredning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Bygningen fredet iht. bygningsfredningsloven";
		break;
	case 2:
		navn= "Som 1, men med tinglyste bevaringsbestemmelser jf. lovens §15";
		break;
	case 3:
		navn= "Tinglyst bevaringsdeklaration, men bygningen ikke fredet";
		break;
	case 4:
		navn= "På bygningens middelalderlige bygningsdele er der tinglyst fredningsbestemmelser";
		break;
	case 5:
		navn= "Bygningen indeholder middelalderlige bygningsdele";
		break;
	case 6:
		navn= "Bygningen og dens umiddelbare omgivelser fredet iht. bygningsfredningsloven";
		break;
	case 7:
		navn= "Som 6, men med tinglyst bevaringsdeklaration";
		break;
	case 8:
		navn= "Bygningen bevaringsværdig";
		break;
	case 9:
		navn= "Bygningen medtaget i registrant, bevaringsplan mm.";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGodkendtTomBolig(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Krav om persontilmelding";
		break;
	case 100:
		navn= "Bolig uden krav om persontilmelding";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGruAfloebsforhold(kode) {
	switch (kode) { 
	case 1:
		navn= "Fælleskloakeret: spildevand + tag- og overfladevand";
		break;
	case 2:
		navn= "Fælleskloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 3:
		navn= "Fælleskloakeret: spildevand";
		break;
	case 4:
		navn= "Fælleskloakeret: tag- og overfladevand";
		break;
	case 5:
		navn= "Separatkloakeret: spildevand + tag- og overfladevand";
		break;
	case 6:
		navn= "Separatkloakeret: spildevand + delvis tag- og overfladevand";
		break;
	case 7:
		navn= "Separatkloakeret: spildevand";
		break;
	case 8:
		navn= "Separatkloakeret: tag- og overfladevand";
		break;
	case 9:
		navn= "Spildevandskloakeret: Spildevand";
		break;
	case 10:
		navn= "Afløb til spildevandsforsyningens renseanlæg";
		break;
	case 11:
		navn= "Afløb til fællesprivat spildevandsanlæg";
		break;
	case 12:
		navn= "Afløb til fællesprivat kloakledning med tilslutning til spv. renseanlæg";
		break;
	case 20:
		navn= "Afløb til samletank";
		break;
	case 21:
		navn= "Afløb til samletank for toiletvand og mek. rensning af øvr. spildevand";
		break;
	case 29:
		navn= "Mekanisk rensning med nedsivningsanlæg med tilladelse";
		break;
	case 30:
		navn= "Mekanisk rensning med nedsivningsanlæg (tilladelse ikke påkrævet)";
		break;
	case 31:
		navn= "Mekanisk rensning med privat udledn. dir. til vandløb, sø eller hav";
		break;
	case 32:
		navn= "Mekanisk og biologisk rensning (ældre anlæg uden renseklasse)";
		break;
	case 70:
		navn= "Udledning uden rensning direkte til vandløb, søer eller havet";
		break;
	case 75:
		navn= "Blandet afløbsforhold på ejendommen (er specificeret på bygningen)";
		break;
	case 80:
		navn= "Anden type afløb";
		break;
	case 90:
		navn= "Ingen udledning";
		break;
	case 101:
		navn= "SOP: Minirenseanlæg med direkte udledning";
		break;
	case 102:
		navn= "SOP: Minirenseanlæg med udledning til markdræn";
		break;
	case 103:
		navn= "SOP: Minirenseanlæg med nedsivning i faskine";
		break;
	case 104:
		navn= "SOP: Nedsivning til sivedræn";
		break;
	case 105:
		navn= "SOP: Samletank";
		break;
	case 106:
		navn= "SOP: Pileanlæg med nedsivning (uden membran)";
		break;
	case 107:
		navn= "SOP: Pileanlæg uden udledning (med membran)";
		break;
	case 108:
		navn= "SOP: Beplantede filteranlæg med nedsivning i faskine";
		break;
	case 109:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og direkte udledning";
		break;
	case 110:
		navn= "SOP: Sandfiltre med P-fældning i bundfældningstanken og udledning til markdræn";
		break;
	case 190:
		navn= "SOP: Andet";
		break;
	case 201:
		navn= "SO: Biologisk sandfilter med direkte udledning";
		break;
	case 202:
		navn= "SO: Biologisk sandfilter med udledning til markdræn";
		break;
	case 203:
		navn= "SO: Minirensanlæg med direkte udledning";
		break;
	case 204:
		navn= "SO: Minirenseanlæg med udledning til markdræn";
		break;
	case 205:
		navn= "SO: Beplantede filteranlæg med direkte udledning";
		break;
	case 206:
		navn= "SO: Beplantede filteranlæg med udledning til markdræn";
		break;
	case 290:
		navn= "SO: Andet";
		break;
	case 301:
		navn= "OP: Minirenseanlæg med direkte udledning";
		break;
	case 302:
		navn= "OP: Minirenseanlæg med udledning til markdræn";
		break;
	case 390:
		navn= "OP: Andet";
		break;
	case 401:
		navn= "O: Rodzoneanlæg med direkte udledning";
		break;
	case 402:
		navn= "O: Rodzoneanlæg med udledning til markdræn";
		break;
	case 403:
		navn= "O: Minirenseanlæg med direkte udledning";
		break;
	case 404:
		navn= "O: Minirenseanlæg med udledning til markdræn";
		break;
	case 490:
		navn= "O: Andet";
		break;
	case 501:
		navn= "Øvrige renseløsninger: Mekanisk med direkte udledning";
		break;
	case 502:
		navn= "Øvrige renseløsninger: Mekanisk med udledning til markdræn";
		break;
	case 503:
		navn= "Øvrige renseløsninger: Ældre nedsivningsanlæg med nedsivning til sivebrønd";
		break;
	case 504:
		navn= "Øvrige renseløsninger: Udledning til jordoverfladen";
		break;
	case 505:
		navn= "Øvrige renseløsninger: Urenset";
		break;
	case 590:
		navn= "Øvrige renseløsninger: Andet";
		break;
	case 601:
		navn= "Anden type afløb (større end 30 PE med egen udledning)";
		break;
	case 701:
		navn= "Intet afløb";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGrundSortering(kode) {
	switch (kode) { 
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Postnummer";
		break;
	case 5:
		navn= "Postdistrikt";
		break;
	case 6:
		navn= "Ejerforholdskode (samt som klartekst i tooltip)";
		break;
	case 7:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGrundViewType(kode) {
	switch (kode) { 
	case 0:
		navn= "Stamdata";
		break;
	case 1:
		navn= "Grundoplysninger";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGruVandforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Alment vandforsyningsanlæg (tidligere offentligt)";
		break;
	case 2:
		navn= "Privat, alment vandforsyningsanlæg";
		break;
	case 3:
		navn= "Enkeltindvindingsanlæg (egen boring til 1 eller 2 ejendomme)";
		break;
	case 4:
		navn= "Brønd";
		break;
	case 6:
		navn= "Ikke alment vandforsyningsanlæg (forsyner < 10 ejendomme)";
		break;
	case 7:
		navn= "Blandet vandforsyning";
		break;
	case 9:
		navn= "Ingen vandforsyning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getGulvbelaegning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Beton";
		break;
	case 2:
		navn= "Andet";
		break;
	case 3:
		navn= "Ingen";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getHenvendelserDirekteIndberetning(kode) {
	switch (kode) { 
	case 0:
		navn= "Ingen";
		break;
	case 1:
		navn= "Få";
		break;
	case 2:
		navn= "Mange";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getHusnummerRolle(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Fastsat til denne";
		break;
	case 1:
		navn= "Kun vejledende";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getHusnummerType(kode) {
	switch (kode) { 
	case 2:
		navn= "Lige husnr.";
		break;
	case 3:
		navn= "Ulige husnr.";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getIndberetningRolle(kode) {
	switch (kode) { 
	case 0:
		navn= "Alle";
		break;
	case 1:
		navn= "BBR Erhvervsservice SKAT";
		break;
	case 2:
		navn= "Ejer";
		break;
	case 3:
		navn= "Repræsentant for ejer";
		break;
	case 4:
		navn= "Lejer";
		break;
	case 5:
		navn= "Administrator";
		break;
	case 6:
		navn= "Callcenter medarbejder";
		break;
	case 7:
		navn= "Andet";
		break;
	case 8:
		navn= "Landinspektør";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getIndhold(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 10:
		navn= "Mineralske olieprodukter (Olietankbekendtgørelsens §6, stk. 1 nr. 13)";
		break;
	case 11:
		navn= "Fuelolie (”tung fuelolie” - kræver opvarmning)";
		break;
	case 12:
		navn= "Fyringsgasolie";
		break;
	case 13:
		navn= "Autogasolie (Dieselolie)";
		break;
	case 14:
		navn= "Benzin";
		break;
	case 20:
		navn= "Biobrændstoffer (Organiske olieprodukter som f.eks. rapsolie, bioethanol m.v.)";
		break;
	case 30:
		navn= "Affaldsprodukter";
		break;
	case 31:
		navn= "Oliebaserede affaldsprodukter (Spildolie)";
		break;
	case 40:
		navn= "Gylle";
		break;
	case 50:
		navn= "Ajle, ensilagesaft, mælkerumsvand eller møddingvand";
		break;
	case 60:
		navn= "Øvrige stoffer, produkter og materialer der kan forurene grundvand, jord og undergrund (§ 19) ";
		break;
	case 70:
		navn= "Korn";
		break;
	case 99:
		navn= "Andet (f.eks. foderstoffer m.v)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKilde(kode) {
	switch (kode) { 
	case 0:
		navn= "Alle";
		break;
	case 1:
		navn= "Ret BBR";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKildeTilKoordinatsaet(kode) {
	let navn= '';
	switch (kode) { 
	case "E":
		navn= "Ejer";
		break;
	case "K":
		navn= "Kommune";
		break;
	case "L":
		navn= "Landinspektør";
		break;
	case "M":
		navn= "Maskinelt dannet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKildeTilOplysninger(kode) {
	let navn= "";
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Oplyst af ejer (eller dennes repræsentant)";
		break;
	case 2:
		navn= "Oplyst af teknisk forvaltning";
		break;
	case 3:
		navn= "Oplyst af andre (lukket for indberetning)";
		break;
	case 4:
		navn= "Maskinelt oprettet";
		break;
	case 5:
		navn= "Oplyst og kontrolleret af teknisk forvaltning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKlassifikation(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1110:
		navn= "Tank (Produkt på væskeform)";
		break;
	case 1120:
		navn= "Silo (Produkt på fast form)";
		break;
	case 1130:
		navn= "Gasbeholder (Produkt på gasform)";
		break;
	case 1140:
		navn= "Affaldsbeholder";
		break;
	case 1210:
		navn= "Vindmølle (elproducerende)";
		break;
	case 1220:
		navn= "Slanger til jordvarme";
		break;
	case 1230:
		navn= "Solvarme-/ solcelleanlæg";
		break;
	case 1240:
		navn= "Nødstrømsforsyningsanlæg";
		break;
	case 1250:
		navn= "Transformerstation";
		break;
	case 1260:
		navn= "Elskab";
		break;
	case 1265:
		navn= "Naturgasfyr";
		break;
	case 1270:
		navn= "Andet energiproducerende eller - distribuerende anlæg";
		break;
	case 1275:
		navn= "Halmfyr";
		break;
	case 1280:
		navn= "Biogasanlæg";
		break;
	case 1310:
		navn= "Vandtårn";
		break;
	case 1320:
		navn= "Pumpestation";
		break;
	case 1330:
		navn= "Swimmingpool";
		break;
	case 1340:
		navn= "Private rensningsanlæg f.eks. pileanlæg, nedsivningsanlæg";
		break;
	case 1350:
		navn= "Offentlige rensningsanlæg";
		break;
	case 1360:
		navn= "Regnvandsanlæg";
		break;
	case 1905:
		navn= "Legeplads";
		break;
	case 1910:
		navn= "Teknikhus";
		break;
	case 1915:
		navn= "Døgnpostboks";
		break;
	case 1920:
		navn= "Køleanlæg (herunder aircondition)";
		break;
	case 1925:
		navn= "Kunstværk (springvand, mindesmærker m.v.)";
		break;
	case 1930:
		navn= "Sirene / mast med sirene";
		break;
	case 1935:
		navn= "Skilt";
		break;
	case 1940:
		navn= "Antenne / mast fx tv, radio- og telekommunikation";
		break;
	case 1945:
		navn= "Dambrug";
		break;
	case 1950:
		navn= "Møddingsanlæg";
		break;
	case 1955:
		navn= "Andet teknisk anlæg";
		break;
	case 1960:
		navn= "Ensilageanlæg";
		break;
	case 1965:
		navn= "Planlager";
		break;
	case 1970:
		navn= "Fortidsminde, historisk ruin";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKodeForMereEndEnLejlighed(kode) {
	switch (kode) { 
	case "E":
		navn= "En enhed";
		break;
	case "M":
		navn= "Mere end 1 enhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKoekkenforhold(kode) {
	let navn= '';
	switch (kode) { 
	case "E":
		navn= "Eget køkken (med afløb og kogeinstallation)";
		break;
	case "F":
		navn= "Adgang til fælles køkken";
		break;
	case "G":
		navn= "Fast kogeinstallation i værelse eller på gang";
		break;
	case "H":
		navn= "Ingen fast kogeinstallation";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKommuneFelterNiveau(kode) {
	switch (kode) { 
	case 0:
		navn= "Grund";
		break;
	case 1:
		navn= "Bygning";
		break;
	case 2:
		navn= "Opgang";
		break;
	case 3:
		navn= "Etage";
		break;
	case 4:
		navn= "Enhed";
		break;
	case 5:
		navn= "Teknisk Anlæg";
		break;
	case 6:
		navn= "Fordelingsareal";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKommunekode(kode) {
	switch (kode) { 
	case 101:
		navn= "Københavns Kommune";
		break;
	case 147:
		navn= "Frederiksberg Kommune";
		break;
	case 151:
		navn= "Ballerup Kommune";
		break;
	case 153:
		navn= "Brøndby Kommune";
		break;
	case 155:
		navn= "Dragør Kommune";
		break;
	case 157:
		navn= "Gentofte Kommune";
		break;
	case 159:
		navn= "Gladsaxe Kommune";
		break;
	case 161:
		navn= "Glostrup Kommune";
		break;
	case 163:
		navn= "Herlev Kommune";
		break;
	case 165:
		navn= "Albertslund Kommune";
		break;
	case 167:
		navn= "Hvidovre Kommune";
		break;
	case 169:
		navn= "Høje Taastrup Kommune";
		break;
	case 173:
		navn= "Lyngby-Taarbæk Kommune";
		break;
	case 175:
		navn= "Rødovre Kommune";
		break;
	case 183:
		navn= "Ishøj Kommune";
		break;
	case 185:
		navn= "Tårnby Kommune";
		break;
	case 187:
		navn= "Vallensbæk Kommune";
		break;
	case 190:
		navn= "Furesø Kommune";
		break;
	case 201:
		navn= "Allerød Kommune";
		break;
	case 210:
		navn= "Fredensborg Kommune";
		break;
	case 217:
		navn= "Helsingør Kommune";
		break;
	case 219:
		navn= "Hillerød Kommune";
		break;
	case 223:
		navn= "Hørsholm Kommune";
		break;
	case 230:
		navn= "Rudersdal Kommune";
		break;
	case 240:
		navn= "Egedal Kommune";
		break;
	case 250:
		navn= "Frederikssund Kommune";
		break;
	case 253:
		navn= "Greve Kommune";
		break;
	case 259:
		navn= "Køge Kommune";
		break;
	case 260:
		navn= "Halsnæs Kommune";
		break;
	case 265:
		navn= "Roskilde Kommune";
		break;
	case 269:
		navn= "Solrød Kommune";
		break;
	case 270:
		navn= "Gribskov Kommune";
		break;
	case 306:
		navn= "Odsherred Kommune";
		break;
	case 316:
		navn= "Holbæk Kommune";
		break;
	case 320:
		navn= "Faxe Kommune";
		break;
	case 326:
		navn= "Kalundborg Kommune";
		break;
	case 329:
		navn= "Ringsted Kommune";
		break;
	case 330:
		navn= "Slagelse Kommune";
		break;
	case 336:
		navn= "Stevns Kommune";
		break;
	case 340:
		navn= "Sorø Kommune";
		break;
	case 350:
		navn= "Lejre Kommune";
		break;
	case 360:
		navn= "Lolland Kommune";
		break;
	case 370:
		navn= "Næstved Kommune";
		break;
	case 376:
		navn= "Guldborgsund Kommune";
		break;
	case 390:
		navn= "Vordingborg Kommune";
		break;
	case 400:
		navn= "Bornholms Regionskommune";
		break;
	case 410:
		navn= "Middelfart Kommune";
		break;
	case 420:
		navn= "Assens Kommune";
		break;
	case 430:
		navn= "Faaborg-Midtfyn Kommune";
		break;
	case 440:
		navn= "Kerteminde Kommune";
		break;
	case 450:
		navn= "Nyborg Kommune";
		break;
	case 461:
		navn= "Odense Kommune";
		break;
	case 479:
		navn= "Svendborg Kommune";
		break;
	case 480:
		navn= "Nordfyns Kommune";
		break;
	case 482:
		navn= "Langeland Kommune";
		break;
	case 492:
		navn= "Ærø Kommune";
		break;
	case 510:
		navn= "Haderslev Kommune";
		break;
	case 530:
		navn= "Billund Kommune";
		break;
	case 540:
		navn= "Sønderborg Kommune";
		break;
	case 550:
		navn= "Tønder Kommune";
		break;
	case 561:
		navn= "Esbjerg Kommune";
		break;
	case 563:
		navn= "Fanø Kommune";
		break;
	case 573:
		navn= "Varde Kommune";
		break;
	case 575:
		navn= "Vejen Kommune";
		break;
	case 580:
		navn= "Aabenraa Kommune";
		break;
	case 607:
		navn= "Fredericia Kommune";
		break;
	case 615:
		navn= "Horsens Kommune";
		break;
	case 621:
		navn= "Kolding Kommune";
		break;
	case 630:
		navn= "Vejle Kommune";
		break;
	case 657:
		navn= "Herning Kommune";
		break;
	case 661:
		navn= "Holstebro Kommune";
		break;
	case 665:
		navn= "Lemvig Kommune";
		break;
	case 671:
		navn= "Struer Kommune";
		break;
	case 706:
		navn= "Syddjurs Kommune";
		break;
	case 707:
		navn= "Norddjurs Kommune";
		break;
	case 710:
		navn= "Favrskov Kommune";
		break;
	case 727:
		navn= "Odder Kommune";
		break;
	case 730:
		navn= "Randers Kommune";
		break;
	case 740:
		navn= "Silkeborg Kommune";
		break;
	case 741:
		navn= "Samsø Kommune";
		break;
	case 746:
		navn= "Skanderborg Kommune";
		break;
	case 751:
		navn= "Aarhus Kommune";
		break;
	case 756:
		navn= "Ikast-Brande Kommune";
		break;
	case 760:
		navn= "Ringkøbing-Skjern Kommune";
		break;
	case 766:
		navn= "Hedensted Kommune";
		break;
	case 773:
		navn= "Morsø Kommune";
		break;
	case 779:
		navn= "Skive Kommune";
		break;
	case 787:
		navn= "Thisted Kommune";
		break;
	case 791:
		navn= "Viborg Kommune";
		break;
	case 810:
		navn= "Brønderslev Kommune";
		break;
	case 813:
		navn= "Frederikshavn Kommune";
		break;
	case 820:
		navn= "Vesthimmerlands Kommune";
		break;
	case 825:
		navn= "Læsø Kommune";
		break;
	case 840:
		navn= "Rebild Kommune";
		break;
	case 846:
		navn= "Mariagerfjord Kommune";
		break;
	case 849:
		navn= "Jammerbugt Kommune";
		break;
	case 851:
		navn= "Aalborg Kommune";
		break;
	case 860:
		navn= "Hjørring Kommune";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKondemneretBoligenhed(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke kondemneret boligenhed";
		break;
	case 1:
		navn= "Kondemneret boligenhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKonstruktion(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Åben konstruktion";
		break;
	case 2:
		navn= "Lukket konstruktion";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKonstruktionsforhold(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Bygningen har jernbetonskelet";
		break;
	case 2:
		navn= "Bygningen har ikke jernbetonskelet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKoordinatsystem(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "System 34";
		break;
	case 2:
		navn= "System 45";
		break;
	case 3:
		navn= "KP2000 (System 2000)";
		break;
	case 4:
		navn= "UTM ED50";
		break;
	case 5:
		navn= "UTM Euref89 (WGS 84)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getKvalitetAfKoordinatsaet(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Sikker geokodning";
		break;
	case 2:
		navn= "Næsten sikker";
		break;
	case 3:
		navn= "Usikker geokodning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getLivscyklus(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Start";
		break;
	case 2:
		navn= "Projekteret";
		break;
	case 3:
		navn= "Under opførsel";
		break;
	case 4:
		navn= "Sagsgrund";
		break;
	case 5:
		navn= "Oprettet";
		break;
	case 6:
		navn= "Opført";
		break;
	case 7:
		navn= "Gældende";
		break;
	case 8:
		navn= "Godkendt";
		break;
	case 9:
		navn= "Afsluttet";
		break;
	case 10:
		navn= "Slettet";
		break;
	case 11:
		navn= "Fejlregistreret";
		break;
	case 12:
		navn= "Midlertidig Afsluttet";
		break;
	case 13:
		navn= "Delvis Afsluttet";
		break;
	case 14:
		navn= "Henlagt";
		break;
	case 15:
		navn= "Modtaget";
		break;
	case 16:
		navn= "UnderBehandling";
		break;
	case 17:
		navn= "Afvist";
		break;
	case 18:
		navn= "Udført";
		break;
	case 19:
		navn= "Foreløbig";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getLovligAnvendelse(kode) {
	let navn= '';
	switch (kode) { 
	case "A":
		navn= "Gammelt helårshus eller ikke-personlig disp. til helårsbeboelse";
		break;
	case "B":
		navn= "Personlig, tidsbegrænset dispensation til helårsbeboelse";
		break;
	case "C":
		navn= "Personlig, ikke-tidsbegrænset dispensation til helårsbeboelse";
		break;
	case "D":
		navn= "Personlig, ikke-tidsbegrænset ret til helårsbeboelse for pensionister";
		break;
	case "E":
		navn= "Dispensation til afvikling af ulovlig helårsbeboelse";
		break;
	case "I":
		navn= "Ikke relevant for denne enhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getMateriale(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Plast";
		break;
	case 2:
		navn= "Stål";
		break;
	case 3:
		navn= "Plasttank med udvendig stålvæg";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getMedlemsskabAfSplidevandforsyning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Ikke medlemskab af spildevandsforsyning";
		break;
	case 2:
		navn= "Medlemskab af spildevandsforsyning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getMidlertidigOprettelseEllerFuldfoersel(kode) {
	switch (kode) { 
	case 0:
		navn= "Bygningen er ikke midlertidig oprettet";
		break;
	case 1:
		navn= "Bygningen er midlertidig oprettet, nybyggeri";
		break;
	case 2:
		navn= "Bygningen er midlertidig fuldført, nybyggeri";
		break;
	case 3:
		navn= "Bygningen er midlertidig oprettet, om-/tilbygning";
		break;
	case 4:
		navn= "Bygningen er midlertidig fuldført, om-/tilbygning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getNiveau(kode) {
	switch (kode) { 
	case "UMAT":
		navn= "Umatrikuleret";
		break;
	case "ALL":
		navn= "Alle";
		break;
	case "BYG":
		navn= "Bygning";
		break;
	case "EJD":
		navn= "Ejendom";
		break;
	case "ENH":
		navn= "Enhed";
		break;
	case "GRU":
		navn= "Grund";
		break;
	case "SAG":
		navn= "Byggesag";
		break;
	case "TEK":
		navn= "Teknisk Anlæg";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getNiveauType(kode) {
	switch (kode) { 
	case 1:
		navn= "Grund";
		break;
	case 2:
		navn= "Bygning";
		break;
	case 3:
		navn= "TekniskAnlaeg";
		break;
	case 4:
		navn= "Etage";
		break;
	case 5:
		navn= "Opgang";
		break;
	case 6:
		navn= "Enhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOffentligStoette(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ingen offentlig støtte";
		break;
	case 10:
		navn= "Almen familiebolig";
		break;
	case 15:
		navn= "Støttet privat udlejningsbolig";
		break;
	case 20:
		navn= "Støttet privat andelsbolig";
		break;
	case 25:
		navn= "Almen ungdomsbolig";
		break;
	case 30:
		navn= "Støttet privat ungdomsbolig";
		break;
	case 40:
		navn= "Almen ældrebolig";
		break;
	case 42:
		navn= "Almen plejebolig";
		break;
	case 80:
		navn= "Serviceareal";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOmfattetAfByggeskadeforsikring(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Bygningen er ikke omfattet af byggeskadeforsikring";
		break;
	case 10:
		navn= "Bygningen er omfattet af byggeskadeforsikring";
		break;
	case 11:
		navn= "Bygningen er opført som selvbyg";
		break;
	case 12:
		navn= "Udlejningsejendom";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOpgangSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Vejkode";
		break;
	case 1:
		navn= "Vejnavn";
		break;
	case 2:
		navn= "Husnummer";
		break;
	case 3:
		navn= "Postnummer";
		break;
	case 4:
		navn= "Postdistrikt";
		break;
	case 5:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOpvarmningsmiddel(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Elektricitet";
		break;
	case 2:
		navn= "Gasværksgas";
		break;
	case 3:
		navn= "Flydende brændsel (olie, petroleum, flaskegas)";
		break;
	case 4:
		navn= "Fast brændsel (kul, koks, brænde mm.)";
		break;
	case 6:
		navn= "Halm";
		break;
	case 7:
		navn= "Naturgas";
		break;
	case 9:
		navn= "Andet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getOversvoemmelsesselvrisiko(kode) {
	let navn= '';
	kode=parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ingen udbetalt erstatning fra Stormrådet";
		break;
	case 1:
		navn= "Bygningens selvrisiko er forhøjet til trin 1";
		break;
	case 2:
		navn= "Bygningens selvrisiko er forhøjet til trin 2";
		break;
	case 3:
		navn= "Stormrådet har registreret udbetalt erstatning fra stormflod (siden 2012) og oversvømmelse fra søer og vandløb (siden 2010). Læs mere om stormflods- og oversvømmelsesordningerne på www.stormraadet.dk ";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getPaaSoeTerritorie(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke på søterritorie";
		break;
	case 1:
		navn= "På søterritorie";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getPlacering(kode) {
	switch (kode) { 
	case 0:
		navn= "Ukendt";
		break;
	case 1:
		navn= "Nedgravet/underjordisk";
		break;
	case 2:
		navn= "Over terræn, udendørs";
		break;
	case 3:
		navn= "Indendørs";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getPlaceringAfCursor(kode) {
	switch (kode) { 
	case 0:
		navn= "Vejkode";
		break;
	case 1:
		navn= "Vejnavn";
		break;
	case 2:
		navn= "Matrikel";
		break;
	case 4:
		navn= "Ejendomsnummer";
		break;
	case 5:
		navn= "BFE";
		break;
	case 6:
		navn= "Kviksøgning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getRensningspaabud(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Rensning ok. Intet påbud";
		break;
	case 2:
		navn= "Rensning skal forbedres til SOP";
		break;
	case 3:
		navn= "Rensning skal forbedres til SO";
		break;
	case 4:
		navn= "Rensning skal forbedres til OP";
		break;
	case 5:
		navn= "Rensning skal forbedres til O";
		break;
	case 6:
		navn= "Skal tilsluttes spildevandsforsyningsselskab";
		break;
	case 7:
		navn= "Skal tilsluttes separatkloakering";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSagsniveau(kode) {
	switch (kode) { 
	case 1:
		navn= "Grund";
		break;
	case 2:
		navn= "Bygning";
		break;
	case 3:
		navn= "TekniskAnlaeg";
		break;
	case 4:
		navn= "Etage";
		break;
	case 5:
		navn= "Opgang";
		break;
	case 6:
		navn= "Enhed";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSagstype(kode) {
	switch (kode) { 
	case 0:
		navn= "Sag på grund";
		break;
	case 1:
		navn= "Nybyggeri";
		break;
	case 2:
		navn= "Til/ombygning";
		break;
	case 31:
		navn= "Nedrivning (delvis)";
		break;
	case 32:
		navn= "Nedrivning (hel)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSikkerhedsklassifikation(kode) {
	switch (kode) { 
	case 0:
		navn= "Er ikke omfattet af sikkerhedshensyn, jfr. afsnit 7";
		break;
	case 1:
		navn= "Er beskyttet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSloejfning(kode) {
	switch (kode) { 
	case 1:
		navn= "Tanken er afblændet";
		break;
	case 2:
		navn= "Tanken er tømt og afblændet";
		break;
	case 3:
		navn= "Tanken er tømt, afblændet og opfyldt";
		break;
	case 4:
		navn= "Tanken er tømt, afblændet og påfyldningsstuds samt udluftningsrør afmonteret";
		break;
	case 10:
		navn= "Jordvarmeslangerne er sløjfet/taget ud af drift";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getStandardSoegniveau(kode) {
	switch (kode) { 
	case 0:
		navn= "Alle";
		break;
	case 1:
		navn= "Grund";
		break;
	case 2:
		navn= "Bygning";
		break;
	case 3:
		navn= "Enhed";
		break;
	case 4:
		navn= "Teknisk Anlæg";
		break;
	case 5:
		navn= "Byggesag";
		break;
	case 6:
		navn= "Ejendom";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getStartside(kode) {
	switch (kode) { 
	case 0:
		navn= "Bygning & bolig";
		break;
	case 1:
		navn= "Indbakke";
		break;
	case 2:
		navn= "Hændelseslog";
		break;
	case 3:
		navn= "Rapport";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getStoerrelsesklasse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Under 6.000 l";
		break;
	case 2:
		navn= "6.000 l - 100.000 l";
		break;
	case 3:
		navn= "Over 100.000 l";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSupplerendeAnvendelseskode(kode) {
	switch (kode) { 
	case 210:
		navn= "Bygning til erhvervsmæssig produktion vedrørende landbrug, gartneri, råstofudvinding o. lign ";
		break;
	case 220:
		navn= "Bygning til erhvervsmæssig produktion vedrørende industri, håndværk m.v.";
		break;
	case 230:
		navn= "El-, gas-, vand- eller varmeværk, forbrændingsanstalt m.v.";
		break;
	case 290:
		navn= "Anden bygning til landbrug, industri etc.";
		break;
	case 310:
		navn= "Transport- og garageanlæg (fragtmandshal, lufthavnsbygning, banegårdsbygning, parkeringshus). Garage med plads til et eller to køretøjer registreres med anvendelseskode 910 ";
		break;
	case 320:
		navn= "Bygning til kontor, handel, lager, herunder offentlig administration";
		break;
	case 330:
		navn= "Bygning til hotel, restaurant, vaskeri, frisør og anden servicevirksomhed";
		break;
	case 390:
		navn= "Anden bygning til transport, handel etc";
		break;
	case 410:
		navn= "Bygning til biograf, teater, erhvervsmæssig udstilling, bibliotek, museum, kirke o. lign. ";
		break;
	case 420:
		navn= "Bygning til undervisning og forskning.";
		break;
	case 430:
		navn= "Bygning til hospital, sygehjem, fødeklinik o. lign.";
		break;
	case 440:
		navn= "Bygning til daginstitution";
		break;
	case 490:
		navn= "Bygning til anden institution, herunder kaserne, fængsel o. lign.";
		break;
	case 520:
		navn= "Bygning til ferieformål m.v., bortset fra sommerhus (feriekoloni, vandrehjem o. lign.)";
		break;
	case 530:
		navn= "Bygning i forbindelse med idrætsudøvelse (klubhus, idrætshal, svømmehal o. lign.)";
		break;
	case 590:
		navn= "Anden bygning til fritidsformål";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSupplerendeIndvendigKorrosionsbeskyttelse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Glasfiberbelægning";
		break;
	case 2:
		navn= "Organisk belægning";
		break;
	case 3:
		navn= "Anoder";
		break;
	case 4:
		navn= "zinkstøvmaling";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSupplerendeOplysningerOmKoordinatsaet(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 11:
		navn= "Koordinatsæt ligger i bygningen/anlægget (over jorden)";
		break;
	case 12:
		navn= "Koordinatsæt ligger i bygningen/anlægget (under jorden)";
		break;
	case 21:
		navn= "Koordinatsæt ligger i bygningen/anlægget (over jorden)";
		break;
	case 22:
		navn= "Koordinatsæt ligger i bygningen/anlægget (under jorden)";
		break;
	case 31:
		navn= "Koordinatsæt ligger på matriklen";
		break;
	case 32:
		navn= "Ukendt";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getSupplerendeVarme(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Varmepumpeanlæg";
		break;
	case 2:
		navn= "Ovne til fast brændsel (brændeovn o. lign.)";
		break;
	case 3:
		navn= "Ovne til flydende brændsel";
		break;
	case 4:
		navn= "Solpaneler";
		break;
	case 5:
		navn= "Pejs";
		break;
	case 6:
		navn= "Gasradiator";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 10:
		navn= "Biogasanlæg";
		break;
	case 80:
		navn= "Andet";
		break;
	case 90:
		navn= "Bygningen har ingen supplerende varme";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTagdaekningsmateriale(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Built-up";
		break;
	case 2:
		navn= "Tagpap (med taghældning)";
		break;
	case 3:
		navn= "Fibercement, herunder asbest (bølge- eller skifer-eternit)";
		break;
	case 4:
		navn= "Cementsten";
		break;
	case 5:
		navn= "Tegl";
		break;
	case 6:
		navn= "Metalplader (bølgeblik, aluminium, o.lign.)";
		break;
	case 7:
		navn= "Stråtag";
		break;
	case 10:
		navn= "Fibercement (asbestfri)";
		break;
	case 11:
		navn= "PVC";
		break;
	case 12:
		navn= "Glas";
		break;
	case 20:
		navn= "Grønne tage";
		break;
	case 80:
		navn= "Ingen";
		break;
	case 90:
		navn= "Andet materiale";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTekniskAnlaegBygningSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Teknisk anlægs nummer";
		break;
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Postnummer";
		break;
	case 5:
		navn= "Postdistrikt";
		break;
	case 6:
		navn= "Klassifikation (samt som klartekst i tool tip)";
		break;
	case 9:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTekniskAnlaegEnhedSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Teknisk anlægs nummer";
		break;
	case 1:
		navn= "Klassifikation (samt som klartekst i tool tip)";
		break;
	case 4:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTekniskAnlaegMatrikelSortering(kode) {
	switch (kode) { 
	case 0:
		navn= "Teknisk anlægs nummer";
		break;
	case 1:
		navn= "Vejkode";
		break;
	case 2:
		navn= "Vejnavn";
		break;
	case 3:
		navn= "Husnummer";
		break;
	case 4:
		navn= "Postnummer";
		break;
	case 5:
		navn= "Postdistrikt";
		break;
	case 6:
		navn= "Klassifikation (samt som klartekst i tool tip)";
		break;
	case 9:
		navn= "Sagsnummer";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTilladelsesart(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Upersonlig tilladelse uden tidsbegrænsning";
		break;
	case 2:
		navn= "Personlig tilladelse uden tidsbegrænsning";
		break;
	case 3:
		navn= "Upersonlig tilladelse med tidsbegrænsing";
		break;
	case 4:
		navn= "Personlig tilladelse med tidsbegrænsing";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTilladelseTilAlternativBortskaffelseEllerAfledning(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Tilladelse meddelt";
		break;
	case 2:
		navn= "Tilladelse bortfaldet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTilladelseTilUdtraeden(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Tilladelse meddelt";
		break;
	case 2:
		navn= "Tilladelse bortfaldet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getToiletforhold(kode) {
	let navn= '';
	switch (kode) { 
	case "A":
		navn= "Vandskyllende toilet udenfor enheden";
		break;
	case "B":
		navn= "Anden type toilet udenfor enheden eller intet toilet i forbindelse med enheden";
		break;
	case "T":
		navn= "Vandskyllende toiletter i bolig- eller erhvervsenheden";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getTypeAfVaegge(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Enkeltvægget";
		break;
	case 2:
		navn= "Dobbeltvægget";
		break;
	case 3:
		navn= "Dobbeltvægget med overvågning";
		break;
	case 4:
		navn= "Overjordisk anlæg, hele anlægget er tilgængeligt for udvendig visuel inspektion";
		break;
	case 5:
		navn= "Tanke som er installeret før 1970, udvendig korrosionsbeskyttet bitumenbelægning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getUdledningstilladelse(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 0:
		navn= "Ikke oplyst";
		break;
	case 1:
		navn= "Udledningstilladelse mangler";
		break;
	case 2:
		navn= "Renseanlæg etableret før 1974, derfor ikke behov for tilladelse";
		break;
	case 3:
		navn= "Udledningstilladelse til enkeltprivat renseanlæg";
		break;
	case 4:
		navn= "Udledningstilladelse til fællesprivat renseanlæg";
		break;
	case 5:
		navn= "Der foreligger ingen kendt tilladelse";
		break;
	case 6:
		navn= "Der foreligger tilladelse";
		break;
	case 7:
		navn= "Tilladelsesforhold er oplyst på bygningsniveau";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getUdlejningsforhold(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Udlejet";
		break;
	case 2:
		navn= "Benyttet af ejeren";
		break;
	case 3:
		navn= "Ikke benyttet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getUdskrivningsmatrikel(kode) {
	switch (kode) { 
	case "J":
		navn= "Ja";
		break;
	case "M":
		navn= "Midlertidig";
		break;
	case "N":
		navn= "Nej";
		break;
	case "X":
		navn= "Slettet";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getVandforsyning(kode) {
	switch (kode) { 
	case 1:
		navn= "Alment vandforsyningsanlæg (tidligere offentligt)";
		break;
	case 2:
		navn= "Privat, alment vandforsyningsanlæg";
		break;
	case 3:
		navn= "Enkeltindvindingsanlæg (egen boring til 1 eller 2 ejendomme)";
		break;
	case 4:
		navn= "Brønd";
		break;
	case 6:
		navn= "Ikke alment vandforsyningsanlæg (forsyner < 10 ejendomme)";
		break;
	case 7:
		navn= "Blandet vandforsyning";
		break;
	case 9:
		navn= "Ingen vandforsyning";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getVarmeinstallation(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Fjernvarme/blokvarme (radiatorsystemer el. varmluftanlæg)";
		break;
	case 2:
		navn= "Centralvarme fra eget anlæg, et-kammer fyr";
		break;
	case 3:
		navn= "Ovne (kakkelovne, kamin, brændeovne o.l.)";
		break;
	case 5:
		navn= "Varmepumpe";
		break;
	case 6:
		navn= "Centralvarme med to fyringsenheder (fast og olie eller gas)";
		break;
	case 7:
		navn= "Elovne, elpaneler";
		break;
	case 8:
		navn= "Gasradiator";
		break;
	case 9:
		navn= "Ingen varmeinstallation";
		break;
	case 99:
		navn= "Blandet (Kræver specifikation på enhedsniveau)";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}

function getYdervaeggenesMateriale(kode) {
	let navn= '';
	kode= parseInt(kode);
	switch (kode) { 
	case 1:
		navn= "Mursten (tegl, kalksten, cementsten)";
		break;
	case 2:
		navn= "Letbeton (lette bloksten, gasbeton)";
		break;
	case 3:
		navn= "Plader af fibercement, herunder asbest (eternit el. lign.)";
		break;
	case 4:
		navn= "Bindingsværk (med udvendigt synligt træværk)";
		break;
	case 5:
		navn= "Træbeklædning";
		break;
	case 6:
		navn= "Betonelementer (etagehøje betonelementer)";
		break;
	case 8:
		navn= "Metalplader";
		break;
	case 10:
		navn= "Plader af fibercement (asbestfri)";
		break;
	case 11:
		navn= "PVC";
		break;
	case 12:
		navn= "Glas";
		break;
	case 80:
		navn= "Ingen";
		break;
	case 90:
		navn= "Andet materiale";
		break;
	default:
		navn= "Ukendt kode";
	}
	return navn;
}


/***/ })
/******/ ]);
"use strict";

var util = require('dawa-util')
    , URL = require('url-parse')
    , queryString = require('query-string')
    , dom = require('incremental-dom');


var eo = dom.elementOpen,
    ec = dom.elementClose,
    ev = dom.elementVoid,
    text = dom.text;

const tableclasses= 'table table-borderless table-hover';

var visSide= function(container, url) {

  let query= queryString.parse(url.query);

  let miljø= query.m;
  if (!miljø) miljø= 'dawa';
  url.host= url.host.replace('info',miljø);
  let arr= url.pathname.split('/');
  let ressource= arr[1];

  query.format= 'json';
  delete query.struktur;
  url.set('query',queryString.stringify(query));

  let urltext= url.toString();

  fetch(urltext).then( function(response) {
    response.json().then( function ( data ) {
      visInfo(container, ressource, data);
    });
  });
}

function danLabel2(overskrift, href, label) {
  let tekst= "";
  if (overskrift) {
    tekst= overskrift + "<br/>" + label;
  } 
  else {
    tekst= "<a target='_blank' href='" + href + "'>" + label + "</a>";
  }
  return tekst;
}

function visData(data, flere, en) {  
  if (Array.isArray(data) && data.length !== 1) {      
    dom.patch(container, flere(data)); 
  } 
  else if (Array.isArray(data) && data.length === 1) {      
    dom.patch(container, en(data[0])); 
  }
  else {
    dom.patch(container, en(data)); 
  }
}

function visInfo(container, ressource, data) {
  let label= "";
  switch (ressource) {
  case 'adresser':
    visData(data, visAdresser, visAdresse);
    break;
  case 'adgangsadresser':
    visData(data, visAdgangsadresser, visAdgangsadresse);
    break;    
  case 'navngivneveje':    
    visData(data, visNavngivneveje, visNavngivnevej);
    break;     
  case 'ejerlav': 
    visData(data, visEjerlav, visEjerlavet);
    break;
  case 'jordstykker':
    visData(data, visJordstykker, visJordstykke);
    break;
  case 'sogne':
  case 'politikredse':
  case 'retskredse':
  case 'regioner':
  case 'kommuner':
    label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" +feature.properties.kode + ")");
    layer.bindPopup(label); 
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label); 
    break;
  case 'afstemningsomraader': 
    label= danLabel2(overskrift, feature.properties.href, feature.properties.navn);
    layer.bindPopup(label); 
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
    map.createPane("locationMarker");
    map.getPane("locationMarker").style.zIndex = 500;
    var marker= L.circleMarker(L.latLng(feature.properties.afstemningssted.adgangsadresse.koordinater[1], feature.properties.afstemningssted.adgangsadresse.koordinater[0]),{color: 'red', fill: true, fillcolor: 'red', fillOpacity: 1.0, radius: 3,  pane: "locationMarker" }).addTo(map);      
    marker.bindPopup(danLabel2(overskrift, feature.properties.afstemningssted.adgangsadresse.href, feature.properties.afstemningssted.navn + "<br/>" + feature.properties.afstemningssted.adgangsadresse.adressebetegnelse.replace(',','<br/>'))); 
    break;
  case 'menighedsraadsafstemningsomraader':
    label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" +feature.properties.nummer + ")");
    layer.bindPopup(label); 
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
    break;      
  case 'opstillingskredse':
  case 'storkredse':
    label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" +feature.properties.nummer + ")");
    layer.bindPopup(label); 
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
    break; 
  case 'valglandsdele':
    label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" +feature.properties.bogstav + ")");
    layer.bindPopup(label); 
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label); 
    break;      
  case 'supplerendebynavne2': 
    label= danLabel2(overskrift, feature.properties.href, feature.properties.navn);
    layer.bindPopup(label); 
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
    break;    
  case 'postnumre': 
    label= danLabel2(overskrift, feature.properties.href, feature.properties.nr + " " + feature.properties.navn); 
    layer.bindPopup(label); 
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
    break;
  case 'stednavne':
    label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + '<br/>(' +  feature.properties.hovedtype  + ', ' + feature.properties.undertype + ")");  
    layer.bindPopup(label);
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label); 
    break;    
  case 'stednavne2':
    label= danLabel2(overskrift, feature.properties.sted.href, feature.properties.navn + '<br>(' +  feature.properties.sted.hovedtype  + ', ' + feature.properties.sted.undertype + ")");  
    layer.bindPopup(label);    
    visVisueltCenter(feature.properties.sted.visueltcenter[0], feature.properties.sted.visueltcenter[1], 1);
    showPopup(vispopup, feature.properties.sted.visueltcenter[0], feature.properties.sted.visueltcenter[1], label);  
    break;      
  case 'steder':
    label= danLabel2(overskrift, feature.properties.href, feature.properties.primærtnavn + '<br>(' +  feature.properties.hovedtype  + ', ' + feature.properties.undertype + ")");  
    layer.bindPopup(label);    
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);  
    break; 
  case 'vejstykker':    
    layer.bindPopup(danLabel2(overskrift, feature.properties.href, feature.properties.kode + " " + feature.properties.navn)); 
    break;
  default:       
    if (feature.properties.visueltcenter_x && feature.properties.visueltcenter_y) {      
      visVisueltCenter(feature.properties.visueltcenter_x, feature.properties.visueltcenter_y); 
    }      
    if (feature.properties.visueltcenter) {      
      visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1]); 
    }
  }
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

function badge(tekst, type, url) {
  eo('td');
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
  ec('td');
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function strong(value){
  return '<strong>' + value + '</strong>';
}

function visKodeNavn(navn, ref) { 
  eo('tr');
    eo('td');
      html(navn + ': ' + strong(ref.kode + " " + ref.navn));
    ec('td');
    badge('info', 'badge-primary', ref.href.replace('dawa.aws.dk',host));
    badge('kort', 'badge-primary', ref.href.replace('dawa','vis'));
    badge('data', 'badge-primary', ref.href);
  ec('tr');
}

function visAdresseKort(adresse) {  
  eo('tr');
    eo('td');
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

function visOverskrift(overskrift) {    
  eo('tr');
    eo('td');
      html(strong(overskrift));
    ec('td');          
    eo('td');ec('td');
    badge('kort', 'badge-primary', url.href.replace('dawa','vis'));
    badge('data', 'badge-primary', url.href);
  ec('tr'); 
}

function visAdresser(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses);
      visOverskrift('Adresser');
      eo('tbody');
        data.forEach(visAdresseKort);
      ec('tbody');
    ec('table');
  }
}


function visAdresse(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses);
      eo('tbody');
        eo('tr');
          eo('td'); 
            eo('span', null, null,
              'class', 'badge badge-pill '+statusFarve(data.status));
              text(statusTekst(data.status));
            ec('span');
            html('<br/><strong>' + util.formatHelAdresse(data, false) + '</strong>');
          ec('td');
          eo('td');
          ec('td'); 
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.href);
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
            html('Id: ' + strong(data.id));
          ec('td');
        ec('tr');  
        eo('tr');
          eo('td');
            html('Adgangsadresse: ' + strong(util.formatAdgangsadresse(data.adgangsadresse, true)));
          ec('td');
          badge('info', 'badge-primary', data.adgangsadresse.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.adgangsadresse.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.adgangsadresse.href);
        ec('tr'); 
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

function visAdgangsadresser(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses);
      visOverskrift('Adgangsadresser');
      eo('tbody');
        data.forEach(visAdgangsadresseKort);
      ec('tbody');
    ec('table');
  }
}

function visAdgangsadresse(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      eo('tbody');
        eo('tr');
          eo('td'); 
            eo('span', null, null,
              'class', 'badge badge-pill '+statusFarve(data.status));
              text(statusTekst(data.status));
            ec('span');
            html('<br/><strong>' + util.formatAdgangsadresse(data, false) + '</strong>');
          ec('td');
          badge('adresser', 'badge-primary', origin + "/adresser?adgangsadresseid=" + data.id);
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.href);
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
            html('Id: ' + strong(data.id));
          ec('td');
        ec('tr');  
        eo('tr');
          eo('td');
            html('Navngiven vej: ' + strong(data.vejstykke.navn));
          ec('td');
          badge('info', 'badge-primary', data.navngivenvej.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.navngivenvej.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.navngivenvej.href);
        ec('tr'); 
        eo('tr');
          eo('td');
            html('Vejstykke: ' + strong(data.vejstykke.kode + " " + data.vejstykke.navn));
          ec('td');
          badge('info', 'badge-primary', data.vejstykke.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.vejstykke.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.vejstykke.href);
        ec('tr');
        if (data.supplerendebynavn2) { 
          eo('tr');
            eo('td');
              html('Supplerende bynavn: ' + strong(data.supplerendebynavn));
            ec('td');
            badge('info', 'badge-primary', data.supplerendebynavn2.href.replace('dawa.aws.dk',host));
            badge('kort', 'badge-primary', data.supplerendebynavn2.href.replace('dawa','vis'));
            badge('data', 'badge-primary', data.supplerendebynavn2.href);
          ec('tr');
        }
        eo('tr');
          eo('td');
            html('Postnummer: ' + strong(data.postnummer.nr + " " + data.postnummer.navn));
          ec('td');
          badge('info', 'badge-primary', data.postnummer.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.postnummer.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.postnummer.href);
        ec('tr');
        if (data.stormodtagerpostnummer) {
          eo('tr');
            eo('td');
              html('Stormodtagerpostnummer: ' + strong(data.stormodtagerpostnummer.nr + " " + data.stormodtagerpostnummer.navn));
            ec('td');
            badge('info', 'badge-primary', data.stormodtagerpostnummer.href.replace('dawa','info'));
            eo('td');
            ec('td');
           // badge('kort', 'badge-primary', data.stormodtagerpostnummer.href.replace('dawa','vis'));
            badge('data', 'badge-primary', data.stormodtagerpostnummer.href);
          ec('tr');
        }
        visKodeNavn('Kommune', data.kommune);
        visKodeNavn('Sogn', data.sogn);
        visKodeNavn('Region', data.region);
        visKodeNavn('Retskreds', data.retskreds);
        visKodeNavn('Politikreds', data.politikreds);
        eo('tr');
          eo('td');
            html('Afstemningsområde: ' + strong(data.afstemningsområde.nummer + " " + data.afstemningsområde.navn));
          ec('td');
          badge('info', 'badge-primary', data.afstemningsområde.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.afstemningsområde.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.afstemningsområde.href);
        ec('tr');
        visKodeNavn('Opstillingskreds', data.opstillingskreds);
        eo('tr');
          eo('td');
            html('Jordstykke: ' + strong(data.jordstykke.matrikelnr + " " + data.jordstykke.ejerlav.navn));
          ec('td');
          badge('info', 'badge-primary', data.jordstykke.href.replace('dawa.aws.dk',host));
          badge('kort', 'badge-primary', data.jordstykke.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.jordstykke.href);
        ec('tr');
        visKodeNavn('Ejerlav', data.jordstykke.ejerlav);
        if (data.bebyggelser) {
          data.bebyggelser.forEach(bebyggelse => {          
            eo('tr');
              eo('td');
                html(capitalizeFirstLetter(bebyggelse.type) + ': ' + strong(bebyggelse.navn));
              ec('td');
              badge('info', 'badge-primary', bebyggelse.href.replace('dawa.aws.dk',host));
              badge('kort', 'badge-primary', bebyggelse.href.replace('dawa','vis'));
              badge('data', 'badge-primary', bebyggelse.href);
            ec('tr');
          })
        }       
        eo('tr');
          eo('td');
            html('Zone: ' + strong(data.zone));
          ec('td');
        ec('tr');         
        eo('tr');
          eo('td');
            html('Brofast: ' + strong(data.brofast?"Ja":"Nej"));
          ec('td');
        ec('tr');          
        eo('tr');
          eo('td');
            html('Højde (m.o.h.): ' + strong(data.adgangspunkt.højde));
          ec('td');
        ec('tr');  
      ec('tbody'); 
    ec('table');
  }
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

function visNavngivneveje(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses);
      visOverskrift('Navngivne veje');
      eo('tbody');
        data.forEach(visNavngivnevejKort);
      ec('tbody');
    ec('table');
  }
}

function visNavngivnevej(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      eo('tbody');
        eo('tr');
          eo('td'); 
            eo('span', null, null,
              'class', 'badge badge-pill '+darstatusFarve(data.darstatus));
              text(data.darstatus);
            ec('span');
            html('<br/>' + strong(data.navn + ' (' + data.administrerendekommune.kode + ' ' +  data.administrerendekommune.navn + ')'));
          ec('td');
          eo('td');
          ec('td');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.href);
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
            html('Id: ' + strong(data.id));
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
        eo('tr');
          eo('td');
            html('Beliggenhedens oprindelse: ');
          ec('td');
        ec('tr');          
        eo('tr');
          eo('td', null, null, 'style', 'padding-left:2em ');
            html('Kilde: ' + strong(data.beliggenhed.oprindelse.kilde));
          ec('td');
        ec('tr');         
        eo('tr');
          eo('td', null, null, 'style', 'padding-left:2em ');
            html('Teknisk standard: ' + strong(data.beliggenhed.oprindelse.tekniskstandard));
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
            html('Nøjagtighedsklasse: ' + strong(data.beliggenhed.oprindelse.nøjagtighedsklasse));
          ec('td');
        ec('tr');       
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

function visEjerlav(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses);
      visOverskrift('Ejerlav');
      eo('tbody');
        data.forEach(visEjerlavetKort);
      ec('tbody');
    ec('table');
  }
}

function visEjerlavet(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      eo('tbody'); 
        eo('tr');
          eo('td');
            html(strong(data.kode + ' ' +data.navn));
          ec('td');
          eo('td'); ec('td');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.href);
        ec('tr');
        visKodeNavn('Ejerlav', data.jordstykke.ejerlav);
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

function visJordstykker(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses);
      visOverskrift('Jordstykker');
      eo('tbody');
        data.forEach(visJordstykkeKort);
      ec('tbody');
    ec('table');
  }
}

function visJordstykke(data) {
  return function() {
    eo('table',null,null,
      'class', tableclasses); //table-striped'); //) table-dark');
      eo('tbody'); 
        eo('tr');
          eo('td');
            html(strong(data.matrikelnr + ' ' + data.ejerlav.navn));
          ec('td');
          eo('td'); ec('td');
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.href);
        ec('tr'); 
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

let url= new URL(window.location.href);
let host= url.host;
let origin= url.origin;
if (url.hostname === 'localhost') {
  url.set('host','info.aws.dk:80'); 
}
const container = document.getElementById('side');
visSide(container, url);
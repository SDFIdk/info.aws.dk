"use strict";

var util = require('dawa-util')
    , URL = require('url-parse')
    , queryString = require('query-string')
    , dom = require('incremental-dom');


var eo = dom.elementOpen,
    ec = dom.elementClose,
    ev = dom.elementVoid,
    text = dom.text;

var visSide= function(container, url) {

  if (url.hostname === 'localhost') {
    url.set('host','info.aws.dk:80'); 
  }

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

function visInfo(container, ressource, data) {
  let label= "";
  switch (ressource) {
  case 'adresser':
    if (Array.isArray(data)) {      
      dom.patch(container, visAdresser(data)); 
    }
    else {
      dom.patch(container, visAdresse(data)); 
    }
    break;
  case 'adgangsadresser':
    if (Array.isArray(data)) {      
      dom.patch(container, visAdgangsadresser(data)); 
    }
    else {
      dom.patch(container, visAdgangsadresse(data)); 
    }    
    break;      
  case 'ejerlav':
    label= danLabel2(overskrift, feature.properties.href, feature.properties.navn + " (" + feature.properties.kode + ")");
    layer.bindPopup(label);
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1); 
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
    break;
  case 'jordstykker':
    let kode= feature.properties.ejerlav.kode;
    let navn= feature.properties.ejerlav.navn;
    let nr= feature.properties.matrikelnr;
    label= danLabel2(overskrift, feature.properties.href, nr + " " + navn + " (" + kode + ")");
    layer.bindPopup(label);
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 1);
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label); 
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
  case 'navngivneveje':
    label= danLabel2(overskrift, feature.properties.href, feature.properties.navn);   
    layer.bindPopup(label);
    visVisueltCenter(feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], 3); 
    showPopup(vispopup, feature.properties.visueltcenter[0], feature.properties.visueltcenter[1], label);
    if (feature.properties.beliggenhed.vejtilslutningspunkter) {
      let punkter= feature.properties.beliggenhed.vejtilslutningspunkter.coordinates;
      for (var i= 0; i<punkter.length;i++) {
         var marker= L.circleMarker(L.latLng(punkter[i][1], punkter[i][0]), {color: 'blue', fillColor: 'blue', stroke: true, fillOpacity: 1.0, radius: 4, weight: 2, opacity: 1.0}).addTo(map);
      }
    }
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

function visKodeNavn(navn, ref) { 
  eo('tr');
    eo('td');
      html(navn + ': ' + ref.kode + " " + ref.navn);
    ec('td');
    badge('info', 'badge-primary', ref.href.replace('dawa','info'));
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
    badge('info', 'badge-primary', adresse.href.replace('dawa','info'));
    badge('kort', 'badge-primary', adresse.href.replace('dawa','vis'));
    badge('data', 'badge-primary', adresse.href);
  ec('tr');
}

function visAdresser(data) {
  return function() {
    eo('table',null,null,
      'class', 'table table-striped table-dark');
      eo('tbody');
        data.forEach(visAdresseKort);
      ec('tbody');
    ec('table');
  }
}


function visAdresse(data) {
  return function() {
    eo('table',null,null,
      'class', 'table table-striped table-dark');
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
            html('Oprettet d. ' + oprettet.toLocaleString());
          ec('td');
        ec('tr');  
        eo('tr');
          let ændret= new Date(data.historik.ændret);
          eo('td');
            html('Ændret d. ' + ændret.toLocaleString());
          ec('td');
        ec('tr'); 
        eo('tr');
          eo('td');
            html('Adgangsadresse: ' + util.formatAdgangsadresse(data.adgangsadresse, true));
          ec('td');
          badge('info', 'badge-primary', data.adgangsadresse.href.replace('dawa','info'));
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
    badge('info', 'badge-primary', adgangsadresse.href.replace('dawa','info'));
    badge('kort', 'badge-primary', adgangsadresse.href.replace('dawa','vis'));
    badge('data', 'badge-primary', adgangsadresse.href);
  ec('tr');
}

function visAdgangsadresser(data) {
  return function() {
    eo('table',null,null,
      'class', 'table table-striped table-dark');
      eo('tbody');
        data.forEach(visAdgangsadresseKort);
      ec('tbody');
    ec('table');
  }
}

function visAdgangsadresse(data) {
  return function() {
    eo('table',null,null,
      'class', 'table table-striped table-dark');
      eo('tbody');
        eo('tr');
          eo('td'); 
            eo('span', null, null,
              'class', 'badge badge-pill '+statusFarve(data.status));
              text(statusTekst(data.status));
            ec('span');
            html('<br/><strong>' + util.formatAdgangsadresse(data, false) + '</strong>');
          ec('td');
          badge('adresser', 'badge-danger',"https://info.aws.dk/adresser?adgangsadresseid=" + data.id);
          badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.href);
        ec('tr'); 
        eo('tr');
          let oprettet= new Date(data.historik.oprettet);
          eo('td');
            html('Oprettet d. ' + oprettet.toLocaleString());
          ec('td');
        ec('tr');  
        eo('tr');
          let ændret= new Date(data.historik.ændret);
          eo('td');
            html('Ændret d. ' + ændret.toLocaleString());
          ec('td');
        ec('tr'); 
        eo('tr');
          eo('td');
            html('Navngiven vej: ' + data.vejstykke.navn);
          ec('td');
          badge('info', 'badge-primary', data.navngivenvej.href.replace('dawa','info'));
          badge('kort', 'badge-primary', data.navngivenvej.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.navngivenvej.href);
        ec('tr'); 
        eo('tr');
          eo('td');
            html('Vejstykke: ' + data.vejstykke.kode + " " + data.vejstykke.navn);
          ec('td');
          badge('info', 'badge-primary', data.vejstykke.href.replace('dawa','info'));
          badge('kort', 'badge-primary', data.vejstykke.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.vejstykke.href);
        ec('tr');
        if (data.supplerendebynavn2) { 
          eo('tr');
            eo('td');
              html('Supplerende bynavn: ' + data.supplerendebynavn);
            ec('td');
            badge('info', 'badge-primary', data.supplerendebynavn2.href.replace('dawa','info'));
            badge('kort', 'badge-primary', data.supplerendebynavn2.href.replace('dawa','vis'));
            badge('data', 'badge-primary', data.supplerendebynavn2.href);
          ec('tr');
        }
        eo('tr');
          eo('td');
            html('Postnummer: ' + data.postnummer.nr + " " + data.postnummer.navn);
          ec('td');
          badge('info', 'badge-primary', data.postnummer.href.replace('dawa','info'));
          badge('kort', 'badge-primary', data.postnummer.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.postnummer.href);
        ec('tr');
        if (data.stormodtagerpostnummer) {
          eo('tr');
            eo('td');
              html('Stormodtagerpostnummer: ' + data.stormodtagerpostnummer.nr + " " + data.stormodtagerpostnummer.navn);
            ec('td');
            badge('info', 'badge-primary', data.stormodtagerpostnummer.href.replace('dawa','info'));
            eo('td');
            ec('td');
           // badge('kort', 'badge-primary', data.stormodtagerpostnummer.href.replace('dawa','vis'));
            badge('data', 'badge-primary', data.stormodtagerpostnummer.href);
          ec('tr');
        }
        eo('tr');
          eo('td');
            html('Adresser');
          ec('td');
          badge('info', 'badge-primary', "https://info.aws.dk/adresser?adgangsadresseid=" + data.id);
          badge('info', 'badge-primary', "https://vis.aws.dk/adresser?adgangsadresseid=" + data.id);
          badge('info', 'badge-primary', "https://dawa.aws.dk/adresser?adgangsadresseid=" + data.id);
        ec('tr');
        visKodeNavn('Kommune', data.kommune);
        visKodeNavn('Sogn', data.sogn);
        visKodeNavn('Region', data.region);
        visKodeNavn('Retskreds', data.retskreds);
        visKodeNavn('Politikreds', data.politikreds);
        eo('tr');
          eo('td');
            html('Afstemningsområde: ' + data.afstemningsområde.nummer + " " + data.afstemningsområde.navn);
          ec('td');
          badge('info', 'badge-primary', data.afstemningsområde.href.replace('dawa','info'));
          badge('kort', 'badge-primary', data.afstemningsområde.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.afstemningsområde.href);
        ec('tr');
        visKodeNavn('Opstillingskreds', data.opstillingskreds);
        eo('tr');
          eo('td');
            html('Jordstykke: ' + data.jordstykke.matrikelnr + " " + data.jordstykke.ejerlav.navn);
          ec('td');
          badge('info', 'badge-primary', data.jordstykke.href.replace('dawa','info'));
          badge('kort', 'badge-primary', data.jordstykke.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.jordstykke.href);
        ec('tr');
        visKodeNavn('Ejerlav', data.jordstykke.ejerlav);
        if (data.bebyggelser) {
          data.bebyggelser.forEach(bebyggelse => {          
            eo('tr');
              eo('td');
                html(capitalizeFirstLetter(bebyggelse.type) + ': ' + bebyggelse.navn);
              ec('td');
              badge('info', 'badge-primary', bebyggelse.href.replace('dawa','info'));
              badge('kort', 'badge-primary', bebyggelse.href.replace('dawa','vis'));
              badge('data', 'badge-primary', bebyggelse.href);
            ec('tr');
          })
        }       
        eo('tr');
          eo('td');
            html('Zone: ' + data.zone);
          ec('td');
        ec('tr');         
        eo('tr');
          eo('td');
            html('Brofast: ' + (data.brofast?"Ja":"Nej"));
          ec('td');
        ec('tr');  
      ec('tbody'); 
    ec('table');
  }
}

let url= new URL(window.location.href);
const container = document.getElementById('side');
visSide(container, url);
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
  case 'adresser':
    label= danLabel2(overskrift, feature.properties.href, feature.properties.adressebetegnelse.replace(',','<br/>'));
    showPopup(vispopup, feature.properties.adgangsadresse.adgangspunkt.koordinater[0], feature.properties.adgangsadresse.adgangspunkt.koordinater[1], label);
    layer.bindPopup(label);
    var marker= L.circleMarker(L.latLng(feature.properties.adgangsadresse.vejpunkt.koordinater[1], feature.properties.adgangsadresse.vejpunkt.koordinater[0]),{color: 'blue', fill: true, fillcolor: 'blue', fillOpacity: 1.0, radius: 2}).addTo(map);      
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
  case 1:
    tekst= 'Foreløbig';
    break;
  case 1:
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
  case 1:
    tekst= 'badge-warning';
    break;
  case 1:
    tekst= 'badge-dark';
    break;
  }
  return tekst;
}

function badge(tekst, type, url) {
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
}

function visBetegnelseKort(betegnelse, status) {  
  eo('li',null,null,
    'class', 'list-group-item d-flex justify-content-between align-items-center');
    html(util.formatAdgangsadresse(adgangsadresse, false));
    badge(statusTekst(adgangsadresse.status), statusFarve(adgangsadresse.status),null);
    badge('info', 'badge-primary', adgangsadresse.href.replace('dawa','info'));
    badge('kort', 'badge-primary', adgangsadresse.href.replace('dawa','vis'));
    badge('data', 'badge-primary', adgangsadresse.href);
  ec('li');
}

function visAdgangsadresseKort(adgangsadresse) {  
  eo('li',null,null,
    'class', 'list-group-item d-flex justify-content-between align-items-center');
    html(util.formatAdgangsadresse(adgangsadresse, false));
    badge(statusTekst(adgangsadresse.status), statusFarve(adgangsadresse.status),null);
    badge('info', 'badge-primary', adgangsadresse.href.replace('dawa','info'));
    badge('kort', 'badge-primary', adgangsadresse.href.replace('dawa','vis'));
    badge('data', 'badge-primary', adgangsadresse.href);
  ec('li');
}

function visAdgangsadresser(data) {
  return function() {
    eo('ul', null, null,
      'class', 'list-group');
    data.forEach(visAdgangsadresseKort);
    ec('ul');
  }
}

function visAdgangsadresse(data) {
  return function() {
    eo('nav',null,null,
      'class', 'navbar navbar-light bg-light');
      eo('span', null, null,
        'class', 'navbar-brand mb-0 h1');
        html(util.formatAdgangsadresse(data, false));
      ec('span');
      badge(statusTekst(data.status), statusFarve(data.status),null);
      badge('kort', 'badge-primary', data.href.replace('dawa','vis'));
      badge('data', 'badge-primary', data.href);
    ec('nav');    
    eo('ul', null, null,
      'class', 'list-group'); 
      eo('li',null,null,
        'class', 'list-group-item d-flex justify-content-between align-items-center');
        let oprettet= new Date(data.historik.oprettet);
        html('Oprettet d. ' + oprettet.toLocaleString());
      ec('li');  
      eo('li',null,null,
        'class', 'list-group-item d-flex justify-content-between align-items-center');
        let ændret= new Date(data.historik.ændret);
        html('Ændret d. ' + ændret.toLocaleString());
      ec('li'); 
      eo('li',null,null,
        'class', 'list-group-item d-flex justify-content-between align-items-center');
        html('Navngiven vej: ' + data.vejstykke.navn);
        badge('info', 'badge-primary', data.navngivenvej.href.replace('dawa','info'));
        badge('kort', 'badge-primary', data.navngivenvej.href.replace('dawa','vis'));
        badge('data', 'badge-primary', data.navngivenvej.href);
      ec('li'); 
      eo('li',null,null,
        'class', 'list-group-item d-flex justify-content-between align-items-center');
        html('Vejstykke: ' + data.vejstykke.kode + " " + data.vejstykke.navn);
        badge('info', 'badge-primary', data.vejstykke.href.replace('dawa','info'));
        badge('kort', 'badge-primary', data.vejstykke.href.replace('dawa','vis'));
        badge('data', 'badge-primary', data.vejstykke.href);
      ec('li');
      if (data.supplerendebynavn2) { 
        eo('li',null,null,
          'class', 'list-group-item d-flex justify-content-between align-items-center');
          html('Supplerende bynavn: ' + data.supplerendebynavn);
          badge('info', 'badge-primary', data.supplerendebynavn2.href.replace('dawa','info'));
          badge('kort', 'badge-primary', data.supplerendebynavn2.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.supplerendebynavn2.href);
        ec('li');
      }
      eo('li',null,null,
        'class', 'list-group-item d-flex justify-content-between align-items-center');
        html('Postnummer: ' + data.postnummer.nr + " " + data.postnummer.navn);
        badge('info', 'badge-primary', data.postnummer.href.replace('dawa','info'));
        badge('kort', 'badge-primary', data.postnummer.href.replace('dawa','vis'));
        badge('data', 'badge-primary', data.postnummer.href);
      ec('li');
      if (data.stormodtagerpostnummer) {
        eo('li',null,null,
          'class', 'list-group-item d-flex justify-content-between align-items-center');
          html('Stormodtagerpostnummer: ' + data.stormodtagerpostnummer.nr + " " + data.stormodtagerpostnummer.navn);
          badge('info', 'badge-primary', data.stormodtagerpostnummer.href.replace('dawa','info'));
          badge('kort', 'badge-primary', data.stormodtagerpostnummer.href.replace('dawa','vis'));
          badge('data', 'badge-primary', data.stormodtagerpostnummer.href);
        ec('li');
      }
    ec('ul');
  }
}

let url= new URL(window.location.href);
const container = document.getElementById('side');
visSide(container, url);
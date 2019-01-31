
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
  //console.log(aArray);
  var bArray = b.husnr.match(reHusnr);
  //console.log(bArray);

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

let a= {husnr: '32', postnummer: {nr:2400}, vejstykke: {navn:'Ålandsvej'}};
let b= {husnr: '32B', postnummer: {nr:2400}, vejstykke: {navn:'Abevej'}};
let c= {husnr: '32Å', postnummer: {nr:2300}, vejstykke: {navn:'Abevej'}};
let d= {husnr: '27B', postnummer: {nr:2400}, vejstykke: {navn:'Zebravej'}};

let ar= [b,a, c, d];
console.log(ar);
ar= ar.sort(adgangsadresseCompare);

console.log(ar);

let x= {etage: 'st', dør: 'a', adgangsadresse: {husnr: '32', postnummer: {nr:2400}, vejstykke: {navn:'Ålandsvej'}}};
let y= {etage: 'st', dør: null, adgangsadresse: {husnr: '32', postnummer: {nr:2400}, vejstykke: {navn:'Ålandsvej'}}};
let z= {etage: 'st', dør: 'th', adgangsadresse: {husnr: '32', postnummer: {nr:2400}, vejstykke: {navn:'Ålandsvej'}}};
let q= {etage: 'st', dør: 'tv', adgangsadresse: {husnr: '32', postnummer: {nr:2400}, vejstykke: {navn:'Ålandsvej'}}};


let ar2= [x,y, z, q];
console.log(ar2);
ar2= ar2.sort(adresseCompare);

console.log(ar2);



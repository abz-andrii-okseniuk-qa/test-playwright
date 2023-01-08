//speedDials
var stringSpeedDialsJson;
var speedDialsJson;

var brand_0 = "";
var brand_1 = "";
var brand_2 = "";
var brand_3 = "";
var brand_4 = "";
var brand_5 = "";
var brand_6 = "";
var brand_7 = "";
var brand_8 = "";
var brand_9 = "";
var brand_10 = "";

var link_0 = "";
var link_1 = "";
var link_2 = "";
var link_3 = "";
var link_4 = "";
var link_5 = "";
var link_6 = "";
var link_7 = "";
var link_8 = "";
var link_9 = "";
var link_10 = "";

var iurl_0 = "";
var iurl_1 = "";
var iurl_2 = "";
var iurl_3 = "";
var iurl_4 = "";
var iurl_5 = "";
var iurl_6 = "";
var iurl_7 = "";
var iurl_8 = "";
var iurl_9 = "";

var UUID = ""; 
var speedDialsXmlhttp = new XMLHttpRequest();

function init()
{
	var speedDialsUrl = "https://tzs54.veve.com/qlapi?&o=tzs54&s=83042&u=comodo.com&f=json&n=10&i=1&is=72x72&subid=25050003&di="+UUID+"&af=0";
	speedDialsXmlhttp.open("POST", speedDialsUrl, false);
	speedDialsXmlhttp.send();
}


function setUUID(UUID){

	chrome.storage.local.set({ "UUID": UUID }, function(){	

});

}

function getUUID() {
	chrome.storage.local.get(/* String or Array */["UUID"], function(items){
    
	UUID = items.UUID;
		
	if(UUID === undefined)
	{
		UUID = create_UUID();
		console.log(UUID);
		setUUID(UUID) ;
	}
	
	init();
	
	});
		
	return UUID;
}


function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function setUrlUUID()
{
	UUID = getUUID();
	
	return UUID;
}
UUID = setUrlUUID();


var speedDialsJsonGlobal;

speedDialsXmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		speedDialsJson = JSON.parse(this.responseText);		
		stringSpeedDialsJson = JSON.stringify(speedDialsJson);
		speedDialsJsonGlobal = speedDialsJson;
		
		if(typeof speedDialsJson.data[0] !== "undefined")
			brand_0 = speedDialsJson.data[0].brand;
		
		if(typeof speedDialsJson.data[1] !== "undefined")
			brand_1 = speedDialsJson.data[1].brand;
		
		if(typeof speedDialsJson.data[2] !== "undefined")
			brand_2 = speedDialsJson.data[2].brand;
		
		if(typeof speedDialsJson.data[3] !== "undefined")		
			brand_3 = speedDialsJson.data[3].brand;
		
		if(typeof speedDialsJson.data[4] !== "undefined")
			brand_4 = speedDialsJson.data[4].brand;
		
		if(typeof speedDialsJson.data[5] !== "undefined")
			brand_5 = speedDialsJson.data[5].brand;
		
		if(typeof speedDialsJson.data[6] !== "undefined")
			brand_6 = speedDialsJson.data[6].brand;
		
		if(typeof speedDialsJson.data[7] !== "undefined")
			brand_7 = speedDialsJson.data[7].brand;
		
		if(typeof speedDialsJson.data[8] !== "undefined")
			brand_8 = speedDialsJson.data[8].brand;
		
		if(typeof speedDialsJson.data[9] !== "undefined")
			brand_9 = speedDialsJson.data[9].brand;

		if(typeof speedDialsJson.data[0] !== "undefined")
			link_0 = speedDialsJson.data[0].rurl;
		
		if(typeof speedDialsJson.data[1] !== "undefined")
			link_1 = speedDialsJson.data[1].rurl;
		
		if(typeof speedDialsJson.data[2] !== "undefined")
			link_2 = speedDialsJson.data[2].rurl;
		
		if(typeof speedDialsJson.data[3] !== "undefined")
			link_3 = speedDialsJson.data[3].rurl;
		
		if(typeof speedDialsJson.data[4] !== "undefined")
			link_4 = speedDialsJson.data[4].rurl;
		
		if(typeof speedDialsJson.data[5] !== "undefined")
			link_5 = speedDialsJson.data[5].rurl;
		
		if(typeof speedDialsJson.data[6] !== "undefined")
			link_6 = speedDialsJson.data[6].rurl;
		
		if(typeof speedDialsJson.data[7] !== "undefined")
			link_7 = speedDialsJson.data[7].rurl;		
		
		if(typeof speedDialsJson.data[8] !== "undefined")
			link_8 = speedDialsJson.data[8].rurl;
		
		if(typeof speedDialsJson.data[9] !== "undefined")
			link_9 = speedDialsJson.data[9].rurl;
		
		if(typeof speedDialsJson.data[0] !== "undefined")
			iurl_0 = speedDialsJson.data[0].iurl;
		
		if(typeof speedDialsJson.data[1] !== "undefined")
			iurl_1 = speedDialsJson.data[1].iurl;
		
		if(typeof speedDialsJson.data[2] !== "undefined")
			iurl_2 = speedDialsJson.data[2].iurl;
		
		if(typeof speedDialsJson.data[3] !== "undefined")
			iurl_3 = speedDialsJson.data[3].iurl;
		
		if(typeof speedDialsJson.data[4] !== "undefined")
			iurl_4 = speedDialsJson.data[4].iurl;
		
		if(typeof speedDialsJson.data[5] !== "undefined")
			iurl_5 = speedDialsJson.data[5].iurl;
		
		if(typeof speedDialsJson.data[6] !== "undefined")
			iurl_6 = speedDialsJson.data[6].iurl;
		
		if(typeof speedDialsJson.data[7] !== "undefined")
			iurl_7 = speedDialsJson.data[7].iurl;
		
		if(typeof speedDialsJson.data[8] !== "undefined")
			iurl_8 = speedDialsJson.data[8].iurl;
		
		if(typeof speedDialsJson.data[9] !== "undefined")
			iurl_9 = speedDialsJson.data[9].iurl;
		
		document.getElementById('brand_0').innerHTML = brand_0;
		document.getElementById('link_0').href = link_0;
		document.getElementById('iurl_0').src = iurl_0;
			
		document.getElementById('brand_1').innerHTML = brand_1;
		document.getElementById('link_1').href = link_1;
		document.getElementById('iurl_1').src = iurl_1;		
		
		document.getElementById('brand_2').innerHTML = brand_2;
		document.getElementById('link_2').href = link_2;
		document.getElementById('iurl_2').src = iurl_2;		
		
		document.getElementById('brand_3').innerHTML = brand_3;
		document.getElementById('link_3').href = link_3;
		document.getElementById('iurl_3').src = iurl_3;		
		
		document.getElementById('brand_4').innerHTML = brand_4;
		document.getElementById('link_4').href = link_4;
		document.getElementById('iurl_4').src = iurl_4;
		
		// second row
		document.getElementById('brand_5').innerHTML = brand_5;
		document.getElementById('link_5').href = link_5;
		document.getElementById('iurl_5').src = iurl_5;
		
		document.getElementById('brand_6').innerHTML = brand_6;
		document.getElementById('link_6').href = link_6;
		document.getElementById('iurl_6').src = iurl_6;		
		
		document.getElementById('brand_7').innerHTML = brand_7;
		document.getElementById('link_7').href = link_7;
		document.getElementById('iurl_7').src = iurl_7;		
		
		document.getElementById('brand_8').innerHTML = brand_8;
		document.getElementById('link_8').href = link_8;
		document.getElementById('iurl_8').src = iurl_8;		
		
		document.getElementById('brand_9').innerHTML = brand_9;
		document.getElementById('link_9').href = link_9;
		document.getElementById('iurl_9').src = iurl_9;	
    }
};

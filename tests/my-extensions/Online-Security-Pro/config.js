var APP_ID = 80;
var APP_VERSION = chrome.runtime.getManifest().version;
var APP_STATUS = true;// extention enabled. Can changed from setting page
var SEND_BROWSED_URL = true;
var LOOKUP_URL = "https://verdict.valkyrie.comodo.com";
var BLOOM_FILTER_URL = "https://download.comodo.com/intelligence/ctrl-06-33-url.version";
var CATEGORIES_URL= "https://cdn.download.comodo.com/av/updatescategories/url_categories.json";
var BACKEND_URL = "https://td.security.comodo.com/log/";
var BACKEND_CONFIG_URL = "https://download.comodo.com/cos/update/config.json";
var BROWSER_NAME;
var BROWSER_VERSION;
var PRODUCT_NAME;
var reg = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;

var browserInfo = navigator.userAgent;
if (browserInfo.indexOf("Dragon") != -1){
	BROWSER_NAME = "Comodo Dragon";
	BROWSER_VERSION = /Dragon\/([0-9.]+)/.exec(browserInfo)[1];
	PRODUCT_NAME = "COS-Dragon"
} else {
	BROWSER_NAME = "Google Chrome";
	BROWSER_VERSION = /Chrome\/([0-9.]+)/.exec(browserInfo)[1];
	PRODUCT_NAME = "COS-Chrome"
}

var GUID = false;
var XApiKey = false;
var NEED_TO_SEND_UPDATE_REQUEST = false;

chrome.storage.local.get(['GUID', 'APP_STATUS'], function(result) {
    APP_STATUS = result.APP_STATUS !== undefined  ? result.APP_STATUS : true;
    if(APP_STATUS){
		chrome.browserAction.setIcon({path: "./assets/icon16.png"});
	}else {
		chrome.browserAction.setIcon({path: "./assets/gray.png"});
	}
    if (result.GUID !== undefined ) {
    	if(result.GUID == false){
    		GUID = createGuid();
    	}else {    		
    		GUID = result.GUID;
    	}
        if (NEED_TO_SEND_UPDATE_REQUEST) {
            NEED_TO_SEND_UPDATE_REQUEST = false;
            APP_VERSION = chrome.runtime.getManifest().version;
            backendNotification.sendInfo(2);
            sendHeartbeat();
        }
    }
});

chrome.storage.local.get(['XApiKey'], function(result) {
    if (result.XApiKey !== undefined ) {
        XApiKey = result.XApiKey;
    }
});
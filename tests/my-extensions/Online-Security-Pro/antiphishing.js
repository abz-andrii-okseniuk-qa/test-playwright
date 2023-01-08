//STUB for whitelist
var antiPhishingWhiteList = (function(){

	function contains(url) {
		if(url.substring(0,6) === "chrome"){
			return false
		}
		if(url.substring(0,8) === "file:///"){
			return false
		}
		if(urlAnalysis){
			var strippedUrl = bloomFilter.validateUrl(url);
			var domain = getUrlDomain(url);
			var primaryDomain = getPrimaryDomain(domain);
			var localStoragePrimaryDomain  = JSON.parse(localStorage.getItem(primaryDomain));
			var localStorageDomain  = JSON.parse(localStorage.getItem(domain));
			var localStorageStrippedUrl = JSON.parse(localStorage.getItem(strippedUrl));
			if(localStoragePrimaryDomain != null && localStoragePrimaryDomain.id >= 2 && localStoragePrimaryDomain.id <=7){
				return false
			}
			if(localStoragePrimaryDomain != null && localStoragePrimaryDomain.id == -1){
				return false
			}
			if(localStorageDomain != null && localStorageDomain.id >= 2 && localStorageDomain.id <=7){
				return false
			}
			if(localStorageDomain != null && localStorageDomain.id == -1){
				return false
			}
			if(localStorageStrippedUrl != null){
				return localStorageStrippedUrl.id === 1 || localStorageStrippedUrl.id === -2
			}
			return false
		}
		return true
	}

	return {
		contains: contains
	};

})();

function AntiPhishing() {

	chrome.webRequest.onCompleted.addListener(onCompletedHandler, {urls: ['<all_urls>']},);
	
	
	function onCompletedHandler(details) {
		/**
			NOTE!

			We don't check here bloom filter (blacklist) since request will be canceled and redirect earlier
			since chrome.webRequest.onBeforeRequest listend in backgroung.js

		*/
		var url = details.url;
		var tabId = details.tabId;
		if (details.type == "main_frame" && tabId >-1 && antiPhishingWhiteList.contains(url)) {	
			setTimeout(function(){
				chrome.tabs.executeScript(tabId, {file: "antiphishing-content.js", allFrames: true}, function(){
					console.log("AntiPhishing");
				});
			},1000);
		}
	}
}
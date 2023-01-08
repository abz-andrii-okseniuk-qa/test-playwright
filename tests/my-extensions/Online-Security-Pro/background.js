var bloomFilter = new BloomFilter(BLOOM_FILTER_URL);
var whiteListBloomFilter = new whiteListBloomFilter(BLOOM_FILTER_URL);
var urlLookup = new UrlLookup(LOOKUP_URL);
var backendNotification = new BackendNotification(BACKEND_URL, BACKEND_CONFIG_URL);
var categories = new Categories(CATEGORIES_URL);
var cache = {};
var tabs = {};
var urls = {};
var safeUrls = {};
var notFoundUrls = {};
var lookupFailedUrls = {};
var exclusions = {};
var oneDayInMilliseconds = 86400000;
var strippedUrl;
var domain;
var checkFLS = true;
var localStorageTime;
var bloomFilterResult;
var bloomFilterResultUrl;

var urlAnalysis = true;
var lang_id = chrome.i18n.getMessage("lang_id");
var isIncognito = chrome.extension.inIncognitoContext;
var updated = JSON.parse(localStorage.getItem("updated")) || 0;
var storageExclusions;
storageExclusions = JSON.parse(localStorage.getItem("storageExclusions")) || [];

for(var i = 0; i < storageExclusions.length; i++) {
	var item = JSON.parse(localStorage.getItem(storageExclusions[i]));
	exclusions[item.url] = {
		id: item.id,
		name: item.name,
		url: item.url,
		fullUrl:item.fullUrl,
		action: item.action,
		time: item.time
	}
}

var blockList;
blockList = JSON.parse(localStorage.getItem("blockList")) || [];

for(var i = 0; i < blockList.length; i++) {
	var item = JSON.parse(localStorage.getItem(blockList[i]));
	if(item != null){	
		urls[item.url] = {
			id: item.id,
			name: item.name,
			url: item.url,
			fullUrl:item.fullUrl,
			action: item.action,
			time: item.time
		}
	}
}

var offlineUrls;
offlineUrls = JSON.parse(localStorage.getItem("offlineUrls")) || [];

chrome.storage.local.get(['heartbeat'], function(result) {
    if (result.heartbeat) {
        var timeout = result.heartbeat + oneDayInMilliseconds - Date.now();
        if (timeout < 0) {
            sendHeartbeat();
        }else {
            setTimeout(sendHeartbeat, timeout)
        }
    }
});

chrome.runtime.onMessage.addListener(contentScriptHandler);
chrome.tabs.onUpdated.addListener(onUpdatedHandler);
chrome.tabs.onRemoved.addListener(onRemovedHandler);
bloomFilter.init(function () {
	whiteListBloomFilter.init(function (){
		chrome.webRequest.onBeforeRequest.addListener(onBeforeRequestHandler, {urls: ['<all_urls>']}, ['blocking']);
		chrome.webRequest.onCompleted.addListener(onCompletedHandler, {urls: ['<all_urls>']});
		antiPhishing = new AntiPhishing();
	})
});

chrome.runtime.onInstalled.addListener(function (details) {
    if(details.reason == "install") {
		updated = 1;
		localStorage.setItem("updated",JSON.stringify(updated));
		localStorage.setItem("clearCMS",JSON.stringify(false));
		addSymbol();
		var read = false;
		localStorage.setItem("read",JSON.stringify(read));
        GUID = createGuid();
        XApiKey = createXApiKey();
        backendNotification.sendInfo(1);
        sendHeartbeat()
    }else if(details.reason == "update"){
		updated = 1;
		localStorage.setItem("updated",JSON.stringify(updated));
		localStorage.setItem("clearCMS",JSON.stringify(false));
		addSymbol();
		var read = false;
		localStorage.setItem("read",JSON.stringify(read));
        if (GUID) {
            backendNotification.sendInfo(2);
            sendHeartbeat()
        }else {
            NEED_TO_SEND_UPDATE_REQUEST = true;
        }
    }
});

function onCompletedHandler(details){
	var tabId = details.tabId;
	if (details.type == "main_frame" && !APP_STATUS && urlAnalysis && tabId >-1) {
		handler(details);
	}
}

function addSymbol(){
	offlineUrls = JSON.parse(localStorage.getItem("offlineUrls")) || [];
	updated = JSON.parse(localStorage.getItem("updated")) || 0;
	var ringNum = offlineUrls.length + updated;
	if(ringNum > 0){
    	chrome.browserAction.setBadgeBackgroundColor({ color: [58, 78, 205, 255] });
		chrome.browserAction.setBadgeText({text: ringNum.toString()});
	}
}

function onUpdatedHandler(tabId, changeInfo, tabInfo){
	if(changeInfo.status == "complete"){
		queryTabs();
	}
}

function onRemovedHandler(tabId, removeInfo){
	queryTabs();
}

function queryTabs(){
	if(APP_STATUS){
		chrome.tabs.query({},function(tabs) {
			if(tabs.length) {
				for(var i = 0; i < tabs.length; i++) {
					var item = tabs[i];
					if(item.url.indexOf("?type=") != -1 && item.url.indexOf("&targeturl=") != -1){
						chrome.browserAction.setIcon({path: "./assets/yellow.png"});
						break
					}else {
						chrome.browserAction.setIcon({path: "./assets/icon16.png"});
					}
				}
			}
		})
	}
}

function onBeforeRequestHandler(details) {
	var tabId = details.tabId;
    var urlHeader = details.url.substring(0,40);
	if(urlHeader == "http://cos.redirect.antivirus.comodo.com"){
		var urlCommand = details.url.substring(41,48);
		var previousUrl = details.url.substring(59);
		strippedUrl = bloomFilter.validateUrl(previousUrl);
    	domain = getUrlDomain(previousUrl);
    	primaryDomain = getPrimaryDomain(domain);
		var item;
		if(localStorage.getItem(strippedUrl) != null){
			item = JSON.parse(localStorage.getItem(strippedUrl));
		}else if(localStorage.getItem(domain) != null){
			item = JSON.parse(localStorage.getItem(domain));			
		}else {
			item = JSON.parse(localStorage.getItem(primaryDomain));
		}
		
		if(urlCommand == "allowed") {
			saveMessge("continue",item);
			return {redirectUrl: previousUrl};
		}
	}
    if (details.type == "main_frame" && APP_STATUS && urlAnalysis && tabId >-1) {
    	return handler(details);
    }
}

function handler(details){
	var url = details.url;
	if(url.substring(0,6) === "chrome"){
		return
	}
	if(url.substring(0,8) === "file:///"){
		return
	}
	var requestId = details.requestId;
	strippedUrl = bloomFilter.validateUrl(url);
	domain = getUrlDomain(url);
	primaryDomain = getPrimaryDomain(domain);
	if(isPrivateIPs(domain)){
		return
	}
	if(storageExclusions.indexOf(primaryDomain) == -1 && storageExclusions.indexOf(domain) == -1 && storageExclusions.indexOf(strippedUrl) == -1) {
		return urlCache(details)
	}
}

//check local cache for url
function urlCache(details){
	var localStorageStrippedUrl = JSON.parse(localStorage.getItem(strippedUrl));
	if(localStorageStrippedUrl != null){
		if(localStorageStrippedUrl.id == -2 || (localStorageStrippedUrl.id >= 1 && localStorageStrippedUrl.id <= 7)){
			localStorageTime = localStorageStrippedUrl.time;
			if(localStorageTime + oneDayInMilliseconds > Date.now()){// less than 24h
				var dbVersion = localStorageStrippedUrl.dbVersion || 0;
				if(dbVersion != getdbVersion()){
					return domainCache(details);
				}else {
					return takeAction(details,localStorageStrippedUrl);
				}
			}else {
				return domainCache(details);
			}
		}else {
			return primaryDomainCheck(details);
		}
	}else {
		return domainCache(details);
	}
}

//check local cache for domain
function domainCache(details){
	var localStorageDomain = JSON.parse(localStorage.getItem(domain));
	if(localStorageDomain != null){
		if(localStorageDomain.id >= 2 && localStorageDomain.id <= 7) {
			localStorageTime = localStorageDomain.time;
			if(localStorageTime + oneDayInMilliseconds > Date.now()) {// less than 24h
				var dbVersion = localStorageDomain.dbVersion || 0;
				if(dbVersion != getdbVersion()){
					return primaryDomainCache(details);
				}else {			
					return takeAction(details,localStorageDomain);
				}
			}else {
				return primaryDomainCache(details);
			}
		}else {
			return primaryDomainCheck(details);
		}
	}else {
		return primaryDomainCache(details);
	}
}

//check local cache for primary domain
function primaryDomainCache(details){
	var localStoragePrimaryDomain = JSON.parse(localStorage.getItem(primaryDomain));
	if(localStoragePrimaryDomain != null){
		if(localStoragePrimaryDomain.id >= 2 && localStoragePrimaryDomain.id <= 7){
			localStorageTime = localStoragePrimaryDomain.time;
			if(localStorageTime + oneDayInMilliseconds > Date.now()) {// less than 24h
				var dbVersion = localStoragePrimaryDomain.dbVersion || 0;
				if(dbVersion != getdbVersion()){
					return primaryDomainCheck(details);
				}else {					
					return takeAction(details,localStoragePrimaryDomain);
				}
			}else {
				return primaryDomainCheck(details);
			}
		}else {
			return primaryDomainCheck(details);
		}
	}else {
		return primaryDomainCheck(details);
	}
}

function takeAction(details, data){
	var cid = data.id;
	var tabId = details.tabId;
	if(cid >= 3 && cid <= 7){
		tabs[tabId] = details.url;
		backendNotification.sendUrlReport({cid: cid, url: details.url, contentType: ""});
		if(APP_STATUS){			
			urls[data.url] = {
				id: cid,
				name: data.name,
				url: data.url,
				fullUrl: details.url,
				action: data.action,
				time: data.time
			}
			if(isIncognito){
				return {redirectUrl: "https://antivirus.comodo.com/alerts.php?type="+data.name+"&targeturl="+details.url+"&lang="+lang_id}				
			}else {
				return {redirectUrl: chrome.extension.getURL("warning/alert.html?type="+data.name+"&targeturl="+details.url)}
			}
		}else {
			offlineUrls = JSON.parse(localStorage.getItem("offlineUrls")) || [];
			if (offlineUrls.indexOf(details.url) == -1){
				localStorage.setItem("clearW",JSON.stringify(false));
	        	offlineUrls.push(details.url);
	        	localStorage.setItem("offlineUrls",JSON.stringify(offlineUrls));
	        	addSymbol();
	        	var read = false;
				localStorage.setItem("read",JSON.stringify(read));
	    	}
		}
	}else {
		backendNotification.sendUrlReport({cid: cid, url: details.url, contentType: ""});
	}
}

function primaryDomainCheck(details){
	var url = details.url;
	var tabId = details.tabId;
    var requestId = details.requestId;
    bloomFilterResult = bloomFilter.test(primaryDomain); //blacklist
	if (bloomFilterResult.result) {//blacklist match
		bloomFilterResultUrl = bloomFilterResult.url;
        cache[requestId] = {
            tabId: tabId,
            url: bloomFilterResultUrl,
            fullUrl: url,
        }
        if(!XApiKey) {
        	XApiKey = createXApiKeyAgain();
        }
        checkFLS = true;
        return urlLookup.checkDomain(details, bloomFilterResultUrl, primaryDomainLookupComplete);
	}else {//blacklist not match
		bloomFilterResult = whiteListBloomFilter.test(primaryDomain);//whitelist
		if(bloomFilterResult.result) {//whitelist match
			bloomFilterResultUrl = bloomFilterResult.url;
            cache[requestId] = {
                tabId: tabId,
                url: bloomFilterResultUrl,
                fullUrl: url,
            }
            if(!XApiKey) {
            	XApiKey = createXApiKeyAgain();
            }
            checkFLS = true;
            return urlLookup.checkDomain(details, bloomFilterResultUrl, primaryDomainLookupComplete);
		}else {//whitelist not match
			notFoundUrls[primaryDomain] = {
				id: -2,
				name: "Not found",
		        url: primaryDomain,
		        fullUrl: url,
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(primaryDomain,JSON.stringify(notFoundUrls[primaryDomain]));
			checkFLS = false;
			//domain check 
			return domainCheck(details);
		}
	}
}

function primaryDomainLookupComplete(details, data, apres, error) {
	var cid = -1;
	var requestId = details.requestId;
	var item = cache[requestId];
	var tabId = item.tabId;
	if(!error) {
		cid = data.domain_result_id;
		if (cid >= 3 && cid <= 7){
			tabs[item.tabId] = item.url;
			var urlData = {
		        id: cid,
		        name: categories.getNameByid(cid),
		        url: item.url,
		        fullUrl: item.fullUrl,
		        action: "blocked",
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(item.url,JSON.stringify(urlData));
			backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
			backendNotification.sendUrlFeedback({url: item.url, verdict: cid, reason: 0, display: 2, apres: apres});
		    if(APP_STATUS){
		    	urls[item.url] = urlData;
			    if (blockList.indexOf(item.url) == -1){          	
	            	blockList.push(item.url);
	            	localStorage.setItem("blockList",JSON.stringify(blockList));
	            }
		    	if(isIncognito){			    	
			    	return {redirectUrl: "https://antivirus.comodo.com/alerts.php?type="+categories.getNameByid(cid)+"&targeturl="+item.fullUrl+"&lang="+lang_id}
			    }else {
			    	return {redirectUrl: chrome.extension.getURL("warning/alert.html?type="+categories.getNameByid(cid)+"&targeturl="+item.fullUrl)}
			    }
		    }else {
		    	offlineUrls = JSON.parse(localStorage.getItem("offlineUrls")) || [];
				if (offlineUrls.indexOf(details.url) == -1){
					localStorage.setItem("clearW",JSON.stringify(false));
		        	offlineUrls.push(details.url);
		        	localStorage.setItem("offlineUrls",JSON.stringify(offlineUrls));
		        	addSymbol();
		        	var read = false;
					localStorage.setItem("read",JSON.stringify(read));
		    	}
		    }
		}else if(cid == 2){
			safeUrls[item.url] = {
				id: cid,
				name: categories.getNameByid(cid),
		        url: item.url,
		        fullUrl: item.fullUrl,
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(item.url,JSON.stringify(safeUrls[item.url]));
			backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
			backendNotification.sendUrlFeedback({url: item.url, verdict: cid, reason: 2, display: 1, apres: apres});
		}else if(cid == 1) {
			notFoundUrls[item.url] = {
				id: cid,
				name: categories.getNameByid(cid),
		        url: item.url,
		        fullUrl: item.fullUrl,
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(item.url,JSON.stringify(notFoundUrls[item.url]));
			//domain check
			return domainCheck(details);
		}
	}else {
		checkFLS = false;
		lookupFailedUrls[item.url] = {
			id: cid,
			name: "Look up failed",
	        url: item.url,
	        fullUrl: item.fullUrl,
	        time: Date.now(),
	        dbVersion: getdbVersion()
		}
		localStorage.setItem(item.url,JSON.stringify(lookupFailedUrls[item.url]));
		backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
		return domainCheck(details);
	}
}

function domainCheck(details){
	var url = details.url;
	var tabId = details.tabId;
    var requestId = details.requestId;
    bloomFilterResult = bloomFilter.test(domain); //blacklist
	if (bloomFilterResult.result) {//blacklist match
		bloomFilterResultUrl = bloomFilterResult.url;
        cache[requestId] = {
            tabId: tabId,
            url: bloomFilterResultUrl,
            fullUrl: url,
        }
        if(!XApiKey) {
        	XApiKey = createXApiKeyAgain();
        }
        checkFLS = true;
        return urlLookup.checkDomain(details, bloomFilterResultUrl, domainLookupComplete);
	}else {//blacklist not match
		bloomFilterResult = whiteListBloomFilter.test(domain);//whitelist
		if(bloomFilterResult.result) {//whitelist match
			bloomFilterResultUrl = bloomFilterResult.url;
            cache[requestId] = {
                tabId: tabId,
                url: bloomFilterResultUrl,
                fullUrl: url,
            }
            if(!XApiKey) {
            	XApiKey = createXApiKeyAgain();
            }
            checkFLS = true;
            return urlLookup.checkDomain(details, bloomFilterResultUrl, domainLookupComplete);
		}else {//whitelist not match
			notFoundUrls[domain] = {
				id: -2,
				name: "Not found",
		        url: domain,
		        fullUrl: url,
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(domain,JSON.stringify(notFoundUrls[domain]));
			checkFLS = false;
			//full url check 
			return strippedUrlCheck(details);
		}
	}
}

function domainLookupComplete(details, data, apres, error) {
	var cid = -1;
	var requestId = details.requestId;
	var item = cache[requestId];
	var tabId = item.tabId;
	if(!error) {
		cid = data.domain_result_id;
		if (cid >= 3 && cid <= 7){
			tabs[item.tabId] = item.url;
			var urlData = {
		        id: cid,
		        name: categories.getNameByid(cid),
		        url: item.url,
		        fullUrl: item.fullUrl,
		        action: "blocked",
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(item.url,JSON.stringify(urlData));
			backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
			backendNotification.sendUrlFeedback({url: item.url, verdict: cid, reason: 0, display: 2, apres: apres});
		    if(APP_STATUS){
		    	urls[item.url] = urlData;
			    if (blockList.indexOf(item.url) == -1){          	
	            	blockList.push(item.url);
	            	localStorage.setItem("blockList",JSON.stringify(blockList));
	            }
		    	if(isIncognito){			    	
			    	return {redirectUrl: "https://antivirus.comodo.com/alerts.php?type="+categories.getNameByid(cid)+"&targeturl="+item.fullUrl+"&lang="+lang_id}
			    }else {
			    	return {redirectUrl: chrome.extension.getURL("warning/alert.html?type="+categories.getNameByid(cid)+"&targeturl="+item.fullUrl)}
			    }
		    }else {
		    	offlineUrls = JSON.parse(localStorage.getItem("offlineUrls")) || [];
				if (offlineUrls.indexOf(details.url) == -1){
					localStorage.setItem("clearW",JSON.stringify(false));
		        	offlineUrls.push(details.url);
		        	localStorage.setItem("offlineUrls",JSON.stringify(offlineUrls));
		        	addSymbol();
		        	var read = false;
					localStorage.setItem("read",JSON.stringify(read));
		    	}
		    }
		}else if(cid == 2){
			safeUrls[item.url] = {
				id: cid,
				name: categories.getNameByid(cid),
		        url: item.url,
		        fullUrl: item.fullUrl,
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(item.url,JSON.stringify(safeUrls[item.url]));
			backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
			backendNotification.sendUrlFeedback({url: item.url, verdict: cid, reason: 2, display: 1, apres: apres});
		}else if(cid == 1) {
			notFoundUrls[item.url] = {
				id: cid,
				name: categories.getNameByid(cid),
		        url: item.url,
		        fullUrl: item.fullUrl,
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(item.url,JSON.stringify(notFoundUrls[item.url]));
			//full url check
			return strippedUrlCheck(details);
		}
	}else {
		checkFLS = false;
		lookupFailedUrls[item.url] = {
			id: cid,
			name: "Look up failed",
	        url: item.url,
	        fullUrl: item.fullUrl,
	        time: Date.now(),
	        dbVersion: getdbVersion()
		}
		localStorage.setItem(item.url,JSON.stringify(lookupFailedUrls[item.url]));
		backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
		return strippedUrlCheck(details);
	}
}

function strippedUrlCheck(details) {
	var url = details.url;
	var tabId = details.tabId;
    var requestId = details.requestId;
	bloomFilterResult = bloomFilter.test(strippedUrl);
	if (bloomFilterResult.result) {  //blacklist match
    	bloomFilterResultUrl = bloomFilterResult.url;
		cache[requestId] = {
			tabId: tabId,
			url: bloomFilterResultUrl,
			fullUrl: url,
		}
		if(!XApiKey) {
			XApiKey = createXApiKeyAgain();
		}
		checkFLS = true;
		return urlLookup.check(details, bloomFilterResultUrl, LookupComplete);
	}else {//blacklist not match
		bloomFilterResult = whiteListBloomFilter.test(strippedUrl);
		if (bloomFilterResult.result) {//whitelist match
			bloomFilterResultUrl = bloomFilterResult.url;
			cache[requestId] = {
				tabId: tabId,
				url: bloomFilterResultUrl,
				fullUrl: url,
			}
			if(!XApiKey) {
				XApiKey = createXApiKeyAgain();
			}
			checkFLS = true;
			return urlLookup.check(details, bloomFilterResultUrl, LookupComplete);
		}else{//whitelist not match
			if(!checkFLS){
				notFoundUrls[strippedUrl] = {
					id: -2,
					name: "Not found",
				    url: strippedUrl,
				    fullUrl: url,
				    time: Date.now(),
				    dbVersion: getdbVersion()
				}
				localStorage.setItem(strippedUrl,JSON.stringify(notFoundUrls[strippedUrl]));
				backendNotification.sendUrlReport({cid: -2, url: url, contentType: ""});
			}else{
				notFoundUrls[strippedUrl] = {
					id: 1,
					name: "Not found",
				    url: strippedUrl,
				    fullUrl: url,
				    time: Date.now(),
				    dbVersion: getdbVersion()
				}
				localStorage.setItem(strippedUrl,JSON.stringify(notFoundUrls[strippedUrl]));
				backendNotification.sendUrlReport({cid: 1, url: url, contentType: ""});
			}
		}
	}
}

function LookupComplete(details, data, apres, error) {
	var cid = -1;
	var requestId = details.requestId;
	var item = cache[requestId];
	if(!error) {
		cid = data.url_result_id;
		if (cid >= 3 && cid <= 7){
			tabs[item.tabId] = item.url;
		    var urlData = {
		        id: cid,
		        name: categories.getNameByid(cid),
		        url: item.url,
		        fullUrl: item.fullUrl,
		        action: "blocked",
		        time: Date.now(),
		        dbVersion: getdbVersion()
		    }
		    localStorage.setItem(item.url,JSON.stringify(urlData));
		    backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
		    backendNotification.sendUrlFeedback({url: item.url, verdict: cid, reason: 5, display: 2, apres: apres});
		    if(APP_STATUS){
			    urls[item.url] = urlData;
			    if (blockList.indexOf(item.url) == -1){     	
	            	blockList.push(item.url);
	            	localStorage.setItem("blockList",JSON.stringify(blockList));
	            }
		    	if(isIncognito){			    	
			    	return {redirectUrl: "https://antivirus.comodo.com/alerts.php?type="+categories.getNameByid(cid)+"&targeturl="+item.fullUrl+"&lang="+lang_id}
			    }else {
			    	return {redirectUrl: chrome.extension.getURL("warning/alert.html?type="+categories.getNameByid(cid)+"&targeturl="+item.fullUrl)}
			    }
		    }else {
		    	offlineUrls = JSON.parse(localStorage.getItem("offlineUrls")) || [];
				if (offlineUrls.indexOf(details.url) == -1){
					localStorage.setItem("clearW",JSON.stringify(false));
		        	offlineUrls.push(details.url);
		        	localStorage.setItem("offlineUrls",JSON.stringify(offlineUrls));
		        	addSymbol();
		        	var read = false;
					localStorage.setItem("read",JSON.stringify(read));
		    	}
		    }
		}else if(cid == 2){
			safeUrls[item.url] = {
				id: cid,
				name: categories.getNameByid(cid),
		        url: item.url,
		        fullUrl: item.fullUrl,
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(item.url,JSON.stringify(safeUrls[item.url]));
			backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
			backendNotification.sendUrlFeedback({url: item.url, verdict: cid, reason: 6, display: 1, apres: apres});
		}else if(cid == 1) {
			notFoundUrls[item.url] = {
				id: cid,
				name: categories.getNameByid(cid),
		        url: item.url,
		        fullUrl: item.fullUrl,
		        time: Date.now(),
		        dbVersion: getdbVersion()
			}
			localStorage.setItem(item.url,JSON.stringify(notFoundUrls[item.url]));
			backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
		}
	}else {
		lookupFailedUrls[item.url] = {
			id: cid,
			name: "Look up failed",
	        url: item.url,
	        fullUrl: item.fullUrl,
	        time: Date.now(),
	        dbVersion: getdbVersion()
		}
		localStorage.setItem(item.url,JSON.stringify(lookupFailedUrls[item.url]));
		backendNotification.sendUrlReport({cid: cid, url: item.fullUrl, contentType: ""});
	}
}

function getUrlDomain(url){
	var parser = document.createElement('a');
	parser.href = url;
    domain = parser.hostname;
    return domain;
}

function getPrimaryDomain(str) {
	if(!str) return '';
	if(str.indexOf('://') != -1) str = str.substr(str.indexOf('://') + 3);
	var topLevel = ['top', 'com', 'xyz', 'xin', 'vip', 'win', 'red', 'net', 'org', 'wang', 'gov', 'edu', 'mil', 'co', 'biz', 'name', 'info', 'mobi', 'pro', 'travel', 'club', 'museum', 'int', 'areo', 'post', 'rec', 'asia'];
	var domains = str.split('.');
	if(domains.length <= 1) return str;
	if(!isNaN(domains[domains.length - 1])) return str;
	var i = 0;
	while(i < topLevel.length && topLevel[i] != domains[domains.length - 1]) i++;
	if(i != topLevel.length) return domains[domains.length - 2] + '.' + domains[domains.length - 1];
	else {
		i = 0;
		while(i < topLevel.length && topLevel[i] != domains[domains.length - 2]) i++;
		if(i == topLevel.length) return domains[domains.length - 2] + '.' + domains[domains.length - 1];
		else return domains[domains.length - 3] + '.' + domains[domains.length - 2] + '.' + domains[domains.length - 1];
	}
};

function contentScriptHandler(request, sender, sendResponse) {
    if (request.cmd) {
        //message from content options page
        executeCommand(request.cmd, request, sendResponse);
    }
    if (request.log) {
    	backendNotification.sendUrlFeedback(request.log);
    	localStorage.setItem("antiPhishing+"+request.log.url,JSON.stringify(request.log));
    }
    if(request.message) {
    	var item;
    	var cutUrl = bloomFilter.validateUrl(request.message.fullUrl);
    	var cutDomain = getUrlDomain(request.message.fullUrl);
    	var cutPrimaryDomain = getPrimaryDomain(cutDomain);
    	if(localStorage.getItem(cutUrl) != null){
			item = JSON.parse(localStorage.getItem(cutUrl));
		}else if(localStorage.getItem(cutDomain) != null){
			item = JSON.parse(localStorage.getItem(cutDomain));
		}else {
			item = JSON.parse(localStorage.getItem(cutPrimaryDomain));
		}
    	saveMessge(request.message.action, item)
    }
    return true;
};

function saveMessge(message, item) {
    if(message == "continue") {
        item.action = "ignored";
        urls[item.url] = item;
        localStorage.setItem(item.url,JSON.stringify(item));
        exclusions[item.url] = item;
        if (storageExclusions.indexOf(item.url) == -1){
        	storageExclusions.push(item.url);
        	localStorage.setItem("storageExclusions",JSON.stringify(storageExclusions));
        }
        backendNotification.sendUrlFeedback({url: item.url, verdict: item.id, userAction: 1});
    }
}

function executeCommand(cmd, request, sendResponse) {
    switch (cmd) {
        case "getState" :
            sendResponse({state: APP_STATUS, version: APP_VERSION});
            break

        case "toggleState":
            APP_STATUS = !APP_STATUS;
            if(APP_STATUS){
            	queryTabs();
            }
            sendResponse({state: APP_STATUS, version: APP_VERSION});
            chrome.storage.local.set({'APP_STATUS': APP_STATUS}, function(result) {});
            break;
		
        case "removeAll" :
            urls = {};
            blockList = [];
            localStorage.setItem("blockList",JSON.stringify(blockList));
            sendResponse();
            break;

		case "removeAllExclusions" :
            exclusions = {};
            storageExclusions = [];
            localStorage.setItem("storageExclusions",JSON.stringify(storageExclusions));
            
            for(var i = 0; i < blockList.length; i++) {
				var item = JSON.parse(localStorage.getItem(blockList[i]));
				item.action = "blocked";
				urls[item.url] = item;
				localStorage.setItem(item.url,JSON.stringify(item));
			}
            
            sendResponse();
            break;
            
        case "removeSelected" :
            //requst

            var list = JSON.parse(request.list);
            for (var i = 0; i < list.length; i++) {
                delete urls[list[i]];
                var deletestorage = list[i];
            	blockList.splice($.inArray(deletestorage,blockList),1);
            }
            localStorage.setItem("blockList",JSON.stringify(blockList));
            sendResponse();
            break;

		case "removeSelectedExclusion" :
            //requst

            var list = JSON.parse(request.list);
            for (var i = 0; i < list.length; i++) {
            	delete exclusions[list[i]];
            	var deletestorage = list[i];
            	storageExclusions.splice($.inArray(deletestorage,storageExclusions),1);
            	var item = JSON.parse(localStorage.getItem(list[i]));
            	item.action = "blocked";
				urls[item.url] = item;
				localStorage.setItem(item.url,JSON.stringify(item));
            }
            
            localStorage.setItem("storageExclusions",JSON.stringify(storageExclusions));
            sendResponse();
            break;

        case "getItems" :
            var data = [];
            for(var name in urls) {
                var item = urls[name];
                data.push({
                    id: item.id,
                    name: item.name,
                    url: item.url,
                    fullUrl: item.fullUrl,
                    time: item.time,
                    action: item.action
                })
            };

            sendResponse({data: JSON.stringify(data)});
            break;
            
        case "getExclusionItems" :
            var data = [];
            for(var name in exclusions) {
                var item = exclusions[name];
                data.push({
                    id: item.id,
                    name: item.name,
                    url: item.url,
                    fullUrl: item.fullUrl,
                    time: item.time,
                    action: item.action
                })
            };

            sendResponse({data: JSON.stringify(data)});
            break;
    }
};

function getdbVersion() {
	return bloomFilter.getVersion()+whiteListBloomFilter.getVersion()
}

function isPrivateIPs(url){
	if(reg.test(url)){
		var arr = url.split(".");
		if(arr[0]==10){
			if(withinRange(arr[1],0,255)){
				if(withinRange(arr[2],0,255)){
					if(withinRange(arr[3],0,255)){
						return true
					}
				}
			}
		}
		if(arr[0]==172){
			if(withinRange(arr[1],16,31)){
				if(withinRange(arr[2],0,255)){
					if(withinRange(arr[3],0,255)){
						return true
					}
				}
			}
		}
		if(arr[0]==192){
			if(arr[1]==168){
				if(withinRange(arr[2],0,255)){
					if(withinRange(arr[3],0,255)){
						return true
					}
				}
			}
		}
	}
	return false
}

function withinRange(a,b,c){
	if(a>=b&&a<=c){
		return true
	}
	return false
}

function sendHeartbeat() {
    backendNotification.sendInfo(4);
    chrome.storage.local.set({'heartbeat': Date.now()}, function(result) {
        setTimeout(sendHeartbeat, oneDayInMilliseconds)
    });
};
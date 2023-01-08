var requestsLogger = [];

function BackendNotification(domain, configUrl) {

    var parser = document.createElement('a');

    var exclusionList = [];
    var public_api = {
        sendInfo: sendInfo,
        sendUrlReport: function () {
            //empty function
        },
        sendUrlFeedback: sendUrlFeedback
    };

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", transferComplete, false);
    xhr.open("GET", configUrl);
    xhr.send();

    function transferComplete(evt) {
        xhr.removeEventListener("load", transferComplete, false);

        var result = JSON.parse(evt.currentTarget.responseText);
        //public_api.sendUrlFeedback = sendUrlFeedback;
        if (result.aurl == 1) {
        	exclusionList = result.exclusions;        	
            public_api.sendUrlReport = sendUrlReport;
        }
    };

    //Fleven API 6 Type 106 - Url Lookup Service
    function sendUrlReport(info) {
        var url = info.url;
        parser.href = url;
        var hostname = parser.hostname.replace(/^(www)\./, "");
        var protocol = url.match(/^https?:\/\//i, "");
        if (protocol) {
            url = url.replace(/^https?:\/\//i, "");
            protocol = protocol[0].replace(/:\/\//i, "");
        } else {
            protocol = "";
        }
		
		if(GUID == false){
    		GUID = createGuid();
    	}
		
        if (exclusionList.indexOf(hostname) == -1) {
            var data = {
                us: GUID,
                fur: url,
                prt: protocol,
                cid: info.cid,
                prd: APP_ID,
                ver: parseInt(APP_VERSION.split(".")[3]),
                bna: BROWSER_NAME,
                bv: BROWSER_VERSION,
                mt: info.contentType.split(";")[0]
            };

            sendHttpRequest("type106/", data, 'Submit Url Lookup');
        }
    };

    //Fleven API 8 _ Type 108 - URL Feedback
    function sendUrlFeedback(info) {
        var bdb = bloomFilter.getVersion();
    	var wdb = whiteListBloomFilter.getVersion();
    	
    	if(GUID == false){
    		GUID = createGuid();
    	}
    	
        var data = {
            prd: APP_ID,
            ver: parseInt(APP_VERSION.split(".")[3]),
            us: GUID,
            url: info.url,
            ve: info.verdict,
            ua: info.userAction || 0,
            bna: BROWSER_NAME,
            bv: BROWSER_VERSION,
            rea: info.reason || 0,
            dis: info.display || 0,
            rurl: info.rurl || "",
            aurl: info.aurl || "",
            bdb: bdb,
            wdb: wdb,
            t: info.apres || -2
        }

        sendHttpRequest("type108/", data, 'PHI');
    };

     //Fleven API 2 _ Type 102 - URL Feedback
    function sendInfo(state) {
    	
    	if(GUID == false){
    		GUID = createGuid();
    	}
    	
        chrome.runtime.getPlatformInfo(function(info) {
            var data =  {
                prd: APP_ID,
                ver: parseInt(APP_VERSION.split(".")[3]),
                us: GUID,
                os: info.os,
                osp: info.arch,
                st: state,
                bna: BROWSER_NAME,
            	bv: BROWSER_VERSION
            };

            sendHttpRequest("type102/", data, 'Submitting endpoint information');
        });
    }
    
    function sendHttpRequest(type, data, description) {
        //requestsLogger.push(data);

        var http_request = new XMLHttpRequest();

        http_request.open("post", domain + type);
        http_request.setRequestHeader('header','Content-Type');
        http_request.setRequestHeader('description', description);
        http_request.send(JSON.stringify(data));
    }

    return public_api;
}
function whiteListBloomFilter(configUrl) {

    var public_upi = {};
    var externalCallback;

    //filter config params
    var version = 0;
    var updateInterval
    var cutUriQuery;
    var cutUriScheme;
    var lastUpdate;
    var sourceLocation;
    var zipFiles;
    //bloom filters settings
    var size;
    var hashes;
    var source;

    //private vars
    var storage;

    chrome.storage.local.get([
            'whiteBloomFilterSourceLocation',
            'whiteBloomFilterLastUpdate',
            'whiteBloomFilterUpdateInterval',
            'whiteBloomFilterVersion',
            'whiteBloomFilterCutUriQuery',
            'whiteBloomFilterCutUriScheme',
            'whiteBloomFilterSize',
            'whiteBloomFilterHashes',
            'whiteBloomFilterSource'
        ], function(data) {
            if (data.whiteBloomFilterVersion && data.whiteBloomFilterSource) {
                restoreFromLocalStorage(data);
                storage = createBloomFilter(size, hashes, base64ToArrayBuffer(source));
                activateBloomFilter();
                if (Date.now() > lastUpdate + updateInterval) {
                    loadConfigData();
                }
            } else {
                loadConfigData();
            };
    });

    function activateBloomFilter() {
        if (storage && externalCallback) {
            public_upi.test = bloomFilterTest;
            externalCallback();
            externalCallback = null;
        };
    };

    function restoreFromLocalStorage(data) {
        sourceLocation = data.whiteBloomFilterSourceLocation;
        lastUpdate = data.whiteBloomFilterLastUpdate;
        updateInterval = data.whiteBloomFilterUpdateInterval;
        version = data.whiteBloomFilterVersion;
        cutUriQuery = !!data.whiteBloomFilterCutUriQuery;
        cutUriScheme = !!data.whiteBloomFilterCutUriScheme;
        size = data.whiteBloomFilterSize;
        hashes = data.whiteBloomFilterHashes;
        source = data.whiteBloomFilterSource;
    }

    function saveToLocalStorage() {
        var objToSave = {
            whiteBloomFilterSourceLocation: sourceLocation,
            whiteBloomFilterLastUpdate: lastUpdate,
            whiteBloomFilterUpdateInterval: updateInterval,
            whiteBloomFilterVersion: version,
            whiteBloomFilterCutUriQuery: cutUriQuery,
            whiteBloomFilterCutUriScheme: cutUriScheme,
            whiteBloomFilterSize: size,
            whiteBloomFilterHashes: hashes,
            whiteBloomFilterSource: source
        };

        chrome.storage.local.set(objToSave, function(result) {});
    };

    function loadConfigData() {
        var xhr = new XMLHttpRequest();
        var versionUrl = configUrl + "?time=" + Date.now();
        xhr.addEventListener("load", completeHandler, false);
        xhr.open("GET", versionUrl);
        xhr.send();

        function completeHandler(e) {
            xhr.removeEventListener("load", completeHandler, false);
            saveBloomFilterConfig(JSON.parse(e.currentTarget.response).whitelisturldb);
        }
    }


    function saveBloomFilterConfig(data){
        sourceLocation = data.location + "?time=" + Date.now();
        cutUriScheme = data.protocol_included === false;
        cutUriQuery = data.parameters_included === false;
        //upd_period_min in minutes
        updateInterval = data.upd_period_min * 60 * 1000;
		
        if (version < data.version) {
            loadBloomFilterFile();
        } else {
            lastUpdate = Date.now();
            chrome.storage.local.set({'whiteBloomFilterLastUpdate': lastUpdate}, function(result) {});
            setTimeout(loadConfigData, updateInterval);
        }
    }

    function loadBloomFilterFile() {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer";
        xhr.addEventListener("load", transferComplete, false);
        xhr.open("GET", sourceLocation, true);
        xhr.send();
        function transferComplete(evt) {
            xhr.removeEventListener("load", transferComplete, false);
			
            JSZip.loadAsync(evt.currentTarget.response)
                .then(function (a) {
                    zipFiles = a.files;
                    return zipFiles["chksum.json"].async("string");
				}).then(function (text) {
					var chksumData = JSON.parse(text).urldb_chksum;
					var chksumSha1 = chksumData.sha1;
					var chksumVersion = chksumData.version;
					if(version < chksumVersion) {
						var dbSha1;
						zipFiles["ctrl-06-33-url.db"].async("uint8array").then(function (data) {
		                    var result = sha1(data);
		                    dbSha1 = Array.prototype.map.call(result,function(e){
		                    	return (e<16?"0":"")+e.toString(16);
		                    }).join("");
		                    return dbSha1;
	                    }).then(function(dbSha1){
	                    	if (dbSha1 == chksumSha1){
	                    		version = chksumVersion;
		                    	return zipFiles["ctrl-06-33-url.db"].async("string");
		                    }else {
		                    	return null
		                    }
	                    }).then(function (text) {
		                	if(text != null){
		                		var rawData = JSON.parse(text);
		                		size = rawData.m;
		                		hashes = rawData.h;
		                		source = rawData.b;
		
		                		lastUpdate = Date.now();
		
		                		saveToLocalStorage();
		
		                		storage = createBloomFilter(size, hashes, base64ToArrayBuffer(source));
		                		activateBloomFilter();
		
		                		setTimeout(loadConfigData, updateInterval);
		                	} else {
		                		lastUpdate = Date.now();
					            chrome.storage.local.set({'whiteBloomFilterLastUpdate': lastUpdate}, function(result) {});
					            setTimeout(loadConfigData, updateInterval);
		                		return
		                	}
            			});
					}else {
						lastUpdate = Date.now();
            			chrome.storage.local.set({'whiteBloomFilterLastUpdate': lastUpdate}, function(result) {});
            			setTimeout(loadConfigData, updateInterval);
						return
					}
                })
        }
    }

    function createBloomFilter(size, hashes, bytes) {

        var bitset = bytes || new Int8Array(Math.ceil(size / 8));

        function hashCassandra(value) {
            var hash1 = murmurHash3.x86.hash32(value, 0);
            var hash2 = murmurHash3.x86.hash32(value, hash1);
            var result = [];
            for (var i = 0; i < hashes; i++) {
                result[i] = ((hash1 + i * hash2) % size);
            }
            return result;
        };

        function add(item) {
            var positions = hashCassandra(item);
            for (var i = 0; i < positions.length; i++) {
                bitset[Math.floor(positions[i] / 8)] |= 1 << positions[i] % 8;
            }
        };

        function test(item) {
            var positions = hashCassandra(item);
            for (var i = 0; i < positions.length; i++) {
                var val = bitset[Math.floor(positions[i] / 8)] & 1 << positions[i] % 8;
                if (val === 0) {
                    return false;
                }
            }
            return true;
        };

        return {
            add: add,
            test: test
        };
    }
	
	function sha1(data){
		var i,j,t;
		var l=((data.length+8)>>>6<<4)+16,s=new Uint8Array(l<<2);
		s.set(new Uint8Array(data.buffer)),s=new Uint32Array(s.buffer);
		for(t=new DataView(s.buffer),i=0;i<l;i++)s[i]=t.getUint32(i<<2);
		s[data.length>>2]|=0x80<<(24-(data.length&3)*8);
		s[l-1]=data.length<<3;
		var w=[],f=[
		function(){return m[1]&m[2]|~m[1]&m[3];},
		function(){return m[1]^m[2]^m[3];},
		function(){return m[1]&m[2]|m[1]&m[3]|m[2]&m[3];},
		function(){return m[1]^m[2]^m[3];}
		],rol=function(n,c){return n<<c|n>>>(32-c);},
		k=[1518500249,1859775393,-1894007588,-899497514],
		m=[1732584193,-271733879,null,null,-1009589776];
		m[2]=~m[0],m[3]=~m[1];
		for(i=0;i<s.length;i+=16){
			var o=m.slice(0);
			for(j=0;j<80;j++)
			w[j]=j<16?s[i+j]:rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1),
			t=rol(m[0],5)+f[j/20|0]()+m[4]+w[j]+k[j/20|0]|0,
			m[1]=rol(m[1],30),m.pop(),m.unshift(t);
			for(j=0;j<5;j++)m[j]=m[j]+o[j]|0;
		};
		t=new DataView(new Uint32Array(m).buffer);
		for(var i=0;i<5;i++)m[i]=t.getUint32(i<<2);
		return new Uint8Array(new Uint32Array(m).buffer);
	};
	
    function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Int8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    };

    function bloomFilterTest(url) {
        var result;
        result =  storage.test(url);
        return {
            result: result,
            url: url,
        };
    };
    
    function getVersion() {
    	return version
    }
    
    public_upi.getVersion = getVersion;

    public_upi.init = function (callback) {
        externalCallback = callback;
        activateBloomFilter();
    };

    public_upi.test = function (url) {
        return false;
    };

    return public_upi;

};
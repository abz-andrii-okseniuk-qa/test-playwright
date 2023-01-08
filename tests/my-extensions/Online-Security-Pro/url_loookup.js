function UrlLookup(domain) {
	
    function getByteArrayFromString(str) {
        var bytes = [];
        for (var i = 0; i < str.length; ++i) {
            var charCode = str.charCodeAt(i); //char > 2 bytes is impossible since charCodeAt can only return 2 bytes
            bytes.push((charCode & 0xFF00) >>> 8);  //high byte (might be 0)
            bytes.push(charCode & 0xFF);  //low byte
        }
        return bytes;
    };

    function strToUTF8Array(str) {
        var utf8 = [];
        for (var i=0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode>>6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                    | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >>18),
                    0x80 | ((charcode>>12) & 0x3f),
                    0x80 | ((charcode>>6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

    function getBodyBlob(url) {
        //var urlArray = getByteArrayFromString("a");
        var urlArray = strToUTF8Array(url);
        var urlLengthUint8 = MathConverter.uint16ToUint8(urlArray.length);
        var bodyLength = 26 + urlArray.length;

        var bodyLengthUint8 = MathConverter.uint16ToUint8(bodyLength);

        //MPTRLLXXXXAVC[GUID][NN[URL]]+
        var body = new Int8Array(bodyLength + 6);
        //M – special marker (one byte), must be EF (hex)
        body[0] = 0xEF;
        //P – protocol version, 7 for this protocol (one byte)
        body[1] = 7;
        //T – request type, should be 35 for this request (one byte)
        body[2] = 35;
        //R – request type revision, must be 1 (one byte)
        body[3] = 1
        //LL - length of the rest of request, starting from next byte (2 bytes, unsigned)
        body[4] = bodyLengthUint8[1];
        body[5] = bodyLengthUint8[0];
        //XXXX – 4 byte request code (any number) – it will be used by client to identify the response
        body[6] = MathConverter.getRandomInt8();
        body[7] = MathConverter.getRandomInt8();
        body[8] = MathConverter.getRandomInt8();
        body[9] = MathConverter.getRandomInt8();
        //A – application ID, one byte. For the whole list of application IDs please see Appendix A of this document.
        body[10] = APP_ID;
        //VV – application version (2 bytes)
        body[11] = 1;
        body[12] = 0;
        //C – Caller type, one byte (1 – From On-Access, 2 – From On-Demand, 3 – From Sandbox, 4 – Viruscope, 5 – Present inside sandbox + previous installation, 6 – Present outside sandbox  + previous installation, 7 – Present  inside sandbox + after installation, 8 – Present  outside sandbox  + after installation)
        body[13] = 1;
        //GUID – Globally Unique Identifier, 16 bytes
        body[14] = 0;
        body[15] = 0;
        body[16] = 0;
        body[17] = 0;
        body[18] = 1;
        body[19] = 1;
        body[20] = 1;
        body[21] = 1;
        body[22] = 1;
        body[23] = 1;
        body[24] = 1;
        body[25] = 1;
        body[26] = 0;
        body[27] = 0;
        body[28] = 0;
        body[29] = 0;
        //NN –  length of  the URL string in bytes (0-65000, two bytes, big-endian)
        body[30] = urlLengthUint8[1];
        body[31] = urlLengthUint8[0];
        //URL – tf8 encoded  URL string (NN bytes)
        for (var i = 0; i < urlArray.length; i++) {
            body[i + 32] = urlArray[i];
        }
        return new Blob([body]);

    };

    function pasreResult(arrayBuffer) {
        //XXXXZ[CSSTTTT]+
        var result = {};
        if (arrayBuffer) {
            var byteArray = new Uint8Array(arrayBuffer);
            result.id = byteArray[5];
            result.significant = MathConverter.uint8ToUint16(byteArray[6], byteArray[7]);
        }
        return result;
    }

    function check(details, url, callback) {
		var data;
        var http_request = new XMLHttpRequest();
        http_request.open("GET", domain + '/api/v1/url/query?url='+url, false);
        http_request.setRequestHeader('X-Api-Key',XApiKey);
        try {
        	var t1 = Date.now();
			http_request.send();
			if(http_request.readyState == 4 && http_request.status == 200){
				var t2 = Date.now();
				var apres = t2 - t1;
				data = JSON.parse(http_request.response);
				return callback(details, data, apres);
			}
		} catch (e){
			return callback(details, null, -2, "Error");
		}
    };
    
    function checkDomain(details, url, callback) {
		var data;
        var http_request = new XMLHttpRequest();
        http_request.open("GET", domain + '/api/v1/domain/query?domain='+url, false);
        http_request.setRequestHeader('X-Api-Key',XApiKey);
        try {
        	var t1 = Date.now();
			http_request.send();
			if(http_request.readyState == 4 && http_request.status == 200){
				var t2 = Date.now();
				var apres = t2 - t1;
				data = JSON.parse(http_request.response);
				return callback(details, data, apres);
			}
		} catch (e){
			return callback(details, null, -2, "Error");
		}
    };

    return {
        check: check,
        checkDomain: checkDomain
    };

};
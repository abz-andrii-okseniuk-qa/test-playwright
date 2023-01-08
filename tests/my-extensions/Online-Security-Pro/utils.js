function createGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    var GUID = s4() + s4() + s4() +  s4() + s4() + s4() + s4() + s4();
    chrome.storage.local.set({'GUID': GUID}, function(result) {});
    return GUID
}

MathConverter = (function() {

    //CONSTANTS
    var pow2x8 = 256;
    var pow2x16 = 65536;
    var pow2x24 = 16777216;

    /**
     * Convert Uint32 Number to Uint8Array, Returned array contains 4 items
     * @param num  - Uint32 number
     * @param right -
     */

    function uint32ToUint8(num, right) {
        var ar = new Uint8Array(4);
        var d = Math.floor(num / pow2x24);
        var c = Math.floor((num %= pow2x24) / pow2x16);
        var b = Math.floor((num %= pow2x16) / pow2x8);
        var a = num % pow2x8;

        if (!right) {
            ar[0] = a;
            ar[1] = b;
            ar[2] = c;
            ar[3] = d;
        } else {
            ar[0] = d;
            ar[1] = c;
            ar[2] = b;
            ar[3] = a;
        }

        return ar;
    }

    /**
     * Convert from Uint8Array Number to Uint32, Array contains 4 items
     * @param num  - Uint32 number
     * @param right -
     */

    function uint8ToUint32(a, right) {
        if (!right) {
            return a[0] + a[1] * pow2x8 + a[2] * pow2x16 + a[3]  * pow2x24;
        } else {
            return a[3] + a[2] * pow2x8 + a[1] * pow2x16 + a[0]  * pow2x24;
        }
    }

    /**
     * Convert Uint16 Number to Uint8Array, Returned array contains 2 items
     * @param num  - Uint16 number
     * @param right -
     */

    function uint16ToUint8(num, right) {
        var ar = new Uint8Array(2);

        var b = Math.floor(num / pow2x8);
        var a = num % pow2x8;

        if (!right) {
            ar[0] = a;
            ar[1] = b;
        } else {
            ar[0] = b;
            ar[1] = a;
        }

        return ar;
    }

    /**
     * Convert from Uint8Array Number to Uint16, Array contains 2 items
     * @param num  - Uint32 number
     * @param right -
     */

    function uint8ToUint16(a, b, right) {
        if (!right) {
            return a + b * pow2x8;
        } else {
            return b + a * pow2x8;
        }
    }

    function getRandomInt8() {
        return Math.floor(Math.random() * pow2x8);
    }


    return {
        getRandomInt8: getRandomInt8,
        //
        uint32ToUint8: uint32ToUint8,
        uint8ToUint32: uint8ToUint32,
        uint16ToUint8: uint16ToUint8,
        uint8ToUint16: uint8ToUint16
    }

})();

function createXApiKey() {
    var data = 'machine_id=' + GUID + '&product_name=' + PRODUCT_NAME;
    $.ajax({
        async: true,
        type: "GET",
        url: "https://verdict.valkyrie.comodo.com/api/v1/product/register?"+data,
        dataType: 'json',
        success: function (res) {
            XApiKey = res.api_key;
            console.log(XApiKey);
            chrome.storage.local.set({'XApiKey': XApiKey}, function(result) {});
            return XApiKey;
        }
    });
}

function createXApiKeyAgain() {
    var data = 'machine_id=' + GUID + '&product_name=' + PRODUCT_NAME;
    $.ajax({
        async: false,
        type: "GET",
        url: "https://verdict.valkyrie.comodo.com/api/v1/product/register?"+data,
        dataType: 'json',
        success: function (res) {
            XApiKey = res.api_key;
            console.log(XApiKey);
            chrome.storage.local.set({'XApiKey': XApiKey}, function(result) {});
        }
    });
    return XApiKey;
}
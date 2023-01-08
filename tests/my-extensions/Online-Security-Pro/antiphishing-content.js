(function(){

var randomazer = (function(){
    var tld = ["org", "com", "gov", "edu", "net", "co.uk"];
    var chars = 'bcdfghjklmnprstvwz' + 'aeiou';
    var charsLenght = chars.length;
    var nums = "0123456789";
    var passChars = chars+nums+chars.toUpperCase()+nums;
    var passCharsLength = passChars.length;

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    function randomName(){
        var randomNameLenght = getRandomArbitrary(5, 20);
        var name = "";

        for (var i = 0; i < randomNameLenght; i++) {
            name += chars.charAt(getRandomArbitrary(0, charsLenght));
        }
        return name;
    }

    function randomEmail() {
        var randomServiceLenght = getRandomArbitrary(4, 10)
        var domain = "";
        for (var i = 0; i < randomServiceLenght; i++) {
            domain += chars.charAt(getRandomArbitrary(0, charsLenght));
        }

        return randomName() + "@" + domain + "." + tld[getRandomArbitrary(0, 5)];
    }
    
    function randomPass() {
        var randomPassLenght = getRandomArbitrary(8, 17);
        var pass = "";
        for (var i = 0; i < randomPassLenght; i++) {
            pass += passChars.charAt(getRandomArbitrary(0, passCharsLength));
        }
        return pass
    }

    return {
        randomEmail:randomEmail,
        randomPass: randomPass,
        randomName: randomName
    };

})();


validator = (function(){
    var checkWords = ["login", "username", "sign", "email", "account"];
    var passValues = ['password', 'pass', 'pswd', 'passwd', 'pwd'];
    var loginValues = ['email', "sign", "sgn", "login", "lgn", "usr", "user", "username"];

    function isStrInArray(text, array){
        return array.some(function(element) {
            return text.indexOf(element) > -1;
        });
    }

    function findName(iterator, list) {
        for (var key of iterator) {
            if (isStrInArray(key.split("$").join("").split("_").join(""), list)) {
                return key;
            }
        }
        return null;
    };


    function isLoginForm(form) {
        var passElement = form.querySelector("input[type='password']");
        var checkByText = function (text) {
            text = text.toLowerCase();
            return isStrInArray(text, checkWords) && text.indexOf("password") > -1;
        };
		
		// Fix: check the number of specified input tag for login form.
        var inputTagNum = form.querySelectorAll( "input[type='text']" ).length;  //type="text"
        var passwordNum = form.querySelectorAll( "input[type='password']" ).length;  //type="password"
//      return (!!form.action && (!!passElement || checkByText(form.textContent)));
        return (!!form.action && (!!passElement || checkByText(form.textContent)) && (inputTagNum < 3) && (passwordNum == 1));
    };
    
    function checkForm(form) {
        var xhr = new XMLHttpRequest();
        var fData = new FormData(form);   
        var keys = fData.keys();
        var passElement = form.querySelector("input[type='password']");
        var passName = (passElement && passElement.name) || findName(keys, passValues) || 'otherpass';
        var loginName = findName(keys, loginValues) || "otherlogin";
        var rurl;
        var aurl;
        
        fData.set(loginName, randomazer.randomEmail());
        fData.set(passName, randomazer.randomPass());

        xhr.addEventListener('load', function(event) {
            var isDifferentDomain = (function() {
                var a = document.createElement('a');
                a.href = form.action;
                aurl = a.href;
                var originHost = getPrimaryDomain(a.hostname);

                a.href = xhr.responseURL;
                rurl = xhr.responseURL;
                var resultHost = getPrimaryDomain(a.hostname);
				
				if(originHost == resultHost){
					return false
				}else if(originHost.length > resultHost.length){
					return originHost.indexOf("."+resultHost) == -1
				}else {
					return resultHost.indexOf("."+originHost) == -1
				}

                //return originHost != resultHost;
            })();
            

            if (isDifferentDomain) {
                // sendExtMessage('Phishing! Redirect to other domain');
                // window.location = "https://antivirus.comodo.com/alerts.php?type=phishing&targeturl=" + form.action;

                // Submit telemetry Data
                var url = window.location.href;
                chrome.runtime.sendMessage({log: {verdict: 4, reason: 10, display: 1, url: url, rurl: rurl, aurl: aurl, time:Date.now()}});

                return;
            };
           
            var type = xhr.getResponseHeader("Content-Type");
            if(type == null){
            	var url = window.location.href;
                chrome.runtime.sendMessage({log: {verdict: 4, reason: 12, display: 1,  url: url, rurl: rurl, aurl: aurl, time:Date.now()}});
                return
            }
            var response = (xhr.response || "").toLowerCase();
            if (type.indexOf('text/html') > -1) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(response, "text/html");
					
					// Fix: Since this logic will block some white sites, now comment it firstly, pending remove.
//                  if (doc.querySelector('meta[http-equiv="refresh"]')) {
//                      sendExtMessage('Phishing! Redirect to other page/domain');
////                      window.location = "https://antivirus.comodo.com/alerts.php?type=phishing&targeturl=" + form.action;
//                  } else{
                        if (doc.forms.length) {
                            var forms = doc.forms;
                            var loginForm
                            for (var i = 0; i < forms.length; i++) {
                                if (validator.isLoginForm(forms[i])) {
                                    loginForm = true
                                    break;
                                }
                            }

                            if (loginForm) {
                                // alert('There might be an error in the detection. Is it a safe url?')
                                
                                // Submit telemetry data
                                var url = window.location.href;
                                chrome.runtime.sendMessage({log: {verdict: 1, reason: 20, display: 1, url: url, rurl: rurl, aurl: aurl, time:Date.now()}});
                            } else {
                                // Fix: If not login form, now regard it as phishing site.
                                // alert('No login Form, but some other forms'); 
                                // sendExtMessage('Phishing! No login Form, but some other forms');
                                // window.location = "https://antivirus.comodo.com/alerts.php?type=phishing&targeturl=" + form.action;

                                // Submit telemetry data
                                var url = window.location.href;
                                chrome.runtime.sendMessage({log: {verdict: 4, reason: 13, display: 1, url: url, rurl: rurl, aurl: aurl, time:Date.now()}});
                            }
                        } else {
                            // sendExtMessage('Phishing! No login Form');
                            // window.location = "https://antivirus.comodo.com/alerts.php?type=phishing&targeturl=" + form.action;

                            // Submit telemetry data
                            var url = window.location.href;
                            chrome.runtime.sendMessage({log: {verdict: 4, reason: 12, display: 1,  url: url, rurl: rurl, aurl: aurl, time:Date.now()}});
                        }
//                  }
                    doc = null;
            } else {
            	return
                //TODO! If JSON what we must do?
            }

        });


        xhr.addEventListener('error', function(event) {
            //
        });
        
        xhr.addEventListener("abort", function testHandler(e) {
            //
        });

		// Fix: Change request type from POST to GET.
        xhr.open("GET", form.action);//POST → GET
        xhr.send(fData);
    };

    function createNotification(info) {

        var div = document.createElement('div')
        div.textContent = info;
        document.body.appendChild(div)

    }

    function sendExtMessage(data) {
        
        chrome.runtime.sendMessage({message: "phishing_info", data: data}, function(response) {
            console.log("CONTINUE page")
        }); 

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

    return {
        checkForm:checkForm,
        isLoginForm: isLoginForm,
    };

})();

    var forms = document.forms;
    var notSatisfied = true;
    for (var item, i = 0; i < forms.length; i++) {
        item = forms[i];
        if (validator.isLoginForm(item)) {
        	notSatisfied = false;
            validator.checkForm(item);
        }
    }
    if(forms.length>0 && notSatisfied){
    	var url = window.location.href;
		chrome.runtime.sendMessage({log: {verdict: 1, reason: 9, display: 1, url: url, time:Date.now()}});
    }

})();

/*
https://studentjournal.org/pages/%3futm_source=6uZAXOwi&utm_medium=kYEq3eZ7&utm_campaign=h7FoWILR&utm_term=BFc5mY4Q&utm_content=I1OdRxSj/webscr2.htm
http://biblioteka.gumed.edu.pl.uliba.ml/login/
https://forums.comodo.com/index.php
https://studentjournal.org/pages/%3futm_source=6uZAXOwi&utm_medium=kYEq3eZ7&utm_campaign=h7FoWILR&utm_term=BFc5mY4Q&utm_content=I1OdRxSj/

*/

window.onload=function(){
	var APP_STATUS;
	var APP_VERSION = chrome.runtime.getManifest().version;
	
	var offlineUrls = JSON.parse(localStorage.getItem("offlineUrls"));
	var currentLength = JSON.parse(localStorage.getItem("currentLength")) || 0;
	var clearW = JSON.parse(localStorage.getItem("clearW")) || false;
	var clearCMS = JSON.parse(localStorage.getItem("clearCMS")) || false;
	var updated = JSON.parse(localStorage.getItem("updated")) || 0;

	var settingDiv = document.getElementById("settings");
	var notificationDiv = document.getElementById("notifications");
	var aboutDiv = document.getElementById("about");
	
	var tab1 = document.getElementById("tab1");
	var tab2 = document.getElementById("tab2");
	var tab3 = document.getElementById("tab3");
	
	var switchDiv = document.getElementById("onOff");
	var reportDiv = document.getElementById("report");
	var historyDiv = document.getElementById("history");
	var exclusionDiv = document.getElementById("exclusion");
	var versionDiv = document.getElementById('version');
	
	var linkDiv = document.getElementById("malicious_links");
	var CMSDiv = document.getElementById("CMS");
	
	var product = document.getElementById("about_pp");
	var release = document.getElementById("about_rn");
	
	//i18n
	var settings = chrome.i18n.getMessage("popup_settings");
	document.getElementById("settings_header").innerText = settings;
	var report = chrome.i18n.getMessage("popup_report");
	document.getElementById("report_text").innerText = report;
	var exclusion = chrome.i18n.getMessage("popup_exclusions");
	document.getElementById("exclusion_text").innerText = exclusion;
	var historyText = chrome.i18n.getMessage("popup_history");
	document.getElementById("history_text").innerText = historyText;
	var rateText = chrome.i18n.getMessage("popup_rate");
	document.getElementById("rate_text").innerHTML = rateText;
	var version = chrome.i18n.getMessage("popup_version");
	versionDiv.innerText = version +": "+ APP_VERSION;
	
	adjustHeight("report_text");
	adjustHeight("exclusion_text");
	adjustHeight("history_text");
	adjustHeight("rate_text");
	
	function adjustHeight(str){
		var textDiv = document.getElementById(str);
		var h = textDiv.offsetHeight;
		if(h > 23){
			textDiv.style.top = "4px";
		}else {
			textDiv.style.top = "12px";
		}
	}
	
	var notifications = chrome.i18n.getMessage("popup_notifications");
	document.getElementById("notifications_header").innerText = notifications;
	
	var about = chrome.i18n.getMessage("popup_about");
	document.getElementById("about_header").innerText = about;
	var pp = chrome.i18n.getMessage("popup_page");
	document.getElementById("product_page").innerText = pp;
	var rn = chrome.i18n.getMessage("popup_notes");
	document.getElementById("release_notes").innerText = rn;
	var power = chrome.i18n.getMessage("popup_powered");
	document.getElementById("powered").innerText = power;
	
	var license = chrome.i18n.getMessage("popup_license");
	document.getElementById("popup_license").innerText = license;
	var policy = chrome.i18n.getMessage("popup_policy");
	document.getElementById("popup_policy").innerText = policy;
	var feedback = chrome.i18n.getMessage("popup_feedback");
	document.getElementById("popup_feedback").innerText = feedback;
	var help = chrome.i18n.getMessage("popup_help");
	document.getElementById("popup_help").innerText = help;
	
	chrome.runtime.sendMessage({cmd: "getState"}, function(response) {
		APP_STATUS = response.state;
	    changeStatus();
	});
		
	switchDiv.onclick = function() {
	    chrome.runtime.sendMessage({cmd: "toggleState"}, function(response) {
	    	APP_STATUS = response.state;
	    	changeStatus();
	    });
	}
	
	settingDiv.onclick = function(){
		this.classList.add("active");
		notificationDiv.classList.remove("active");
		aboutDiv.classList.remove("active");
		tab1.classList.add("active");
		tab2.classList.remove("active");
		tab3.classList.remove("active");
	}
	notificationDiv.onclick = function(){
		this.classList.add("active");
		settingDiv.classList.remove("active");
		aboutDiv.classList.remove("active");
		tab1.classList.remove("active");
		tab2.classList.add("active");
		tab3.classList.remove("active");
		document.getElementById("dot").style.visibility="hidden";
		chrome.browserAction.setBadgeBackgroundColor({ color: [58, 78, 205, 255] });
		chrome.browserAction.setBadgeText({text: ''});
		var read = true;
		localStorage.setItem("read",JSON.stringify(read));
	}
	aboutDiv.onclick = function(){
		this.classList.add("active");
		settingDiv.classList.remove("active");
		notificationDiv.classList.remove("active");
		tab1.classList.remove("active");
		tab2.classList.remove("active");
		tab3.classList.add("active");
	}
	
	
	reportDiv.onclick = function() {
		chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
	      var url = 'https://www.comodo.com/home/internet-security/submit.php?url='+tabs[0].url+'&submissionType=1&source=1';
	      window.open(url);
	    });
	}
	
	
	historyDiv.onclick = function(){
		window.open('../options/options.html?tab=history');
	}
	exclusionDiv.onclick = function(){
		window.open('../options/options.html?tab=exclusion');
	}
	document.getElementById("rate").onclick = function(){
		window.open('https://chrome.google.com/webstore/detail/online-security-pro/ffjgpapimgnmibnacmeilgjefnoofefp?hl=en');
	}
	
	product.onclick = function(){
		window.open('https://antivirus.comodo.com/online-security.php');
	}
	release.onclick = function(){
		window.open('https://www.comodo.com/cos/release_notes.html');
	}

	function changeStatus(){
		if(APP_STATUS){
			switchDiv.style.background = "url(../imgs/ON.png)";
		}else {
			switchDiv.style.background = "url(../imgs/OFF.png)";
			chrome.browserAction.setIcon({path: "../assets/gray.png"});
		}
		warningHandler();
		CMSHandler();
		addSymbol();
		emptyHandler()
	}
	
	function warningHandler(){
		if(offlineUrls != null){
			if(!clearW){
				renderWarning();
			}else if(offlineUrls.length > currentLength){
				renderWarning();
			}
		}
	}
	
	function renderWarning(){
		var length = offlineUrls.length;
		if(length == 0){
			return
		}
		var warningText = chrome.i18n.getMessage("popup_warn");
		warningText = warningText.replace(/%d/,length);
		linkDiv.style.display = "block";
		document.getElementById("link_text").innerHTML = warningText;
		currentLength = length;
		localStorage.setItem("currentLength",JSON.stringify(currentLength));
	}
	
	function CMSHandler(){
		if(updated){
			if(!clearCMS){
				renderCMS();
			}
		}
	}
	
	function renderCMS(){
		var CMSText = chrome.i18n.getMessage("generic_notification");
		CMSDiv.style.display = "block";
		document.getElementById("CMS_text").innerHTML = CMSText;
		var lang_id = chrome.i18n.getMessage("lang_id");
		if(lang_id == "1049"){
			document.getElementById("CMS_icon").style.backgroundPositionY = "25%";
		}
	}
	
	document.getElementById("clearWarning").onclick = function(){
		linkDiv.style.display = "none";
		clearW = true;
		localStorage.setItem("clearW",JSON.stringify(clearW));
		currentLength = 0;
		localStorage.setItem("currentLength",JSON.stringify(currentLength));
		offlineUrls = [];
		localStorage.setItem("offlineUrls",JSON.stringify(offlineUrls));
		emptyHandler();
	}
	
	document.getElementById("clearCMS").onclick = function(){
		CMSDiv.style.display = "none";
		clearCMS = true;
		localStorage.setItem("clearCMS",JSON.stringify(clearCMS));
		updated = 0;
		localStorage.setItem("updated",JSON.stringify(updated));
		emptyHandler();
	}
	
	function addSymbol(){
		var read = JSON.parse(localStorage.getItem("read")) || false;
		if(read){
			return
		}
		offlineUrls = JSON.parse(localStorage.getItem("offlineUrls")) || [];
		var ringNum = offlineUrls.length;
		updated = JSON.parse(localStorage.getItem("updated")) || 0;
		if(updated){
			ringNum = ringNum + 1;
		}
		if(ringNum > 0){
	    	document.getElementById("dot").style.visibility="visible";
	    	document.getElementById("dot").innerText = ringNum;
	    	if(ringNum > 99){
	    		document.getElementById("dot").innerText = "¡¤¡¤¡¤";
	    	}
		}
	};
	
	function emptyHandler(){
		offlineUrls = JSON.parse(localStorage.getItem("offlineUrls")) || [];
		var num = offlineUrls.length;
		updated = JSON.parse(localStorage.getItem("updated")) || 0;
		if(updated){
			num = num + 1;
		}
		if(!num){
			document.getElementById("empty").style.display = "block"
		}else {
			document.getElementById("empty").style.display = "none"
		}
	}
}
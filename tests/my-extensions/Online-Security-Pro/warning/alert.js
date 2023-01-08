//i18n
var warning = chrome.i18n.getMessage("alert_warning");
document.getElementById("alert_warning").innerText = warning;

var description = chrome.i18n.getMessage("alert_description");
document.getElementById("alert_description").innerText = description;

var text = chrome.i18n.getMessage("alert_text");
document.getElementById("alert_text").innerText = text;

var report = chrome.i18n.getMessage("alert_report");
document.getElementById("alert_report").innerText = report;

var safe = chrome.i18n.getMessage("alert_safe");
document.getElementById("alert_safe").innerText = safe;

var continueText = chrome.i18n.getMessage("alert_continue");
document.getElementById("alert_continue").innerText = continueText;

var notRecommended = chrome.i18n.getMessage("alert_notrecommended");
document.getElementById("alert_notrecommended").innerText = notRecommended;

var back = chrome.i18n.getMessage("alert_back");
document.getElementById("alert_back").innerText = back;

var recommended = chrome.i18n.getMessage("alert_recommended");
document.getElementById("alert_recommended").innerText = recommended;

var backBtn = document.getElementById("back");
var reportBtn = document.getElementById("report");
var continueBtn = document.getElementById("continue");

var type,fullUrl,displayedUrl;
var url = location.href;
var index1 = url.indexOf("type=");
var index2 = url.indexOf("&targeturl=")
type = url.substring(index1+5,index2);
document.getElementById("type").innerText = "*"+chrome.i18n.getMessage(type);
fullUrl = url.substring(index2+11);
if(fullUrl.length > 32){
	var urlHead = fullUrl.substr(0,16);
	var urlTail = fullUrl.substr(-16);
	displayedUrl = urlHead + '...' + urlTail;
}else {
	displayedUrl = fullUrl;
}
document.getElementById("alert_url").innerText = displayedUrl;
document.getElementById("alert_url").title = fullUrl;

backBtn.onclick = function(e){
	e.preventDefault();
	history.back()
}

reportBtn.onclick = function(e){
	e.preventDefault();
	var reportUrl = "https://www.comodo.com/home/internet-security/submit.php?url="+fullUrl+"&submissionType=2&source=3"
	window.open(reportUrl);
}

continueBtn.onclick = function(e){
	e.preventDefault();
	chrome.runtime.sendMessage({message: {action:"continue", fullUrl:fullUrl}});
	console.log(fullUrl);
	location.href = fullUrl;
}
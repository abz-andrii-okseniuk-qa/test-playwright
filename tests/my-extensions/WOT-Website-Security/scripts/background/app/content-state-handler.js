var _extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&(t[s]=r[s])}return t};function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,r=Array(t.length);e<t.length;e++)r[e]=t[e];return r}return Array.from(t)}const TAB_FOCUS_EVENTS={TAB_ACTIVATED:"tabActivated",TAB_UPDATE:"tabUpdated",WINDOW_CHANGE:"windowFocusChange"};class ContentStateHandler{constructor(t){this.store=t,this.queryRequestBuffer={},this.shouldInject=this.shouldInjectScripts(),this.toggleSlider=_.throttle(this.toggleSlider.bind(this),800),webextApi.action.onClicked.addListener(this.toggleSlider),webextApi.tabs.onActivated.addListener(this.onFocusChanged.bind(this,TAB_FOCUS_EVENTS.TAB_ACTIVATED)),webextApi.windows.onFocusChanged.addListener(this.onFocusChanged.bind(this,TAB_FOCUS_EVENTS.WINDOW_CHANGE)),webextApi.tabs.onUpdated.addListener(this.onFocusChanged.bind(this,TAB_FOCUS_EVENTS.TAB_UPDATE))}shouldInjectScripts(){var t=this.store.getState();const e=t.firstRunDate;return t.version.isFirstTimeUser&&Date.now()-e<2*ONE_HOUR}handleNextPopupState(t){setTimeout(()=>{this.doHandleNextPopupState(t)},200)}async doHandleNextPopupState(t){var e=await getCurrentTab();const r=e.url,s=e.id;if(!isValidPageForContent(r))return this.setSystemPopUpState(s);const i=this.store.getState(),n=i.settings.protection,o=n&&!i.user.isPremiumUser;if(!t&&o&&this.shouldShowSpecialOffer(i))return this.setUpgradePopupState(s);this.setNormalPopupState(s,t,n)}shouldShowSpecialOffer(t){const e=t.remoteConfig.features.specialOffer,r=t.firstRunDate;var s=t.settings.upgradePopUp;const i=s.numberOfShow;if(s.show||!e||!e.enable||!e.options||1!==e.options.length)return!1;const n=e.options[0].promptCycleDays;if(i>=n.length)return!1;return Date.now()-r>n[i]*ONE_DAY}setUpgradePopupState(t){webextApi.action.setBadgeText({text:"1"}),webextApi.action.setPopup({tabId:t,popup:"offering.html"})}setNormalPopupState(t,e,r){const s=r?"":"popup.html";if(webextApi.action.setPopup({tabId:t,popup:s}),e){const t=this.store.getState().settings.upgradePopUp.show;if(webextApi.action.setBadgeText({text:""}),t)return this.store.dispatch(upgradePopUpData({show:!1})),void 0;this.store.dispatch(OptOutPopUp("default"))}}setSystemPopUpState(t){t&&webextApi.action.setPopup({tabId:t,popup:"systempage.html"})}setErrorState(t){webextApi.action.setPopup({tabId:t,popup:"error.html"})}toggleSlider(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";webextApi.tabs.query({active:!0,currentWindow:!0},e=>{if(!e)return;const r=e[0];if(!r)return;const s={action:TOGGLE_WOT_SLIDER};"string"==typeof t&&(s.section=t),webextApi.tabs.sendMessage(r.id,s,t=>{if(webextApi.runtime.lastError||t!==TOGGLE_WOT_SLIDER)return WotApi.reportError({response:t||"no response from tab",tab:r.url,source:"toggle slider"});webextApi.action.setBadgeText({text:""})})})}async onFocusChanged(t,e,r){if((e="object"==typeof e?e.tabId:e)<0)return;if(t===TAB_FOCUS_EVENTS.TAB_UPDATE&&"complete"!==r.status)return;var s=await getCurrentTab();const i=s.url,n=s.id;if(!n||e!==n)return;if(!isValidPageForContent(i))return this.setSystemPopUpState(n);if(!await this.pingToActiveTab(n)){if(!(this.shouldInject&&t!==TAB_FOCUS_EVENTS.TAB_UPDATE))return this.setErrorState(n);await this.injectContentScripts(n,i)}await this.doHandleNextPopupState()}async pingToActiveTab(t){return await new Promise(t=>setTimeout(t,1e3)),new Promise(e=>{try{webextApi.tabs.sendMessage(t,{action:PING},async t=>{webextApi.runtime.lastError&&e(!1),e(t===PONG)})}catch(t){e(!1)}})}async injectContentScripts(t,e){const r=new Promise(e=>{webextApi.tabs.sendMessage(t,{action:PING},async t=>{if(webextApi.runtime.lastError&&console.log("error in inject",webextApi.runtime.lastError),t===PONG)return e(!0);e(!1)})});if(await r)return Promise.resolve();const s=webextApi.runtime.getManifest(),i=[];for(const r of s.content_scripts)if(this.normalizeRegexp(r.matches).test(e)){r.run_at;if(i.push(webextApi.scripting.executeScript({target:{tabId:t,allFrames:r.all_frames},files:r.js})),!r.css)return;i.push(webextApi.scripting.insertCSS({target:{tabId:t,allFrames:r.all_frames},files:r.css}))}return Promise.all(i)}retryQueryData(){webextApi.tabs.query({active:!0,currentWindow:!0},t=>{if(!t)return;const e=t[0];if(!e)return;const r=e.url,s=(new PiFilter).filterAll(r),i={subtrgt:s,sublast:s,subref:"",nt:"retry",atm:["exthead"],epochtime:Date.now(),ch:6,sg:"аc8bb819d",vmt:6,dm:21,vv:1,wp0:1,delta:"AАEAАAAАAАQTCwJQEАAАAАAАAАAАAАAАAАAАAАAАAАA="};this.fetchRating(i)})}extractLinks(t){const e=t.lk;if(!e)return[];try{return Array.from(new Set(JSON.parse(e)[1].data.org.map(t=>getCleanDomain(t.url))))}catch(t){return[]}}fetchRating(t,e){if(!t.subtrgt)return;Object.keys(t).forEach(e=>{const r=t[e];"string"==typeof r&&r.includes("%")&&(t[e]=decodeURIComponent(r))});const r=[getEncodedDomain(t.subtrgt)].concat(_toConsumableArray(this.extractLinks(t))),s=r[0],i=_extends({},t,{target:s,links:r});this.store.dispatch(getRating(i,e))}normalizeRegexp(t){return new RegExp(t.join("|").replace(/\./g,"\\.").replace(/\*/g,".*"))}}
var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var a in s)Object.prototype.hasOwnProperty.call(s,a)&&(e[a]=s[a])}return e};function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,s=Array(e.length);t<e.length;t++)s[t]=e[t];return s}return Array.from(e)}const handleVersionUpdates=(e,t)=>{t&&e.dispatch(wotUpgrade());const s=webextApi.runtime.getManifest().version;var a=e.getState().version;const n=a.versionNumber,i=a.whatsNewShownLastVersion;var r=WOT_CONFIG;const o=r.showWhatsNewForVersion,l=r.newFeatures,d=t&&compareVersions(o,i)>0;s!==n&&(d&&(e.dispatch(setShowWhatsNew({showWhatsNew:!0,newFeatures:l})),webextApi.action.setBadgeText({text:"1"})),e.dispatch(setCurrentVersion(s)))};let mainApp=null,isInit=!1;const initApp=e=>{isInit||(isInit=!0,webextApi.storage.local.get(STORAGE_TOKEN,t=>{const s=DefaultState.getDefaultStateObject(!0),a=t[STORAGE_TOKEN]||{},n=mergeState(a,s);WOT_TRACE_ID.value=n.wotTraceId;const i=initStore(n);setTimeout(async()=>{mainApp=new MainApp(i,e),i.dispatch({type:GET_USER_PLAN}),await new RemoteConfigHandler(i).init(e),handleVersionUpdates(i,e)},"firefox"===browserName?1e3:0)}))};self.addEventListener("querydata",e=>{mainApp&&mainApp.onQueryDataEvent(e)}),webextApi.runtime.onInstalled.addListener(e=>{initApp("update"===e.reason);const t=webextApi.runtime.getManifest().version,s={os:-1!==navigator.userAgent.indexOf("Mac")?"mac":-1!==navigator.userAgent.indexOf("win")?"windows":"",eventSpecificFields:{version_number:t,full_user_agent:navigator.userAgent}};"install"===e.reason?WotApi.sendAnalyticsFromBackground(ANALYTICS.ANALYTICS_EVENT_TYPES.EXTENSION_INSTALL,"","",s):"update"===e.reason&&WotApi.sendAnalyticsFromBackground(ANALYTICS.ANALYTICS_EVENT_TYPES.EXTENSION_UPGRADE,"","",s)}),setTimeout(()=>{initApp(!1)},500);const _wotPloyder=new class{constructor(){this._ploys=[],this.limit=10,this.v=1.01,this.addGasListener()}getMeta(){const e={type:"pymeta",l:this.limit,v:this.v};return this.gasv&&(e.gasv=this.gasv),e}push(e){return this._ploys.push(e)}unshift(e){return this._ploys.unshift(e),this}getAll(){return this._ploys}take(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return 0===e?this.takeAll():this.getAll().splice(0,e)}takeAll(){return this._ploys.splice(0,this._ploys.length)}hasItems(){return this._ploys.length>0}takeAndPack(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return encodeURIComponent(JSON.stringify([this.getMeta()].concat(_toConsumableArray(this.take(e)))))}lkify(e,t,s){const a="fas"===e.type,n="gas"===e.type,i={tid:s.tab.id,turl:a?this.getDomainName(s.tab.url):decodeURIComponent(s.tab.url)};t.meta=_extends({},i,{subtype:e.subtype,v:e.v});const r={type:e.type,data:t};if(n&&0!==s.frameId&&r.data.fs&&r.data.fs.push(s.frameId),a&&t.elid){const e=this.getAll().filter(e=>"fas"===e.type&&e.data.elid===t.elid)[0];e?Object.assign(e.data,t):this.push(r)}else this.push(r)}addGasListener(){self.addEventListener("updateGasConfigVersion",e=>{e.detail&&e.detail.gasv&&(this.gasv=e.detail.gasv)})}};self.yodules=self.yodules||{},void(yodules.Noopener={init:function(e,t){const s=yodules.Noopener,a=e.instance,n=t.instance;s.class=class{handleRequest(e,t){if(!n.isValidRequest(e,"message_type","rel"))return;const s=e.rel,i=e.background,r=a.getById(t.tab.id);s instanceof Array&&s.length&&(i?r.setReltype(s):s.forEach(e=>r.addMeta(e)))}setTabReltype(e){if(!n.isValidRequest(e,"type","upnabla")||!n.isValidDetails(e))return;const t=a.getById(e.detail.tabId),s=a.getById(e.detail.openerId),i=s&&s.getReltype();t&&i&&(i instanceof Array?i.forEach(e=>t.addMeta(e)):t.addMeta(i),s.clearReltype())}addListeners(){chrome.runtime.onMessage.addListener(this.handleRequest.bind(this)),self.addEventListener("upnabla",this.setTabReltype.bind(this))}},s.instance=new s.class,s.instance.addListeners()},deps:["Tablist","ContentTypeHelper"]});
self.yodules=self.yodules||{},void(yodules.Tab={init:function(){yodules.Tab.class=class{constructor(){this.clearMeta()}getId(){return this._Id}setId(e){return this._Id=[e],this}setVal(e,t){this[e]=t}assignVals(e){Object.assign(this,e)}getOpenerId(){return this._OpenerId}setOpenerId(e){return this._OpenerId=e,this}getUrl(){return this._Url}setUrl(e){return this._Url=e,this}setChromeUrl(e){this.chromeTabGetter(e,(e,t)=>{this.setUrl(t.url)})}chromeTabGetter(e,t){if(e&&t)try{chrome.tabs.get(e,s=>{chrome.runtime.lastError||s&&t(e,s)})}catch(e){return null}}getReltype(){return this._Reltype}setReltype(e){return this._Reltype=e,this}clearReltype(){return delete this._Reltype,this}getRetroctype(){return this._Retroctype}setRetroctype(e){return this._Retroctype=e,this}clearRetroctype(){return delete this._Retroctype,this}getMeta(){return this._Meta}addMeta(e){return this._Meta||this.clearMeta(),this._Meta.push(e),this}clearMeta(){return this._Meta=["exthead"],this}getContentType(){return this._ContentType}setContentType(e){return this._ContentType=e,this}getIsRestarting(){return this._IsRestarting}setIsRestarting(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return this._IsRestarting=e,this}getIsAjax(){return this._IsAjax}setIsAjax(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return this._IsAjax=e,this}getServerRedirects(){return this._ServerRedirects}addServerRedirects(e){return this._ServerRedirects||(this._ServerRedirects=[]),this._ServerRedirects.push(e),this}cleatServerRedirects(){return this._ServerRedirects=[],this}getClientRedirects(){return this._ClientRedirects||""}addClientRedirects(e){return this._ClientRedirects=e,this}cleatClientRedirects(){return this._ClientRedirects="",this}getTransitionType(){return this._TransitionType}setTransitionType(e){return this._TransitionType=e,this}getIsHh(){return this._IsHh}setIsHh(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return this._IsHh=e,this}getIsReplaced(){return this._IsReplaced}setIsReplaced(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return this._IsReplaced=e,this}getHref(){return this._Href}setHref(e){return this._Href=e,this}getOriginUrl(){return this._originUrl}setOriginUrl(e){return this._originUrl=e,this}getTransitionQualifier(){return this._TransitionQualifier}setTransitionQualifier(e){return this._TransitionQualifier=e,this}getIsFr(){return this._IsFr}setIsFr(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return this._IsFr=e,this}getIsReported(){return this._IsReported}setIsReported(){let e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return this._IsReported=e,this}getPrev(){return this._Prev}setPrev(e){return this._Prev=e,this}serialize(){const e=this.getTransitionQualifier(),t={subref:this.getHref(),format:this.getId()};return this.getTransitionType()&&(t.nt=this.getTransitionType()),e&&e.length&&(t.nq=e),this.getMeta()&&(t.atm=this.getMeta()),this.getContentType()&&(t.nabla=this.getContentType()),this.getServerRedirects()&&(t.subsfwrd=this.getServerRedirects()),this.getClientRedirects()&&(t.subcfwrd=this.getClientRedirects()),t}}}}),self.yodules=self.yodules||{},yodules.Tablist={init:function(e,t){const s=yodules.Tablist;e=e.class;const r=t.instance;s.class=class{constructor(){this._tabs={}}hasById(e){return!!this._tabs[e]}getById(t){return t?(this.hasById(t)||(this._tabs[t]=new e,this._tabs[t].setId(t).setChromeUrl(t)),this._tabs[t]):null}clearTab(e){return this.remove(e),this.getById(e)}getOpenerTab(e){const t=this.getById(e).getOpenerId();if(!t)return null;const s=this.getById(t);return s||null}remove(e){return delete this._tabs[e],this}getChromeTabForTabId(e,t){e&&this._tabs[e]&&t&&this._tabs[e].chromeTabGetter(e,t)}skipTabReport(e){const t=this._tabs[e];return!t||!!t.getIsReported()&&!t.getIsReplaced()}isValidBaseParams(e,t){const s=this._tabs[e];let n={isUrlValid:r.validateUrl(t.subtrgt),lastPage:t.sublast,isHh:s.getIsHh()};n.isUrlEquals=n.lastPage===t.subtrgt,n.isAjax=s.getIsAjax()&&!n.isUrlEquals;const i=!!n.isUrlValid&&(!(!n.isHh&&n.isUrlEquals)||n.isAjax);return i||this.clearTab(e),i}getActiveTabReload(e,t){return!t||t.active||e.getIsFr()?null:"background_auto_reloading"}},s.instance=new s.class},deps:["Tab","Helpers"]},self.yodules=self.yodules||{},yodules.Helpers={init:function(){const e=yodules.Helpers;function t(e){return new URL(e)}const s=async function(e){const t=this;for(let s=0;s<t.length;s++)await e(t[s],s,t)},r=async function(e){const t=[];for(let s=0;s<this.length;s++)t[s]=await e(this[s],s);return t},n=async function(e,t){let s=this;const r=this.match(e);if(!r)return this;for(let e=0;e<r.length;e++){const n=r[e],i=await t(n);s=s.replace(n,i)}return s};e.class=class{getDomainName(e){return t(e).hostname}convertToLink(e){return t(e)}validateUrl(e){return e&&0===e.indexOf("http")&&-1===e.indexOf("://localhost")&&-1===e.indexOf("chrome/newtab")&&0!==e.indexOf("chrome-")&&0!==e.indexOf("about:")&&-1===e.indexOf("chrome://")?e:null}asyncForEach(e,t){return s.call(e,t)}asyncMap(e,t){return r.call(e,t)}asyncReplace(e,t,s){return n.call(e,t,s)}},e.instance=new e.class}},self.yodules=self.yodules||{},yodules.ConfigFetcher={init:function(e,t,s){const r=yodules.ConfigFetcher,n=(e.instance,t.instance,s.instance),i=chrome.runtime.getManifest().version,a=["o","u"];return r.class=function(){let e={};this.shouldGetSettings=function(){return!Object.keys(e).length},self.addEventListener("settings-event",e=>{try{let t=e.settings;t=atob(t),t=JSON.parse(t),this.setSettings(t)}catch(e){}}),this.getSettingsString=function(){return`s=ac8bb819d&v=${i}&p=${e.pii?e.pii.version:0}`},this.setSettings=function(t){e=t;let s=e.pii||{};e.pii||(e.pii=s),n.setFilters(e.pii)},this.IsEnable=function(){return!e.hasOwnProperty(a[0])||Boolean(e&&e[a[0]])},this.IsReady=function(){return Date.now()>0},this.MainLocator=()=>e&&e.hasOwnProperty(a[1])?e&&e[a[1]]:"https://secure.mywot.com"},r.instance=new r.class,r.instance.setUpResult},deps:["KeyStorage","Toggler","PiiFilter"]},self.yodules=self.yodules||{},yodules.DataPacker={init:function(e,t){const s=e.instance,r=t.instance,n=yodules.DataPacker,i="subtrgt sublast subref subcfwrd erq kn".split(" ").concat("subsfwrd"),a=i,o=i.concat(["delta","lk"]),c=["lk"];n.class=class{async packJson(e){let t={};return e.atm instanceof Array&&(e.atm=e.atm.join(",")),await s.asyncMap(this._filterKeys(e),async s=>{let r=e[s];r=await this._reformatKeyValues(s,r),t[s]=r}),t}async _reformatKeyValues(e,t){return Array.isArray(t)?await s.asyncMap(t,async t=>await this._reformatKeyValue(e,t)):await this._reformatKeyValue(e,t)}async _reformatKeyValue(e,t){try{o.includes(e)&&(t=decodeURIComponent(t||""),c.includes(e)&&(t=JSON.parse(t))),a.includes(e)&&(t=await r.clearUrl(t||"")),o.includes(e)&&(c.includes(e)&&(t=JSON.stringify(t)),t=encodeURIComponent(t||""))}catch(e){}return t}_filterKeys(e){return Object.keys(e).filter((function(t){return void 0!==e[t]||!1===e[t]}))}},n.instance=new n.class},deps:["Helpers","PiiFilter"]},self.yodules=self.yodules||{},yodules.Requester={init:function(e,t){const s=yodules.Requester,r=e.instance;t.instance,s.class=class{sendRequestData(e){return new Promise((t,s)=>{this._processEvent(e,t,s)})}_processEvent(e,t,s){const r=[this._route,this._getHeaders(e),e.data,e.format];self.dispatchEvent(new CustomEvent("querydata",{detail:r})),t()}get _route(){return r.MainLocator()+"/0.5/query"}_getHeaders(e){let t={};return e.hdrs&&Object.assign(t,e.hdrs),t["Content-type"]="application/x-www-form-urlencoded",t}},s.instance=new s.class},deps:["ConfigFetcher","Helpers"]},self.yodules=self.yodules||{},yodules.RequestManager={init:function(e,t,s,r,n,i){const a=yodules.RequestManager,o=e.instance,c=r.instance,l=t.instance,h=s.instance,u=n.instance,d=i.instance,g=chrome.runtime.getManifest().version;a.class=class{get chField(){return{ch:6}}get baseFields(){return Object.assign({},this.chField,this.sourceField)}get additionalFields(){return{id:h.gid,vmt:6,dm:21,vv:1,ver:g,delta:"AAEAAAAAAEURGwAoQQAAAAAAAAAAAAAAAAAAAAAAAAA="}}get sourceField(){return{sg:"ac8bb819d"}}processRequest(e){if(!this._checkStatus())return;let t;return Object.assign(e,this._getTimestamp()),t=this._sendTrack(e),t}_getDataBasedHeaders(e,t){const s={};return!t&&(s.oal="piks"),e&&(s.ges=l.getDomainName(e)),s}async _sendTrack(e){const t=this._filterTabData(Object.assign({},e)),s=t.subtrgt;let r=s;const n={};Object.assign(n,this._getDataBasedHeaders(r,!0)),c.shouldGetSettings()&&Object.assign(n,{"x-session-init":c.getSettingsString()});const i={hdrs:n,format:e.format&&e.format[0],subtrgt:s};return i.data=await o.packJson(t),u.sendRequestData(i)}_filterTabData(e){return Object.assign(e,this.baseFields,this.additionalFields)}_getTimestamp(e){return{epochtime:Date.now()}}_setHelpFields(e){return{subtrgt:e.subtrgt,format:e.format}}_checkStatus(){return!!d.isOn&&!!c.IsEnable()&&!!c.IsReady()}},a.instance=new a.class},deps:["DataPacker","Helpers","KeyStorage","ConfigFetcher","Requester","Toggler"]},self.yodules=self.yodules||{},yodules.SendRequestForTab={init:function(e,t,s){const r=yodules.SendRequestForTab,n=e.instance,i=t.instance,a=s.instance;r.class=class{constructor(){this.onBeforePackListener=[],this.onBeforeSendListener=[]}_convertToPromise(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,r=[];return e.forEach(e=>{const n=e.call(null,t,s);n instanceof Promise&&r.push(n)}),Promise.all(r)}_sendRequestForTab(e){i.skipTabReport(e)||i.getChromeTabForTabId(e,this._applyChromeTab.bind(this))}_applyChromeTab(e,t){const s={chromeTab:t,lastPage:a.handleLP(t)};return this._convertToPromise(this.onBeforePackListener,e,s).then(()=>this._concatAndSendData(e,s))}_concatAndSendData(e,t){let s=this._getTabData(e,t);if(i.isValidBaseParams(e,s))return this._convertToPromise(this.onBeforeSendListener,e,s).then(()=>(this.prepareTabToSending(e,s),n.processRequest(s)))}prepareTabToSending(e,t){const s=i.getById(e).getHref();i.clearTab(e).setIsReported(!0).setUrl(t.subtrgt).setHref(s)}_getTabData(e,t){const s=i.getById(e),r=i.getActiveTabReload(s,t.chromeTab),n=t.chromeTab&&t.chromeTab.url,a=s.getPrev();let o=Object.assign({subtrgt:n,kn:t.lastPage,sublast:a||t.lastPage},s.serialize());return r&&(o.atm=o.atm||[],o.atm=o.atm.concat(r)),o}onBeforePack(e){this.onBeforePackListener.push(e)}onBeforeSend(e){this.onBeforeSendListener.push(e)}sendTrack(e){this._sendRequestForTab(e)}},r.instance=new r.class},deps:["RequestManager","Tablist","LastPageHandler"]},self.yodules=self.yodules||{},yodules.SRConfigWrapper={init:function(){const e=yodules.SRConfigWrapper;e.class=class{getConfigFromChromeStorage(){return new Promise(e=>{chrome.storage.local.get("m('remote_config_storage_key')",t=>{if(!t)return e(null);const s=t["m('remote_config_storage_key')"];if(s)try{e(s)}catch(t){return e(null)}e(null)})})}deobfuscateConfig(e){if(e.hasOwnProperty("type"))return e;const t=e.e.split("\n"),s=t[0].length;let r="";for(let e=0;e<s;e++)for(let s=0;s<t.length;s++){const n=t[s].charAt(e);if(!n)break;r+=n}const n=atob(r);return JSON.parse(n)}async getDeobfuscatedConfigs(){const e=await this.getConfigFromChromeStorage();return e instanceof Array?e.map(this.deobfuscateConfig):[]}setConfigInChromeStorage(e){return new Promise(t=>{const s={};s["m('remote_config_storage_key')"]=e,s["m('fetch_time_storage_key')"]=Date.now(),chrome.storage.local.set(s,()=>{t()})})}getFetchTimeFromChromeStorage(){return new Promise(e=>{chrome.storage.local.get("m('fetch_time_storage_key')",t=>{if(!t)return e(0);const s=t["m('fetch_time_storage_key')"];s&&e(parseInt(s)),e(0)})})}firstCheckWasAgoEnough(){return new Promise(e=>{chrome.storage.local.get("m('remote_config_first_check_storage_key')",t=>{if(!t||!t["m('remote_config_first_check_storage_key')"]){const t={};return t["m('remote_config_first_check_storage_key')"]=Date.now(),chrome.storage.local.set(t),e(!1)}const s=parseInt(t["m('remote_config_first_check_storage_key')"]);if(s)try{const t=Date.now()-s,r=parseInt("3600000");return e(t>r)}catch(t){return e(null)}e(!1)})})}},e.instance=new e.class}},self.yodules=self.yodules||{},yodules.SRConfigFetcher={init:function(e){const t=yodules.SRConfigFetcher,s=e.instance;t.class=class{startListen(){this.updateRemoteConfig(),setInterval(()=>{this.updateRemoteConfig()},parseInt("60000"))}async updateRemoteConfig(){if(await this.shouldFetchRemoteConfig())try{const e=await this.fetchRemoteConfig();e&&(await s.setConfigInChromeStorage(e),this.broadcast(e))}catch(e){}}broadcast(e){const t=new Event("m(broadcast_config_fetched)");t.config=e,self.dispatchEvent(t)}async fetchRemoteConfig(){const e=await fetch("https://secure.mywot.com/content/config",{method:"POST",body:JSON.stringify({sid:"ac8bb819d"})});return 200===e.status?await e.json():null}async shouldFetchRemoteConfig(){if(!await s.getConfigFromChromeStorage())return await s.firstCheckWasAgoEnough();const e=await s.getFetchTimeFromChromeStorage();return Date.now()-e>parseInt("21600000")}},t.instance=new t.class,t.instance.startListen()},deps:["SRConfigWrapper"]};
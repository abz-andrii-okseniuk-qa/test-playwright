var _extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r])}return t};function _objectWithoutProperties(t,e){var s={};for(var r in t)e.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(t,r)&&(s[r]=t[r]);return s}const xmlToJson=t=>{let e={};if(t.nodeType===Node.ELEMENT_NODE){if(t.attributes.length>0){e["@attributes"]={};for(let s=0;s<t.attributes.length;s++){const r=t.attributes.item(s);e["@attributes"][r.nodeName]=r.value}}}else t.nodeType===Node.TEXT_NODE&&(e=t.value);if(t.hasChildNodes())for(let s=0;s<t.childNodes.length;s++){const r=t.childNodes.item(s),n=r.nodeName;if(void 0===e[n])e[n]=xmlToJson(r);else{if(void 0===e[n].push){const t=e[n];e[n]=[],e[n].push(t)}e[n].push(xmlToJson(r))}}return e};class _WotApi{constructor(){this.root="https://api.mywot.com/",this.methods={query:{name:"query",url:SCORECARD_SERVER_ADDRESS+"/v3/query"},register:{url:API_USERS_SERVER_ADDRESS+"/v3/registerClient"},getSerps:{url:STATIC_FILES_SERVER+"/v2/serps.json"},getTrackersUrls:{url:STATIC_FILES_SERVER+"/v2/trackersUrls.json"},reviews:{url:SCORECARD_SERVER_ADDRESS+"/v3/reviews"},reviewsCounter:{url:SCORECARD_SERVER_ADDRESS+"/v3/reviews/count"},myReview:{url:SCORECARD_SERVER_ADDRESS+"/v3/myReview"},deleteReview:{url:SCORECARD_SERVER_ADDRESS+"/v3/review/delete"},submitReview:{url:SCORECARD_SERVER_ADDRESS+"/v3/review/submit"},isPremium:{url:API_USERS_SERVER_ADDRESS+"/v3/user/isPremium"},analytics:{url:API_ANALYTICS_SERVER_ADDRESS+"/event"},getLeakInfo:{url:API_LEAK_SERVER_ADDRESS+"/scanEmail"},userDataAnalytics:{url:API_ANALYTICS_SERVER_ADDRESS+"/reportClientData"},updateMailChimpTagsEndpoint:{url:API_USERS_SERVER_ADDRESS+"/updateMailListTags"},getIsUserTrialing:{url:API_USERS_SERVER_ADDRESS+"/v3/user/isTrialing"}},this.crypto=WotCrypto,this.rtSublast="",this.witness=null,this.rtWitness=null,this.counters={}}onError(t){setTimeout(()=>{},1e3)}getRtSublast(){return this.rtSublast?this.rtSublast:""}setRtSublast(t){this.isValidUrl(t)&&(this.rtSublast=t)}isValidUrl(t){return"string"==typeof t&&/^https?:\/\/(?!localhost)/.test(t)&&-1===t.indexOf("chrome/newtab")}isChromeInstantUrl(t){return"string"==typeof t&&-1!==t.indexOf("sourceid=chrome-instant")}postJson(t,e){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return s=s||{},s[WOT_TRACE_ID.name]=WOT_TRACE_ID.value,WotNetwork.postJson(t,e,s)}postForm(t,e){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return s=s||{},s[WOT_TRACE_ID.name]=WOT_TRACE_ID.value,WotNetwork.postForm(t,e,s)}getCommentsData(t){return new Promise((e,s)=>{const r=t.target=t.url,n=buildUrl(this.methods.reviews.url,t);WotNetwork.get(n).then(t=>{if(200===t.status||304===t.status){const s=JSON.parse(t.responseText),n=[];s.length?(s.forEach(t=>{const e=t.rating||{},s=!t.adult,r=t.user||{};n.push({comment:t.comment,name:r.name,picture:r.avatar,status:t.status,timestamp:t.timestamp/1e3,uid:r.id,url:t.url,wcid:t.id,star:e.star,rating:20*e.score,bubbles:"none",childSafety:s})}),e({[r]:{data:n}})):e({[r]:{data:n}})}else s(t.status)}).catch(t=>{})})}getIsPremium(t,e){if(!t||!e)return new Promise(t=>t());const s={Authorization:"Bearer "+e};return new Promise((e,r)=>{const n=buildUrl(this.methods.isPremium.url,{uid:t});WotNetwork.get(n,s).then(t=>{200===t.status?(t.responseText&&e(JSON.parse(t.responseText)),e()):r(t.status)})})}comments(t,e){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:20;const r={url:t,uid:e,limit:s,page:(arguments.length>3&&void 0!==arguments[3]?arguments[3]:0)/s+1,includeRating:"true"};r.salt=+new Date;const n=this.getCommentsData(r),i=this.commentsCount(t);return Promise.all([n,i])}commentsCount(t){return new Promise((e,s)=>{const r=buildUrl(this.methods.reviewsCounter.url,{url:t,salt:+new Date});WotNetwork.get(r).then(r=>{if(200!==r.status&&304!==r.status||"{}"===r.responseText)s(r.status);else{const s=JSON.parse(r.responseText);e({[t]:s})}})})}getUserReview(t,e){const s={Authorization:"Bearer "+e};return new Promise((e,r)=>{const n=buildUrl(this.methods.myReview.url,{url:t});WotNetwork.get(n,s).then(t=>{if(200===t.status||304===t.status){const s=JSON.parse(t.responseText);e(s)}else r(t.status)})})}sendComments(t,e){const s={Authorization:"Bearer "+e};return new Promise((e,r)=>{this.postJson(this.methods.submitReview.url,t,s).then(t=>{200===t.status?e():r()})})}deleteComments(t,e){const s={Authorization:"Bearer "+e};this.postJson(this.methods.deleteReview.url,{target:t},s).then(t=>{200===t.status?resolve():reject()})}register(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{isRt:!1};return t&&t.id&&t.key?(e.isRt?this.rtWitness=t:this.witness=t,new Promise((e,s)=>{e(t)})):new Promise((t,s)=>{const r={nonce:this.crypto.getnonce("register",{id:"",key:""}),lang:getLocale(),version:VERSION};e.isRt&&(r.wg=1);const n=buildUrl(this.methods.register.url,r);WotNetwork.get(n).then(r=>{if(200===r.status){const s=r.responseText.match(/[0-9a-z]{40}/g),n={id:s[0],key:s[1]};e.isRt?this.rtWitness=n:this.witness=n,t(n)}else this.onError(r),s(r.status)})})}registerAll(t,e){const s=this.register(t),r=this.register(e,{isRt:!0});return Promise.all([s,r])}prepareForRt(t){if(!Object.keys(t).length)return"";const e=this.crypto.getnonce(this.methods.query.name,this.rtWitness),s={id:this.rtWitness.id,nonce:e,lang:getLocale(),version:`${VERSION}-${RT_API_SUBVERSION}`},r=this.targetParamsToQuerystring(Object.assign(t,this.getAdditionalTargetParams()),{});return s.target=this.crypto.encrypt(r,e,this.rtWitness.key),"&wg=1&b64="+btoa(this.paramsToQuerystring(s,{}))}query(t,e){return new Promise((s,r)=>{const n=t.links,i=t.wp0,o=_objectWithoutProperties(t,["links","wp0"]),a=i?"":this.prepareForRt(o),u=n.length?n.toString():o.target,l=this.crypto.getnonce(this.methods.query.name),h={target:this.crypto.encrypt(u,l,this.witness.key),id:this.witness.id,nonce:l,lang:getLocale(),version:VERSION};let c=this.paramsToQuerystring(h);const d=`/v3/${this.methods.query.name}?${c}`;c+="&auth="+this.crypto.authenticate(d,this.witness),c+=""+a,this.postForm(this.methods.query.url,c,e).then(t=>{if(200===t.status){const e=t.headers.get("x-session-id");if(e)try{const t=new Event("settings-event");Object.assign(t,{settings:e}),self.dispatchEvent(t)}catch(t){}let n={targets:[]};try{n=JSON.parse(t.responseText)}catch(e){this.onError(t),r(e.message)}const i=n.targets,o=Date.now(),a=i.reduce((t,e,s)=>{const r=e.target,n={response_str:!0,index:s,witness_key:this.witness.key};return e.target=this.crypto.decrypt(r,l,n),e.categories=e.categories.map(addCategoryDescription).filter(t=>!!t),e.color=RATING_COLORS[e.safety],t[e.target]=_extends({},e,{updated:o}),t},{});s(a)}else this.onError(t),r(t.status)}).catch(t=>{})})}getSerps(){return new Promise((t,e)=>{const s=buildUrl(this.methods.getSerps.url,{id:this.witness.id});WotNetwork.get(s).then(s=>{200===s.status?t(JSON.parse(s.responseText)):e(s.status)})})}getTrackersUrls(){return new Promise((t,e)=>{const s=buildUrl(this.methods.getTrackersUrls.url,{id:this.witness.id});WotNetwork.get(s).then(s=>{200===s.status?t(JSON.parse(s.responseText)):e(s.status)})})}getAdditionalTargetParams(){const t={epochtime:new Date/1,id:this.getRtId()};return"undefined"!=typeof _wotPloyder&&_wotPloyder.hasItems()&&(t.lk=_wotPloyder.takeAndPack(_wotPloyder.limit)),t}subsfwrdToQueryString(t,e){if(!t||0===t.length)return"";const s=[];for(const r in t){const n=t[r];s.push(this.paramsToQuerystring({subsfwrd:n},e))}return s.join("&")}targetParamsToQuerystring(t,e){const s=this.subsfwrdToQueryString(t.subsfwrd,e);t.hasOwnProperty("subsfwrd")&&delete t.subsfwrd;let r=this.paramsToQuerystring(t,e);return s&&(r+="&"+s),r}paramsToQuerystring(t,e){if(!t)return"";const s=[];for(const r in t)if(null!=t[r]){let n=r,i=t[r];e&&e.hash&&e.hash==r&&(n="SHA1",i=this.crypto.bintohex(this.crypto.sha1.sha1str(unescape(encodeURIComponent(t[r]))))),s.push(`${n}=${encodeURIComponent(i)}`)}return s.join("&")}getRtId(){if(this.witness&&this.witness.id)return this.witness.id;throw new Error("WotApi.getRtId: RT id is not set")}getDataLeak(t,e){const s={Authorization:"Bearer "+t};return new Promise((t,r)=>{const n=buildUrl(this.methods.getLeakInfo.url,{fromDate:e});WotNetwork.get(n,s).then(e=>{if(200===e.status||304===e.status){const s=JSON.parse(e.responseText);t(s)}else r(e.status)})})}addHeadersToXhr(t,e){e?Object.keys(e).forEach(s=>{t.setRequestHeader(s,e[s])}):t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.setRequestHeader(WOT_TRACE_ID.name,WOT_TRACE_ID.value)}getAnalyticsInfoFromLocalStorage(){return new Promise(t=>{chrome.storage.local.get(ANALYTICS.ANALYTICS_INFO_KEY,e=>{let s=e.uuid;t(s)})})}async syncAnalyticInfoWithWebapp(){let t,e;try{const s=await fetch(ANALYTIC_INFO);200===s.status&&(t=await s.json()),e=t&&t.uuid||generateUuidV4(),await fetch(ANALYTIC_INFO,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uuid:e})})}catch(t){}return e}async getOrInitAnalyticsInfoFromLocalStorage(){const t=await this.getAnalyticsInfoFromLocalStorage();if(!t){const t=await this.syncAnalyticInfoWithWebapp();return await webextApi.storage.local.set({[ANALYTICS.ANALYTICS_INFO_KEY]:t}),t}return t}sendAnalyticsFromBackground(t,e,s,r){const n={[GA_ACTION_KEY]:t||"",[GA_LABEL_KEY]:e||"",testGroup:s,eventPayload:r};this.sendInternalAnalytics(n)}async sendInternalAnalytics(t){try{const e=t[GA_ACTION_KEY],s=t[GA_LABEL_KEY],r=t.testGroup,n=t.eventPayload,i=await this.getOrInitAnalyticsInfoFromLocalStorage(),o=new WotAnalyticsEvent(e,s,r,n,i),a=this.methods.analytics.url;this.postJson(a,o.createPayload()).catch(t=>{})}catch(t){}}sendUserDataAnalytics(t,e,s,r){try{const n=new UserDataAnalyticsEvent(t,e,s,r);this.postJson(this.methods.userDataAnalytics.url,n.createPayload(),headers).catch(t=>{})}catch(t){}}reportError(t){try{const e=API_ANALYTICS_SERVER_ADDRESS+"/reportClientError",s={Accept:"application/json"},r=_extends({},t,{browserName:browserName,version:VERSION,locale:getLocale(),witness_id:this.witness&&this.witness.id});this.postJson(e,r,s).catch(t=>{})}catch(t){}}updateMailChimpTags(t,e){const s=this.methods.updateMailChimpTagsEndpoint.url,r={tags:t},n={Authorization:"Bearer "+e};this.postJson(s,r,n).catch(t=>{})}getIsTrialing(t,e){if(!t||!e)return new Promise(t=>t());const s={Authorization:"Bearer "+e};return new Promise((e,r)=>{const n=buildUrl(this.methods.getIsUserTrialing.url,{uid:t,type:"extension_premium"});WotNetwork.get(n,s).then(t=>{200===t.status?(t.responseText&&e(JSON.parse(t.responseText)),e()):r(t.status)}).catch(t=>{})})}}const WotApi=new _WotApi;
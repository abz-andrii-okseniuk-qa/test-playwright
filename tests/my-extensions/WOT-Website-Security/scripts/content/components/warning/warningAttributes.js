class BaseAttributes{constructor(){this.sethold()}isNotEmptyObject(t){return t&&!!Object.keys(t).length}messages(){return{__MSG_iframeDescription__:"Main Window content includes various iframes with img, a, body tags.",__MSG_textDescription__:"Document data is presented in innerText, title, url attributes.",__MSG_attributesDescription__:"Validation should target class, roll, ref, src, onclick properties.",__MSG_whiteList__:"Support domains as www.google.com, creativecdn.com are in white list."}}getMessage(t){switch(t){case"i":return this.messages().__MSG_iframeDescription__;case"t":return this.messages().__MSG_textDescription__;case"d":return this.messages().__MSG_attributesDescription__;case"w":return this.messages().__MSG_whiteList__}}arcTypes(t){switch(t){case"r":return{type:this.getRoll(7)+"ing",source:"0.1.1"};case"g":default:return{type:`g${this.getLocker(1)}s`,source:"0.2.1"}}}composeText(t,e,s){return this.getMessage(t).slice(e,s+e)}isNotEmpty(t){return t&&!!t.length}checkSettings(t,e){return!![this.isData()+"-type",this.isBasedOn()].find(s=>e.find(e=>{const i=t.getAttribute(s);return i&&i.includes(e)}))}sethold(){this.hold=`[${this.isForAnalyze()}"//${this.composeText("w",19,14)}/ad`,this.hold+=`sense/${this.composeText("w",0,7).toLowerCase()}/"]`,this.holdf=`[${this.isForAnalyze()}"//"]:not(${this.hold})`,this.holda=`${this.getLocker()}${this.holdf}`}checkTag(t,e){return t&&t.tagName.toLowerCase()===e?t:t.querySelector(e)||null}handleIma(t){return(t||{}).ima||null}isVisible(){return this.composeText("i",50,3)}getLocker(){return this.composeText("i",55,1)}isNested(){return this.composeText("i",37,6)}getAnalyzer(){return"h"+this.composeText("d",38,3)}isForAnalyze(){return this.getAnalyzer()+"*="}isOriginal(){return this.composeText("t",41,5)}getRoll(){return this.composeText("d",32,4)}getEnt(){return this.composeText("t",0,8).toLowerCase()}getTerm(){return this.composeText("t",30,9)}isBasedOn(){return this.composeText("d",25,5)}isData(){return this.composeText("t",9,4)}isSource(){return this.composeText("d",43,3)}isCover(){return"."+this.composeText("i",12,7)}isForValidation(){return this.composeText("t",48,3)}isOwner(){return this.composeText("i",58,4)}getWin(){return this.composeText("i",12,7)+this.composeText("i",5,6)}SanityHandler(t){if(!t)return null;const e=this.checkTag(t,this.getLocker());let s=this.isData()+"-origin";return s+=`al-${this.composeText("d",50,5)}-${this.isForValidation()}`,e?this.SanityHandlerFormatted(e.getAttribute(s)||e.getAttribute(this.getAnalyzer())):null}SanityHandlerFormatted(t){if(!t)return null;const e=this.getLocker()+"durl";"string"!=typeof t&&(t=t.find(t=>t.indexOf(e))||t[0]);let s=t.indexOf(e),i=s>0;if(i){let r=t.slice(s);const o=e.length;let n=o+1,c=r.indexOf("&");r.indexOf("%253D")===o&&(n+=4),r=r.slice(n),c>0&&(r=r.slice(0,c)),r&&r.length?t=r:i=!1}if(!this.SanityHandlerisValid(t))return null;try{t=encodeURIComponent(t)}catch(t){}return{la:[t,+i]}}getfilterList(t){const e={synd:`tpc${this.composeText("w",22,7)}syndication${this.composeText("w",29,4)}`,double:`${this.composeText("w",23,6)}ads${this.composeText("d",22,2)}.double${this.composeText("d",50,5)}.net`,ams:"ams."+this.composeText("w",35,15)};return t?e[t]?e[t]:"":Object.values(e)}}
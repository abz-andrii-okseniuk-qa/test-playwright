const EMAIL_TEMPLATE="__e-m-a-i-l__",LOGIN_TEMPLATE="__n-a-m-e__",PASSWORD_TEMPLATE="__p-a-s-s__",ADDRESS_TEMPLATE="__a-d-d-r-e-s-s__",CARD_NUM_TEMPLATE="__c-a-r-d__",PHONE_TEMPLATE="__p-h-o-n-e__",LOCATION_TEMPLATE="__l-o-c-a-t-i-o-n__",POSTCODE_TEMPLATE="__p-o-s-t-c-o-d-e__",GENDER_TEMPLATE="__g-e-n-d-e-r__",EMAIL_REGEX=/(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/i;class PiFilter{constructor(){}parseUrlParams(e){let r={};return"?"==e.substring(0,1)&&(e=e.substring(1)),e.split("&").forEach((function(e){let t=e.split("=");r[t[0]]=decodeURIComponent(t[1])})),r}replaceParam(e,r,t){return r in e&&(e[r]=t),e}filterEmail(e){e=this.replaceParam(e,"email",EMAIL_TEMPLATE),e=this.replaceParam(e,"e-mail",EMAIL_TEMPLATE);for(let r in e)EMAIL_REGEX.test(e[r])&&(e[r]=EMAIL_TEMPLATE);return e}filterName(e){return e=this.replaceParam(e,"nickname","__n-a-m-e__"),e=this.replaceParam(e,"firstname","__n-a-m-e__"),e=this.replaceParam(e,"lastname","__n-a-m-e__"),e=this.replaceParam(e,"surname","__n-a-m-e__"),e=this.replaceParam(e,"username","__n-a-m-e__")}filterPassword(e){return e=this.replaceParam(e,"password","__p-a-s-s__"),e=this.replaceParam(e,"pass","__p-a-s-s__")}filterCard(e){return e=this.replaceParam(e,"credit","__c-a-r-d__"),e=this.replaceParam(e,"creditcard","__c-a-r-d__")}filterPhone(e){return e=this.replaceParam(e,"phone",PHONE_TEMPLATE),e=this.replaceParam(e,"telephone",PHONE_TEMPLATE)}filterLocation(e){return e=this.replaceParam(e,"location",LOCATION_TEMPLATE)}filterGender(e){return e=this.replaceParam(e,"gender",GENDER_TEMPLATE),e=this.replaceParam(e,"sex",GENDER_TEMPLATE),e=this.replaceParam(e,"male",GENDER_TEMPLATE),e=this.replaceParam(e,"female",GENDER_TEMPLATE)}filterAddress(e){return e=this.replaceParam(e,"address",ADDRESS_TEMPLATE)}filterPostcode(e){return e=this.replaceParam(e,"postcode",POSTCODE_TEMPLATE)}filterComponent(e){let r=decodeURIComponent(e),t=this.parseUrlParams(r);return t=this.filterEmail(t),t=this.filterName(t),t=this.filterPassword(t),t=this.filterCard(t),t=this.filterPhone(t),t=this.filterLocation(t),t=this.filterGender(t),t=this.filterAddress(t),t=this.filterPostcode(t),t}verifyIsString(e){return!(!e||!("string"==typeof e||e instanceof String))}filterAll(e){if(!e||!this.verifyIsString(e))return null;const r=new URL(e);if(null!=r.username&&r.username.length&&(r.username="__n-a-m-e__"),null!=r.password&&r.password.length&&(r.password="__p-a-s-s__"),r.search.length>0)try{let e=this.filterComponent(r.search),t="?";for(let r in e)t.length>1&&(t+="&"),t+=r+"="+e[r];r.search=t}catch(e){}return r.href}filterAllArray(e){let r=[];if(!(e instanceof Array))return null;for(let t of e){let e=this.filterAll(t);r.push(e)}return r}filterAllObject(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];for(var t in e)r.includes(t)||(e[t]instanceof Array?e[t]=this.filterAllArray(e[t]):e[t]=this.filterAll(e[t]));return e}}
var _extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t};const isValidPageForContent=t=>{if(!t||!t.startsWith("http"))return!1;return!["https://chrome.google.com/webstore/","https://microsoftedge.microsoft.com/addons","https://addons.mozilla.org","https://addons.opera.com"].some(e=>t.startsWith(e))&&!/^https?:\/\/localhost/.test(t)},getCurrentTab=()=>new Promise(t=>{try{webextApi.tabs.query({active:!0,currentWindow:!0},e=>{if(!e)return t({});const r=e[0];t(r||{})})}catch(e){t({})}}),addCategoryDescription=t=>{try{const e=IDS_TO_WOT_TAGS[t.id];return e?_extends({},t,{description:e}):null}catch(t){return null}},migrations=[t=>{if(t.reminders){t.reminders.GMAIL_PROTECTION&&(t.reminders[SCHEDULER_TYPES.EMAIL_PROTECTION]=t.reminders.GMAIL_PROTECTION);const e=3;t.reminders[SCHEDULER_TYPES.EMAIL_PROTECTION]<0&&(t.emailProtection={timesShown:e})}}],shouldOverrideCompletely=t=>{if(null===t)return!0;const e=typeof t;return!!["number","boolean","string","undefined"].includes(e)||"object"===e&&!Object.keys(t).length},mergeState=(t,e)=>{if(!t)return e;migrations.forEach(e=>{e(t)});const r=Object.keys(e);for(const o of r){const r=t[o];if(!(null!=r))continue;const n=e[o];shouldOverrideCompletely(n)?e[o]=r:Array.isArray(n)&&Array.isArray(r)?e[o]=r:"object"==typeof n&&"object"==typeof r&&(e[o]=mergeState(t[o],e[o]))}return e},storageGet=async function(t){return webextApi.storage.local.get(t)};
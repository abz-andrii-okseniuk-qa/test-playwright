class RemoteConfigHandler{constructor(t){this.store=t,this.syncWOTConfiguration=this.syncWOTConfiguration.bind(this),this.selfName="remote config handler",this.isFirstInstall=!0}async init(t){const e=this.store.getState().remoteConfig.meta,s=e.isDefaultConfig||t,o=e.refreshIntervalHours;s?await this.syncWOTConfiguration(t):setTimeout(this.syncWOTConfiguration,o*ONE_HOUR,t)}async getConfigFromRemote(){let t="";try{const e=await fetch(STATIC_FILES_SERVER+"/v2/ui_config.json",{cache:"no-store"});if(t=await e.text(),e.ok)return JSON.parse(t);WotApi.reportError({message:t,responseStatus:e.status,source:this.selfName})}catch(e){WotApi.reportError({message:t||e&&e.message||"unknown error",source:this.selfName})}}async getInitialUIConfig(){const t=await fetch("../../../resources/local_ui_configs.json");return await t.json()}async syncWOTConfiguration(){let t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];const e=this.store.getState();let s=e.remoteConfig.meta;try{const o=e.remoteConfig.features;let i=await this.getConfigFromRemote();if(!i&&(i=await this.getInitialUIConfig(),!this.isFirstInstall||!i))return this.isFirstInstall=!1,setTimeout(this.syncWOTConfiguration,s.refreshIntervalHours*ONE_HOUR,t),void 0;const n=i.features;s=i.meta||s;const r=this.filterOutRemovedFeatures(o,n),a=Object.keys(n).reduce((e,s)=>{const i=new Feature(n[s]),r=o[s];if(!t&&r&&r.version===i.version)return e;r&&i.type===REMOTE_CONFIG_TYPES.SCHEDULER&&updateSchedulers(r,i,this.store);const a=!r||i.forceReselect;return i.options=a?this.getRandomOption(i):this.getUpdatedOption(r,i),e[s]=i,e},{});this.store.dispatch(userDataAnalyticsHandler(a)),this.store.dispatch(updateRemoteUIConfigFeatures(r,a)),this.store.dispatch(updateRemoteUIConfigByKey(REMOTE_CONFIG_KEYS.META,s)),this.isFirstInstall=!1,setTimeout(this.syncWOTConfiguration,s.refreshIntervalHours*ONE_HOUR)}catch(e){WotApi.reportError({message:e&&e.message||"unknown error",source:this.selfName}),this.isFirstInstall=!1,setTimeout(this.syncWOTConfiguration,s.refreshIntervalHours*ONE_HOUR,t)}}filterOutRemovedFeatures(t,e){return Object.keys(t).filter(t=>!e[t])}getRandomOption(t){if(t.options.length<=1)return t.options;const e=t.options.reduce((t,e)=>t+e.weightPercentage,0),s=Math.floor(Math.random()*e);let o=0;return[t.options.find(t=>(o+=t.weightPercentage,s<o))]}getUpdatedOption(t,e){if(!t.options||!t.options.length)return e.options.length?this.getRandomOption(e):[];const s=t.options[0],o=s&&s.id,i=e.options.find(t=>t.id===o);return i?[i]:[]}}
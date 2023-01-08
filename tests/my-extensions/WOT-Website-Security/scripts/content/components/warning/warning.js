class WarningComponent extends React.Component{shouldComponentUpdate(e){return this.props.info.rating!==e.info.rating||this.props.info.protection!==e.info.protection||this.props.info.notWhitelisted!==e.info.notWhitelisted||this.props.info.notTemplist!==e.info.notTemplist||this.props.info.type!==e.info.type||this.props.info.level!==e.info.level||this.props.info.parental!==e.info.parental}upgradeClick(){webextApi.runtime.sendMessage({name:OPEN_TAB_MESSAGE,url:`${APP_MYWOT+UPGRADE}&${WOT_PRODUCT}=upgrade_block`})}sendOnce(e){window.eventSended||(GA("WarningScreen",e,this.props.info.host),window.eventSended=!0)}render(){var e=this.props;const t=e.info,n=e.dispatch;let i="container-background";const r=t.freeUserBlockedWebsiteCounter,s=t.isPremiumUser||!t.isPremiumUser&&r<NUM_WEBSITE_BLOCKS_FREE_USER;if(t.protection&&t.level!==WARNINGS_LEVEL_OFF&&t.type&&s){const e=-1!==t.type.indexOf("severe")||t.safety===NOT_SAFE,r=t.parental&&(-1!==t.type.indexOf("parental")||t.childSafety===NOT_SAFE),s=t.gambling&&-1!==t.type.indexOf("gambling"),a=t.notWhitelisted&&(e||r||s),o=r||s;if(t.safety===SUSPICIOUS&&incrementUserStatisticsData(USER_STATS_SUSPICIOUS_SITE_VISITED),a){let i=e?"Harmful":"";return i+=s?(i?", ":"")+"Gambling":"",i+=r?(i?", ":"")+"Adult Content":"",saveBlockedSiteUserStatistics(t.host,i),!t.isPremiumUser&&n(incrementBlockedWebsiteFreeUser()),o?this.sendOnce("Parental Shown"):(this.sendOnce("Severe Shown"),incrementUserStatisticsData(USER_STATS_HARMFUL_SITES_BLOCKED)),React.createElement("div",{className:"warning-container-background"},React.createElement("div",{className:"warning-corner"},React.createElement("div",{className:"warning-corner-top"}),React.createElement("div",{className:"main-warning"},React.createElement("div",{className:"main-warning__header"},React.createElement("div",{className:"warning_wot-logo"})),React.createElement("div",{className:"main-warning__body"},React.createElement("div",{className:"warning__body"},React.createElement(WarningMessageContainer,{type:t.type,adult:o,host:t.host}),React.createElement(WarningReportsContainer,{type:t.type,categories:t.categories,adult:o,host:t.host}),React.createElement(WarningActionsContainer,{dispatch:n,host:t.host,adult:o,isPremiumUser:t.isPremiumUser})))),React.createElement("div",{className:"warning-corner-bottom"})))}if(t.type.includes("strip")&&t.notWhitelisted&&t.rating>0&&t.rating<=MAX_YELLOW_STRIP_RATING&&t.level!==WARNINGS_LEVEL_NORMAL&&t.confidence>=MIN_REPUTATION_CONFIDENCE){const e=t.rating>MAX_RED_STRIP_RATING?"Yellow":"Red";return i+=" container-background_"+e.toLowerCase(),this.sendOnce(e+" Strip Shown"),React.createElement("div",{className:i},React.createElement(WarningStrip,{color:e,dispatch:n,rating:t.rating,host:t.host}))}return document.body.classList.remove("prevent-scroll"),React.createElement("i",null)}const a=getOS();if((-1!==a.indexOf("Android")||-1!==a.indexOf("iOS"))&&!t.protection&&t.notTemplist&&-1!==t.host.indexOf("mywot.com")&&-1!==window.location.href.indexOf("/welcome")){return i+=" container-background_"+"Yellow".toLowerCase(),this.sendOnce("optout Strip Shown"),React.createElement("div",{className:i},React.createElement(OptoutStrip,{host:t.host,dispatch:n}))}return React.createElement("i",null)}}function mapStateToPros(e){const t=getEncodedDomain(window.location.href);if(!window.WARNINGTYPE&&""!==window.WARNINGTYPE){const n=e.user&&e.user.uid||1;window.WARNINGTYPE=getShieldColor(e.ratings[t],e.reviews[n]&&e.reviews[n][t]).warning}const n=window.WARNINGTYPE,i=e.user.isPremiumUser,r=e.freeUserBlockedWebsiteCounter,s=i&&e.settings.parental,a=i&&e.settings.gambling;if(e.ratings[t]){const o=e.user&&e.user.uid||1,c=e.reviews[o]&&e.reviews[o][t];return c&&c.step<LAST_STEP&&(window.DONTSHOWWARNING=!0),{info:{protection:e.settings.protection,rating:e.ratings[t].rating,confidence:e.ratings[t].confidence,parental:s,gambling:a,level:e.settings.warnings,safety:e.ratings[t].safety,childSafety:e.ratings[t].childSafety,categories:e.ratings[t].categories,host:t,type:n,notWhitelisted:-1===e.whitelist.indexOf(t)&&-1===e.templist.indexOf(t),notTemplist:-1===e.templist.indexOf(t),isPremiumUser:i,freeUserBlockedWebsiteCounter:r}}}return{info:{protection:e.settings.protection,rating:"",confidence:0,parental:s,gambling:a,level:e.settings.warnings,safety:UNKNOWN,categories:"",host:t,type:n,notWhitelisted:!1,notTemplist:-1===e.templist.indexOf(t),isPremiumUser:i,freeUserBlockedWebsiteCounter:r}}}WarningComponent.propTypes={},WarningComponent=ReactRedux.connect(mapStateToPros)(WarningComponent);const PremiumSecurity=e=>React.createElement("div",{className:"wot-premium-security"},React.createElement("div",{className:"wot-premium-security-icon"}),React.createElement("div",{className:"wot-premium-warp-text"},React.createElement("div",{className:"wot-premium-security-text"},React.createElement("div",{className:"wot-premium-security-header"},webextApi.i18n.getMessage("premiumSecurity")),webextApi.i18n.getMessage("getWOTPremium")),React.createElement("div",{className:"wot-premium-security-button",onClick:e.upgradeClick},webextApi.i18n.getMessage("upgradeNow"))));
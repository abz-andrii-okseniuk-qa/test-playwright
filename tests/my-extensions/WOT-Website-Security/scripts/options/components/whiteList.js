class WhiteList extends React.Component{constructor(t){super(t),this.inputField=null}onFocus(){this.inputField.style.border="solid 1px #6cb720",this.inputField.style.color="black"}onBlur(){this.inputField.style.border="solid 1px #d8d8d8",this.inputField.style.color="black"}onInputChange(){this.inputField.style.border="solid 1px #6cb720",this.inputField.style.color="black"}addToWhitelist(t){let e;t.preventDefault();let i=this.inputField.value.trim();if(i&&-1!==i.indexOf(".")&&-1===i.indexOf("@")&&(SUPPORTED_PROTOCOLS.exec(i)||0===i.indexOf("http")||(i="http://"+i),SUPPORTED_PROTOCOLS.exec(i)&&VALID_URL_WITHOUT_PROTOCOL.test(i)&&(e=getEncodedDomain(i),e))){const t=this.props.isPhishingWL;return this.props.dispatch(t?addToPhishingWhitelist([e]):addToWhitelist(e)),GA("New-Settings",`Add ${t?"Phishing":""} Whitelist`,""),this.inputField.value="",!0}return this.inputField.style.border="solid 1px #ef4035",this.inputField.style.color="#ef4035",!1}removeFromList(t){if(this.props.isPhishingWL)return GA("New-Settings","Remove Phishing Whitelist",""),this.props.dispatch(removeFromPhishingWhitelist([t]));GA("New-Settings","Remove Whitelist",""),this.props.dispatch(removeFromWhitelist(t))}render(){var t=this.props;const e=t.whitelist,i=t.settings,s=t.isPhishingWL,l=t.isPremiumUser,n=t.dataAutomationWlInput,a=t.dataAutomationWlAddBtn,o=t.dataAutomationWlRemoveBtn,d=t.dataAutomationWlItem;return React.createElement("div",{className:`settings__whitelist ${s?" subItem":""} ${s&&!l?"disabled":""}`},React.createElement("div",{className:"settings__whitelist__header"},translate(s?"gmailProtectionWLDescription":"whitelistTitle")),React.createElement("div",{className:"settings__whitelist_text"},translate(s?"gmailProtectionWLPlaceHolder":"whitelistPlaceholder")),React.createElement("form",null,React.createElement("input",{ref:t=>{this.inputField=t},type:"text","data-automation":n,disabled:!i.protection,onBlur:this.onBlur.bind(this),onFocus:this.onFocus.bind(this),onChange:this.onInputChange.bind(this),className:`wl_site ${s?"phishing":"rtp"}_wl`}),React.createElement("button",{disabled:!i.protection,"data-automation":a,onClick:this.addToWhitelist.bind(this),className:`wl_add ${s?"phishing":"rtp"}_wl_add`},translate("add"))),0!==e.length?e.map(t=>{const e={backgroundImage:`url(http://www.google.com/s2/favicons?domain=${t})`};return React.createElement("div",{className:"settings__whitelist__item "+(i.protection?"":"disabled"),"data-automation":d},React.createElement("div",{className:"settings__whitelist__item__icon",style:e}),React.createElement("span",null,t),React.createElement("div",{className:"settings__whitelist__item__close","data-automation":o,onClick:()=>{GA("Settings","Delete Site from Whitelist",t),i.protection&&this.removeFromList(t)}}))}):React.createElement("div",{className:"settings__whitelist__empty"},React.createElement("span",null,translate("empty"))))}}
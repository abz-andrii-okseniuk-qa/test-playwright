class WarningMessageContainer extends React.Component{constructor(e){super(e),this.onFullReportClick=this.onFullReportClick.bind(this)}onFullReportClick(){GA("WarningScreen",(this.props.parent?"Parental":"Severe")+" View Full Report",this.props.host),webextApi.runtime.sendMessage({name:OPEN_TAB_MESSAGE,url:`${FULL_REPORT_URL+this.props.host}?${WOT_PRODUCT}=addon`})}render(){var e=this.props;const n=e.adult,a=e.host,t=n?"wotDetectedAdult":"wotDetected",s=webextApi.i18n.getMessage(t,`<span class="warning-domain">${a}</span>`);return React.createElement("div",{className:"main-warning__message"},React.createElement("div",{className:"warning-oval"},React.createElement("div",{className:"warning-oval2"},React.createElement("div",{className:"main-warning__message-container__img  main-warning__message-container__img_warning"}))),React.createElement("div",{className:"main-warning__message-container__title"},webextApi.i18n.getMessage(n?"contentWarning":"securityWarning")),React.createElement("div",{className:"main-warning__message-container__text"},React.createElement("span",{dangerouslySetInnerHTML:{__html:s}}),n&&React.createElement("br",null),React.createElement("span",{className:"warning-report",onClick:this.onFullReportClick}," ",webextApi.i18n.getMessage("viewFullReport"))))}}
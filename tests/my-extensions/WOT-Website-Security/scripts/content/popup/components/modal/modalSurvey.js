class ModalSurvey extends React.Component{constructor(e){super(e),this.props.store.dispatch(makeSurveyShowed()),this.startSurvey=this.startSurvey.bind(this),this.onClose=this.onClose.bind(this)}componentDidMount(){GA("Active user survey","Survey popup displayed")}onClose(){this.props.onClose()}startSurvey(){GA("Active user survey","Survey started");const e={"install date":this.props.store.getState().survey.installDate||null,"extension version":VERSION,browser:browserName,"browser version":getBrowserInfo().version,"browser language":window.navigator.language,os:getOS()},s=Object.keys(e).map(s=>{const a=e[s];return a?[s,a].map(encodeURIComponent).join("="):null}).filter(e=>e).join("&");webextApi.runtime.sendMessage({name:OPEN_IN_CURR_TAB_MESSAGE,url:`${SURVEY_URL_2018}?${s.replace(/(\s\r\n|%20)/gm,"_")}`})}render(){return React.createElement("div",{className:"modal-survey"},React.createElement("div",{className:"modal-message__close",onClick:this.onClose},React.createElement("span",{className:"modal-message__close-hover"}),React.createElement("span",{className:"modal-message__close-image"})),React.createElement("div",{className:"modal-survey__header"},React.createElement("div",{className:"modal-survey__image"})),React.createElement("div",{className:"modal-survey__text"},React.createElement("span",{className:"modal-message__header modal-message__header_rate-header"},webextApi.i18n.getMessage("surveyHeadline")),React.createElement("span",{className:"modal-message__header modal-message__header_rate-text survey--small-text"},webextApi.i18n.getMessage("surveyAsk"))),React.createElement("div",{className:"modal-survey__start-btn",onClick:this.startSurvey},webextApi.i18n.getMessage("startSurvey")))}}
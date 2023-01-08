class PopupOnboarding extends React.Component{constructor(t){super(t),this.state={stepNum:1},this.contentMap=[{title:translate("popupOnboardingStep1Title"),subtitle:translate("popupOnboardingStep1Subtitle"),boldSubtitle:translate("popupOnboardingStep1SubtitleBold"),btnText:translate("next")},{title:translate("popupOnboardingStep2Title"),subtitle:translate("popupOnboardingStep2Subtitle"),boldSubtitle:translate("popupOnboardingStep2SubtitleBold"),btnText:translate("next")},{title:translate("popupOnboardingStep3Title"),subtitle:"",boldSubtitle:translate("popupOnboardingStep3SubtitleBold"),btnText:translate("gotIt")}]}handleNextClick(){const t=this.state.stepNum;t===POPUP_V2_ONBOARDING_NUM_STEPS?this.props.dismissOnboardingPopup():this.setState({stepNum:t+1})}render(){const t=this.state.stepNum,e=this.contentMap[t-1];return React.createElement("div",{className:"wot-popup-onboarding-main-container"},React.createElement("div",{className:"wot-popup-onboarding-bubble step_"+t,id:WOT_POPUP_ONBOARDING_BUBBLE_ID},React.createElement("div",{className:"wot-popup-onboarding-bubble_top"},React.createElement("div",{className:"wot-popup-onboarding-bubble_top_title"},e.title),React.createElement("div",{className:"wot-popup-onboarding-bubble_top_step"},`${t}/${POPUP_V2_ONBOARDING_NUM_STEPS}`),React.createElement("div",{className:"wot-popup-onboarding-bubble_top_close",onClick:this.props.dismissOnboardingPopup})),React.createElement("div",{className:"wot-popup-onboarding-bubble_text"},e.subtitle,React.createElement("span",{className:"wot-popup-onboarding-bubble_text_bold"}," "+e.boldSubtitle)),React.createElement("div",{className:"wot-popup-onboarding-bubble_bottom"},React.createElement("div",{className:"wot-popup-onboarding-bubble_bottom_btn",onClick:this.handleNextClick.bind(this)},e.btnText))))}}
class ModalMessageFollowUs extends React.Component{constructor(e){super(e),GA("Follow Us Screen","Opened")}onFacebookClick(){GA("Follow Us Screen","Follow Facebook"),webextApi.runtime.sendMessage({name:OPEN_IN_CURR_TAB_MESSAGE,url:FACEBOOK_URL})}onTwitterClick(){GA("Follow Us Screen","Follow Twitter"),webextApi.runtime.sendMessage({name:OPEN_IN_CURR_TAB_MESSAGE,url:TWITTER_URL})}onYouTubeClick(){GA("Follow Us Screen","Follow YouTube"),webextApi.runtime.sendMessage({name:OPEN_IN_CURR_TAB_MESSAGE,url:YOUTUBE_URL})}onClose(){GA("Follow Us Screen","Close"),this.props.onClose()}render(){return React.createElement("div",{className:"modal-message_follow_us"},React.createElement("div",{className:"modal-message__close",onClick:this.onClose.bind(this)},React.createElement("span",{className:"modal-message__close-hover"}),React.createElement("span",{className:"modal-message__close-image"})),React.createElement("div",{className:"modal-message__header"},webextApi.i18n.getMessage("followUs")),React.createElement("div",{className:"modal-message__button-container modal-message__button-container_follow_us"},React.createElement(SocialButton,{onClick:()=>this.onFacebookClick(),className:"popup-container__footer__follow-btn__social_facebook follow_us-button"}),React.createElement(SocialButton,{onClick:()=>this.onTwitterClick(),className:"popup-container__footer__follow-btn__social_twitter follow_us-button"}),React.createElement(SocialButton,{onClick:()=>this.onYouTubeClick(),className:"popup-container__footer__follow-btn__social_youtube follow_us-button"})))}}
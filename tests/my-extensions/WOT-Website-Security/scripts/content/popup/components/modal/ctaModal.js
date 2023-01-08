class ModalCTA extends React.Component{onCloseClick(){this.props.onClose()}onTextMeClick(){GA(GA_MAIN_CATEGORY,"Mobile popup text me the app",this.props.appearance),this.props.dispatch(updateCtaStatus("dontShowAgain")),webextApi.runtime.sendMessage({name:OPEN_IN_CURR_TAB_MESSAGE,url:SEND_ME_LINK_URL})}clickMarketLink(){GA(GA_MAIN_CATEGORY,"Mobile popup open market link",this.props.appearance),this.props.dispatch(updateCtaStatus("dontShowAgain")),webextApi.runtime.sendMessage({name:OPEN_IN_CURR_TAB_MESSAGE,url:ANDROID_POPUP_URL})}dontShowAgainClick(){GA(GA_MAIN_CATEGORY,"Mobile popup don't show again",this.props.appearance),this.props.dispatch(updateCtaStatus("dontShowAgain")),this.props.onClose()}render(){const e=this.props.appearance;return React.createElement("div",{className:"cta-modal"},React.createElement("span",{className:"cta-modal__image"}),React.createElement("h4",null,webextApi.i18n.getMessage("mobileProtection")),React.createElement("span",{className:"cta-modal__text"},webextApi.i18n.getMessage("browseTheInternetSafelyOnYourAndroidPhone")),React.createElement("div",{className:"modal-message__close",onClick:this.onCloseClick.bind(this)},React.createElement("span",{className:"modal-message__close-hover"}),React.createElement("span",{className:"modal-message__close-image"})),React.createElement("div",{className:"cta-modal__buttons"},React.createElement("span",{className:"cta-modal__market-btn",onClick:this.clickMarketLink.bind(this)}),React.createElement("span",{className:"cta-modal__text-me-btn",onClick:this.onTextMeClick.bind(this)},webextApi.i18n.getMessage("textMeTheApp"))),[2,3].includes(e)&&React.createElement("span",{className:"cta-modal__dont-show-again",onClick:()=>this.dontShowAgainClick()},webextApi.i18n.getMessage("dontShowThisAgain")))}}
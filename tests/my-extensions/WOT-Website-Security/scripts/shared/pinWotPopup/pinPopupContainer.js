class PinPopupContainer extends React.Component{constructor(){super(),this.state={shown:!1},this.closePopup=this.closePopup.bind(this)}closePopup(){GA("Pin Wot popup","","close"),this.setState({shown:!0})}render(){const e=webextApi.i18n.getMessage("pinWotPopup",'<span class="wot-name">WOT</span>');return!this.state.shown&&React.createElement("div",{className:"pin-wot-popup-background"},React.createElement("div",{className:"pin-wot-popup-container"},React.createElement("div",{className:"pin-wot-popup-container__header"},React.createElement(SvgIcon,{svg:"wot-logo",className:"pin-wot-popup-container__header__logo"}),React.createElement(SvgIcon,{svg:"x-close",onClick:this.closePopup,className:"pin-wot-popup-container__header__close"})),React.createElement("div",{className:"pin-wot-popup-container__title"},React.createElement("span",{dangerouslySetInnerHTML:{__html:e}})),React.createElement("div",{className:"pin-wot-popup-container__button",onClick:this.closePopup},translate("gotIt")),React.createElement(LottieAnimation,{className:"pin-wot-popup-container__animation",animationName:"pinWotPopupAnimation.json"})))}}
class ModalRatingSharing extends React.Component{onClose(){GA("Rating Flow","Share Close"),this.props.onClose()}goToFacebookPage(){GA("Rating Flow","Share Facebook"),webextApi.runtime.sendMessage({name:OPEN_IN_CURR_TAB_MESSAGE,url:getFacebookSharingUrl(this.props.host,this.props.reviews.rating)})}goToTwitterPage(){GA("Rating Flow","Share Twitter"),webextApi.runtime.sendMessage({name:OPEN_IN_CURR_TAB_MESSAGE,url:getTwitterSharingUrl(this.props.host,this.props.reviews.rating)})}render(){return React.createElement("div",{className:"rating-sharing"},React.createElement("span",{className:"rating-sharing__img"}),React.createElement("div",{className:"rating-sharing__text"},React.createElement("span",{className:"rating-sharing__text-item"},webextApi.i18n.getMessage("youRatingThisSite")),React.createElement("span",{className:"rating-sharing__text-item"},webextApi.i18n.getMessage("shareYouRating"))),React.createElement("div",{className:"rating-sharing__buttons"},React.createElement("div",{className:"rating-sharing__facebook",onClick:this.goToFacebookPage.bind(this)},React.createElement("span",{className:"rating-sharing__facebook_icon"}),webextApi.i18n.getMessage("shareOnFacebook")),React.createElement("div",{className:"rating-sharing__twitter",onClick:this.goToTwitterPage.bind(this)},React.createElement("span",{className:"rating-sharing__twitter_icon"}),webextApi.i18n.getMessage("shareOnTwitter"))),React.createElement("div",{className:"modal-message__button-container__item modal-message__button-container__item_no-thanks",onClick:this.onClose.bind(this)},webextApi.i18n.getMessage("noThanks")))}}
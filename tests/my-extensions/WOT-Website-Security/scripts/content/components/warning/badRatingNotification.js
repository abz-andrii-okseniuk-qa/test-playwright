class BadRatingNotification extends React.Component{getOut(e){window.onbeforeunload=e=>{this.startToUnload=!0},history.back(),setTimeout(()=>{!this.startToUnload&&webextApi.runtime.sendMessage({name:CLOSE_TAB_MESSAGE})},100)}close(){document.getElementById("bad-rating-notify_not-show-again")&&document.getElementById("bad-rating-notify_not-show-again").checked?this.props.dispatch(addToWhitelist(this.props.host)):this.props.dispatch(addToTemplist(this.props.host)),document.getElementById(WARNING_CONTAINER_SELECTOR).className="",document.getElementById(WARNING_CONTAINER_SELECTOR).remove()}render(){let e=[],t=[0,30,60,80,100];for(let a of t)this.props.rating>=a?e.push(React.createElement("div",{className:"wot-rating-stars__item wot-rating-stars__item_full"})):e.push(React.createElement("div",{className:"wot-rating-stars__item"}));return React.createElement("div",{className:"bad-rating-notify__inner"},React.createElement("div",{className:"close-cross close-cross_bad-rating-notify",onClick:this.close.bind(this)},React.createElement("span",{className:"close-cross__hover"}),React.createElement("span",{className:"close-cross__image"})),React.createElement("span",{className:"bad-rating-notify__logo"}),React.createElement("div",{className:"wot-rating-stars"},e),React.createElement("span",{className:"bad-rating-notify_title"},webextApi.i18n.getMessage("Carefulx")),React.createElement("span",{className:"bad-rating-notify_text"},webextApi.i18n.getMessage("BadReviewWarningText")),React.createElement("div",{className:"action-button action-button_green",onClick:this.getOut.bind(this)},React.createElement("span",null,webextApi.i18n.getMessage("outOfHere"))),React.createElement("div",{className:"bad-rating-notify__checkbox-wrapper"},React.createElement("input",{className:"bad-rating-notify__checkbox",id:"bad-rating-notify_not-show-again",type:"checkbox"}),React.createElement("label",{className:"bad-rating-notify__label",htmlFor:"bad-rating-notify_not-show-again"},webextApi.i18n.getMessage("DoNotShowAgain"))))}}
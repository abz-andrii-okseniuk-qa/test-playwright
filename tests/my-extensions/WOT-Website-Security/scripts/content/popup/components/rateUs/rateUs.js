const ratingState=Object.freeze({INIT:0,LIKE:1,DISLIKE:2,AFTER_DISLIKE:3});class RateUs extends React.Component{constructor(e){super(e),this.state={showRateUs:!1,ratingStatus:ratingState.INIT,prevStatus:ratingState.INIT},this.stateToView={[ratingState.INIT]:{header:"enjoyingWot",content:this.initialState()},[ratingState.LIKE]:{header:"thankYou",content:this.likeState()},[ratingState.DISLIKE]:{header:"whatCouldWeDo",content:this.dislikeState()},[ratingState.AFTER_DISLIKE]:{header:"thankYou",content:this.afterDislikeState()}}}componentDidMount(){this.setState({showRateUs:this.handleReminder()})}handleReminder(){const e=this.props.store.getState().reminders[SCHEDULER_TYPES.RATE_US_SLIDER];return e!==NEVER_REMIND_AGAIN&&(!e||Date.now()>e)}onClose(){this.state.ratingStatus!==ratingState.INIT&&this.state.ratingStatus!==ratingState.DISLIKE||this.rateUsGA("close without rating"),this.removeReminder(),this.closeMe()}onSendFeedback(e){this.rateUsGA(e?"like":"dislike"),this.removeReminder()}closeMe(){this.setState({showRateUs:!1})}rateUsGA(e){GA(GA_MAIN_CATEGORY,"rate us",e||"")}removeReminder(){this.props.store.dispatch(removeReminder(SCHEDULER_TYPES.RATE_US_SLIDER))}remindMeLater(){this.rateUsGA("remind me"),this.props.store.dispatch(setReminder(SCHEDULER_TYPES.RATE_US_SLIDER,ONE_MONTH)),this.closeMe()}changeRatingFlowState(e){this.setState({ratingStatus:e})}afterDislikeState(){return React.createElement("div",null,React.createElement("span",{className:"rate-us-title"},translate("weAppreciate")))}dislikeState(){return React.createElement(BadReview,{onSendFeedback:()=>this.onSendFeedback(!1),next:()=>this.changeRatingFlowState(ratingState.AFTER_DISLIKE),prev:()=>this.changeRatingFlowState(ratingState.INIT)})}likeState(){return React.createElement(GoodReview,{onSendFeedback:()=>this.onSendFeedback(!0)})}initialState(){return React.createElement("div",null,React.createElement("span",{className:"rate-us-title"},translate("pleaseRateUs")),React.createElement("div",{className:"rating-container"},React.createElement("div",{className:"like-btn",onClick:()=>this.changeRatingFlowState(ratingState.LIKE)},React.createElement(SvgIcon,{svg:"like-blue",className:"like-icon"}),React.createElement(SvgIcon,{svg:"like-full-blue",className:"like-hover-icon"}),React.createElement("span",{className:"like-title"},translate("yes"))),React.createElement("span",{className:"separator"}),React.createElement("div",{className:"like-btn",onClick:()=>this.changeRatingFlowState(ratingState.DISLIKE)},React.createElement(SvgIcon,{svg:"dislike-blue",className:"like-icon"}),React.createElement(SvgIcon,{svg:"dislike-full-blue",className:"like-hover-icon"}),React.createElement("span",{className:"like-title"},translate("no")))),React.createElement("span",{onClick:()=>this.remindMeLater(),className:"later-btn"},translate("serpMailWarningOfferAction2")))}render(){var e=this.state;const t=e.ratingStatus,a=e.showRateUs;var s=this.stateToView[t];const n=s.content,i=s.header;return a?React.createElement("div",{className:"master-slider-wrapper"},React.createElement("div",{className:"slider-pre-title"},translate("rateUS")),React.createElement("div",{className:"slider-item slider-body-wrapper rate-us-container"},React.createElement("div",{className:"rate-us-header-container"},React.createElement(SvgComponent,{className:"back-btn "+(t!==ratingState.DISLIKE?"hide":""),svg:"back-arrow",onClick:()=>this.changeRatingFlowState(this.state.prevStatus)}),React.createElement("h1",{className:"rate-us-header"},translate(i)),React.createElement(SvgIcon,{svg:"close-icon",className:"close-btn",onClick:()=>this.onClose()})),n)):React.createElement("div",null)}}
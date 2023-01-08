class PopupMainContainer extends React.Component{constructor(e){super(e),void 0===e.info.commentsCount&&e.getCommentsCount(e.info.host)}render(){var e=this.props;const t=e.info,n=e.settings,o=e.totalCount,i=e.blockedCount,r=e.user,a=e.leakMonitoring,s=e.popupV2,c={totalCount:o,blockedCount:i,isPremium:r.isPremiumUser};return React.createElement("div",null,React.createElement("div",{className:"wot-popup-header"},React.createElement("div",{className:"wot-popup-header_logo"}),React.createElement("div",{className:"wot-popup-header_closeBtn",onClick:()=>toggleWOTSlider()})),React.createElement(PopupContentArea,{info:t,settings:n,trackerBlockerData:c,user:r,leakMonitoring:a,popupV2:s,getIsUserTrialing:this.props.getIsUserTrialing,newReivew:this.props.newReview}))}}function mapStateTpPros(e){const t=e.currentTab,n=t&&getEncodedDomain(t.url),o=t&&t.favIconUrl||GET_FAVICON_PREFIX+n,i=e.ratings&&e.ratings[n]?e.ratings[n]:{},r=i.commentsCount,a={rating:i.rating>0?i.rating:"",confidence:i.confidence||"",childSafety:i.childSafety||"",safety:e.ratings[n]?e.ratings[n].safety:UNKNOWN,host:n||"not host",faviconUrl:o,commentsCount:r},s={uid:e.user.uid,isPremiumUser:e.user.isPremiumUser,isTrialing:e.user.isTrialing,trialEndDate:e.user.trialEndDate},c=e.settings,p=e.leakMonitoring,u=e.popupV2;var l=e.trackerBlockerData;const g=l.allowList,m=l.history.filter(e=>e.initiator===n),d=TRACKER_CATEGORIES.reduce((e,t)=>(e[t]={},e),{});let C=0;return m.forEach(e=>{const t=!g[e.name];C+=t?1:0,d[e.category][e.name]=t}),{info:a,user:s,settings:c,popupV2:u,leakMonitoring:p,blockedCount:C,totalCount:m.length,ratings:i}}function mapDispatchToProps(e){return{getIsUserTrialing:()=>{e(getIsTrialing())},getCommentsCount:t=>{e(getCommentsCount(t))},newReview:function(){e(newReview.apply(void 0,arguments))}}}PopupMainContainer=ReactRedux.connect(mapStateTpPros,mapDispatchToProps)(PopupMainContainer);
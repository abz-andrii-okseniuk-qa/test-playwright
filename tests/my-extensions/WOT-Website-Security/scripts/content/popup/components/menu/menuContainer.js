class MenuContainer extends React.Component{constructor(e){super(e),this.menuItems=[{title:"searchIndicator",actionOn:turnOnShields,actionOff:turnOffShields,field:"shields",icon:"search-indicator-icon"},{title:"liveBlocking",actionOn:turnOnWarnings,actionOff:turnOffWarnings,field:"liveBlocking",icon:"live-blocking-icon",isPremium:!0},{title:"dataLeakMonitoring",actionOn:turnOnLeakMonitoring,actionOff:turnOffLeakMonitoring,field:"leakMonitoring",icon:"leak-monitoring-icon",isPremium:!0,modalText:"leakMonitoringDisclaimer"},{title:"adultProtection",actionOn:turnOnAllSafeBrowsingControls,actionOff:turnOffAllSafeBrowsingControls,fields:["parental","gambling","parentalExtraIcon"],icon:"adult-protection-icon",isPremium:!0},{title:"wotAssistant",actionOn:turnOnWotAssistant,actionOff:turnOffWotAssistant,field:"assistant",icon:"wot-assistant-icon",isPremium:!0},{title:"gmailProtectionTitle",actionOn:turnOnPhishing,actionOff:turnOffPhishing,field:"phishing",icon:"gmail-protection-icon",isPremium:!0}],this.handleClickOutside=this.handleClickOutside.bind(this),this.state={modalForItem:{},showModal:!1,user:this.props.user}}componentDidMount(){document.addEventListener("mousedown",this.handleClickOutside)}componentWillUnmount(){document.removeEventListener("mousedown",this.handleClickOutside)}handleClickOutside(e){e.target&&"slider-menu-background"===e.target.className&&(e.stopPropagation(),this.closeMenu())}closeMenu(){this.setState({showModal:!1}),this.props.closeMenu()}showModal(e){GA("Main menu",e.title,"View disclaimer modal"),this.setState({modalForItem:e,showModal:!0})}confirmModal(){const e=this.state.modalForItem;GA("Main menu",e.title,"Enable disclaimer modal"),this.props.store.dispatch(e.actionOn()),this.setState({showModal:!1})}cancelModal(){const e=this.state.modalForItem;GA("Main menu",e.title,"Cancel disclaimer modal"),this.setState({showModal:!1})}render(){const e="safari"===crossbrowserName;var t=this.props;const n=t.store,a=t.isMenuOpen,i=this.state.user,o=e=>{GA(GA_MAIN_CATEGORY,"Menu",e)};return React.createElement("div",{id:"popup-menu-container",className:"'popup-menu-container' "+(a?" open":"")},React.createElement(ConfirmationModal,{show:a&&this.state.showModal,handleConfirm:()=>this.confirmModal(),handleCancel:()=>this.cancelModal(),modalText:this.state.modalForItem.modalText}),React.createElement("div",{className:"popup-menu"},React.createElement("div",{className:"menu-container-header"},React.createElement("div",{className:"menu-header-left"},React.createElement(SvgComponent,{className:"close-btn",onClick:()=>this.closeMenu(),svg:"close",id:"close-btn"}),React.createElement(SvgComponent,{className:"settings-icon",onClick:()=>{o("Settings"),goToTab(OPTIONS_URL)},svg:"settings-grey",id:"settings-icon"}),i&&React.createElement("span",{className:"sign-out",onClick:()=>{o("Log Out"),n.dispatch(logout()),this.setState({user:!1})}},translate("logOut"))),React.createElement("div",{className:"menu-header-right"},i?React.createElement(UserInfo,{userdata:i,goToMyAccount:()=>{o("My Profile"),goToTab(APP_MYWOT)},store:n}):React.createElement("div",{className:"sign-in",onClick:()=>{o("Log In"),goToTab(APP_MYWOT+LOGIN_PATH)}},translate("signIn")))),React.createElement("div",{className:"menu-container-body"},this.menuItems.map(e=>React.createElement(MenuItem,{store:n,item:e,showModal:()=>this.showModal(e)}))),React.createElement("div",{className:"menu-container-footer"},React.createElement("span",{className:"inline"}),React.createElement("span",{className:"inline"},(!i||!i.isPremiumUser)&&(e?React.createElement("div",null):React.createElement("div",{className:"premium"},React.createElement(GetPremium,{store:n,classes:"premium-title",text:"upgrade",name:"premium",category:"Main menu",isMenu:!0}))),React.createElement(SvgComponent,{className:"android-icon mobile-btns",onClick:()=>{o("Download Android"),goToTab(ANDROID_WEBSTORE_URL)},svg:"android",id:"android"}),React.createElement(SvgComponent,{className:"apple-icon mobile-btns",onClick:()=>{o("Download Apple"),goToTab(IPHONE_APPSTORE_URL)},svg:"apple",id:"apple"})))))}}
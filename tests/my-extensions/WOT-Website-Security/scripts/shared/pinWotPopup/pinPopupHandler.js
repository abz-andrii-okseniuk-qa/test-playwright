class PinPopupHandler{constructor(e){this.store=e,this.wasRendered=!1,this.pathnamesWithNoPopup=["/chooseYourPlan"]}init(){webextApi.runtime.onMessage.addListener((e,t,n)=>{if(e.action===SHOW_PIN_WOT_POPUP){if(this.store.getState().pinWotPopup.popupWasShown)return;const e=window.location.hostname,t=window.location.pathname;if(e.endsWith(root)&&this.pathnamesWithNoPopup.includes(t))return n(!1),void 0;this.render(),n(!0)}})}getContainer(){let e=document.getElementById(PIN_WOT_POPUP_CONTAINER_ID);return e||(e=document.createElement("div"),e.id=PIN_WOT_POPUP_CONTAINER_ID,document.body.appendChild(e)),e}render(){if("firefox"===crossbrowserName)return;this.store.getState().pinWotPopup.popupWasShown||this.wasRendered||(this.wasRendered=!0,this.store.dispatch(dismissPinWotPopup()),ReactDOM.render(React.createElement(ReactRedux.Provider,{store:this.store},React.createElement(PinPopupContainer,null)),document.body.appendChild(this.getContainer())))}}
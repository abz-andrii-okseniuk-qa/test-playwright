var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e};function _objectWithoutProperties(e,t){var a={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(a[o]=e[o]);return a}const ToggleTooltip=e=>{let t=e.className,a=_objectWithoutProperties(e,["className"]);return React.createElement("div",_extends({className:["tooltip",t].join(" ")},a),React.createElement("div",{className:"tooltip__button"}),React.createElement("div",{className:"tooltip__message"},a.children))};function upgradeNow(){GA("New-Settings","upgrade-tooltip",""),webextApi.runtime.sendMessage({name:OPEN_IN_CURR_TAB_MESSAGE,url:`${APP_MYWOT+UPGRADE}&${WOT_PRODUCT}=settings_tooltip`})}function CheckboxOption(e){const t=e.isEnabled,a=e.check,o=e.dispatch,n=e.actions,l=e.preActions,c=e.actionGA,i=e.premiumCheckbox,r=e.isPremiumUser,s=e.protection,p=e.dataAutomationClick,m=e.dataAutomationToggle,g=e.dataAutomationUpgrade,u=i&&!r;return React.createElement("div",{className:"toggle",onClick:t&&(()=>{GA("Settings",c,a?" Off":"On");const e=a?0:1;l&&l[e]&&l[e](),n[e]&&o(n[e]())}),"data-automation":p},s&&i&&!t&&!r&&React.createElement(ToggleTooltip,{className:"toggle-tooltip",text:"Upgrade now to enable this feature"},React.createElement("label",null,React.createElement("u",{onClick:upgradeNow,"data-automation":g},translate("toggleTooltipUpgradeNow"))," ",translate("toggleTooltipMessage"))),React.createElement("input",{type:"checkbox",className:"toggle_input hidden",checked:a,disabled:u}),React.createElement("label",{className:`toggle_label${i?" premium":""}${t?"":" not-protection"}`,"data-automation":m}))}
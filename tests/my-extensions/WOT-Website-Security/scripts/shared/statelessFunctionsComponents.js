var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e};function _objectWithoutProperties(e,t){var a={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(a[o]=e[o]);return a}const Tooltip=e=>{let t=e.className,a=_objectWithoutProperties(e,["className"]);return React.createElement("div",_extends({className:["tooltip",t].join(" ")},a),React.createElement("div",{className:"tooltip__button"}),React.createElement("div",{className:"tooltip__message"},a.text))},SocialButton=e=>{let t=e.className,a=_objectWithoutProperties(e,["className"]);return React.createElement("div",_extends({className:["popup-container__footer__follow-btn__social",t].join(" ")},a))},SvgIcon=e=>{const t=e.svg,a=e.className,o=e.onClick,s=e.disabled;var c=e.title;const r=void 0===c?"":c,n=`${webextApi.runtime.getURL("/images/")}${t}${t.endsWith(".svg")?"":".svg"}`;return React.createElement("div",{title:r,className:(a||"")+(s?" disabled":""),onClick:o},React.createElement("img",{src:n,alt:"X"}))};
function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,a=Array(t.length);e<t.length;e++)a[e]=t[e];return a}return Array.from(t)}class RadioButtonContainer extends React.Component{render(){var t=this.props;const e=t.dispatch,a=t.settings,n=t.type,r=t.actions,o=t.id,i=t.shieldState,s=t.host;return React.createElement("div",{className:"options-tab"},(!o&&"warnings"===n||"all"===o)&&React.createElement("div",{className:"options-tab__header-radio-button"},r.map(t=>React.createElement("div",{className:"options-tab__header-radio-button__text"},t.title))),(i||"warnings"===n||"all"===o)&&React.createElement("div",{className:"options-tab__container-radio-button"},r.map(t=>{s&&(t.params[0]="Donuts "+s);let r=a[n][o]?a[n][o]:a[n].all;return"warnings"===n&&(r=a[n]),React.createElement("div",{className:"options-tab__container-radio-button__item"},React.createElement(Tooltip,{className:"options-tooltip",text:webextApi.i18n.getMessage(t.arguments),onClick:()=>{a.protection&&(e(t.action(t.arguments,o)),GA.apply(void 0,_toConsumableArray(t.params)))}}),React.createElement("input",{name:o||n,type:"radio",checked:r===t.arguments}),React.createElement("label",{className:"options-tab__container-radio-button__item__label"}))})))}}
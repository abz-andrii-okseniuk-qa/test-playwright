function SvgComponent(e){let t=e.svg;var n=e.className;let s=void 0===n?"":n,a=e.onClick,i=e.disabled,o=e.id,l=e.onHover;const c=`${webextApi.runtime.getURL("/images/")}${t}${t.endsWith(".svg")?"#":".svg#"}${o||t}`;return React.createElement("svg",{className:s+(i?" disabled":""),onClick:a,onMouseMove:l},React.createElement("use",{xlinkHref:c}))}
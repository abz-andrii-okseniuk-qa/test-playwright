class FormattedString extends React.Component{constructor(e){super(e),this.style={}}render(){var e=this.props;let t=e.replacements,s=e.text,a=e.className,l=e.maxLength;for(let e in t)s=s&&s.replace("%"+e.toUpperCase()+"%",t[e]);l&&s.length>l&&(this.style.fontSize=100/(s.length/l)+"%");let r=s&&s.split("*")||[s];return React.createElement("div",{className:a||"",style:this.style},r.map((e,t)=>t%2==0?e:React.createElement("span",{className:"wot-text__bold"},e)))}}
class SemiStyledString extends React.Component{constructor(e){super(e),this.style={}}render(){var e=this.props;const t=e.text,s=e.wrapperClass,a=e.innerClass,r=(translate(t)||"").split("*")||[t];return React.createElement("div",{className:s||""},r.map((e,t)=>React.createElement("span",{className:t%2!=0&&a||""},e)))}}
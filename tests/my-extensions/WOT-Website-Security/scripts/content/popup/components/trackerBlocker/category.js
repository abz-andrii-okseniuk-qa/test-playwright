var _slicedToArray=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var a=[],c=!0,r=!1,s=void 0;try{for(var n,l=e[Symbol.iterator]();!(c=(n=l.next()).done)&&(a.push(n.value),!t||a.length!==t);c=!0);}catch(e){r=!0,s=e}finally{try{!c&&l.return&&l.return()}finally{if(r)throw s}}return a}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")};class SliderTrackerCategory extends React.Component{constructor(e){super(e),this.toggleTrackerfunc=e.toggleTracker,this.category=e.category,this.options={allBlocked:{className:"all-blocked",content:"trackerBlocked"},noneBlocked:{className:"none-blocked",content:"trackerUnblocked"},someBlocked:{className:"some-blocked",content:"trackerSomeBlocked"},noneActive:{className:"none-active",content:"none"}},this.state={expanded:!1,data:[],blocked:0,allowed:0},this.propsToState(e),this.isSafari="safari"===crossbrowserName}componentWillReceiveProps(e){this.propsToState(e)}propsToState(e){const t=Object.values(e.data).filter(e=>e).length;setTimeout(()=>{this.setState({data:Object.entries(e.data).sort((e,t)=>e[0]<t[0]?-1:1),blocked:t,allowed:Object.values(e.data).length-t})})}toggleTracker(e,t,a){a.stopPropagation(),this.toggleTrackerfunc(e,t)}toggleExpanded(e){this.setState({expanded:!this.state.expanded})}getMaxHeight(e){return e?this.ref.scrollHeight+13+"px":"40px"}getSelectedOption(e,t){let a,c;switch(!0){case!e&&!t:a=this.options.noneActive,c=translate(a.content);break;case!!e&&!t:a=this.options.allBlocked,c=e+" "+translate(a.content);break;case!!t&&!e:a=this.options.noneBlocked,c=`${t}${this.isSafari?"":" "+translate(a.content)}`;break;case!!e&&!!t:a=this.options.someBlocked,c=translate(a.content).replace("%1%",e).replace("%2%",e+t);break;default:a=this.options.noneActive,c=translate(a.content)}return{className:a.className,content:c}}render(){var e=this.state;const t=e.data,a=e.blocked,c=e.allowed,r=e.expanded,s=this.getSelectedOption(a,c);return React.createElement("div",{className:"slider-tracker-category"},React.createElement("div",{className:`category-icon ${this.category} ${s.className}`}),React.createElement("div",{ref:e=>this.ref=e,className:"category-data"+(r?" expanded":""),style:{maxHeight:this.getMaxHeight(r)}},React.createElement("div",null,React.createElement("div",{className:"category-title "+s.className,onClick:this.toggleExpanded.bind(this)},React.createElement("div",null,React.createElement("div",{className:"category-arrow "+(t.length?"":"none-active")}),React.createElement("div",{className:"category-name "+(t.length?"":"none-active")},translate(this.category))),React.createElement("div",{className:"category-specs "+s.className},s.content)),React.createElement("div",{className:"category-divider"}),React.createElement("div",{className:"trackers-list"},!t.length&&React.createElement("div",{className:"tracker-item"},React.createElement("div",{className:"tracker-name none-active"},translate("noTrackersDetected")),React.createElement("div",{className:"tracker-state"}," ")),t.map(e=>{var t=_slicedToArray(e,2);let a=t[0],c=t[1];return React.createElement("div",{className:"tracker-item"},React.createElement("div",{className:"tracker-name "+(c?"blocked":"allowed")},a),!this.isSafari&&React.createElement("div",{className:"tracker-state",onClick:this.toggleTracker.bind(this,a,c)},translate(c?"allow":"block")))})))))}}
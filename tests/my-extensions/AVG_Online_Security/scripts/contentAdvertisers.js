!function(e){
var t={}
function n(r){
if(t[r]){
return t[r].exports
}
var i=t[r]={
i:r,
l:!1,
exports:{}
}
return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports
}
n.m=e,n.c=t,n.d=function(e,t,r){
n.o(e,t)||Object.defineProperty(e,t,{
enumerable:!0,
get:r
})
},n.r=function(e){
"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{
value:"Module"
}),Object.defineProperty(e,"__esModule",{
value:!0
})
},n.t=function(e,t){
if(1&t&&(e=n(e)),8&t){
return e
}
if(4&t&&"object"==typeof e&&e&&e.__esModule){
return e
}
var r=Object.create(null)
if(n.r(r),Object.defineProperty(r,"default",{
enumerable:!0,
value:e
}),2&t&&"string"!=typeof e){
for(var i in e){
n.d(r,i,function(t){
return e[t]
}.bind(null,i))
}
}
return r
},n.n=function(e){
var t=e&&e.__esModule?function(){
return e.default
}:function(){
return e
}
return n.d(t,"a",t),t
},n.o=function(e,t){
return Object.prototype.hasOwnProperty.call(e,t)
},n.p="",n(n.s=0)
}([function(e,t,n){
"use strict"
n.r(t)
class r{
constructor(e){
this.execute=e
}
enable(){
return this.execute("browserAction","enable",...arguments)
}
disable(){
return this.execute("browserAction","disable",...arguments)
}
setTitle(){
return this.execute("browserAction","setTitle",...arguments)
}
setIcon(){
return this.execute("browserAction","setIcon",...arguments)
}
setBadgeText(){
return this.execute("browserAction","setBadgeText",...arguments)
}
setBadgeTextColor(){
return this.execute("browserAction","setBadgeTextColor",...arguments)
}
setBadgeBackgroundColor(){
return this.execute("browserAction","setBadgeBackgroundColor",...arguments)
}
get onClicked(){
return{
addListener:this.execute.bind(this,"browserAction.onClicked","addListener"),
hasListener:this.execute.bind(this,"browserAction.onClicked","hasListener"),
removeListener:this.execute.bind(this,"browserAction.onClicked","removeListener")
}
}
}
class i{
constructor(e){
this.execute=e
}
getURL(){
return this.execute("extension","getURL",...arguments)
}
}
class s{
constructor(e){
this.execute=e
}
get lastError(){
return this.execute("runtime","lastError")
}
get onInstalled(){
return{
addListener:this.execute.bind(this,"runtime.onInstalled","addListener"),
hasListener:this.execute.bind(this,"runtime.onInstalled","hasListener"),
removeListener:this.execute.bind(this,"runtime.onInstalled","removeListener")
}
}
get onMessage(){
return{
addListener:this.execute.bind(this,"runtime.onMessage","addListener"),
hasListener:this.execute.bind(this,"runtime.onMessage","hasListener"),
removeListener:this.execute.bind(this,"runtime.onMessage","removeListener")
}
}
sendMessage(){
return this.execute("runtime","sendMessage",...arguments)
}
setUninstallURL(){
return this.execute("runtime","setUninstallURL",...arguments)
}
getManifest(){
return this.execute("runtime","getManifest",...arguments)
}
}
class o{
constructor(e){
this.execute=e
}
getUILanguage(){
return this.execute("i18n","getUILanguage")
}
getMessage(){
return this.execute("i18n","getMessage",...arguments)
}
}
class a{
constructor(e){
this.execute=e
}
get local(){
return{
get:this.execute.bind(this,"storage.local","get"),
set:this.execute.bind(this,"storage.local","set"),
remove:this.execute.bind(this,"storage.local","remove"),
clear:this.execute.bind(this,"storage.local","clear"),
getBytesInUse:this.execute.bind(this,"storage.local","getBytesInUse")
}
}
}
class u{
constructor(e){
this.execute=e
}
sendMessage(){
return this.execute("tabs","sendMessage",...arguments)
}
create(){
return this.execute("tabs","create",...arguments)
}
get(){
return this.execute("tabs","get",...arguments)
}
query(){
return this.execute("tabs","query",...arguments)
}
remove(){
return this.execute("tabs","remove",...arguments)
}
update(){
return this.execute("tabs","update",...arguments)
}
executeScript(){
return this.execute("tabs","executeScript",...arguments)
}
get onActivated(){
return{
addListener:this.execute.bind(this,"tabs.onActivated","addListener"),
hasListener:this.execute.bind(this,"tabs.onActivated","hasListener"),
removeListener:this.execute.bind(this,"tabs.onActivated","removeListener")
}
}
get onUpdated(){
return{
addListener:this.execute.bind(this,"tabs.onUpdated","addListener"),
hasListener:this.execute.bind(this,"tabs.onUpdated","hasListener"),
removeListener:this.execute.bind(this,"tabs.onUpdated","removeListener")
}
}
get onCreated(){
return{
addListener:this.execute.bind(this,"tabs.onCreated","addListener"),
hasListener:this.execute.bind(this,"tabs.onCreated","hasListener"),
removeListener:this.execute.bind(this,"tabs.onCreated","removeListener")
}
}
get onRemoved(){
return{
addListener:this.execute.bind(this,"tabs.onRemoved","addListener"),
hasListener:this.execute.bind(this,"tabs.onRemoved","hasListener"),
removeListener:this.execute.bind(this,"tabs.onRemoved","removeListener")
}
}
}
class c{
constructor(e){
this.execute=e
}
create(){
return this.execute("windows","create",...arguments)
}
update(){
return this.execute("windows","update",...arguments)
}
remove(){
return this.execute("windows","remove",...arguments)
}
get(){
return this.execute("windows","get",...arguments)
}
get onFocusChanged(){
return{
addListener:this.execute.bind(this,"windows.onFocusChanged","addListener"),
hasListener:this.execute.bind(this,"windows.onFocusChanged","hasListener"),
removeListener:this.execute.bind(this,"windows.onFocusChanged","removeListener")
}
}
}
class d{
constructor(e){
this.execute=e
}
get onCommitted(){
return{
addListener:this.execute.bind(this,"webNavigation.onCommitted","addListener"),
hasListener:this.execute.bind(this,"webNavigation.onCommitted","hasListener"),
removeListener:this.execute.bind(this,"webNavigation.onCommitted","removeListener")
}
}
get onHistoryStateUpdated(){
return{
addListener:this.execute.bind(this,"webNavigation.onHistoryStateUpdated","addListener"),
hasListener:this.execute.bind(this,"webNavigation.onHistoryStateUpdated","hasListener"),
removeListener:this.execute.bind(this,"webNavigation.onHistoryStateUpdated","removeListener")
}
}
get onReferenceFragmentUpdated(){
return{
addListener:this.execute.bind(this,"webNavigation.onReferenceFragmentUpdated","addListener"),
hasListener:this.execute.bind(this,"webNavigation.onReferenceFragmentUpdated","hasListener"),
removeListener:this.execute.bind(this,"webNavigation.onReferenceFragmentUpdated","removeListener")
}
}
get onBeforeNavigate(){
return{
addListener:this.execute.bind(this,"webNavigation.onBeforeNavigate","addListener"),
hasListener:this.execute.bind(this,"webNavigation.onBeforeNavigate","hasListener"),
removeListener:this.execute.bind(this,"webNavigation.onBeforeNavigate","removeListener")
}
}
get onDOMContentLoaded(){
return{
addListener:this.execute.bind(this,"webNavigation.onDOMContentLoaded","addListener"),
hasListener:this.execute.bind(this,"webNavigation.onDOMContentLoaded","hasListener"),
removeListener:this.execute.bind(this,"webNavigation.onDOMContentLoaded","removeListener")
}
}
get onCompleted(){
return{
addListener:this.execute.bind(this,"webNavigation.onCompleted","addListener"),
hasListener:this.execute.bind(this,"webNavigation.onCompleted","hasListener"),
removeListener:this.execute.bind(this,"webNavigation.onCompleted","removeListener")
}
}
get onErrorOccurred(){
return{
addListener:this.execute.bind(this,"webNavigation.onErrorOccurred","addListener"),
hasListener:this.execute.bind(this,"webNavigation.onErrorOccurred","hasListener"),
removeListener:this.execute.bind(this,"webNavigation.onErrorOccurred","removeListener")
}
}
}
class h{
constructor(e){
this.execute=e
}
get onBeforeRequest(){
return{
addListener:this.execute.bind(this,"webRequest.onBeforeRequest","addListener"),
hasListener:this.execute.bind(this,"webRequest.onBeforeRequest","hasListener"),
removeListener:this.execute.bind(this,"webRequest.onBeforeRequest","removeListener")
}
}
get onBeforeRedirect(){
return{
addListener:this.execute.bind(this,"webRequest.onBeforeRedirect","addListener"),
hasListener:this.execute.bind(this,"webRequest.onBeforeRedirect","hasListener"),
removeListener:this.execute.bind(this,"webRequest.onBeforeRedirect","removeListener")
}
}
get onSendHeaders(){
return{
addListener:this.execute.bind(this,"webRequest.onSendHeaders","addListener"),
hasListener:this.execute.bind(this,"webRequest.onSendHeaders","hasListener"),
removeListener:this.execute.bind(this,"webRequest.onSendHeaders","removeListener")
}
}
get onHeadersReceived(){
return{
addListener:this.execute.bind(this,"webRequest.onHeadersReceived","addListener"),
hasListener:this.execute.bind(this,"webRequest.onHeadersReceived","hasListener"),
removeListener:this.execute.bind(this,"webRequest.onHeadersReceived","removeListener")
}
}
get onResponseStarted(){
return{
addListener:this.execute.bind(this,"webRequest.onResponseStarted","addListener"),
hasListener:this.execute.bind(this,"webRequest.onResponseStarted","hasListener"),
removeListener:this.execute.bind(this,"webRequest.onResponseStarted","removeListener")
}
}
get onCompleted(){
return{
addListener:this.execute.bind(this,"webRequest.onCompleted","addListener"),
hasListener:this.execute.bind(this,"webRequest.onCompleted","hasListener"),
removeListener:this.execute.bind(this,"webRequest.onCompleted","removeListener")
}
}
get onErrorOccurred(){
return{
addListener:this.execute.bind(this,"webRequest.onErrorOccurred","addListener"),
hasListener:this.execute.bind(this,"webRequest.onErrorOccurred","hasListener"),
removeListener:this.execute.bind(this,"webRequest.onErrorOccurred","removeListener")
}
}
}
var l=Array.isArray,b="object"==typeof global&&global&&global.Object===Object&&global,v="object"==typeof self&&self&&self.Object===Object&&self,f=b||v||Function("return this")(),g=f.Symbol,p=Object.prototype,m=p.hasOwnProperty,L=p.toString,x=g?g.toStringTag:void 0
var y=function(e){
var t=m.call(e,x),n=e[x]
try{
e[x]=void 0
var r=!0
}catch(e){}
var i=L.call(e)
return r&&(t?e[x]=n:delete e[x]),i
},w=Object.prototype.toString
var _=function(e){
return w.call(e)
},R=g?g.toStringTag:void 0
var C=function(e){
return null==e?void 0===e?"[object Undefined]":"[object Null]":R&&R in Object(e)?y(e):_(e)
}
var O=function(e){
return null!=e&&"object"==typeof e
}
var S=function(e){
return"symbol"==typeof e||O(e)&&"[object Symbol]"==C(e)
},N=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,j=/^\w*$/
var A=function(e,t){
if(l(e)){
return!1
}
var n=typeof e
return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!S(e))||(j.test(e)||!N.test(e)||null!=t&&e in Object(t))
}
var q=function(e){
var t=typeof e
return null!=e&&("object"==t||"function"==t)
}
var B,U=function(e){
if(!q(e)){
return!1
}
var t=C(e)
return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t
},M=f["__core-js_shared__"],F=(B=/[^.]+$/.exec(M&&M.keys&&M.keys.IE_PROTO||""))?"Symbol(src)_1."+B:""
var E=function(e){
return!!F&&F in e
},T=Function.prototype.toString
var H=function(e){
if(null!=e){
try{
return T.call(e)
}catch(e){}
try{
return e+""
}catch(e){}
}
return""
},z=/^\[object .+?Constructor\]$/,I=Function.prototype,P=Object.prototype,k=I.toString,$=P.hasOwnProperty,D=RegExp("^"+k.call($).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$")
var G=function(e){
return!(!q(e)||E(e))&&(U(e)?D:z).test(H(e))
}
var V=function(e,t){
return null==e?void 0:e[t]
}
var W=function(e,t){
var n=V(e,t)
return G(n)?n:void 0
},J=W(Object,"create")
var K=function(){
this.__data__=J?J(null):{},this.size=0
}
var Q=function(e){
var t=this.has(e)&&delete this.__data__[e]
return this.size-=t?1:0,t
},X=Object.prototype.hasOwnProperty
var Y=function(e){
var t=this.__data__
if(J){
var n=t[e]
return"__lodash_hash_undefined__"===n?void 0:n
}
return X.call(t,e)?t[e]:void 0
},Z=Object.prototype.hasOwnProperty
var ee=function(e){
var t=this.__data__
return J?void 0!==t[e]:Z.call(t,e)
}
var te=function(e,t){
var n=this.__data__
return this.size+=this.has(e)?0:1,n[e]=J&&void 0===t?"__lodash_hash_undefined__":t,
this
}
function ne(e){
var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){
var r=e[t]
this.set(r[0],r[1])
}
}
ne.prototype.clear=K,ne.prototype.delete=Q,ne.prototype.get=Y,ne.prototype.has=ee,
ne.prototype.set=te
var re=ne
var ie=function(){
this.__data__=[],this.size=0
}
var se=function(e,t){
return e===t||e!=e&&t!=t
}
var oe=function(e,t){
for(var n=e.length;n--;){
if(se(e[n][0],t)){
return n
}
}
return-1
},ae=Array.prototype.splice
var ue=function(e){
var t=this.__data__,n=oe(t,e)
return!(n<0)&&(n==t.length-1?t.pop():ae.call(t,n,1),--this.size,!0)
}
var ce=function(e){
var t=this.__data__,n=oe(t,e)
return n<0?void 0:t[n][1]
}
var de=function(e){
return oe(this.__data__,e)>-1
}
var he=function(e,t){
var n=this.__data__,r=oe(n,e)
return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this
}
function le(e){
var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){
var r=e[t]
this.set(r[0],r[1])
}
}
le.prototype.clear=ie,le.prototype.delete=ue,le.prototype.get=ce,le.prototype.has=de,
le.prototype.set=he
var be=le,ve=W(f,"Map")
var fe=function(){
this.size=0,this.__data__={
hash:new re,
map:new(ve||be),
string:new re
}
}
var ge=function(e){
var t=typeof e
return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e
}
var pe=function(e,t){
var n=e.__data__
return ge(t)?n["string"==typeof t?"string":"hash"]:n.map
}
var me=function(e){
var t=pe(this,e).delete(e)
return this.size-=t?1:0,t
}
var Le=function(e){
return pe(this,e).get(e)
}
var xe=function(e){
return pe(this,e).has(e)
}
var ye=function(e,t){
var n=pe(this,e),r=n.size
return n.set(e,t),this.size+=n.size==r?0:1,this
}
function we(e){
var t=-1,n=null==e?0:e.length
for(this.clear();++t<n;){
var r=e[t]
this.set(r[0],r[1])
}
}
we.prototype.clear=fe,we.prototype.delete=me,we.prototype.get=Le,we.prototype.has=xe,
we.prototype.set=ye
var _e=we
function Re(e,t){
if("function"!=typeof e||null!=t&&"function"!=typeof t){
throw new TypeError("Expected a function")
}
var n=function(){
var r=arguments,i=t?t.apply(this,r):r[0],s=n.cache
if(s.has(i)){
return s.get(i)
}
var o=e.apply(this,r)
return n.cache=s.set(i,o)||s,o
}
return n.cache=new(Re.Cache||_e),n
}
Re.Cache=_e
var Ce=Re
var Oe=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Se=/\\(\\)?/g,Ne=function(e){
var t=Ce(e,(function(e){
return 500===n.size&&n.clear(),e
})),n=t.cache
return t
}((function(e){
var t=[]
return 46===e.charCodeAt(0)&&t.push(""),e.replace(Oe,(function(e,n,r,i){
t.push(r?i.replace(Se,"$1"):n||e)
})),t
}))
var je=function(e,t){
for(var n=-1,r=null==e?0:e.length,i=Array(r);++n<r;){
i[n]=t(e[n],n,e)
}
return i
},Ae=g?g.prototype:void 0,qe=Ae?Ae.toString:void 0
var Be=function e(t){
if("string"==typeof t){
return t
}
if(l(t)){
return je(t,e)+""
}
if(S(t)){
return qe?qe.call(t):""
}
var n=t+""
return"0"==n&&1/t==-1/0?"-0":n
}
var Ue=function(e){
return null==e?"":Be(e)
}
var Me=function(e,t){
return l(e)?e:A(e,t)?[e]:Ne(Ue(e))
}
var Fe=function(e){
if("string"==typeof e||S(e)){
return e
}
var t=e+""
return"0"==t&&1/e==-1/0?"-0":t
}
var Ee=function(e,t){
for(var n=0,r=(t=Me(t,e)).length;null!=e&&n<r;){
e=e[Fe(t[n++])]
}
return n&&n==r?e:void 0
}
var Te=function(e,t,n){
var r=null==e?void 0:Ee(e,t)
return void 0===r?n:r
}
class He{
constructor(e){
const t=function(){
const t=[...arguments],n=Te(e,t.shift())||{},r=n[t.shift()]
return"function"==typeof r?r.apply(n,t):r
}
this.browserAction=new r(t),this.extension=new i(t),this.i18n=new o(t),this.runtime=new s(t),
this.storage=new a(t),
this.tabs=new u(t),this.windows=new c(t),this.webNavigation=new d(t),
this.webRequest=new h(t)
}
}
const ze=new He(chrome)
var Ie=e=>{
document.title="AVAST"===e?"Avast Online Security":"AVG Online Security"
},Pe=()=>{
const e=document.querySelector("link[rel*='icon']")||document.createElement("link")
e.type="image/x-icon",e.rel="shortcut icon",e.href=ze.extension.getURL("common/ui/icons/icon32.png"),
document.getElementsByTagName("head")[0].appendChild(e)
},ke=()=>{
const e=document.createElement("style")
e.appendChild(document.createTextNode(`\n    @font-face {\n      font-family: 'Nitro Font';\n      font-style: normal;\n      font-weight: 400;\n      src: local('Nitro Font'), local('NitroFont'),\n      url(${ze.extension.getURL("common/ui/fonts/proximanova-regular-webfont.woff2")}) format('woff2');\n    }\n    @font-face {\n      font-family: 'Nitro Font';\n      font-weight: 700;\n      src: local('Nitro Font Bold'), local('NitroFont-Bold'),\n      url(${ze.extension.getURL("common/ui/fonts/proximanova-bold-webfont.woff2")}) format('woff2');\n    }\n    `)),
document.head.appendChild(e)
},$e=(e,t)=>{
const n=document.createElement("div")
n.style.position="fixed",n.style.top="0",n.style.bottom="0",n.style.left="0",n.style.right="0",
n.style.zIndex="2147483647",
n.style.backgroundColor="#2D364C",n.style.display="flex",
n.style.flexDirection="column",
n.style.alignItems="center",n.style.justifyContent="center"
const r=document.createElement("h1")
r.style.color="#fff",r.style.fontFamily="Nitro Font, Arial",r.style.marginBottom="10px",
r.style.textTransform="none",
r.innerHTML="AVAST"===t?"Avast Online Security":"AVG Online Security"
const i=document.createElement("p")
i.style.color="#fff",i.style.fontFamily="Nitro Font, Arial",i.style.marginBottom="40px",
i.style.textTransform="none",
i.innerHTML=e
const s=document.createElement("img")
s.src=ze.extension.getURL("common/ui/icons/icon-loading.svg"),s.style.width="35px",
s.style.height="35px",
s.animate([{
transform:"rotate(0deg)"
},{
transform:"rotate(360deg)"
}],{
duration:500,
iterations:1/0
}),document.body.appendChild(n),n.appendChild(r),n.appendChild(i),
n.appendChild(s)
}
;(()=>{
if(!location.href.includes("?breachGuardStartScraping=true")){
return
}
new He(chrome).runtime.sendMessage({
message:"scraperWindowRequireData"
},({loadingMessage:e,brand:t})=>{
Ie(t),Pe(),ke(),$e(e,t)
})
})()
}])

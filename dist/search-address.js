import{b as A,s as D}from"./chunks/util.js";function X(e,t,r,n){function l(o){return o instanceof r?o:new r(function(a){a(o)})}return new(r||(r=Promise))(function(o,a){function c(g){try{h(n.next(g))}catch(p){a(p)}}function u(g){try{h(n.throw(g))}catch(p){a(p)}}function h(g){g.done?o(g.value):l(g.value).then(c,u)}h((n=n.apply(e,[])).next())})}typeof SuppressedError=="function"&&SuppressedError;function V(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Y=function e(t,r){if(t===r)return!0;if(t&&r&&typeof t=="object"&&typeof r=="object"){if(t.constructor!==r.constructor)return!1;var n,l,o;if(Array.isArray(t)){if(n=t.length,n!=r.length)return!1;for(l=n;l--!==0;)if(!e(t[l],r[l]))return!1;return!0}if(t.constructor===RegExp)return t.source===r.source&&t.flags===r.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===r.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===r.toString();if(o=Object.keys(t),n=o.length,n!==Object.keys(r).length)return!1;for(l=n;l--!==0;)if(!Object.prototype.hasOwnProperty.call(r,o[l]))return!1;for(l=n;l--!==0;){var a=o[l];if(!e(t[a],r[a]))return!1}return!0}return t!==t&&r!==r},Q=V(Y);const N="__googleMapsScriptId";var _;(function(e){e[e.INITIALIZED=0]="INITIALIZED",e[e.LOADING=1]="LOADING",e[e.SUCCESS=2]="SUCCESS",e[e.FAILURE=3]="FAILURE"})(_||(_={}));class L{constructor({apiKey:t,authReferrerPolicy:r,channel:n,client:l,id:o=N,language:a,libraries:c=[],mapIds:u,nonce:h,region:g,retries:p=3,url:S="https://maps.googleapis.com/maps/api/js",version:y}){if(this.callbacks=[],this.done=!1,this.loading=!1,this.errors=[],this.apiKey=t,this.authReferrerPolicy=r,this.channel=n,this.client=l,this.id=o||N,this.language=a,this.libraries=c,this.mapIds=u,this.nonce=h,this.region=g,this.retries=p,this.url=S,this.version=y,L.instance){if(!Q(this.options,L.instance.options))throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(L.instance.options)}`);return L.instance}L.instance=this}get options(){return{version:this.version,apiKey:this.apiKey,channel:this.channel,client:this.client,id:this.id,libraries:this.libraries,language:this.language,region:this.region,mapIds:this.mapIds,nonce:this.nonce,url:this.url,authReferrerPolicy:this.authReferrerPolicy}}get status(){return this.errors.length?_.FAILURE:this.done?_.SUCCESS:this.loading?_.LOADING:_.INITIALIZED}get failed(){return this.done&&!this.loading&&this.errors.length>=this.retries+1}createUrl(){let t=this.url;return t+="?callback=__googleMapsCallback&loading=async",this.apiKey&&(t+=`&key=${this.apiKey}`),this.channel&&(t+=`&channel=${this.channel}`),this.client&&(t+=`&client=${this.client}`),this.libraries.length>0&&(t+=`&libraries=${this.libraries.join(",")}`),this.language&&(t+=`&language=${this.language}`),this.region&&(t+=`&region=${this.region}`),this.version&&(t+=`&v=${this.version}`),this.mapIds&&(t+=`&map_ids=${this.mapIds.join(",")}`),this.authReferrerPolicy&&(t+=`&auth_referrer_policy=${this.authReferrerPolicy}`),t}deleteScript(){const t=document.getElementById(this.id);t&&t.remove()}load(){return this.loadPromise()}loadPromise(){return new Promise((t,r)=>{this.loadCallback(n=>{n?r(n.error):t(window.google)})})}importLibrary(t){return this.execute(),google.maps.importLibrary(t)}loadCallback(t){this.callbacks.push(t),this.execute()}setScript(){var t,r;if(document.getElementById(this.id)){this.callback();return}const n={key:this.apiKey,channel:this.channel,client:this.client,libraries:this.libraries.length&&this.libraries,v:this.version,mapIds:this.mapIds,language:this.language,region:this.region,authReferrerPolicy:this.authReferrerPolicy};Object.keys(n).forEach(o=>!n[o]&&delete n[o]),!((r=(t=window?.google)===null||t===void 0?void 0:t.maps)===null||r===void 0)&&r.importLibrary||(o=>{let a,c,u,h="The Google Maps JavaScript API",g="google",p="importLibrary",S="__ib__",y=document,E=window;E=E[g]||(E[g]={});const w=E.maps||(E.maps={}),v=new Set,m=new URLSearchParams,$=()=>a||(a=new Promise((b,k)=>X(this,void 0,void 0,function*(){var O;yield c=y.createElement("script"),c.id=this.id,m.set("libraries",[...v]+"");for(u in o)m.set(u.replace(/[A-Z]/g,d=>"_"+d[0].toLowerCase()),o[u]);m.set("callback",g+".maps."+S),c.src=this.url+"?"+m,w[S]=b,c.onerror=()=>a=k(Error(h+" could not load.")),c.nonce=this.nonce||((O=y.querySelector("script[nonce]"))===null||O===void 0?void 0:O.nonce)||"",y.head.append(c)})));w[p]?console.warn(h+" only loads once. Ignoring:",o):w[p]=(b,...k)=>v.add(b)&&$().then(()=>w[p](b,...k))})(n);const l=this.libraries.map(o=>this.importLibrary(o));l.length||l.push(this.importLibrary("core")),Promise.all(l).then(()=>this.callback(),o=>{const a=new ErrorEvent("error",{error:o});this.loadErrorCallback(a)})}reset(){this.deleteScript(),this.done=!1,this.loading=!1,this.errors=[],this.onerrorEvent=null}resetIfRetryingFailed(){this.failed&&this.reset()}loadErrorCallback(t){if(this.errors.push(t),this.errors.length<=this.retries){const r=this.errors.length*Math.pow(2,this.errors.length);console.error(`Failed to load Google Maps script, retrying in ${r} ms.`),setTimeout(()=>{this.deleteScript(),this.setScript()},r)}else this.onerrorEvent=t,this.callback()}callback(){this.done=!0,this.loading=!1,this.callbacks.forEach(t=>{t(this.onerrorEvent)}),this.callbacks=[]}execute(){if(this.resetIfRetryingFailed(),!this.loading)if(this.done)this.callback();else{if(window.google&&window.google.maps&&window.google.maps.version){console.warn("Google Maps already loaded outside @googlemaps/js-api-loader. This may result in undesirable behavior as options and script parameters may not match."),this.callback();return}this.loading=!0,this.setScript()}}}var R=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function ee(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function te(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}var F=te,re=typeof R=="object"&&R&&R.Object===Object&&R,ie=re,ne=ie,oe=typeof self=="object"&&self&&self.Object===Object&&self,se=ne||oe||Function("return this")(),M=se,ae=M,le=function(){return ae.Date.now()},ce=le,de=/\s/;function ue(e){for(var t=e.length;t--&&de.test(e.charAt(t)););return t}var fe=ue,he=fe,pe=/^\s+/;function ge(e){return e&&e.slice(0,he(e)+1).replace(pe,"")}var me=ge,be=M,ve=be.Symbol,G=ve,U=G,q=Object.prototype,ye=q.hasOwnProperty,we=q.toString,C=U?U.toStringTag:void 0;function Se(e){var t=ye.call(e,C),r=e[C];try{e[C]=void 0;var n=!0}catch{}var l=we.call(e);return n&&(t?e[C]=r:delete e[C]),l}var Ee=Se,Ie=Object.prototype,Te=Ie.toString;function Oe(e){return Te.call(e)}var je=Oe,K=G,$e=Ee,ke=je,Ae="[object Null]",Le="[object Undefined]",B=K?K.toStringTag:void 0;function _e(e){return e==null?e===void 0?Le:Ae:B&&B in Object(e)?$e(e):ke(e)}var Ce=_e;function Re(e){return e!=null&&typeof e=="object"}var xe=Re,Pe=Ce,De=xe,Ne="[object Symbol]";function Fe(e){return typeof e=="symbol"||De(e)&&Pe(e)==Ne}var Me=Fe,Ge=me,W=F,Ue=Me,Z=NaN,qe=/^[-+]0x[0-9a-f]+$/i,Ke=/^0b[01]+$/i,Be=/^0o[0-7]+$/i,We=parseInt;function Ze(e){if(typeof e=="number")return e;if(Ue(e))return Z;if(W(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=W(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=Ge(e);var r=Ke.test(e);return r||Be.test(e)?We(e.slice(2),r?2:8):qe.test(e)?Z:+e}var ze=Ze,He=F,x=ce,z=ze,Je="Expected a function",Xe=Math.max,Ve=Math.min;function Ye(e,t,r){var n,l,o,a,c,u,h=0,g=!1,p=!1,S=!0;if(typeof e!="function")throw new TypeError(Je);t=z(t)||0,He(r)&&(g=!!r.leading,p="maxWait"in r,o=p?Xe(z(r.maxWait)||0,t):o,S="trailing"in r?!!r.trailing:S);function y(d){var i=n,s=l;return n=l=void 0,h=d,a=e.apply(s,i),a}function E(d){return h=d,c=setTimeout(m,t),g?y(d):a}function w(d){var i=d-u,s=d-h,f=t-i;return p?Ve(f,o-s):f}function v(d){var i=d-u,s=d-h;return u===void 0||i>=t||i<0||p&&s>=o}function m(){var d=x();if(v(d))return $(d);c=setTimeout(m,w(d))}function $(d){return c=void 0,S&&n?y(d):(n=l=void 0,a)}function b(){c!==void 0&&clearTimeout(c),h=0,n=u=l=c=void 0}function k(){return c===void 0?a:$(x())}function O(){var d=x(),i=v(d);if(n=arguments,l=this,u=d,i){if(c===void 0)return E(u);if(p)return clearTimeout(c),c=setTimeout(m,t),y(u)}return c===void 0&&(c=setTimeout(m,t)),a}return O.cancel=b,O.flush=k,O}var Qe=Ye,et=ee(Qe);const tt=A(document.body.dataset.placesKey,"places api key was not found!"),rt=new L({apiKey:tt,version:"weekly"}),it=async()=>{const e=new(await rt.importLibrary("places")).AutocompleteService,t=new Map;return{fetchAddresses:et((r,n)=>{const l=t.get(r);if(l!==void 0){n(l);return}const o=(a,c)=>{let u=[];c!==google.maps.places.PlacesServiceStatus.OK&&c!=="ZERO_RESULTS"&&console.error(`Something went wrong with places api. Status ${c}`),a!==null&&(u=a.map(h=>h.description)),t.set(r,u),n(u)};e.getPlacePredictions({input:r,componentRestrictions:{country:"ae"}},o)},100)}},nt=it(),ot=()=>{const e=A(document.querySelector("[data-address-input]"),"Address input element([data-address-input]) was not found!"),t=A(e.closest("[data-address-container]")?.querySelector("[data-address-result]"),"Address result container([data-address-result]) was not found!"),r=A(t?.querySelector("[data-address-list]"),"Address result list([data-address-list]) was not found!"),n=A(r?.querySelector("[data-address-item]"),"Address result item([data-address-item]) was not found!"),l=document.createDocumentFragment();let o=[],a=0,c,u=!1;const h=r.id||"address-result-options";l.appendChild(t),t.dataset.initialized="";const g=()=>{e.type="search",e.ariaAutoComplete="both",e.setAttribute("autocomplete","off"),e.setAttribute("autocorrect","off"),e.setAttribute("autocapitalize","off"),e.setAttribute("spellcheck","false"),e.setAttribute("aria-controls",h),r.role="listbox",r.id=h},p=()=>{const{height:i}=t.getBoundingClientRect(),{height:s,top:f,left:I,width:T}=e.getBoundingClientRect(),j=f+globalThis.scrollY,H=j+s,P=I+globalThis.scrollX,J=f+s+i+80;c=window.innerHeight>J?"bottom":"top",t.setAttribute("data-position",c),c==="bottom"?D(t,{position:"absolute",top:`${H}px`,left:`${P}px`,width:`${T}px`}):D(t,{position:"absolute",left:`${P}px`,top:`${j-i}px`,width:`${T}px`})},S=()=>{const i=()=>{u&&p()};new IntersectionObserver(s=>{for(const f of s){if(f.isIntersecting){window.addEventListener("scroll",i);return}window.removeEventListener("scroll",i)}},{root:null,threshold:0}).observe(e)},y=()=>{const i=()=>{u&&p()};new ResizeObserver(s=>{for(const f of s)i()}).observe(document.body)},E=i=>{o=i},w=i=>{const s=o[a],f=o[i];s&&(s.classList.remove("focused"),s.ariaSelected="false"),f&&(f.classList.add("focused"),f.ariaSelected="true",e.setAttribute("aria-activedescendant",f.id)),a=i};let v,m;const $=i=>{const s=o[i],f=A(s?.querySelector("p"),"List item paragraph element was not found!").textContent?.trim();if(!f)throw new Error("Result item is invalid");e.value=f,e.focus()},b=()=>{l.appendChild(t),e.removeAttribute("aria-activedescendant"),m!==void 0&&document.body.removeEventListener("mousedown",m),v!==void 0&&document.removeEventListener("keydown",v),u=!1},k=()=>{for(let i=0;i<o.length;i++){const s=o[i];s.role="option",s.ariaSelected="false",s.id=`address-suggestion-${i}`,s.addEventListener("mouseenter",()=>{w(i)}),s.addEventListener("click",()=>{$(i),b()})}m!==void 0&&document.body.removeEventListener("mousedown",m),m=i=>{const s=i.target;s.closest("[data-address-container]")||s.closest("[data-address-result]")||b()},document.body.addEventListener("mousedown",m),v!==void 0&&document.removeEventListener("keydown",v),v=i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),e.blur(),$(a),e.focus(),b()),i.key==="ArrowDown"&&(i.preventDefault(),w(a>=o.length-1?0:a+1)),i.key==="ArrowUp"&&(i.preventDefault(),w(a<=0?o.length-1:a-1)),i.key==="Escape"&&(i.preventDefault(),b())},document.addEventListener("keydown",v)},O=()=>{document.body.appendChild(t),p(),u=!0},d=i=>{if(r.innerHTML="",w(0),i.length===0){E([]);return}const s=[],f=document.createDocumentFragment();for(let I=0;I<i.length;I++){const T=n.cloneNode(!0),j=A(T.querySelector("p"),"List item paragraph element was not found!");j.textContent=i[I],j.dataset.index=I.toString(),I===0&&T.classList.add("focused"),f.appendChild(T),s.push(T)}r.appendChild(f),E(s),k()};nt.then(({fetchAddresses:i})=>{let s;e.addEventListener("input",f=>{const I=f.target.value,T=Date.now();if(s=T,I===""){d([]),b();return}i(I,j=>{if(!(s!==void 0&&s!==T)){if(d(j),j.length===0){b();return}O()}})})}),g(),S(),y(),d([])};ot();

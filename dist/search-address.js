import{a as T}from"./chunks/util.js";function K(e,t,r,n){function s(i){return i instanceof r?i:new r(function(l){l(i)})}return new(r||(r=Promise))(function(i,l){function a(h){try{d(n.next(h))}catch(u){l(u)}}function c(h){try{d(n.throw(h))}catch(u){l(u)}}function d(h){h.done?i(h.value):s(h.value).then(a,c)}d((n=n.apply(e,[])).next())})}typeof SuppressedError=="function"&&SuppressedError;function W(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var B=function e(t,r){if(t===r)return!0;if(t&&r&&typeof t=="object"&&typeof r=="object"){if(t.constructor!==r.constructor)return!1;var n,s,i;if(Array.isArray(t)){if(n=t.length,n!=r.length)return!1;for(s=n;s--!==0;)if(!e(t[s],r[s]))return!1;return!0}if(t.constructor===RegExp)return t.source===r.source&&t.flags===r.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===r.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===r.toString();if(i=Object.keys(t),n=i.length,n!==Object.keys(r).length)return!1;for(s=n;s--!==0;)if(!Object.prototype.hasOwnProperty.call(r,i[s]))return!1;for(s=n;s--!==0;){var l=i[s];if(!e(t[l],r[l]))return!1}return!0}return t!==t&&r!==r},Z=W(B);const R="__googleMapsScriptId";var O;(function(e){e[e.INITIALIZED=0]="INITIALIZED",e[e.LOADING=1]="LOADING",e[e.SUCCESS=2]="SUCCESS",e[e.FAILURE=3]="FAILURE"})(O||(O={}));class j{constructor({apiKey:t,authReferrerPolicy:r,channel:n,client:s,id:i=R,language:l,libraries:a=[],mapIds:c,nonce:d,region:h,retries:u=3,url:S="https://maps.googleapis.com/maps/api/js",version:y}){if(this.callbacks=[],this.done=!1,this.loading=!1,this.errors=[],this.apiKey=t,this.authReferrerPolicy=r,this.channel=n,this.client=s,this.id=i||R,this.language=l,this.libraries=a,this.mapIds=c,this.nonce=d,this.region=h,this.retries=u,this.url=S,this.version=y,j.instance){if(!Z(this.options,j.instance.options))throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(j.instance.options)}`);return j.instance}j.instance=this}get options(){return{version:this.version,apiKey:this.apiKey,channel:this.channel,client:this.client,id:this.id,libraries:this.libraries,language:this.language,region:this.region,mapIds:this.mapIds,nonce:this.nonce,url:this.url,authReferrerPolicy:this.authReferrerPolicy}}get status(){return this.errors.length?O.FAILURE:this.done?O.SUCCESS:this.loading?O.LOADING:O.INITIALIZED}get failed(){return this.done&&!this.loading&&this.errors.length>=this.retries+1}createUrl(){let t=this.url;return t+="?callback=__googleMapsCallback&loading=async",this.apiKey&&(t+=`&key=${this.apiKey}`),this.channel&&(t+=`&channel=${this.channel}`),this.client&&(t+=`&client=${this.client}`),this.libraries.length>0&&(t+=`&libraries=${this.libraries.join(",")}`),this.language&&(t+=`&language=${this.language}`),this.region&&(t+=`&region=${this.region}`),this.version&&(t+=`&v=${this.version}`),this.mapIds&&(t+=`&map_ids=${this.mapIds.join(",")}`),this.authReferrerPolicy&&(t+=`&auth_referrer_policy=${this.authReferrerPolicy}`),t}deleteScript(){const t=document.getElementById(this.id);t&&t.remove()}load(){return this.loadPromise()}loadPromise(){return new Promise((t,r)=>{this.loadCallback(n=>{n?r(n.error):t(window.google)})})}importLibrary(t){return this.execute(),google.maps.importLibrary(t)}loadCallback(t){this.callbacks.push(t),this.execute()}setScript(){var t,r;if(document.getElementById(this.id)){this.callback();return}const n={key:this.apiKey,channel:this.channel,client:this.client,libraries:this.libraries.length&&this.libraries,v:this.version,mapIds:this.mapIds,language:this.language,region:this.region,authReferrerPolicy:this.authReferrerPolicy};Object.keys(n).forEach(i=>!n[i]&&delete n[i]),!((r=(t=window?.google)===null||t===void 0?void 0:t.maps)===null||r===void 0)&&r.importLibrary||(i=>{let l,a,c,d="The Google Maps JavaScript API",h="google",u="importLibrary",S="__ib__",y=document,b=window;b=b[h]||(b[h]={});const o=b.maps||(b.maps={}),p=new Set,g=new URLSearchParams,v=()=>l||(l=new Promise((m,w)=>K(this,void 0,void 0,function*(){var I;yield a=y.createElement("script"),a.id=this.id,g.set("libraries",[...p]+"");for(c in i)g.set(c.replace(/[A-Z]/g,f=>"_"+f[0].toLowerCase()),i[c]);g.set("callback",h+".maps."+S),a.src=this.url+"?"+g,o[S]=m,a.onerror=()=>l=w(Error(d+" could not load.")),a.nonce=this.nonce||((I=y.querySelector("script[nonce]"))===null||I===void 0?void 0:I.nonce)||"",y.head.append(a)})));o[u]?console.warn(d+" only loads once. Ignoring:",i):o[u]=(m,...w)=>p.add(m)&&v().then(()=>o[u](m,...w))})(n);const s=this.libraries.map(i=>this.importLibrary(i));s.length||s.push(this.importLibrary("core")),Promise.all(s).then(()=>this.callback(),i=>{const l=new ErrorEvent("error",{error:i});this.loadErrorCallback(l)})}reset(){this.deleteScript(),this.done=!1,this.loading=!1,this.errors=[],this.onerrorEvent=null}resetIfRetryingFailed(){this.failed&&this.reset()}loadErrorCallback(t){if(this.errors.push(t),this.errors.length<=this.retries){const r=this.errors.length*Math.pow(2,this.errors.length);console.error(`Failed to load Google Maps script, retrying in ${r} ms.`),setTimeout(()=>{this.deleteScript(),this.setScript()},r)}else this.onerrorEvent=t,this.callback()}callback(){this.done=!0,this.loading=!1,this.callbacks.forEach(t=>{t(this.onerrorEvent)}),this.callbacks=[]}execute(){if(this.resetIfRetryingFailed(),!this.loading)if(this.done)this.callback();else{if(window.google&&window.google.maps&&window.google.maps.version){console.warn("Google Maps already loaded outside @googlemaps/js-api-loader. This may result in undesirable behavior as options and script parameters may not match."),this.callback();return}this.loading=!0,this.setScript()}}}var $=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function J(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function H(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}var P=H,V=typeof $=="object"&&$&&$.Object===Object&&$,X=V,z=X,Q=typeof self=="object"&&self&&self.Object===Object&&self,Y=z||Q||Function("return this")(),C=Y,ee=C,te=function(){return ee.Date.now()},re=te,ne=/\s/;function ie(e){for(var t=e.length;t--&&ne.test(e.charAt(t)););return t}var se=ie,oe=se,ae=/^\s+/;function le(e){return e&&e.slice(0,oe(e)+1).replace(ae,"")}var ce=le,de=C,ue=de.Symbol,D=ue,x=D,N=Object.prototype,fe=N.hasOwnProperty,he=N.toString,L=x?x.toStringTag:void 0;function pe(e){var t=fe.call(e,L),r=e[L];try{e[L]=void 0;var n=!0}catch{}var s=he.call(e);return n&&(t?e[L]=r:delete e[L]),s}var ge=pe,me=Object.prototype,ve=me.toString;function ye(e){return ve.call(e)}var be=ye,M=D,we=ge,Se=be,Ee="[object Null]",Ie="[object Undefined]",F=M?M.toStringTag:void 0;function Te(e){return e==null?e===void 0?Ie:Ee:F&&F in Object(e)?we(e):Se(e)}var je=Te;function Oe(e){return e!=null&&typeof e=="object"}var ke=Oe,Le=je,$e=ke,_e="[object Symbol]";function Ae(e){return typeof e=="symbol"||$e(e)&&Le(e)==_e}var Re=Ae,Pe=ce,G=P,Ce=Re,U=NaN,De=/^[-+]0x[0-9a-f]+$/i,xe=/^0b[01]+$/i,Ne=/^0o[0-7]+$/i,Me=parseInt;function Fe(e){if(typeof e=="number")return e;if(Ce(e))return U;if(G(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=G(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=Pe(e);var r=xe.test(e);return r||Ne.test(e)?Me(e.slice(2),r?2:8):De.test(e)?U:+e}var Ge=Fe,Ue=P,_=re,q=Ge,qe="Expected a function",Ke=Math.max,We=Math.min;function Be(e,t,r){var n,s,i,l,a,c,d=0,h=!1,u=!1,S=!0;if(typeof e!="function")throw new TypeError(qe);t=q(t)||0,Ue(r)&&(h=!!r.leading,u="maxWait"in r,i=u?Ke(q(r.maxWait)||0,t):i,S="trailing"in r?!!r.trailing:S);function y(f){var E=n,k=s;return n=s=void 0,d=f,l=e.apply(k,E),l}function b(f){return d=f,a=setTimeout(g,t),h?y(f):l}function o(f){var E=f-c,k=f-d,A=t-E;return u?We(A,i-k):A}function p(f){var E=f-c,k=f-d;return c===void 0||E>=t||E<0||u&&k>=i}function g(){var f=_();if(p(f))return v(f);a=setTimeout(g,o(f))}function v(f){return a=void 0,S&&n?y(f):(n=s=void 0,l)}function m(){a!==void 0&&clearTimeout(a),d=0,n=c=s=a=void 0}function w(){return a===void 0?l:v(_())}function I(){var f=_(),E=p(f);if(n=arguments,s=this,c=f,E){if(a===void 0)return b(c);if(u)return clearTimeout(a),a=setTimeout(g,t),y(c)}return a===void 0&&(a=setTimeout(g,t)),l}return I.cancel=m,I.flush=w,I}var Ze=Be,Je=J(Ze);const He=T(document.body.dataset.placesKey,"places api key was not found!"),Ve=new j({apiKey:He,version:"weekly"}),Xe=async()=>{const e=new(await Ve.importLibrary("places")).AutocompleteService,t=new Map;return{fetchAddresses:Je((r,n)=>{const s=t.get(r);if(s!==void 0){n(s);return}const i=(l,a)=>{let c=[];a!==google.maps.places.PlacesServiceStatus.OK&&a!=="ZERO_RESULTS"&&console.error(`Something went wrong with places api. Status ${a}`),l!==null&&(c=l.map(d=>d.description)),t.set(r,c),n(c)};e.getPlacePredictions({input:r,componentRestrictions:{country:"ae"}},i)},100)}},ze=Xe(),Qe=()=>{const e=T(document.querySelector("[data-address-input]"),"Address input element([data-address-input]) was not found!"),t=T(e.closest("[data-address-container]")?.querySelector("[data-address-result]"),"Address result container([data-address-result]) was not found!"),r=T(t?.querySelector("[data-address-list]"),"Address result list([data-address-list]) was not found!"),n=T(r?.querySelector("[data-address-item]"),"Address result item([data-address-item]) was not found!");let s=[],i=0;const l=o=>{s=o},a=o=>{const p=s[i],g=s[o];p?.classList.remove("focused"),g?.classList.add("focused"),i=o};let c,d;const h=o=>{const p=s[o],g=T(p?.querySelector("p"),"List item paragraph element was not found!").textContent?.trim();if(!g)throw new Error("Result item is invalid");e.value=g,e.focus()},u=()=>{t.classList.add("is--hidden"),d!==void 0&&document.body.removeEventListener("mousedown",d),c!==void 0&&document.removeEventListener("keydown",c)},S=()=>{for(let o=0;o<s.length;o++){const p=s[o];p.addEventListener("mouseenter",()=>{a(o)}),p.addEventListener("click",()=>{h(o),u()})}d!==void 0&&document.body.removeEventListener("mousedown",d),d=o=>{o.target.closest("[data-address-container]")||u()},document.body.addEventListener("mousedown",d),c!==void 0&&document.removeEventListener("keydown",c),c=o=>{o.key==="Enter"&&(o.preventDefault(),e.blur(),h(i),e.focus(),u()),o.key==="ArrowDown"&&(o.preventDefault(),a(i>=s.length-1?0:i+1)),o.key==="ArrowUp"&&(o.preventDefault(),a(i<=0?s.length-1:i-1))},document.addEventListener("keydown",c)},y=()=>{t.classList.remove("is--hidden")},b=o=>{if(r.innerHTML="",a(0),o.length===0){l([]);return}const p=[],g=document.createDocumentFragment();for(let v=0;v<o.length;v++){const m=n.cloneNode(!0),w=T(m.querySelector("p"),"List item paragraph element was not found!");w.textContent=o[v],w.dataset.index=v.toString(),v===0&&m.classList.add("focused"),g.appendChild(m),p.push(m)}r.appendChild(g),l(p),S()};ze.then(({fetchAddresses:o})=>{let p;e.addEventListener("input",g=>{const v=g.target.value,m=Date.now();if(p=m,v===""){b([]),u();return}o(v,w=>{if(!(p!==void 0&&p!==m)){if(b(w),w.length===0){u();return}y()}})})}),b([])};Qe();

function l(e,r){if(e==null)throw new Error(r??"Value was not provided!");return e}const a=e=>{if(e.startsWith("#")&&(e=e.slice(1)),e.length!==3&&e.length!==6)return null;e.length===3&&(e=e.split("").map(s=>s+s).join(""));const r=parseInt(e,16),t=r>>16&255,n=r>>8&255,o=r&255;return{r:t,g:n,b:o}},u=(e,r)=>l((r||document).querySelector(e),`Element: ${e} was not found!`),c=(e,r)=>{const t=(r||document).querySelectorAll(e);if(t.length===0)throw new Error(`Element: ${e} was not found!`);return Array.from(t)},g=(e,r)=>{const t={};for(const n of Object.keys(r))t[n]=e.style.getPropertyValue(n),e.style.setProperty(n,r[n]||null);return{revert:()=>{Object.assign(e.style,t)}}};export{c as a,l as b,u as g,a as h,g as s};

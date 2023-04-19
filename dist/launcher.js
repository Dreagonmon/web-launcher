var m="__launcher_image_data_url_cache__",h=class{constructor(){this.name="",this.package="",this.activity=""}},c=class extends Error{constructor(e){super("LauncherResponseError: "+e)}},w=n=>new Request(n,{method:"GET"}),E=n=>new Response(n,{status:200}),_=async n=>{if(n.startsWith("http"))try{let e=await self.caches.open(m),r=w(n),t=await e.match(r,{ignoreMethod:!0,ignoreSearch:!0,ignoreVary:!0});if(t)return await t.text()}catch(e){console.error(e)}},k=async(n,e)=>{if(n.startsWith("http"))try{let r=await self.caches.open(m),t=w(n),o=E(e);await r.delete(t,{ignoreMethod:!0,ignoreSearch:!0,ignoreVary:!0}),await r.put(t,o)}catch(r){console.error(r)}},A=n=>new Promise((e,r)=>{let t=new Image,o=()=>{let s=document.createElement("canvas");s.width=t.width,s.height=t.height,s.getContext("2d").drawImage(t,0,0),e(s.toDataURL())},i=s=>{r(s)};t.addEventListener("load",o),t.addEventListener("error",i),t.src=n+`&t=${new Date().getTime()}`}),S=async(n,e=!1)=>{let r=await _(n);if(typeof r!="string")e=!0;else return r;if(e){let t=await A(n);return await k(n,t),t}};var y="__store_permissions__",p=class{constructor(e=Math.PI*Math.PI){this.seed=e}nextInt(e,r){let t=Number.parseFloat("0."+Math.sin(this.seed++).toString().substr(6));return e=Math.ceil(e),r=Math.floor(r),Math.floor(t*(r-e))+e}},b=128,I=["otren","nlttvwrarc","fhoiaii","eehednt","xeomlea","ennsheey","msapeg","etauwilash","ytfi","hosodad","cemehn","inra","oeeow","dubeto","mauetehs","deetrtre","lelsiid","nkghs","admiat","iadh","hoyu","mhyiiltaafm","hrwjaw"],$=["#f44336","#e91e63","#e91e63","#7e57c2","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722"],v=function(n){let e=n.nextInt(0,I.length);return I[e]},l=function(n){let e=n.nextInt(0,$.length);return $[e]},L=function(n){return n.replace(/^./u,n.charAt(0).toUpperCase())},P=function(n=Math.PI*Math.PI,e=50){let r=[],t={},o=new p(n);for(let i=0;i<e;i++){let s=o.nextInt(1,4),a=new h;for(let g=0;g<s;g++){let f=v(o);a.name+=L(f)+" ",a.package+=f+"."}a.activity=a.package+"MainActivity",a.name=a.name.substring(0,a.name.length-1),a.package=a.package.substring(0,a.package.length-1);let x=[l(o),l(o),l(o)];t[a.package]=x,r.push(a)}return[r,t]},[R,M]=P(),d=class{#e={};constructor(){this.#e={},this.#t()}#r(){return!!this.#e.launcher}#t(){let e=sessionStorage.getItem(y);if(e)try{this.#e=JSON.parse(e)}catch(r){console.error(r)}}#n(){sessionStorage.setItem(y,JSON.stringify(this.#e))}async getApplicationList(){if(!this.#r())throw console.error("launchApplication: You need request permission first!"),new c("No Permission");return R}getApplicationIconSrc(e,r,t=b){let o;if(e!=null)o=M[e];else{let s=new p(Math.random()*Number.MAX_SAFE_INTEGER);o=[l(s),l(s),l(s)]}let i=`<svg width="${t}" height="${t}" xmlns="http://www.w3.org/2000/svg">
        <g>
        <rect x="-1" y="-1" width="${t+2}" height="${t+2}" id="canvas_background" fill="none"/>
        </g>
        <g>
        <ellipse ry="${t/2.2}" rx="${t/2.2}" id="svg_3" cy="${t/2}" cx="${t/2}" stroke-width="0" stroke="#000" fill="${o[0]}"/>
        <ellipse ry="${t/3}" rx="${t/3}" id="svg_3" cy="${t/2}" cx="${t/2}" stroke-width="0.5" stroke="#000" fill="${o[1]}"/>
        <ellipse ry="${t/5}" rx="${t/5}" id="svg_3" cy="${t/2}" cx="${t/2}" stroke-width="0" stroke="#000" fill="${o[2]}"/>
        </g>
        </svg>`;return"data:image/svg+xml;base64,"+btoa(i)}async launchApplication(e,r){if(!this.#r())throw console.error("launchApplication: You need request permission first!"),new c("No Permission");let t=document.createElement("div");t.style.width="100%",t.style.height="100%",t.style.background="black",t.style.position="fixed",t.style.top=0,t.style.right=0,t.style.bottom=0,t.style.left=0,t.style.textAlign="center",t.style.padding="1em",t.style.boxSizing="border-box",t.onclick=function(a){a.preventDefault(),a.stopPropagation(),document.body.removeChild(t)};let o=document.createElement("h1");o.innerText="Application",o.style.color="white",o.style.wordBreak="break-all",t.appendChild(o);let i=document.createElement("h3");i.innerText=e,i.style.color="white",i.style.wordBreak="break-all",t.appendChild(i);let s=document.createElement("h3");return s.innerText=r,s.style.color="white",s.style.wordBreak="break-all",t.appendChild(s),document.body.appendChild(t),!0}async requestPermission(e){let r={launcher:"Launcher"};if(!["launcher"].includes(e))throw console.error("requestPermission: Permission name not support!"),new c("Permission name not support");if(this.#e[e])return!0;if(confirm(`Do you want to grant ${r[e]} permission to ${window.location.origin} ?`))return this.#e[e]=!0,this.#n(),!0;throw new c("Permission denided")}};var C="launcher",u=class{#e=!1;#r="";#t=void 0;constructor(){this.PERMISSION_LAUNCHER="launcher";let e=10801;try{let o=/WebLauncher\/\d*? \(port (\d*?)\)/g.exec(navigator.userAgent)[1];e=Number.parseInt(o),(o==null||e<=0||e>65535)&&(e=10801,this.#e=!0)}catch{console.log("error, default port!",e),this.#e=!0}console.log("using port:",e);let r=window.location.protocol;r!=="http:"&&(r="https:"),this.#r=`${r}//127.0.0.1:${e}/api/`,this.#t=void 0}isRunningInLauncher(){return!this.#e}async getApplicationList(){if(this.#t)return await this.#t.getApplicationList();let e=`${this.#r}app-list-all?t=${new Date().getTime()}`,r=await fetch(e);if(r.status!==200)throw new c("status code not 200!");return JSON.parse(await r.text()).map(i=>{let s=new h;return s.name=i.name,s.package=i.package,s.activity=i.activity,s})}getApplicationIconSrc(e,r,t=128){return this.#t?this.#t.getApplicationIconSrc(e,r,t):`${this.#r}icon?package=${e}&activity=${r}&size=${t}`}async launchApplication(e,r){if(this.#t)return await this.#t.launchApplication(e,r);let t=`${this.#r}launch?package=${e}&activity=${r}&t=${new Date().getTime()}`;if((await fetch(t)).status!==200)throw new c("status code not 200!");return!0}async requestPermission(e){if(this.#t)return await this.#t.requestPermission(e);let r=`${this.#r}request-permission?name=${e}&t=${new Date().getTime()}`;if((await fetch(r)).status!==200)throw new c("status code not 200!");return!0}startDebugSession(){this.#t=new d}};var W=new u;export{h as ApplicationInfo,u as Launcher,c as LauncherResponseError,C as PERMISSION_LAUNCHER,S as convertToCachedImageURL,W as launcher};
//# sourceMappingURL=launcher.js.map
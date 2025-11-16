(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[183],{9646:function(e){e.exports={style:{fontFamily:"'__Inter_f367f3', '__Inter_Fallback_f367f3'",fontStyle:"normal"},className:"__className_f367f3"}},2334:function(e,t,n){"use strict";var i=n(206),a=n(5538),r=n(8745),o=n(8542);let s="@firebase/installations",c="0.6.9",u=`w:${c}`,l="FIS_v2",d=new r.LL("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function p(e){return e instanceof r.ZR&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function g(e){return{token:e.token,requestStatus:2,expiresIn:Number(e.expiresIn.replace("s","000")),creationTime:Date.now()}}async function w(e,t){let n=(await t.json()).error;return d.create("request-failed",{requestName:e,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function h({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}async function m(e){let t=await e();return t.status>=500&&t.status<600?e():t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function y({appConfig:e,heartbeatServiceProvider:t},{fid:n}){let i=f(e),a=h(e),r=t.getImmediate({optional:!0});if(r){let e=await r.getHeartbeatsHeader();e&&a.append("x-firebase-client",e)}let o={method:"POST",headers:a,body:JSON.stringify({fid:n,authVersion:l,appId:e.appId,sdkVersion:u})},s=await m(()=>fetch(i,o));if(s.ok){let e=await s.json();return{fid:e.fid||n,registrationStatus:2,refreshToken:e.refreshToken,authToken:g(e.authToken)}}throw await w("Create Installation",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function b(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let v=/^[cdef][\w-]{21}$/;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function k(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let I=new Map;function S(e,t){let n=k(e);T(n,t),function(e,t){let n=(!C&&"BroadcastChannel"in self&&((C=new BroadcastChannel("[Firebase] FID Change")).onmessage=e=>{T(e.data.key,e.data.fid)}),C);n&&n.postMessage({key:e,fid:t}),0===I.size&&C&&(C.close(),C=null)}(n,t)}function T(e,t){let n=I.get(e);if(n)for(let e of n)e(t)}let C=null,_="firebase-installations-store",j=null;function A(){return j||(j=(0,o.X3)("firebase-installations-database",1,{upgrade:(e,t)=>{0===t&&e.createObjectStore(_)}})),j}async function O(e,t){let n=k(e),i=(await A()).transaction(_,"readwrite"),a=i.objectStore(_),r=await a.get(n);return await a.put(t,n),await i.done,r&&r.fid===t.fid||S(e,t.fid),t}async function K(e){let t=k(e),n=(await A()).transaction(_,"readwrite");await n.objectStore(_).delete(t),await n.done}async function D(e,t){let n=k(e),i=(await A()).transaction(_,"readwrite"),a=i.objectStore(_),r=await a.get(n),o=t(r);return void 0===o?await a.delete(n):await a.put(o,n),await i.done,o&&(!r||r.fid!==o.fid)&&S(e,o.fid),o}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function P(e){let t;let n=await D(e.appConfig,n=>{let i=function(e,t){if(0===t.registrationStatus){if(!navigator.onLine)return{installationEntry:t,registrationPromise:Promise.reject(d.create("app-offline"))};let n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},i=N(e,n);return{installationEntry:n,registrationPromise:i}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:M(e)}:{installationEntry:t}}(e,q(n||{fid:function(){try{let e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;let t=btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_").substr(0,22);return v.test(t)?t:""}catch(e){return""}}(),registrationStatus:0}));return t=i.registrationPromise,i.installationEntry});return""===n.fid?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}async function N(e,t){try{let n=await y(e,t);return O(e.appConfig,n)}catch(n){throw p(n)&&409===n.customData.serverCode?await K(e.appConfig):await O(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function M(e){let t=await E(e.appConfig);for(;1===t.registrationStatus;)await b(100),t=await E(e.appConfig);if(0===t.registrationStatus){let{installationEntry:t,registrationPromise:n}=await P(e);return n||t}return t}function E(e){return D(e,e=>{if(!e)throw d.create("installation-not-found");return q(e)})}function q(e){return 1===e.registrationStatus&&e.registrationTime+1e4<Date.now()?{fid:e.fid,registrationStatus:0}:e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $({appConfig:e,heartbeatServiceProvider:t},n){let i=function(e,{fid:t}){return`${f(e)}/${t}/authTokens:generate`}(e,n),a=function(e,{refreshToken:t}){let n=h(e);return n.append("Authorization",`${l} ${t}`),n}(e,n),r=t.getImmediate({optional:!0});if(r){let e=await r.getHeartbeatsHeader();e&&a.append("x-firebase-client",e)}let o={method:"POST",headers:a,body:JSON.stringify({installation:{sdkVersion:u,appId:e.appId}})},s=await m(()=>fetch(i,o));if(s.ok)return g(await s.json());throw await w("Generate Auth Token",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function x(e,t=!1){let n;let i=await D(e.appConfig,i=>{var a;if(!R(i))throw d.create("not-registered");let r=i.authToken;if(!t&&2===(a=r).requestStatus&&!function(e){let t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+36e5}(a))return i;if(1===r.requestStatus)return n=F(e,t),i;{if(!navigator.onLine)throw d.create("app-offline");let t=function(e){let t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}(i);return n=H(e,t),t}});return n?await n:i.authToken}async function F(e,t){let n=await L(e.appConfig);for(;1===n.authToken.requestStatus;)await b(100),n=await L(e.appConfig);let i=n.authToken;return 0===i.requestStatus?x(e,t):i}function L(e){return D(e,e=>{var t;if(!R(e))throw d.create("not-registered");return 1===(t=e.authToken).requestStatus&&t.requestTime+1e4<Date.now()?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function H(e,t){try{let n=await $(e,t),i=Object.assign(Object.assign({},t),{authToken:n});return await O(e.appConfig,i),n}catch(n){if(p(n)&&(401===n.customData.serverCode||404===n.customData.serverCode))await K(e.appConfig);else{let n=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await O(e.appConfig,n)}throw n}}function R(e){return void 0!==e&&2===e.registrationStatus}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function V(e){let{installationEntry:t,registrationPromise:n}=await P(e);return n?n.catch(console.error):x(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function W(e,t=!1){return await B(e),(await x(e,t)).token}async function B(e){let{registrationPromise:t}=await P(e);t&&await t}function X(e){return d.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let U="installations";(0,i.Xd)(new a.wA(U,e=>{let t=e.getProvider("app").getImmediate(),n=/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){if(!e||!e.options)throw X("App Configuration");if(!e.name)throw X("App Name");for(let t of["projectId","apiKey","appId"])if(!e.options[t])throw X(t);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t),a=(0,i.qX)(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:a,_delete:()=>Promise.resolve()}},"PUBLIC")),(0,i.Xd)(new a.wA("installations-internal",e=>{let t=e.getProvider("app").getImmediate(),n=(0,i.qX)(t,U).getImmediate();return{getId:()=>V(n),getToken:e=>W(n,e)}},"PRIVATE")),(0,i.KN)(s,c),(0,i.KN)(s,c,"esm2017")},8245:function(e,t,n){"use strict";n.d(t,{KL:function(){return B},LP:function(){return X},ps:function(){return U}}),n(2334);var i,a,r,o,s=n(5538),c=n(8542),u=n(8745),l=n(206);let d="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",p="google.c.a.c_id";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f(e){return btoa(String.fromCharCode(...new Uint8Array(e))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}(i=r||(r={}))[i.DATA_MESSAGE=1]="DATA_MESSAGE",i[i.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION",(a=o||(o={})).PUSH_RECEIVED="push-received",a.NOTIFICATION_CLICKED="notification-clicked";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let g="fcm_token_details_db",w="fcm_token_object_Store";async function h(e){if("databases"in indexedDB&&!(await indexedDB.databases()).map(e=>e.name).includes(g))return null;let t=null;return(await (0,c.X3)(g,5,{upgrade:async(n,i,a,r)=>{var o;if(i<2||!n.objectStoreNames.contains(w))return;let s=r.objectStore(w),c=await s.index("fcmSenderId").get(e);if(await s.clear(),c){if(2===i){if(!c.auth||!c.p256dh||!c.endpoint)return;t={token:c.fcmToken,createTime:null!==(o=c.createTime)&&void 0!==o?o:Date.now(),subscriptionOptions:{auth:c.auth,p256dh:c.p256dh,endpoint:c.endpoint,swScope:c.swScope,vapidKey:"string"==typeof c.vapidKey?c.vapidKey:f(c.vapidKey)}}}else 3===i?t={token:c.fcmToken,createTime:c.createTime,subscriptionOptions:{auth:f(c.auth),p256dh:f(c.p256dh),endpoint:c.endpoint,swScope:c.swScope,vapidKey:f(c.vapidKey)}}:4===i&&(t={token:c.fcmToken,createTime:c.createTime,subscriptionOptions:{auth:f(c.auth),p256dh:f(c.p256dh),endpoint:c.endpoint,swScope:c.swScope,vapidKey:f(c.vapidKey)}})}}})).close(),await (0,c.Lj)(g),await (0,c.Lj)("fcm_vapid_details_db"),await (0,c.Lj)("undefined"),!function(e){if(!e||!e.subscriptionOptions)return!1;let{subscriptionOptions:t}=e;return"number"==typeof e.createTime&&e.createTime>0&&"string"==typeof e.token&&e.token.length>0&&"string"==typeof t.auth&&t.auth.length>0&&"string"==typeof t.p256dh&&t.p256dh.length>0&&"string"==typeof t.endpoint&&t.endpoint.length>0&&"string"==typeof t.swScope&&t.swScope.length>0&&"string"==typeof t.vapidKey&&t.vapidKey.length>0}(t)?null:t}let m="firebase-messaging-store",y=null;function b(){return y||(y=(0,c.X3)("firebase-messaging-database",1,{upgrade:(e,t)=>{0===t&&e.createObjectStore(m)}})),y}async function v(e){let t=function({appConfig:e}){return e.appId}(e),n=await b(),i=await n.transaction(m).objectStore(m).get(t);if(i)return i;{let t=await h(e.appConfig.senderId);if(t)return await k(e,t),t}}async function k(e,t){let n=function({appConfig:e}){return e.appId}(e),i=(await b()).transaction(m,"readwrite");return await i.objectStore(m).put(t,n),await i.done,t}let I=new u.LL("messaging","Messaging",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function S(e,t){let n;let i={method:"POST",headers:await j(e),body:JSON.stringify(A(t))};try{let t=await fetch(_(e.appConfig),i);n=await t.json()}catch(e){throw I.create("token-subscribe-failed",{errorInfo:null==e?void 0:e.toString()})}if(n.error){let e=n.error.message;throw I.create("token-subscribe-failed",{errorInfo:e})}if(!n.token)throw I.create("token-subscribe-no-token");return n.token}async function T(e,t){let n;let i={method:"PATCH",headers:await j(e),body:JSON.stringify(A(t.subscriptionOptions))};try{let a=await fetch(`${_(e.appConfig)}/${t.token}`,i);n=await a.json()}catch(e){throw I.create("token-update-failed",{errorInfo:null==e?void 0:e.toString()})}if(n.error){let e=n.error.message;throw I.create("token-update-failed",{errorInfo:e})}if(!n.token)throw I.create("token-update-no-token");return n.token}async function C(e,t){let n=await j(e);try{let i=await fetch(`${_(e.appConfig)}/${t}`,{method:"DELETE",headers:n}),a=await i.json();if(a.error){let e=a.error.message;throw I.create("token-unsubscribe-failed",{errorInfo:e})}}catch(e){throw I.create("token-unsubscribe-failed",{errorInfo:null==e?void 0:e.toString()})}}function _({projectId:e}){return`https://fcmregistrations.googleapis.com/v1/projects/${e}/registrations`}async function j({appConfig:e,installations:t}){let n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function A({p256dh:e,auth:t,endpoint:n,vapidKey:i}){let a={web:{endpoint:n,auth:t,p256dh:e}};return i!==d&&(a.web.applicationPubKey=i),a}async function O(e){let t=await P(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:f(t.getKey("auth")),p256dh:f(t.getKey("p256dh"))},i=await v(e.firebaseDependencies);if(!i)return D(e.firebaseDependencies,n);if(function(e,t){let n=t.vapidKey===e.vapidKey,i=t.endpoint===e.endpoint,a=t.auth===e.auth,r=t.p256dh===e.p256dh;return n&&i&&a&&r}(i.subscriptionOptions,n))return Date.now()>=i.createTime+6048e5?K(e,{token:i.token,createTime:Date.now(),subscriptionOptions:n}):i.token;try{await C(e.firebaseDependencies,i.token)}catch(e){console.warn(e)}return D(e.firebaseDependencies,n)}async function K(e,t){try{let n=await T(e.firebaseDependencies,t),i=Object.assign(Object.assign({},t),{token:n,createTime:Date.now()});return await k(e.firebaseDependencies,i),n}catch(e){throw e}}async function D(e,t){let n={token:await S(e,t),createTime:Date.now(),subscriptionOptions:t};return await k(e,n),n.token}async function P(e,t){return await e.pushManager.getSubscription()||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:function(e){let t="=".repeat((4-e.length%4)%4),n=atob((e+t).replace(/\-/g,"+").replace(/_/g,"/")),i=new Uint8Array(n.length);for(let e=0;e<n.length;++e)i[e]=n.charCodeAt(e);return i}(t)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N(e){let t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return function(e,t){if(!t.notification)return;e.notification={};let n=t.notification.title;n&&(e.notification.title=n);let i=t.notification.body;i&&(e.notification.body=i);let a=t.notification.image;a&&(e.notification.image=a);let r=t.notification.icon;r&&(e.notification.icon=r)}(t,e),e.data&&(t.data=e.data),function(e,t){var n,i,a,r,o;if(!t.fcmOptions&&!(null===(n=t.notification)||void 0===n?void 0:n.click_action))return;e.fcmOptions={};let s=null!==(a=null===(i=t.fcmOptions)||void 0===i?void 0:i.link)&&void 0!==a?a:null===(r=t.notification)||void 0===r?void 0:r.click_action;s&&(e.fcmOptions.link=s);let c=null===(o=t.fcmOptions)||void 0===o?void 0:o.analytics_label;c&&(e.fcmOptions.analyticsLabel=c)}(t,e),t}function M(e){return I.create("missing-app-config-values",{valueName:e})}!/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e,t){let n=[];for(let i=0;i<e.length;i++)n.push(e.charAt(i)),i<t.length&&n.push(t.charAt(i));n.join("")}("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E{constructor(e,t,n){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;let i=/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){if(!e||!e.options)throw M("App Configuration Object");if(!e.name)throw M("App Name");let{options:t}=e;for(let e of["projectId","apiKey","appId","messagingSenderId"])if(!t[e])throw M(e);return{appName:e.name,projectId:t.projectId,apiKey:t.apiKey,appId:t.appId,senderId:t.messagingSenderId}}(e);this.firebaseDependencies={app:e,appConfig:i,installations:t,analyticsProvider:n}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function q(e){try{e.swRegistration=await navigator.serviceWorker.register("/firebase-messaging-sw.js",{scope:"/firebase-cloud-messaging-push-scope"}),e.swRegistration.update().catch(()=>{})}catch(e){throw I.create("failed-service-worker-registration",{browserErrorMessage:null==e?void 0:e.message})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $(e,t){if(t||e.swRegistration||await q(e),t||!e.swRegistration){if(!(t instanceof ServiceWorkerRegistration))throw I.create("invalid-sw-registration");e.swRegistration=t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function x(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=d)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function F(e,t){if(!navigator)throw I.create("only-available-in-window");if("default"===Notification.permission&&await Notification.requestPermission(),"granted"!==Notification.permission)throw I.create("permission-blocked");return await x(e,null==t?void 0:t.vapidKey),await $(e,null==t?void 0:t.serviceWorkerRegistration),O(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function L(e,t,n){let i=function(e){switch(e){case o.NOTIFICATION_CLICKED:return"notification_open";case o.PUSH_RECEIVED:return"notification_foreground";default:throw Error()}}(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(i,{message_id:n[p],message_name:n["google.c.a.c_l"],message_time:n["google.c.a.ts"],message_device_time:Math.floor(Date.now()/1e3)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function H(e,t){let n=t.data;if(!n.isFirebaseMessaging)return;e.onMessageHandler&&n.messageType===o.PUSH_RECEIVED&&("function"==typeof e.onMessageHandler?e.onMessageHandler(N(n)):e.onMessageHandler.next(N(n)));let i=n.data;"object"==typeof i&&i&&p in i&&"1"===i["google.c.a.e"]&&await L(e,n.messageType,i)}let R="@firebase/messaging",V="0.12.12";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function W(){try{await (0,u.eu)()}catch(e){return!1}return"undefined"!=typeof window&&(0,u.hl)()&&(0,u.zI)()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(e=(0,l.Mq)()){return W().then(e=>{if(!e)throw I.create("unsupported-browser")},e=>{throw I.create("indexed-db-unsupported")}),(0,l.qX)((0,u.m9)(e),"messaging").getImmediate()}async function X(e,t){return F(e=(0,u.m9)(e),t)}function U(e,t){return(/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e,t){if(!navigator)throw I.create("only-available-in-window");return e.onMessageHandler=t,()=>{e.onMessageHandler=null}}(e=(0,u.m9)(e),t))}(0,l.Xd)(new s.wA("messaging",e=>{let t=new E(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",e=>H(t,e)),t},"PUBLIC")),(0,l.Xd)(new s.wA("messaging-internal",e=>{let t=e.getProvider("messaging").getImmediate();return{getToken:e=>F(t,e)}},"PRIVATE")),(0,l.KN)(R,V),(0,l.KN)(R,V,"esm2017")}}]);
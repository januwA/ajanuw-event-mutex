!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.AjanuwEventMutex=e():t.AjanuwEventMutex=e()}(this,(()=>(()=>{"use strict";var t={d:(e,o)=>{for(var s in o)t.o(o,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:o[s]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{AbstractMutex:()=>o,EventMutex:()=>i,Mutex:()=>s});class o{}class s{get isLock(){return this._isLock}constructor(t){this.t=t,this._isLock=!1}lock(){if(!this._isLock)return this._isLock=!0,{get:()=>this.t,set:t=>{this.t=t}}}unlock(){this._isLock=!1}}class i extends s{constructor(t,e=!0){super(t),this.isAutoRelease=e}listener(...t){const e=this.lock();if(!e)throw new Error("EventMutex listener get lock fail");try{const o=e.get().apply(this,t);return o instanceof Promise?o.finally((()=>{this.isAutoRelease&&this.unlock()})):(this.isAutoRelease&&this.unlock(),o)}catch(t){throw this.isAutoRelease&&this.unlock(),t}}}return e})()));
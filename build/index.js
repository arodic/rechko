const hardenListenerDefinition=e=>e instanceof Array?e:[e],assignListenerDefinition=(e,t)=>{var o=e.findIndex(e=>e[0]===t[0]);-1!==o?e[o][1]?e[o][1]=Object.assign(e[o][1],t[1]):t[1]&&(e[o][1]=t[1]):e.push(t)},LISTENER_OPTIONS=["capture","passive"],listenerFromDefinition=(e,t)=>{"string"!=typeof t[0]&&"function"!=typeof t[0]&&console.warn("Invalid listener type"),t[1]&&("object"!=typeof t[1]||Object.keys(t[1]).some(e=>!LISTENER_OPTIONS.includes(e)))&&console.warn("Invalid listener options type");const o=["string"==typeof t[0]?e[t[0]]:t[0]];return t[1]&&o.push(t[1]),o};class EventDispatcher{node;isEventTarget;protoListeners={};propListeners={};addedListeners={};constructor(e){this.node=e,this.isEventTarget=e instanceof EventTarget,this.setProtoListeners(e)}setProtoListeners(t){for(const s in t._protochain?.listeners){this.protoListeners[s]=[];for(let e=0;e<t._protochain.listeners[s].length;e++){var o=listenerFromDefinition(t,t._protochain.listeners[s][e]);this.protoListeners[s].push(o),this.isEventTarget&&EventTarget.prototype.addEventListener.call(this.node,s,o[0],o[1])}}}applyPropListeners(e){const t={};for(const a in e){var h,o;a.startsWith("on-")&&(h=a.slice(3,a.length),o=hardenListenerDefinition(e[a]),o=listenerFromDefinition(this.node,o),t[h]=[o])}const s=this.propListeners;for(const l in s){var i;t[l]||(this.isEventTarget&&(i=hardenListenerDefinition(s[l][0]),i=listenerFromDefinition(this.node,i),EventTarget.prototype.removeEventListener.call(this.node,l,i[0],i[1])),delete s[l])}for(const c in t){var r,n;this.isEventTarget&&(r=hardenListenerDefinition(t[c][0]),r=listenerFromDefinition(this.node,r),s[c]?(n=hardenListenerDefinition(s[c][0]),((n=listenerFromDefinition(this.node,n))!==r||r[1]&&JSON.stringify(n[1])!==JSON.stringify(r[1]))&&(EventTarget.prototype.removeEventListener.call(this.node,c,n[0],n[1]),EventTarget.prototype.addEventListener.call(this.node,c,r[0],r[1]))):EventTarget.prototype.addEventListener.call(this.node,c,r[0],r[1])),s[c]=t[c]}}addEventListener(e,t,o){this.addedListeners[e]=this.addedListeners[e]||[],-1!==this.addedListeners[e].findIndex(e=>e[0]===t)&&console.warn(`Listener ${e} already added!`),"function"!=typeof t&&console.warn("Invalid listener type!"),o&&("object"!=typeof o||Object.keys(o).some(e=>!LISTENER_OPTIONS.includes(e)))&&console.warn("Invalid listener options type"),this.addedListeners[e].push(o?[t,o]:[t]),this.isEventTarget&&EventTarget.prototype.addEventListener.call(this.node,e,t,o)}removeEventListener(t,o,e){if(this.addedListeners[t]||console.warn(`Listener ${t} not found!`),o&&"function"!=typeof o&&console.warn("Invalid listener type!"),e&&("object"!=typeof e||Object.keys(e).some(e=>!LISTENER_OPTIONS.includes(e)))&&console.warn("Invalid listener options type"),o){var s=this.addedListeners[t].findIndex(e=>e[0]=o);-1===s&&console.warn(`Listener ${t} not found!`),this.addedListeners[t].splice(s,1),this.isEventTarget&&EventTarget.prototype.removeEventListener.call(this.node,t,o,e)}else{for(let e=0;e<this.addedListeners[t].length;e++)if(this.isEventTarget){const o=this.addedListeners[t][e];EventTarget.prototype.removeEventListener.call(this.node,t,o[0],o[1])}this.addedListeners[t].length=0}0===this.addedListeners[t].length&&delete this.addedListeners[t]}dispatchEvent(t,e,o=!0,s=this.node){var i={detail:e,target:s,path:[s]};if(s instanceof EventTarget)EventTarget.prototype.dispatchEvent.call(s,new CustomEvent(t,{detail:e,bubbles:o,composed:!0,cancelable:!0}));else{if(this.protoListeners[t])for(let e=0;e<this.protoListeners[t].length;e++)this.protoListeners[t][e][0].call(s,i);if(this.propListeners[t]&&(1<this.propListeners[t].length&&console.warn(`PropListeners[${t}] array too long!`),this.propListeners[t][0][0].call(s,i)),this.addedListeners[t])for(let e=0;e<this.addedListeners[t].length;e++)this.addedListeners[t][e][0].call(s,i)}}dispose(){for(const s in this.protoListeners){if(this.isEventTarget)for(let e=0;e<this.protoListeners[s].length;e++){var t=this.protoListeners[s][e];EventTarget.prototype.removeEventListener.call(this.node,s,t[0],t[1])}this.protoListeners[s].length=0,delete this.protoListeners[s]}for(const i in this.propListeners){var e;this.isEventTarget&&(e=this.propListeners[i][0],EventTarget.prototype.removeEventListener.call(this.node,i,e[0],e[1])),this.propListeners[i].length=0,delete this.propListeners[i]}for(const r in this.addedListeners){if(this.isEventTarget)for(let e=this.addedListeners[r].length;e--;){var o=this.addedListeners[r][e];EventTarget.prototype.removeEventListener.call(this.node,r,o[0],o[1])}this.addedListeners[r].length=0,delete this.addedListeners[r]}delete this.node,delete this.protoListeners,delete this.propListeners,delete this.addedListeners}}class Binding{node;property="";targets=[];targetProperties=new WeakMap;constructor(e,t){this.node=e,this.property=t,this.onTargetChanged=this.onTargetChanged.bind(this),this.onSourceChanged=this.onSourceChanged.bind(this),this.node.addEventListener(this.property+"-changed",this.onSourceChanged)}set value(e){this.node[this.property]=e}get value(){return this.node[this.property]}addTarget(e,t){e._properties[t].binding&&e._properties[t].binding!==this&&console.warn("Binding target alredy has binding!"),e._properties[t].binding=this,e.setProperty(t,this.node[this.property]);const o=e,s=(-1===this.targets.indexOf(o)&&this.targets.push(o),this.getTargetProperties(o));-1===s.indexOf(t)&&(s.push(t),o.addEventListener(t+"-changed",this.onTargetChanged))}removeTarget(e,t){const o=e,s=this.getTargetProperties(o);if(t){e=s.indexOf(t);-1!==e&&s.splice(e,1),o.removeEventListener(t+"-changed",this.onTargetChanged)}else{for(let e=s.length;e--;)o.removeEventListener(s[e]+"-changed",this.onTargetChanged);s.length=0}0===s.length&&this.targets.splice(this.targets.indexOf(o),1)}getTargetProperties(e){let t=this.targetProperties.get(e);return t||(t=[],this.targetProperties.set(e,t),t)}onTargetChanged(e){var t;-1!==this.targets.indexOf(e.target)?(t=this.node[this.property])!==(e=e.detail.value)&&("number"==typeof e&&isNaN(e)&&"number"==typeof t&&isNaN(t)||(this.node[this.property]=e)):console.error(`onTargetChanged() should never fire when target is removed from binding.
          Please file an issue at https://github.com/arodic/iogui/issues.`)}onSourceChanged(e){if(e.target===this.node){var t=e.detail.value;for(let e=this.targets.length;e--;){const r=this.targets[e];var o=this.getTargetProperties(r);for(let e=o.length;e--;){var s=o[e],i=r[s];i!==t&&("number"==typeof t&&isNaN(t)&&"number"==typeof i&&isNaN(i)||(r[s]=t))}}}else console.error(`onSourceChanged() should always originate form source node.
          Please file an issue at https://github.com/arodic/iogui/issues.`)}dispose(){this.node.removeEventListener(this.property+"-changed",this.onSourceChanged);for(let e=this.targets.length;e--;)this.removeTarget(this.targets[e]);this.targets.length=0,delete this.node,delete this.property,delete this.targets,delete this.targetProperties,delete this.onTargetChanged,delete this.onSourceChanged}}class PropertyDefinition{value;type;binding;reflect=0;notify=!0;observe=!1;constructor(e){var t;null==e?this.value=e:"function"==typeof e?this.type=e:e instanceof Binding?(this.value=e.value,this.type=void 0!==e.value&&null!==e.value?e.value.constructor:void 0,this.binding=e):e&&e.constructor===Object?(this.value=void 0!==(t=e).value?t.value:void 0,this.type=void 0!==t.type?t.type:void 0!==t.value&&null!==t.value?t.value.constructor:void 0,this.binding=t.binding instanceof Binding?t.binding:void 0,this.reflect=void 0!==t.reflect?t.reflect:0,this.notify=void 0===t.notify||t.notify,this.observe=void 0!==t.observe&&t.observe,void 0!==this.binding&&(this.value=this.binding.value)):e&&e.constructor===Object||(this.value=e,this.type=e.constructor),void 0===this.value&&"function"==typeof this.type&&(this.type===Boolean?this.value=!1:this.type===String?this.value="":this.type===Number?this.value=0:this.type===Array?this.value=[]:this.type===Object?this.value={}:this.value=new this.type)}}const assignPropertyDefinition=(e,t)=>{void 0!==t.value&&(e.value=t.value),void 0!==t.type&&(e.type=t.type),0!==t.reflect&&(e.reflect=t.reflect),!0!==t.notify&&(e.notify=t.notify),!1!==t.observe&&(e.observe=t.observe),void 0!==t.binding&&(e.binding=t.binding)};class Property{value=void 0;type=void 0;binding=void 0;reflect=0;notify=!0;observe=!1;constructor(e){Object.keys(e).forEach(e=>{-1===["value","type","reflect","notify","observe","binding"].indexOf(e)&&console.warn("PropertyDefinition: Invalid field "+e)}),void 0!==e.type&&"function"!=typeof e.type&&console.warn('Incorrect type for "type" field'),void 0!==e.binding&&e.binding.constructor!==Binding&&console.warn('Incorrect type for "binding" field'),void 0!==e.reflect&&-1===[-1,0,1,2].indexOf(e.reflect)&&console.error(`Invalid reflect field ${e.reflect}!`),void 0!==e.notify&&"boolean"!=typeof e.notify&&console.warn('Incorrect type for "notify" field'),void 0!==e.observe&&"boolean"!=typeof e.observe&&console.warn('Incorrect type for "observe" field'),this.value=e.value,this.type=e.type,this.binding=e.binding,this.reflect=e.reflect,this.notify=e.notify,this.observe=e.observe,this.binding instanceof Binding?this.value=this.binding.value:this.type===Array&&this.value instanceof Array?this.value=[...this.value]:"function"==typeof this.type&&this.value instanceof Object&&(this.value=Object.assign(new this.type,this.value)),void 0===this.value&&"function"==typeof this.type&&console.warn("Property value should always be initialized when type is defined!")}}class ProtoChain{constructors=[];functions=[];properties={};listeners={};style="";observedObjects=[];constructor(e){let t=e.prototype;for(;t&&"IoNodeMixinConstructor"!==e.name&&e!==HTMLElement&&e!==Object&&e!==Array;){this.constructors.push(e);var o=Object.getOwnPropertyNames(t);for(let e=0;e<o.length;e++){const n=o[e];var s=Object.getOwnPropertyDescriptor(t,n);void 0===s||s.get||s.set||"function"==typeof t[n]&&-1===this.functions.indexOf(n)&&(n.startsWith("_")||n.startsWith("on"))&&this.functions.push(n)}e.Style&&-1===this.style.indexOf(e.Style)&&(this.style=e.Style+"\n"+this.style),e=(t=t.__proto__).constructor}for(let e=this.constructors.length;e--;){var i=this.constructors[e].Properties;for(const a in i){var h=new PropertyDefinition(i[a]);this.properties[a]?assignPropertyDefinition(this.properties[a],h):this.properties[a]=h}var r=this.constructors[e].Listeners;for(const l in r)r[l]&&(this.listeners[l]=this.listeners[l]||[],assignListenerDefinition(this.listeners[l],hardenListenerDefinition(r[l])))}for(const c in this.properties){var d,p,g;this.properties[c].observe&&(d=null===this.properties[c].value,p=void 0===this.properties[c].value,g=this.properties[c].value instanceof Object,-1===[String,Number,Boolean].indexOf(this.properties[c].type)&&(d||p||g)||console.warn("Property `observe` is only intended for object properties!"),this.observedObjects.push(c))}}bindFunctions(t){t.constructor!==this.constructors[0]&&console.warn("`bindFunctions` should be used on",this.constructors[0].name,"instance");for(let e=this.functions.length;e--;)Object.defineProperty(t,this.functions[e],{value:t[this.functions[e]].bind(t)})}}class ChangeQueue{node;changes=[];dispatching=!1;constructor(e){this.node=e,Object.defineProperty(this,"node",{enumerable:!1,writable:!1}),Object.defineProperty(this,"changes",{enumerable:!1,writable:!1}),Object.defineProperty(this,"dispatching",{enumerable:!1})}queue(t,e,o){e===o&&console.warn("ChangeQueue: queuing change with same value and oldValue!");var s=this.changes.findIndex(e=>e.property===t);-1===s?this.changes.push({property:t,value:e,oldValue:o}):this.changes[s].value=e}dispatch(){if(!0!==this.dispatching){let e=!(this.dispatching=!0);for(;this.changes.length;){var t=this.changes[0],o=(this.changes.splice(0,1),t.property);t.value!==t.oldValue&&(e=!0,this.node[o+"Changed"]&&this.node[o+"Changed"](t),this.node.dispatchEvent(o+"-changed",t))}e&&(this.node.applyCompose(),this.node.changed()),this.dispatching=!1}}dispose(){this.changes.length=0,delete this.node,delete this.changes}}function IoNodeMixin(e){e=class extends e{static get Properties(){return{lazy:Boolean}}get compose(){return null}_properties={};_bindings={};_changeQueue;_eventDispatcher;constructor(e={},...t){super(...t);t=this.__proto__.constructor;t._registeredAs!==t.name&&console.error(`${t.name} not registered! Call "RegisterIoNode()" before using ${t.name} class!`),this._protochain.bindFunctions(this),this._changeQueue=new ChangeQueue(this),Object.defineProperty(this,"_changeQueue",{enumerable:!1}),this._eventDispatcher=new EventDispatcher(this),Object.defineProperty(this,"_eventDispatcher",{enumerable:!1});for(const s in this._protochain.properties){const i=new Property(this._protochain.properties[s]);var o=(this._properties[s]=i).value;null!=o&&("object"==typeof o?this.queue(s,o,void 0):void 0!==i.reflect&&1<=i.reflect&&this._isIoElement&&this.setAttribute(s,o)),i.binding&&i.binding.addTarget(this,s)}Object.defineProperty(this,"_properties",{enumerable:!1}),Object.defineProperty(this,"_bindings",{enumerable:!1}),Object.defineProperty(this,"objectMutated",{enumerable:!1,value:this.objectMutated.bind(this)}),Object.defineProperty(this,"objectMutatedThrottled",{enumerable:!1,value:this.objectMutatedThrottled.bind(this)}),Object.defineProperty(this,"queueDispatch",{enumerable:!1,value:this.queueDispatch.bind(this)}),Object.defineProperty(this,"queueDispatchLazy",{enumerable:!1,value:this.queueDispatchLazy.bind(this)}),this._protochain.observedObjects.length&&window.addEventListener("object-mutated",this.objectMutated),this.applyProperties(e)}setProperty(e,t,o){const s=this._properties[e];var i=s.value;if(t!==i){const r=t instanceof Binding?t:void 0;if(r){const n=s.binding;n&&r!==n&&n.removeTarget(this,e),r.addTarget(this,e),t=r.value}else s.binding&&o&&s.binding.node.setProperty(s.binding.property,t,o);s.value=t,s.type===String?"string"!=typeof t&&console.warn(`Wrong type of property "${e}". Value: "${t}". Expected type: `+s.type.name,this._node):s.type===Number?"number"!=typeof t&&console.warn(`Wrong type of property "${e}". Value: "${t}". Expected type: `+s.type.name,this._node):s.type===Boolean?"boolean"!=typeof t&&console.warn(`Wrong type of property "${e}". Value: "${t}". Expected type: `+s.type.name,this._node):s.type&&(t instanceof s.type||console.warn(`Wrong type of property "${e}". Value: "${t}". Expected type: `+s.type.name,this._node)),s.notify&&i!==t&&(this.queue(e,t,i),o||this.queueDispatch()),void 0!==s.reflect&&1<=s.reflect&&this._isIoElement&&this.setAttribute(e,t)}}applyProperties(e){for(const t in e)void 0!==this._properties[t]?this.setProperty(t,e[t],!0):t.startsWith("on-")||"import"===t||"style"===t||"config"===t||console.warn(`Property "${t}" is not defined`,this);this._eventDispatcher.applyPropListeners(e),this.queueDispatch()}setProperties(e){for(const t in e)void 0!==this._properties[t]?this.setProperty(t,e[t],!0):console.warn(`Property "${t}" is not defined`,this);this.queueDispatch()}setValue(e){var t;this.value!==e&&(t=this.value,this.setProperty("value",e),this.dispatchEvent("value-set",{value:e,oldValue:t},!1))}dispose(){this._changeQueue.dispose(),this._propertyBinder.dispose(),this._eventDispatcher.dispose();for(const e in this._properties)this._properties[e].binding&&this._properties[e].binding?.removeTarget(this._node,e);for(const t in this._bindings)this._bindings[t].dispose(),delete this._bindings[t];this._protochain.observedObjects.length&&window.removeEventListener("object-mutated",this.objectMutated)}changed(){}applyCompose(){var e=this.compose;if(this.compose)for(const t in e)if(this._properties[t]&&"object"==typeof this._properties[t].value){const o=this._properties[t].value;if(o._isIoNode)o.applyProperties(e[t]);else for(const s in e[t])o[s]=e[t][s]}else console.error(`Composed property ${t} is not a Node or an object.`)}queue(e,t,o){this._changeQueue.queue(e,t,o)}queueDispatch(){this.lazy?(preThrottleQueue.push(this.queueDispatchLazy),this.throttle(this.queueDispatchLazy)):this._changeQueue.dispatch()}queueDispatchLazy(){this._changeQueue.dispatch()}objectMutated(t){for(let e=0;e<this._protochain.observedObjects.length;e++){var o=this._protochain.observedObjects[e];if(this._properties[o].value===t.detail.object)return void this.throttle(this.objectMutatedThrottled,o,!1);if(t.detail.objects)return void console.error("Deprecation warning! `objects` property no longer supported. Use `object` property instead.")}}objectMutatedThrottled(e){this[e+"Mutated"]&&this[e+"Mutated"](),this.applyCompose(),this.changed()}bind(e){return this._properties[e]||console.warn(`IoGUI Node: cannot bind to ${e} property. Does not exist!`),this._bindings[e]=this._bindings[e]||new Binding(this,e),this._bindings[e]}unbind(e){this._bindings[e]&&this._bindings[e].dispose(),delete this._bindings[e],this._properties[e].binding&&this._properties[e].binding?.removeTarget(this,e)}addEventListener(e,t,o){"function"==typeof t?this._eventDispatcher.addEventListener(e,t,o):console.warn(this.constructor.name+"incorrect listener type.",this)}removeEventListener(e,t,o){this._eventDispatcher.removeEventListener(e,t,o)}dispatchEvent(e,t={},o=!1,s){this._eventDispatcher.dispatchEvent(e,t,o,s)}throttle(e,t,o){if(-1!==preThrottleQueue.indexOf(e)||(preThrottleQueue.push(e),o))if(-1===throttleQueue.indexOf(e)&&throttleQueue.push(e),argQueue.has(e)&&"object"!=typeof t){const s=argQueue.get(e);-1===s.indexOf(t)&&s.push(t)}else argQueue.set(e,[t]);else e(t)}requestAnimationFrameOnce(e){requestAnimationFrameOnce(e)}filterObject(e,t,o=5,s=[],i=0){if(-1===s.indexOf(e)&&(s.push(e),!(o<i))){if(i++,t(e))return e;for(const n in e){var r=e[n]instanceof Binding?e[n].value:e[n];if(t(r))return r;if("object"==typeof r){r=this.filterObject(r,t,o,s,i);if(r)return r}}}}filterObjects(e,t,o=5,s=[],i=0){const r=[];if(-1!==s.indexOf(e))return r;if(s.push(e),o<i)return r;i++,t(e)&&-1===r.indexOf(e)&&r.push(e);for(const l in e){var n=e[l]instanceof Binding?e[l].value:e[l];if(t(n)&&-1===r.indexOf(n)&&r.push(n),"object"==typeof n){var a=this.filterObjects(n,t,o,s,i);for(let e=0;e<a.length;e++)-1===r.indexOf(a[e])&&r.push(a[e])}}return r}import(t){const o=new URL(t,String(window.location)).href;return new Promise(e=>{!t||IMPORTED_PATHS[o]?e(o):import(o).then(()=>{IMPORTED_PATHS[o]=!0,e(o)})})}preventDefault(e){e.preventDefault()}stopPropagation(e){e.stopPropagation()}};return Object.defineProperty(e,"name",{value:"IoNodeMixinConstructor"}),e}const RegisterIoNode=function(e){var t=e.prototype;Object.defineProperty(t,"_isIoNode",{value:!0}),Object.defineProperty(e,"_registeredAs",{value:e.name}),Object.defineProperty(t,"_protochain",{value:new ProtoChain(e)});for(const o in t._protochain.properties)Object.defineProperty(t,o,{get:function(){return this._properties[o].value},set:function(e){this.setProperty(o,e)},configurable:!0})};class IoNode extends IoNodeMixin(Object){}RegisterIoNode(IoNode);const IMPORTED_PATHS={},preThrottleQueue=[],throttleQueue=[],argQueue=new WeakMap,funcQueue=[],animate=function(){requestAnimationFrame(animate);for(let e=preThrottleQueue.length;e--;)preThrottleQueue.splice(preThrottleQueue.indexOf(preThrottleQueue[e]),1);for(let t=throttleQueue.length;t--;){const o=argQueue.get(throttleQueue[t]);for(let e=o.length;e--;)throttleQueue[t](o[e]),o.splice(o.indexOf(e),1);throttleQueue.splice(throttleQueue.indexOf(throttleQueue[t]),1)}for(let e=funcQueue.length;e--;){const t=funcQueue[e];funcQueue.splice(funcQueue.indexOf(t),1),t()}};function requestAnimationFrameOnce(e){-1===funcQueue.indexOf(e)&&funcQueue.push(e)}requestAnimationFrame(animate);class IoElement extends IoNodeMixin(HTMLElement){static get Style(){return":host[hidden] { display: none; } :host[disabled] { pointer-events: none; opacity: 0.5; }"}static get Properties(){return{$:{type:Object,notify:!1},tabindex:{type:String,reflect:1},contenteditable:{type:Boolean,reflect:1},class:{type:String,reflect:1},role:{type:String,reflect:1},label:{type:String,reflect:1},name:{type:String,reflect:1},title:{type:String,reflect:1},id:{type:String,reflect:-1},hidden:{type:Boolean,reflect:1},disabled:{type:Boolean,reflect:1}}}static get Listeners(){return{"focus-to":"_onFocusTo"}}static get observedAttributes(){const e=[];for(const o in this.prototype._protochain.properties){var t=this.prototype._protochain.properties[o].reflect;-1!==t&&2!==t||e.push(o)}return e}attributeChangedCallback(e,t,o){const s=this._properties[e].type;s===Boolean?null===o?this[e]=!1:""===o&&(this[e]=!0):s===Number||s===String?this[e]=new s(o):s===Object||s===Array?this[e]=JSON.parse(o):"function"==typeof s?this[e]=new s(JSON.parse(o)):this[e]=isNaN(Number(o))?o:Number(o)}connectedCallback(){"function"==typeof this.onResized&&ro.observe(this)}disconnectedCallback(){"function"==typeof this.onResized&&ro.unobserve(this)}template(e,t){e=buildTree()(["root",e]).children;(t=t||this)===this&&this.setProperty("$",{}),this.traverse(e,t)}traverse(t,o){for(var s,i,r=o.children;r.length>t.length;){var e=r[r.length-1];o.removeChild(e)}if(r.length<t.length){const a=document.createDocumentFragment();for(let e=r.length;e<t.length;e++){var n=constructElement(t[e]);a.appendChild(n)}o.appendChild(a)}for(let e=0;e<r.length;e++){const l=r[e];l.localName!==t[e].name?(s=l,i=constructElement(t[e]),o.insertBefore(i,s),o.removeChild(s)):(l.removeAttribute("className"),l._isIoElement?l.applyProperties(t[e].props):applyNativeElementProps(l,t[e].props))}for(let e=0;e<t.length;e++){const c=r[e];t[e].props.id&&(this.$[t[e].props.id]=c),void 0!==t[e].children&&("string"==typeof t[e].children?(this.flattenTextNode(c),c._textNode.nodeValue=String(t[e].children)):"object"==typeof t[e].children&&this.traverse(t[e].children,c))}}flattenTextNode(t){if(0===t.childNodes.length&&t.appendChild(document.createTextNode("")),"#text"!==t.childNodes[0].nodeName&&(t.innerHTML="",t.appendChild(document.createTextNode(""))),t._textNode=t.childNodes[0],1<t.childNodes.length){var e=t.textContent;for(let e=t.childNodes.length;e--;)0!==e&&t.removeChild(t.childNodes[e]);t._textNode.nodeValue=e}}get textNode(){return this.flattenTextNode(this),this._textNode.nodeValue}set textNode(e){this.flattenTextNode(this),this._textNode.nodeValue=String(e)}applyProperties(e){if(super.applyProperties(e),e.style)for(const t in e.style)this.style[t]=e.style[t]}setAttribute(e,t){!0===t?HTMLElement.prototype.setAttribute.call(this,e,""):!1===t||""===t?this.removeAttribute(e):"string"!=typeof t&&"number"!=typeof t||this.getAttribute(e)!==String(t)&&HTMLElement.prototype.setAttribute.call(this,e,String(t))}applyCompose(){super.applyCompose(),this.applyAria()}applyAria(){this.label?this.setAttribute("aria-label",this.label):this.removeAttribute("aria-label"),this.disabled?this.setAttribute("aria-disabled",!0):this.removeAttribute("aria-disabled")}_onFocusTo(e){var i,r,n,a,l=e.composedPath()[0],c=e.detail.dir;const h=e.detail.rect;if(h.center={x:h.x+h.width/2,y:h.y+h.height/2},l!==this){let t=l,o=1/0,s=1/0;const d=this.querySelectorAll('[tabindex="0"]:not([disabled])');for(let e=d.length;e--;)if(d[e].offsetParent)if("visible"===window.getComputedStyle(d[e]).visibility){const p=d[e].getBoundingClientRect();switch(p.center={x:p.x+p.width/2,y:p.y+p.height/2},c){case"right":p.left>=h.right-1&&(i=Math.abs(p.left-h.right),r=Math.abs(p.center.y-h.center.y),i<o||r<s/3?(t=d[e],o=i,s=r):i===o&&r<s&&(t=d[e],s=r));break;case"left":p.right<=h.left+1&&(i=Math.abs(p.right-h.left),r=Math.abs(p.center.y-h.center.y),i<o||r<s/3?(t=d[e],o=i,s=r):i===o&&r<s&&(t=d[e],s=r));break;case"down":p.top>=h.bottom-1&&(a=Math.abs(p.center.x-h.center.x),(n=Math.abs(p.top-h.bottom))<s||a<o/3?(t=d[e],o=a,s=n):n===s&&a<o&&(t=d[e],o=a));break;case"up":p.bottom<=h.top+1&&(n=Math.abs(p.center.x-h.center.x),(a=Math.abs(p.bottom-h.top))<s||n<o/3?(t=d[e],o=n,s=a):a===s&&n<o&&(t=d[e],o=n))}}t!==l&&(t.focus(),e.stopPropagation())}}focusTo(e){var t=this.getBoundingClientRect();this.dispatchEvent("focus-to",{dir:e,rect:t},!0)}}const warning=document.createElement("div"),mixinRecord=(warning.innerHTML="No support for custom elements detected! <br />Sorry, modern browser is required to view this page.<br />",{}),commentsRegex=new RegExp("(\\/\\*[\\s\\S]*?\\*\\/)","gi"),keyframeRegex=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi"),mediaQueryRegex=new RegExp("((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi"),mixinRegex=new RegExp("((--[\\s\\S]*?): {([\\s\\S]*?)})","gi"),applyRegex=new RegExp("(@apply\\s.*?;)","gi"),cssRegex=new RegExp("((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})","gi"),RegisterIoElement=function(e){RegisterIoNode(e);const s=e.name.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();if(Object.defineProperty(e,"localName",{value:s}),Object.defineProperty(e.prototype,"localName",{value:s}),Object.defineProperty(e,"_isIoElement",{enumerable:!1,value:!0}),Object.defineProperty(e.prototype,"_isIoElement",{enumerable:!1,value:!0}),Object.defineProperty(window,e.name,{value:e}),void 0!==window.customElements){window.customElements.define(s,e);let t="";const a=e.prototype._protochain.style.match(mixinRegex);if(a)for(let e=0;e<a.length;e++){const h=a[e].split(": {");var i=h[0],r=h[1].replace(/}/g,"").trim().replace(/^ +/gm,"");mixinRecord[i]=r,t+=a[e].replace("--",".").replace(": {"," {")}let o=e.prototype._protochain.style.replace(mixinRegex,"");const l=o.match(applyRegex);if(l)for(let e=0;e<l.length;e++){var n=l[e].split("@apply ")[1].replace(";","");mixinRecord[n]?o=o.replace(l[e],mixinRecord[n]):console.warn("IoElement: cound not find mixin:",n)}{let e=o;const d=(e=(e=(e=e.replace(commentsRegex,"")).replace(keyframeRegex,"")).replace(mediaQueryRegex,"")).match(cssRegex);d&&d.map(e=>{(e=e.trim()).startsWith(":host")||(console.warn(s+': CSS Selector not prefixed with ":host"! This will cause style leakage!'),console.warn(e))})}o=t+o.replace(new RegExp(":host","g"),s);const c=document.createElement("style");c.innerHTML=o,c.setAttribute("id","io-style-"+s.replace("io-","")),document.head.appendChild(c)}else document.body.insertBefore(warning,document.body.children[0])},ro=new ResizeObserver(e=>{for(const t of e)t.target.onResized()}),constructElement=function(e){const t=window.customElements?window.customElements.get(e.name):null;if(t&&t._isIoElement)return new t(e.props);var o=document.createElement(e.name);return applyNativeElementProps(o,e.props),o},superCreateElement=document.createElement,applyNativeElementProps=(document.createElement=function(...e){const t=e[0];if(t.startsWith("io-")){const o=customElements.get(t);return o?new o:superCreateElement.apply(this,e)}return superCreateElement.apply(this,e)},function(e,t){for(const s in t){var o=t[s];if(s.startsWith("@"))e.setAttribute(s.substr(1),o);else if("style"===s)for(const i in o)e.style.setProperty(i,o[i]);else"class"===s?e.className=o:"id"!==s&&(e[s]=o);"name"===s&&e.setAttribute("name",o)}e._eventDispatcher||Object.defineProperty(e,"_eventDispatcher",{value:new EventDispatcher(e)}),e._eventDispatcher.applyPropListeners(t,e)}),isString=(RegisterIoElement(IoElement),e=>"string"==typeof e),isArray=Array.isArray,isObject=e=>"object"==typeof e&&!isArray(e),clense=(e,t)=>t?isString(t[0])?[...e,t]:[...e,...t]:e,buildTree=()=>e=>e&&isObject(e[1])?{name:e[0],props:e[1],children:isArray(e[2])?e[2].reduce(clense,[]).map(buildTree()):e[2]}:buildTree()([e[0],{},e[1]]);class EmulatedLocalStorage{store={};warned=!1;get permited(){try{return!!self.localStorage.getItem("io-storage-user-permitted")}catch(e){console.warn("IoStorage: Cannot access localStorage. Check browser privacy settings!")}return!1}set permited(e){try{if(self.localStorage.setItem("io-storage-user-permitted",String(e)),"true"===self.localStorage.getItem("io-storage-user-permitted")){for(const t in this.store)self.localStorage.setItem(t,String(this.store[t])),delete this.store[t];console.log("IoStorage: Saved localStorage state.")}}catch(e){console.warn("IoStorage: Cannot access localStorage. Check browser privacy settings!")}}constructor(){Object.defineProperty(this,"store",{value:{},writable:!0}),Object.defineProperty(this,"warned",{value:!1,writable:!0})}setItem(e,t){t="object"==typeof t?JSON.stringify(t):String(t);this.permited?self.localStorage.setItem(e,t):(this.store[e]=t,this.warned||(this.permited?console.warn("IoStorage: localStorage pending permission by user."):console.warn("IoStorage: localStorage permission denied by user."),this.warned=!0),"io-storage-user-permitted"===e&&(this.permited=!!this.store[e]))}getItem(e){return this.permited?self.localStorage.getItem(e):this.store[e]}removeItem(e){if(this.permited)return self.localStorage.removeItem(e);delete this.store[e]}clear(){if(this.permited)return self.localStorage.clear();this.store={}}}const localStorage$1=new EmulatedLocalStorage,nodes={};let hashes={};const parseHashes=function(){return self.location.hash.substr(1).split("&").reduce(function(e,t){t=t.split("=");return e[t[0]]=t[1],e},{})},getHashes=function(){for(const o in hashes=parseHashes()){var e=o,t=o;nodes[e]&&""!==hashes[t]&&(t=hashes[t].replace(/%20/g," "),isNaN(t)?nodes[e].value="true"===t||"false"===t?JSON.parse(t):t:nodes[e].value=JSON.parse(t))}for(const s in nodes)"hash"!==nodes[s].storage||hashes[s]||(nodes[s].value=nodes[s].default)},setHashes=function(e){let t="";for(const o in nodes)"hash"!==nodes[o].storage&&!0!==e||void 0===nodes[o].value||""===nodes[o].value||nodes[o].value===nodes[o].default||("string"==typeof nodes[o].value?t+=o+"="+nodes[o].value+"&":t+=o+"="+JSON.stringify(nodes[o].value)+"&");for(const s in hashes)s&&!nodes[s]&&(t+=s+"="+hashes[s]+"&");t=t.slice(0,-1),self.location.hash=t,self.location.hash||history.replaceState({},document.title,self.location.pathname+self.location.search)};self.addEventListener("hashchange",getHashes,!1),getHashes();class IoStorage extends IoNode{static get Properties(){return{key:String,value:void 0,default:void 0,storage:void 0}}constructor(e){super(Object.assign({default:e.value},e)),e.key&&(nodes[e.key]=nodes[e.key]||this),this.binding=this.bind("value"),this.getStorageValue()}getStorageValue(){const e=this.key;switch(this.storage){case"hash":if(void 0!==hashes[e]){var t=hashes[e].replace(/%20/g," ");try{this.value=JSON.parse(t)}catch(e){this.value=t}}else this.value=this.default;break;case"local":{const e="/"!==self.location.pathname?self.location.pathname+this.key:this.key;t=localStorage$1.getItem(e);this.value=null!=t?JSON.parse(t):this.default;break}default:this.value=this.default}}valueChanged(){switch(this.storage){case"hash":setHashes();break;case"local":var e="/"!==self.location.pathname?self.location.pathname+this.key:this.key;null===this.value||void 0===this.value?localStorage$1.removeItem(e):localStorage$1.setItem(e,JSON.stringify(this.value))}}}RegisterIoNode(IoStorage);const IoStorageFactory=function(e){return(e=e&&"string"==typeof e?{key:e}:e)&&e.key&&nodes[e.key]?(e.storage&&(nodes[e.key].storage=e.storage),void 0!==e.value&&(nodes[e.key].default=e.value),nodes[e.key].binding):new IoStorage(e).binding},themePropDefaults=(Object.defineProperty(IoStorageFactory,"permitted",{get:()=>localStorage$1.permited,set:e=>{localStorage$1.permited=e}}),{cssSpacing:2,cssBorderRadius:3,cssBorderWidth:1,cssStrokeWidth:1,cssLineHeight:22,cssItemHeight:0,cssFontSize:14}),themeDBDefaults={light:Object.assign({cssBackgroundColor:[1,1,1,1],cssBackgroundColorLight:[.6,.6,.6,1],cssBackgroundColorDark:[.84,.84,.84,1],cssBackgroundColorField:[.92,.92,.92,1],cssColor:[0,0,0,1],cssColorError:[.91,.5,.5,1],cssColorLink:[.2,.75,.2,1],cssColorFocus:[.3,.6,1,1],cssColorField:[0,0,0,1],cssColorNumber:[.12,.64,1,1],cssColorString:[.95,.25,.1,1],cssColorBoolean:[.82,.35,.75,1],cssColorBorder:[.7,.7,.7,1],cssColorBorderLight:[1,1,1,1],cssColorBorderDark:[.6,.6,.6,1],cssColorGradientStart:[.9,.9,.9,1],cssColorGradientEnd:[.75,.75,.75,1],cssColorShadow:[0,0,0,.2]},themePropDefaults),dark:Object.assign({cssBackgroundColor:[.065,.065,.065,1],cssBackgroundColorLight:[.3,.3,.3,1],cssBackgroundColorDark:[.5,.5,.5,1],cssBackgroundColorField:[.137,.137,.137,1],cssColor:[1,1,1,1],cssColorError:[1,.376,.062,1],cssColorLink:[.75,.9,.59,1],cssColorFocus:[.3,.82,1.4,1],cssColorField:[.75,.75,.75,1],cssColorNumber:[.125,.64,1,1],cssColorString:[.94,.25,.086,1],cssColorBoolean:[.82,.35,.75,1],cssColorBorder:[.3,.3,.3,1],cssColorBorderLight:[.4,.4,.4,1],cssColorBorderDark:[0,0,0,1],cssColorGradientStart:[1,1,1,.1],cssColorGradientEnd:[0,0,0,.2],cssColorShadow:[0,0,0,.2]},themePropDefaults)},themeDB=IoStorageFactory({value:JSON.parse(JSON.stringify(themeDBDefaults)),storage:"local",key:"themeDB"});class IoTheme extends IoElement{static get Style(){return`
    --io-item: {
      align-self: flex-start;
      display: inline-block;
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-wrap: nowrap;
      white-space: nowrap;
      box-sizing: border-box;
      line-height: var(--io-line-height);
      height: var(--io-item-height);
      font-size: var(--io-font-size);
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: transparent;
      color: var(--io-color);
      background-color: transparent;
      background-image: none;
      padding: var(--io-spacing);
      transition: background-color 0.25s;
    }
    --io-panel: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      border-radius: calc(var(--io-border-radius) + var(--io-spacing));
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      color: var(--io-color-field);
      background-color: var(--io-background-color-dark);
      padding: var(--io-spacing);
    }
    --io-content: {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      flex: 1 1 auto;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      -webkit-tap-highlight-color: transparent;
    }
    --io-row: {
      display: flex;
      flex: 1 1;
      flex-direction: row;
      align-self: stretch;
      justify-self: stretch;
    }
    --io-column: {
      display: flex;
      flex: 1 1;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
    }
    --io-table2: {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table3: {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table4: {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: var(--io-spacing);
    }
    --io-table5: {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: var(--io-spacing);
    }
    `}static get Properties(){var e=!!window.matchMedia("(prefers-color-scheme: dark)").matches,e=IoStorageFactory({value:e?"dark":"light",storage:"local",key:"theme"}),t=themeDB.value[e.value];return{theme:e,cssSpacing:t.cssSpacing,cssBorderRadius:t.cssBorderRadius,cssBorderWidth:t.cssBorderWidth,cssStrokeWidth:t.cssStrokeWidth,cssLineHeight:t.cssLineHeight,cssItemHeight:t.cssItemHeight,cssFontSize:t.cssFontSize,cssBackgroundColor:{value:t.cssBackgroundColor,observe:!0},cssBackgroundColorLight:{value:t.cssBackgroundColorLight,observe:!0},cssBackgroundColorDark:{value:t.cssBackgroundColorDark,observe:!0},cssBackgroundColorField:{value:t.cssBackgroundColorField,observe:!0},cssColor:{value:t.cssColor,observe:!0},cssColorError:{value:t.cssColorError,observe:!0},cssColorLink:{value:t.cssColorLink,observe:!0},cssColorFocus:{value:t.cssColorFocus,observe:!0},cssColorField:{value:t.cssColorField,observe:!0},cssColorNumber:{value:t.cssColorNumber,observe:!0},cssColorString:{value:t.cssColorString,observe:!0},cssColorBoolean:{value:t.cssColorBoolean,observe:!0},cssColorBorder:{value:t.cssColorBorder,observe:!0},cssColorBorderLight:{value:t.cssColorBorderLight,observe:!0},cssColorBorderDark:{value:t.cssColorBorderDark,observe:!0},cssColorGradientStart:{value:t.cssColorGradientStart,observe:!0},cssColorGradientEnd:{value:t.cssColorGradientEnd,observe:!0},cssColorShadow:{value:t.cssColorShadow,observe:!0},lazy:!0}}constructor(e){super(e),this.variablesElement=document.createElement("style"),this.variablesElement.setAttribute("id","io-theme-variables"),document.head.appendChild(this.variablesElement)}_toCss(e){var t=Math.floor(255*e[0]),o=Math.floor(255*e[1]),s=Math.floor(255*e[2]);return void 0!==e[3]?`rgba(${t}, ${o}, ${s}, ${e[3]})`:`rgb(${t}, ${o}, ${s})`}reset(){themeDB.value=Object.assign({},JSON.parse(JSON.stringify(themeDBDefaults))),this.themeChanged()}themeChanged(){var e=themeDB.value[this.theme];this.setProperties({cssSpacing:e.cssSpacing,cssBorderRadius:e.cssBorderRadius,cssBorderWidth:e.cssBorderWidth,cssStrokeWidth:e.cssStrokeWidth,cssLineHeight:e.cssLineHeight,cssItemHeight:e.cssItemHeight,cssFontSize:e.cssFontSize,cssBackgroundColor:e.cssBackgroundColor,cssBackgroundColorLight:e.cssBackgroundColorLight,cssBackgroundColorDark:e.cssBackgroundColorDark,cssBackgroundColorField:e.cssBackgroundColorField,cssColor:e.cssColor,cssColorError:e.cssColorError,cssColorLink:e.cssColorLink,cssColorFocus:e.cssColorFocus,cssColorField:e.cssColorField,cssColorNumber:e.cssColorNumber,cssColorString:e.cssColorString,cssColorBoolean:e.cssColorBoolean,cssColorBorder:e.cssColorBorder,cssColorBorderLight:e.cssColorBorderLight,cssColorBorderDark:e.cssColorBorderDark,cssColorGradientStart:e.cssColorGradientStart,cssColorGradientEnd:e.cssColorGradientEnd,cssColorShadow:e.cssColorShadow})}changed(){this.setProperty("cssItemHeight",this.cssLineHeight+2*(this.cssSpacing+this.cssBorderWidth)),this.variablesElement.innerHTML=`
      body {
        --io-spacing: ${this.cssSpacing}px;
        --io-border-radius: ${this.cssBorderRadius}px;
        --io-border-width: ${this.cssBorderWidth}px;
        --io-stroke-width: ${this.cssStrokeWidth}px;
        --io-line-height: ${this.cssLineHeight}px;
        --io-item-height: ${this.cssItemHeight}px;
        --io-font-size: ${this.cssFontSize}px;

        --io-background-color: ${this._toCss(this.cssBackgroundColor)};
        --io-background-color-light: ${this._toCss(this.cssBackgroundColorLight)};
        --io-background-color-dark: ${this._toCss(this.cssBackgroundColorDark)};
        --io-background-color-field: ${this._toCss(this.cssBackgroundColorField)};

        --io-color: ${this._toCss(this.cssColor)};
        --io-color-error: ${this._toCss(this.cssColorError)};
        --io-color-link: ${this._toCss(this.cssColorLink)};
        --io-color-focus: ${this._toCss(this.cssColorFocus)};
        --io-color-field: ${this._toCss(this.cssColorField)};
        --io-color-number: ${this._toCss(this.cssColorNumber)};
        --io-color-string: ${this._toCss(this.cssColorString)};
        --io-color-boolean: ${this._toCss(this.cssColorBoolean)};
        --io-color-border: ${this._toCss(this.cssColorBorder)};
        --io-color-border-light: ${this._toCss(this.cssColorBorderLight)};
        --io-color-border-dark: ${this._toCss(this.cssColorBorderDark)};
        --io-color-gradient-start: ${this._toCss(this.cssColorGradientStart)};
        --io-color-gradient-end: ${this._toCss(this.cssColorGradientEnd)};
        --io-color-shadow: ${this._toCss(this.cssColorShadow)};


        --io-border: var(--io-border-width) solid var(--io-color-border);
        --io-border-error: var(--io-border-width) solid var(--io-color-error);
        --io-color-border-inset: var(--io-color-border-dark) var(--io-color-border-light) var(--io-color-border-light) var(--io-color-border-dark);
        --io-color-border-outset: var(--io-color-border-light) var(--io-color-border-dark) var(--io-color-border-dark) var(--io-color-border-light);

        --io-gradient-button: linear-gradient(180deg, var(--io-color-gradient-start), var(--io-color-gradient-end) 100%);
        --io-gradient-error: repeating-linear-gradient(135deg, transparent, var(--io-color-error) 1px, var(--io-color-error) 4px, transparent 6px);

        --io-shadow: 2px 2px 6px var(--io-color-shadow),
                     1px 1px 1px var(--io-color-shadow);
        --io-shadow-inset: 1px 1px 2px inset var(--io-color-shadow);
        --io-shadow-outset: -1px -1px 2px inset var(--io-color-shadow);
      }
    `;const e=themeDB.value[this.theme];for(const t in this._properties)t.startsWith("css")&&(e[t]=this._properties[t].value);themeDB.value=Object.assign({},themeDB.value),this.dispatchEvent("object-mutated",{object:this},!1,window)}}RegisterIoElement(IoTheme);const IoThemeSingleton=new IoTheme,IoIconsetDB=(document.head.appendChild(IoThemeSingleton),{});class IoIconset extends IoNode{registerIcons(t,e){const o=document.createElement("div");o.innerHTML=e,o.querySelectorAll("[id]").forEach(e=>{IoIconsetDB[t]=IoIconsetDB[t]||{},IoIconsetDB[t][e.id]=e.outerHTML})}getIcon(e){const t=IoIconsetDB[e.split(":")[0]];if(t){e=e.split(":")[1];if(t[e])return`<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">${t[e].replace(' id="',' class="icon-id-')}</svg>`}return'<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"></svg>'}}RegisterIoNode(IoIconset);const IoIconsetSingleton=new IoIconset,icons=`
<svg>
<g id="io">
  <ellipse fill="#83A61E" cx="5.4" cy="12.1" rx="3.4" ry="3.4"/>
  <path fill="#646464" d="M16.3,17.7c-3.1,0-5.6-2.6-5.6-5.6s2.6-5.6,5.6-5.6s5.6,2.6,5.6,5.6S19.3,17.7,16.3,17.7z M16.3,8.8
    c-1.8,0-3.3,1.5-3.3,3.2s1.5,3.2,3.3,3.2s3.3-1.5,3.3-3.2S18.1,8.8,16.3,8.8z"/>
</g>
<g id="io_logo">
  <path fill="#646464" d="M19.5,12.7c0.3-0.3,0.3-0.9,0-1.2l-0.7-0.7l-2.6-2.6c-0.3-0.3-0.3-0.9,0-1.2c0.3-0.3,0.9-0.3,1.2,0l3.8,3.8
    c0.7,0.7,0.7,1.8,0,2.6l-3.8,3.8c-0.3,0.3-0.9,0.3-1.2,0c-0.3-0.3-0.3-0.9,0-1.2"/>
  <path fill="#646464" d="M4.3,12.7c-0.3-0.3-0.3-0.9,0-1.2L5,10.8l2.6-2.6c0.3-0.3,0.3-0.9,0-1.2C7.3,6.7,6.7,6.7,6.4,7l-3.8,3.8
    c-0.7,0.7-0.7,1.8,0,2.6l3.8,3.8c0.3,0.3,0.9,0.3,1.2,0s0.3-0.9,0-1.2"/>
  <ellipse fill="#83A61E" cx="8.4" cy="12.1" rx="1.7" ry="1.7"/>
  <path fill="#646464" d="M13.9,14.9c-1.6,0-2.8-1.2-2.8-2.8s1.2-2.8,2.8-2.8s2.8,1.2,2.8,2.8S15.4,14.9,13.9,14.9z M13.9,10.4
    c-0.9,0-1.7,0.7-1.7,1.7c0,0.9,0.7,1.7,1.7,1.7c0.9,0,1.7-0.7,1.7-1.7C15.5,11.2,14.8,10.4,13.9,10.4z"/>
</g>
<g <g id="unlink">
  <path d="M3.9,12c0-1.7,1.4-3.2,3.2-3.2h4V7H7c-2.7,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.2,15.1,3.9,13.7,3.9,12z M17,7h-4.1v1.9H17
    c1.7,0,3.2,1.4,3.2,3.2s-1.4,3.2-3.2,3.2h-4.1v1.9H17c2.7,0,5-2.2,5-5S19.8,7,17,7z"/>
</g>
<g id="link">
  <path d="M3.9,12c0-1.7,1.4-3.2,3.2-3.2h4V7H7c-2.7,0-5,2.2-5,5s2.2,5,5,5h4v-1.9H7C5.2,15.1,3.9,13.7,3.9,12z M8,13h8.1v-2H8V13z
     M17,7h-4.1v1.9H17c1.7,0,3.2,1.4,3.2,3.2s-1.4,3.2-3.2,3.2h-4.1v1.9H17c2.7,0,5-2.2,5-5S19.8,7,17,7z"/>
</g>
<g id="gear">
  <path d="M21.3,14.6L19.2,13c0-0.3,0.1-0.6,0.1-1c0-0.3,0-0.6-0.1-1l2.1-1.7c0.2-0.2,0.2-0.4,0.1-0.6l-1.9-3.4
    c-0.1-0.2-0.3-0.2-0.6-0.2l-2.4,1c-0.5-0.3-1.1-0.7-1.7-1l-0.3-2.7c0-0.2-0.2-0.4-0.4-0.4h-4C9.8,2.3,9.5,2.4,9.5,2.7L9.1,5.3
    C8.5,5.5,8,5.8,7.5,6.3l-2.4-1c-0.2-0.1-0.5,0-0.7,0.2L2.5,8.8C2.4,9.1,2.4,9.3,2.6,9.5l2.1,1.7c0,0.3-0.1,0.6-0.1,1s0,0.6,0.1,1
    l-2.1,1.7c-0.2,0.2-0.2,0.4-0.1,0.6l1.9,3.4C4.5,19,4.7,19,5,19l2.4-1c0.5,0.4,1.1,0.7,1.7,1l0.4,2.7c0,0.2,0.3,0.4,0.6,0.4H14
    c0.2,0,0.4-0.2,0.5-0.4l0.3-2.7c0.6-0.2,1.2-0.5,1.7-1l2.4,1c0.2,0.1,0.4,0,0.6-0.2l1.9-3.4C21.6,15.1,21.5,14.8,21.3,14.6z
     M11.9,15.6c-2,0-3.7-1.7-3.7-3.7s1.7-3.6,3.7-3.6s3.7,1.7,3.7,3.7S13.9,15.6,11.9,15.6z"/>
</g>
<g id="less">
  <path d="M6.6,20.3L8.3,22l3.7-4l3.7,4l1.7-1.7l-5.3-5.7L6.6,20.3z M17.3,3.8l-1.7-1.7l-3.7,4l-3.7-4L6.6,3.8l5.3,5.7L17.3,3.8z"/>
</g>
<g id="more">
  <path d="M11.9,5.3l3.7,3.5l1.7-1.6L12,2.1L6.6,7.2l1.7,1.6L11.9,5.3z M11.9,18.9l-3.7-3.5L6.6,17l5.3,5.1l5.3-5.1l-1.7-1.6
    L11.9,18.9z"/>
</g>
<g id="code">
  <path d="M9.4,16.6L4.8,12l4.6-4.6L8,6.1l-6,6l6,6L9.4,16.6z M14.5,16.6l4.6-4.6l-4.6-4.6L15.9,6l6,6l-6,6L14.5,16.6z"/>
</g>
<g id="tune">
  <path d="M2,17.6v2.2h6.6v-2.2H2z M2,4.3v2.2h11V4.3H2z M13,22v-2.2h8.9v-2.2H13v-2.2h-2.2V22H13z M6.4,8.7V11H2v2.2h4.4v2.2h2.2
    V8.7H6.4z M21.9,13.1v-2.2h-11v2.2H21.9z M15.3,8.7h2.2V6.5h4.4V4.3h-4.4V2.1h-2.2V8.7z"/>
</g>
<g id="unlock">
  <path d="M11.9,17.3c1,0,1.9-0.8,1.9-1.9s-0.8-1.9-1.9-1.9S10,14.3,10,15.4S11,17.3,11.9,17.3z M17.6,8.7h-0.9V6.8
    c-0.1-2.6-2.2-4.7-4.7-4.7S7.3,4.3,7.3,6.8H9c0-1.7,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v1.9H6.4c-1.1,0-1.9,0.8-1.9,1.9v9.5
    c0,1.1,0.8,1.9,1.9,1.9h11.2c1,0,1.9-0.8,1.9-1.9v-9.5C19.4,9.6,18.6,8.7,17.6,8.7z M17.6,20.1H6.4v-9.5h11.2V20.1z"/>
</g>
<g id="lock">
  <path d="M11.9,17.3c1,0,1.9-0.8,1.9-1.9s-0.8-1.9-1.9-1.9S10,14.3,10,15.4S11,17.3,11.9,17.3z M17.6,8.7h-0.9V6.8
    c-0.1-2.6-2.2-4.7-4.7-4.7S7.3,4.3,7.3,6.8v1.9H6.4c-1.1,0-1.9,0.8-1.9,1.9v9.5c0,1.1,0.8,1.9,1.9,1.9h11.2c1,0,1.9-0.8,1.9-1.9
    v-9.5C19.4,9.6,18.6,8.7,17.6,8.7z M9,6.8c0-1.7,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v1.9H9V6.8z M17.6,20.1H6.4v-9.5h11.2V20.1z"/>
</g>
<g id="more_horizontal">
  <path d="M4.5,9.6C3.1,9.6,2,10.7,2,12.1s1.1,2.5,2.5,2.5S7,13.5,7,12.1S5.9,9.6,4.5,9.6z M19.4,9.6c-1.4,0-2.5,1.1-2.5,2.5
    s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S20.8,9.6,19.4,9.6z M11.9,9.6c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5
    S13.4,9.6,11.9,9.6z"/>
</g>
<g id="more_vertical">
  <path d="M11.9,7.1c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5S9.5,3.2,9.5,4.6S10.5,7.1,11.9,7.1z M11.9,9.6c-1.4,0-2.5,1.1-2.5,2.5
    s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5S13.4,9.6,11.9,9.6z M11.9,17.1c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5s2.5-1.1,2.5-2.5
    S13.4,17.1,11.9,17.1z"/>
</g>
<g id="chevron_left">
  <path d="M18.1,4.4l-2.3-2.3l-10,10l10,10l2.3-2.3l-7.6-7.6L18.1,4.4z"/>
</g>
<g id="chevron_up">
  <path d="M11.9,5.9l-10,10l2.3,2.3l7.6-7.6l7.6,7.6l2.3-2.3L11.9,5.9z"/>
</g>
<g id="chevron_down">
  <path d="M4.3,5.9l7.6,7.6l7.6-7.6l2.3,2.3l-10,10L2,8.2L4.3,5.9z"/>
</g>
<g id="chevron_right">
  <path d="M5.8,19.7l7.6-7.6L5.8,4.4l2.3-2.3l10,10l-10,10L5.8,19.7z"/>
</g>
<g id="arrow_left">
  <path d="M21.9,10.8H6.7l7-7L12,2.1l-10,10l10,10l1.7-1.7l-7-7h15.2V10.8z"/>
</g>
<g id="arrow_down">
  <path d="M21.9,12.1l-1.7-1.7l-7,7V2.1h-2.5v15.2l-7-7L2,12.1l10,10L21.9,12.1z"/>
</g>
<g id="arrow_up">
  <path d="M2,12.1l1.7,1.7l7-7V22h2.5V6.8l7,7l1.7-1.7l-10-10L2,12.1z"/>
</g>
<g id="arrow_right">
  <path d="M2,13.3h15.2l-7,7l1.7,1.7l10-10l-10-10l-1.7,1.7l7,7H2V13.3z"/>
</g>
<g id="arrow_end">
  <polygon points="7.6,3.8 14.6,10.8 2,10.8 2,13.3 14.6,13.3 7.6,20.3 9.4,22 19.3,12.1 9.4,2.1   "/>
  <rect x="19.4" y="2.1" width="2.5" height="19.9"/>
</g>
<g id="arrow_home">
  <polygon points="16.3,20.3 9.3,13.3 21.9,13.3 21.9,10.8 9.3,10.8 16.3,3.8 14.5,2.1 4.6,12.1 14.5,22   "/>
  <rect x="2" y="2.1" width="2.5" height="19.9"/>
</g>
<g id="chevron_end">
  <path d="M2,4.4L9.6,12L2,19.7L4.3,22l10-10L4.3,2L2,4.4z M18.6,2.1h3.3V22h-3.3V2.1z"/>
</g>
<g id="chevron_home">
  <path d="M21.9,19.7l-7.6-7.6l7.6-7.6l-2.3-2.3l-10,10l10,10L21.9,19.7z M5.3,22H2V2.1h3.3V22z"/>
</g>
<g id="check">
  <path d="M8.3,16.5l-4.7-4.7L2,13.3l6.3,6.3L21.9,6.1l-1.6-1.6L8.3,16.5z"/>
</g>
<g id="close">
  <path d="M21.9,4.1l-2-2l-8,8l-8-8l-2,2l8,8l-8,8l2,2l8-8l8,8l2-2l-8-8L21.9,4.1z"/>
</g>
<g id="circle">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8
    s8,3.6,8,8S16.4,20,11.9,20z"/>
</g>
<g id="circle_minus">
  <path d="M7,11.1v2h10v-2C16.9,11.1,7,11.1,7,11.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z
     M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/>
</g>
<g id="circle_plus">
  <path d="M12.9,7.1h-2v4H7v2h4v4h2v-4h4v-2h-4v-4H12.9z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1
    z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/>
</g>
<g id="circle_close">
  <path d="M14.5,8.1l-2.6,2.6L9.4,8.1L8,9.5l2.6,2.6L8,14.6L9.4,16l2.6-2.6l2.6,2.6l1.4-1.4L13.4,12L16,9.4L14.5,8.1z M11.9,2.1
    c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8
    S16.4,20,11.9,20z"/>
</g>
<g id="circle_triangle_right">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8
    s8,3.6,8,8S16.4,20,11.9,20z"/>
  <polygon points="10,16.6 15.9,12.1 10,7.6   "/>
</g>
<g id="circle_triangle_down">
  <path d="M21.9,12.1c0-5.5-4.5-10-10-10S2,6.6,2,12.1s4.5,10,10,10S21.9,17.5,21.9,12.1z M4,12.1c0-4.4,3.6-8,8-8s8,3.6,8,8
    s-3.6,8-8,8S4,16.5,4,12.1z"/>
  <polygon points="7.5,10.1 11.9,16.1 16.4,10.1   "/>
</g>
<g id="circle_triangle_left">
  <path d="M11.9,22c5.5,0,10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1S6.5,22,11.9,22z M11.9,4.1c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8
    S7.5,4.1,11.9,4.1z"/>
  <polygon points="13.9,7.6 8,12.1 13.9,16.6   "/>
</g>
<g id="circle_triangle_up">
  <path d="M2,12.1c0,5.5,4.5,10,10,10s10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1z M19.9,12.1c0,4.4-3.6,8-8,8s-8-3.6-8-8s3.6-8,8-8
    S19.9,7.7,19.9,12.1z"/>
  <polygon points="16.4,14.1 11.9,8.1 7.5,14.1   "/>
</g>
<g id="triangle_right">
  <polygon points="9.1,16.5 14.9,12 9.1,7.5   "/>
</g>
<g id="triangle_down">
  <polygon points="7.6,9 11.9,15 16.5,9   "/>
</g>
<g id="triangle_left">
  <polygon points="14.9,7.5 9.1,12 14.9,16.5   "/>
</g>
<g id="triangle_up">
  <polygon points="16.5,15 11.9,9 7.6,15   "/>
</g>
<g id="circle_pause">
  <path d="M9,16.1h2v-8H9V16.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20
    c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M12.9,16.1h2v-8h-2V16.1z"/>
</g>
<g id="circle_info">
  <path d="M11,17.1h2v-6h-2V17.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20
    c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M11,9.1h2v-2h-2C11,7.1,11,9.1,11,9.1z"/>
</g>
<g id="circle_warning">
  <path d="M11,15.1h2v2h-2V15.1z M11,7.1h2v6h-2V7.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z
     M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/>
</g>
<g id="circle_help">
  <path d="M11,18h2v-2h-2C11,16.1,11,18,11,18z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z
     M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z M11.9,6.1c-2.2,0-4,1.8-4,4h2c0-1.1,0.9-2,2-2s2,0.9,2,2
    c0,2-3,1.8-3,5h2c0-2.3,3-2.5,3-5C15.9,7.9,14.1,6.1,11.9,6.1z"/>
</g>
<g id="circle_checked">
  <path d="M11.9,7.1c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S14.8,7.1,11.9,7.1z M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10
    s10-4.5,10-10S17.4,2.1,11.9,2.1z M11.9,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,11.9,20z"/>
</g>
<g id="circle_location">
  <path d="M20,11.2c-0.4-3.8-3.4-6.8-7.1-7.1v-2H11V4c-3.8,0.3-6.8,3.3-7.1,7.1H2V13h1.9c0.4,3.8,3.4,6.8,7.1,7.1V22h1.8v-1.9
    c3.8-0.4,6.8-3.4,7.1-7.1h1.9v-1.8C21.9,11.2,20,11.2,20,11.2z M11.9,18.4c-3.6,0-6.3-2.8-6.3-6.3s2.7-6.3,6.3-6.3s6.3,2.8,6.3,6.3
    S15.5,18.4,11.9,18.4z"/>
</g>
<g id="circle_location_checked">
  <path d="M11.9,8.4c-2,0-3.7,1.7-3.7,3.7s1.7,3.7,3.7,3.7s3.7-1.7,3.7-3.7S13.9,8.4,11.9,8.4z M20,11.2c-0.4-3.8-3.4-6.8-7.1-7.1v-2
    H11V4c-3.8,0.3-6.8,3.3-7.1,7.1H2V13h1.9c0.4,3.8,3.4,6.8,7.1,7.1V22h1.8v-1.9c3.8-0.4,6.8-3.4,7.1-7.1h1.9v-1.8
    C21.9,11.2,20,11.2,20,11.2z M11.9,18.4c-3.6,0-6.3-2.8-6.3-6.3s2.7-6.3,6.3-6.3s6.3,2.8,6.3,6.3S15.5,18.4,11.9,18.4z"/>
</g>
<g id="circle_fill">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z"/>
</g>
<g id="circle_fill_checked">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M10,17.1l-5-5l1.4-1.4l3.6,3.6l7.6-7.6
    L19,8.1L10,17.1z"/>
</g>
<g id="circle_fill_minus">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M16.9,13.1H7v-2h10v2H16.9z"/>
</g>
<g id="circle_fill_plus">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M16.9,13.1h-4v4h-2v-4H7v-2h4v-4h2v4h4v2
    H16.9z"/>
</g>
<g id="circle_fill_arrow_down">
  <path d="M21.9,12.1c0-5.5-4.5-10-10-10S2,6.6,2,12.1s4.5,10,10,10S21.9,17.5,21.9,12.1z M7.5,10.1h9l-4.5,6L7.5,10.1z"/>
</g>
<g id="circle_fill_arrow_left">
  <path d="M11.9,22c5.5,0,10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1S6.5,22,11.9,22z M13.9,7.6v9l-6-4.5L13.9,7.6z"/>
</g>
<g id="circle_fill_arrow_up">
  <path d="M2,12.1c0,5.5,4.5,10,10,10s10-4.5,10-10s-4.5-10-10-10S2,6.6,2,12.1z M16.4,14.1h-9l4.5-6L16.4,14.1z"/>
</g>
<g id="circle_fill_arrow_right">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M10,16.6v-9l6,4.5L10,16.6z"/>
</g>
<g id="circle_fill_pause">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M11,16.1H9v-8h2V16.1z M14.9,16.1h-2v-8h2
    V16.1z"/>
</g>
<g id="circle_fill_info">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,17.1h-2v-6h2V17.1z M12.9,9.1h-2v-2h2
    C12.9,7.1,12.9,9.1,12.9,9.1z"/>
</g>
<g id="circle_fill_warning">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,17.1h-2v-2h2V17.1z M12.9,13.1h-2v-6h2
    C12.9,7.1,12.9,13.1,12.9,13.1z"/>
</g>
<g id="circle_fill_help">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M12.9,19h-2v-2h2C12.9,17.1,12.9,19,12.9,19z
     M15,11.4l-0.9,0.9c-0.8,0.7-1.2,1.3-1.2,2.8h-2v-0.6c0-1.1,0.4-2.1,1.2-2.8l1.2-1.3c0.4-0.3,0.6-0.8,0.6-1.4C14,8,13.1,7.1,12,7.1
    s-2,0.9-2,2H8c0-2.2,1.8-4,4-4s4,1.8,4,4C15.9,10,15.5,10.7,15,11.4z"/>
</g>
<g id="circle_fill_group">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S17.4,2.1,11.9,2.1z M8,17.5c-1.4,0-2.5-1.1-2.5-2.5
    s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S9.4,17.5,8,17.5z M9.5,8.1c0-1.4,1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5
    S9.5,9.5,9.5,8.1z M15.9,17.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S17.3,17.5,15.9,17.5z"/>
</g>
<g id="box">
  <path d="M19.7,4.3v15.5H4.2V4.3H19.7 M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3
    C21.9,3.1,20.9,2.1,19.7,2.1z"/>
</g>
<g id="box_fill">
  <path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z"/>
</g>
<g id="box_fill_checked">
  <path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z
     M9.8,17.6l-5.5-5.5l1.6-1.6l4,4l8.3-8.4l1.6,1.5L9.8,17.6z"/>
</g>
<g id="box_fill_minus">
  <path d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z
     M17.5,13.1H6.4v-2.2h11L17.5,13.1L17.5,13.1z"/>
</g>
<path id="box_fill_plus" d="M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3
  C21.9,3.1,20.9,2.1,19.7,2.1z M17.5,13.1h-4.4v4.4h-2.2v-4.4H6.4v-2.2h4.4V6.5H13v4.4h4.4L17.5,13.1L17.5,13.1z"/>
<g id="box_fill_gear">
  <path d="M11.9,9.8c-1.2,0-2.2,1-2.2,2.2s1,2.2,2.2,2.2s2.2-1,2.2-2.2S13.2,9.8,11.9,9.8z M19.7,2.1H4.2C3,2.1,2,3.1,2,4.3v15.5
    C2,21,3,22,4.2,22h15.5c1.2,0,2.2-1,2.2-2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M17.8,12.1c0,0.2,0,0.5-0.1,0.7l1.7,1.2
    c0.2,0.1,0.2,0.3,0.1,0.5l-1.6,2.7c-0.1,0.2-0.3,0.2-0.5,0.2l-1.9-0.7c-0.4,0.3-0.8,0.6-1.3,0.7L14,19.5c0,0.2-0.2,0.3-0.4,0.3
    h-3.1c-0.2,0-0.3-0.2-0.4-0.3l-0.2-2.1C9.4,17.2,9,17,8.6,16.7l-1.9,0.7c-0.2,0.1-0.4,0-0.5-0.2l-1.5-2.7c-0.1-0.2-0.1-0.4,0.1-0.5
    l1.7-1.2c-0.1-0.2-0.1-0.5-0.1-0.7s0-0.5,0.1-0.7l-1.7-1.2C4.4,9.9,4.4,9.7,4.5,9.6l1.6-2.7c0.1-0.2,0.2-0.3,0.4-0.2l1.9,0.7
    c0.4-0.3,0.8-0.6,1.3-0.7L10,4.6c0-0.2,0.2-0.3,0.4-0.3h3.1c0.2,0,0.3,0.2,0.4,0.3l0.2,2.1c0.5,0.2,0.9,0.4,1.3,0.7l1.9-0.7
    c0.2-0.1,0.4,0,0.5,0.2l1.6,2.7c0.1,0.2,0.1,0.4-0.1,0.5l-1.7,1.2C17.8,11.6,17.8,11.8,17.8,12.1z"/>
</g>
<g id="box_focus">
  <path d="M4.2,15.4H2v4.4C2,21,3,22,4.2,22h4.4v-2.2H4.2V15.4z M4.2,4.3h4.4V2.1H4.2C3,2.1,2,3.1,2,4.3v4.4h2.2V4.3z M19.7,2.1h-4.4
    v2.2h4.4v4.4h2.2V4.3C21.9,3.1,20.9,2.1,19.7,2.1z M19.7,19.8h-4.4V22h4.4c1.2,0,2.2-1,2.2-2.2v-4.4h-2.2V19.8z M11.9,7.7
    c-2.4,0-4.4,2-4.4,4.4s2,4.4,4.4,4.4s4.4-2,4.4-4.4S14.4,7.7,11.9,7.7z M11.9,14.3c-1.2,0-2.2-1-2.2-2.2s1-2.2,2.2-2.2
    s2.2,1,2.2,2.2S13.2,14.3,11.9,14.3z"/>
</g>
<g id="rows">
  <path d="M20.8,13.1H3.1c-0.6,0-1.1,0.5-1.1,1.1v6.6C2,21.5,2.5,22,3.1,22H21c0.6,0,1.1-0.5,1.1-1.1v-6.6
    C21.9,13.6,21.4,13.1,20.8,13.1z M20.8,2.1H3.1C2.5,2.1,2,2.6,2,3.2v6.6c0,0.6,0.5,1.1,1.1,1.1H21c0.6,0,1.1-0.5,1.1-1.1V3.2
    C21.9,2.6,21.4,2.1,20.8,2.1z"/>
</g>
<g id="columns">
  <path d="M6.2,2.1H3.1C2.5,2.1,2,2.8,2,3.5v17.1C2,21.4,2.5,22,3.1,22h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C7.2,2.8,6.7,2.1,6.2,2.1z
     M20.8,2.1h-3.2c-0.6,0-1.1,0.7-1.1,1.4v17.1c0,0.7,0.5,1.4,1.1,1.4h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C21.9,2.8,21.4,2.1,20.8,2.1z
     M13.5,2.1h-3.2c-0.6,0-1.1,0.7-1.1,1.4v17.1c0,0.7,0.5,1.4,1.1,1.4h3.2c0.6,0,1.1-0.7,1.1-1.4V3.5C14.6,2.8,14.1,2.1,13.5,2.1z"/>
</g>
<g id="dashboard">
  <path d="M2,13.1h8.9v-11H2V13.1z M2,22h8.9v-6.6H2V22z M13,22h8.9V11H13V22z M13,2.1v6.6h8.9V2.1H13z"/>
</g>
<g id="layer_add">
  <path d="M4,6.1H2v14c0,1.1,0.9,2,2,2h14v-2H4V6.1z M19.9,2.1H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-12
    C21.9,3,21,2.1,19.9,2.1z M18.9,11.1h-4v4h-2v-4H9v-2h4v-4h2v4h4C18.9,9.1,18.9,11.1,18.9,11.1z"/>
</g>
<g id="layer_remove">
  <path d="M4,6.1H2v14c0,1.1,0.9,2,2,2h14v-2H4V6.1z"/>
  <path d="M19.9,2.1H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-12C21.9,3,21,2.1,19.9,2.1z M18.9,11.1H9v-2h10v2
    H18.9z"/>
</g>
<g id="layer_to_back">
  <path d="M8.6,6.5H6.4v2.2h2.2V6.5L8.6,6.5z M8.6,11H6.4v2.2h2.2V11C8.5,11,8.6,11,8.6,11z M8.6,2.1c-1.2,0-2.2,1-2.2,2.2h2.2V2.1
    L8.6,2.1z M13,15.4h-2.2v2.2H13C13,17.5,13,15.4,13,15.4z M19.8,2.1v2.2H22C21.9,3.1,20.9,2.1,19.8,2.1z M13,2.1h-2.2v2.2H13V2.1z
     M8.6,17.6v-2.2H6.4C6.4,16.6,7.4,17.6,8.6,17.6z M19.8,13.1H22V11h-2.2V13.1z M19.8,8.7H22V6.5h-2.2V8.7z M19.8,17.6
    c1.2,0,2.2-1,2.2-2.2h-2.2V17.6z M4.1,6.5H2v13.3C2,21,3,22,4.1,22h13.3v-2.2H4.1C4.1,19.9,4.1,6.5,4.1,6.5z M15.3,4.3h2.2V2.1
    h-2.2V4.3z M15.3,17.6h2.2v-2.2h-2.2V17.6z"/>
</g>
<g id="layer_to_front">
  <path d="M2,13.1h2.2V11H2V13.1z M2,17.6h2.2v-2.2H2V17.6z M4.1,22v-2.2H2C2,21,3,22,4.1,22z M2,8.7h2.2V6.5H2V8.7z M15.3,22h2.2
    v-2.2h-2.2V22z M19.8,2.1H8.6c-1.2,0-2.2,1-2.2,2.2v11.1c0,1.2,1,2.2,2.2,2.2h11c1.2,0,2.2-1,2.2-2.2V4.3
    C21.9,3.1,20.9,2.1,19.8,2.1z M19.8,15.4H8.6V4.3h11L19.8,15.4L19.8,15.4z M10.9,22H13v-2.2h-2.2C10.9,19.9,10.9,22,10.9,22z
     M6.4,22h2.2v-2.2H6.4V22z"/>
</g>
<g id="layer_image">
  <path d="M21.9,16.1v-12c0-1.1-0.9-2-2-2H8c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h12C21,18,21.9,17.1,21.9,16.1z M11,12.1l2,2.7
    l3-3.7l4,5H8L11,12.1z M2,6.1v14c0,1.1,0.9,2,2,2h14v-2H4v-14C4,6.1,2,6.1,2,6.1z"/>
</g>
<g id="image">
  <path d="M21.9,19.8V4.3c0-1.2-1-2.2-2.2-2.2H4.2C3,2.1,2,3.1,2,4.3v15.5C2,21,3,22,4.2,22h15.5C20.9,22,21.9,21,21.9,19.8z M8,13.7
    l2.7,3.3l3.9-5l5,6.6H4.2L8,13.7z"/>
</g>
<g id="label_fill">
  <path d="M17.3,5.6c-0.4-0.5-1-0.9-1.7-0.9H4.1C2.9,4.8,2,5.7,2,6.8v10.5c0,1.2,0.9,2.1,2.1,2.1h11.5c0.7,0,1.3-0.3,1.7-0.9l4.6-6.4
    L17.3,5.6z"/>
</g>
<g id="label">
  <path d="M17.3,5.6c-0.4-0.5-1-0.9-1.7-0.9H4.1C2.9,4.7,2,5.6,2,6.8v10.5c0,1.2,0.9,2.1,2.1,2.1h11.5c0.7,0,1.3-0.3,1.7-0.9l4.6-6.3
    L17.3,5.6z M15.6,17.3H4.1V6.8h11.5l3.7,5.2L15.6,17.3z"/>
</g>
<g id="backspace">
  <path d="M20.3,4.8H7.8c-0.6,0-1,0.2-1.3,0.7L2,12.1l4.5,6.6c0.3,0.4,0.7,0.7,1.3,0.7h12.5c0.9,0,1.7-0.7,1.7-1.7V6.3
    C21.9,5.4,21.2,4.8,20.3,4.8z M17.8,15l-1.2,1.2l-3-2.9l-3,2.9L9.5,15l3-2.9l-3-2.9L10.6,8l3,2.9l3-2.9l1.2,1.2l-3,2.9L17.8,15z"/>
</g>
<g id="redo">
  <path d="M18.3,11.2c-1.8-1.6-4.2-2.6-6.7-2.6c-4.6,0-8.3,3-9.7,7.1l2.2,0.7c1-3.1,4-5.3,7.4-5.3c1.9,0,3.7,0.7,5,1.8l-3.6,3.6h9
    V7.7L18.3,11.2z"/>
</g>
<g id="undo">
  <path d="M12.2,8.6c-2.6,0-4.9,1-6.7,2.6L2,7.7v8.8h8.8L7.2,13c1.3-1.2,3.1-1.8,5-1.8c3.4,0,6.3,2.2,7.4,5.3l2.2-0.8
    C20.6,11.6,16.8,8.6,12.2,8.6z"/>
</g>
<g id="reload">
  <path d="M19,5c-1.8-1.7-4.3-2.9-7.1-2.9c-5.5,0-10,4.5-10,10s4.5,10,10,10c4.7,0,8.6-3.2,9.6-7.5H19c-1,2.9-3.8,5-7.1,5
    c-4.2,0-7.5-3.3-7.5-7.5s3.3-7.5,7.5-7.5c2.1,0,3.9,0.8,5.2,2.2l-4,4h8.7V2.1L19,5z"/>
</g>
<g id="grid_fill">
  <path d="M4,8.1h4v-4H4V8.1z M10,20h4v-4h-4V20z M4,20h4v-4H4V20z M4,14.1h4v-4H4V14.1z M10,14.1h4v-4h-4V14.1z M15.9,4.1v4h4v-4
    C19.9,4.1,15.9,4.1,15.9,4.1z M10,8.1h4v-4h-4V8.1z M15.9,14.1h4v-4h-4V14.1z M15.9,20h4v-4h-4V20z"/>
</g>
<g id="grid">
  <path d="M19.9,2.1H4c-1.1,0-2,0.9-2,2V20c0,1.1,0.9,2,2,2h15.9c1.1,0,2-0.9,2-2V4.1C21.9,3,21,2.1,19.9,2.1z M8,20H4v-4h4
    C8,16.1,8,20,8,20z M8,14.1H4v-4h4V14.1z M8,8.1H4v-4h4C8,4.1,8,8.1,8,8.1z M13.9,20h-4v-4h4C13.9,16.1,13.9,20,13.9,20z
     M13.9,14.1h-4v-4h4V14.1z M13.9,8.1h-4v-4h4C13.9,4.1,13.9,8.1,13.9,8.1z M19.9,20h-4v-4h4C19.9,16.1,19.9,20,19.9,20z M19.9,14.1
    h-4v-4h4V14.1z M19.9,8.1h-4v-4h4C19.9,4.1,19.9,8.1,19.9,8.1z"/>
</g>
<g id="search">
  <path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-2.9,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3
    c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1
    S12.2,14.6,9.5,14.6z"/>
</g>
<g id="zoom_in">
  <path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-3,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3
    c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1
    S12.2,14.6,9.5,14.6z M12.2,10.1H10v2.2H8.9v-2.2H6.6V9h2.2V6.8H10V9h2.2V10.1L12.2,10.1z"/>
</g>
<g id="zoom_out">
  <path d="M16.2,14.6h-0.9L15,14.3c1.1-1.2,1.7-3,1.7-4.7c0-4.1-3.2-7.3-7.3-7.3S2.1,5.5,2.1,9.6s3.2,7.3,7.3,7.3
    c1.8,0,3.5-0.7,4.7-1.7l0.3,0.3v0.9L20,22l1.7-1.7L16.2,14.6z M9.5,14.6c-2.8,0-5.1-2.2-5.1-5.1s2.2-5.1,5.1-5.1s5.1,2.2,5.1,5.1
    S12.2,14.6,9.5,14.6z M6.6,9h5.6v1.2H6.6V9z"/>
</g>
<g id="fullscreen">
  <path d="M4.8,14.9H2V22h7.1v-2.8H4.8V14.9z M2,9.2h2.8V4.9H9V2.1H2V9.2z M19.1,19.2h-4.2V22H22v-7.1h-2.8v4.3H19.1z M14.8,2.1v2.8
    H19v4.2h2.9v-7H14.8z"/>
</g>
<g id="fullscreen_off">
  <path d="M2,17.8h4.2V22H9v-7.1H2V17.8z M6.2,6.3H2v2.8h7.1v-7H6.2V6.3z M14.8,22h2.8v-4.2h4.3V15h-7.1C14.8,15,14.8,22,14.8,22z
     M17.7,6.3V2.1h-2.8v7.1H22V6.3H17.7z"/>
</g>
<g id="color_palette">
  <path d="M11.9,2.1c-5.5,0-10,4.5-10,10s4.5,10,10,10c0.9,0,1.7-0.7,1.7-1.7c0-0.4-0.2-0.8-0.4-1.1c-0.2-0.3-0.4-0.7-0.4-1.1
    c0-0.9,0.7-1.7,1.7-1.7h2c3.1,0,5.6-2.5,5.6-5.6C21.9,6.1,17.4,2.1,11.9,2.1z M5.9,12.1c-0.9,0-1.7-0.7-1.7-1.7S5,8.7,5.9,8.7
    s1.7,0.7,1.7,1.7S6.8,12.1,5.9,12.1z M9.2,7.7C8.3,7.7,7.5,6.9,7.5,6s0.7-1.7,1.7-1.7S10.9,5,10.9,6S10.1,7.7,9.2,7.7z M14.7,7.7
    C13.8,7.7,13,6.9,13,6s0.7-1.7,1.7-1.7c0.9,0,1.7,0.7,1.7,1.7S15.6,7.7,14.7,7.7z M18,12.1c-0.9,0-1.7-0.7-1.7-1.7S17,8.7,18,8.7
    s1.7,0.7,1.7,1.7S18.9,12.1,18,12.1z"/>
</g>
<g id="color_picker">
  <path d="M21.6,5L19,2.4c-0.4-0.4-1.2-0.4-1.6,0l-3.5,3.5l-2.1-2.2l-1.6,1.6l1.6,1.6L2,16.8V22h5.2l9.9-9.9l1.6,1.6l1.6-1.6L18.1,10
    l3.5-3.5C22,6.2,22,5.4,21.6,5z M6.3,19.8l-2.2-2.2l9-8.9l2.2,2.2L6.3,19.8z"/>
</g>
<g id="trash">
  <path d="M5.3,19.8c0,1.2,1,2.2,2.2,2.2h8.9c1.2,0,2.2-1,2.2-2.2V6.5H5.3V19.8z M19.7,3.2h-3.9l-1.1-1.1H9.2L8,3.2H4.2v2.2h15.5V3.2
    L19.7,3.2z"/>
</g>
<g id="trash_empty">
  <path d="M5.3,19.8c0,1.2,1,2.2,2.2,2.2h8.9c1.2,0,2.2-1,2.2-2.2V6.5H5.3V19.8z M8,11.9l1.6-1.5l2.3,2.3l2.3-2.3l1.6,1.6l-2.3,2.3
    l2.3,2.3l-1.6,1.6l-2.3-2.4l-2.3,2.3L8,16.6l2.3-2.3L8,11.9z M15.9,3.2l-1.2-1.1H9.2L8,3.2H4.2v2.2h15.5V3.2H15.9z"/>
</g>
<g id="developer">
  <path d="M21.9,9V6.9h-2v-2c0-1.2-0.9-2.1-2-2.1H4c-1.1,0-2,0.9-2,2.1v14.4c0,1.2,0.9,2.1,2,2.1h13.9c1.1,0,2-0.9,2-2.1v-2.1H22
    v-2.1h-2V13h2v-2h-2V9H21.9z M17.9,19.2H4V4.9h13.9V19.2L17.9,19.2z M6,13.1h5v4.1H6V13.1z M11.9,6.9h4V10h-4V6.9z M6,6.9h5V12H6
    V6.9z M11.9,11.1h4v6.1h-4V11.1z"/>
</g>
<g id="hub">
  <path d="M17.5,16.5L13,12.1V8.6c1.3-0.5,2.2-1.7,2.2-3.2c0-1.8-1.5-3.3-3.3-3.3S8.6,3.6,8.6,5.4c0,1.4,0.9,2.7,2.2,3.2v3.5
    l-4.4,4.4H2V22h5.6v-3.4l4.4-4.7l4.4,4.7V22H22v-5.6h-4.5V16.5z"/>
</g>
<g id="camera">
  <path d="M9.4,10.6l4.7-8.2c-0.7-0.2-1.4-0.2-2.2-0.2C9.5,2.2,7.3,3,5.6,4.4L9.4,10.6L9.4,10.6z M21.4,9.1c-0.9-2.9-3.2-5.2-6-6.3
    l-3.7,6.3H21.4z M21.8,10.1h-7.5l0.2,0.5l4.7,8.2c1.7-1.7,2.7-4.2,2.7-6.7C21.9,11.4,21.8,10.7,21.8,10.1z M8.5,12.1L4.6,5.3
    C3,7.1,2,9.5,2,12.1c0,0.7,0.1,1.3,0.2,2h7.5L8.5,12.1z M2.5,15.1c0.9,2.9,3.2,5.2,6,6.3l3.7-6.3C12.2,15.1,2.5,15.1,2.5,15.1z
     M13.7,15.1l-3.9,6.7C10.5,22,11.2,22,12,22c2.4,0,4.6-0.8,6.3-2.2l-3.7-6.3C14.6,13.5,13.7,15.1,13.7,15.1z"/>
</g>
<g id="camera_alt">
  <circle cx="11.9" cy="13.1" r="3.2"/>
  <path d="M9,3.1l-1.8,2H4c-1.1,0-2,0.9-2,2v12c0,1.1,0.9,2,2,2h15.9c1.1,0,2-0.9,2-2v-12c0-1.1-0.9-2-2-2h-3.2l-1.8-2
    C14.9,3.1,9,3.1,9,3.1z M11.9,18c-2.7,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S14.7,18,11.9,18z"/>
</g>
<g id="film">
  <path d="M13.9,5.9c0-1.1-0.9-1.9-2-1.9H11V3c0-0.5-0.4-0.9-0.9-0.9H6.2C5.7,2.1,5.3,2.5,5.3,3v0.9H4.4c-1.1,0-1.9,0.8-1.9,1.9V20
    c0,1.1,0.8,1.9,1.9,1.9H12c1.1,0,1.9-0.8,1.9-1.9h7.6V5.9H13.9z M11.9,18.2H10v-1.9h1.9V18.2z M11.9,9.7H10V7.8h1.9V9.7z
     M15.8,18.2h-1.9v-1.9h1.9V18.2z M15.8,9.7h-1.9V7.8h1.9V9.7z M19.5,18.2h-1.9v-1.9h1.9V18.2z M19.5,9.7h-1.9V7.8h1.9V9.7z"/>
</g>
<g id="visibility">
  <path d="M12,5.3c-4.5,0-8.3,2.8-9.9,6.7c1.5,3.9,5.4,6.7,9.9,6.7s8.3-2.8,9.9-6.7C20.3,8,16.5,5.3,12,5.3z M12,16.5
    c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5S14.5,16.5,12,16.5z M12,9.2c-1.5,0-2.7,1.2-2.7,2.7s1.2,2.7,2.7,2.7
    s2.7-1.2,2.7-2.7S13.5,9.2,12,9.2z"/>
</g>
<g id="visibility_off">
  <path d="M12,7.4c2.5,0,4.5,2,4.5,4.5c0,0.6-0.1,1.2-0.3,1.7l2.7,2.7c1.3-1.2,2.4-2.6,3.1-4.2c-1.6-4.1-5.4-6.8-9.9-6.8
    c-1.2,0-2.5,0.2-3.6,0.7l1.9,1.9C10.9,7.5,11.5,7.4,12,7.4z M3.1,4.9l2,2.1l0.4,0.4C4,8.6,2.8,10.2,2.1,11.9c1.6,4,5.4,6.7,9.9,6.7
    c1.4,0,2.7-0.2,3.9-0.7l0.4,0.4L19,21l1.2-1.2L4.1,3.8L3.1,4.9z M8,9.9l1.4,1.4c-0.1,0.2-0.1,0.4-0.1,0.6c0,1.5,1.2,2.7,2.7,2.7
    c0.2,0,0.4,0,0.6-0.1L14,16c-0.6,0.3-1.2,0.5-2,0.5c-2.5,0-4.5-2-4.5-4.5C7.5,11.2,7.7,10.5,8,9.9z M11.9,9.2l2.8,2.8v-0.2
    C14.7,10.4,13.4,9.2,11.9,9.2L11.9,9.2z"/>
</g>
<g id="layers">
  <path d="M11.9,19.5l-7.3-5.7L3,15l8.9,7l9-7l-1.6-1.2L11.9,19.5z M11.9,17l7.3-5.7l1.7-1.2l-9-6.9l-9,7l1.6,1.2L11.9,17z"/>
</g>
<g id="layers_off">
  <path d="M19.7,16l1.2-0.9l-1.4-1.4l-1.2,0.9L19.7,16z M19.3,11.3l1.7-1.2l-9-7L9,5.3l7.8,7.8C16.9,13.1,19.3,11.3,19.3,11.3z
     M3.3,2.1L2,3.3l4.2,4.2L2.9,10l1.6,1.2l7.3,5.7l2.1-1.6l1.4,1.4L12,19.4l-7.3-5.7l-1.6,1.2l8.9,7l4.9-3.8l3.7,3.7l1.2-1.2L3.3,2.1
    z"/>
</g>
<g id="hamburger">
  <path d="M20.9,9.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V14c0,0.4,0.5,0.8,1.1,0.8h17.9c0.6,0,1.1-0.3,1.1-0.7V9.9C22,9.4,21.5,9.1,20.9,9.1z
     M20.9,2.1H3.2c-0.6,0-1.1,0.3-1.1,0.7V7c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7V2.8C22,2.4,21.5,2.1,20.9,2.1z
     M20.9,16.5H3.2c-0.6,0-1.1,0.3-1.1,0.7v4.2c0,0.4,0.5,0.7,1.1,0.7h17.9c0.6,0,1.1-0.3,1.1-0.7v-4.2C22,16.8,21.5,16.5,20.9,16.5z"
    />
</g>
</svg>`;IoIconsetSingleton.registerIcons("icons",icons);class IoIcon extends IoElement{static get Style(){return`
    :host {
      @apply --io-item;
    }
    :host {
      width: var(--io-item-height);
      height: var(--io-item-height);
      border: 0;
      padding: 0;
      fill: var(--io-color, currentcolor);
    }
    :host[stroke] {
      stroke: var(--io-background-color, currentcolor);
      stroke-width: var(--io-stroke-width);
    }
    :host > svg {
      width: 100%;
      height: 100%;
    }
    :host > svg > g {
      pointer-events: none;
      transform-origin: 0px 0px;
    }
    `}static get Properties(){return{icon:{value:"",reflect:-1},label:{value:"",reflect:1},stroke:{value:!1,reflect:1}}}iconChanged(){this.innerHTML=IoIconsetSingleton.getIcon(this.icon)}}RegisterIoElement(IoIcon);class IoItem extends IoElement{static get Style(){return`
    :host {
      @apply --io-item;
    }
    :host[selected] {
      color: var(--io-color-link);
      background-color: var(--io-background-color-light);
    }
    :host:focus {
      z-index: 200;
      position: relative;
      text-overflow: inherit;
      border-color: var(--io-color-focus);
      outline-color: var(--io-color-focus);
    }
    `}static get Properties(){return{value:void 0,selected:{type:Boolean,reflect:1},tabindex:0}}static get Listeners(){return{focus:"_onFocus",pointerdown:"_onPointerdown",click:"_onClick"}}constructor(e={}){super(e),Object.defineProperty(this,"_textNode",{enumerable:!1,writable:!0,value:document.createTextNode("")}),this.appendChild(this._textNode)}_onFocus(e){this.addEventListener("blur",this._onBlur),this.addEventListener("keydown",this._onKeydown),this.addEventListener("keyup",this._onKeyup)}_onBlur(e){this.removeEventListener("blur",this._onBlur),this.removeEventListener("keydown",this._onKeydown),this.removeEventListener("keyup",this._onKeyup)}_onPointerdown(e){e.preventDefault(),this.addEventListener("pointermove",this._onPointermove),this.addEventListener("pointerleave",this._onPointerleave),this.addEventListener("pointerup",this._onPointerup)}_onPointermove(e){}_onPointerleave(e){this.removeEventListener("pointermove",this._onPointermove),this.removeEventListener("pointerleave",this._onPointerleave),this.removeEventListener("pointerup",this._onPointerup)}_onPointerup(e){this.removeEventListener("pointermove",this._onPointermove),this.removeEventListener("pointerleave",this._onPointerleave),this.removeEventListener("pointerup",this._onPointerup),this.focus()}_onClick(){this.dispatchEvent("item-clicked",{value:this.value,label:this.label},!0)}_onKeydown(e){"Enter"===e.key||" "===e.key?(e.preventDefault(),this._onClick()):"ArrowLeft"===e.key?(e.preventDefault(),this.focusTo("left")):"ArrowUp"===e.key?(e.preventDefault(),this.focusTo("up")):"ArrowRight"===e.key?(e.preventDefault(),this.focusTo("right")):"ArrowDown"===e.key&&(e.preventDefault(),this.focusTo("down"))}_onKeyup(e){}getCaretPosition(){let e=0;const t=window.getSelection();if(t&&t.rangeCount){const s=t.getRangeAt(0);var o=s.toString().length;const i=s.cloneRange();i.selectNodeContents(this),i.setEnd(s.endContainer,s.endOffset),e=i.toString().length-o}return e}setCaretPosition(e){if(e){const t=window.getSelection();if(t){const o=document.createRange();o.setStart(this.firstChild,e),o.collapse(!0),t.removeAllRanges(),t.addRange(o)}}}changed(){let t;if(this.label)t=this.label,this.title=this.label;else{let e;e=this.value&&"object"==typeof this.value?""+this.value.constructor.name+(this.value instanceof Array?`(${this.value.length})`:""):String(this.value),this.title=e,t=e}this.textNode=t}}RegisterIoElement(IoItem);class IoButton extends IoItem{static get Style(){return`
    :host {
      text-align: center;
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-button);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
    }
    :host[pressed] {
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
    }
    `}static get Properties(){return{action:null,value:void 0,pressed:{type:Boolean,reflect:1},label:"Button",icon:"",role:"button"}}_onPointerdown(e){super._onPointerdown(e),this.pressed=!0}_onPointerleave(e){super._onPointerleave(e),this.pressed=!1}_onPointerup(e){super._onPointerup(e),this.pressed=!1}_onKeydown(e){super._onKeydown(e),"Enter"!==e.key&&" "!==e.key||(this.pressed=!0)}_onKeyup(e){super._onKeyup(e),this.pressed=!1}_onClick(){super._onClick(),"function"==typeof this.action&&this.action(this.value)}}RegisterIoElement(IoButton);class IoBoolean extends IoItem{static get Style(){return`
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `}static get Properties(){return{label:"Boolean",value:{type:Boolean,reflect:1},true:"true",false:"false",role:"switch"}}_onClick(){this.toggle()}toggle(){this.setValue(!this.value)}valueChanged(){this.setAttribute("value",Boolean(this.value))}changed(){this.title=this.label,this.textNode=this.value?this.true:this.false}applyAria(){super.applyAria(),this.setAttribute("aria-checked",String(!!this.value)),this.setAttribute("aria-invalid","boolean"!=typeof this.value&&"true")}}RegisterIoElement(IoBoolean);class IoSwitch extends IoBoolean{static get Style(){return`
    :host {
      position: relative;
      width: calc(1.5 * var(--io-item-height));
    }
    :host:before {
      display: inline-block;
      box-sizing: border-box;
      position: absolute;
      content: '';
      top: var(--io-spacing);
      left: 0;
      width: calc(100% - calc(2 * var(--io-border-width)));
      height: var(--io-line-height);
      border-radius: var(--io-line-height);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      background-color: var(--io-background-color-dark);
      box-shadow: var(--io-shadow-inset);
      transition: background-color 0.4s;
    }
    :host:after {
      display: inline-block;
      box-sizing: border-box;
      position: absolute;
      content: '';
      top: calc(var(--io-border-width) + var(--io-spacing));
      left: var(--io-border-width);
      height: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
      width: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
      background-color: var(--io-background-color-dark);
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      border-radius: var(--io-line-height);
      transition-timing-function: ease-in-out;
      transition: left 0.25s;
    }
    :host[value]:after {
      background-color: rgba(80, 210, 355, 0.75);
      left: calc(calc(100% - var(--io-line-height)) - var(--io-border-width));
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    :host:hover:before,
    :host[display="switch"][value]:not([aria-invalid]):before {
      background-color: var(--io-background-color);
    }
    :host:focus:before,
    :host:focus:after {
      border-color: var(--io-color-focus);
    }
    :host:focus {
      outline-color: var(--io-color-focus);
    }
    `}changed(){this.title=this.label}applyAria(){super.applyAria(),this.setAttribute("aria-checked",String(!!this.value)),this.setAttribute("aria-invalid","boolean"!=typeof this.value&&"true"),this.setAttribute("aria-label",this.label)}}function getWordOfTheDay(e){let t=e-Math.floor((Number(new Date(2022,0,24))+36e5)/864e5);for(;t>answers.length;)t-=answers.length;return answers[t]}RegisterIoElement(IoSwitch);const answers=["речко.срб смара","варош","ајвар","труба","пожар","фетиш","народ","избор","отказ","шишке","метил","тесто","даире","ритам","грмаљ","чучањ","акорд","север","ћевап","хељда","фешта","жудња","облак","пршут","књига","палма","кусур","снови","радар","тиква","анода","ћошак","олово","смиље","борац","котур","тегла","лепак","чипка","трава","икона","мирис","кечап","борба","можда","брлог","слава","уреди","путем","фетус","мрежа","бајка","посно","улога","лебац","одмор","потом","чврга","злато","бакља","млеко","њушка","барка","шешир","пашче","снага","аутић","ћивот","миран","изађи","купац","мошти","около","зубар","сиров","завет","шерпа","патос","даска","писта","шатор","танго","магла","диода","црква","ковач","манго","путар","грање","радна","папир","звоно","чобан","никад","жезло","сенке","путир","накит","прање","ћурка","сокак","голуб","тачне","пудер","гумен","мокар","питом","цвеће","квака","санке","грива","жабац","длаке","оквир","труло","свећа","блато","бордо","перон","авала","плата","дрека","калај","немам","јакна","жбуње","носач","фиока","морка","окови","тепих","пуцањ","дебло","дубак","чичак","пацов","живци","стриц","вијак","мошус","клека","чизма","астал","купус","тутањ","шабац","смрча","много","нисам","падеж","шаран","понор","скија","копча","ловац","лекар","скроб","дунав","гамет"];let duplicates=answers.filter((e,t)=>answers.indexOf(e)!=t);duplicates.length&&console.error("duplicate answers",duplicates);const moreAllowedGuesses=["речко","ракун","буцко","метил","ветиз","пелет","возић","пуфне","чокер","керче","клема","сатић","тизер","арипл","зигот","зетић","пишко","пузле","фелна","џибер","химен","љубев","емоџи","дизна","зарон","набод","разор","чарно","гареж","орбит","ризла","коска","брион","ретро","заипш","зулуф","прано","морон","усран","прдеж","обран","натоп","гирос","краба","режиш","еским","ризле","непар","донор","бураз","ебола","рутер","шанер","дрчан","терач","загор","чачак","ролка","нарез","подан","атари","ленор","ковид","блеја","барич","намиг","локна","извез","шибер","чепић","шивен","ликра","дизне","морке","зајеб","офрље","његош","филет","метци","рибам","лемур","хобит","веган","сусам","легни","пекач","шврћа","кебаб","песто","чирга","диода","пелат","кајла","кибла","бурка","фреза","бебац","сокна","мусав","фугна","ћуфта","рикша","акрил","тенда","киноа","љењир","кинта","осмак","лајка","млава","зорба","фртаљ","андол","бутка","орада","бекап","лујка","пончо","ролер","фотка","ћорка","агава","лукац","рамен","фосна","локум","тромб","смоки","кожур","мусли","туфна","водка","тинта","мучањ","гудач","цевка","прушт","аутић","посип","паеља","ногар","пазле","сушач","пијун","грмањ","локот","анима","зујач","нудла","тонер","пужић","бећир","финта","сецко","фреон","чешањ","еклер","ратан","жрмањ","кулов","креза","сонар","хроно","халва","клеме","токен","вурда","љутко","дозер","орион","жујка"];(duplicates=moreAllowedGuesses.filter((e,t)=>moreAllowedGuesses.indexOf(e)!=t)).length&&console.error("duplicate moreAllowedGuesses",duplicates);let allowedGuesses=["абера","абере","абери","аберу","аваза","авазу","авакс","авала","авале","авали","авалу","авана","авани","аванс","авану","авари","авеља","авељу","авети","авиза","авион","авној","аврам","агама","агата","агате","агенс","агент","агина","агине","агини","агину","агнес","агнец","агора","агори","аграр","адађо","адама","адаме","адамс","адаму","адета","адету","адлер","адоби","адова","адолф","адута","адуте","адути","адуту","азања","азање","азањи","азија","азије","азији","азију","азила","азиле","азили","азилу","азота","азоти","азоту","азрин","азура","азуру","ајакс","ајаој","ајвар","ајгир","ајнцу","ајфел","акамо","аката","акорд","акреп","актер","актив","актом","акшам","алава","алаве","алави","алаво","алали","алама","алана","алану","аларм","аласа","аласе","аласи","аласу","алата","алате","алати","алату","алаха","алаху","алачу","албум","алвин","алвом","алева","алеве","алеви","алеву","алеја","алеје","алеји","алеју","алекс","алема","алеме","алеми","алему","алена","алени","алену","алефа","алжир","алиби","алија","алије","алији","алију","алила","алиле","алина","алине","алину","алиса","алисе","алиси","алису","алиће","алкар","алком","алову","алоја","алоје","алтер","алфом","алчак","аљкав","аљоша","аљоше","аљоши","амама","амаму","амана","амане","аману","амара","амару","амбар","амбис","амбре","амбру","амеба","амебе","амера","амере","амери","амиго","амиџа","амиџу","амове","амови","амора","аморе","амоса","ампер","ампир","амрел","амура","анала","анале","анали","англо","анђео","анекс","анина","анине","анини","анино","анину","аниса","анита","аните","аниту","анића","аница","анице","аници","аницу","анјон","анкер","анком","анода","аноде","антић","антре","ануса","анусе","аорта","аорте","апаша","апашу","апела","апеле","апели","апелу","аписа","апоен","аполо","април","апсом","арака","арама","арапа","арапе","арапи","арбун","аргат","аргон","арена","арене","арени","арену","арија","арије","арији","арију","ариља","ариље","ариљу","арима","аркан","арком","арома","ароме","ароми","арому","арсен","арсић","артур","архив","аршин","асима","аскет","асова","асове","асови","аспик","аспра","аспре","аспри","астал","астат","астма","астме","астму","астро","асура","асуре","асури","асуру","атака","атаку","атара","атаре","атару","атаци","аташе","атеље","атест","атила","атиле","атили","атило","атилу","атима","атина","атине","атини","атину","атлас","атлон","атова","атове","атови","атола","атолу","атома","атоме","атоми","атому","атоса","атосу","аћима","аћиме","аћиму","аудио","ауром","аутом","аутор","афект","афера","афере","афери","аферу","ачење","ачећи","ачити","ашова","ашови","бабак","бабац","бабин","бабов","бабом","бабун","бавим","бавио","бавиш","багав","багер","багља","багом","багра","багре","багру","бадањ","бадар","бадем","бадње","бадњи","бадњу","базај","базао","базар","базаш","базга","базде","базди","базел","базен","базна","базну","базом","бајан","бајао","бајат","бајач","бајка","бајке","бајки","бајко","бајку","бајна","бајне","бајни","бајно","бајну","бајом","бајта","бајца","бајци","бакал","бакар","бакин","бакља","бакље","бакљи","бакљу","баком","бакра","бакру","бакће","бакћу","балав","балет","балин","балон","балша","балши","балшу","бамби","банак","банат","банда","банде","банди","бандо","банду","банер","банеш","банка","банке","банки","банку","банов","баном","бануо","банци","банчи","бањом","бапну","бапце","бапци","бапцу","бапче","бараж","барба","барби","барда","барде","барду","барем","барен","баржа","барже","баржи","баржу","барио","барка","барке","барки","барку","барок","баром","барон","барут","басам","басен","басма","басме","басму","басна","басне","басни","басну","басом","баста","батак","батин","батић","батке","батли","батом","баука","бауља","бауци","бафер","бахат","бахне","бахну","бахом","бацај","бацам","бацан","бацао","бацач","бацаш","бацив","бацил","бацим","бацио","бацих","бациш","бачва","бачве","бачви","бачву","бачен","бачка","бачке","бачки","бачко","бачку","баџом","башка","башом","башта","баште","башти","башту","башче","башчи","башчу","бдела","бдели","бдело","бдења","бдење","бдењу","бдети","бдећи","бдије","бдију","бдимо","бдите","бебин","бебом","бегам","бегао","бегаш","бегеј","бегеш","бегов","бегом","бедак","бедан","бедем","бедна","бедне","бедни","бедно","бедну","бедом","бедра","бедро","бедру","бежао","бежах","бежим","бежиш","безок","безуб","бејах","беком","бекон","белај","белац","белег","белео","белим","белио","белић","белих","белка","белке","белко","белов","белог","белој","белом","белца","белце","белци","белцу","бељим","бемус","бенав","бенда","бенду","бенин","бенка","бенке","бенко","беном","берач","берба","бербе","берби","бербо","бербу","берда","берде","берем","береш","берза","берзе","берзи","берзу","бесан","бесим","бесмо","бесна","бесне","бесни","бесно","бесну","бесом","бесте","бетон","бећар","бехар","бечеј","бечио","бечиш","бечка","бечке","бечки","бечко","бечку","бешка","бешке","бешки","бешња","бешње","бешњи","бибер","бивак","бивам","бивао","биваш","бивша","бивше","бивши","бившу","бизон","бијах","бијем","бијен","бијеш","бијте","биком","билов","билом","билта","биљар","биљем","биљка","биљке","биљки","биљку","биљна","биљне","биљни","биљно","биљну","биљур","бинго","бином","бињиш","бирај","бирам","биран","бирао","бирач","бираш","бироа","биров","бирое","бирои","бироу","бирош","бисер","бисмо","биста","бисте","бисти","бисту","битак","битан","битеф","битка","битке","битки","битку","битна","битне","битни","битно","битну","битољ","бићем","бићеш","бифеа","бифеи","бифеу","бихаћ","бичем","бичић","бичуј","бјега","бјегу","бјеже","бјеху","бјеше","бјуик","блага","благе","благи","благо","благу","блажа","блаже","блажи","блажу","блања","блата","блате","блати","блато","блату","блаца","блаце","бледа","бледе","бледи","бледо","бледу","блеђа","блеђе","блеђи","блеје","блеји","блека","блене","блени","блену","блефа","ближа","ближе","ближи","ближу","близу","блинд","блица","блицу","блока","блоку","блонд","блуда","блуде","блуди","блуду","блуза","блузе","блузи","блузу","блуит","блума","блуму","бљува","бљује","бљују","бљуне","бљушт","бобан","бобар","бобек","бобић","бобоа","бобов","бобом","бобот","бобук","бобур","бован","бовен","бовић","бовом","богаз","богаљ","богат","богац","богер","богић","богме","богов","богом","бодар","бодеж","бодем","боден","бодља","бодље","бодни","бодом","бодра","бодре","бодри","бодро","бодру","бођан","боема","боеми","боему","божај","божин","божић","божја","божје","божји","божју","божом","божур","бозом","боинг","бојан","бојао","бојар","бојат","бојах","бојем","бојен","бојер","бојим","бојио","бојић","бојиш","бојка","бојке","бојки","бојко","бојку","бојла","бојмо","бојна","бојне","бојни","бојно","бојну","бојом","бојса","бојси","бојте","бокал","бокан","бокић","боком","бокор","бокса","боксу","бокун","бокца","болан","болео","болид","болић","болиш","болна","болне","болни","болно","болну","болом","болте","болто","болту","бољар","бољег","бољем","бољим","бољих","бољка","бољке","бољки","бољку","бољој","бољом","бољци","бомба","бомбе","бомби","бомбо","бомбу","бонам","бонда","бонду","бонић","боном","бонум","бонус","борак","боран","борац","борба","борбе","борби","борбо","борбу","борда","бордо","борду","борик","борим","борин","борио","борис","борић","борих","борич","бориш","борја","борје","борка","борке","борки","борко","борку","борна","борне","борни","борно","борну","боров","бором","бороу","борош","борут","борца","борце","борци","борцу","борча","борче","борчи","борчу","боршч","босим","босић","босих","боске","боски","боско","босна","босне","босни","босну","босог","босом","бости","ботом","ботош","боћар","боуви","боуен","боулс","боунс","бохем","боцка","боцне","боцну","боцом","бочка","бочку","бочна","бочне","бочни","бочно","бочну","бошић","бошка","бошко","бошку","бошча","бошче","бошчи","бошчу","брава","браве","брави","браво","браву","брага","брада","браде","бради","браду","бразе","брајо","брајт","брака","браку","брала","брале","брали","брало","брана","бранд","бране","брани","брано","брант","брану","брања","брање","брању","браон","брата","брате","брати","брату","браћа","браће","браћи","браћо","браћу","браун","брахе","браца","браце","браци","брацо","брацу","брача","брачу","браше","брбља","брвна","брвно","брвну","брдар","брдом","брега","брегу","бреда","бреди","бреду","бреза","брезе","брези","брезо","брезу","брејк","брека","бреку","брела","брема","бреме","брена","бренд","брене","брент","брену","брења","брест","брета","брехт","бреца","бреша","бреше","бреши","брешу","бржег","бржем","бржим","бржих","бржој","бржом","брзај","брзак","брзам","брзим","брзић","брзих","брзог","брзој","брзом","брига","бриге","бриго","бригу","бриде","бриди","брижа","брижи","брижу","бризи","брија","брије","брију","брике","брима","брине","брини","брину","бриош","брита","брите","брица","бриџа","брише","бриши","бришу","бркат","бркаш","бркић","бркља","бркље","бркну","брком","брлић","брлог","брљив","брник","брнко","брода","броде","броди","броду","броза","брозу","броја","броје","броји","броју","брома","брому","броћа","брсте","брсти","брћка","бруин","бруја","брује","бруји","брука","бруке","бруко","брукс","бруку","бруму","бруна","бруно","бруса","брусе","бруси","брусу","бруто","бруци","брчак","брчин","брчић","брчка","брчко","брчне","бубам","бубањ","бубац","бубаш","бубер","бубна","бубне","бубни","бубња","бубње","бубњи","бубњу","бубри","бувља","бувље","бувљи","будак","будан","будва","будве","будви","будву","будем","будеш","будим","будин","будио","будиш","будна","будне","будни","будно","будну","буђав","буђен","буена","буено","бузек","бузић","бујад","бујан","бујао","бујар","бујаш","бујић","бујна","бујне","бујни","бујно","бујну","бујон","букач","буква","букве","букви","букву","букер","букет","букић","букне","букни","букну","буков","буком","букте","букти","булат","булић","булка","булке","булку","булок","булом","булут","буљав","буљан","буљим","буљио","буљиш","буљон","буљук","бунар","бунда","бунде","бунди","бунду","буним","бунио","бунић","буниш","буном","бунта","бунту","бунца","буњац","бупну","бупце","бупци","бураг","бурад","буран","бурга","бурек","бурза","бурзи","бурим","бурић","бурич","бурке","бурма","бурме","бурми","бурму","бурна","бурне","бурни","бурно","бурнс","бурну","буром","бурса","бурсе","бурси","бусао","бусек","бусен","бусом","бутан","бутер","бутик","бутна","бутне","бутни","бутну","бућан","бућић","бућка","бућне","бућну","бућом","бухав","бухач","бухом","буцка","бучан","бучер","бучић","бучја","бучје","бучна","бучне","бучни","бучно","бучну","буџак","буџет","бушар","бушач","бушел","бушим","бушио","бушић","бушна","бушни","бушну","бушов","бушом","вабац","вабим","вабио","вабиш","вабне","вабни","вавек","ваган","вагао","вагаш","вагну","вагом","вагон","вадим","вадио","вадиш","вадуз","вађен","важан","важем","важим","важио","важиш","важна","важне","важни","важно","важну","вазал","вазда","вазић","вазна","вазну","вазом","вајан","вајао","вајар","вајат","вајда","вајде","вајди","вајду","вајка","вајна","вајни","вајта","вакта","вакти","вакум","валдо","валио","валов","валом","ваљај","ваљак","ваљам","ваљан","ваљао","ваљар","ваљаш","ваљда","ваљка","ваљке","ваљку","ваљци","вамош","ванга","ванић","вањин","вањом","вапај","вапим","вапио","вапиш","вапно","варај","варак","варам","варан","варао","варах","вараш","варде","варду","варен","вареш","варим","варио","вариш","варја","варка","варке","варки","варку","варна","варне","варни","варну","варом","варош","варте","варци","васиљ","васин","васић","васје","васка","васке","васку","ватај","ватан","ватао","ваташ","ватра","ватре","ватри","ватро","ватру","вафле","вафли","вацић","вашар","вашег","вашем","вашим","ваших","вашка","вашке","вашко","вашој","вашом","вебер","вегас","вегле","ведар","ведра","ведре","ведри","ведро","ведру","веђом","вежба","вежбе","вежби","вежбу","вежем","вежеш","везав","везак","везан","везао","везах","везач","везем","везен","везеш","везир","везла","везле","везли","везни","везом","везув","везуј","вејао","вејна","вејце","векер","векио","векић","векна","векне","векни","векну","веком","велеа","вележ","велес","велик","велим","велин","велић","велиш","велка","велки","велом","велса","велсе","велсу","велта","велту","велур","вељах","вељић","вељих","вељка","вељко","вељку","вељом","вемић","венац","венди","венем","венеш","веном","венти","венту","венуо","венус","венца","венце","венци","венцу","венча","венче","вењак","веома","вепар","вепра","вепре","вепру","веран","верао","верди","верем","верен","вереш","верин","верио","верић","верка","верна","верне","верни","верно","верну","вером","верон","веруј","весел","весео","весин","весић","веско","весла","весли","весло","весна","весне","весни","весно","весну","весом","веспа","веспу","веста","весте","вести","весто","весту","ветар","ветом","ветон","ветра","ветре","ветри","ветру","већај","већао","већег","већем","већим","већих","већма","већој","већом","вехби","вечан","вечер","вечим","вечит","вечна","вечне","вечни","вечно","вечну","вешај","вешам","вешан","вешао","вешом","вешта","веште","вешти","вешто","вешту","вешћу","вешци","вивши","вигањ","вигор","видак","видал","видам","видан","видао","видар","видас","видеа","видев","виден","видео","видеу","видех","видик","видим","видин","видио","видић","видиш","видна","видне","видни","видно","видну","видов","видом","видра","видре","видри","виђам","виђан","виђао","виђах","виђаш","виђен","виђео","вижла","вижље","визел","визин","визир","визит","визна","визне","визни","визом","вијак","вијан","вијао","вијек","вијем","вијеш","вијка","вијку","вијон","викао","викар","виках","викач","викић","викли","викне","викни","викну","виком","вилер","вилим","вилин","вилић","вилка","вилма","вилом","вимер","винар","винем","винер","винеш","винка","винко","винов","вином","винуо","винца","винце","винча","винче","винчи","винчу","вињак","виола","виоле","виолу","вираг","вираж","вирим","вирио","вириш","вирне","вирни","вирну","виром","вирус","висак","висим","висио","висих","виска","виске","виски","виско","висла","висле","висли","вислу","висок","висом","виста","висте","витак","витал","витао","витас","витез","витек","витин","витић","витих","витка","витке","витки","витко","витку","витла","витли","витло","витлу","витни","витог","витом","вићем","вићић","вихор","вицем","вицка","вицко","вичан","вичем","вичеш","вична","вичне","вични","вично","вичну","вишак","вишег","вишем","вишим","вишић","виших","вишка","вишку","вишну","вишња","вишње","вишњи","вишњу","вишој","вишом","вјека","влага","влаге","влагу","влада","владе","влади","владо","владу","влаже","влажи","влази","влаја","влаје","влаји","влају","влаке","влако","власа","власе","власи","власт","влати","влаћа","влаће","влаћо","влаха","влахе","влаху","влачи","влачо","вогон","водан","водао","водах","воден","водео","водик","водим","водио","водић","водих","водич","водиш","водку","водна","водне","водни","водно","водом","вођен","вођин","вођом","вожда","вожде","вожду","вожен","вожић","вожња","вожње","вожњи","вожњу","возај","возар","возац","возач","возим","возио","возиш","возна","возне","возни","возну","возом","воице","војак","војин","војић","војка","војке","војки","војко","војку","војна","војне","војни","војно","војну","војом","војуј","вокал","вокер","волан","волар","волас","волаш","волво","волга","волге","волги","волеј","волео","волим","волио","волић","волиш","волка","волку","волов","волок","волом","волпи","волта","волте","волти","волту","волфа","вољан","вољах","вољен","вољех","вољка","вољна","вољне","вољни","вољно","вољну","вољом","вонга","воњао","воњем","ворен","ворлд","восак","воска","воску","вотка","вотке","вотки","вотку","вотса","вотсу","воћар","воћем","воћка","воћке","воћки","воћко","воћку","воћна","воћне","воћни","воћно","воћну","воцем","врага","врагу","враже","враза","врази","врана","вране","врани","врану","врања","врање","врањи","врању","врата","врате","врати","врату","враћа","враће","враца","врача","враче","врачи","врачу","враше","врбак","врбан","врбас","врбик","врбов","врбом","врвео","врвио","врвић","врвца","вргањ","вргне","вргну","врдај","врдам","врдаш","врдне","врдну","вреба","врева","вреве","вреви","вреву","вреда","вреде","вреди","вреду","вређа","врежа","вреже","врежу","врела","вреле","врели","врело","врелу","време","врења","врење","врењу","врети","врећа","вреће","врећи","врећу","вречи","врзај","врзао","врзић","врзла","врзле","врзли","врзло","врзма","врила","врило","вркић","врлет","врлим","врлић","врлих","врлог","врлој","врлом","врљав","врљај","врљао","врнем","врнеш","врнуо","врњци","врпца","врпце","врпци","врпцу","врсна","врсне","врсни","врсно","врсну","врста","врсте","врсти","врсто","врсту","вртар","вртео","вртим","вртио","вртић","вртна","вртне","вртни","вртом","вруља","вруље","вруљи","врућа","вруће","врући","врућо","врућу","вручу","врхом","врцне","врчем","врчин","вршај","вршак","вршац","вршен","вршим","вршио","вршић","вршиш","вршка","вршке","вршку","вршља","вршне","вршни","вршца","вршцу","вуица","вујин","вујић","вујка","вујом","вукан","вукао","вукас","вукић","вукла","вукле","вукли","вукло","вуков","вуком","вукох","вулва","вулве","вулин","вулић","вунат","вунен","вуном","вунта","вућић","вућни","вучад","вучак","вучац","вучем","вучен","вучеш","вучић","вучја","вучје","вучји","вучју","вучка","вучко","вучку","вучна","вучни","вучом","габон","габор","габро","гаваз","гаван","гавин","гавре","гавро","гавру","гагић","гагом","гагро","гадан","гадим","гадио","гадиш","гадна","гадне","гадни","гадно","гадну","гадом","гађај","гађам","гађан","гађао","гађач","гађаш","гађић","гажен","газда","газде","газди","газдо","газду","газим","газио","газиш","газно","газом","гајар","гајба","гајбе","гајби","гајбу","гајда","гајде","гајди","гајев","гајем","гајим","гајин","гајио","гајић","гајиш","гајка","гајом","гакао","гакне","гакну","галеб","галин","галић","галич","галон","галоп","гамад","гамзе","ганац","ганди","ганем","ганић","ганка","ганут","гањам","гањан","гањао","гарав","гарау","гарбо","гарда","гарде","гарди","гардо","гарду","гарет","гарић","гаров","гаром","гаруш","гасет","гасим","гасио","гасиш","гасна","гасне","гасни","гасно","гасну","гасом","гатам","гатао","гатар","гаташ","гатић","гатка","гатке","гаћић","гауда","гауде","гаућо","гаучо","гафом","гацам","гацаш","гацка","гацко","гацку","гачац","гачић","гачко","гачци","гаџин","гаџић","гашен","гашић","гашом","гверо","гвидо","гвири","гдина","гђица","гђице","геард","геаци","гегај","геист","гејтс","гејша","гејше","гејши","гелер","гемац","гениј","генис","геном","генон","георг","гепек","герић","герке","геров","герок","гесла","гесло","геслу","геста","гесте","гести","гесту","гетеа","гетеу","гецом","геџав","гибак","гибањ","гибар","гибон","гигаш","гигић","гигов","гидра","гијом","гикић","гилан","гилда","гилде","гилди","гилду","гилић","гиљам","гиљен","гимар","гинем","гинеш","гинис","гинић","гинта","гинуо","гипка","гипке","гипки","гипко","гипку","гипса","гипсу","гирић","гирлс","гитар","гитер","гихта","гишка","глава","главе","глави","главо","главу","глада","гладе","глади","глађе","глађу","гланц","гласа","гласе","гласи","гласу","глаца","глача","гледа","гледе","гледи","глеђи","глени","глиба","глибе","глибу","глина","глине","глини","глину","глиша","глише","глоба","глобе","глобу","глога","глође","глођу","гложе","гложи","глоса","глосе","глоси","глоуб","глува","глуве","глуви","глуво","глуву","глума","глуме","глуми","глуму","глупа","глупе","глупи","глупо","глупу","глуха","глухе","глухи","глухо","глуху","гљива","гљиве","гљиву","гмаза","гмиже","гмижу","гмизе","гнева","гневе","гневи","гневу","гноја","гноји","гноју","гнома","гноме","гноми","гному","гносе","гнуса","гнуша","гњаве","гњави","гњева","гњеве","гњеви","гњеву","гњече","гњечи","гњида","гњиде","гњидо","гњиду","гњила","гњиле","гњили","гњило","гњилу","гњура","гоати","говна","говно","говну","говор","гоген","гогић","гогов","гогољ","годар","годио","годне","годоа","годој","гозба","гозбе","гозби","гозбу","гоинг","гојан","гојим","гојин","гојиш","гојка","гојко","гојку","гојна","гојне","гојну","гојом","голаћ","голем","голен","голет","голеш","голик","голим","голић","голих","голиш","голоб","голог","голој","голом","голуб","голфа","голфу","гомбу","гомез","гомес","гонга","гоним","гонио","гоних","гонич","гониш","гоњен","горак","горан","горах","горда","горде","горди","гордо","горду","горег","горем","горео","горжи","горим","горио","горих","гориш","горја","горје","горка","горке","горки","горко","горку","горња","горње","горњи","горњу","горов","горој","гором","горча","горче","горчи","горчу","госин","госић","госпа","госпе","госпи","госпо","госпу","госта","госте","гости","госту","готје","готов","гоцић","гоцом","гошић","гошом","гошћа","гошће","гошћи","гошћу","граба","грабе","граби","грабу","града","граде","гради","граду","грађа","грађе","грађи","грађу","граја","граје","граји","грају","грала","грама","граме","грами","граму","грана","гранд","гране","грани","грано","грант","грану","грања","грање","грању","граса","граси","грата","графа","графо","графу","граха","граху","граца","граце","граци","грацу","грачу","грашо","грбав","грбаљ","грбин","грбио","грбић","грбља","грбљу","грбом","гргеч","гргин","гргић","гргољ","гргом","гргур","грдан","грдим","грдио","грдиш","грдна","грдне","грдни","грдно","грдну","грдња","грдње","грдњи","грдњу","грђић","гребе","гребу","грега","грегр","греда","греде","греди","греду","греја","греје","грејс","грејт","греју","грека","греко","грент","греси","грета","грете","грети","грету","греха","грехе","греху","греше","греши","грива","гриве","гриви","гриву","грижа","гриже","грижи","грижу","гриза","гризе","гризи","гризу","грије","грила","гриле","грима","грина","гриња","гриње","грињи","грипа","грипу","грифа","грифе","гркој","грком","грлат","грлен","грлим","грлио","грлић","грлих","грлиш","грлом","грљах","грмаљ","грмен","грмео","грмеч","грмио","грмља","грмље","грмљу","грмне","грмну","грмом","грнце","гроба","гробе","гробу","гроза","грозд","грозе","грози","грозу","грола","грома","громе","грому","гропа","гропе","гроса","гросо","гросу","гроуп","грофа","грофе","грофу","гроша","гроше","грћев","грћић","груба","грубе","груби","грубо","грубу","грува","груда","груде","груди","грудо","груду","гружа","груже","гружи","гружу","груић","груја","грује","грујо","грују","грунд","груне","груни","грунт","груну","група","групе","групи","групо","групу","груша","грцам","грцао","грчак","грчев","грчем","грчим","грчио","грчић","грчих","грчка","грчке","грчки","грчко","грчку","гспрс","губав","губар","губер","губим","губио","губиш","губом","гувна","гувно","гувну","гугла","гугут","гудац","гудељ","гудио","гудиш","гудке","гужва","гужве","гужви","гужву","гујин","гујом","гукне","гукни","гукну","гулаг","гулан","гулаш","гулер","гулио","гумен","гумна","гумно","гумну","гумом","гунар","гунђа","гуноа","гуњац","гуњем","гуњић","гуњца","гуњцу","гупца","гурав","гурај","гурам","гуран","гурао","гурач","гураш","гурио","гуриш","гурка","гурне","гурни","гурну","гуруа","гуруи","гусак","гусан","гусар","гусев","гуска","гуске","гуски","гуско","гуску","гусла","гусле","гусне","густа","густе","густи","густо","густу","гутај","гутаљ","гутам","гутао","гутач","гуташ","гутић","гуцић","гуцне","гучеш","гучић","гушав","гушим","гушио","гушиш","гушћа","гушће","гушћи","гушћу","гушче","дабар","дабић","дабог","дабра","дабро","дабру","даван","давао","давах","давач","давеж","давид","давим","давио","давис","давић","давиш","давна","давне","давни","давно","давну","давор","давос","давши","дагња","дагње","дагњи","дадем","дадеш","дадић","дадне","дадни","дадну","дадов","дадох","даеву","дажда","дажди","дажду","даире","даиџа","даиџи","дајан","дајем","дајеш","дајић","дајмо","дајса","дајте","дакао","дакар","дакић","дакле","далај","далас","далек","дален","далић","даљег","даљем","даљим","даљих","даљна","даљне","даљни","даљња","даљње","даљњи","даљњу","даљој","даљом","дамар","дамин","дамир","дамом","данак","данас","данац","данга","данди","данев","данем","данеу","данил","даним","данин","данис","данић","даних","данка","данке","данко","данку","даног","даној","даном","данон","дансе","данте","данћо","данца","данце","данци","данче","данчо","дањем","дањом","дариа","дарио","дарја","дарју","дарка","дарке","дарко","дарку","дарне","дарну","даром","дарси","даруј","даска","даске","даску","дасмо","дасте","дасци","датив","датим","датих","датог","датој","датом","датум","даћеш","даћић","даута","даути","дауту","дафне","дахау","дахне","дахну","дахом","дахће","дахћу","дацин","дацић","дачин","дачић","дашак","дашић","дашка","дашом","двајт","двају","двама","двеју","двема","двери","двије","двију","двога","двоја","двоје","двоји","двома","двоме","двора","дворе","двори","двору","деака","дебар","дебео","дебил","дебла","дебло","деблу","дебља","дебље","дебљи","дебљу","дебос","дебра","дебру","дебут","девам","девер","девет","девид","девин","девис","девит","девић","девиц","девич","девом","дегли","дегод","дедак","дедар","дедер","дедин","дедић","дедом","дезен","дејак","дејан","дејић","дејка","дејли","декан","декар","декић","деком","декор","делај","делам","делао","делах","делаш","делез","делеи","делим","делио","делић","делиш","делка","делов","делом","делта","делте","делти","делту","делуг","делуј","делфа","делфи","делхи","делце","дељан","дељаш","дељен","дељив","дељом","демај","дембо","демир","демић","демон","демос","денда","денди","денев","денем","денеш","дениз","деним","денис","денић","денса","дента","дењак","деоба","деобе","деоби","деобу","деона","деони","депоа","дЕПОС","депоу","депце","деран","дерао","дерач","дерби","дерек","дерем","дереш","дерик","дерил","дерић","дерле","дерне","дерта","дерте","десар","десен","десет","десим","десио","десић","деска","деске","дески","деску","десна","десне","десни","десно","десну","десом","дести","детаљ","детао","детеа","детић","детом","деума","дефом","децил","децом","дечак","дечја","дечје","дечји","дечју","дечка","дечко","дечку","дешић","диана","дибоа","диваљ","диван","дивац","дивим","дивио","дивит","дивић","дивич","дивиш","дивка","дивља","дивље","дивљи","дивљу","дивна","дивне","дивни","дивно","дивну","дивов","дивом","дивош","дивца","дивци","дивцу","дивче","дигао","дигит","дигла","дигле","дигли","дигло","дигне","дигни","дигну","дигох","дидом","дидро","дижем","дижеш","дизао","дизач","дизел","дизни","дијаз","дијак","дијас","дикан","дикић","дикле","диком","дилан","дилер","диљем","диљка","диљке","диљку","димак","димио","димић","димка","димна","димне","димни","димну","димов","димом","динар","динга","динго","динић","динка","динке","динко","динку","дином","диоба","диобе","диоби","диобу","диони","дипле","дипли","дипон","дипос","дирај","дирак","дирам","диран","дирао","дирас","дираш","дирек","дирка","дирке","дирки","дирку","дирне","дирну","дисао","диска","диске","диско","диску","дитер","дићић","дичан","дичим","дичио","дичић","дичиш","дична","дичне","дични","дично","дичну","дишан","дишем","дишеш","дишић","дишни","длака","длаке","длаку","длана","длану","длаци","длета","длето","добар","добеш","добио","добит","добих","добој","добом","добош","добра","добре","добри","добро","добру","довде","довек","довео","довер","довод","довоз","доган","догма","догме","догми","догму","догна","догод","додај","додам","додан","додао","додат","додах","додаш","додер","додиг","додик","додир","додић","дођем","дођеш","дођох","дођош","дожин","дожић","дозва","дозет","дозна","дозом","доима","дојам","дојен","дојка","дојке","дојки","дојку","дојма","дојми","дојму","дојци","дојче","докад","доказ","докић","докле","докон","долаз","долап","долар","долац","долио","долић","долма","долму","долом","долће","долце","долцу","долче","домак","домар","домац","домен","домет","домис","домом","домца","домци","донау","донде","дондо","донев","донел","донео","донет","донех","донин","донио","донка","донки","доном","доњак","доњег","доњем","доњим","доњих","доњој","доњом","допао","допис","допре","допри","допро","допру","допуђ","дорат","дорес","дорин","дорис","дорић","дором","досад","досег","досје","досон","доспе","доста","досте","дости","досту","дотад","дотле","доток","дотур","доћао","доћло","доуше","доход","доцна","доцне","доцни","доцње","доцњи","дочек","дочим","дочуо","дошав","дошао","дошен","дошић","дошла","дошле","дошли","дошло","дпмне","драва","драве","драви","драво","драву","драга","драге","драги","драго","драгу","дража","драже","дражи","дражо","дражу","драјв","драли","драма","драме","драми","драму","дранг","драња","драње","дрању","драти","драча","драче","драчи","драчу","дрвар","дрвен","дрвља","дрвље","дрвна","дрвне","дрвни","дрвно","дрвну","дрвца","дрвце","дреам","дрека","дреке","дреку","дрема","дрена","дрену","дреса","дресу","дреци","дрече","дречи","дреше","дреши","држак","држан","држао","држах","држач","држим","држић","држиш","дрзак","дрзне","дрзну","дриве","дрила","дрина","дрине","дрини","дрино","дрину","дркаш","дрљав","дрман","дрмао","дрмне","дрмни","дрмно","дрмну","дрнда","дрнде","дрнди","дрнду","дроба","дробе","дроби","дрога","дроге","дроги","дрогу","дрозд","дроља","дроље","дрољо","дроња","дроње","дроњи","дроту","дроца","дроци","дрпај","дрска","дрске","дрски","дрско","дрску","друга","друге","други","друго","другу","друже","дружи","друза","друзи","друид","друма","друме","друму","дрхте","дрхти","дрхће","дрхћу","дрчни","дрчно","дршка","дршке","дршки","дршку","дршће","дршћу","дршци","дуала","дубаи","дубак","дубац","дубач","дубем","дубио","дубиш","дубла","дубли","дублу","дубља","дубље","дубљи","дубљу","дубок","дубом","дувај","дувак","дувам","дуван","дувао","дувар","дувач","дуваш","дувно","дугим","дугић","дугих","дугме","дугог","дугој","дугом","дудан","дудаш","дудић","дудом","дудук","дуела","дуеле","дуели","дуелу","дуета","дуете","дуети","дуету","дужан","дужда","дужде","дужду","дужег","дужем","дужен","дужим","дужио","дужић","дужих","дужна","дужне","дужни","дужно","дужну","дужој","дужом","дујић","дукаи","дукат","дукин","дукић","дукља","дукље","дукљу","дуком","дулек","дулић","дуљај","дуљим","думић","дунав","дунда","дунем","дунеш","дунум","дунуо","дуњић","дуњом","дупин","дупке","дупла","дупле","дупли","дупло","дуплу","дупља","дупље","дупљи","дупљу","дурам","дуран","дурао","дурим","дурио","дурић","дуриш","дућан","дућић","духан","духне","духни","духну","духом","дуцић","дучић","душак","душан","душах","душек","душен","душик","душин","душка","душке","душки","душко","душку","душом","ђајић","ђакић","ђаком","ђакон","ђалић","ђапић","ђаура","ђауре","ђаури","ђауру","ђачић","ђачка","ђачке","ђачки","ђачко","ђачку","ђевер","ђевић","ђекић","ђелић","ђемом","ђенић","ђерам","ђерђа","ђерђе","ђерђу","ђерић","ђерма","ђерме","ђетић","ђефан","ђешто","ђидић","ђијан","ђикић","ђилас","ђилда","ђинан","ђипио","ђипих","ђипиш","ђоана","ђогат","ђогаш","ђогин","ђогом","ђокај","ђокић","ђоком","ђоном","ђорда","ђорде","ђорду","ђорђа","ђорђе","ђорђи","ђорђо","ђорђу","ђорић","ђубре","ђубри","ђувеч","ђувод","ђуђић","ђујић","ђукан","ђукин","ђукић","ђуком","ђулад","ђулио","ђулић","ђулом","ђумић","ђунић","ђурађ","ђуран","ђурђа","ђурђе","ђурђу","ђурин","ђурић","ђурка","ђуров","ђуром","ђусић","ђуска","ебарт","еберт","еболи","еванс","евита","евица","евице","евицу","евнух","евром","егеју","егерт","егзил","егзит","егића","егона","егону","едвин","едгар","едема","едеми","едему","едена","едену","едија","едију","едикт","едина","едине","едини","едино","едипа","едипу","едита","едите","едити","едуар","едхем","ежена","езопа","езопе","ејдса","ејдус","ејлин","ејупи","екарт","екерт","екија","екипа","екипе","екипи","екипу","еклак","екран","екрем","ексер","ексим","ексон","експо","екцем","елана","елани","елвир","елвис","елеза","елезу","елејн","елена","елене","елени","елену","елзом","елиде","елизе","елија","елиот","елиса","елисе","елисо","елита","елите","елити","елиту","елица","елмаг","елмаз","елмар","елтон","емајл","емила","емили","емило","емилу","емина","емини","емину","емира","емиру","емица","емице","емицу","енвер","енгсо","ендре","ендру","енеја","енеса","енесу","ензим","еноха","еноху","енрон","ентер","еолов","епика","епике","епику","епира","епиру","епици","епова","епове","епови","епоса","епосе","епоси","епосу","епоха","епохе","епохи","епоху","епска","епске","епски","епско","епску","епсон","ерара","ербас","ервас","ервин","ерера","ерзац","ерика","ерике","ерику","ерића","ерићу","ериха","ернст","ерола","ероса","еросу","ерска","ерски","ерско","ерсом","ерцег","ерчић","есада","есапе","есеја","есеје","есеји","есеју","еснаф","еспап","еспен","естен","естер","есхил","етажа","етаже","етапа","етапе","етапи","етапу","етара","етвуд","етера","етеру","етида","етиде","етиди","етиду","етика","етике","етико","етику","етири","етици","етјен","етник","етном","етнос","еторе","етоса","етосе","етосу","ећима","еуген","еунет","ефект","ефеса","ефесу","ехуда","ешкер","жабар","жабац","жабља","жабље","жабљи","жабљу","жабом","жагор","жакар","жакет","жаком","жалац","жалба","жалбе","жалби","жалбу","жалим","жалио","жалиш","жалом","жалца","жалце","жалци","жамор","жанеа","жанин","жанка","жанке","жанки","жанко","жанку","жаном","жанра","жанру","жањем","жаока","жаоке","жаоку","жапца","жарач","жарио","жарић","жарка","жарке","жарки","жарко","жарку","жаром","жацну","жбира","жбири","жбица","жбицу","жбука","жбуке","жбуна","жбуне","жбуну","жбуња","жбуње","жбуњу","жвака","жваке","жваку","жвала","жвале","жвалу","жваће","жваћу","жврља","ждера","ждере","ждери","ждеру","ждрал","ждрао","жегао","жегли","жегло","жегом","жедан","жеден","жедна","жедне","жедни","жедно","жедну","жеђао","жежељ","жежен","жезал","жезла","жезло","жезлу","жекић","желеа","желев","желео","желеу","желех","желим","желио","желиш","желуд","жељан","жељах","жељен","жељка","жељке","жељко","жељку","жељна","жељне","жељни","жељно","жељну","жељом","женеа","женик","женим","женин","женио","жених","жениш","женка","женке","женки","женку","женом","женче","жењен","жепић","жепич","жерар","жеста","жести","жесто","жетва","жетве","жетви","жетву","жетон","жешћа","жешће","жешћи","жешћу","жибао","живад","живаљ","живан","живац","живео","живех","живим","живин","живио","живић","живих","живиш","живка","живке","живки","живко","живку","живља","живље","живљи","живљу","живне","живни","живну","живог","живој","живом","живот","живце","живци","жигић","жигну","жигом","жигон","жидак","жидић","жидов","жижак","жижић","жикин","жикић","жиком","жилав","жилет","жилић","жилом","жиока","жипеа","жирар","жиром","житак","житар","житељ","житка","житке","житки","житко","житку","житна","житне","житни","житно","житом","жицне","жицом","жичан","жичка","жичке","жички","жичку","жична","жичне","жични","жично","жишић","жишка","жишке","жишки","жишку","жлеба","жлица","жлице","жлицу","жмире","жмири","жмура","жмуре","жмури","жњела","жњели","жњело","жњети","жњеће","жозеа","жозеф","жорда","жоржа","жорис","жохар","жрвањ","жрвња","жрвње","жрвњи","жрвњу","жреба","жребу","жреца","жреце","жреци","жртва","жртве","жртви","жртво","жртву","жуана","жубор","жугић","жудан","жудео","жудим","жудио","жудиш","жудна","жудне","жудни","жудно","жудња","жудње","жудњи","жудњо","жудњу","жужић","жуков","жуљим","жунђи","жунић","жуњић","жупан","жупна","жупне","жупни","жупно","жупом","журав","журан","журба","журбе","журби","журбу","журим","журио","журић","журиш","журка","журке","журки","журку","журне","журни","журно","журци","жутео","жутим","жутић","жутих","жутог","жутој","жутом","жућко","жућни","жучан","жучна","жучне","жучни","жучно","жучну","забат","забел","забиј","забио","забит","завеј","завео","завет","завиј","завио","завод","завој","заври","задај","задам","задан","задао","задар","задат","задах","задаш","задња","задње","задњи","задњу","задра","задре","задро","задрт","задру","зађем","зађеш","зађох","зажди","зазва","зазор","заиђу","заима","заиму","заира","заиру","заићи","зајам","зајас","зајац","зајди","зајић","зајма","зајме","зајми","зајму","закић","закла","закле","закон","закоч","закуп","залаз","залет","залив","залиј","залио","залић","залог","залуд","замак","заман","замах","замео","замка","замке","замки","замку","замор","замре","замро","замру","замци","занат","занео","занер","занет","занос","заова","заове","заови","заову","заори","заору","запад","запао","запат","запах","запео","запет","запио","запис","запне","запну","запој","запор","запре","запри","запро","запту","зарад","заран","зарђа","зарев","зарез","зарже","зарза","зарио","зарић","заром","заруб","засад","засек","засео","засја","заспа","заспе","заспи","заспу","засра","заста","засун","засуо","засут","засух","затим","затон","затре","затро","затрт","затру","зауер","заузе","зафир","захар","захир","захов","заход","зачас","зачео","зачет","зачех","зачин","зачне","зачну","зачуо","зачух","зашао","зашиј","зашио","зашла","зашле","зашли","зашло","зашта","зашто","збаце","збаци","збега","збегу","збере","зберу","збива","збија","збије","збију","збила","збиле","збили","збило","збиља","збиље","збиљи","збиљу","збира","збиру","збити","збиће","збише","збјег","збора","зборе","збори","збору","збрза","збрка","збрке","збрку","зброј","збрци","збуне","збуни","звала","звале","звали","звало","звана","зване","звани","звано","звану","звања","звање","звању","звати","зваће","зваћу","зваху","зваше","звека","звеку","звера","звере","звери","зверу","звеци","звече","звечи","звижд","звона","звоне","звони","звоно","звону","звоца","зврје","зврји","зврки","зврку","зврче","зврчи","звука","звуке","звуку","звуци","звуче","звучи","згаде","згади","згазе","згази","зглоб","згода","згоде","згоди","згоду","згрне","згрну","згрће","згрћу","згрче","згрчи","згура","згуре","згури","здања","здање","здању","здела","зделе","здели","зделу","здера","здере","здеру","здими","здипе","здипи","здола","здрав","зебао","зебем","зебец","зебић","зебла","зебња","зебње","зебњи","зебњу","зебра","зебре","зебри","зебру","зевај","зевао","зеваш","зевне","зевну","зевса","зезај","зезам","зезао","зезаш","зезне","зезну","зејак","зејна","зекан","зекић","зелен","зелић","зељем","зељов","земан","земља","земље","земљи","земљо","земљу","земна","земне","земни","земно","земну","земун","зенга","зенит","зетом","зећир","зефир","зехра","зецом","зечић","зечја","зечје","зечји","зивка","зивот","зигел","зидај","зидам","зидан","зидао","зидар","зидах","зидаш","зидић","зидна","зидне","зидни","зидно","зидну","зидом","зијад","зијах","зијаш","зијев","зијом","зимио","зимње","зимњи","зимом","зимус","зинем","зинеш","зинка","зинуо","зинух","зипка","зирић","зирка","зицер","зјала","зјапе","зјапи","зјати","зјело","зјене","злаја","злата","злате","злати","злато","злату","злима","злица","злоба","злобе","злоби","злобу","злога","зломе","злота","злоту","злоћа","злоће","злоћи","злоћо","злоћу","змаја","змаје","змају","змија","змије","змији","змијо","змију","знаде","знади","знаду","знају","знака","знаке","знаку","знала","знале","знали","знало","знамо","знана","знане","знани","знано","знану","знања","знање","знању","зната","знате","знати","знато","знаће","знаћи","знаћу","знаци","значе","значи","знаше","зноја","зноје","зноји","зноју","зовем","зовеш","зовин","зовне","зовни","зовну","зовом","зојић","золак","золић","зољом","зомби","зонић","зоном","зоран","зорин","зорић","зорка","зорке","зорки","зорко","зорку","зорна","зором","зотов","зрака","зраке","зраку","зраци","зраче","зрачи","зрела","зреле","зрели","зрело","зрелу","зрења","зрење","зрети","зрика","зрике","зрику","зрнић","зрном","зрнца","зрнце","зубак","зубар","зубат","зубац","зубин","зубић","зубља","зубље","зубљу","зубна","зубне","зубни","зубно","зубну","зубом","зувић","зујао","зујем","зујно","зукић","зуком","зулум","зумба","зумом","зупца","зупце","зупци","зупча","зупче","зураб","зурим","зурио","зуриш","зурла","зурле","зухра","зуцка","зуцне","ибера","иберу","ибзен","ибија","ибиша","ибиши","ибрик","ибром","ивана","иване","ивани","ивану","ивање","ивеко","ивера","ивери","иверу","ивића","ивићу","ивица","ивице","ивици","ивицу","ивиче","ивичи","ивков","ивком","ивона","ивоне","иврит","ившић","игала","игало","игалу","игара","игића","игићу","игиша","иглом","игнац","игњат","игњић","игора","игоре","игору","играј","играм","игран","играо","играх","играч","играш","игром","идвор","идеал","идеас","идеја","идеје","идеји","идеју","идемо","идење","идењу","идете","идила","идиле","идили","идилу","идимо","идиом","идиот","идите","идола","идоле","идоли","идолу","идоше","идриз","идућа","идуће","идући","идућу","идучи","иђаху","иђаше","иђоша","иђошу","ижене","иживе","иживи","ижица","изађе","изађи","изађу","изасу","изаћи","избио","избих","избор","изван","извео","извиј","извин","извио","извод","извоз","извол","извор","изгна","изгон","издај","издам","издан","издао","издат","издах","издаш","издра","изета","изети","изида","изиђе","изиђи","изиђу","изиће","изићи","изјео","излаз","излет","излив","излиј","излио","излих","излог","изљев","измеђ","измео","измет","измом","изнад","изнео","изнет","изнех","изнио","износ","изора","изоре","изору","израз","изрез","изрод","изува","изузе","изује","изула","изума","изуме","изуми","изуму","изути","изуче","изучи","икада","икаке","икако","икара","икаст","икеда","икића","икога","икоје","икоји","икоме","икона","иконе","икони","иконо","икону","икраш","икром","иктус","икуда","илиев","илија","илије","илији","илијо","илију","илина","илира","илире","илири","илити","илића","илићи","илићу","илича","илиџа","илиџе","илиџи","илиџу","илкић","илком","илона","имаге","имаде","имаду","имају","имала","имале","имали","имало","ималу","имама","имаме","имами","имамо","имана","имане","имања","имање","имању","имате","имати","имаће","имаћу","имаху","имаше","имеђу","имела","имеле","имели","имена","имену","имера","имере","имери","имеру","имиџа","имиџу","имлек","импаз","имреа","имуна","имуне","имуни","имуно","ината","инате","инати","инату","инаће","инаце","иначе","индра","индус","инђић","инекс","инића","инићу","иноче","инсан","инстр","интел","интер","интов","интра","инцел","ирака","ираку","ирана","ирану","ираца","ирвас","ирвин","ирена","ирене","ирени","ирену","ирига","иригу","ирина","ирине","ирини","ирину","ириса","ирода","ирска","ирске","ирски","ирску","ирфан","исака","исаку","исапс","исеку","иселе","исели","исећи","исеца","исеци","исече","исише","исказ","искам","искао","исках","искон","ископ","искра","искре","искри","искру","искуп","ислам","исљам","исмет","испад","испао","испео","испиј","испио","испис","испит","испих","испне","испну","испод","испра","истек","истер","истим","истих","истог","истој","исток","истом","истон","истра","истре","истри","истру","иступ","исука","исуса","исусе","исусу","исуфу","исуче","исуше","исуши","исход","итака","итаке","итаку","итало","ифора","ичега","ичему","ичије","ичији","ишара","ишета","иштем","иштеш","јаван","јавим","јавио","јавих","јавиш","јавка","јавља","јавна","јавне","јавни","јавно","јавну","јавом","јавор","јагић","јагма","јагме","јагми","јагму","јагње","јагош","јадан","јадао","јадар","јадац","јадна","јадне","јадни","јадно","јадну","јадом","јадра","јадру","јазак","јазас","јазом","јаића","јајић","јајне","јајну","јајца","јајце","јајцу","јаким","јакин","јакић","јаких","јакна","јакне","јакни","јакну","јакоб","јаков","јаког","јакој","јаком","јакуп","јакша","јакше","јакши","јакшу","јална","јалне","јални","јално","јалну","јалов","јалти","јамац","јамба","јамбу","јамес","јамом","јамца","јамце","јамче","јамчи","јанга","јанев","јанез","јанек","јанеш","јанис","јанић","јанка","јанке","јанко","јанку","јаном","јанос","јанош","јануш","јанча","јанчи","јанчо","јанчу","јанша","јанше","јаншу","јањин","јањић","јањом","јањци","јапан","јарад","јараи","јарак","јарам","јаран","јарац","јарда","јарде","јарди","јарим","јарић","јарих","јарка","јарке","јарки","јарко","јарку","јарма","јарму","јаром","јарца","јарци","јарцу","јарче","јасан","јасен","јасер","јасин","јасле","јасли","јасна","јасне","јасни","јасно","јасну","јатак","јатић","јатом","јаћих","јаука","јауке","јауку","јауци","јауче","јаучи","јаучу","јахао","јахач","јахве","јахић","јахта","јахте","јахти","јахту","јацем","јацић","јачај","јачао","јачаш","јачег","јачек","јачем","јачим","јачих","јачој","јачом","јаџић","јашар","јашем","јашеш","јашин","јашио","јашом","јашта","јебао","јебач","јебем","јебеш","јевић","јевта","јевто","јевту","јегер","јегор","једак","један","једар","једва","једек","једем","једеш","једим","једин","једио","једић","једиш","једна","једне","једни","једно","једну","једом","једох","једра","једре","једри","једро","једру","јежим","јежио","јежње","јежом","језда","језде","језди","језив","језик","језом","јејтс","јекић","јекне","јекну","јеком","јекће","јелек","јелен","јелин","јелић","јелка","јелке","јелки","јелко","јелку","јелом","јелте","јелци","јемац","јемен","јемца","јемце","јемци","јемцу","јемче","јемчи","јенки","јенко","јербо","јерга","јереј","јерен","јерес","јерка","јерко","јерме","јесам","јесен","јесмо","јесте","јести","јетка","јетке","јетки","јетко","јетку","јетра","јетре","јетри","јетро","јетру","јефта","јефте","јефто","јецав","јецај","јецам","јецао","јецаш","јечам","јечао","јечиш","јечма","јечму","јешан","јешић","јешће","јешћу","јешче","јидиш","јирен","јиржи","јоана","јован","јовин","јовић","јовов","јовом","јогом","јодна","јодне","јодом","јожеф","јозеф","јозић","јозом","јоинт","јојић","јојоа","јојоу","јокин","јокић","јокич","јоком","јонас","јонаш","јонел","јонић","јонке","јоном","јонуз","јоран","јорга","јорго","јосеф","јосип","јосић","јосиф","јосом","јотић","јохан","јоцић","јоцом","јочић","јошић","јошка","јошке","јошко","јоште","јуана","југов","југом","јуден","јудео","јудин","јудит","јужан","јужна","јужне","јужни","јужно","јужну","јузеф","јукић","јуком","јукоп","јулес","јулиа","јулин","јулка","јулке","јулки","јулку","јулом","јумка","јумко","јумку","јунад","јунак","јунан","јунац","јунга","јунге","јунгу","јунит","јуном","јунуз","јунца","јурај","јуриј","јурим","јурио","јурис","јурић","јуриш","јурне","јурну","јурца","јусуф","јутом","јутра","јутро","јутру","јуфка","јуфке","јуфки","јуфку","јухас","јухом","јухор","јухуа","јучер","кабај","кабал","кабао","кабел","кабић","кабла","каблу","кабот","кабул","кавад","каван","кавга","кавге","кавги","кавгу","кавез","кавен","кавзи","кавић","кавом","кадар","кадет","кадим","кадио","кадир","кадић","кадиш","кадли","кадно","кадом","кадош","кадра","кадре","кадри","кадро","кадру","кажем","кажеш","кажић","казав","казал","казан","казао","казах","казић","казна","казне","казни","казно","казну","казуј","каида","каиде","каина","каину","каира","каиро","каиру","каиша","каише","каиши","каишу","кајак","кајао","кајас","кајем","кајеш","кајин","кајић","кајле","кајли","кајте","какав","какао","каква","какве","какви","какво","какву","каким","каков","каком","калај","калам","калас","калеа","калем","калер","калиј","калио","калић","калиф","калиш","калка","калом","калоу","калуп","калфа","калфе","калфи","калфо","калфу","калча","каљав","каљао","каљен","камаз","камен","камер","камил","камин","камиш","камом","кампа","кампе","кампо","кампу","канал","канап","канда","каним","канио","каниц","каниш","канов","каное","каном","канон","канта","канте","канти","канту","кануа","кануе","канџа","канџе","канџи","канџу","кањон","каона","каоне","каони","капак","капао","капар","капић","капју","капка","капке","капку","капља","капље","капљи","капљо","капљу","капои","капом","капон","капор","капра","капре","капри","капси","капут","капци","карај","карам","каран","карао","карат","караш","карго","кареа","карев","карел","карен","карим","карин","карић","карла","карле","карли","карло","карлу","карма","карме","карми","карне","карни","карол","карољ","каром","карст","карта","карте","карти","карту","касан","касап","касар","касас","касач","касаш","касел","касер","касим","касир","касић","касја","каска","каско","касна","касне","касни","касно","касну","касом","касон","каста","касте","касти","касум","катар","катић","катја","катом","катун","каћић","каћун","кауен","кауза","каули","каура","кауре","каури","кауру","кауча","каучу","кафеа","кафеи","кафен","кафеу","кафић","кафка","кафке","кафки","кафку","кафом","кахал","кацав","кацин","качар","качер","качио","качић","кашаљ","кашаш","кашић","кашља","кашље","кашљу","кашом","кашто","квази","квака","кваке","кваку","квант","квара","кваре","квари","кварк","кварт","квару","кварц","кваса","квасе","кваси","кваци","квету","квиза","квизу","квинс","квона","квота","квоте","квоти","квоту","квоца","квоче","кврга","кврге","кврца","кебот","кевин","кевом","кевће","кевћу","кегла","кегле","кегни","кедар","кедра","кезио","кезиш","кејзи","кејна","кејну","кејом","кејси","кејто","кејтс","кејџа","кекеш","кекић","кекса","кексе","кекси","кексу","келер","келна","келну","келта","келти","кемал","кемиш","кемпф","кенди","кенет","кениг","кенон","кента","кенту","кењај","кењам","кењац","кењаш","кењка","кењци","кепец","кепић","кепшо","керим","керић","керна","керол","кером","кесар","кесер","кесио","кесић","кесом","кесон","кефир","кецић","кечап","кечић","кешко","кешом","кибиц","кибле","кибли","киблу","киван","кивна","кивне","кивни","кивно","киган","кидај","кидам","кидао","кидаш","кизић","кијак","кијац","кијев","кијук","кикић","киком","кикот","кикош","кикса","килав","кимое","кимом","кинга","кингс","кинез","кинеш","кинин","кинка","кинок","кином","кинте","кинти","кинту","кињен","кињим","кињио","киоск","кипар","кипео","кипер","кипом","кипра","кипру","кипте","кипти","кипур","кирил","кирин","кирић","кирка","киров","киром","кирха","кисео","кисик","кисић","кисне","кисну","кисте","кисту","китим","китио","китић","китке","китом","кићен","кићом","кифла","кифле","кифли","кифлу","кифом","кихне","кихну","кихот","кицош","кичем","кичић","кичма","кичме","кичми","кичму","кишан","кишна","кишне","кишни","кишно","кишну","кишов","кишом","кјодо","кјота","кјото","кјоту","кјуба","клада","кладе","клади","кладу","клаић","клајв","клајд","клајн","клака","клала","клале","клали","клало","клана","клане","клани","клану","клања","клање","клању","клапа","клапе","клапу","клара","кларе","клари","кларк","кларо","клару","класа","класе","класи","класу","клате","клати","клаун","клаус","клаху","клаше","клека","клеке","клеку","клела","клели","клело","клена","клене","клену","клепа","клера","клерк","клеру","клета","клете","клети","клето","клету","клеут","клеца","клече","клечи","клеше","клешу","клиза","клизе","клизи","клија","клије","клика","клике","клики","клико","клику","клима","климе","клими","климт","климу","клина","клине","клини","клинт","клину","клинч","клиња","клипа","клипу","клира","клиса","клифа","клифу","клица","клице","клици","клицу","кличе","кличи","кличу","клише","кловн","клода","клоду","клона","клоне","клони","клону","клоња","клопа","клопе","клопи","клопу","клора","клота","клоуз","клуба","клубе","клубу","клужа","клуни","клупа","клупе","клупи","клупу","кљаст","кљова","кљове","кљову","кљују","кљука","кљуна","кљуне","кљуну","кљуса","кљусе","кљуца","кључа","кључе","кључу","кмека","кмера","кмета","кмете","кмету","кмече","кнеже","кнеза","кнезу","кникс","книна","книну","кнића","книћу","кнута","књава","књаже","књаза","књазу","књига","књиге","књиго","књигу","књиже","књижи","књизи","коала","коања","кобал","кобан","кобас","кобац","кобна","кобне","кобни","кобно","кобну","кобом","кобра","кобре","кован","ковао","ковач","ковен","ковин","ковић","ковиц","ковне","ковом","ковче","коган","коген","когод","кодак","кодаљ","кодар","кодин","кодић","кодна","кодне","кодни","кодно","кодну","кодом","кодра","коеља","коељо","коему","коена","коену","кожар","кожин","кожна","кожне","кожни","кожно","кожну","кожом","кожуљ","кожух","козак","козар","козби","козер","козић","козја","козје","козји","козју","козле","козма","козме","козом","козош","коине","коисе","којег","којем","којен","којим","којић","којих","којој","којом","којот","кокан","кокао","кокаш","кокер","кокин","кокир","кокић","коком","кокос","кокот","кокош","кокса","кокус","колаж","колак","колан","колао","колар","колац","колач","колаш","колби","колев","колен","колер","колет","колеџ","колик","колин","колић","колке","колко","колку","колни","колов","колом","колон","колор","колос","колут","колца","колце","кољач","кољем","кољеш","комад","комар","комби","комбс","комин","комом","конак","конан","конат","конац","конга","конго","конгу","конђа","конђу","конел","конер","конов","коном","коноп","конор","конта","конте","конти","конто","конту","конус","конца","конце","конци","концу","конча","конче","кончи","коњак","коњар","коњем","коњић","коњиц","коњух","коњче","копај","копам","копан","копао","копар","копас","копат","копах","копач","копаш","копер","копка","копли","копља","копље","копљу","копна","копне","копни","копно","копну","копом","копра","копру","копта","копти","копца","копци","копцу","копча","копче","копчи","копчу","кораб","корад","корак","корал","коран","кораћ","корач","кореа","корен","корза","корзо","корзу","корим","корин","корио","корис","корић","кориш","корли","коров","кором","корпа","корпе","корпи","корпо","корпу","корса","корта","корто","корту","корче","косан","косат","косац","косач","косим","косин","косио","косир","косић","косих","косиш","коске","коски","косне","косни","косну","косов","косог","косој","косом","коста","косте","кости","косту","котао","котар","котац","котач","котва","котве","котви","котву","котеа","котла","котлу","котна","котне","котну","котов","котом","котон","котор","котур","коуен","кофер","кофом","кохут","коцар","коцев","коцељ","коцем","коцић","коцка","коцке","коцки","коцку","кочањ","кочим","кочин","кочио","кочић","кочиш","кочне","кочом","коџак","коџић","кошар","кошем","кошер","кошић","кошка","кошта","кошћу","кошут","крава","краве","крави","краво","краву","краде","кради","краду","крађа","крађе","крађи","крађу","краја","краје","крају","крака","краке","краку","крала","крале","крали","крало","краља","краље","краљу","крама","крамп","крања","крање","крању","краса","красе","краси","красу","крате","крати","краћа","краће","краћи","краћу","краул","краун","краус","крауч","крафт","краха","краху","краци","крвав","крвим","крвљу","крвна","крвне","крвни","крвно","крвну","кргић","кргом","крдом","креда","креде","креди","кредо","креду","креја","крејг","креје","крејн","крека","креле","крема","креме","креми","кремљ","кремс","крему","крене","крени","крену","кренц","креол","крепа","крепе","крепи","крета","крете","крећа","креће","крећи","крећу","креча","крече","кречи","креше","крешо","крешу","крзав","крзма","крзна","крзно","крзну","крива","криве","криви","криво","криву","крижа","криза","кризе","кризи","кризо","кризу","крије","крију","крика","крике","крику","крила","криле","крили","крило","крилу","крима","крими","криму","крина","крине","крину","криса","криси","крисп","крист","крису","крита","крити","криту","крици","криче","кричи","кркао","кркић","кркља","крком","крљић","крмак","крмар","крмез","крмељ","крмка","крмке","крмне","крмно","крмом","крмче","крњав","крњак","крњег","крњим","крњио","крњић","крњој","крова","крове","крови","крову","кроза","кроја","кроје","кроји","кроју","кројф","кроки","кроме","кроса","кросу","кроте","кроти","кроуа","кроче","крочи","кроше","крпар","крпач","крпеж","крпељ","крпим","крпио","крпић","крпиш","крпом","крсна","крсне","крсни","крсно","крсну","крста","крсте","крсти","крсто","крсту","кртих","кртог","круга","кругу","круже","кружи","круза","крузу","круна","круне","круни","круно","круну","крупа","крупе","крупи","крупу","крусо","крута","круте","крути","круто","круту","крућа","круће","круха","круху","круша","крхак","крхам","крхка","крхке","крхки","крхко","крхку","крцам","крцат","крцић","крцка","крцко","крцне","крцну","крцун","крчаг","крчао","крчим","крчио","крчић","крчиш","крчка","крчма","крчме","крчми","крчмо","крчму","крџић","кршан","кршем","кршен","кршим","кршио","кршић","крших","кршиш","кршко","кршку","кршна","кршне","кршни","кршно","кршну","кћери","куала","кубик","кубне","кубни","кубно","кубом","кувај","кувам","куван","кувао","кувар","куваш","кувер","кугла","кугле","кугли","куглу","кугом","кудим","кудио","кудић","кудиш","кужан","кужиш","кужна","кужне","кужни","кужно","кужну","кузен","кујем","кујеш","кујна","кујне","кујни","кујну","кукај","кукам","кукан","кукао","кукац","кукаш","кукић","кукољ","куком","кукоч","кукри","кукци","кулак","кулаш","кулен","кулер","кулик","кулин","кулић","кулиш","кулом","кулон","култа","култу","кулук","куљав","куљао","куљну","куман","кумар","кумим","кумин","кумио","кумир","кумић","кумиш","кумов","кумом","кумче","кунар","кунем","кунеш","кунић","куном","кунст","куњао","куома","куомо","купам","купао","купац","купач","купаш","купеа","купеи","купељ","купер","купеу","купим","купио","купих","купиш","купка","купке","купки","купку","купњу","купом","купон","купуј","купус","купца","купце","купци","купцу","кураж","куран","курац","курва","курве","курви","курво","курву","курда","курде","курди","курир","курић","курко","курса","курск","курсу","курта","курто","курту","курца","курцу","кусан","кусао","кусић","кусих","куске","кусне","кусни","кусов","кусур","кусце","кусцу","кутак","кутев","кутин","кутић","кутка","кутке","кутку","кутле","кутом","кућим","кућио","кућић","кућих","кућна","кућне","кућни","кућно","кућну","кућом","куфер","кухар","куцај","куцам","куцан","куцао","куцка","куцне","куцни","куцну","куцом","кучак","кучан","кучка","кучке","кучки","кучко","кучку","кучма","кучме","кучук","кушај","кушам","кушан","кушао","кушач","кушаш","кушеј","кушет","кушић","кушња","кушње","кушњи","кушњу","кфора","кфору","кција","лабав","лабан","лабат","лабуд","лабус","лавеж","лавић","лавља","лавље","лављи","лавов","лавом","лавор","лавра","лавре","лаври","лавро","лавру","лавце","лавче","лаган","лагао","лагер","лагос","лагум","ладан","ладен","ладин","ладна","ладно","ладом","лађар","лађом","лажан","лажац","лажем","лажеш","лажју","лажна","лажне","лажни","лажно","лажну","лажов","лажом","лазар","лазио","лазић","лазом","лаика","лаике","лаику","лаици","лајав","лајам","лајао","лајем","лајеш","лајић","лајна","лајон","лајош","лајтл","лакан","лакат","лакеј","лаким","лакић","лаких","лакне","лакну","лаког","лакој","лаком","лакош","лакта","лакту","лакша","лакше","лакши","лакшу","лалин","лалић","лалом","ламар","ламах","ламја","ламје","ламју","ламне","ламом","лампа","лампе","лампи","лампу","ланад","ланац","ланга","ланда","ландо","ланем","ланка","ланке","ланки","ланом","лануо","ланца","ланце","ланци","ланцу","ланче","лаоса","лапав","лапац","лапис","лапор","лапот","лапца","лапцу","ларва","ларве","ларви","ларву","ларго","ларин","ларма","ларме","ларми","ларму","ларса","ларус","ласер","ласић","ласка","ласко","ласла","ласло","ласно","ласта","ласте","ласти","латас","латим","латин","латио","латиф","латиш","лаћам","лаћао","лаћаш","лаура","лауре","лаури","лауро","лауру","лаута","лауте","лауту","лафет","лахор","лацио","лашић","лашка","лашко","лашче","лебац","лебде","лебди","лебед","лебен","левак","левар","левач","левек","левим","левин","левит","левић","левих","левич","левка","левљи","левог","левој","левом","левча","левчу","легањ","легао","легат","легла","легле","легли","легло","леглу","легне","легну","легох","ледан","ледац","леден","ледим","ледио","ледна","ледне","ледни","ледно","ледну","ледом","леђан","леђна","леђне","леђни","леђно","лежај","лежао","лежах","лежем","лежео","лежеш","лежим","лежиш","леила","леиле","леилу","леити","лејди","лејић","лејла","лејле","лејли","лејлу","лејти","лејхи","лекар","лекин","лекић","леком","лелас","лелек","лелић","лелом","лемам","леман","лемга","лемго","лемек","лемић","лемну","ленив","леним","лених","ленка","ленке","ленки","ленку","леног","леном","ленон","лента","ленте","ленти","ленту","ленче","лењег","лењив","лењим","лењин","лењир","лењих","лењог","лењој","лењом","леона","леоне","леони","леону","лепак","лепет","лепим","лепио","лепих","лепка","лепог","лепој","лепом","лепра","лепре","лепша","лепше","лепши","лепшу","лесин","лесић","леска","леске","леско","леску","лесли","летак","летач","летва","летве","летви","летву","летео","летим","летио","летић","летиш","летка","летке","летку","летна","летни","летња","летње","летњи","летњу","летов","летом","летос","лецао","лецне","лечен","лечим","лечио","лечић","лечиш","лешак","лешек","лешић","лешка","лешку","лешок","лешом","лешће","либан","либим","либио","либра","либре","либри","ливац","ливен","ливио","ливић","ливна","ливно","ливну","ливра","ливцу","лигаш","лигња","лигње","лигњи","лигом","лигхт","лидер","лижеш","лизан","лизао","лизне","лизну","лизол","лизом","лијам","лијек","лијем","лијеп","лијес","лијеш","лијом","ликер","ликић","ликом","ликуд","ликуј","лилић","лиман","лимар","лимба","лимбу","лимен","лимес","лимит","лимом","лимун","лимфа","лимфе","лимфу","линда","линде","линеа","линић","линка","лином","линта","линца","линцу","линча","линчу","лињак","лиона","лиону","липањ","липња","липњу","липов","липом","липса","липше","липши","липшу","лирик","лиром","лисац","лисец","лиска","лиске","лиско","лисна","лисне","лисни","лисно","лисов","лисом","листа","листе","листи","листу","лисца","лисце","лисцу","литар","литас","литва","литје","литра","литре","литри","литру","лићин","лићно","лифта","лифту","лихва","лихве","лихву","лицеј","лицем","личан","личен","личим","личин","личио","личиш","личка","личке","лички","личко","лична","личне","лични","лично","личну","лишај","лишен","лишио","лиших","лишиш","лишћа","лишће","лишћу","лишце","лоаре","лоару","лобан","лобов","лован","ловац","ловим","ловио","ловић","ловиш","ловна","ловне","ловни","ловно","ловну","ловом","ловор","ловре","ловца","ловце","ловци","ловцу","логар","логоа","логом","логор","логос","лођом","ложач","ложим","ложио","ложиш","ложом","лозна","лозни","лозом","лојда","лојем","лојзе","лојна","лојне","лојни","локал","локва","локве","локви","локву","локић","локне","лолин","лолић","лолом","ломан","ломим","ломио","ломић","ломиш","ломна","ломне","ломно","ломну","ломом","лонац","лонга","лонца","лонце","лонци","лонцу","лонче","лопар","лопез","лопес","лопов","лопта","лопте","лопти","лопту","лоран","лорда","лорде","лорду","лорел","лорен","лорин","лором","лосос","лотје","лотом","лотос","лотоу","лотра","лотре","лотус","лоуис","лоуча","лоцус","лочем","лочеш","лошег","лошем","лошим","лоших","лошој","лошом","лубин","лувра","лувру","лугар","лугер","лугом","лудак","лудим","лудих","лудне","лудог","лудој","лудом","лудош","лудуј","лудус","луђег","луђим","луђих","лужан","лузер","луиђи","луиза","луиса","луисе","луису","лујза","лујзе","лујзу","лукав","лукај","лукан","лукас","лукач","лукин","лукић","лукна","лукње","луком","лулаш","лулом","лумен","лунга","лунда","лунду","лунић","луном","луњам","луњао","лупај","лупам","лупао","лупаш","лупеж","лупим","лупио","лупиш","лупка","лупне","лупну","лупом","лутак","лутам","лутао","луташ","лутер","лутка","лутке","лутки","лутко","лутку","лутра","луцић","луцом","лучем","лучин","лучио","лучић","лучка","лучке","лучки","лучко","лучку","лучна","лучне","лучни","лучно","лучом","лушић","љајић","љатиф","љекар","љепша","љепше","љепши","љепшу","љерка","љетња","љетње","љетњи","љигав","љигом","љиљак","љиљан","љиљом","љољић","љосну","љотић","љубав","љубак","љубан","љубен","љубим","љубио","љубић","љубих","љубиш","љубни","љубом","љујић","љуљај","љуљао","љуљаш","љуљка","љуљне","љуљну","љупка","љупке","љупки","љупко","љупку","љупча","љупче","љупчо","љупчу","љуска","љуске","љуски","љуску","љусци","љутим","љутио","љутит","љутић","љутих","љутиш","љутне","љутну","љутња","љутње","љутњи","љутњу","љутог","љутој","љутом","љућем","љућим","љушић","љуште","љушти","мабар","мавра","маври","магао","магда","магде","магди","магић","магла","магле","магли","магло","маглу","магма","магме","магна","мадам","мадић","мадре","мађар","мажем","мажен","мажеш","мажић","мазан","мазао","мазач","мазга","мазге","мазги","мазго","мазгу","мазим","мазио","мазић","мазиш","мазна","мазне","мазни","мазно","мазну","мазох","мазут","маила","маина","маиро","мајда","мајде","мајду","мајем","мајер","мајин","мајић","мајка","мајке","мајки","мајкл","мајко","мајку","мајлс","мајна","мајне","мајни","мајнц","мајом","мајор","мајур","мајци","макао","макар","макау","макац","макин","макић","макиш","макла","макле","макли","макло","макља","макне","макни","макну","маком","макро","макса","макси","максу","малеа","мален","малер","малим","малин","малић","малих","малка","малко","малме","малог","малој","малом","малон","малро","малта","малте","малти","малто","малту","маљав","маљем","маљен","маљом","мамац","мамба","мамбо","мамим","мамин","мамио","мамић","мамиш","мамом","мамон","мамун","мамут","мамца","мамце","мамци","мамцу","манга","манго","манеа","манеж","манем","манеш","манир","манит","манић","манов","маном","манро","манта","манте","мануо","манух","манче","манчу","манџа","мањак","мањег","мањеж","мањем","мањим","мањих","мањка","мањку","мањој","мањом","мањци","маони","мапом","маран","мараш","марва","марве","марви","марво","марву","марги","марго","мареј","марек","мареш","маржа","марже","маржи","маржу","мариа","марие","марим","марин","марио","марић","мариш","марка","марке","марки","марко","маркс","марку","марна","марне","марни","марно","марну","маром","марон","марса","марсо","марсу","марта","марте","марти","марту","марфи","марша","марше","маршу","масам","масер","масив","масип","масић","маска","маске","маски","маску","масла","масло","маслу","масна","масне","масни","масно","масну","масом","масон","масте","масти","масуд","масци","матеа","матеи","матеј","матео","матер","матеу","матик","матин","матис","матић","матом","матор","матос","матра","матре","матцх","маћем","маћић","мауну","маура","мауро","мауса","маучу","махај","махао","махди","махер","махић","махне","махни","махну","махом","мацан","мацес","мацка","мацко","мацку","мачак","мачва","мачве","мачви","мачву","мачек","мачем","мачић","мачја","мачје","мачји","мачју","мачка","мачке","мачки","мачко","мачку","мачом","мачор","маџар","маџић","машај","машак","машан","машао","машем","машеш","машив","машим","машин","машио","машић","маших","машиш","машка","машке","машку","машна","машне","машни","машну","машта","маште","машти","машто","машту","машћу","мбаја","мбеки","меане","меани","меану","мегид","медан","меден","медеф","медиа","медиј","медић","медна","медне","медни","медом","међаш","међом","мезио","мезон","мејак","мејер","мејла","мејна","мејну","мејру","мекан","меким","меких","меког","мекој","меком","мекон","мекша","мекше","мекши","мелдо","мелез","мелем","мелић","мелон","мелос","мемић","мемла","мемле","мемли","мемлу","менгс","менем","менза","мензе","мензи","мензу","менке","менли","меном","менса","менсе","мента","менчу","мењај","мењам","мењан","мењао","мењач","мењаш","мепор","мерак","мерач","мерен","мерил","мерим","мерин","мерио","мериш","мерка","мерло","мерна","мерне","мерни","мерно","мерну","мером","месар","месец","месим","месио","месић","месиш","месна","месне","месни","месно","месну","месом","места","месте","мести","место","местр","месту","месуд","метак","метал","метан","метао","метар","метва","метву","метеж","метем","метеш","метиљ","метин","метју","метка","метке","метку","метла","метле","метли","метлу","метне","метни","метну","метод","метом","метох","метра","метре","метри","метро","метру","мећем","мећеш","мехић","мехта","мехте","мехту","мехур","мечја","мечка","мечке","мечки","мечко","мечку","мечом","мешај","мешам","мешан","мешао","мешах","мешач","мешаш","мешен","мигел","мигну","мигом","мидер","мидић","мидол","мидом","мијат","мијау","мијач","мијић","мијом","микан","микеш","микин","микић","миком","микош","микро","микса","миксу","милан","милен","милео","милер","милет","милим","милин","милио","милић","милих","милка","милке","милки","милко","милку","милов","милог","милој","милом","милос","милош","милуј","милун","милча","милчо","милчу","миљан","миљах","миљеа","миљем","миљеу","миљко","миљом","минга","минел","минер","минеш","минин","минић","минка","мином","минск","минуо","минус","минут","минче","мињин","мињон","миома","миоми","миона","миони","мираз","миран","мираш","мирен","мирза","мирим","мирин","мирио","мирис","мирић","мириш","мирка","мирке","мирко","мирку","мирна","мирне","мирни","мирно","мирну","миром","мирон","мирор","мироч","мирса","мирта","мирте","мирту","мируј","мирча","мирче","мирчи","мисал","мисао","мисим","мисир","мисић","мисле","мисли","мисмо","мисне","мисом","миста","мисте","мисто","митар","митев","митин","митис","митић","митја","митка","митке","митко","митку","митов","митом","митра","митре","митри","митро","митру","мићин","мићић","мићка","мићко","мићом","мићун","михал","михаљ","михиз","михић","мицао","мицић","мицов","мичел","мичем","мичеш","мичин","мичић","мишар","мишев","мишел","мишем","мишин","мишић","мишја","мишје","мишји","мишју","мишка","мишке","мишки","мишко","мишку","мишле","мишљу","мишов","мишом","мједе","мјера","мјере","мјери","мјеру","млаве","млави","млаву","млада","младе","млади","младо","младу","млађа","млађе","млађи","млађо","млађу","млаза","млазу","млака","млаке","млаки","млако","млаку","млата","млате","млати","млаца","млека","млеко","млеку","млели","млело","млети","млеци","млечи","мливо","млина","млине","млину","млого","мљети","мнама","мнења","мнење","мнењу","мнити","многа","многе","многи","много","многу","множе","множи","мноме","мњења","мњење","мњењу","мобар","мобил","мобом","мовие","могао","могах","могла","могле","могли","могло","могне","могну","могох","могул","могућ","модар","модел","модем","модла","модна","модне","модни","модно","модну","модом","модра","модре","модри","модро","модру","модул","модуо","модус","можда","можек","можеш","мозак","мозга","мозгу","мозда","мозер","мојег","мојем","мојим","мојић","мојих","мојој","мојом","мојца","мокар","мокра","мокре","мокри","мокро","мокру","молба","молбе","молби","молбу","молер","молим","молио","молих","молиш","молоа","молов","молом","молох","мољах","мољац","мољен","мољца","мољци","мољцу","момак","момин","момир","момић","момка","момке","момку","момом","момци","момче","монах","монаш","монда","монде","монду","монеа","монео","моник","моном","монро","монте","мопед","мопса","морал","морам","моран","морао","морат","морах","морач","мораш","морем","морен","моржа","моржу","морие","морио","морис","морић","морих","мориц","мориш","морка","мороа","мором","мосад","мосор","моста","мосте","мости","мосту","мосур","мотај","мотам","мотао","моташ","мотел","мотив","мотка","мотке","мотки","мотку","мотом","мотор","мотре","мотри","моћан","моћна","моћне","моћни","моћно","моћну","мофаз","мохер","мочар","мошин","мошић","мошом","мошти","мошус","мрава","мраве","мрави","мраву","мраза","мразе","мразу","мрака","мраке","мраку","мрачи","мрвић","мрвош","мргуд","мрдај","мрдак","мрдам","мрдао","мрдаш","мрдне","мрдни","мрдну","мрђан","мрежа","мреже","мрежи","мрежу","мремо","мрена","мрене","мрену","мрест","мрети","мржња","мржње","мржњи","мржњу","мрзак","мрзан","мрзео","мрзим","мрзио","мрзиш","мрзле","мрзли","мрзло","мрзне","мрзни","мрзно","мрзну","мрије","мркаљ","мрква","мркве","мрким","мркић","мрких","мркла","мркле","мркли","мркло","мрклу","мркне","мркни","мркну","мрков","мрког","мркој","мрком","мркша","мрљав","мрљом","мрмља","мрмор","мрмот","мрсан","мрсим","мрсио","мрска","мрске","мрски","мрско","мрску","мрсна","мрсне","мрсни","мрсно","мрсну","мртав","мртва","мртве","мртви","мртво","мртву","мрчај","мршав","мрште","мршти","мувам","мувао","мувар","мувље","мувљи","мувом","мугур","мудар","мудра","мудре","мудри","мудро","мудру","мужем","мужик","мужић","мужом","музао","музеј","музем","музил","музла","музом","мујић","мујом","мукао","мукла","мукле","мукли","мукло","муклу","муком","мукте","мулат","мулац","мулен","мулин","мулић","мулом","мулти","муљај","муљам","муљаш","муљем","мумла","мунар","мунди","мундо","муниб","мунир","мунка","мунро","мунта","муњић","муњом","мурал","мурат","мурва","мурга","мурге","мурит","мурић","мурло","мурта","мурти","мусај","мусин","мусић","мусиц","мусом","мусти","мутав","мутан","мутап","мутеж","мутер","мутим","мутио","мутис","мутиш","мутна","мутне","мутни","мутно","мутну","мућак","мућка","мућке","мућки","мућну","мухић","мухом","мухур","муцав","муцај","муцам","муцао","муцаш","муцин","муцић","мучан","мучао","мучем","мучен","мучим","мучио","мучих","мучиш","мучка","мучке","мучки","мучко","мучна","мучне","мучни","мучно","мучну","мушка","мушке","мушки","мушко","мушку","набил","набио","набих","набој","набор","набра","навек","навео","навиј","навио","навип","навод","навоз","навој","навре","навро","навру","наврх","нагао","нагиб","нагим","нагих","нагла","нагле","нагли","нагло","наглу","нагна","нагне","нагни","нагну","нагог","нагој","нагом","нагон","нагох","надај","надам","надан","надао","надах","надаш","надев","надер","надин","надме","надно","надом","надре","надри","надув","надуо","надут","надух","нађем","нађен","нађеш","нађин","нађом","нађох","нажао","нажње","назад","назал","назва","назеб","назив","назим","назир","назиф","назми","назор","назре","назру","наива","наиве","наиђе","наиђу","наима","наиме","наићи","најам","најве","најео","најки","најма","најми","најму","накан","накит","накић","накла","наков","наком","након","накот","налаз","налет","налив","налиј","налик","налио","налић","налих","налог","намаз","намах","намет","нанао","нанео","нанет","нанио","нанић","наном","нанос","нанту","наоко","наоса","наочи","напад","напао","напев","напео","напет","напиј","напио","напис","напне","напој","напол","напон","напор","напре","напуљ","нарав","нарди","нарко","народ","наром","насад","насег","насео","насер","насип","насих","наско","насој","наспе","наспи","наспу","наста","насти","насто","насуо","насут","насуф","натал","натан","натег","натра","натур","наћве","наћин","науде","науди","наука","науке","науко","науку","наума","науме","науми","науму","науци","науча","науче","научи","нафта","нафте","нафти","нафту","наход","нацин","нацрт","начас","начео","начет","начин","начић","начне","начни","начну","начуо","наџак","нашав","нашао","нашег","нашем","нашим","наших","нашке","нашки","нашку","нашла","нашле","нашли","нашло","нашој","нашом","нашта","наште","нашто","неагу","небес","небог","небом","небош","невар","невен","невер","невин","невис","негве","негда","негде","негли","негом","негро","негуј","недан","недим","недин","недић","недом","недра","недуг","неђат","неђић","нежан","нежић","нежна","нежне","нежни","нежно","нежну","незир","неиде","нејак","нејач","некад","неким","неких","неког","некој","неком","некоћ","некст","некуд","нелен","нелеп","нелом","немај","немам","неман","немао","немар","немат","немах","немац","немаш","немет","немец","немим","немио","немир","немих","немка","немог","немој","немом","немоћ","немца","немце","немци","немцу","ненад","ненић","неном","ненси","неона","неоце","непал","непот","непун","непца","непце","нерад","нерај","нерал","нерва","нерве","нерви","неред","нерон","несен","несин","несит","несну","несој","неста","несто","нетас","нетих","нетко","нетом","нећак","нећеш","нећка","неука","неуке","неуки","неуко","неуку","неума","неуму","неуре","неури","неуро","нефер","нехај","нехат","нехру","нецар","нечег","нечем","нечим","неџад","неџат","неџеп","неџиб","неџип","нешић","нешка","нешко","нешта","нешто","нзија","нивес","нивоа","нивое","нивои","нивоу","нигда","нигде","нигер","нигро","нигхт","нижег","нижем","нижим","нижих","нижој","нижом","низак","низао","низом","нијаз","нијем","никад","никал","никао","никеи","никим","никић","никла","никле","никли","никло","никлу","никне","никну","никог","никол","ником","никон","никос","никуд","никша","никше","никши","нилов","нилом","ниман","нимфа","нимфе","нимфи","нимфо","нимфу","нинић","нинка","нинко","нином","нинџа","ниову","ниону","нисам","нисан","ниска","ниске","ниски","ниско","ниску","нисмо","ниста","нисте","нисци","нитић","нитко","нитна","нитне","нитри","нитро","нићић","нихад","нихил","нихон","ницао","ницом","ницхт","ничеа","ничег","ничем","ничеу","ничим","ничић","ниџом","нишан","нишка","нишке","нишки","нишко","нишку","нишом","ништа","ниште","ништи","ништо","ништу","нишче","нишчи","ноама","нобел","новак","новац","новел","новим","новић","нових","новка","новке","новки","новко","новог","новој","новом","новца","новце","новци","новцу","новче","ногат","ногић","ногом","ноела","ножар","ножем","ножић","ножна","ножне","ножни","ножно","нојев","нојем","нојес","нојић","нокат","нокиа","нокта","нокте","нокти","нокту","нолит","номад","норац","норин","норма","норме","норми","норму","норца","норцу","норча","носак","носат","носац","носач","носем","носив","носим","носио","носић","носих","носиш","носна","носне","носни","носно","носну","носом","нотар","нотес","нотна","нотне","нотни","нотно","нотну","нотом","ноћас","ноћим","ноћио","ноћих","ноћиш","ноћна","ноћне","ноћни","ноћно","ноћну","ноћом","ноћца","ноћцу","ношен","ношња","ношње","ношњи","ношњу","нувел","нугат","нудим","нудио","нудиш","нуђен","нуера","нужан","нужда","нужде","нужди","нужду","нужна","нужне","нужни","нужно","нужну","нулом","нулта","нулте","нулти","нулту","нумић","нуова","нуово","нутка","нушић","нушом","њакао","њакну","њачем","његов","његом","Његош","њедра","њежан","њежна","њежне","њежни","њежно","њезин","њеним","њених","њеног","њеној","њеном","њивом","њиним","њиних","њиног","њиној","њином","њисак","њиска","њихај","њихао","њихов","њиште","њишти","њојзи","њорка","њутна","њутну","њушим","њушио","њушка","њушке","њушки","њушку","њушци","оазом","обаве","обави","обада","обади","обаја","обају","обала","обале","обали","обалу","обара","обаре","обасу","обдан","обеда","обеде","обеди","обеду","обеју","обема","обере","оберу","обесе","обеси","обест","обећа","обзир","обзор","обиђе","обиђи","обиђу","обија","обије","обију","обили","обило","обиља","обиље","обиљу","обима","обиму","обити","обиће","обићи","обићу","објед","облак","облик","облим","облио","облић","облих","облог","облој","облом","облук","обноћ","обода","ободе","ободи","ободу","обоје","обоји","обола","оболе","оболи","обома","обора","оборе","обори","обору","обоце","обоци","обрад","образ","обрао","обрат","обрва","обрве","обрву","обред","обрен","обрео","обриј","обрис","обрић","обрне","обрни","обрну","оброк","обрст","обрта","обрте","обрти","обрту","обрће","обрћи","обрћу","обруб","обруч","обува","обузе","обује","обују","обука","обуке","обуко","обуку","обула","обули","обути","обућа","обуће","обући","обућу","обуци","обуче","обучи","овада","овака","оваке","оваки","овако","оваку","овала","овали","овалу","овамо","овати","оваца","овбпм","овена","овенс","овера","овере","овери","оверу","овећа","овеће","овећи","овећу","овија","овила","овима","овиме","овисе","овиси","овлаш","овном","овога","овоје","овоју","овоме","овому","овпбм","овпмб","оврха","оврхе","оврше","овсик","овска","овске","овски","овсом","овуда","овцом","овчар","овчја","овчје","овчји","овчју","огади","огаре","огата","огист","оглав","оглас","оглед","огњан","огњем","огњен","оголе","оголи","огоље","огрев","огриј","огрне","огрни","огрну","огроз","огрће","огрћу","одаде","одаду","одаја","одаје","одаји","одају","одала","одале","одали","одало","одаље","одамо","одана","одане","одани","одано","одану","одапе","одата","одате","одати","одато","одаће","одаћу","одбиј","одбио","одбир","одбих","одбој","одбор","одвео","одвећ","одвио","одвод","одвоз","одвој","одгој","одева","одела","оделе","одели","одело","оделу","одемо","одена","одене","одени","одену","одеон","одера","одере","одери","одеру","одеса","одесе","одеси","одете","одећа","одеће","одећи","одећо","одећу","одзив","одиже","одија","одите","одића","одићи","одише","одишу","одјек","одлив","одмак","одмах","одмет","одмор","одмоћ","однео","однет","однио","однос","одоји","одока","одоле","одоли","одора","одоре","одори","одору","одоше","одраз","одран","одред","одржа","одрже","одржи","одрод","одром","одрон","одсад","одсев","одсек","одсео","одсто","одува","одуже","одужи","одузе","одука","одуку","одуху","одуче","одучи","ођека","оебса","ожале","ожали","ожеже","ожене","ожени","ожећи","оживе","оживи","ожица","озаре","озари","озебе","озива","озида","озима","озиме","озимо","озиму","озона","озрен","оЗСОН","ојади","ојача","окаде","окади","окаје","окају","окаља","окама","окана","окане","окани","окану","оката","окати","окату","окаца","окаче","окачи","оквир","океан","окива","окини","окину","оките","окити","окица","окице","оклен","оклоп","окова","окове","окови","окову","около","окоме","окоми","окопа","окоси","окоти","окрет","окрње","окрњи","окрпи","округ","оксид","октав","октан","октет","окужи","окује","окују","окука","окуке","окуку","окупа","окупе","окупи","окупу","окусе","окуси","окуће","окући","окуци","окуша","олади","олака","олаке","олаки","олако","олгин","олгом","олега","олегу","олива","олиже","олимп","олова","олово","олову","олоша","олоши","олсен","олсон","олтар","олуја","олује","олуји","олују","олука","олуку","олуци","омажа","омаје","омале","омама","омаме","омами","омаму","омана","омане","оману","омања","омање","омањи","омању","омара","омаћи","омаха","омахе","омаху","омаче","омега","омеђи","омела","омеле","омели","омело","омера","омеру","омета","омете","омету","омиле","омили","омиље","омима","омица","омлет","омниа","омота","омоте","омоту","омрсе","омрси","омску","омчом","онака","онако","онаку","онамо","ондак","онижа","онижи","онижу","оникс","онима","ониме","онога","ономе","оному","оноре","онуда","оњуши","опада","опаде","опажа","опазе","опази","опаја","опака","опаке","опаки","опако","опаку","опала","опале","опали","опало","опане","опара","опаса","опасе","опата","опату","опаше","опаши","опашу","опева","опека","опеке","опеку","опела","опело","опелу","опена","опера","опере","опери","оперу","опећи","опеци","опече","опија","опије","опију","опила","опили","опило","опипа","опипу","опире","опири","опиру","описа","описе","описи","опису","опита","опите","опити","опиту","опиће","опише","опиши","опишу","опкоп","оплео","опном","опова","опово","опову","опоје","опоји","опоју","ополе","ополу","опора","опоре","опори","опоро","опору","опран","опрао","опрах","опрез","опрем","опрже","опржи","опрљи","опсег","опсео","опста","опсуј","опток","опћег","опћих","опћој","опуса","опусе","опуси","опусу","опута","опуту","опучи","опход","опшив","опшић","општа","опште","општи","општу","орале","орали","орало","орана","оранж","орану","орања","орање","орању","ораси","орати","ораће","ораћу","ораха","орахе","ораху","орача","орачи","орачу","орбан","орбис","орвал","орвел","орвсј","орган","орден","ордић","ореже","орела","орелу","оремо","ореол","орете","орила","ориле","орили","орило","орити","орића","орићу","ориши","оркан","орлић","орлов","орлом","орлон","орман","ормар","ормом","орнат","оробе","ороди","ороза","орозе","орозу","орону","оросе","ороси","орочи","орсеј","ортак","ортез","оруђа","оруђе","оруђу","оружа","оруже","орући","орфеј","орхан","осака","осаке","осаки","осаку","осама","осаме","осами","осаму","освит","осврт","осека","осеке","осеку","осени","осета","осете","осети","осету","осећа","осећи","осеца","осеци","осече","осили","осима","осиње","осињи","осион","осипа","осица","осице","оскар","ослић","ослом","ослон","осман","осмех","осмим","осмих","осмог","осмој","осмом","основ","особа","особе","особи","особо","особу","осови","осоја","осоје","осоју","осоли","оспем","остав","остај","остан","остао","остах","остве","остен","остер","остин","осуда","осуде","осуди","осуду","осула","осуле","осули","осуло","осуне","осута","осуте","осути","осуто","осуће","осуше","осуши","отава","отаве","отави","отаву","отада","отале","отаља","отамо","отапа","отаца","отвор","отежа","отеже","отежи","отежу","отела","отеле","отели","отело","отера","отета","отете","отети","отето","отету","отеће","отећи","отеше","отешу","отиде","отиди","отиду","отиђе","отиђи","отима","отире","отиру","отићи","отиче","отичу","откад","отказ","откле","отков","откос","откри","откуд","откуп","отлен","отмем","отмен","отмеш","отока","отоке","отоку","отопе","отопи","отоци","отпад","отпао","отпио","отпис","отпих","отпор","отпре","отраг","отрже","отров","отрпе","отрпи","отрти","отруј","отрца","отрча","отрче","отрчи","отуда","отуђе","отуђи","отуже","отупе","отупи","отура","отури","отуче","оћима","оћтро","оћтру","оћута","оћути","офиса","офису","офсет","офшор","охаја","охајо","охају","охиса","охола","охоле","охоли","охоло","охрид","оцеан","оцеде","оцеди","оцена","оцене","оцени","оцено","оцену","оцила","оцило","оцима","оцрне","оцрни","оцрта","оцтом","очаја","очају","очара","очева","очеве","очеви","очево","очеву","очеша","очеше","очешу","очију","очима","очина","очине","очину","очиње","очињи","очита","очите","очити","очито","очиту","очица","очице","очним","очних","очног","очној","очном","очњак","очува","очуха","очуху","оџака","оџаке","оџаку","оџаци","ошине","ошини","ошину","ошири","ошиша","оштар","оштим","оштра","оштре","оштри","оштро","оштру","ошути","пабла","пабло","павао","павел","павит","павић","павка","павке","павки","павку","павла","павле","павло","павлу","павом","павши","пагар","падај","падам","падао","падаш","падеж","падне","падни","падну","падом","падох","пажен","пажња","пажње","пажњи","пажњу","пазар","пазим","пазио","пазиш","пазух","пајац","пајин","пајић","пајка","пајом","пакао","пакер","пакет","пакла","пакле","пакло","паклу","паком","пакра","пакре","пакри","пакта","пакту","пакуј","палас","палат","палац","палго","палеж","палеу","палим","палио","палић","палих","палиш","палма","палме","палми","палмо","палму","палог","палом","палош","палца","палци","палцу","паљба","паљбе","паљби","паљбу","паљен","паљић","памет","памте","памти","памук","панда","панде","панди","панев","панел","панем","панеш","панис","панић","паноа","панов","паное","панои","паноу","панта","панте","панти","панто","панту","пануо","панџа","пањић","паока","паола","паоло","паолу","паора","паоре","паори","папак","папар","папас","папин","папир","папић","папке","папку","папом","папуа","папци","парај","паран","парао","параф","парах","парео","париз","парио","парип","парис","парка","парке","парки","парко","паркс","парку","парма","парме","парми","парму","парна","парне","парни","парно","парну","паром","парох","парса","парта","парте","парти","парто","парца","парце","парци","парче","пасаж","пасан","пасао","пасат","пасах","пасем","пасер","пасеш","пасив","пасић","пасја","пасје","пасји","пасју","паска","паске","паски","паско","паску","пасла","пасле","пасло","пасок","пасом","пасох","пасош","паста","пасте","пасти","пасту","пасуљ","пасус","пасха","пасхе","пасху","патак","патен","патим","патио","патић","патих","патиш","патка","патке","патку","патња","патње","патњи","патњу","патом","патос","паћен","пауел","пауза","паузе","паузи","паузу","паука","пауке","пауку","паула","пауле","паули","пауло","паулу","пауна","паунд","пауне","пауни","пауци","пауче","пацер","пацка","пацке","пацки","пацко","пацов","пачам","пачир","пачић","пачје","пачји","пачју","пашин","пашић","пашка","пашко","пашом","паште","пашти","пашће","пашћу","пашче","пеаце","певај","певам","певан","певао","певах","певац","певач","певаш","певић","певца","певци","певцу","пегав","пегаз","пегла","пегле","пегли","пеглу","пегом","педаљ","педер","педља","педра","педро","пеђин","пежоа","пеића","пејак","пејић","пекао","пекар","пекић","пекла","пекле","пекли","пекло","пеком","пелеа","пелин","пелир","пелуд","пенал","пенга","пенев","пенио","пенис","пенић","пених","пеном","пенџе","пењао","пењач","пењем","пењеш","пепео","пепић","пепси","перад","перач","перда","перем","перес","переш","перин","перић","перја","перје","перју","перка","перко","перку","перла","перле","перли","перлу","перна","перне","перни","перно","пероа","перов","пером","перон","перош","перса","персе","перси","персу","перта","перту","перуа","перун","перут","перца","перце","песак","песах","песка","песку","песма","песме","песми","песмо","песму","песоа","пести","петак","петао","петар","петен","петер","петим","петит","петих","петка","петке","петки","петко","петку","петла","петли","петлу","петља","петље","петљи","петљо","петљу","петна","петог","петој","петом","петра","петре","петри","петро","петру","пећић","пећка","пећке","пећки","пећко","пећку","пећти","пећту","пехар","пецам","пецао","пецач","пецаш","пецин","пецић","пецка","пецне","печал","печат","печем","печен","печеш","печку","печуј","пешак","пешић","пешке","пешко","пешта","пеште","пешти","пешту","пиано","пивом","пивот","пивце","пивши","пижон","пизда","пизди","пизду","пизма","пизме","пизму","пијан","пијац","пијем","пијеш","пијмо","пијте","пијук","пикеа","пикет","пикња","пикси","пилав","пилад","пилар","пилат","пилеж","пилић","пилиш","пилом","пилон","пилот","пиљак","пиљар","пиљим","пиљио","пиљић","пиљиш","пимић","пинеа","пинеу","пинка","пинки","пинку","пинта","пинте","пинто","пинту","пинци","пиона","пионе","пиони","пипав","пипај","пипак","пипам","пипан","пипао","пипаш","пипер","пипка","пипке","пипне","пипни","пипну","пипци","пиран","пират","пирга","пиргу","пиреа","пиреј","пирит","пирић","пирка","пирне","пиром","пирот","писак","писан","писао","писар","писах","писац","писач","писић","писка","писке","писку","писма","писмо","писму","писне","писни","писну","писта","писте","писти","писту","писца","писце","писци","писцу","питај","питак","питам","питан","питао","питах","питач","питаш","питер","питић","питка","питке","питко","питку","питом","питон","пићем","пичић","пичка","пичке","пичко","пичку","пишам","пишао","пишаш","пишем","пишеш","пишке","пишки","пишта","пиште","пишти","пјаци","пјера","пјеро","пјеру","пјотр","плава","плаве","плави","плаво","плаву","плажа","плаже","плажи","плажу","плазе","плази","плака","плама","пламе","пламу","плана","плане","плани","планк","плано","плант","плану","пласт","плата","плате","плати","плато","плату","плаћа","плаће","плаћо","плаћу","плаха","плахе","плахи","плахо","плаху","плаца","плаци","плацу","плача","плаче","плачи","плачу","плаше","плаши","плашт","плебс","плева","плеве","плеви","плеву","плеја","плеју","плела","плеле","плели","плело","племе","плена","плене","плени","плену","плеса","плесу","плете","плети","плету","плећа","плеће","плећи","плеха","плеху","плеша","плеше","плешу","плива","пливе","пливи","плима","плиме","плими","плиму","плина","плино","плину","плисе","плића","плиће","плићи","плићу","плиша","плове","плови","плода","плоде","плоди","плоду","плота","плоти","плоту","плоћу","плоха","плохе","плохо","плоху","плоча","плоче","плочи","плочу","плуга","плугу","плуже","плуса","плусу","плута","плуте","плуто","плуту","плућа","плуча","пљеве","пљуга","пљуге","пљује","пљују","пљуне","пљуни","пљуну","поара","поаре","поаро","побиј","побио","побит","побој","побра","побре","побри","побро","побру","повао","повез","повео","повик","повио","повит","повић","повод","повој","поврх","површ","поган","погле","погне","погни","погну","погон","подај","подам","подао","подаш","подви","подла","подле","подли","подло","подлу","подне","подно","подоб","подом","пођем","пођеш","пођох","поеле","поема","поеме","поеми","поему","поена","поене","поени","поену","поета","поете","поети","поету","пожар","пожње","пожњу","пожун","позва","позер","позив","позли","позна","позне","позни","позно","позну","позом","позор","поима","поинт","појав","појак","појам","појао","појас","појац","појед","појем","појео","појеш","појим","појио","појиш","појма","појме","појми","појму","појте","појца","појце","појци","појцу","показ","покај","покар","покер","покет","покла","покој","покољ","покоп","покор","покра","покри","покуј","покус","полаз","полак","полан","полед","полен","полет","ползу","полин","полио","полип","полис","полит","полић","полка","полке","полки","полку","полна","полне","полни","полно","полну","полов","полог","полок","полом","пољак","пољар","пољем","пољка","пољку","помаз","помак","поман","помар","помен","помео","помет","помна","помне","помно","помну","помњу","помои","помол","помор","помоћ","помоч","помпа","помпе","помпи","помпу","помре","помро","помру","понад","понео","понет","понио","понов","понож","понор","понос","поноћ","понте","попај","попац","попев","попео","попер","попех","попиј","попин","попио","попис","попић","попих","попне","попни","попну","попов","попом","попул","попут","попци","попче","порад","пораз","порве","поред","порез","пореч","порив","порит","порно","порог","пород","порој","порок","пором","порта","порте","порти","порто","порту","поруб","порше","посад","посан","посао","посве","посед","посео","посин","посла","после","послу","посна","посне","посни","посно","посну","поспа","поспе","поспи","поспу","поста","посте","пости","посто","посту","посуо","посут","потаж","потег","потез","потен","потер","потес","потић","потка","потке","потки","потку","поток","потом","потоп","потра","потре","потру","поћев","поћео","поћто","поузи","поука","поуке","поуку","поуња","поуњу","поупа","поуци","поуче","поучи","поход","почам","почев","почек","почео","почеп","почет","почех","почне","почни","почну","почто","почуј","почуо","пошав","пошао","пошла","пошле","пошли","пошло","пошта","поште","пошти","пошто","пошту","права","праве","прави","право","праву","прага","прагу","прада","прадо","праду","прајс","прала","прале","прали","прало","праља","праље","прама","праму","прана","пране","прани","прања","прање","прању","прасе","прате","прати","праха","праху","праче","праше","праши","првак","прван","првим","првих","првог","првој","првом","пргав","преби","преви","преда","преде","преди","преду","пређа","пређе","пређи","пређу","преже","прежи","прежу","преза","преје","прека","преке","преки","преко","преку","прела","преле","прели","прело","прелу","преља","преље","прељо","према","прене","прени","прену","преса","пресе","преси","пресу","прета","прете","прети","преће","прећи","прећу","преци","преча","прече","пречи","преша","прешо","прешу","пржен","пржим","пржио","пржић","пржиш","пржун","приби","приви","прида","приде","приђе","приђи","приђу","прија","прије","пријо","прију","прика","прима","приме","прими","примо","принт","принц","приор","припи","прића","приће","прићи","прићу","прица","прице","прици","прицу","прича","приче","причи","причо","причу","пришт","пркос","прлић","прљав","прљај","прљам","прљао","прљаш","прљић","прњав","проба","пробе","проби","пробо","пробу","прова","прово","прову","прода","проди","прође","прођи","прођу","проже","проза","прозе","прози","прозу","проја","проје","проју","прока","проке","прола","проле","проли","пропе","пропи","проса","просе","проси","просо","прост","просу","прота","проте","проти","прото","проту","проћи","проћу","профа","профе","профи","прохи","прочи","прочу","прпић","прсио","прска","прсла","прсна","прсне","прсни","прсно","прсну","прста","прсте","прсти","прсту","пртен","пртим","пртио","пртља","прћић","пруво","пруга","пруге","пругу","пружа","пруже","пружи","прузи","пруси","пруст","прута","прути","пруту","прућа","пруће","прући","прхну","прцић","пршић","прште","пршти","пршут","псалм","псета","псето","псећа","псеће","псећи","псећу","псима","псина","псине","псино","псину","псића","псиће","псићи","псићу","психа","психе","психи","психо","психу","псује","псују","птића","птиће","птићи","птићу","птица","птице","птици","птицо","птицу","птиче","пуача","пудар","пудер","пудла","пудра","пужем","пузав","пузао","пузим","пузио","пузић","пузиш","пујић","пукао","пуким","пуких","пукла","пукле","пукли","пукло","пукне","пукни","пукну","пуког","пукој","пуком","пулен","пулпа","пулпи","пулса","пулта","пулту","пуљић","пумпа","пумпе","пумпи","пумпу","пунан","пунац","пунђа","пунђе","пунђу","пуним","пунио","пуних","пункт","пуног","пуној","пуном","пунта","пунца","пунци","пунча","пуњач","пуњен","пупав","пупак","пупин","пупка","пупку","пуран","пурић","пусић","пуста","пусте","пусти","пусто","пусту","путар","путем","путен","путер","путин","путио","путир","путић","путна","путне","путни","путно","путну","путом","путуј","пућка","пућне","пуфта","пухне","пухни","пухну","пуцај","пуцам","пуцањ","пуцао","пуцаш","пуцић","пуцка","пуцне","пуцња","пуцње","пуцњи","пучем","пучка","пучке","пучки","пучку","пушач","пушим","пушио","пушић","пушиш","пушка","пушке","пушко","пушку","пушта","пуште","пушти","пушци","пчела","пчеле","пчели","пчелу","пчиња","пчиње","пчињи","пчињу","рабан","рабат","рабин","рабом","рабош","раван","равна","равне","равни","равно","равну","равња","рагби","рагип","рагом","рагуа","рагуж","радан","радар","радев","раден","радиј","радим","радин","радио","радић","радих","радич","радиш","радна","радне","радни","радно","радну","радња","радње","радњи","радњу","радог","радој","радом","радон","радош","радуј","радул","радун","рађај","рађам","рађан","рађао","рађаш","рађен","ражан","ражањ","ражен","ражња","ражњу","ражом","разби","разве","разви","разда","разли","разми","разна","разне","разни","разно","разну","разом","разум","раима","раића","раифа","рајац","рајди","рајем","рајин","рајић","рајич","рајка","рајко","рајку","рајна","рајне","рајни","рајно","рајну","рајом","рајса","рајтс","рајха","рајхл","рајху","рајца","рајцу","ракин","ракић","ракља","ракље","раков","раком","ралић","ралом","ралфа","раман","рамба","рамбо","рамиз","рамић","рамом","рамон","рампа","рампе","рампи","рампо","рампу","рамуш","ранац","ранга","рангу","ранди","раним","ранио","ранић","раних","раниш","ранка","ранке","ранко","ранку","раног","раној","раном","ранта","ранца","ранце","ранцу","ранчу","рањав","рањен","рањив","рапав","рапид","расад","расап","расеј","расел","расим","раско","расла","расле","расли","расло","расна","расне","расни","расно","расну","расол","расом","распе","распи","распу","раста","расте","расти","расту","расуо","расут","ратар","ратио","ратић","ратка","ратко","ратку","ратна","ратне","ратни","ратно","ратну","ратом","ратуј","раула","рафал","рахим","рацин","рацио","рацић","рацка","рацке","рацко","рачак","рачан","рачва","рачве","рачви","рачву","рачин","рачић","рачји","рачка","рачку","рачун","рашид","рашио","рашић","рашка","рашке","рашки","рашко","рашку","рашље","рашом","рашта","рашће","рвала","рвали","рвања","рвање","рвању","рвати","рвача","рваче","рвачи","рваше","рвемо","рвите","рвући","рђава","рђаве","рђави","рђаво","рђаву","рђала","рђали","рђама","рђања","реала","реалу","ребац","ребек","ребер","ребеч","ребић","ребра","ребро","ребус","реван","ревер","ревир","ревни","ревно","ревуе","регал","реган","регле","редак","редар","редим","редиш","редна","редне","редни","редно","редња","редов","редом","ређај","ређам","ређао","ређаш","ређег","ређем","ређен","ређеп","ређим","ређих","ређој","режањ","режао","режим","режња","режњу","резак","резан","резао","резач","резом","резон","реиса","рејан","рејон","рекав","рекао","рекар","рекет","рекла","рекле","рекли","рекло","рекне","рекну","реком","рекох","рекса","рексу","релеј","релић","релно","рељеф","рељин","рељић","ремек","ремен","ремзи","ремон","ремсу","ремус","ренде","ренди","ренеа","реноа","реном","реноу","рента","ренте","ренти","ренту","ренцо","репак","репас","репат","репац","репер","репић","репна","репни","репом","ререп","рерна","рерне","рерни","рерну","ресад","ресен","ресер","ресет","реска","реске","рески","реско","ресна","ресну","ресом","ресор","ресто","ретка","ретке","ретки","ретко","ретку","ретор","ретур","ретуш","реума","реуме","реуму","рефик","рецка","рецке","рецку","рецне","речем","речен","речеп","речеш","речит","речју","речна","речне","речни","речно","речну","речца","речце","речцу","реџеп","решад","решат","решен","решив","решид","решим","решио","реших","решиш","решке","решоа","решои","решоу","ржући","рзава","рзала","рзање","рзати","рзија","рибан","рибао","рибар","рибаћ","рибач","рибеж","рибић","рибич","рибља","рибље","рибљи","рибљу","рибом","ривал","ривас","ривер","ривет","ривју","ригам","ригом","ригхт","ридај","ридам","ридао","ридаш","ридзи","ридли","риђан","риђег","риђих","риђој","риђом","рижом","ризик","ризов","ризом","ријад","ријем","ријеч","ријеш","рикао","риках","рикер","рикне","рикни","рикну","риком","рилке","римом","ринга","рингу","рином","ринта","рипањ","рипне","рипњу","рисан","рисао","рисна","рисну","рисом","риста","ристе","ристи","ристо","ристу","ритав","ритам","ритас","ритер","ритма","ритму","ритне","ритну","ритом","рифат","ричем","ришар","ркман","рнића","робер","робин","робио","робља","робље","робљу","робна","робне","робни","робно","робну","робом","робот","рован","ровац","роваш","ровер","ровињ","ровит","ровић","ровца","ровце","ровци","рогаљ","рогат","рогач","рогер","рогић","рогља","рогљу","рогоз","рогом","родам","родан","роден","родео","родим","родин","родио","родић","родих","родиш","родна","родне","родни","родно","родну","родом","родос","рођак","рођен","рожац","рожић","розен","розић","ројал","ројем","ројса","ројта","ројте","рокер","рокић","роком","рокће","ролан","ролат","ролна","ролне","ролни","ролну","ролом","рољић","роман","ромба","ромеа","ромен","ромео","ромер","ромеу","ромић","ромом","ромор","ронда","рондо","роним","ронио","рониш","роном","ропац","ропће","ропћи","ропћу","ропца","ропци","ропцу","ропче","рорти","росан","росин","росић","росиш","росна","росне","росно","росну","росом","ротар","ротор","роћен","роудс","роуду","рохав","рохан","рошав","рошце","рошци","рсану","рСФСР","ртњем","ртова","ртове","ртови","руану","рубац","рубен","рубин","рубља","рубље","рубљи","рубљу","рубна","рубне","рубом","рувим","ругам","ругао","ругач","ругаш","ругла","ругло","руглу","ругом","рудар","рудић","рудна","рудне","рудни","рудно","рудом","руђер","ружан","ружди","ружем","ружен","ружим","ружин","ружио","ружић","ружна","ружне","ружни","ружно","ружну","ружом","руиза","руина","руине","руини","рујан","рујем","рујна","рујне","рујни","рујно","рујну","рукав","рукне","руком","рулаг","рулет","рулфо","руљом","румба","румбе","румен","румиз","румом","румун","рунар","рунда","рунде","рунди","рундо","рунду","рунић","руном","руњав","рупел","рупио","рупом","рупца","русев","русин","руска","руске","руски","руско","руску","русоа","русом","русоу","рутав","рутам","рутом","рухом","ручај","ручак","ручам","ручао","ручаш","ручка","ручке","ручки","ручку","ручна","ручне","ручни","ручно","ручну","рушди","рушен","рушим","рушио","рушић","рушиш","рушка","сабат","сабах","сабио","сабир","сабит","сабих","сабља","сабље","сабљи","сабљо","сабљу","сабоа","сабов","сабор","сабра","сабри","сабул","савез","савет","савим","савин","савио","савић","савих","савка","савке","савки","савку","савле","савом","сагао","сагла","сагле","сагли","сагло","сагна","сагне","сагни","сагну","сагох","садам","садик","садим","садио","садна","садни","садно","садња","садње","садњу","садом","садра","садри","садру","садун","сађеш","сажео","сажет","сажме","сажми","сажму","сазва","сазда","сазив","сазна","сазре","сазри","сазру","саида","саинт","сајам","сајић","сајка","сајла","сајле","сајли","сајма","сајме","сајму","сајта","сајту","сакан","сакат","сакиб","сакић","сакоа","сакое","сакои","сакоу","сакри","салај","салас","салаш","салва","салве","салви","салву","салда","салдо","салду","салив","салим","салин","салио","салих","салко","салма","салом","салон","салса","салта","салто","салус","самар","самац","самба","самбе","самби","самбу","самет","самим","самир","самит","самих","самље","самоа","самог","самој","самом","самос","самоу","самрт","самту","самуј","самур","самца","самце","самци","самцу","санак","санан","санда","санде","санди","сандо","санду","санел","санка","санке","санки","санкт","санку","саном","санса","санта","санте","санти","санто","санту","санча","санче","санчо","сањај","сањам","сањао","сањар","сањах","сањаш","сањив","сањин","сањом","саони","сапет","сапић","сапне","сапни","сапом","сапон","сапун","сараж","сарај","сарач","сарен","сарин","сарић","сарка","сарке","сарки","сарма","сарме","сарми","сарму","саром","сартр","сарук","саске","саску","сасма","саспе","саспу","саста","сасуо","сатен","сатир","сатне","сатни","сатом","сатра","сатре","сатро","сатрт","сатру","саћем","сауер","сауна","саунд","сауне","сауну","сафет","сафин","сафир","сафту","сахан","сахат","сахер","сахит","сахне","сахну","сачма","сачме","сачмо","саџак","сашао","сашио","сашка","сашко","сашку","сашом","свађа","свађе","свађи","свађу","свака","сваке","сваки","свако","сваку","свале","свали","сване","свани","свану","сваре","свари","свата","свате","свати","свату","сваће","сваћи","свача","сваче","свачи","свега","сведе","сведи","сведу","свежа","свеже","свежи","свежу","свеза","свезе","свези","свезу","свела","свеле","свели","свело","свелу","свему","свене","свену","свере","свест","света","свете","свети","свето","свету","свећа","свеће","свећи","свећо","свећу","свеца","свеце","свеци","свецу","свече","свиде","свиди","свиђа","свија","свије","свију","свила","свиле","свили","свило","свилу","свима","свиме","свинг","свини","свиња","свиње","свињи","свињо","свињу","свира","свита","свите","свити","свито","свиту","свиће","свићи","свићу","свифт","свица","свице","свици","свиче","свише","свјет","свлак","свога","свода","своде","своди","своду","своја","своје","своји","својо","своју","своме","свому","свота","своте","своту","свраб","сврбе","сврби","сврже","сврне","сврни","сврну","сврси","сврћу","сврха","сврхе","сврху","сврше","сврши","свуда","свуде","свуди","свуку","свући","свуци","свуче","сеада","сеаду","сеарс","себар","севао","севап","севен","север","севил","севне","севну","севра","седај","седам","седао","седат","седаш","седео","седеф","седех","седим","седио","седих","седиш","седла","седло","седлу","седма","седме","седми","седмо","седму","седне","седни","седну","седог","седој","седом","седох","сеђах","сежем","сезам","сезан","сезар","сезер","сеиза","сеизи","сеине","сеири","сејан","сејао","сејах","сејач","сејди","сејем","сејеш","сејма","сејом","сејте","секао","секач","секви","секић","секла","секле","секли","секну","секса","секси","сексу","секта","секте","секти","секто","секту","селак","селам","селен","селеш","селим","селин","селио","селић","селиш","селма","селме","селми","селом","селта","селте","селти","селту","селца","селце","сељак","семић","сенад","сенат","сенди","сенза","сенић","сенка","сенке","сенки","сенко","сенку","сеном","сенсе","сента","сенте","сенти","сенфа","сенфу","сенци","сенче","сенчи","сењак","сењом","сеоба","сеобе","сеоби","сеобу","сеоца","сеоце","сеоцу","сепар","сепет","сепса","сепсе","сепсу","сербе","сербо","серво","серђа","серђо","серем","сереш","серкл","сером","серум","сесил","сести","сетан","сетва","сетве","сетви","сетву","сетер","сетим","сетио","сетих","сетиш","сетна","сетне","сетни","сетно","сетну","сетом","сећај","сећам","сећао","сећаш","сећен","сеула","сеулу","сеуте","сеути","сефер","сефом","сехир","сецка","сечањ","сечем","сечен","сечеш","сечко","сечом","сешће","сешћу","сибер","сибил","сибин","сибир","сивац","сивим","сивић","сивих","сивља","сивље","сивљи","сивог","сивој","сивом","сивцу","сигет","сигма","сигне","сидин","сидни","сидом","сидоу","сидра","сидро","сидру","сиђем","сиђеш","сиђох","сиетл","сижеа","сижее","сижеи","сижеу","сијао","сијач","сијаш","сијед","сијем","сикне","сикну","сикће","сикћу","силан","силва","силве","силви","силву","силим","силио","силић","силиш","силна","силне","силни","силно","силну","силом","силос","симин","симит","симић","симка","симке","симки","симку","симов","симом","симон","симпа","симпо","симпу","симсу","синај","синак","синан","сингл","синди","синић","синка","синко","синку","синов","синод","сином","синоћ","синус","синут","синци","синче","сињав","сињег","сињем","сињим","сињих","сињој","сињом","сињор","сиона","сиону","сипај","сипам","сипао","сипар","сипаш","сипко","сипље","сипљу","сипња","сипње","сирак","сирар","сирах","сирац","сириг","сирил","сирим","сирин","сирио","сирих","сириш","сирка","сирна","сирни","сиров","сиром","сирће","сируп","сирца","сирце","сирци","сирцу","сирче","сисак","сисао","сисар","сиска","сиску","сисли","сисни","ситан","сител","ситик","ситим","ситих","ситна","ситне","ситни","ситно","ситну","ситог","ситом","сићан","сићем","сићић","сићом","сифон","сицпа","сишао","сишем","сишла","сишле","сишли","сишло","сјаја","сјаје","сјаји","сјају","сјала","сјале","сјали","сјало","сјанг","сјате","сјати","сјаха","сјаху","сјаше","сјаши","сјашу","сјеме","сјени","сјуре","сјури","скаја","скака","скала","скале","скали","скалп","скалу","скапа","скаут","скаче","скачи","скачу","сквер","скела","скеле","скели","скелу","скеча","скечу","скида","скиде","скија","скије","скине","скини","скину","скита","скићу","скица","скице","скици","скицу","скичи","склад","склон","склоп","скока","скоко","скоку","скола","сколе","сколи","скора","скоре","скори","скоро","скору","скота","скоте","скоту","скоче","скочи","скрби","скриј","скрио","скрих","скроб","скроз","скрха","скрше","скрши","скува","скује","скупа","скупе","скупи","скупо","скупу","скута","скуте","скуту","скући","скуфи","скуха","скучи","скуша","скуше","скушу","слаба","слабе","слаби","слабо","слабу","слава","славе","слави","славо","славу","слага","слада","сладе","слади","сладу","слађа","слађе","слађи","слађу","слаже","слажи","слажу","слазе","слази","слака","слала","слале","слали","слало","слама","сламе","слами","сламу","слана","слане","слани","слано","слану","слања","слање","слању","слапа","слапу","сласк","сласт","слате","слати","слаће","слаху","слаше","слева","следа","следе","следи","следу","слеђа","слеже","слежу","слеза","слези","слеме","слепа","слепе","слепи","слепо","слепу","слета","слете","слети","слеће","слећи","слећу","слива","сливу","слије","слију","слика","слике","слико","слику","слила","слиле","слили","слило","слина","слине","слини","слити","слици","сличе","сличи","слише","слоба","слобе","слоби","слобо","слобу","слова","слове","слови","слово","слову","слога","слоге","слоги","слогу","сложе","сложи","слози","слоја","слоју","слома","сломе","сломи","слому","слона","слоне","слону","слуга","слуге","слуги","слуго","слугу","служе","служи","слузи","слупа","слуте","слути","слуха","слуху","случи","слуша","сљеза","смаже","смаза","смаил","смаја","смајо","смају","смака","смаку","смали","смање","смањи","смара","смарт","смаћи","смаче","смеде","смеђа","смеђе","смеђи","смеђу","смеја","смеје","смеју","смела","смеле","смели","смело","смелу","смемо","смена","смене","смени","смено","смену","смеон","смера","смерт","смеру","смеса","смесе","смеси","смесу","смета","смете","смети","смету","смећа","смеће","смећу","смеха","смеху","смеша","смеше","смеши","смешу","смије","смију","смиља","смиље","смиљи","смиљу","смион","смире","смири","смита","смиту","смитх","смјер","смјех","смога","смока","смола","смоле","смолу","смота","смоћи","смочи","смрад","смрви","смрде","смрди","смрси","смрти","смрћи","смрћу","смрча","смрче","смрчи","смрчу","смрша","смуђа","смуђе","смука","смуте","смути","снаге","смуке","чапца","снага","снаго","снагу","снађе","смучи","снађи","снађу","снаже","снажи","снази","снаја","снаје","снаји","снајо","снају","снаси","снаћи","снаха","снахе","снахи","снахо","снаху","снаша","снаше","снаши","снашо","снашу","снева","снега","снеге","снегу","снеже","снеки","снела","снеле","снели","снена","снене","снено","снену","снесе","снесу","снети","снива","снижи","снизе","снизи","сније","снила","сниле","снили","снило","снима","сниме","сними","снимо","снити","снобе","снова","снове","снови","снопа","снопу","сносе","сноси","снује","снују","соаве","соаре","собар","собна","собне","собни","собно","собну","собом","содом","сојем","сојин","сојка","сојом","сојуз","сокак","сокић","сокне","сОКОЈ","сокол","соком","солар","солим","солиш","солон","солун","сољен","сомбр","сомић","сомот","сомун","сонда","сонде","сонди","сонду","сонет","соњин","соњом","сопот","сопта","сопче","сорел","сорос","сорош","сорта","сорте","сорти","сорто","сорту","сосир","сосом","сотир","соћко","софка","софке","софра","софре","софри","софро","софру","софта","социо","сочан","сочна","сочне","сочни","сочно","сочну","сошке","сошку","спава","спада","спаде","спазе","спази","спаић","спаја","спајк","спајс","спала","спале","спали","спало","спани","спаса","спасе","спаси","спасо","спасу","спати","спаце","спева","спеву","спенс","спере","сперу","спећи","специ","спиди","спиља","спиље","спиљу","спира","спире","спири","спиро","спирс","спиру","списа","списе","списи","спису","спите","сплав","сплео","сплет","сплин","сплит","споја","споје","споји","споју","спола","споља","спона","споне","спони","спону","спопа","спора","споре","спори","споро","спорт","спору","спота","споту","спрам","спрао","спрат","спрда","спред","спреј","спрем","спрже","спржи","спрти","спруд","спужа","спужу","спуст","спута","спучи","сразу","срама","сраме","срами","сраму","срања","срање","срању","срати","србим","србин","србић","србом","срдан","срдим","срдио","срдит","срдић","срдиш","срдња","срдње","срдњу","срђан","срђен","срђом","среда","среде","среди","среду","среже","среза","срезу","срела","среле","срели","срема","срему","срета","срете","срети","срето","срету","срећа","среће","срећи","срећо","срећу","сржју","сриче","сричу","сркао","сркне","сркни","сркну","сркут","срљај","срљао","срмом","срнић","срнуо","срнче","сроде","сроди","сроза","сроче","срочи","српањ","српка","српко","српку","српња","српњу","српом","српца","српче","сруби","сруче","сручи","сруше","сруши","срцем","срчан","срчем","срчеш","срчка","срџба","срџбе","срџби","срџбу","става","ставе","стави","ставу","стада","стаде","стадо","стаду","стажа","стажу","стаза","стазе","стази","стазо","стазу","стаић","стаја","стаје","стаји","стајн","стају","стака","стаке","стаку","стала","стале","стали","стало","стана","стане","стани","стано","стану","стања","стање","стањи","стању","стапа","стара","старе","стари","старо","старс","старт","стару","стаса","стасу","стате","стати","стаће","стаћу","сташа","сташе","сташу","ствар","створ","стева","стеве","стеви","стево","стеву","стега","стеге","стего","стегу","стежа","стеже","стежи","стежу","стези","стејт","стеко","стеку","стела","стеле","стели","стелт","стелу","стеља","стељу","стена","стенд","стене","стени","стено","стену","стења","стење","стењи","стењу","степа","степе","степи","степу","стећи","стеци","стече","стива","стиву","стига","стида","стиде","стиди","стиду","стиже","стижу","стико","стикс","стила","стило","стилу","стине","стину","стипа","стипе","стипл","стипо","стипу","стира","стире","стири","стиру","стиће","стићи","стиха","стиху","стица","стици","стиче","стичи","стичу","стиша","стога","стогу","стоил","стоја","стоје","стоји","стоју","стока","стоке","стоко","стоку","стола","столе","столу","стона","стоне","стони","стоно","стону","стопа","стопе","стопи","стопу","сторм","стота","стоте","стоти","стото","стоту","стоун","стофо","стоца","стоци","стоцу","стран","страх","стрви","стрем","стрес","стреч","стрже","стрип","стрит","стриц","стрка","стрма","стрме","стрми","стрмо","стрму","стрна","строа","строг","строј","строп","строс","строу","стрпа","стрпе","стрпи","струг","струк","стрча","стрче","стрчи","стуба","стубе","стубу","студе","студи","стуже","стули","ступа","ступе","ступи","ступо","ступу","стури","стуца","стуче","суада","суаде","суаду","субић","сувад","суват","сувим","сувих","сувља","сувље","сувљи","сувог","сувој","сувом","судан","судар","судац","судба","судбе","судби","судбо","судбу","судек","судим","судио","судић","судиш","судни","судња","судњи","судом","суђен","суђић","суеца","суецу","сужањ","сужен","сужња","сужње","сужњи","сужњу","сузан","сузби","сузим","сузио","сузић","сузна","сузне","сузни","сузно","сузну","сузом","суите","сујић","сукао","сукља","сукна","сукне","сукно","сукну","сукња","сукње","сукњи","сукњу","сукоб","сулуд","сулуј","суљам","суљао","суљић","суљну","суљом","сумња","сумње","сумњи","сумњу","сумоа","сумом","сумор","сумоу","сунга","сунем","сунет","сунца","сунце","сунцу","сунча","суоче","суочи","супер","супин","супић","супом","супра","сурва","суреп","сурим","сурих","сурла","сурлу","суров","сурог","сурои","сурој","суром","сусед","сутон","сутра","суфле","сухим","сухић","сухих","сухог","сухој","сухом","суџук","сушак","сушан","сушим","сушио","сушић","сушна","сушне","сушни","сушно","сушну","сушом","сушта","суште","сушти","сушто","сушту","сушца","сфера","сфере","сфери","сферу","сфеци","сфора","сфору","схема","схеме","схеми","схему","схизо","схиме","сцале","сцена","сцене","сцени","сцену","сциле","табак","табан","табао","табаш","табес","табла","табле","табли","табло","таблу","табор","табуа","табуе","табуи","табуу","таван","тавна","тавне","тавни","тавно","тавну","тавом","тавор","тадај","тадић","таипи","таира","тајао","тајац","тајбл","тајга","тајги","тајио","тајић","тајка","тајма","тајмс","тајна","тајне","тајни","тајно","тајну","тајом","такав","такао","такач","таква","такве","такви","такво","такву","такла","такле","такли","такме","такне","такну","таков","таком","такох","такса","таксе","такси","таксу","такта","такту","талас","талац","талвј","талим","талин","талир","талић","талог","талом","талон","талпе","талпи","талпу","талса","талфј","таман","тамаш","тамиш","тамна","тамне","тамни","тамно","тамну","тамом","тампе","тампи","тампу","танак","танан","танга","танге","танги","танго","тангу","танес","танин","танић","танка","танке","танки","танко","танку","таном","тансу","танте","танца","танце","танци","тањем","тањим","тањин","тањио","тањир","тањић","тањих","тањиш","тањом","тањур","таоца","таоце","таоци","таоцу","тапаи","тапет","тапир","тапка","тапше","тапшу","тарем","тареш","тарик","тарин","тарно","таром","тарот","тасев","тасим","тасић","таска","таста","тасте","тасту","татар","татин","татић","татка","татко","татом","таћка","таћке","таћки","таћку","таћно","тафта","тафту","тахир","тахом","тахос","тацит","тацић","тацна","тацне","тацни","тацну","тацуо","тачан","тачер","тачка","тачке","тачки","тачко","тачку","тачна","тачне","тачни","тачно","тачну","тачци","ташић","ташко","ташна","ташне","ташни","ташну","ташта","таште","ташти","ташто","ташту","твари","твена","твида","твиду","твист","твога","твоја","твоје","твоји","твоју","твоме","твому","твора","творе","твори","твору","тврда","тврде","тврди","тврдо","тврду","тврђа","тврђе","тврђи","тврђо","тврђу","тегет","тегла","тегле","тегли","теглу","тегом","тежак","тежег","тежем","тежим","тежио","тежих","тежиш","тежња","тежње","тежњи","тежњу","тежој","тежом","тезга","тезге","тезги","тезгу","тезом","текао","текић","текла","текле","текли","текло","текма","текме","текму","текне","текну","текст","телад","телал","телио","телиш","телма","телом","телца","телцу","тељиг","темат","темељ","темзе","темзи","темим","темом","темпа","темпл","темпо","темпс","темпу","тенац","тенет","тенис","тенка","тенку","теном","тенор","тента","тенци","теоци","тепав","тепај","тепам","тепао","тепић","тепих","тепро","тепца","терај","терам","теран","терао","терах","тераш","терен","терет","терме","термо","терор","терца","терце","тесак","тесан","тесао","тесар","тесач","теско","тесла","тесле","тесли","тесло","теслу","тесна","тесне","тесни","тесно","тесну","теста","тесте","тесто","тесту","тетак","тетка","тетке","тетки","тетку","тетом","тетра","тећко","теута","теуте","тефик","техно","течај","течан","течеш","течић","течна","течне","течни","течно","течну","тешеа","тешен","тешим","тешио","тешић","тешиш","тешка","тешке","тешки","тешко","тешку","тешња","тешње","тешњи","тешњу","тибет","тибор","тибра","тиват","тивта","тивту","тигањ","тигар","тигра","тигре","тигру","тиква","тикве","тикви","тикву","тикет","тиком","тилда","тилде","тилду","тиман","тимар","тимеа","тимес","тимок","тимом","тимор","тимур","тинин","тином","тинту","тињао","тињац","типер","типик","типка","типке","типку","типом","типос","тираж","тиран","тирзе","тирин","тирке","тирол","тиром","тисак","тисен","тиска","тиски","тиску","тисне","тисни","тисом","титан","тител","титла","титле","титов","титом","титра","тифус","тихим","тихић","тихих","тихог","тихој","тихом","тицао","тичић","тишим","тишма","тишме","тишми","тишму","тишој","тиште","тишти","тјера","тјеше","тјеши","ткају","ткала","ткале","ткало","ткаља","ткаље","ткана","ткане","ткани","ткања","ткање","ткању","ткати","ткачи","ткива","ткиво","ткиву","тлака","тлаче","тлачи","тлима","тмина","тмине","тмини","тмину","тмице","тмули","тмуше","тмуши","тобож","тобом","тован","товар","товио","товне","товни","товно","товну","тодић","тодор","токар","токер","токин","токио","токић","током","толар","толић","томаж","томас","томац","томаш","томбу","томин","томић","томка","томке","томов","томом","томца","тонга","тонем","тонеш","тоник","тонић","тонка","тонко","тоном","тонуо","тонус","тонхе","тонцу","тончи","топаз","топал","топао","топио","топић","топиш","топла","топле","топли","топло","топлу","топом","топор","топос","топот","топта","топћу","топуз","торањ","торба","торбе","торби","торбу","торес","торзо","торна","торне","торно","торња","торњу","тором","торта","торте","торти","торто","торту","тоска","тоске","тоску","тоста","тосту","тотал","тотем","тотом","тофуа","тоциљ","точак","точан","точим","точио","точир","точиш","точка","точке","точки","точку","точна","точно","тошев","тошин","тошић","тошом","трава","траве","трави","траво","траву","трага","трагу","траде","траже","тражи","траја","траје","трају","трака","траке","трако","тракт","траку","траље","транс","трапа","трапу","траса","трасе","траси","траст","трасу","трата","трати","траће","траћи","трафо","траци","трацк","трача","трбић","трбух","трган","тргао","тргла","тргли","тргло","тргне","тргни","тргну","тргом","тргох","треба","требе","треби","требо","требу","трејд","трема","треме","треми","тремо","трему","трена","тренд","трент","трену","трења","трење","трењу","тресе","треси","тресу","трећа","треће","трећи","трећу","трефл","тречи","тржан","тржна","тржни","тржно","трзај","трзам","трзан","трзао","трзаш","трзне","трзну","триво","трија","трију","трика","трико","трику","трима","триод","триом","трипа","трипи","трипо","трипу","трира","трифо","трица","трице","трици","трицк","трицу","триша","тркао","тркач","тркља","тркљи","тркне","тркни","трком","трљај","трљам","трљао","трљаш","трмке","трмки","трнић","трнка","трнке","трнку","трнов","трном","трнут","трнци","трњак","трњем","трога","троја","троје","троји","трола","троле","троли","тролу","трома","троме","троми","тромо","трому","трона","троне","трону","тропа","тропе","тропи","троха","троше","троши","трпај","трпам","трпао","трпаш","трпео","трпех","трпим","трпио","трпиш","трпка","трпке","трпко","трпку","трпни","трпно","трска","трске","трски","трску","трста","трсту","трсци","тртља","труба","трубе","труби","трубу","труда","труде","труди","труду","трује","трују","трула","труле","трули","труло","трулу","труна","труне","труни","труну","труње","трупа","трупе","трупи","трупу","труса","труст","трчао","трчах","трчим","трчиш","трчка","трчке","тршав","тршић","тубић","тувим","тувић","тугом","тугуј","тудеј","тудор","туђег","туђем","туђим","туђин","туђио","туђих","туђиш","туђој","туђом","тужан","тужба","тужбе","тужби","тужбу","тужен","тужим","тужио","тужиш","тужна","тужне","тужни","тужно","тужну","тузла","тузле","тузли","тузлу","тукао","тукац","тукла","тукле","тукли","тукло","тукох","тукце","тукци","тулац","тулбе","тулга","тулио","тулић","тулуз","тулум","туљак","туљан","тумач","тумба","тумбе","тумор","тунел","тунис","туњав","туоми","тупав","тупан","тупим","тупио","тупих","тупља","тупље","тупљи","тупог","тупом","туран","турао","турах","тураш","турбе","турбо","турим","турио","турих","турка","турке","турко","турне","турну","турња","туров","туром","турци","турче","турчи","тусић","тутањ","тутер","тутин","тутић","тутка","тутне","тутну","тутње","тутњи","тутњу","тутом","тутор","тутса","тутси","тутун","туцај","туцам","туцан","туцао","туцаш","туцић","тучак","тучем","тучен","тучеш","тучић","тучка","тучом","тушем","тушта","туште","тушти","ћазим","ћакић","ћалац","ћалов","ћамил","ћамиљ","ћампи","ћанда","ћанка","ћапин","ћапио","ћарио","ћаска","ћасом","ћатић","ћаћин","ћаћић","ћебад","ћебић","ћевап","ћекао","ћелав","ћелап","ћелић","ћелом","ћемер","ћерам","ћеран","ћерао","ћераш","ћерим","ћерка","ћерке","ћерки","ћерко","ћерку","ћерци","ћесар","ћесић","ћесто","ћетко","ћивот","ћилер","ћилим","ћирић","ћириш","ћирка","ћирко","ћиром","ћитав","ћитап","ћићко","ћифта","ћифте","ћколу","ћлана","ћовек","ћопав","ћопић","ћорав","ћорак","ћорац","ћорда","ћорде","ћорић","ћорци","ћосав","ћосић","ћосом","ћошак","ћошка","ћошку","ћубом","ћувик","ћукић","ћулав","ћулум","ћумез","ћумур","ћупић","ћупом","ћурак","ћуран","ћурић","ћурка","ћурке","ћурки","ћурку","ћурче","ћусеа","ћутао","ћутах","ћутим","ћутиш","ћутке","ћутња","ћутње","ћутњи","ћутњу","ћуфте","ћушио","ћушка","ћушке","ћушку","ћушне","ћушну","убава","убаве","убави","убаво","убаву","убада","убаце","убаци","убеде","убеди","убере","уберу","убија","убије","убију","убила","убиле","убили","убило","убира","убире","убиру","убита","убити","убиће","убићу","убица","убице","убици","убицу","убише","убога","убоге","убоги","убого","убогу","убода","убоде","убоди","убоду","убоја","убоје","убола","уболи","уболо","убран","убрао","убрах","убрза","убрзо","убрус","убска","убске","уваже","уважи","увала","увале","ували","увалу","уваља","увате","увати","уведе","уведи","уведу","увеже","увежу","увеза","увезе","увези","увезу","увела","увеле","увели","увело","увелу","увене","увену","увере","увери","увета","увету","увећа","увеће","увече","увида","увиде","увиди","увиду","увиђа","увија","увије","увију","увила","увиле","увило","увире","увиру","увити","увићу","увише","увода","уводе","уводи","уводу","увоза","увозе","увози","увозу","уврио","уврне","уврни","уврте","уврће","уврћу","увуку","увући","увуци","увуче","угађа","угази","угара","угари","угасе","угаси","угиба","угине","угину","углас","углед","углом","угљар","угљем","угљен","угљик","угнут","угода","угоде","угоди","угоду","угоје","угоји","угоне","угони","угору","угреј","угрен","угриз","угриј","угура","угуше","угуши","удава","удаве","удави","удаја","удаје","удаји","удају","удала","удале","удали","удаље","удаљи","удамо","удара","ударе","удари","удару","удата","удате","удати","удату","удаће","удаћу","удбаш","удела","уделе","удели","удело","уделу","удене","удени","удену","удеса","удесе","удеси","удесу","удиви","удике","удила","удима","удина","удини","удити","удица","удице","удици","удицу","удише","удиши","удишу","удова","удове","удови","удову","удоми","удубе","удуби","удуши","уђемо","уђење","уђете","уђимо","уђите","уђоше","ужади","ужање","ужаре","ужари","ужаса","ужасе","ужаси","ужасу","ужега","ужеже","ужежи","ужени","ужета","ужету","ужећи","ужива","уживи","уживо","ужиже","ужима","ужина","ужине","ужини","ужину","ужити","ужиће","ужица","ужице","ужицу","узађе","узама","узана","узане","узани","узано","узану","узаћи","узбио","узвик","узвио","узгој","узгон","уздај","уздам","уздао","уздах","уздаш","уздин","уздом","уздуж","узела","узеле","узели","узело","узета","узете","узети","узето","узету","узећа","узеће","узећу","узеше","узида","узиђе","узиђи","узиђу","узима","узина","узићи","узица","узице","узици","узицу","узлаз","узлет","узмак","узмем","узмеш","узнео","узнет","узник","узора","узоре","узори","узору","узред","узрео","узрим","узрок","узуса","узусе","узуси","узусу","уигра","ујака","ујаке","ујаку","ујаци","ујаче","уједа","уједе","уједи","уједу","ујела","ујеле","ујели","ујком","ујном","укаже","укажи","укажу","указа","указе","укази","указу","укаља","укива","укида","укине","укини","укину","укипе","укића","уклео","уклет","укова","укока","укопа","укопи","укопу","укора","укоре","укори","укору","укоси","укосо","укоче","укочи","украј","украо","украс","укруг","укрца","укува","укуса","укусе","укуси","укусу","укуца","улага","улаже","улажу","улаза","улазе","улази","улазу","улака","улаке","улари","улару","улаци","улбек","улева","улево","улема","улеме","улеми","улему","улете","улети","улеће","улећи","улећу","улива","улије","улију","улила","улиле","улили","улило","улиса","улису","улити","улиће","улица","улице","улици","улицу","улише","улкер","улман","улова","улове","улови","улову","улога","улоге","улогу","уложе","уложи","улози","улома","уломи","улпин","улрих","улсен","ултра","улудо","улуче","улучи","улцињ","уљана","уљане","уљани","уљано","уљара","уљаре","уљари","уљару","уљаст","уљеза","уљезе","уљези","уљезу","уљећи","уљима","уљних","уљуди","умака","умаке","умаку","умали","умало","умање","умањи","умара","умаћи","умаци","умаче","умачи","умачу","умеју","умела","умеле","умели","умело","умемо","умења","умење","умењу","умере","умери","умесе","умеси","умета","умете","умети","умећа","умеће","умећи","умећу","умеци","умеша","умива","умије","умију","умила","умиле","умили","умиља","умире","умири","умиру","умити","умићу","умише","умник","умним","умних","умног","умној","умном","умњак","умова","умове","умови","умоле","умоли","умора","уморе","умори","умору","умота","умоче","умочи","умрем","умрех","умреш","умрла","умрле","умрли","умрло","умрлу","умрља","умује","умују","умуте","умути","умући","умуче","унела","унеле","унели","унело","унесе","унеси","унесу","унета","унете","унети","унето","унету","унеће","унећу","унеше","униђе","унизе","унизи","унија","уније","унији","унију","унион","ункаш","унмик","уноса","уносе","уноси","уносу","унска","унука","унуке","унуку","унуци","унуче","унхцр","уњкав","уњкаш","уопће","уочен","уочим","уочио","уочиш","уоште","упада","упаде","упади","упаду","упала","упале","упали","упало","упалу","упану","упаши","упела","упели","упере","упери","упети","упећи","упеца","упече","упија","упије","упију","упила","упиле","упили","упило","упиљи","упиње","упињу","упире","упири","упиру","уписа","упису","упита","упите","упити","упиту","упиће","упићу","упише","упиши","упишу","уплео","уплив","упола","упоље","упора","упоре","упори","управ","упрво","упрем","упрла","упрле","упрли","упрло","упрља","упрта","упрте","упрти","упрту","упута","упуте","упути","упуту","упуца","ураде","уради","урађа","урала","уралу","урами","урана","урани","урања","ураса","урасу","урбан","урбар","уреда","уреде","уреди","уреду","уреже","урежи","урежу","уреза","урези","уреса","урећи","урија","урије","урију","урила","урило","урина","урлај","урлам","урлао","урлаш","урлик","урлих","урном","уроде","уроди","урока","уроке","уроне","урони","урота","уроту","уроци","уроче","уроша","уроше","урошу","урсић","уруче","уручи","уруши","урчић","усаде","усади","усаид","усала","усаме","усами","усана","усвој","усева","усеве","усеви","уседа","уседе","усека","усеке","усеку","уселе","усели","усећи","усеца","усеци","усија","усили","усири","усишу","уским","уских","уског","уској","ускок","уском","ускрс","услед","услов","усљед","уснем","усним","уснио","усних","усниш","усног","усном","уснуо","уснух","усова","усосе","успем","успео","успех","успеш","успио","успне","успни","успну","успон","успут","усред","устав","устај","устао","устах","устић","устук","уступ","усуда","усуде","усуди","усуду","усула","усули","усута","усути","усуто","усуће","усхте","утаја","утаје","утаји","утају","утање","утањи","утапа","утаче","утвић","утега","утеже","утеку","утера","утеси","утећи","утеха","утехе","утехо","утеху","утеци","утече","утеше","утеши","утире","утиру","утиће","утица","утиче","утичу","утиша","уткан","уткао","утови","утока","утоку","утоле","утоли","утоне","утону","утопе","утопи","уторе","уточи","утрке","утрли","утрне","утрну","утрпа","утрти","утрча","утрчи","утуви","утука","утуку","утуле","утули","утући","утуца","утуци","утуче","ућари","ућини","ућута","ућуте","ућути","уфати","уфура","ухода","уходе","уходи","уходо","уходу","уцело","уцена","уцене","уцени","уцену","уцрта","учаху","учаше","учена","учене","учени","учено","учену","учења","учење","учењу","учећа","учеће","учећи","учила","училе","учили","учило","учимо","учине","учини","учино","учита","учите","учити","учиће","учићу","учише","учкур","учмао","учпмб","учтив","ушара","ушета","ушије","ушију","ушима","ушити","ушица","ушице","ушицу","ушљив","ушним","ушних","уштап","уштва","уштви","уштво","уштрб","ушћем","ушуља","ушуња","ушути","фабио","фабри","фагот","фадил","фадиљ","фазан","фазли","фазна","фазне","фазни","фазно","фазну","фазом","фазон","фаика","фаире","фајда","фајде","фајду","фајед","фајта","фајте","факат","факир","факса","факсу","факта","факте","факти","факто","факту","фалез","фалим","фалио","фалун","фалус","фамом","фанки","фанта","фанту","фарад","фарба","фарбе","фарби","фарбу","фарма","фарме","фарми","фарму","фарса","фарсе","фарси","фарсу","фарук","фатах","фатић","фатом","фатос","фатум","фаула","фауна","фауне","фауни","фауну","фауст","фацто","фебре","федер","федор","фејзи","фејна","фејта","фектс","фелер","фелон","феман","фемић","фемка","фенек","фенол","феном","фенси","фењер","ферал","ферат","ферда","фердо","ферид","ферик","ферис","ферма","ферме","ферми","ферму","ферст","фесом","феста","фесте","фесту","фетаи","фетер","фетиш","фетом","фетса","фетсе","фетус","феуда","феуди","фехер","фехим","фехми","фешта","феште","фешти","фешту","фигом","фидан","фидел","фидес","физир","фијат","фијук","фикса","фиксе","фиксу","фикус","филер","филин","филип","филић","филма","филму","филом","филца","финац","финим","финих","финиш","финка","финке","финку","финог","финој","фином","финца","финци","фиока","фиоке","фиоку","фиона","фиоти","фиоци","фирер","фирма","фирме","фирми","фирму","фирст","фирчи","фитиљ","фићок","фићом","фифти","фишек","фишер","фишић","фјорд","флајт","флаша","флаше","флаши","флашу","флегу","флека","флеке","флеку","флерт","флеци","флиса","флису","флојд","флора","флоре","флори","флоро","флору","флота","флоте","флоти","флоту","флуид","флукс","флуор","фоаје","фогел","фогом","фодор","фојгт","фокер","фокин","фокса","фокус","фолић","фолка","фолке","фолку","фонас","фонда","фонду","фонем","фонет","форбс","форда","форде","форду","форин","форма","форме","форми","форму","форст","аааљ<","форум","форфе","форца","форце","фосил","фотић","фотке","фотон","фотос","фочић","фраза","фразе","фрази","фразу","фрака","фраку","франа","фране","франк","франо","франс","франу","франц","фрања","фрање","фрањи","фрањо","фрању","фрапе","фреди","фреја","френд","френк","френч","фресх","фриго","фрида","фриде","фриду","фриза","фризу","фрица","фркет","фркић","фркне","фркну","фркће","фркћу","фрлог","фројд","фрома","фронт","фрула","фруле","фрули","фруло","фрулу","фрфља","фсово","фуада","фуаду","фукоа","фукса","фуксу","фулер","фунта","фунте","фунти","фунту","фурај","фурао","фурер","фуроа","футог","футур","фућка","фушер","хабер","хавел","хаген","хагом","хазер","хазна","хазну","хазур","хаику","хаиме","хаине","хаира","хаити","хаифа","хаифе","хаифи","хајао","хајат","хајда","хајде","хајди","хајду","хајек","хајем","хајеш","хајка","хајке","хајки","хајко","хајку","хајмо","хајне","хајнц","хајош","хајра","хајре","хајте","хајци","хакер","халал","халас","халве","халер","халеу","халид","халил","халим","халка","халки","халку","халом","хаљиљ","хамам","хамас","хамди","хамер","хамза","хамзе","хамзу","хамид","хамом","ханан","ханић","ханка","ханке","ханки","ханом","ханса","хансу","хаоса","хаосе","хаосу","хапса","хапсе","хапси","хапсу","харај","харам","харао","харач","хараш","харви","харди","харем","харис","хармс","харун","харфа","харфе","харфи","харфу","харчи","хасан","хасид","хасна","хасне","хасну","хатар","хатор","хауба","хауби","хаубу","хауса","хафиз","хаџић","хашим","хашиш","хашка","хашке","хашки","хашко","хашку","хбсаг","хвала","хвале","хвали","хвало","хвалу","хвара","хвару","хвата","хвати","хеарт","хебел","хегел","хејнс","хекла","хелас","хелга","хелге","хелен","хелмс","хељда","хељде","хељду","хенан","хенка","хенри","херић","херој","херст","херта","херте","хесеа","хесен","хесус","хефта","хефту","хибер","хидра","хидре","хидро","хидру","хијат","хилда","хилде","хилма","хилми","хилмо","хилсу","химба","химзо","химки","химна","химне","химни","химну","хинду","хинић","хинка","хинко","хипер","хипик","хиром","хисар","хисен","хисни","хитај","хитам","хитан","хитао","хитар","хитац","хиташ","хитна","хитне","хитни","хитно","хитну","хитња","хитњи","хитом","хитра","хитре","хитри","хитро","хитру","хицем","хјуит","хлада","хладе","хлади","хладу","хлаче","хлеба","хлебе","хлебу","хлора","хљеба","хљебе","хљебу","хмеља","хобоа","хобор","хобса","ходај","ходам","ходао","ходах","ходач","ходаш","ходим","ходио","ходих","ходиш","ходна","ходне","ходно","ходом","хођах","хозеа","хозеу","хокеј","хокла","хокса","холмс","холом","хомем","хомен","хомер","хомут","хонда","хопић","хопла","хорда","хорде","хорди","хорду","хорна","хорне","хорну","хором","хорор","хорст","хорхе","хосеа","хосни","хотел","хотео","хотић","хоћах","хоћеш","хоусе","хоџин","хоџић","хоџом","храма","храме","храму","храна","хране","храни","храно","храну","храст","хрбат","хрват","хрида","хриди","христ","хрлио","хрлиш","хрнић","хрома","хроме","хроми","хромо","хрому","хрпом","хрпта","хрупи","хрушт","хрчак","хрчеш","хрчка","хрчки","хрчци","хтеде","хтела","хтеле","хтели","хтело","хтења","хтење","хтењу","хтети","хтеће","хтеше","хуана","хуане","хуану","хубеј","хубер","худим","худих","худом","хујао","хукић","хукне","хукну","хуком","хукти","хукће","хулио","хулиш","хулом","хуљић","хуљом","хумак","хуман","хумац","хумка","хумке","хумки","хумку","хумом","хумор","хумус","хумца","хумци","хунта","хунте","хунту","хупер","хурић","хусар","хучан","хучеш","хучна","хучне","хучно","хучну","хушка","цагић","цадик","цајић","цакан","цакић","цакле","цакли","цамај","цанић","цаном","цардс","царев","царем","царић","царка","царом","царуј","цачић","цвајг","цвало","цваст","цвата","цвате","цвати","цвату","цвеја","цвеје","цвејо","цвели","цвета","цвете","цвети","цвету","цвећа","цвеће","цвећу","цвија","цвијо","цвика","цвико","цвиле","цвили","цвите","цврка","цврче","цврчи","цебит","цевке","цевна","цевне","цевни","цегер","цедар","цедио","цеђен","цезар","цекин","цекић","целац","целер","целив","целим","целић","целих","целов","целог","целој","целом","целца","целцу","цемин","ценик","ценим","ценио","ценић","цениш","ценка","ценов","ценом","ценпи","цента","центи","центу","цењен","цепај","цепак","цепам","цепан","цепао","цепач","цепаш","цепка","цепом","цепти","церак","церар","церио","церић","церна","церне","церну","церов","цером","цесар","цесид","цесна","цеста","цесте","цести","цесто","цесту","цефта","цецин","цецић","цецом","цивил","цигла","цигле","цигли","цигло","циглу","цијев","цијел","цијук","цикао","цикла","цикне","цикну","циком","цилић","циљај","циљам","циљао","циљаш","циљем","циљна","циљне","циљни","циљно","циљну","цимам","цимао","цимаш","цимер","цимет","цимне","цимну","циник","цинка","ципал","ципар","цирих","цирка","циркл","цирку","цирнт","цирус","циста","цисте","цисто","цисту","цитат","цитра","цитру","цифра","цифре","цифри","цифру","цицка","цицом","цичао","цичић","цмаче","цмачу","цмиље","цовек","цокић","цокну","цокће","цолић","цонић","цотав","црвак","црвац","црвен","црвић","црвка","црвке","црвку","црвом","црева","црево","цреву","цредо","црепа","црепу","цркао","црква","цркве","цркви","цркво","цркву","цркла","цркле","цркли","цркло","цркне","цркни","цркну","цркох","црнац","црним","црнио","црнић","црних","црнка","црнке","црног","црној","црном","црнца","црнце","црнци","црнцу","црнче","црнчи","црњак","црњим","црњих","црњом","црпао","црпем","црпео","црпеш","црпим","црпио","црпиш","црпка","црпла","црпле","црпли","црпне","цртај","цртам","цртао","цртаћ","цртач","црташ","цртеж","цртом","цугер","цукар","цукић","цупка","цурим","цурин","цурио","цуром","цуцам","цуцах","цуцић","цуцка","цуцла","цуцлу","чабар","Чабар","чабра","чабре","чабро","чабру","чавез","чавес","Чавић","чавка","чавке","чавки","чавли","чавче","чагаљ","чадеж","чадор","чађав","чазов","Чаира","Чаиру","чајем","чајка","чајлд","чајна","чајне","чајни","чајно","чајну","чакар","чакић","чакља","чакље","чакра","Чалић","чалма","чалме","чалму","чамац","чамим","чамио","чамов","чамом","чамца","чамце","чамци","чамцу","чамче","чанак","чанда","чанка","чанке","чанку","чанци","чанче","чапек","чапел","чапља","чапље","чапљи","чапур","чаран","чарда","чарде","чарди","чарка","чарке","чарки","чарку","Чарли","Чарлс","чарна","чарне","чарни","чарну","часак","часка","часку","часна","часне","часни","часно","часну","часом","часте","части","чатма","чаура","чауре","чаури","чауру","чауша","чауше","чауши","Чачак","чачић","чачка","Чачку","чашка","чашом","чашћу","чвора","чвору","чврга","чврге","чвргу","чврст","чегар","чегру","чедан","Чедић","чедна","чедне","чедни","чедно","чедну","чедом","чежек","чежња","чежње","чежњи","чежњо","чежњу","чезне","чезни","чезну","чејни","чекај","чекам","чекао","чеках","чекаш","чекић","чекни","чеком","чекрк","чекуа","челар","челзи","челик","челић","челна","челне","челни","челно","челну","челом","Челси","чељад","чемер","ченга","чеона","чеоне","чеони","чеону","чепац","чепел","чепом","черга","черге","черги","черго","чергу","черек","черка","черне","черни","чесан","ческа","чески","ческо","ческу","чесма","чесме","чесми","чесму","чесна","чесне","чесни","чесно","чесну","честа","честе","чести","често","честу","Четић","четка","четке","четки","четку","четне","четни","четно","четом","четри","чеунг","чехов","Чехом","чечао","чешаљ","чешао","чешеш","чешић","чешка","Чешка","чешке","чешки","чешко","чешку","чешља","чешљу","чешња","чешћа","чешће","чешћи","чешћу","чибук","чивит","чивот","чигра","чигре","чигри","чигру","чизма","чизме","чизми","чизму","чијег","чијем","чијим","чијих","чијој","чијом","чикам","чикао","чиков","чикош","чилаш","Чилеа","чилер","Чилеу","чилио","чилић","чилом","чиним","чинио","чиних","чиниш","чином","чињен","чиода","чиоде","чиоду","чиопа","чипка","чипке","чипки","чипку","чипом","чирак","чиром","чиста","Чиста","чисте","чисти","чисто","чисту","читав","читај","читак","читам","читан","читао","читах","читач","читаш","читка","читке","читко","читку","чифта","чифте","чичак","чичин","чичка","чичке","чичко","чичом","чичци","чкаља","чкаљи","чкаљу","чкиље","члана","члане","члани","члано","члану","чмава","чмара","чмару","чобан","чобић","човек","Човић","чојом","чокањ","чокић","чокот","чолак","Чолић","чомић","чонић","чонси","чопић","чопор","чорба","чорбе","чорби","чорбу","чорда","чосер","чохан","чохом","чочек","чошак","чтеца","чуанг","чубар","чубра","чубро","чувај","чувам","чуван","чувао","чувар","чувах","чуваш","чувен","чувши","чудак","чудан","чудим","чудио","чудиш","чудна","чудне","чудни","чудно","чудну","чудом","чујан","чујем","чујеш","чујмо","чујна","чујне","чујни","чујно","чујну","чујте","чукаљ","Чукић","чукље","чукну","чукун","чукур","чулав","чулан","чулио","чулић","чулна","чулне","чулни","чулно","чулну","чулом","чуљак","чуљић","Чумић","чумом","чунак","чунка","чунку","чуном","чупав","чупам","чупао","чупаш","Чупић","чупка","чусмо","чусте","чутао","чућеш","чучак","чучањ","чучао","чучим","чучиш","чучне","чучни","чучну","чучња","чучук","Џабић","џавид","џавит","џадом","Џајић","џајом","џакан","џаком","џамбо","џамић","џарао","џарић","џафер","Џаџић","џевад","џеват","џезва","џезве","џезву","џезом","џелат","џемал","џемат","џемил","џемом","Џенет","џепна","џепне","џепни","џепно","џепну","џепом","Џерси","џибра","џибру","џилит","џинић","џином","џинса","џипом","џихад","џоинт","Џојса","џокеј","џокер","Џокић","џомба","џоњам","Џорџа","џудоа","џудом","џудоу","џукац","џукић","џукца","џукце","џукци","џукцу","џунка","шабан","шабат","шабац","шабић","шавом","шагал","шаипа","шајак","шајин","шајка","шајке","шајки","шајку","шакал","шакер","шакић","шаком","шалго","шалим","шалио","шалиш","шалом","шаљем","шаљеш","шаљив","шаман","шамар","шамац","шамла","шамот","шамца","шамцу","шанац","шанел","шанка","шанку","шаном","шанса","шансе","шанси","шансу","шанта","шанув","шанца","шанцу","шапат","шапер","шапић","шапка","шапке","шапки","шапку","шапне","шапни","шапну","шапом","шапће","шапћи","шапћу","шапца","шапцу","шарам","шаран","шарао","шараф","шарац","шараш","шарен","шарет","шарже","шаржи","шарик","шарић","шариф","шарка","шарке","шарки","шарко","шарку","шарла","шарма","шарму","шарну","шаров","шаром","шарон","шарца","шарцу","шатор","шатра","шатре","шатри","шатро","шатру","шаћир","шафољ","шахом","шахте","шачни","шашав","шашић","шашки","шваба","швабе","шваби","швабо","швабу","шваља","шваље","шварц","шведа","шведе","шверц","шворц","шврља","шебој","шевар","шевац","шевек","шевет","шевић","шевиш","шевче","шегрт","шеика","шеику","шеици","шејка","шејла","шелак","шемић","шемом","шемса","шемсе","шемси","шемсу","шеним","шеноа","шенуо","шепав","шепак","шепут","шерет","шериф","шерон","шерпа","шерпе","шерпи","шерпу","шеста","шесте","шести","шесто","шесту","шетај","шетам","шетао","шетах","шетач","шеташ","шетка","шетња","шетње","шетњи","шетњу","шећер","шећеш","шефер","шефик","шефко","шефом","шехер","шехит","шехић","шешељ","шешир","шешић","шешум","шибај","шибан","шибао","шибља","шибље","шибљу","шибни","шибом","шивши","шизма","шизме","шизми","шизму","шијак","шијан","шијем","шијеш","шијом","шикља","шикне","шикну","шикће","шикћу","шилер","шилом","шилте","шилту","шиљак","шиљат","шиљка","шиљке","шиљци","шимић","шимон","шимун","шиник","шинко","шином","шинто","шињел","шипак","шипић","шипка","шипке","шипки","шипко","шипку","шипци","ширак","ширег","ширем","ширен","ширим","ширио","ширит","ширић","ширих","шириш","ширли","широв","широј","широк","широм","шисел","шићар","шифер","шифон","шифра","шифре","шифри","шифру","шишај","шишам","шишао","шишаш","шишић","шишка","шишке","шишку","шиште","шишти","шкамп","шкара","шкаре","шкарт","шкеро","шкија","шкије","шкију","шкиље","шкиљи","шкода","шкоде","шкоди","шкоду","шкоза","школа","школе","школи","школо","школу","шкољу","шкопе","шкоро","шкота","шкоти","шкрга","шкрге","шкрип","шкрта","шкрте","шкрти","шкрто","шкрту","шкрца","шлага","шлема","шлему","шлепа","шлепу","шлица","шлицу","шлога","шломо","шљака","шљаке","шљаку","шљама","шљаци","шљеме","шљива","шљиве","шљиви","шљиву","шљока","шљука","шљуке","шмиру","шмита","шмрца","шмрче","шмрчу","шнала","шнале","шогор","шодер","шодић","шојгу","шојић","шојка","шојке","шоком","шолак","шољић","шољом","шомло","шоном","шоњав","шопен","шопов","шопом","шорић","шором","шотић","шотка","шотку","шотра","шотре","шоћом","шофер","шпага","шпаге","шпагу","шпада","шпаде","шпаду","шпајз","шпати","шпигл","шпила","шпилу","шпиља","шпиљи","шпиљу","шпира","шпире","шпиро","шпиру","шпица","шпице","шпици","шпицу","шприц","шрафа","штаба","штабу","штави","штајн","штака","штаке","штаку","штала","штале","штали","шталу","штанд","штапа","штапу","штаци","штеде","штеди","штене","штета","штете","штети","штето","штету","штива","штиво","штиву","штима","штипа","штирк","штита","штите","штити","штиту","штици","штицу","штоса","штосу","штофа","штофу","штрик","штрпц","штрук","штрца","штрче","штрчи","штује","штују","штука","штуке","штуку","штула","штуле","штура","штуре","штури","штуро","штуца","шћапе","шћену","шћепа","шубић","шугав","шугом","шудра","шуија","шуију","шуица","шујов","шујом","шукер","шукић","шукље","шукри","шулић","шулце","шуљак","шуман","шумар","шумим","шумна","шумне","шумни","шумно","шумом","шумор","шунка","шунке","шунку","шуњам","шуњао","шуњаш","шупак","шупаљ","шупку","шупља","шупље","шупљи","шупљу","шупом","шупци","шурак","шуром","шуруј","шутер","шутим","шутић","шутиш","шутка","шутке","шутне","шутни","шутну","шутња","шутње","шутњи","шутњу","шушањ","шушка","шушке","шушне","шушну","шушња","шуште","шушти","шчепа"];allowedGuesses=[...moreAllowedGuesses,...allowedGuesses],(duplicates=allowedGuesses.filter((e,t)=>allowedGuesses.indexOf(e)!=t)).length&&console.error("duplicate allowedGuesses",duplicates);const allWords=[...answers,...allowedGuesses];class GameHistory{save(e,t){var o=localStorage.getItem("game-history");const s=o?JSON.parse(o):{};s[t]=e,localStorage.setItem("game-history",JSON.stringify(s))}load(e){return this.loadAll()[e]}loadAll(){var e=localStorage.getItem("game-history");return e?JSON.parse(e):{}}}const history$1=new GameHistory;class RechkoBoard extends IoElement{static get Style(){return`
      :host {
        overflow: hidden;
        padding: 5px;
        margin: 1em 1em 1em 1em;
        box-sizing: border-box;
      }
      :host .correct,
      :host .present,
      :host .absent {
        color: white;
      }
      :host .correct {
        background-color: #6aaa64 !important;
      }
      :host .present {
        background-color: #c9b458 !important;
      }
      :host .absent {
        background-color: var(--io-background-color-light) !important;
      }
      :host .row {
        display: flex;
        width: calc(var(--tile-size) * 5);
        height: var(--tile-size);
        margin: 0 auto;
      }
      :host .tile {
        height: calc(var(--tile-size) - 6px);
        width: calc(var(--tile-size) - 6px);
        margin-right: 5px;
        font-size: 3rem;
        line-height: 2rem;
        font-weight: bold;
        vertical-align: middle;
        text-transform: uppercase;
        user-select: none;
        position: relative;
      }
      :host .tile.filled {
        animation: zoom 0.2s;
      }
      :host .tile .front,
      :host .tile .back {
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      :host .tile .front {
        border: 1px solid var(--io-color-border);
      }
      :host .tile .back {
        transform: rotateX(180deg);
      }
      :host .tile.revealed .front {
        transform: rotateX(180deg);
      }
      :host .tile.revealed .back {
        transform: rotateX(0deg);
      }
      @keyframes zoom {
        0% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      :host .shake {
        animation: shake 0.5s;
      }
      @keyframes shake {
        0% {
          transform: translate(1px);
        }
        10% {
          transform: translate(-3px);
        }
        20% {
          transform: translate(3px);
        }
        30% {
          transform: translate(-3px);
        }
        40% {
          transform: translate(3px);
        }
        50% {
          transform: translate(-3px);
        }
        60% {
          transform: translate(3px);
        }
        70% {
          transform: translate(-3px);
        }
        80% {
          transform: translate(3px);
        }
        90% {
          transform: translate(-3px);
        }
        100% {
          transform: translate(1px);
        }
      }
      @media (max-width: 400px) {
        :host {
          padding: 1px;
        }
        :host .row {
          width: calc(var(--tile-size) * 5);
          height: var(--tile-size);
        }
        :host .tile {
          font-size: 2rem;
          margin-right: 1px;
          height: calc(var(--tile-size) - 2px);
          width: calc(var(--tile-size) - 1.2px);
        }
      }
    `}static get Properties(){return{board:{value:[],observe:!0},shakeRowIndex:-1,translate:{value:"no",reflect:1}}}onResized(){var e=this.getBoundingClientRect(),e=Math.min(e.width,5*e.height/6)/5;this.style.setProperty("--tile-size",e+"px")}changed(){this.template(this.board.map((e,t)=>["div",{class:"row "+(this.shakeRowIndex===t&&"shake")},e.map((e,t)=>["div",{class:`tile ${e.letter&&"filled"} `+(e.state&&"revealed")},[["div",{class:"front",style:{"transition-delay":300*t+"ms"}},e.letter],["div",{class:"back "+e.state,style:{"transition-delay":300*t+"ms"}},e.letter]]])]))}}RegisterIoElement(RechkoBoard);class RechkoKey extends IoElement{static get Style(){return`
      :host {
        margin: 0 3px 0 0;
        display: flex;
        flex: 1 0 auto;
      }
      :host button {
        font-family: inherit;
        font-weight: bold;
        border: 0;
        height: 58px;
        border-radius: 4px;
        margin: 0;
        padding: 0;
        cursor: pointer;
        user-select: none;
        background-color: var(--io-background-color-dark);
        color: var(--io-color);
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
      }
      :host io-icon {
        margin: auto;
        fill: var(--io-color);
      }
      :host[big] {
        flex: 3;
      }
      :host:last-of-type {
        margin: 0;
      }
      :host[state=correct] button,
      :host[state=present] button,
      :host[state=absent] button {
        color: white !important;
      }
      :host[state=correct] button {
        background-color: #6aaa64 !important;
      }
      :host[state=present] button {
        background-color: #c9b458 !important;
      }
      :host[state=absent] button {
        background-color: var(--io-background-color-light) !important;
      }
    `}static get Properties(){return{key:"",big:{value:!1,reflect:1},state:{value:"",reflect:1}}}onClick(e){this.dispatchEvent("key",this.key,!0)}keyChanged(){this.big=1<this.key.length}changed(){this.template([["button",{"on-click":this.onClick},["Backspace"!==this.key?["span",this.key]:["io-icon",{icon:"buttons:backspace"}]]]])}}RegisterIoElement(RechkoKey);const rows=["љњертзуиопш".split(""),"асдфгхјклчћ".split(""),["Enter",..."џцвбнмђж".split(""),"Backspace"]];class RechkoKeyboard extends IoElement{static get Style(){return`
      :host {
        display: flex;
        flex-direction: column;
        margin: 1em 1em 1em 1em;
        user-select: none;
      }
      :host > div {
        display: flex;
        width: 100%;
        margin: 0 auto 3px;
        touch-action: manipulation;
      }
      @media (max-width: 360px) {
        :host {
          margin: 0.25em 0.25em 0.25em 0.25em;
        }
      }
    `}static get Properties(){return{letterStates:{type:Object,observe:!0},translate:{value:"no",reflect:1}}}changed(){this.template(rows.map(e=>["div",e.map(e=>["rechko-key",{key:e,state:this.letterStates[e]||""}])]))}}RegisterIoElement(RechkoKeyboard);class RechkoPopup extends IoElement{static get Style(){return`
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        background: var(--io-background-color);
        padding: 0 2em;
        top: 3.4em;
        opacity: 0;
        bottom: 0;
        left: 0;
        right: 0;
        will-change: transform;
        transform: translate3d(0, 200px, 0);
        transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
        overflow: auto;
      }
      :host[show] {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      :host h3 {
        font-size: 1.4rem;
      }
      :host p {
        font-size: 1.1rem;
        line-height: 1.2em;
        margin: 0.5em 0;
      }
      :host > io-icon {
        position: absolute;
        top: 1em;
        right: 1em;
      }
    `}static get Properties(){return{show:{value:!1,reflect:1}}}connectedCallback(){super.connectedCallback(),setTimeout(()=>{this.show=!0})}onClose(){this.show=!1,setTimeout(()=>{this.dispatchEvent("close")},250)}changed(){this.template([["h3","Title"],["p","Paragraph."]])}}RegisterIoElement(RechkoPopup);class RechkoGdpr extends RechkoPopup{static get Style(){return`
      :host {
        z-index: 100;
      }
      :host p:last-of-type {
        margin-bottom: 2em;
      }
      :host .buttons {
        display: flex;
        margin: 2em 0;
      }
      :host io-button {
        --io-spacing: 1em;
        --io-item-height: 3.5em;
        flex: 1;  
        font-weight: bold;
        color: #ffffff;
        background: #6aaa64;
        border: none;
        border-radius: 4px;
      }
      :host io-button:first-of-type {
        background: #ee5a34;
        margin-right: 1em;
      }
      :host io-switch {
        --io-line-height: 30px;
        --io-item-height: 40px;
      }
      :host .option:first-of-type {
        border-top: 1px solid var(--io-color-border);
      }
      :host .option {
        display: flex;
        text-align: left;
        white-space: nowrap;
        font-size: 1.3em;
        line-height: 3em;
        border-bottom: 1px solid var(--io-color-border);
      }
      :host .option > span {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host .option > io-switch {
        margin-top: 1em;
        flex-shrink: 0;
      }
      @media (max-width: 500px) {
        :host p {
          margin: 0.5em 0;
        }
        :host io-button {
          font-size: 0.7em;
          line-height: 1.4em;
        }
      }
      @media (max-width: 360px) {
        :host io-button {
          font-size: 0.6em;
          line-height: 1.6em;
        }
        :host .option span {
          font-size: 0.7em;
          line-height: 4em;
        }
      }
    `}static get Properties(){return{cookiesRequired:!0,cookiesImprovement:!0,cookiesAnalitics:!0}}connectedCallback(){super.connectedCallback(),this.cookiesRequired=!0,this.$.accept?.focus()}onDecline(){this.setProperties({cookiesRequired:!1,cookiesImprovement:!1,cookiesAnalitics:!1}),this.onAccept()}onAccept(){setTimeout(()=>{this.onClose()},500)}changed(){this.template([["h3","Ова веб страница користи колачиће"],["p","Користимо колачиће како би побољшали Речка. Сакупљамо речи које корисници открију да не постоје у постојећој бази."],["p","Страница користи и Google Analytics услуге. Сви подаци се користе искључиво у статистичке сврхе, за побољшање искуства играња и не деле се ни са једном компанијом, друштвом или неком трећом групом."],["div",{class:"option"},[["span","Hеопходни колачићи"],["io-switch",{value:this.bind("cookiesRequired"),disabled:!0}]]],["div",{class:"option"},[["span","Cакупљање речи"],["io-switch",{value:this.bind("cookiesImprovement")}]]],["div",{class:"option"},[["span","Аналитички колачићи"],["io-switch",{value:this.bind("cookiesAnalitics")}]]],["div",{class:"buttons"},[["io-button",{label:"НЕ ПРИХВАТАМ",action:this.onDecline}],["io-button",{label:"ПРИХВАТАМ",id:"accept",action:this.onAccept}]]]])}}RegisterIoElement(RechkoGdpr);class RechkoHelp extends RechkoPopup{static get Style(){return`
      :host p {
        font-size: 1.0rem;
        line-height: 1.2em;
        margin: 0.25em 0;
      }
      :host p:last-of-type {
        font-weight: bold;
        border-top: 1px solid #ccc;
        margin-top: 2.5em;
        margin-bottom: 2.5em;
        padding-top: 1.5em;
      }
      :host rechko-board {
        flex: 1 0 auto;
        --tile-size: 64px !important;
        margin-top: 1em;
      }
      @media (max-width: 400px) {
        :host rechko-board {
          --tile-size: 42px !important;
          margin-top: 1em;
          height: 42px;
        }
      }
    `}changed(){this.template([["io-icon",{icon:"icons:close","on-click":this.onClose}],["h2","Правила игре"],["p","Погодите задату реч у 6 покушаја."],["p","Сваки покушај мора бити постојећа реч."],["p","Притисните ENTER да унесете реч."],["p","Погођена слова биће обележена бојама."],["h2","Примери:"],["rechko-board",{class:"notranslate",board:[[{letter:"с",state:0},{letter:"л",state:"correct"},{letter:"о",state:0},{letter:"г",state:0},{letter:"а",state:0}]]}],["p","Слово Л је погођено на тачном месту."],["rechko-board",{class:"notranslate",board:[[{letter:"н",state:0},{letter:"а",state:0},{letter:"м",state:0},{letter:"а",state:0},{letter:"з",state:"present"}]]}],["p","Слово З је погођено али на погрешном месту."],["rechko-board",{class:"notranslate",board:[[{letter:"д",state:0},{letter:"о",state:"absent"},{letter:"д",state:0},{letter:"и",state:0},{letter:"р",state:0}]]}],["p","Слово О не постоји у задатој речи."],["p","Задата реч се мења сваког дана."]])}}RegisterIoElement(RechkoHelp);const ICONS={correct:"🟩",present:"🟨",absent:"⬜",[0]:null};class RechkoStats extends RechkoPopup{static get Style(){return`
      :host h4 {
        margin: 1em 0;
        font-size: 1.2rem;
      }
      :host .board {
        white-space: pre;
        line-height: 1.2em;
      }
      :host .grid {
        margin: 0 auto;
        width: 19em;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
      }
      :host .grid .count {
        font-size: 2rem;
      }
      :host .distribution > div {
        display: flex;
        margin: 1px 0;
      }
      :host .distribution > div > * {
        padding: 0.25em 0.5em;
      }
      :host .distribution > div > :nth-child(1) {
        width: 1.2em;
      }
      :host .distribution > div:last-of-type > :nth-child(2) {
        background: #ee5a34 !important;
      }
      :host .distribution > div > :nth-child(2) {
        flex: 1;
        background: #6aaa64 !important;
        margin-left: 0.5em;
        text-align: right;
      }
      :host > button {
        margin: 1em auto;
        width: 8em;
        border: none;
        border-radius: 3px;
        font-size: 1.2em;
        background: #6aaa64;
        font-weight: bold;
        color: #ffffff;
        cursor: pointer;
      }
      :host > button svg {
        fill: #ffffff;

      }
      :host > button > span {
        line-height: 2.4em;
      }
      :host > button > io-icon {
        margin-left: 0.5em;
        margin-bottom: -0.5em;
      }
    `}static get Properties(){return{message:"",answer:"",win:!1,finish:!1,boardGrid:"",shareText:"",board:{value:[],observe:!0},history:Object,gamesStarted:0,gamesFinished:0,gamesWon:0,gameStats:[0,0,0,0,0,0,0]}}historyChanged(){let e=0,o=0,s=0,i=[0,0,0,0,0,0,0];for(const t in this.history){const r=this.history[t];r[0].every(e=>0!==e.state)&&e++,r.forEach((e,t)=>{e.every(e=>"correct"===e.state)&&(i[t]++,s++,o++)}),r[5].every(e=>"correct"!==e.state&&0!==e.state)&&(o++,i[6]++)}this.setProperties({gamesStarted:e,gamesFinished:o,gamesWon:s,gameStats:i})}async onShare(){try{await navigator.share({text:this.shareText})}catch(e){navigator.clipboard.writeText(this.shareText),this.dispatchEvent("message",{message:"Резултат копиран"})}}boardChanged(){this.boardMutated()}boardMutated(){const e=new Date;var t=e.getUTCMonth()+1,o=e.getUTCDate(),s=e.getUTCFullYear();let i=-1;this.win=!1,this.finish=!1,this.board.forEach((e,t)=>{e.every(e=>0!==e.state)&&i++,e.every(e=>"correct"===e.state)&&(this.win=!0)}),this.board[5].every(e=>0!==e.state)&&(this.finish=!0),this.message=this.win?["Генијално!","Величанствено!","Импресивно!","Одлично!","Браво!","Није лоше!"][i]:this.finish?this.answer:"",this.boardGrid=this.board.slice(0,i+1).map(e=>e.map(e=>ICONS[e.state]).join("")).join("\n"),this.shareText=`rechko.com
${o}/${t}/${s}
`+this.boardGrid}changed(){var e=this.gameStats.reduce(function(e,t){return Math.max(e,t)},-1/0);this.template([["h2",{class:"answer"},this.message],["div",{class:"board"},this.boardGrid],["h3","Статистика"],["div",{class:"grid"},[["span",{class:"count"},String(this.gamesStarted)],["span",{class:"count"},String(this.gamesFinished)],["span",{class:"count"},String(this.gamesWon)],["span","започетих"],["span","одиграних"],["span","решених"]]],["h4","Дистрибуција погодака:"],["div",{class:"distribution"},[["div",[["span","1"],["span",{style:{flex:this.gameStats[0]/e}},String(this.gameStats[0])]]],["div",[["span","2"],["span",{style:{flex:this.gameStats[1]/e}},String(this.gameStats[1])]]],["div",[["span","3"],["span",{style:{flex:this.gameStats[2]/e}},String(this.gameStats[2])]]],["div",[["span","4"],["span",{style:{flex:this.gameStats[3]/e}},String(this.gameStats[3])]]],["div",[["span","5"],["span",{style:{flex:this.gameStats[4]/e}},String(this.gameStats[4])]]],["div",[["span","6"],["span",{style:{flex:this.gameStats[5]/e}},String(this.gameStats[5])]]],["div",[["span","x"],["span",{style:{flex:this.gameStats[6]/e}},String(this.gameStats[6])]]]]],["io-icon",{icon:"icons:close","on-click":this.onClose}],this.win||this.finish?["button",{"on-click":this.onShare},[["span","Подели"],["io-icon",{icon:"buttons:share"}]]]:null])}}RegisterIoElement(RechkoStats);class RechkoSettings extends RechkoPopup{static get Style(){return`
      :host io-switch {
        --io-line-height: 30px;
        --io-item-height: 40px;
      }
      :host .option:first-of-type {
        border-top: 1px solid var(--io-color-border);
      }
      :host .option {
        display: flex;
        text-align: left;
        white-space: nowrap;
        font-size: 1.3em;
        line-height: 3em;
        border-bottom: 1px solid var(--io-color-border);
      }
      :host .option > span {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host .option > io-switch {
        margin-top: 1em;
        flex-shrink: 0;
      }
      :host .option > io-button {
        --io-spacing: 1em;
        --io-item-height: 3.5em;
        flex: 1;  
        font-weight: bold;
        color: #ffffff;
        background: var(--io-background-color-light);
        border: none;
        margin-top: 0.5em;
        border-radius: 4px;
      }
    `}static get Properties(){return{hardMode:!1,darkTheme:!1,colorblindMode:!1,cookiesRequired:!0}}onShowGDPR(){this.dispatchEvent("show-gdpr"),this.onClose()}changed(){this.template([["io-icon",{icon:"icons:close","on-click":this.onClose}],["h3","Подешавања"],["div",{class:"option"},[["span","Тамна тема"],["io-switch",{value:this.bind("darkTheme")}]]],["div",{class:"option"},[["span","Боје високог контраста"],["io-switch",{value:this.bind("colorblindMode")}]]],["div",{class:"option"},[["io-button",{label:"Подешавање колачића",action:this.onShowGDPR}]]]])}}RegisterIoElement(RechkoSettings),IoIconsetSingleton.registerIcons("buttons",`
<svg>
  <g id="backspace">
    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
  </g>
  <g id="help">
    <path fill="var(--color-tone-3)" d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>  </g>
  <g id="stats">
    <path fill="var(--color-tone-3)" d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"></path>  </g>
  <g id="settings">
    <path fill="var(--color-tone-3)" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path>
  </g>
  <g id="share">
    <path fill="var(--white)" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path>
  </g>
</svg>
`),IoThemeSingleton.theme=JSON.parse(localStorage.getItem("darkTheme")||"false")?"dark":"light";const today=Math.floor((Number(new Date)+36e5)/864e5),answer=getWordOfTheDay(today),board=history$1.load(today)||Array.from({length:6},()=>Array.from({length:5},()=>({letter:"",state:0})));let allHistory=history$1.loadAll();const replaceLatinKeys=[["q","w","e","r","t","y","u","i","o","p","š","đ","ž","a","s","d","f","g","h","j","k","l","č","ć","x","c","v","b","n","m"],["љ","њ","е","р","т","з","у","и","о","п","ш","ђ","ж","а","с","д","ф","г","х","ј","к","л","ч","ћ","џ","ц","в","б","н","м"]],replaceEnglishKeys=[["q","w","e","r","t","y","u","i","o","p","[","]","\\","a","s","d","f","g","h","j","k","l",";","'","x","c","v","b","n","m"],["љ","њ","е","р","т","з","у","и","о","п","ш","ђ","ж","а","с","д","ф","г","х","ј","к","л","ч","ћ","џ","ц","в","б","н","м"]],foolDay=19083,isFool=localStorage.getItem("isFool");class RechkoApp extends IoElement{static get Style(){return`
      :host {
        display: flex;
        position: relative;
        height: 100%;
        flex-direction: column;
        background: var(--io-background-color);
        color: var(--io-color);
        overflow: hidden;
      }
      :host > header {
        flex: 0 0 auto;
        border-bottom: 1px solid var(--io-color-border);
        position: relative;
      }
      :host > header > h1 {
        margin: 4px 0;
        font-size: 36px;
      }
      :host > header > io-icon {
        position: absolute;
        top: 12px;
        left: 1em;
      }
      :host > header > io-icon.settingsIcon {
        left: auto;
        right: 1em;
      }
      :host > header > io-icon.statsIcon {
        left: auto;
        right: 4em;
      }
      :host > .message {
        position: absolute;
        left: 50%;
        top: 80px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.85);
        padding: 16px 20px;
        z-index: 2;
        border-radius: 4px;
        transform: translateX(-50%);
        transition: opacity 0.3s ease-out;
        font-weight: 600;
      }
      :host > rechko-board {
        flex: 1 1 auto;
      }
      :host[colorblindmode] rechko-board .correct {
        background-color: #f5793a !important;
      }
      :host[colorblindmode] rechko-board .present {
        background-color: #85c0f9 !important;
      }
      :host[colorblindmode] rechko-key[state=correct] button {
        background-color: #f5793a !important;
      }
      :host[colorblindmode] rechko-key[state=present] button {
        background-color: #85c0f9 !important;
      }
      @media (max-width: 310px) {
        :host > header > h1 {
          font-size: 18px;
          line-height: 42px;
          margin-left: -32px;
        }
      }
    `}static get Properties(){return{answer:answer,board:board,currentRowIndex:board.findIndex(e=>0===e[0].state),currentRow:board[board.findIndex(e=>0===e[0].state)],shakeRowIndex:-1,letterStates:Object,allowInput:!0,message:"",showGDPR:JSON.parse(localStorage.getItem("show-gdpr")||"true"),cookiesRequired:JSON.parse(localStorage.getItem("cookiesRequired")||"true"),cookiesImprovement:JSON.parse(localStorage.getItem("cookiesImprovement")||"true"),cookiesAnalitics:JSON.parse(localStorage.getItem("cookiesAnalitics")||"true"),showHelp:!1,showStats:!1,showSettings:!1,hardMode:JSON.parse(localStorage.getItem("hardMode")||"false"),darkTheme:JSON.parse(localStorage.getItem("darkTheme")||"false"),colorblindMode:{value:JSON.parse(localStorage.getItem("colorblindMode")||"false"),reflect:1}}}constructor(){super(),this.completeGame()}connectedCallback(){super.connectedCallback(),window.addEventListener("keyup",this.onKeyup)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keyup",this.onKeyup)}emitUpdate(){this.dispatchEvent("object-mutated",{object:this.board},!1,window),this.dispatchEvent("object-mutated",{object:this.letterStates},!1,window)}onKeyup(e){this.onKey(e.key)}onKeyboard(e){this.onKey(e.detail)}onKey(e){if(this.allowInput){for(const t in replaceLatinKeys[0])e!==replaceLatinKeys[0][t]||(e=replaceLatinKeys[1][t]);for(const o in replaceEnglishKeys[0])e!==replaceEnglishKeys[0][o]||(e=replaceEnglishKeys[1][o]);/^[љњертзуиопшђжасдфгхјклчћџцвбнмЉЊЕРТЗУИОПШЂЖАСДФГХЈКЛЧЋЏЦВБНМ]$/.test(e)?this.fillTile(e.toLowerCase()):"Backspace"===e?this.clearTile():"Enter"===e&&this.completeRow()}}fillTile(e){for(const t of this.currentRow)if(!t.letter){t.letter=e;break}this.emitUpdate()}clearTile(){for(const e of[...this.currentRow].reverse())if(e.letter){e.letter="";break}this.emitUpdate()}completeRow(){if(this.currentRow.every(e=>e.letter)){var e=this.currentRow.map(e=>e.letter).join("");if(!allWords.includes(e)&&e!==answer)return this.shake(),this.showMessage("Реч није на листи"),void(this.cookiesImprovement&&fetch("/word_nok/"+e));this.cookiesImprovement&&fetch("/word_ok/"+e),this.completeGame(),this.currentRowIndex+=1,this.cookiesRequired&&(history$1.save(board,today),allHistory=history$1.loadAll())}else this.shake(),this.showMessage("Нема довољно слова")}completeGame(){this.board.forEach(e=>{e.forEach(e=>{e.state=0})}),this.board.forEach(e=>{const o=answer.split("");e.forEach((e,t)=>{(o[t]===e.letter||e.letter&&!isFool&&foolDay===today)&&(foolDay===today&&localStorage.setItem("isFool","true"),e.state=this.letterStates[e.letter]="correct",o[t]=null)}),e.forEach((e,t)=>{!e.state&&o.includes(e.letter)&&(e.state="present",o[o.indexOf(e.letter)]=null,this.letterStates[e.letter]||(this.letterStates[e.letter]="present"))}),e.forEach((e,t)=>{e.letter&&!e.state&&(e.state="absent",this.letterStates[e.letter]||(this.letterStates[e.letter]="absent"))})}),this.allowInput=!0,this.board.forEach((e,t)=>{if(e.every(e=>"correct"===e.state))return this.allowInput=!1,void setTimeout(()=>{this.showStats=!0},1600);e.every(e=>0!==e.state)&&(5!==t||5!==this.currentRowIndex&&-1!==this.currentRowIndex||(this.allowInput=!1,setTimeout(()=>{this.showStats=!0},1600)))}),this.emitUpdate()}onShowGDPR(){this.showGDPR=!0}onHideGDPR(){this.cookiesRequired||localStorage.clear(),localStorage.setItem("cookiesRequired",String(this.cookiesRequired)),localStorage.setItem("cookiesImprovement",String(this.cookiesImprovement)),localStorage.setItem("cookiesAnalitics",String(this.cookiesAnalitics)),localStorage.setItem("show-gdpr","false");try{gtag("consent","update",{analytics_storage:this.cookiesAnalitics?"granted":"denied",ad_storage:this.cookiesAnalitics?"granted":"denied"})}catch(e){console.warn(e)}this.showGDPR=!1}onShowHelp(){this.showHelp=!0}onHideHelp(){this.showHelp=!1}onShowStats(){this.showStats=!0}onHideStats(){this.showStats=!1}onShowSetttings(){this.showSettings=!0}onHideSettings(){this.showSettings=!1}onMessage(e){this.showMessage(e.detail.message)}showMessage(e,t=1e3){this.message=e,0<t&&setTimeout(()=>{this.message=""},t)}shake(){this.shakeRowIndex=this.currentRowIndex,setTimeout(()=>{this.shakeRowIndex=-1},1e3)}hardModeChanged(){this.cookiesRequired&&localStorage.setItem("hardMode",String(this.hardMode))}darkThemeChanged(){this.cookiesRequired&&localStorage.setItem("darkTheme",String(this.darkTheme)),IoThemeSingleton.theme=this.darkTheme?"dark":"light"}colorblindModeChanged(){this.cookiesRequired&&localStorage.setItem("colorblindMode",String(this.colorblindMode))}currentRowIndexChanged(){this.currentRow=this.board[Math.min(5,this.currentRowIndex)]}changed(){var e=this.showGDPR||this.showHelp||this.showStats||this.showSettings;this.template([["header",{class:"header"},[e?null:["io-icon",{class:"helpIcon",icon:"buttons:help","on-click":this.onShowHelp}],["h1","РЕЧКО"],!e&&this.cookiesRequired?["io-icon",{class:"statsIcon",icon:"buttons:stats","on-click":this.onShowStats}]:null,e?null:["io-icon",{class:"settingsIcon",icon:"buttons:settings","on-click":this.onShowSetttings}]]],["rechko-board",{class:"notranslate",board:this.board,shakeRowIndex:this.shakeRowIndex}],["rechko-keyboard",{class:"notranslate",letterStates:this.letterStates,"on-key":this.onKeyboard}],this.showGDPR?["rechko-gdpr",{cookiesRequired:this.bind("cookiesRequired"),cookiesImprovement:this.bind("cookiesImprovement"),cookiesAnalitics:this.bind("cookiesAnalitics"),"on-close":this.onHideGDPR}]:null,this.showHelp?["rechko-help",{"on-close":this.onHideHelp}]:null,this.showStats?["rechko-stats",{"on-close":this.onHideStats,"on-message":this.onMessage,answer:answer,board:this.board,history:allHistory}]:null,this.showSettings?["rechko-settings",{"on-close":this.onHideSettings,"on-show-gdpr":this.onShowGDPR,hardMode:this.bind("hardMode"),darkTheme:this.bind("darkTheme"),colorblindMode:this.bind("colorblindMode")}]:null,this.message?["div",{class:"message"},this.message]:null])}}RegisterIoElement(RechkoApp);export{IoButton,IoIcon,IoSwitch,RechkoApp};

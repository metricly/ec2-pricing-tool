/*!***************************************************
* mark.js v8.11.1
* https://markjs.io/ 
* Copyright (c) 2014–2018, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
*****************************************************/
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Mark=t()}(this,function(){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},n=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=function(){function e(n){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:5e3;t(this,e),this.ctx=n,this.iframes=r,this.exclude=i,this.iframesTimeout=o}return n(e,[{key:"getContexts",value:function(){var e=[];return(void 0!==this.ctx&&this.ctx?NodeList.prototype.isPrototypeOf(this.ctx)?Array.prototype.slice.call(this.ctx):Array.isArray(this.ctx)?this.ctx:"string"==typeof this.ctx?Array.prototype.slice.call(document.querySelectorAll(this.ctx)):[this.ctx]:[]).forEach(function(t){var n=e.filter(function(e){return e.contains(t)}).length>0;-1!==e.indexOf(t)||n||e.push(t)}),e}},{key:"getIframeContents",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},r=void 0;try{var i=e.contentWindow;if(r=i.document,!i||!r)throw new Error("iframe inaccessible")}catch(e){n()}r&&t(r)}},{key:"isIframeBlank",value:function(e){var t=e.getAttribute("src").trim();return"about:blank"===e.contentWindow.location.href&&"about:blank"!==t&&t}},{key:"observeIframeLoad",value:function(e,t,n){var r=this,i=!1,o=null,a=function a(){if(!i){i=!0,clearTimeout(o);try{r.isIframeBlank(e)||(e.removeEventListener("load",a),r.getIframeContents(e,t,n))}catch(e){n()}}};e.addEventListener("load",a),o=setTimeout(a,this.iframesTimeout)}},{key:"onIframeReady",value:function(e,t,n){try{"complete"===e.contentWindow.document.readyState?this.isIframeBlank(e)?this.observeIframeLoad(e,t,n):this.getIframeContents(e,t,n):this.observeIframeLoad(e,t,n)}catch(e){n()}}},{key:"waitForIframes",value:function(e,t){var n=this,r=0;this.forEachIframe(e,function(){return!0},function(e){r++,n.waitForIframes(e.querySelector("html"),function(){--r||t()})},function(e){e||t()})}},{key:"forEachIframe",value:function(t,n,r){var i=this,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},a=t.querySelectorAll("iframe"),s=a.length,c=0;a=Array.prototype.slice.call(a);var u=function(){--s<=0&&o(c)};s||u(),a.forEach(function(t){e.matches(t,i.exclude)?u():i.onIframeReady(t,function(e){n(t)&&(c++,r(e)),u()},u)})}},{key:"createIterator",value:function(e,t,n){return document.createNodeIterator(e,t,n,!1)}},{key:"createInstanceOnIframe",value:function(t){return new e(t.querySelector("html"),this.iframes)}},{key:"compareNodeIframe",value:function(e,t,n){if(e.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_PRECEDING){if(null===t)return!0;if(t.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING)return!0}return!1}},{key:"getIteratorNode",value:function(e){var t=e.previousNode();return{prevNode:t,node:null===t?e.nextNode():e.nextNode()&&e.nextNode()}}},{key:"checkIframeFilter",value:function(e,t,n,r){var i=!1,o=!1;return r.forEach(function(e,t){e.val===n&&(i=t,o=e.handled)}),this.compareNodeIframe(e,t,n)?(!1!==i||o?!1===i||o||(r[i].handled=!0):r.push({val:n,handled:!0}),!0):(!1===i&&r.push({val:n,handled:!1}),!1)}},{key:"handleOpenIframes",value:function(e,t,n,r){var i=this;e.forEach(function(e){e.handled||i.getIframeContents(e.val,function(e){i.createInstanceOnIframe(e).forEachNode(t,n,r)})})}},{key:"iterateThroughNodes",value:function(e,t,n,r,i){for(var o,a=this,s=this.createIterator(t,e,r),c=[],u=[],l=void 0,h=void 0;void 0,o=a.getIteratorNode(s),h=o.prevNode,l=o.node;)this.iframes&&this.forEachIframe(t,function(e){return a.checkIframeFilter(l,h,e,c)},function(t){a.createInstanceOnIframe(t).forEachNode(e,function(e){return u.push(e)},r)}),u.push(l);u.forEach(function(e){n(e)}),this.iframes&&this.handleOpenIframes(c,e,n,r),i()}},{key:"forEachNode",value:function(e,t,n){var r=this,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},o=this.getContexts(),a=o.length;a||i(),o.forEach(function(o){var s=function(){r.iterateThroughNodes(e,o,t,n,function(){--a<=0&&i()})};r.iframes?r.waitForIframes(o,s):s()})}}],[{key:"matches",value:function(e,t){var n="string"==typeof t?[t]:t,r=e.matches||e.matchesSelector||e.msMatchesSelector||e.mozMatchesSelector||e.oMatchesSelector||e.webkitMatchesSelector;if(r){var i=!1;return n.every(function(t){return!r.call(e,t)||(i=!0,!1)}),i}return!1}}]),e}(),o=function(){function o(e){t(this,o),this.ctx=e,this.ie=!1;var n=window.navigator.userAgent;(n.indexOf("MSIE")>-1||n.indexOf("Trident")>-1)&&(this.ie=!0)}return n(o,[{key:"log",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"debug",r=this.opt.log;this.opt.debug&&"object"===(void 0===r?"undefined":e(r))&&"function"==typeof r[n]&&r[n]("mark.js: "+t)}},{key:"escapeStr",value:function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}},{key:"createRegExp",value:function(e){return"disabled"!==this.opt.wildcards&&(e=this.setupWildcardsRegExp(e)),e=this.escapeStr(e),Object.keys(this.opt.synonyms).length&&(e=this.createSynonymsRegExp(e)),(this.opt.ignoreJoiners||this.opt.ignorePunctuation.length)&&(e=this.setupIgnoreJoinersRegExp(e)),this.opt.diacritics&&(e=this.createDiacriticsRegExp(e)),e=this.createMergedBlanksRegExp(e),(this.opt.ignoreJoiners||this.opt.ignorePunctuation.length)&&(e=this.createJoinersRegExp(e)),"disabled"!==this.opt.wildcards&&(e=this.createWildcardsRegExp(e)),e=this.createAccuracyRegExp(e)}},{key:"createSynonymsRegExp",value:function(e){var t=this.opt.synonyms,n=this.opt.caseSensitive?"":"i",r=this.opt.ignoreJoiners||this.opt.ignorePunctuation.length?"\0":"";for(var i in t)if(t.hasOwnProperty(i)){var o=t[i],a="disabled"!==this.opt.wildcards?this.setupWildcardsRegExp(i):this.escapeStr(i),s="disabled"!==this.opt.wildcards?this.setupWildcardsRegExp(o):this.escapeStr(o);""!==a&&""!==s&&(e=e.replace(new RegExp("("+this.escapeStr(a)+"|"+this.escapeStr(s)+")","gm"+n),r+"("+this.processSynomyms(a)+"|"+this.processSynomyms(s)+")"+r))}return e}},{key:"processSynomyms",value:function(e){return(this.opt.ignoreJoiners||this.opt.ignorePunctuation.length)&&(e=this.setupIgnoreJoinersRegExp(e)),e}},{key:"setupWildcardsRegExp",value:function(e){return(e=e.replace(/(?:\\)*\?/g,function(e){return"\\"===e.charAt(0)?"?":""})).replace(/(?:\\)*\*/g,function(e){return"\\"===e.charAt(0)?"*":""})}},{key:"createWildcardsRegExp",value:function(e){var t="withSpaces"===this.opt.wildcards;return e.replace(/\u0001/g,t?"[\\S\\s]?":"\\S?").replace(/\u0002/g,t?"[\\S\\s]*?":"\\S*")}},{key:"setupIgnoreJoinersRegExp",value:function(e){return e.replace(/[^(|)\\]/g,function(e,t,n){var r=n.charAt(t+1);return/[(|)\\]/.test(r)||""===r?e:e+"\0"})}},{key:"createJoinersRegExp",value:function(e){var t=[],n=this.opt.ignorePunctuation;return Array.isArray(n)&&n.length&&t.push(this.escapeStr(n.join(""))),this.opt.ignoreJoiners&&t.push("\\u00ad\\u200b\\u200c\\u200d"),t.length?e.split(/\u0000+/).join("["+t.join("")+"]*"):e}},{key:"createDiacriticsRegExp",value:function(e){var t=this.opt.caseSensitive?"":"i",n=this.opt.caseSensitive?["aàáảãạăằắẳẵặâầấẩẫậäåāą","AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ","cçćč","CÇĆČ","dđď","DĐĎ","eèéẻẽẹêềếểễệëěēę","EÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ","iìíỉĩịîïī","IÌÍỈĨỊÎÏĪ","lł","LŁ","nñňń","NÑŇŃ","oòóỏõọôồốổỗộơởỡớờợöøō","OÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ","rř","RŘ","sšśșş","SŠŚȘŞ","tťțţ","TŤȚŢ","uùúủũụưừứửữựûüůū","UÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ","yýỳỷỹỵÿ","YÝỲỶỸỴŸ","zžżź","ZŽŻŹ"]:["aàáảãạăằắẳẵặâầấẩẫậäåāąAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÄÅĀĄ","cçćčCÇĆČ","dđďDĐĎ","eèéẻẽẹêềếểễệëěēęEÈÉẺẼẸÊỀẾỂỄỆËĚĒĘ","iìíỉĩịîïīIÌÍỈĨỊÎÏĪ","lłLŁ","nñňńNÑŇŃ","oòóỏõọôồốổỗộơởỡớờợöøōOÒÓỎÕỌÔỒỐỔỖỘƠỞỠỚỜỢÖØŌ","rřRŘ","sšśșşSŠŚȘŞ","tťțţTŤȚŢ","uùúủũụưừứửữựûüůūUÙÚỦŨỤƯỪỨỬỮỰÛÜŮŪ","yýỳỷỹỵÿYÝỲỶỸỴŸ","zžżźZŽŻŹ"],r=[];return e.split("").forEach(function(i){n.every(function(n){if(-1!==n.indexOf(i)){if(r.indexOf(n)>-1)return!1;e=e.replace(new RegExp("["+n+"]","gm"+t),"["+n+"]"),r.push(n)}return!0})}),e}},{key:"createMergedBlanksRegExp",value:function(e){return e.replace(/[\s]+/gim,"[\\s]+")}},{key:"createAccuracyRegExp",value:function(e){var t=this,n=this.opt.accuracy,r="string"==typeof n?n:n.value,i="";switch(("string"==typeof n?[]:n.limiters).forEach(function(e){i+="|"+t.escapeStr(e)}),r){case"partially":default:return"()("+e+")";case"complementary":return"()([^"+(i="\\s"+(i||this.escapeStr("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~¡¿")))+"]*"+e+"[^"+i+"]*)";case"exactly":return"(^|\\s"+i+")("+e+")(?=$|\\s"+i+")"}}},{key:"getSeparatedKeywords",value:function(e){var t=this,n=[];return e.forEach(function(e){t.opt.separateWordSearch?e.split(" ").forEach(function(e){e.trim()&&-1===n.indexOf(e)&&n.push(e)}):e.trim()&&-1===n.indexOf(e)&&n.push(e)}),{keywords:n.sort(function(e,t){return t.length-e.length}),length:n.length}}},{key:"isNumeric",value:function(e){return Number(parseFloat(e))==e}},{key:"checkRanges",value:function(e){var t=this;if(!Array.isArray(e)||"[object Object]"!==Object.prototype.toString.call(e[0]))return this.log("markRanges() will only accept an array of objects"),this.opt.noMatch(e),[];var n=[],r=0;return e.sort(function(e,t){return e.start-t.start}).forEach(function(e){var i=t.callNoMatchOnInvalidRanges(e,r),o=i.start,a=i.end;i.valid&&(e.start=o,e.length=a-o,n.push(e),r=a)}),n}},{key:"callNoMatchOnInvalidRanges",value:function(e,t){var n=void 0,r=void 0,i=!1;return e&&void 0!==e.start?(r=(n=parseInt(e.start,10))+parseInt(e.length,10),this.isNumeric(e.start)&&this.isNumeric(e.length)&&r-t>0&&r-n>0?i=!0:(this.log("Ignoring invalid or overlapping range: "+JSON.stringify(e)),this.opt.noMatch(e))):(this.log("Ignoring invalid range: "+JSON.stringify(e)),this.opt.noMatch(e)),{start:n,end:r,valid:i}}},{key:"checkWhitespaceRanges",value:function(e,t,n){var r=void 0,i=!0,o=n.length,a=t-o,s=parseInt(e.start,10)-a;return(r=(s=s>o?o:s)+parseInt(e.length,10))>o&&(r=o,this.log("End range automatically set to the max value of "+o)),s<0||r-s<0||s>o||r>o?(i=!1,this.log("Invalid range: "+JSON.stringify(e)),this.opt.noMatch(e)):""===n.substring(s,r).replace(/\s+/g,"")&&(i=!1,this.log("Skipping whitespace only range: "+JSON.stringify(e)),this.opt.noMatch(e)),{start:s,end:r,valid:i}}},{key:"getTextNodes",value:function(e){var t=this,n="",r=[];this.iterator.forEachNode(NodeFilter.SHOW_TEXT,function(e){r.push({start:n.length,end:(n+=e.textContent).length,node:e})},function(e){return t.matchesExclude(e.parentNode)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},function(){e({value:n,nodes:r})})}},{key:"matchesExclude",value:function(e){return i.matches(e,this.opt.exclude.concat(["script","style","title","head","html"]))}},{key:"wrapRangeInTextNode",value:function(e,t,n){var r=this.opt.element?this.opt.element:"mark",i=e.splitText(t),o=i.splitText(n-t),a=document.createElement(r);return a.setAttribute("data-markjs","true"),this.opt.className&&a.setAttribute("class",this.opt.className),a.textContent=i.textContent,i.parentNode.replaceChild(a,i),o}},{key:"wrapRangeInMappedTextNode",value:function(e,t,n,r,i){var o=this;e.nodes.every(function(a,s){var c=e.nodes[s+1];if(void 0===c||c.start>t){if(!r(a.node))return!1;var u=t-a.start,l=(n>a.end?a.end:n)-a.start,h=e.value.substr(0,a.start),f=e.value.substr(l+a.start);if(a.node=o.wrapRangeInTextNode(a.node,u,l),e.value=h+f,e.nodes.forEach(function(t,n){n>=s&&(e.nodes[n].start>0&&n!==s&&(e.nodes[n].start-=l),e.nodes[n].end-=l)}),n-=l,i(a.node.previousSibling,a.start),!(n>a.end))return!1;t=a.end}return!0})}},{key:"wrapMatches",value:function(e,t,n,r,i){var o=this,a=0===t?0:t+1;this.getTextNodes(function(t){t.nodes.forEach(function(t){t=t.node;for(var i=void 0;null!==(i=e.exec(t.textContent))&&""!==i[a];)if(n(i[a],t)){var s=i.index;if(0!==a)for(var c=1;c<a;c++)s+=i[c].length;t=o.wrapRangeInTextNode(t,s,s+i[a].length),r(t.previousSibling),e.lastIndex=0}}),i()})}},{key:"wrapMatchesAcrossElements",value:function(e,t,n,r,i){var o=this,a=0===t?0:t+1;this.getTextNodes(function(t){for(var s=void 0;null!==(s=e.exec(t.value))&&""!==s[a];){var c=s.index;if(0!==a)for(var u=1;u<a;u++)c+=s[u].length;var l=c+s[a].length;o.wrapRangeInMappedTextNode(t,c,l,function(e){return n(s[a],e)},function(t,n){e.lastIndex=n,r(t)})}i()})}},{key:"wrapRangeFromIndex",value:function(e,t,n,r){var i=this;this.getTextNodes(function(o){var a=o.value.length;e.forEach(function(e,r){var s=i.checkWhitespaceRanges(e,a,o.value),c=s.start,u=s.end;s.valid&&i.wrapRangeInMappedTextNode(o,c,u,function(n){return t(n,e,o.value.substring(c,u),r)},function(t){n(t,e)})}),r()})}},{key:"unwrapMatches",value:function(e){for(var t=e.parentNode,n=document.createDocumentFragment();e.firstChild;)n.appendChild(e.removeChild(e.firstChild));t.replaceChild(n,e),this.ie?this.normalizeTextNode(t):t.normalize()}},{key:"normalizeTextNode",value:function(e){if(e){if(3===e.nodeType)for(;e.nextSibling&&3===e.nextSibling.nodeType;)e.nodeValue+=e.nextSibling.nodeValue,e.parentNode.removeChild(e.nextSibling);else this.normalizeTextNode(e.firstChild);this.normalizeTextNode(e.nextSibling)}}},{key:"markRegExp",value:function(e,t){var n=this;this.opt=t,this.log('Searching with expression "'+e+'"');var r=0,i="wrapMatches";this.opt.acrossElements&&(i="wrapMatchesAcrossElements"),this[i](e,this.opt.ignoreGroups,function(e,t){return n.opt.filter(t,e,r)},function(e){r++,n.opt.each(e)},function(){0===r&&n.opt.noMatch(e),n.opt.done(r)})}},{key:"mark",value:function(e,t){var n=this;this.opt=t;var r=0,i="wrapMatches",o=this.getSeparatedKeywords("string"==typeof e?[e]:e),a=o.keywords,s=o.length,c=this.opt.caseSensitive?"":"i";this.opt.acrossElements&&(i="wrapMatchesAcrossElements"),0===s?this.opt.done(r):function e(t){var o=new RegExp(n.createRegExp(t),"gm"+c),u=0;n.log('Searching with expression "'+o+'"'),n[i](o,1,function(e,i){return n.opt.filter(i,t,r,u)},function(e){u++,r++,n.opt.each(e)},function(){0===u&&n.opt.noMatch(t),a[s-1]===t?n.opt.done(r):e(a[a.indexOf(t)+1])})}(a[0])}},{key:"markRanges",value:function(e,t){var n=this;this.opt=t;var r=0,i=this.checkRanges(e);i&&i.length?(this.log("Starting to mark with the following ranges: "+JSON.stringify(i)),this.wrapRangeFromIndex(i,function(e,t,r,i){return n.opt.filter(e,t,r,i)},function(e,t){r++,n.opt.each(e,t)},function(){n.opt.done(r)})):this.opt.done(r)}},{key:"unmark",value:function(e){var t=this;this.opt=e;var n=this.opt.element?this.opt.element:"*";n+="[data-markjs]",this.opt.className&&(n+="."+this.opt.className),this.log('Removal selector "'+n+'"'),this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT,function(e){t.unwrapMatches(e)},function(e){var r=i.matches(e,n),o=t.matchesExclude(e);return!r||o?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},this.opt.done)}},{key:"opt",set:function(e){this._opt=r({},{element:"",className:"",exclude:[],iframes:!1,iframesTimeout:5e3,separateWordSearch:!0,diacritics:!0,synonyms:{},accuracy:"partially",acrossElements:!1,caseSensitive:!1,ignoreJoiners:!1,ignoreGroups:0,ignorePunctuation:[],wildcards:"disabled",each:function(){},noMatch:function(){},filter:function(){return!0},done:function(){},debug:!1,log:window.console},e)},get:function(){return this._opt}},{key:"iterator",get:function(){return new i(this.ctx,this.opt.iframes,this.opt.exclude,this.opt.iframesTimeout)}}]),o}();return function(e){var t=this,n=new o(e);return this.mark=function(e,r){return n.mark(e,r),t},this.markRegExp=function(e,r){return n.markRegExp(e,r),t},this.markRanges=function(e,r){return n.markRanges(e,r),t},this.unmark=function(e){return n.unmark(e),t},this}});

	var table;	

	function colums( flag ) {
		var setColymsJson;
		var colomsBlock 		= document.querySelectorAll('.colomns-block input');	
		var setColums 			= [{"title": "Term", "data": "term", "type": "string"},
								   {"title": "Price USD", "data": "price", "type": "num"},
								//    {"title": "rate_code", "data": "rate_code", type: "string"}
								  ];
		var endTd = {"title": "Pin", "data": "pin"}	;					 
		var colomsTd = {
							'type-checkbox'						: {"title": "Type", "data": "instance_type"}, //
							'tenancy-checkbox' 				:	{"title": "Tenancy", "data": "tenancy"},		//
							'platform-checkbox'				:	{"title": "Platform", "data": "platform"},  //
							'family-checkbox'					:	{"title": "Family", "data": "family"},     //
							'vcpu-checkbox'						:	{"title": "vCPU", "data": "vcpu", "type": "num"}, //
							'network-checkbox'				:	{"title": "Network", "data": "network_perf"},  //
							'ebs-throughput-checkbox'	:	{"title": "EBS Throughput", "data": "ebs_throughput"},  //
							'memory-checkbox'					:	{"title": "Memory GB", "data": "memory_gb", "type": "num"}, //
							'license-model-checkbox'	:	{"title": "License model", "data": "license_model"}, //
							'software-checkbox'				:	{"title": "Software", "data": "software"}, 					//
							'storage-checkbox'				:	{"title": "Storage GB", "data": "storage_gb", "type": "num"}, //
							'ecu-checkbox'						:	{"title": "ECU", "data": "ecu", "type": "num"},	
						};

	
	for (var i = 0; i < colomsBlock.length; i++) {
		for (var key in colomsTd) { 
			if( key == colomsBlock[i].id & colomsBlock[i].checked){
					setColums.push(colomsTd[key]);
					break ;
			}
		}
	};
	setColums.push(endTd);
	setColumsJson = JSON.stringify(setColums)


	if( !sessionStorage.getItem('setColumsJson') ){			
		sessionStorage.setItem("setColumsJson", setColumsJson);	
		return setColums;
	} else {
		( flag ) ? sessionStorage.setItem("setColumsJson", setColumsJson) : function(){};
		setColums = JSON.parse(sessionStorage.getItem("setColumsJson"));
		disableCheckedInput();
		return setColums;
	};	


	function disableCheckedInput() {
		for (var i = 0; i < colomsBlock.length; i++) {  // remove all checked
			colomsBlock[i].removeAttribute("checked");
		};

		for (var i = 0; i < setColums.length; i++) {
				for ( var key in colomsTd ){
					if ( colomsTd[key]['title'] == setColums[i]['title'] ){

						for (var c = 0; c < colomsBlock.length; c++) {  // set checked input
							if( colomsBlock[c].id == key )	{
								colomsBlock[c].checked = true;
								break;
							};
						};						
						break;
					}
				}
			};

		};
	}

// Start ec2chooser.js 
App = function App() {
};

App.prototype = {

	showZeros: true,
	utilField: "cpu_perc95",
	sortField: "total_cost",
	reportId: null,
	data: null,
	instanceTypes: null,


	filterNames: ['region', 'platform', 'software', 'license_model', 'tenancy', 'family', 'license_model', 'network_perf', 'ebs_throughput'],

	rangeFilterNames: ['memory_gb', 'price', 'vcpu', 'ecu', 'storage_gb'],
	
	checkFilterNames: ['enhanced_network', 'current'],   //my

	currentType: null,

	lookupCounter: 0,

	table: null,




	initialise: function () {

		this.filterNames.forEach((name) => {
			this.loadLookup(name);
			
			$(`#${name}`).change($.proxy(this.updateUI, this))
			
		});

		this.rangeFilterNames.forEach((name) => {
			this.loadRangeLookup(name);
			$(`#${name}_min`).change($.proxy(this.updateUI, this))
			$(`#${name}_max`).change($.proxy(this.updateUI, this))
		});

		this.checkFilterNames.forEach((name) =>{ //my
			$(`#${name}`).change($.proxy(this.updateUI, this))
		})
		
		$("#showdefaults").click($.proxy(this.showDefaults, this));

		// why this block? 
		//$("#cpu").slider({range: true});
        //$('#cpu').change($.proxy(this.updateUI, this));
    //$('#memory').slider({range: true}); 
    //$('#price').slider({range: true});   
    //$('#ecu').slider({range: true});   

  },

  getData: function (request, callback) {
  	var resp = null;
  	$.ajax({
  		type: "GET",
  		url: request,
  		async: (true),
  		data: null,
  		success: function (respdata, status) {
  			try {
  				resp = respdata;
  			} catch (e) {
  				alert("Failed to parse response: " + respdata);
  			}
  			if (callback != null)
  				callback(resp);
  		}
  	});

  	return resp;
  },

  setDefaults: function() { 
        // $("#region").val("us-east-1");
        // $("#platform").val("Linux");
        // $("#software").val("NA");
        // $("#license_model").val("No License required");

        this.initialiseTable();
      },

      loadLookup: function(field) {
      	this.getData(`/lookup?field=${field}`, $.proxy(this.afterLoadLookup, this));      	
      },

      loadRangeLookup: function(field) {
      	this.getData(`/range?field=${field}`, $.proxy(this.afterLoadRangeLookup, this));      	
      },

      afterLoadLookup: function(data) {
      	const field = data.field;
      	let values = data.values;

      	if (field === 'tenancy') {
      		values = values.filter((entry) => entry !== 'Host');
      	}

      	let el = $(`#${field}`);
      	el.empty();

      	el.find('option').remove();
      	$.each(values, function (ix, entry) {
      		var o = $("<option>").text(entry).val(entry);
      		el.append(o);
      	}); 

      	this.lookupCounter++;

      	if (this.lookupCounter === this.filterNames.length + this.rangeFilterNames.length) {
      		this.setDefaults();
      	}
      },

      afterLoadRangeLookup: function(data) {

      	$(`#${data.field}_min`).val(data.min);
      	$(`#${data.field}_max`).val(data.max);

      	this.lookupCounter++;

      	if (this.lookupCounter === this.filterNames.length + this.rangeFilterNames.length) {

      		this.setDefaults();
      	}
      },

      updateUI: function() {
      	this.updateTable();
        // let filterList = this.filterNames.filter((name) => name !== 'instance_type').map((name) => {
        //     return {
        //         field: name,
        //         val: $(`#${name}`).val()
        //     };
        // });
        
        // let filterMap = filterList.reduce((prev, curr) => {
        //     prev[curr.field] = curr.val;
        //     return prev;
        // }, {});

        // if (filterMap.platform === "SUSE" || filterMap.platform === "RHEL") {
        //     $("#software-group").hide();
        //     $("#software").val("NA");
        // } else {
        //     $("#software-group").show();
        // }

        // if (filterMap.software === "NA") {
        //     $("#license_model-group").hide();
        //     $("#license_model").val("No License required");
        // } else {
        //     $("#license_model-group").show();
        // }

        // let query = filterList.reduce((prev, curr) => {
        //     if (curr.val) {
        //         prev += `&${curr.field}=${curr.val}`;
        //     }
        //     return prev;
        // }, "");

        // // These two don't include cpu and mem filters
        // // this.getData("/range?field=memory_gb" + query, $.proxy(this.afterLoadMemRange, this));
        // // this.getData("/range?field=vcpu" + query, $.proxy(this.afterLoadCpuRange, this));

        // const mem = $("#memory").val();
        // if (mem && mem.length === 2) {
        //     if (mem[0]) {
        //         query += `&mem_min=${mem[0]}`;
        //     }
        //     if (mem[1]) {
        //         query += `&mem_max=${mem[1]}`;    
        //     }
        // }

        // const cpu = $("#cpu").val();
        // if (cpu && cpu.length === 2) {
        //     if (cpu[0]) {
        //         query += `&cpu_min=${cpu[0]}`;
        //     }
        //     if (cpu[1]) {
        //         query += `&cpu_max=${cpu[1]}`;    
        //     }
        // }

        // const price = $("#price").val();
        // if (price && price.length === 2) {
        //     if (price[0]) {
        //         query += `&price_min=${price[0]}`;
        //     }
        //     if (price[1]) {
        //         query += `&price_max=${price[1]}`;    
        //     }
        // }

//        this.getData("/count?" + query, $.proxy(this.afterLoadCount, this));

        //this.getData("/data?" + query, $.proxy(this.afterLoadData, this));

//        this.getData("/data?" + query + "&instance_type=" + $("#instance_type").val(), $.proxy(this.afterGetCurrent, this));
},

afterLoadHierarchy(error, data) {
	this.showPetriChart(data);
},

afterGetCurrent(data) { 
	this.currentType = data;
},

afterLoadCount: function(data) {
	$("#elCount").text(data.count);
},

afterLoadData: function(data) {
	if (data.length > 1000) {
            //this.showConstellationChart(data);
          } else {
          	this.showColumnChart(data);

          }
        },

        afterLoadMemRange: function(data) {
        	$("#mem_min").val(data[0]);
        	$("#mem_max").val(data[1]);
        },

        updateTable: function() {
        	this.table.ajax.reload();
        },

        updateCount: function(count) {
        	let el = $("#rowCount");
			el.text(Number(count).toLocaleString('en'));
/* 		disable style col row BS
        	//el.css('backgroundColor','hsl(0,100%,50%');

        	var d = 100;
        for(var i=50; i<=100; i+=5){ //i represents the lightness
        	d  += 10;
        	(function(ii,dd){
        		setTimeout(function(){
        			el.css('backgroundColor','hsl(0,100%,'+ii+'%)'); 
        		}, dd);    
        	})(i,d);
        }
        */
      },

      initialiseTable: function() {
      	var self = this;

      	table = $("#datatable").DataTable({
      		xdom: "rtlip",
      		dom: "t<'datatable-info'lp>",
      		serverSide: true,
			retrieve: true,
			pageLength: 12,
			rowReorder: {
				selector: 'td:last-child',
				dataSrc: 'rate_code',
				update: false
			},
      		language: {
			    //	"lengthMenu": 'Showing'+
			    	//"lengthMenu": '<label for="showing">Showing</label>'+
			    	"lengthMenu": '<div class="select">'+ 
			    	'<select name="showing" id="showing">'+
			    	'<option value="12">12 entries</option>'+
			    	'<option value="24">24 entries</option>'+
			    	'<option value="36">36 entries</option>'+
			    	'</select>'+
			    	'<svg class="icon-arrow"><use xlink:href="assets/bundle.svg#arrow-blue"></use></svg>'+			      
			    	'</div>'
			    },

			    ajax: function(data, callback) {
			    	var settings = $("#datatable").DataTable().settings().init();
			    	var orders = data.order.map(function(order) {
			    		var ix = order.column
			    		order.column = data.columns[ix].data;
			    		order.type = settings.columns[ix].type;
			    		return order;
			    	});

			    	let filters = {};
			    	self.filterNames.forEach((name) => {
			    		filters[name] = $(`#${name}`).val();

			    	});

			    	self.rangeFilterNames.forEach((name) => {
			    		filters[`${name}_min`] = $(`#${name}_min`).val();
			    		filters[`${name}_max`] = $(`#${name}_max`).val();
					});
					
					self.checkFilterNames.forEach((name) => {
						filters[name] = $(`#${name}`).val();
					});

			    	$.ajax({
			    		url: "/table",
			    		dataType: 'json',
			    		data: {
			    			filters: filters,
			    			orders: orders,
			    			pageSize: data.length,
			    			page: data.start / data.length
			    		},
			    		success: function(result) {
			    			self.updateCount(result.recordsFiltered);
							callback(result);
			    		}
			    	});
			    },

			    columns: colums(),
							//{"data": "rate_code"},

/*
							{"title": "Term", "data": "term", "type": "string"},
							{"title": "Price USD", "data": "price", "type": "num"},
							{"title": "Type", "data": "instance_type"}, //
							{"title": "Tenancy", "data": "tenancy"},		//
							{"title": "Platform", "data": "platform"},  //
							{"title": "Family", "data": "family"},     //
							{"title": "vCPU", "data": "vcpu", "type": "num"}, //
							{"title": "Network", "data": "network_perf"},  //
							{"title": "EBS Throughput", "data": "ebs_throughput"},  //
							{"title": "Memory GB", "data": "memory_gb", "type": "num"}, //
							{"title": "License model", "data": "license_model"}, //
							{"title": "Software", "data": "software"}, 					//
							{"title": "Storage GB", "data": "storage_gb", "type": "num"}, //
							{"title": "ECU", "data": "ecu", "type": "num"},				//			


*/
							//{"title": "Region", "data": "region"},
							//{"title": "Current", "data": "current"},
							//{"title": "Enhanced Network", "data": "enhanced_network"},

							//{"title": "Unit", "data": "unit"},
							//{"title": "Contract Length", "data": "contract_length"},
							//{"title": "Purchase Option", "data": "purchase_option"},
							//{"data": "usage_type"},
							//{"data": "operation"},
							// {"title": "", "data": "compatibility_hash"},
							// {"title": "", "data": "report_id"},
							// {"title": "", "data": "creation_date"},
							//{"title": "ECUNUM", "data": "ecu_num"},
					
					//		{"title": "Pin", "data": "pin"},
							//],

							//order: [ [ 14, 'desc' ]],
							// order: [ [ 0, 'desc' ]],
							


						});

				recordLabel();
				auroFilter();
				
		  this.table = table;
      }
    };


	var saveButton = document.querySelector('.btn--save');	
	saveButton.onclick = function() {
			colums(true);
			location.reload();
	}



//******************************************************************************
var app;

function init() {
	app = new App();
	app.initialise();

}
// End ec2chooser.js 


//Start other code js
window.onload = function() {

	init(); // start dataTables
	// bookmarks();	

}


// Custom select 
function auroFilter() {

	(() => {
		const selects = document.querySelectorAll('.pricing-tool .select');
		const tegSelects = document.querySelectorAll('.pricing-tool select');
		const tegCheckbox = document.querySelectorAll('.checkbox input');
		// const customInputDropdown = document.querySelector('.custom-input__dropdown');

		selects.forEach((el) => {

			const customSelect = document.createElement('div');
			customSelect.classList.add('custom-select');

			const select = el.querySelector('select');
			const optionsList = document.createElement('ul');

			for (let i = 0; i < select.options.length; i++) {

				const li = document.createElement('li');

				if(select.options[i].value === 'default'){
					li.setAttribute('hidden' , 'hidden'); 
				}

				li.setAttribute('data-value' , select.options[i].value); 
				li.textContent = select.options[i].textContent;
				optionsList.appendChild(li)


				customSelect.setAttribute('data-value', select.options[select.selectedIndex].value);
				customSelect.setAttribute('data-name', select.getAttribute('name'));
				customSelect.textContent = select.options[select.selectedIndex].textContent;

			}
			el.appendChild(customSelect);
			el.appendChild(optionsList);			
		})

		const customSelects = document.querySelectorAll('.pricing-tool .custom-select');
		const customOptions = document.querySelectorAll('.pricing-tool .select ul');

		customSelects.forEach((select, i) => {
			select.addEventListener('click', function(e) {
				const arrNo = [];
				e.stopPropagation();

				this === select && arrNo.push(i);

				customOptions.forEach((el, i) => {
					arrNo[0] !== i && el.classList.remove('open');
				});

				this.nextElementSibling.classList.toggle('open');

				// customInputDropdown.classList.remove('open');

			});
			select.dataset.value === "default" && select.classList.add('not-chosen');

		});

		document.addEventListener('click' , () => {
			customOptions.forEach(ul => ul.classList.remove('open'));

			// customInputDropdown.classList.remove('open');
		});

		customOptions.forEach(ul => {
			ul.addEventListener('click' , function(e) {
				const currentSelect = this.previousElementSibling;
				currentSelect.textContent = e.target.textContent;
				currentSelect.dataset.value = e.target.dataset.value;
				if(this.parentElement.parentElement.getAttribute('id') == 'show') {
					table.page.len(+currentSelect.dataset.value).draw();
				}
				

				inputValueSelect();

				if(e.target.dataset.value === 'default'){
					currentSelect.classList.add('not-chosen');
				}else{
					currentSelect.classList.remove('not-chosen');
				}

				this.classList.remove('open');




				function inputValueSelect (){
					let nameSelect = currentSelect.dataset.name;

					for(let i = 0; i < tegSelects.length; i++){
						if(tegSelects[i].getAttribute('name') == nameSelect ){
							tegSelects[i].value = e.target.dataset.value;
							tegSelects[i].dispatchEvent(new Event('change'));
						}
					}
				}

			});
		});

	})();


//Advanced filter

(() => {
	const btnMoreFilters = document.querySelector('.btn-more-filters');
	const moreFilters = document.querySelector('.more-filters');

	btnMoreFilters.addEventListener('click' , () => {
		moreFilters.classList.toggle('open');
		const arrow = btnMoreFilters.querySelector('.icon-arrow');
		arrow.classList.toggle('rotate');
	});
})();


//Colomns

(() => {
	const btnColomns = document.querySelector('.btn-colomns');
	const colomnsBlock = document.querySelector('.colomns-block');
	const restore = colomnsBlock.querySelector('.btn__restore');
	const btns = colomnsBlock.querySelectorAll('.btn');
	const inputs = colomnsBlock.querySelectorAll('input');

/*
	inputs.forEach((input) => {
		input.checked = true;
	});
*/
	btnColomns.addEventListener('click' , function() {
		this.classList.toggle('active');
		colomnsBlock.classList.toggle('open');
	});

	restore.addEventListener('click', () => {


		inputs.forEach((input) => {
			input.checked = true;

		});
		
	});

	btns.forEach((btn) => {
		btn.addEventListener('click', () => {
			btnColomns.classList.remove('active');
			colomnsBlock.classList.remove('open');
		});
	});

})();


// info content show

(() => {
	const infoIcons = document.querySelectorAll('.info');
	const infoContents = document.querySelectorAll('.info-content');

	infoIcons.forEach((icon, i) =>{
		icon.addEventListener('mouseover' , function() {
			let dataInfo = this.dataset.info;

			infoContents.forEach((el , i) => {
				if(dataInfo === el.dataset.info){
					el.classList.add('open');
				}
			});
		});
		icon.addEventListener('mouseout' , function() {

			infoContents.forEach((el , i) => {
				el.classList.remove('open');
			});
		});
	});
})();

// reset all filters 

(() => {
	const filterBlock = document.querySelector('.filter-block');
	const selects = filterBlock.querySelectorAll('.custom-select');
	const options = filterBlock.querySelectorAll('.select li');
	const inputs = filterBlock.querySelectorAll('input');
	const inputsCheckbox = filterBlock.querySelectorAll('.checkbox input');
	// const selectEnhancedNetwork = filterBlock.querySelector('#enhanced_network');
	//const enhancedNetworkSpan = filterBlock.querySelectorAll('.checkbox span');
	const btnReset = filterBlock.querySelector('.btn-reset');

	btnReset.addEventListener('click' , () =>{
		sessionStorage.clear()
		location.reload();

		/*selects.forEach((select, i ) => {
			const parent = select.parentElement;
			const options = parent.querySelectorAll('li');

			options.forEach(li => {
				if(li.dataset.value === 'default'){
					select.dataset.value = li.dataset.value;
					select.textContent = li.textContent;
				}
			});
			select.classList.add('not-chosen');
		});	
		inputs.forEach((input, i ) => {
			input.value = 0;
		});	
		inputsCheckbox.forEach((input, i) => {
			input.checked = false;			
		});*/
	});

	inputs.forEach(input => {
		input.addEventListener('click' , function() {
			this.select();
			if (this.getAttribute('id') === 'current') {
				if(this.value !== 'Yes') {
					this.value = 'Yes';
				} else {
					this.value = '';
				}
				// this.dispatchEvent(new Event('change'));
			} 
			 if (this.getAttribute('id') === 'enhanced_network') {
				if(this.value !== 'Yes') {
					this.value = 'Yes';
				} else {
					this.value = '';
				}
			};
		});
	});	

	// inputsCheckbox.forEach(input => {
	// 	console.log(input);
	// 	input.addEventListener('change', function(e) {
	// 			if(input.getAttribute('name') === 'current' ){
	// 				input.value = e.target.value;
	// 				input.dispatchEvent(new Event('change'));
	// 			}
	// 		})
	// })
})();




//  custom input 

// (() => {
// 	const customInput = document.querySelector(".custom-input");
// 	const arrow = customInput.querySelector('.icon-arrow__wrapper');
// 	const dropdown = customInput.querySelector('.custom-input__dropdown');
// 	const dropdownItem = dropdown.querySelectorAll('li');
// 	const input = customInput.querySelector('input');
	
// 	arrow.addEventListener('click', (e) => {
// 		e.stopPropagation();
// 		dropdown.classList.toggle('open');
// 		input.classList.toggle('focus');
// 	});

// 	dropdownItem.forEach((item , i) => {
// 		item.addEventListener('click' , function() {
			
// 			input.value = this.textContent;
// 			dropdown.classList.remove('open');
// 			input.classList.remove('focus');
// 		});
// 	})

// })();

// pin select
(() => {
	const table = document.querySelector('.table');
	const pinBoxes = table.querySelectorAll('.pin-box');
	const pins = table.querySelectorAll('.icon-pin');

	pinBoxes.forEach((pinBox , i) => {
		pinBox.addEventListener('click' , function() {
			const pin =  this.querySelector('.icon-pin');

			pin.classList.toggle('active');
		});
	});
})();


// mark.js

(() => {
	const markInstance = new Mark(document.querySelector('.context'));
	const searchBlock = document.querySelector('.search-block');
	const input = searchBlock.querySelector(' input');
	const matches = searchBlock.querySelector('.matches');
	const count = matches.querySelector('span');
	
	function performMark() {
		let keyword = input.value;
		let marks = document.querySelectorAll('mark');

		if (keyword.length >= 1){
			count.textContent = marks.length;
			matches.classList.add('active');
		}else{
			matches.classList.remove('active');
		}

		const options = {};


		markInstance.unmark({
			done: function(){
				markInstance.mark(keyword, options);
			}
		});
	};

	input.addEventListener("input", performMark);
})();

};

// record Label for showing
function recordLabel() {      	  
	var dataTables_length = document.querySelector('.dataTables_length') ;
	var label = document.querySelector('.dataTables_length label').innerHTML;
	dataTables_length.setAttribute('id', 'show');
	dataTables_length.innerHTML = '<label for="showing">Showing</label>'+label;
}

// (() => {
// 	const prevCurrent = document.querySelector('.js-checkbox-previous');

// 	prevCurrent.addEventListener('click', function() {
// 		console.log(this);
// 	});
// })();


//pin save bookmarks



// function bookmarks() {
// 	setTimeout(() => {
// 		const datatable = document.querySelectorAll('#datatable td:last-child');
// 		const bookmarks = [];
// 		const bookmarkBlock = $('.bookmarks tbody');
		
// 		datatable.forEach(el => {
// 			el.addEventListener('click', function()  {
// 				const obj = {};
// 				const trChildrens = this.parentElement.querySelectorAll('td');

// 				trChildrens.forEach((td) => {
// 					obj[td.textContent] = td.textContent;
// 					obj.id = Date.now();
// 				});
				
// 				bookmarks.push(obj)

// 				bookmarks.forEach((obj) => {
// 					bookmarkBlock.append(parseObj(obj));
// 				});
// 			});
			
// 		});

		
	
// 	}, 500)
// }


// function parseObj(obj) {
// 	const tr = $('<tr></tr>');
// 	for(let key in obj){
// 		if(key !== 'id'){
// 			const td = $('<td></td>');
// 			td.html(key);
// 			tr.append(td);

// 			console.log(td)
// 		}
		
// 	}

	
// 	console.log(tr)
// 	return tr;
// }

//delegate table

let pinned = 0;
let dataPinned = document.querySelector('.pinned');
$('#datatable').on('click', 'td:last-child', function() {
	let tr = $('<tr></tr>');
	
	tr.html($(this).parent().html());

	console.log($('.bookmarks thead').children())

	if($('.bookmarks thead').children().length === 0 ){
		let thead = $('<tr></tr>');

		thead.html($(this).parent().parent().prev().children().html());

		$('.bookmarks thead').append(thead);
	}

	

	dataPinned.style.display = 'block';
	++pinned;
	dataPinned.dataset.pinned = pinned;
	if (dataPinned.dataset.pinned > 1) {
		dataPinned.dataset.items = "items";
	} 
	if (dataPinned.dataset.pinned > 9) {
		dataPinned.classList.add("space-left");
	}
	
	$('.bookmarks tbody').append(tr);
});


//delegate bookmarks
$('.bookmarks').on('click', 'td:last-child', function() {
	$(this).parent().remove();
	--pinned;
	dataPinned.dataset.pinned = pinned;
	

	if(pinned === 0){
		$('.bookmarks thead').children()[0].remove();
		dataPinned.style.display = 'none';
	}

	if (dataPinned.dataset.pinned < 2) {
		dataPinned.dataset.items = "item";
	}

	if (dataPinned.dataset.pinned < 10) {
		dataPinned.classList.remove("space-left");
	}

});
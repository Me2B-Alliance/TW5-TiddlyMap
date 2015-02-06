/*\

title: $:/plugins/felixhayashi/tiddlymap/adapter.js
type: application/javascript
module-type: library

@preserve

\*/
(function(){var e=require("$:/plugins/felixhayashi/tiddlymap/utils.js").utils;var t=require("$:/plugins/felixhayashi/tiddlymap/view_abstraction.js").ViewAbstraction;var i=require("$:/plugins/felixhayashi/vis/vis.js");var r=function(e){this.wiki=e?e:$tw.wiki;this.opt=$tw.tiddlymap.opt;this.logger=$tw.tiddlymap.logger};r.prototype.insertEdge=function(i,r){if(typeof i!=="object"||!i.from||!i.to)return;r=new t(r);var o=i.label?i.label:this.opt.misc.unknownEdgeLabel;var d=r.getEdgeStoreLocation()+"/"+o;var s=this.wiki.getTiddlerData(d,[]);delete i.label;if(i.id){var a=e.keyOfItemWithProperty(s,"id",i.id);if(typeof a==="undefined"){a=s.length}}else{i.id=e.genUUID();var a=s.length}this.logger("info","Inserting edge",i,"into store",d);s[a]=i;var n={};var l=this.wiki.getTiddler(d);if(!l||!l.fields.id){n.id=e.genUUID()}this.wiki.setTiddlerData(d,s,n);i.label=o;$tw.tiddlymap.edgeChanges.push({type:"insert",edge:i});return i};r.prototype.selectEdgesByFilter=function(t,i){var r=e.getMatches(t);var o=[];for(var d=0;d<r.length;d++){o.push(e.getBasename(r[d]))}return this.selectEdgesByLabel(o,i)};r.prototype.selectEdgesByLabel=function(i,r){if(typeof r!=="object")r=e.getEmptyMap();var o=new t(r.view);var d=o.getEdgeStoreLocation();var s=e.getEmptyMap();for(var a=0;a<i.length;a++){var n=d+"/"+i[a];if(!e.tiddlerExists(n))continue;var l=this.wiki.getTiddlerData(n);for(var p=0;p<l.length;p++){if(i[a]!==this.opt.misc.unknownEdgeLabel){l[p].label=i[a]}s[l[p].id]=l[p]}}return e.convert(s,r.outputType)};r.prototype.selectEdgesByEndpoints=function(i,r){if(typeof r!=="object")r=e.getEmptyMap();var o=new t(r.view);var d=o.exists()?r.view.getEdgeFilter("compiled"):this.opt.filter.allSharedEdges;var s=this.selectEdgesByFilter(d,{outputType:"array",view:o});return this.filterEdgesByEndpoints(s,i,r)};r.prototype.filterEdgesByEndpoints=function(t,i,r){if(typeof r!=="object")r=e.getEmptyMap();t=e.convert(t,"array");var o=/^(=1|>=1|=2)$/;var d=o.test(r.endpointsInSet)?r.endpointsInSet:">=1";var i=e.getLookupTable(i,"id");var s=e.getEmptyMap();for(var a=0;a<t.length;a++){var n=t[a];switch(d){case"=2":isMatch=i[n.from]&&i[n.to];break;case">=1":isMatch=i[n.from]||i[n.to];break;case"=1":isMatch=i[n.from]===undefined&&i[n.to]||i[n.to]===undefined&&i[n.from];break;default:isMatch=false}if(isMatch)s[n.id]=n}return e.convert(s,r.outputType)};r.prototype.selectNodesByFilter=function(t,i){var r=e.getMatches(t);return this.selectNodesByReference(r,i)};r.prototype.selectNodesByReference=function(t,i){if(typeof i!=="object")i=e.getEmptyMap();var r=i.addProperties;var o=e.getEmptyMap();for(var d=0;d<t.length;d++){var s=this.createNode(t[d],r,i.view);if(s){o[s.id]=s}}if(i.view){this._restorePositions(o,i.view)}return e.convert(o,i.outputType)};r.prototype.createNode=function(i,r,o){var d=this.wiki.getTiddler(e.getTiddlerReference(i));if(!d||d.isDraft()||this.wiki.isSystemTiddler(d.fields.title)){return}if(!d.fields[this.opt.field.nodeId]){var s=e.getEmptyMap();s[this.opt.field.nodeId]=e.genUUID();d=new $tw.Tiddler(d,s);$tw.wiki.addTiddler(d)}var a=e.getEmptyMap();a.label=d.fields[this.opt.field.nodeLabel]?d.fields[this.opt.field.nodeLabel]:d.fields.title;var n=d.fields[this.opt.field.nodeIcon];if(n){var l=e.getTiddler(n);if(l&&l.fields.text){var p=l.fields.type?l.fields.type:"image/svg+xml";var f=l.fields.text;a.shape="image";if(p==="image/svg+xml"){f=f.replace(/\r?\n|\r/g," ");if(!e.inArray("xmlns",f)){f=f.replace(/<svg/,'<svg xmlns="http://www.w3.org/2000/svg"')}}var g=$tw.config.contentTypeInfo[p].encoding==="base64"?f:window.btoa(f);a.image="data:"+p+";base64,"+g}}a.title=d.fields[this.opt.field.nodeInfo]?d.fields[this.opt.field.nodeInfo]:d.fields.title;if(d.fields.color){a.color=d.fields.color}if(typeof r==="object"){a=$tw.utils.extendDeepCopy(a,r)}a.id=d.fields[this.opt.field.nodeId];a.ref=d.fields.title;if(o){var o=new t(o);if(o.isConfEnabled("physics_mode")){a.allowedToMoveX=true;a.allowedToMoveY=true}}return a};r.prototype.selectNeighbours=function(t,i){if(typeof i!=="object")i=e.getEmptyMap();if(i.edges){var r=this.filterEdgesByEndpoints(i.edges,t,{outputType:"array",endpointsInSet:"=1"})}else{var r=this.selectEdgesByEndpoints(t,{outputType:"array",view:i.view,endpointsInSet:"=1"})}var t=e.getLookupTable(t,"id");var o=e.getEmptyMap();for(var d=0;d<r.length;d++){var s=t[r[d].from]?r[d].to:r[d].from;o[s]=true}return this.selectNodesByIds(o,i)};r.prototype.selectNodesByIds=function(t,r){if(typeof r!=="object")r=e.getEmptyMap();if(Array.isArray(t)){t=e.getArrayValuesAsHashmapKeys(t)}else if(t instanceof i.DataSet){t=e.getLookupTable(t,"id")}var o=e.getEmptyMap();var d=this.wiki.allTitles();var s=this.opt.field.nodeId;var a=r.addProperties;for(var n in t){for(var l=0;l<d.length;l++){var p=this.createNode(d[l],a,r.view);if(p&&t[p.id]){o[p.id]=p}}}if(r.view){this._restorePositions(o,r.view)}return e.convert(o,r.outputType)};r.prototype.selectNodeById=function(t,i){if(typeof i!=="object"){i=e.getEmptyMap()}i.outputType="hashmap";var r=this.selectNodesByIds([t],i);return r[t]};r.prototype.deleteNodesFromStore=function(t,i){if(!t)return;var r=this.opt.field.nodeId;var o=this.wiki.allTitles();var d=[];var t=e.getLookupTable(t,"id");for(var s in t){for(var a=0;a<o.length;a++){var n=e.getTiddlersWithProperty(r,s,{isIncludeDrafts:true,isReturnRef:true,tiddlers:o});d=d.concat(n)}}var l=this.wiki.getTiddlerList("$:/StoryList");if(l.length){l=l.filter(function(t){return!e.inArray(t,d)});var p=this.wiki.getTiddler("$:/StoryList");this.wiki.addTiddler(new $tw.Tiddler(p,{list:l}))}e.deleteTiddlers(d);var f=this.selectEdgesByEndpoints(t,{view:i,outputType:"array"});this.deleteEdgesFromStore(f)};r.prototype.deleteEdgeFromStore=function(i,r){if(!i)return;var o=i.label?i.label:this.opt.misc.unknownEdgeLabel;var r=new t(r);var d=r.getEdgeStoreLocation()+"/"+o;var s=this.wiki.getTiddlerData(d,[]);this.logger("info","Edge with label",o,"will be deleted: ",i);var a=e.keyOfItemWithProperty(s,"id",i.id);if(a!=null){s.splice(a,1);this.wiki.setTiddlerData(d,s);$tw.tiddlymap.edgeChanges.push({type:"delete",edge:i})}};r.prototype.deleteEdgesFromStore=function(t,i){t=e.convert(t,"array");for(var r=0;r<t.length;r++){this.deleteEdgeFromStore(t[r],i)}};r.prototype.getView=function(e,i){return new t(e,i)};r.prototype.createView=function(e){if(typeof e!=="string"||e===""){e="My view"}var i=this.wiki.generateNewTitle(this.opt.path.views+"/"+e);return new t(i,true)};r.prototype._restorePositions=function(i,r){r=new t(r);if(!r.exists())return;var o=r.getPositions();for(var d in i){if(e.hasOwnProp(o,d)){i[d].x=o[d].x;i[d].y=o[d].y}}};r.prototype.storePositions=function(e,i){i=new t(i);i.setPositions(e)};r.prototype.setupTiddler=function(t){var i=this.wiki.getTiddler(e.getTiddlerReference(t));if(!i)return;var r=this.opt.field.nodeId;if(!i.fields[r]){var o=e.getEmptyMap();o[r]=e.genUUID();i=new $tw.Tiddler(i,o);$tw.wiki.addTiddler(i)}return i};r.prototype.insertNode=function(i,r){if(typeof r!=="object")r=e.getEmptyMap();if(typeof i!=="object"){i=e.getEmptyMap()}var o=e.getEmptyMap();o.title=this.wiki.generateNewTitle(i.label?i.label:"New node");i.label=o.title;i.ref=o.title;if(!i.id){if(this.opt.field.nodeId==="title"){i.id=o.title}else{i.id=e.genUUID();o[this.opt.field.nodeId]=i.id}}if(r.view){var d=new t(r.view);d.addNodeToView(i)}this.wiki.addTiddler(new $tw.Tiddler(o,this.wiki.getModificationFields(),this.wiki.getCreationFields()));return i};exports.Adapter=r})();
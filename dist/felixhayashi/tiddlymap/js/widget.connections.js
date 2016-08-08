/*\

title: $:/plugins/felixhayashi/tiddlymap/js/widget/connections
type: application/javascript
module-type: widget

@preserve

\*/
"use strict";exports["tmap-edgelistitem"]=EdgeListItemWidget;exports["tmap-connections"]=EdgeListWidget;var Widget=require("$:/core/modules/widgets/widget.js").widget;var EdgeType=require("$:/plugins/felixhayashi/tiddlymap/js/EdgeType");var utils=require("$:/plugins/felixhayashi/tiddlymap/js/utils");function EdgeListWidget(e,t){Widget.call(this,e,t)}EdgeListWidget.prototype=Object.create(Widget.prototype);EdgeListWidget.prototype.render=function(e,t){this.parentDomNode=e;this.computeAttributes();this.execute();this.renderChildren(e,t)};EdgeListWidget.prototype.execute=function(){var e=[this.getVariable("currentTiddler")];var t=this.getAttribute("filter","");var i=this.getAttribute("direction","both");var r=$tm.indeces.allETy;var s=utils.getEdgeTypeMatches(t,r);var d={typeWL:utils.getLookupTable(s),direction:i};var o=$tm.adapter.getNeighbours(e,d);var a=o.nodes;var g=o.edges;var n=[];for(var h in g){var p=g[h];var l=a[p.to]||a[p.from];if(!l)continue;n.push({type:"tmap-edgelistitem",edge:p,typeWL:d.typeWL,neighbour:l,children:this.parseTreeNode.children})}if(!n.length){this.wasEmpty=true;n=this.getEmptyMessage()}else if(this.wasEmpty){this.removeChildDomNodes()}this.makeChildWidgets(n)};EdgeListWidget.prototype.getEmptyMessage=function(){var e=this.wiki.parseText("text/vnd.tiddlywiki",this.getAttribute("emptyMessage",""),{parseAsInline:true});return e?e.tree:[]};EdgeListWidget.prototype.refresh=function(e){var t=this.computeAttributes();var i=Object.keys(t).length;if(i){this.refreshSelf();return true}for(var r in e){if(!utils.isSystemOrDraft(r)){this.refreshSelf();return true}}return this.refreshChildren(e)};function EdgeListItemWidget(e,t){Widget.call(this,e,t);this.arrows=$tm.misc.arrows}EdgeListItemWidget.prototype=Object.create(Widget.prototype);EdgeListItemWidget.prototype.execute=function(){var e=this.parseTreeNode;var t=$tm.indeces.tById[e.neighbour.id];var i=utils.flatten(e.edge);for(var r in i){if(typeof i[r]==="string"){this.setVariable("edge."+r,i[r])}}this.setVariable("currentTiddler",t);this.setVariable("neighbour",t);var s=$tm.indeces.allETy[i.type];var d=i.to===e.neighbour.id?"to":"from";var o=d;if(s.biArrow){o="bi"}else{if(d==="to"&&s.invertedArrow){o="from"}else if(d==="from"&&s.invertedArrow){o="to"}}this.setVariable("direction",o);this.setVariable("directionSymbol",o==="bi"?this.arrows.bi:o==="from"?this.arrows.in:this.arrows.out);this.makeChildWidgets()};EdgeListItemWidget.prototype.refresh=function(e){return this.refreshChildren(e)};
(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{243:function(t,e,l){"use strict";l.r(e);var s=l(0),r=Object(s.a)({},(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[l("h1",{attrs:{id:"模型漂移"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#模型漂移"}},[t._v("#")]),t._v(" 模型漂移")]),t._v(" "),l("ul",[l("li",[t._v("症状：  随着视角旋转，模型并不能在中心位置")]),t._v(" "),l("li",[t._v("问题定位：图形学，与cesium有关")]),t._v(" "),l("li",[t._v("问题复现：模型和地形的相对高度不一致")]),t._v(" "),l("li",[t._v("问题解决：\n"),l("ul",[l("li",[l("ol",[l("li",[l("code",[t._v("viewer.scene.globe.depthTestAgainstTerrain=true;//打开地形深度检测")])])])]),t._v(" "),l("li",[l("ol",{attrs:{start:"2"}},[l("li",[t._v("调节对象高度；")])])]),t._v(" "),l("li",[l("ol",{attrs:{start:"3"}},[l("li",[l("code",[t._v("viewer.scene.globe.depthTestAgainstTerrain=false;//关闭地形深度检测")])])])])])])])])}),[],!1,null,null,null);e.default=r.exports}}]);
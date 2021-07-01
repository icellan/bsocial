"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),_createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass")),_bsv=_interopRequireDefault(require("bsv")),_post=_interopRequireDefault(require("./post")),_like=_interopRequireDefault(require("./like")),_tip=_interopRequireDefault(require("./tip")),_follow=_interopRequireDefault(require("./follow")),BSocial=function(){function a(b){if((0,_classCallCheck2["default"])(this,a),!b)throw new Error("App name needs to be set");this.appName=b}return(0,_createClass2["default"])(a,[{key:"post",value:function post(){return new _post["default"](this.appName)}},{key:"repost",value:function repost(a){var b=new _post["default"](this.appName);return b.setType("repost"),b.setTxId(a),b}},{key:"reply",value:function reply(a){var b=new _post["default"](this.appName);return b.setTxId(a),b}},{key:"paywall",value:function paywall(a,b,c,d){var e=4<arguments.length&&void 0!==arguments[4]?arguments[4]:"USD",f=_bsv["default"].PrivateKey.fromWIF(b),g=new _post["default"](this.appName);return g.setPaywall(a,f,c,d,e),g}},{key:"like",value:function(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"",c=new _like["default"](this.appName);return c.setTxId(a),b&&c.setEmoji(b),c}},{key:"tip",value:function(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"USD",d=new _tip["default"](this.appName);return d.setTxId(a),b&&c&&d.setAmount(b,c),d}},{key:"follow",value:function(a){var b=new _follow["default"](this.appName);return b.setIdKey(a),b}},{key:"unfollow",value:function unfollow(a){var b=new _follow["default"](this.appName);return b.setIdKey(a),b.setAction("unfollow"),b}}]),a}(),_default=BSocial;exports["default"]=_default;
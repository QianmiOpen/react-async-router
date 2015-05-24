# react-async-router
react-router async loading component

react-router为前端的SPA应用提供一种非常优雅的路由方案，但是还么有一个完善的异步方案，虽然已有些眉目[看这里](https://github.com/rackt/react-router/issues/755)。

因为router的handler是一个react的组件，如果我们在代码中大量的通过require或者import(es6)的方式，
这样会带来两个缺点：

1. 所有的模块阻塞的方式加载
2. 所有的模块都会合并在一个chunk中。（:) 是的细心的您已经猜到我们使用的是webpack了）。

我们希望我们的应用的chunk(js)的加载是**按需的异步的加载**，那怎么才能愉快的玩耍呢？

首先要解决的是handler需要的是一个react组件对象，这里我们会想到react常用的一招portal方案。
这个办法常用来整合第三方的库如jquery的插件，如果插件会去改变我们的react生成的dom，
这样会导致react的diff算法出现问题。通常的解决办法就是portal。

思路，先用react渲染一个空div，等到jquery的渲染完后，获取节点dom，再次用react重新re-render即可。


好了下一个问题，怎么解决异步按需呢？
webpack为我们提供了两种常用异步的方式：

1. AMD style， require([], function() {}) 
2. commonjs style,  require.ensure([], function(require) {})

这两种都有一个相同的问题，就是参数不能是表达式，也就是说，

```javascript
 //yes
require(['./dashboard'], function(dashboard) {})

//oops
//1，webpack will give warning info. 
//2. webpack会默认的递归(RegExp would be  /^\.\/.*\.js$/)的把整个当前目录的文件都会扫描出来放进一个map变量中，
///***/ function(module, exports, __webpack_require__) {
//
//    var map = {
//        "./a": 1,
//        "./a.js": 1,
//        "./b": 2,
//        "./b.js": 2,
//        "./c": 3,
//        "./c.js": 3
//    };
//然后把所有这些文件放进一个chunk中，会导致这个chunk文件巨大。
var module = './dashboard';
require([module], function(dashboard) {});

//require.ensure同样的问题
```
完整的解释[猛戳这里](https://github.com/webpack/webpack/issues/118)

当然上面的问题可以通过改变webpack的上下文的默认的正则的规则来解决，但是还是不直观而且更加的复杂。因为依赖的模块可能分散在多个目录中比如node_modules, web_modules.

我们希望做到简单一点就是一个页面模块就是一个chunk，然后按需加载就可以了。
通过不断看webpack文档，发现另外一个神奇loader，[bundler—loader](https://github.com/webpack/bundle-loader)可以实现我们想要的功能。

bundle-loader 对异步的支持，
```javascript
// The chunk is requested, when you require the bundle
var waitForChunk = require("bundle!./file.js");

// To wait until the chunk is available (and get the exports)
//  you need to async wait for it.
waitForChunk(function(file) {
    // use file like is was required with
    // var file = require("./file.js");
});
// wraps the require in a require.ensure block
```
The file is requested when you require the bundle loader. If you want it to request it lazy, use:
```javascript
var load = require("bundle?lazy!./file.js");

// The chunk is not requested until you call the load function
load(function(file) {

});
```
You may set name for bundle (name query parameter). See documentation.
```javascript
require("bundle?lazy&name=my-chunk!./file.js");
```

bundle-loader可以实现我们对于异步的渴求，又可以使webpack在打包的时候把模块单独放进一个chunk。


webpack核心的思想是bundler，打包一切可以打包的东西。在编译期确定所有的依赖等等。但是异步带来了很多的不确定性，这个让webpack稍微有点为难，然后就默认的去做一些递归的扫描。


demo:
```javascript
import React from 'react';
import {Route, DefaultRoute, HashLocation, run} from 'react-router';
import asyncLoader from './async-loader';
import App from './app';
import Home from './home';
import About from 'bundle?lazy!./about';
import Inbox from 'bundle?lazy!./inbox';


let routes = (
  <Route path="/" handler={App}>
    <DefaultRoute name="home" handler={Home}/>
    <Route name="about" handler={asyncLoader(About)}/>
    <Route name="inbox" handler={asyncLoader(Inbox)}/>
  </Route>
);


run(routes, HashLocation, (Root) => {
  React.render(<Root/>, document.body);
});

```

体验下这个demo：
npm install

webpack-dev-server --port 3000 -w

http://localhost:3000/bundle

主要看浏览器中脚本的加载顺序以及名字，有惊喜。

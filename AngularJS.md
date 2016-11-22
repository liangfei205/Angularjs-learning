# Angular规范

## 目录

  1. [目录结构](#目录结构)
  1. [命名](#命名)
  1. [Modules](#modules)
  1. [Controllers](#controllers)
  1. [Services](#services)
  1. [Directives](#directives)
  1. [ui-route](#ui-route)
  1. [filter](#filter)
  1. [常量](#常量)
  1. [Angular$包装服务](#Angular$包装服务)
  
  
**[返回顶部](#目录)**


## 目录结构
* 按照业务功能优先，类型其次的组织方式

如下：

```
.
├── js
│   ├── app.js
│   ├── config.js
│   ├── common
│   │   ├── controllers
│   │   ├── directives
│   │   ├── filters
│   │   └── services
│   ├── home
│   │   ├── controllers
│   │   │   ├── FirstCtrl.js
│   │   │   └── SecondCtrl.js
│   │   ├── directives
│   │   │   └── directive1.js
│   │   ├── filters
│   │   │   ├── filter1.js
│   │   │   └── filter2.js
│   │   └── services
│   │       ├── service1.js
│   │       └── service2.js
│   └── about
│       ├── controllers
│       │   └── ThirdCtrl.js
│       ├── directives
│       │   ├── directive2.js
│       │   └── directive3.js
│       ├── filters
│       │   └── filter3.js
│       └── services
│           └── service3.js
├── css
├── lib
├── test
└── ...
```

**[返回顶部](##目录)**

## 命名
* 下表展示了各个Angular元素的命名约定

元素 | 命名风格 | 实例 | 用途
----|------|----|--------
Modules | lowerCamelCase  | angularApp |
Controllers | Functionality + 'Ctrl'  | AdminCtrl |
Directives | lowerCamelCase  | userInfo |
Filters | lowerCamelCase | userFilter |
Services | UpperCamelCase | User | constructor
Services | lowerCamelCase | dataFactory | others

**[返回顶部](#目录)**

## Modules

### 定义(aka Setters)

  - 不使用任何一个使用了setter语法的变量来定义modules。

	*为什么?*：在一个文件只有一个组件的条件下，完全不需要为一个模块引入一个变量。

  ```javascript
  /* avoid */
  var app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

	你只需要用简单的setter语法来代替。

  ```javascript
  /* recommended */
  angular
    	.module('app', [
        'ngAnimate',
        'ngRoute',
        'app.shared',
        'app.dashboard'
    ]);
  ```

### Getters

  - 使用module的时候，避免直接用一个变量，而是使用getter的链式语法。

	*为什么？*：这将产生更加易读的代码，并且可以避免变量冲突和泄漏。

  ```javascript
  /* avoid */
  var app = angular.module('app');
  app.controller('SomeController', SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recommended */
  angular
      .module('app')
      .controller('SomeController', SomeController);

  function SomeController() { }
  ```

### Setting vs Getting

  - 只能设置一次。

  *为什么？*：一个module只能被创建一次，创建之后才能被检索到。

    - 设置module，`angular.module('app', []);`。
    - 获取module，`angular.module('app');`。
    
**[返回顶部](#目录)**

## 控制器

* 不要在控制器里操作 DOM，这会让你的控制器难以测试，而且违背了[关注点分离原则](https://en.wikipedia.org/wiki/Separation_of_concerns)。应该通过指令操作 DOM。
* 通过控制器完成的功能命名控制器 (如：购物卡，主页，控制板)，并以字符串`Ctrl`结尾。
* 控制器是纯 Javascript [构造函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)，所以应该用首字母大写的驼峰命名法（`HomePageCtrl`, `ShoppingCartCtrl`, `AdminPanelCtrl`, 等等）。
* 控制器不应该在全局中定义 (尽管 AngularJS 允许，但污染全局命名空间是个糟糕的实践)。
* 使用以下语法定义控制器：

  ```JavaScript
  function MyCtrl(dependency1, dependency2, ..., dependencyn) {
    // ...
  }
  module.controller('MyCtrl', MyCtrl);
  ```

* 如果使用数组定义语法声明控制器，使用控制器依赖的原名。这将提高代码的可读性：

  ```JavaScript
  function MyCtrl(s) {
    // ...
  }

  module.controller('MyCtrl', ['$scope', MyCtrl]);
  ```

   下面的代码更易理解

  ```JavaScript
  function MyCtrl($scope) {
    // ...
  }
  module.controller('MyCtrl', ['$scope', MyCtrl]);
  ```

   对于包含大量代码的需要上下滚动的文件尤其适用。这可能使你忘记某一变量是对应哪一个依赖。

* 尽可能的精简控制器。将通用函数抽象为独立的服务。
* 不要再控制器中写业务逻辑。把业务逻辑交给模型层的服务。
  举个例子:

  ```Javascript
  // 这是把业务逻辑放在控制器的常见做法
  angular.module('Store', [])
  .controller('OrderCtrl', ['$scope',function ($scope) {

    $scope.items = [];

    $scope.addToOrder = function (item) {
      $scope.items.push(item);//-->控制器中的业务逻辑
    };

    $scope.removeFromOrder = function (item) {
      $scope.items.splice($scope.items.indexOf(item), 1);//-->控制器中的业务逻辑
    };

    $scope.totalPrice = function () {
      return $scope.items.reduce(function (memo, item) {
        return memo + (item.qty * item.price);//-->控制器中的业务逻辑
      }, 0);
    };
  }]);
  ```

  当你把业务逻辑交给模型层的服务，控制器看起来就会想这样：（关于 service-model 的实现，参看 'use services as your Model'）:

  ```Javascript
  // Order 在此作为一个 'model'
  angular.module('Store', [])
  .controller('OrderCtrl', ['$scope','Order',function ($scope,Order) {

    $scope.items = Order.items;

    $scope.addToOrder = function (item) {
      Order.addToOrder(item);
    };

    $scope.removeFromOrder = function (item) {
      Order.removeFromOrder(item);
    };

    $scope.totalPrice = function () {
      return Order.total();
    };
  }]);
  ```

  为什么控制器不应该包含业务逻辑和应用状态？
  * 控制器会在每个视图中被实例化，在视图被销毁时也要同时销毁
  * 控制器是不可重用的——它与视图有耦合
  * Controllers are not meant to be injected


* 需要进行跨控制器通讯时，通过方法引用(通常是子控制器到父控制器的通讯)或者 `$emit`, `$broadcast` 及 `$on` 方法。发送或广播的消息应该限定在最小的作用域。
* 制定一个通过 `$emit`, `$broadcast` 发送的消息列表并且仔细的管理以防命名冲突和bug。

   Example:

   ```JavaScript
   // app.js
   /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   Custom events:
     - 'authorization-message' - description of the message
       - { user, role, action } - data format
         - user - a string, which contains the username
         - role - an ID of the role the user has
         - action - specific ation the user tries to perform
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
   ```

* 在需要格式化数据时将格式化逻辑封装成 [过滤器](#过滤器) 并将其声明为依赖：

   ```JavaScript
   function myFormat() {
     return function () {
       // ...
     };
   }
   module.filter('myFormat', myFormat);

   function MyCtrl($scope, myFormatFilter) {
     // ...
   }

   module.controller('MyCtrl', MyCtrl);
   ```

**[返回顶部](#目录)**

### 可访问的成员置顶###

  - 使用从[显露模块模式](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript)派生出来的技术把service（它的接口）中可调用的成员暴露到顶部，

    *为什么？*：易读，并且让你可以立即识别service中的哪些成员可以被调用，哪些成员必须进行单元测试（或者被别人嘲笑）。

    *为什么？*：当文件内容很长时，这可以避免需要滚动才能看到暴露了哪些东西。

    *为什么？*：虽然你可以随意写一个函数，但当函数代码超过一行时就会降低可读性并造成滚动。通过把实现细节放下面、把可调用接口置顶的形式返回service的方式来定义可调用的接口，从而使代码更加易读。

  ```javascript
  /* avoid */
  function dataService () {
      var someValue = '';
      function save () {
        /* */
      };
      function validate () {
        /* */
      };

      return {
          save: save,
          someValue: someValue,
          validate: validate
      };
  }
  ```

  ```javascript
  /* recommended */
  function dataService () {
      var someValue = '';
      var service = {
          save: save,
          someValue: someValue,
          validate: validate
      };
      return service;

      ////////////

      function save () {
        /* */
      };

      function validate () {
        /* */
      };
  }
  ```

  这种绑定方式复制了宿主对象，原始值不会随着暴露模块模式的使用而更新。

  ![Factories Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/above-the-fold-2.png)

### 函数声明隐藏实现细节

  - 函数声明隐藏实现细节，置顶绑定成员，当你需要在controller中绑定一个函数时，把它指向一个函数声明，这个函数声明在文件的后面会出现。

    *为什么？*：易读，易识别哪些成员可以在View中绑定和使用。

    *为什么？*：把函数的实现细节放到后面，你可以更清楚地看到重要的东西。

    *为什么？*：由于函数声明会被置顶，所以没有必要担心在声明它之前就使用函数的问题。

    *为什么？*：你再也不用担心当 `a`依赖于 `b`时，把`var a`放到`var b`之前会中断你的代码的函数声明问题。

    *为什么？*：函数表达式中顺序是至关重要的。

  ```javascript
  /**
   * avoid
   * Using function expressions
   */
   function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var getAvengers = function() {
        // implementation details go here
      };

      var getAvengerCount = function() {
        // implementation details go here
      };

      var getAvengersCast = function() {
        // implementation details go here
      };

      var prime = function() {
        // implementation details go here
      };

      var ready = function(nextPromises) {
        // implementation details go here
      };

      var service = {
          getAvengersCast: getAvengersCast,
          getAvengerCount: getAvengerCount,
          getAvengers: getAvengers,
          ready: ready
      };

      return service;
  }
  ```

  ```javascript
  /**
   * recommended
   * Using function declarations
   * and accessible members up top.
   */
  function dataservice($http, $location, $q, exception, logger) {
      var isPrimed = false;
      var primePromise;

      var service = {
          getAvengersCast: getAvengersCast,
          getAvengerCount: getAvengerCount,
          getAvengers: getAvengers,
          ready: ready
      };

      return service;

      ////////////

      function getAvengers() {
        // implementation details go here
      }

      function getAvengerCount() {
        // implementation details go here
      }

      function getAvengersCast() {
        // implementation details go here
      }

      function prime() {
        // implementation details go here
      }

      function ready(nextPromises) {
        // implementation details go here
      }
  }
  ```

**[返回顶部](#目录)**

## Factories

### 独立的数据调用

  - 把进行数据操作和数据交互的逻辑放到factory、service中，数据服务负责XHR请求、本地存储、内存存储和其它任何数据操作。

    *为什么？*：controller的作用是查看视图和收集视图的信息，它不应该关心如何取得数据，只需要知道哪里需要用到数据。把取数据的逻辑放到数据服务中能够让controller更简单、更专注于对view的控制。

    *为什么？*：方便测试。

    *为什么？*：数据服务的实现可能有非常明确的代码来处理数据仓库，这可能包含headers、如何与数据交互或是其它service，例如`$http`。把逻辑封装到单独的数据服务中，这隐藏了外部调用者（例如controller）对数据的直接操作，这样更加容易执行变更。

  ```javascript
  /* recommended */

  // dataservice factory
  angular
      .module('app.core')
      .service('dataservice', ['$http', 'logger',function dataservice($http, logger) {
      return {
          getAvengers: getAvengers
      };

      function getAvengers() {
          return $http.get('/api/maa')
              .then(getAvengersComplete)
              .catch(getAvengersFailed);

          function getAvengersComplete(response) {
              return response.data.results;
          }

          function getAvengersFailed(error) {
              logger.error('XHR Failed for getAvengers.' + error.data);
          }
      }
  }])
  ```

    注意：数据服务被调用时（例如controller），隐藏调用的直接行为，如下所示。

  ```javascript
  /* recommended */

  // controller calling the dataservice factory
  angular
      .module('app.avengers')
      .controller('Avengers',  ['dataservice', 'logger',function Avengers(dataservice, logger) {
      var vm = this;
      vm.avengers = [];

      activate();

      function activate() {
          return getAvengers().then(function() {
              logger.info('Activated Avengers View');
          });
      }

      function getAvengers() {
          return dataservice.getAvengers()
            .then(function(data) {
                vm.avengers = data;
                return vm.avengers;
            });
      }
  }])
  ```

### 数据调用返回一个Promise

  - 就像`$http`一样，调用数据时返回一个promise，在你的调用函数中也返回一个promise。

    *为什么？*：你可以把promise链接到一起，在数据调用完成并且resolve或是reject这个promise后采取进一步的行为。

  ```javascript
  /* recommended */

  activate();

  function activate() {
      /**
       * Step 1
       * Ask the getAvengers function for the
       * avenger data and wait for the promise
       */
      return getAvengers().then(function() {
        /**
         * Step 4
         * Perform an action on resolve of final promise
         */
        logger.info('Activated Avengers View');
      });
  }

  function getAvengers() {
      /**
       * Step 2
       * Ask the data service for the data and wait
       * for the promise
       */
      return dataservice.getAvengers()
        .then(function(data) {
            /**
             * Step 3
             * set the data and resolve the promise
             */
            vm.avengers = data;
            return vm.avengers;
        });
  }
  ```

**[返回顶部](#目录)**

## Directives

* 使用小写字母开头的驼峰法命名指令。
* 在 link function 中使用 `scope` 而非 `$scope`。在 compile 中, 你已经定义参数的 post/pre link functions 将在函数被执行时传递, 你无法通过依赖注入改变他们。这种方式同样应用在 AngularJS 项目中。
* 为你的指令添加自定义前缀以免与第三方指令冲突。
* 不要使用 `ng` 或 `ui` 前缀，因为这些备用于 AngularJS 和 AngularJS UI。
* DOM 操作只通过指令完成。
* 为你开发的可复用组件创建独立作用域。
* 以属性和元素形式使用指令，而不是注释和 class。这会使你的代码可读性更高。
* 使用 `scope.$on('$destroy', fn)` 来清除。这点在使用第三方指令的时候特别有用。
* 处理不可信的数据时，不要忘记使用 `$sce` 。

### 一个directive一个文件

  - 一个文件中只创建一个directive，并依照directive来命名文件。

    *为什么？*：虽然把所有directive放到一个文件中很简单，但是当一些directive是跨应用的，一些是跨模块的，一些仅仅在一个模块中使用时，想把它们独立出来就非常困难了。

    *为什么？*：一个文件一个directive也更加容易维护。

    > 注： "**最佳实践**：Angular文档中有提过，directive应该自动回收，当directive被移除后，你可以使用`element.on('$destroy', ...)`或者`scope.$on('$destroy', ...)`来执行一个clean-up函数。"

  ```javascript
  /* avoid */
  /* directives.js */

  angular
      .module('app.widgets')

      /* order directive仅仅会被order module用到 */
      .directive('orderCalendarRange', orderCalendarRange)

      /* sales directive可以在sales app的任意地方使用 */
      .directive('salesCustomerInfo', salesCustomerInfo)

      /* spinner directive可以在任意apps中使用 */
      .directive('sharedSpinner', sharedSpinner);

  function orderCalendarRange() {
      /* implementation details */
  }

  function salesCustomerInfo() {
      /* implementation details */
  }

  function sharedSpinner() {
      /* implementation details */
  }
  ```

  ```javascript
  /* recommended */
  /* calendarRange.directive.js */

  /**
   * @desc order directive that is specific to the order module at a company named Acme
   * @example <div acme-order-calendar-range></div>
   */
  angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);

  function orderCalendarRange() {
      /* implementation details */
  }
  ```

  ```javascript
  /* recommended */
  /* customerInfo.directive.js */

  /**
   * @desc sales directive that can be used anywhere across the sales app at a company named Acme
   * @example <div acme-sales-customer-info></div>
   */
  angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);

  function salesCustomerInfo() {
      /* implementation details */
  }
  ```

  ```javascript
  /* recommended */
  /* spinner.directive.js */

  /**
   * @desc spinner directive that can be used anywhere across apps at a company named Acme
   * @example <div acme-shared-spinner></div>
   */
  angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);

  function sharedSpinner() {
      /* implementation details */
  }
  ```

    注：由于directive使用条件比较广，所以命名就存在很多的选项。选择一个让directive和它的文件名都清楚分明的名字。下面有一些例子，不过更多的建议去看[命名](#命名)章节。

### 在directive中操作DOM

  - 当需要直接操作DOM的时候，使用directive。如果有替代方法可以使用，例如：使用CSS来设置样式、[animation services](https://docs.angularjs.org/api/ngAnimate)、Angular模板、[`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow)或者[`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide)，那么就直接用这些即可。例如，如果一个directive只是想控制显示和隐藏，用ngHide/ngShow即可。

    *为什么？*：DOM操作的测试和调试是很困难的，通常会有更好的方法（CSS、animations、templates）。

### 提供一个唯一的Directive前缀

  - 提供一个短小、唯一、具有描述性的directive前缀，例如`acmeSalesCustomerInfo`在HTML中声明为`acme-sales-customer-info`。

    *为什么？*：方便快速识别directive的内容和起源，例如`acme-`可能预示着这个directive是服务于Acme company。

    注：避免使用`ng-`为前缀，研究一下其它广泛使用的directive避免命名冲突，例如[Ionic Framework](http://ionicframework.com/)的`ion-`。

### 限制元素和属性

  - 当创建一个directive需要作为一个独立元素时，restrict值设置为`E`（自定义元素），也可以设置可选值`A`（自定义属性）。一般来说，如果它就是为了独立存在，用`E`是合适的做法。一般原则是允许`EA`，但是当它是独立的时候这更倾向于作为一个元素来实施，当它是为了增强已存在的DOM元素时则更倾向于作为一个属性来实施。

    *为什么？*：这很有意义！

    *为什么？*：虽然我们允许directive被当作一个class来使用，但如果这个directive的行为确实像一个元素的话，那么把directive当作元素或者属性是更有意义的。

    注：Angular 1.3 +默认使用EA。

  ```html
  <!-- avoid -->
  <div class="my-calendar-range"></div>
  ```

  ```javascript
  /* avoid */
  angular
      .module('app.widgets')
      .directive('myCalendarRange', myCalendarRange);

  function myCalendarRange () {
      var directive = {
          link: link,
          templateUrl: '/template/is/located/here.html',
          restrict: 'C'
      };
      return directive;

      function link(scope, element, attrs) {
        /* */
      }
  }
  ```

  ```html
  <!-- recommended -->
  <my-calendar-range></my-calendar-range>
  <div my-calendar-range></div>
  ```

  ```javascript
  /* recommended */
  angular
      .module('app.widgets')
      .directive('myCalendarRange', myCalendarRange);

  function myCalendarRange () {
      var directive = {
          link: link,
          templateUrl: '/template/is/located/here.html',
          restrict: 'EA'
      };
      return directive;

      function link(scope, element, attrs) {
        /* */
      }
  }
  ```
  
**[返回顶部](#目录)**

## 路由
### Route Resolve Promises

  - 当一个controller在激活之前，需要依赖一个promise的完成时，那么就在controller的逻辑执行之前在`$routeProvider`中解决这些依赖。如果你需要在controller被激活之前有条件地取消一个路由，那么就用route resolver。

  - 当你决定在过渡到视图之前取消路由时，使用route resolve。

    *为什么？*：controller在加载前可能需要一些数据，这些数据可能是从一个通过自定义factory或是[$http](https://docs.angularjs.org/api/ng/service/$http)的promise而来的。[route resolve](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider)允许promise在controller的逻辑执行之前解决，因此它可能对从promise中来的数据做一些处理。

    *为什么？*：这段代码将在路由后的controller的激活函数中执行，视图立即加载，promise resolve的时候将会开始进行数据绑定，可以（通过`ng-view`或`ui-view`）在视图的过渡之间加个loading状态的动画。

    注意：这段代码将在路由之前通过一个promise来执行，拒绝了承诺就会取消路由，接受了就会等待路由跳转到新视图。如果你想更快地进入视图，并且无需验证是否可以进入视图，你可以考虑用[控制器 `activate` 技术]。

  ```javascript
  /* avoid */
  angular
      .module('app')
      .controller('Avengers', ['movieService',

  function (movieService) {
      var vm = this;
      // unresolved
      vm.movies;
      // resolved asynchronously
      movieService.getMovies().then(function(response) {
          vm.movies = response.movies;
      });
  }]);
  ```

  ```javascript
  /* better */

  // route-config.js
  angular
      .module('app')
      .config(config);

  function config ($routeProvider) {
      $routeProvider
          .state('/avengers', {
              templateUrl: 'avengers.html',
              controller: 'Avengers',
              
              resolve: {
                  moviesPrepService: ['movieService',function(movieService) {
                      return movieService.getMovies();
                  }]
              }
          });
  }

  // avengers.js
  angular
      .module('app')
      .controller('Avengers', ['moviesPrepService',function(moviesPrepService) {
      var vm = this;
      vm.movies = moviesPrepService.movies;
  });
  ```

    注意：下面这个例子展示了命名函数的路由解决，这种方式对于调试和处理依赖注入更加方便。

  ```javascript
  /* even better */

  // route-config.js
  angular
      .module('app')
      .config(config);

  function config($routeProvider) {
      $routeProvider
          .state('/avengers', {
              templateUrl: 'avengers.html',
              controller: 'Avengers',
              controllerAs: 'vm',
              resolve: {
                  moviesPrepService: moviesPrepService
              }
          });
  }

  function moviesPrepService(movieService) {
      return movieService.getMovies();
  }

  // avengers.js
  angular
      .module('app')
      .controller('Avengers', ['moviesPrepService',
  function (moviesPrepService) {
        var vm = this;
        vm.movies = moviesPrepService.movies;
  });
  ```
**[返回顶部](#目录)**
    
## Filters


  - 避免使用filters扫描一个复杂对象的所有属性，应该用filters来筛选选择的属性。

    *为什么？*：不恰当的使用会造成滥用并且会带来糟糕的性能问题，例如对一个复杂的对象使用过滤器。
* 使用小写字母开头的驼峰法命名过滤器。
* 尽可能使过滤器精简。过滤器在 `$digest` loop 中被频繁调用，过于复杂的过滤器将使得整个应用缓慢。
* 在过滤器中只做一件事。更加复杂的操作可以用 pipe 串联多个过滤器来实现。
* 
**[返回顶部](#目录)**
    
## 常量

### 供应全局变量

  - 为供应库中的全局变量创建一个Angular常量。

    *为什么？*：提供一种注入到供应库的方法，否则就是全局变量。通过让你更容易地了解你的组件之间的依赖关系来提高代码的可测试性。这还允许你模拟这些依赖关系，这是很有意义的。

    ```javascript
    // constants.js

    /* global toastr:false, moment:false */
    (function() {
        'use strict';

        angular
            .module('QY.config')
            .constant('toastr', toastr)
            .constant('moment', moment);
    })();
    ```

  - 对于一些不需要变动，也不需要从其它service中获取的值，使用常量定义，当一些常量只是在一个模块中使用但是有可能会在其它应用中使用的话，把它们写到一个以当前的模块命名的文件中。把常量集合到一起是非常有必要的，你可以把它们写到`constants.js`的文件中。

    *为什么？*：一个可能变化的值，即使变动的很少，也会从service中重新被检索，因此你不需要修改源代码。例如，一个数据服务的url可以被放到一个常量中，但是更好的的做法是把它放到一个web service中。

    *为什么？*：常量可以被注入到任何angular组件中，包括providers。

    *为什么？*：当一个应用程序被分割成很多可以在其它应用程序中复用的小模块时，每个独立的模块都应该可以操作它自己包含的相关常量。

    ```javascript
    // Constants used by the entire app
    angular
        .module('app.core')
        .constant('moment', moment);

    // Constants used only by the sales module
    angular
        .module('app.sales')
        .constant('events', {
            ORDER_CREATED: 'event_order_created',
            INVENTORY_DEPLETED: 'event_inventory_depleted'
        });
    ```

**[返回顶部](#目录)**

## Angular $包装服务

### $document和$window

  - 用[`$document`](https://docs.angularjs.org/api/ng/service/$document)和[`$window`](https://docs.angularjs.org/api/ng/service/$window)代替`document`和`window`。

    *为什么？*：使用内部包装服务将更容易测试，也避免了你自己去模拟document和window。

### $timeout和$interval

  - 用[`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout)和[`$interval`](https://docs.angularjs.org/api/ng/service/$interval)代替`setTimeout`和`setInterval` 。

    *为什么？*：易于测试，处理Angular消化周期从而保证数据的同步绑定。

* 总结：
    * `$timeout`  替代 `setTimeout`
    * `$interval` instead of `setInterval`
    * `$window`   替代 `window`
    * `$document` 替代 `document`
    * `$http`     替代 `$.ajax`
    
**[返回顶部](#目录)**


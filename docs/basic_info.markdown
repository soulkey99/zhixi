# 1、HTTP接口格式定义
## 1.1、请求方式
 采用HTTP restful接口请求，请求方式分为get、post、put、delete等，一般情况下，get请求参数放在querystring中进行传递，post请求参数以json形式放在http body中进行传递。

## 1.2、HTTP header参数

|键|值|说明|备注|
|----|----|----|----|
|content-type|application/json||必填|
|client|1.0.2.3|版本号|必填|
|platform|android / ios|操作系统|必填|
|u|xxxxxxx|手机IMEI|选填，登陆注册必填|
|w|xxxxxxx|手机MAC地址|选填，登陆注册必填|
|channel|TencentAPP|渠道号|仅android必填|
|auth|xxxxx|用户登陆信息|选填，视接口而定|

auth参数计算方式：
```
// assume userID = "aaa", authSign = "bbb"
var str = "access_token=xxxxx";
var auth = new Buffer(str, 'utf8').toString('base64');
```
在访问接口的时候，对auth参数有三种要求：
 - no： 不需要传递auth参数，或者即使传递了服务端也不对其做任何解析或处理
 - required： 必须传递auth参数，并且服务端对其校验通过才可以访问接口
 - optional： 可选传递auth参数，如果传了，则必须校验通过方可访问接口，如果没传，可以直接访问接口

## 1.3、HTTP请求url
 http://[服务器地址]：[端口]/rest/:userType/xxxx

 其中userType为客户端类型，有以下几种：s：学生端，t：教师端，p：家长端。 

# 2、域名、ip地址、端口：

|类型|正式环境|测试环境|备注|
|----|----|----|----|----|
|rest api|api.xxxx||http/https|
|文件服务|file.xxxx||http/https|
|管理中心|admin.xxxx||强制跳转https|
|mqtt连接|mqtt.xxxx||-|

# 3、关于access_token和refresh_token以及登陆的说明

对于app端，只允许一个端进行登陆，参考微信客户端，如果一个app端登陆，会将其他已登陆的app端强制下线。

每次成功登陆（包括用户名密码登陆，短信验证码登陆，第三方登录等）接口都会返回参数access_token、access_token_expire、refresh_token、refresh_token_expire四个参数，access_token是访问api时校验用户权限的参数，用户在登陆状态，每次访问api都要在header内带上这个参数（参见本章1.2），这个参数的有效期比较短（目前是2个小时），客户端在使用该参数的时候需要在本地进行判断，如果发现该参数已经超时（或者即将超时，具体缓冲时间由客户端定），需要调用refresh_token对其进行刷新，获取一个新的access_token并重置有效期，每次调用refresh_token的时候，也需要在本地进行判断，如果发现该参数即将超时，那么需要对其本身进行刷新，获取一个新的refresh_token同时重置有效期，同时，也可以调用api与服务端进行校验，判断access_token或者refresh_token是否有效，如果无效并且是由于其他客户端登陆导致的该session失效，会返回一个相关的客户端信息，可以将其显示给用户。

对于已经登陆过的客户端，每次启动无需再调用自动登陆，只需要在access_token、refresh_token需要进行刷新的时候调用对应接口进行刷新即可。

# 4、错误码
 - 900： 请求成功
 - 899： 请求失败，access_token超时
 - 901： 用户已经存在
 - 902： 用户不存在
 - 903： 用户登录信息失效或者没有登陆信息，请重新登陆
 - 904： 参数缺失或者格式错误
 - 905： 服务器内部错误
 - 906： 密码错误
 - 907： 用户尚未设置登录密码，请使用短信登陆
 - 908： 用户没有绑定手机号码
 - 909： 用户被封禁
 - 910： 用户没有操作权限（比如操作不是自己的订单或者当前状态不允许这样操作等）
 - 911： 要获取的资源不存在
 - 912： 发起电话呼叫失败
 - 913： 调用第三方服务失败
 - 914： 需要跳转，同时会返回跳转的url。
 

 ----以下code继承自leancloud服务-----
 
 - 601： 短信验证码发送过于频繁
 - 602： 短信验证码发送失败（运营商错误）
 - 603： 无效的短信验证码
 - 127： 手机号码不合法


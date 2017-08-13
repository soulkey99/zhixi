# 1、微信js sdk获取初始化签名

|接口定义|http://xxx:port/rest/:userType/wx/js_config | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|origin_url|签名URL|String|可选|
|返回值  | 
|code|状态码|int|必选|
|debug|是否调试状态|Boolean||
|auth_url|跳转授权url|String||
|timestamp|时间戳|String||
|signature|签名|String||
|appId|应用appid|String||
|jsApiList|授权api列表|List||
|msg|错误信息|string|可选|

说明：签名url服务端默认从http header referer 获取，如果没有，再从origin_url获取。

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/wx/js_config
```

返回JSON数据：
```
{
    "code": 900,
    "nonceStr": "q0iet7xjqldw8kt",
    "debug": true,
    "auth_url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx83d9817fc537de4c&redirect_uri=http%3A%2F%2Fapi.test.zx.soulkey99.com%2FzhixiP%2FbindStudent.html%3Fstate%3Dstate&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect",
    "timestamp": "1478767265",
    "signature": "607703976ab4db6493ec3d8cd0a7173bb2034169",
    "appId": "wx83d9817fc537de4c"
}
```

# 2、接收微信服务器验证请求

|接口定义|http://xxx:port/xml/wx/webhook | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|echostr|验证字符串|String||
|返回值  | 
|echostr|验证字符串|String|必选|

说明：该接口接收微信服务器发送过来的echostr，然后原样返回。

# 3、接收微信服务器消息事件

|接口定义|http://xxx:port/xml/wx/webhook | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|返回值  | 

说明：该接口接收微信服务器通过POST请求发送过来的xml格式的事件消息，解析出来消息后，服务器会做出相应的操作。具体请求格式参见：[微信开发者文档-接收事件推送](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140454&token=&lang=zh_CN)。

# 4、微信oauth登录

|接口定义|http://xxx:port/rest/:userType/wx/oauth | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|code|授权码|String|必选|
|返回值  | 
|code|状态码|int|必选|
|info|用户登录信息|Object||

说明：该接口通过code换取微信的openid与access_token，然后判断该用户是否已经注册，如果已经注册则直接登录，如果没注册过就利用该用户的微信昵称与头像注册新用户然后登录，返回用户的登录信息。

# 5、微信base登录

|接口定义|http://xxx:port/rest/:userType/wx/redirect | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|url|授权转向页面|String|可选|

说明：该接口使用微信base登录请求，如果用户已经关注过微信公众号，则可以在无感知的情况下，自动进行重定向获取授权code，再通过接口4完成登录流程（base授权方式只能得到openid与access_token，无法获取用户基本信息）。



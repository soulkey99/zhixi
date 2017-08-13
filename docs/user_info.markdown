# 1、获取验证码
说明：用户注册或者登陆之前，需要校验手机号与验证码，验证码获取方式有短信和语音两种，默认不传smsType，获取短信验证码，如果传smsType为voice，获取语音验证码。

| 接口定义  | http://xxx:port/rest/:userType/smscode | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |no |
| 请求参数  | 参数说明   | 参数类型| 备注 |
| phone     | 手机号 | String  | 必选 |
| smsType   | 验证码类型   | String  | 可选，voice/sms |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"phone": "13012341234", "smsType":"voice"}' \
  http://host:port/rest/s/smscode
```
返回JSON数据：
```
{
    "code": 900
}
```

# 2、用户登录
说明：用户可以使用手机号与密码登陆或者手机号与验证码登陆。验证码与密码二选一，短信验证码优先。

|接口定义|http://xxx:port/rest/:userType/login | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|phone  |手机号  |String  |必选|
|smscode  |验证码  |String  |与passwd二选一|
|passwd  |密码(加密后) |String  |与smscode二选一|
|device  |设备描述信息|String  |可选，设备型号等|
|返回值  | 
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"phone": "13012341234", "smscode":"123123", "device": "红米2A"}' \
  http://host:port/rest/s/login
```
密码加密方式：
```
ciphertext = sha256(plaintext).toString('hex').toUpperCase()
```
密码示例：

|明文|密文|
|---|---|
|abcdef|BEF57EC7F53A6D40BEB640A780A639C83BC29AC8A9816F1FC6C5C6DCD93C4721|
|123123|96CAE35CE8A9B0244178BF28E4966C2CE1B8385723A96A6B838858CDD6CA0A1E|
|123456|8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92|


返回JSON数据：
```
{
    "code": 900,
    "info": {
        "userID": "57c4e70ff6d95f282d9729fa",
        "nick": "",
        "phone": "",
        "intro": "",
        "avatar": "",
        "has_passwd": false,
        "access_token": "4a3d8e843884f9da99a54323fb6d45178e5c903b41d2e124",
        "access_token_expire": 7200000,
        "refresh_token": "f4f16093f5f795344716d7f512a62db4bc16b235d8056085",
        "refresh_token_expire": 2592000000
    }
}
```

# 3、校验token有效性

说明：检查access_token或者refresh_token的有效性，返回剩余有效期，如果token无效，返回错误信息，同时，如果是由于其他设备登陆导致的token失效，那么会返回对应设备的登陆信息。

|接口定义|http://xxx:port/rest/:userType/checkToken | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|access_token| |String  |可选，二选一|
|refresh_token| |String  |可选，二选一|
|返回值  | 
|code|状态码|int|必选|
|access_token_expire|过期时间|int|单位：毫秒|
|refresh_token_expire|过期时间|int|单位：毫秒|
|nextDevice|下次登陆时间|String||
|nextLogin|下次登陆设备|String||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -G \
  -d "access_token=xxxx" \
  http://host:port/rest/s/checkToken
```
返回JSON数据：
```
{
    "code": 900,
    "access_token_expire": 3836000
}
//或者
{
    "code": 903,  //错误码
    "msg": "access_token无效！", //错误信息
    "nextDevice": "红米2A",   //设备信息
    "nextLogin": "2016-09-09T06:53:39.787Z" //登陆时间
}
```

# 4、游客登录
说明：为游客创建一个临时账户。

|接口定义|http://xxx:port/rest/:userType/guestLogin | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|返回值  | 
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/guestLogin
```
返回JSON数据：
```
//同用户登录
```

# 5、第三方账号登陆
说明：用户使用第三方账号登陆，如果该账号之前从未登陆过，那么先创建用户。

|接口定义|http://xxx:port/rest/:userType/ssoLogin | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|ssoType|第三方类型|String  |必选，weixin，weibo，qq|
|openid|  |String  |必选|
|access_token||String|必选|
|nick|昵称|String|必选|
|avatar|头像|String|必选|
|refresh_token||String|必选|
|返回值  | 
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"ssoType": "weixin", "openid":"xxxx", "access_token": "xxxx", "nick": "xxxx", "avatar": "xxxx", "refresh_token": "xxxx"}' \
  http://host:port/rest/s/ssoLogin
```
返回JSON数据：
```
//同用户登录
```

# 6、用户注册
说明：新用户注册账号，如果注册时返回用户已经注册过，那么提示用户直接登陆。

|接口定义|http://xxx:port/rest/:userType/register | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|||
|auth|no|||
|请求参数|参数说明|参数类型|备注|
|phone  |手机号  |String  |必选|
|smscode  | 短信验证码 |String  |必选|
|nick|昵称|String|必选|
|passwd|密码|String|必选|
|avatar|头像url|String|必选|
|返回值  | |||
|code|状态码|int|必选|
|info|登陆信息|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"phone": "xxxx", "smscode":"xxxx", "nick": "xxxx", "passwd": "xxxx", "avatar": "xxxx"}' \
  http://host:port/rest/s/register
```
返回JSON数据：
```
//同用户登录
```

# 7、学生注册完成获取教材与年级列表

|接口定义|http://xxx:port/rest/:userType/vgList | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|no|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|List||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/vgList
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "人教版": [
                "七年级上",
                "七年级下",
                "八年级上"
            ]
        },
        {
            "北师大版": [
                "七年级上",
                "七年级下"
            ]
        }
    ]
}
```

# 8、用户注销登陆

|接口定义|http://xxx:port/rest/:userType/logout | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|userID  |用户ID  |String  |必选|
|authSign  |  |String  |必选|
|返回值  | 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"userID": "xxxx", "authSign":"xxxx"}' \
  http://host:port/rest/s/logout
```
返回JSON数据：
```
{
    "code": 900
}
```

# 9、刷新access_token

|接口定义|http://xxx:port/rest/:userType/accessToken | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|refresh_token| |String  |必选|
|返回值  | 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"refresh_token": "xxxx"}' \
  http://host:port/rest/s/accessToken
```
返回JSON数据：
```
{
    "code": 900,
    "access_token": "1dcf68c48de22d54fdd7478419e889bc51a64e85a4bae16d",
    "access_token_expire": 7200000
}
```

# 10、刷新refresh_token

|接口定义|http://xxx:port/rest/:userType/refreshToken | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|no|
|请求参数|参数说明|参数类型|备注|
|refresh_token| |String  |必选|
|返回值  | 
|code|状态码|int|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"refresh_token": "xxxx"}' \
  http://host:port/rest/s/refreshToken
```
返回JSON数据：
```
{
    "code": 900,
    "refresh_token": "5f28c7cab6416eb96b1477392a5db8ce43ed88706a540ce7",
    "refresh_token_expire": 2592000000
}
```

# 11、校验手机号
说明：单独用来校验用户填写的手机号是否正确，如果正确，向该手机号发送验证码。

| 接口定义  | http://xxx:port/rest/:userType/checkphone | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
| phone |手机号 | String  | 必选 |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"phone": "13012341234"}' \
  http://host:port/rest/s/checkphone
```
返回JSON数据：
```
{
    "code": 900
}
```

# 12、校验短信验证码
说明：单独用来校验通过上面接口发送的短信验证码。

| 接口定义  | http://xxx:port/rest/:userType/checksms | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
| smscode   |短信验证码 | String  | 必选 |
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"smscode": "123123"}' \
  http://host:port/rest/s/checksms
```
返回JSON数据：
```
{
    "code": 900
}
```


# 12、获取用户信息（学生、家长、教师）

| 接口定义  | http://xxx:port/rest/:userType/info | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET|
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "auth: xxxx" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/info
```
返回JSON数据：
```
{
    "code": 900,
    "info":{}
}
```

# 13、修改用户信息（学生、家长、教师）

| 接口定义  | http://xxx:port/rest/:userType/info | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|nick|昵称|String||
|name|姓名|String||
|intro|个性签名|String||
|avatar|头像url|String||
|school|学校|String||
|version|教材版本|String||
|grade|年级|String||
||待添加|String||
|||String||
|||String||
|||String||
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"nick": "test"}' \
  http://host:port/rest/s/info
```
返回JSON数据：
```
{
    "code": 900
}
```

# 14、重置用户密码

| 接口定义  | http://xxx:port/rest/:userType/resetPwd | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |no|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|phone|手机号|String|必填|
|smscode|短信验证码|String|必填|
|newPwd|新密码(加密后)|String|必填|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"phone":"13112341234", "smscode":"123123", "newPwd":"96CAE35CE8A9B0244178BF28E4966C2CE1B8385723A96A6B838858CDD6CA0A1E"}' \
  http://host:port/rest/s/resetPwd
```

返回JSON数据：
```
{
    "code": 900
}
```

# 15、修改用户密码

| 接口定义  | http://xxx:port/rest/:userType/changePwd | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|oldPwd|旧密码(加密后)|String|必填|
|newPwd|新密码(加密后)|String|必填|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d '{"newPwd":"96CAE35CE8A9B0244178BF28E4966C2CE1B8385723A96A6B838858CDD6CA0A1E", "oldPwd":"79CD56F0AEDF249728E8A08A8CFB42701C59CC63142D6EA2D2A1E28AAF6F487A"}' \
  http://host:port/rest/s/changePwd
```

返回JSON数据：
```
{
    "code": 900
}
```



# 16、获取收件箱信息

| 接口定义  | http://xxx:port/rest/:userType/msgbox | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET|
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|read|获取消息状态|String|可选，true：已读，false：未读|
|type|获取消息类型|String|可选，notice通知，system系统消息，broadcast广播消息|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|返回列表|List||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "auth: xxxx" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/msgbox
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "msg_id": "57e11067acf769f8103b0fed",   //消息ID
            "type": "system",                       //消息类型
            "to": "57c4e70ff6d95f282d9729fa",       //接收者userID
            "content": "test system to user student",   //消息内容
            "param": {      //消息附加参数
                "type": "homeworkFeedback",   //作业反馈   
                "schedule_id": "",    //课时ID     
                "class_id": "",    //班级ID
                "feedback_id": ""   //反馈ID
            },
            "createdAt": "2016-09-20T10:33:11.921Z"     //消息发送时间
        },
        {
            "msg_id": "57e11067acf769f8103b0fed",   //消息ID
            "type": "personal",                       //消息类型
            "to": "57c4e70ff6d95f282d9729fa",       //接收者userID
            "from": "",     //发送者ID
            "fromNick": "",  //发送者昵称
            "fromType": "",  //发送者身份，s、t、p
            "content": "test system to user student",   //消息内容
            "param": {      //消息附加参数（待确定）
                "p2": "p2",
                "p1": "p1"
            },
            "createdAt": "2016-09-20T10:33:11.921Z"     //消息发送时间
        }
    ]
}
```

# 17、获取收件箱信息

| 接口定义  | http://xxx:port/rest/:userType/msgbox | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET|
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|read|获取消息状态|String|可选，true：已读，false：未读|
|type|获取消息类型|String|可选，personal通知，system系统消息，broadcast广播消息|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|返回列表|List||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "auth: xxxx" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/msgbox
```
返回JSON数据：
```
{
    "code": 900,
    "info": {
            "msg_id": "57e11067acf769f8103b0fed",   //消息ID
            "type": "system",                       //消息类型
            "to": "57c4e70ff6d95f282d9729fa",       //接收者userID
            "content": "test system to user student",   //消息内容
            "param": {      //消息附加参数
                "type": "homeworkFeedback",   //作业反馈   
                "schedule_id": "",    //课时ID
                "seq": 1,   //课时顺序     
                "class_id": "",    //班级ID
                "class_name": "",  //班级名称
                "feedback_id": ""   //反馈ID
            },
            "createdAt": "2016-09-20T10:33:11.921Z"     //消息发送时间
    }
}
```

# 17、获取指定用户的个人信息

| 接口定义  | http://xxx:port/rest/:userType/student/:s_id/info <br> http://xxx:port/rest/:userType/teacher/:t_id/info <br/> http://xxx:port/rest/:userType/parent/:p_id/info | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET|
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|返回信息|List||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "auth: xxxx" \
  -H "channel: TencentAPP" \
  http://host:port/rest/t/student/57c4e70ff6d95f282d9729fa/info
```

返回JSON数据：
```
{
    "code": 900,
    "info": { } //个人信息
}
```
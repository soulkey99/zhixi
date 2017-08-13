# 1、家长获取学生信息

|接口定义|http://xxx:port/rest/p/student/:s_id/info | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|info|学生信息|Object||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/p/student/57ff2d9d2ba2a6ac51113516/info
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "userID": "57ff2d9d2ba2a6ac51113516",
        "nick": "大耳朵",
        "name": "",
        "phone": "15242016246",
        "intro": "",
        "avatar": "http://oss..com/zhixi/2016-10-20/c4edd5e2b346b5f76ce39af02a967b0a.jpg",
        "userInfo": {
            "city": "",
            "school": "",
            "version": "北师大版",
            "grade": "七年级上",
            "target": 0
        }
    }
}
```

# 2、家长绑定学生

|接口定义|http://xxx:port/rest/p/student/:s_id/bind | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
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
  -H "auth: xxxx" \
  http://host:port/rest/p/student/57ff2d9d2ba2a6ac51113516/bind
```

返回JSON数据：
```
{
    "code": 900
}
```

# 3、家长获取已绑定学生列表

|接口定义|http://xxx:port/rest/p/bind | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
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
  -H "auth: xxxx" \
  http://host:port/rest/p/student/57ff2d9d2ba2a6ac51113516/bind
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "s_id": "57ff2d9d2ba2a6ac51113516",
            "s_nick": "大耳朵",
            "s_avatar": "http://oss..com/zhixi/2016-10-20/c4edd5e2b346b5f76ce39af02a967b0a.jpg",
            "s_name": ""
        }
    ]
}
```

# 4、家长获取学生指定作业的答题情况

|接口定义|http://xxx:port/rest/p/homework/:swork_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
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
  -H "auth: xxxx" \
  http://host:port/rest/p/homework/57ff46092ba2a6ac511137aa
```

返回JSON数据：参见教师接口27。




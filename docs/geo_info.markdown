# 1、获取附近列表

|接口定义|http://xxx:port/rest/:userType/geodata/nearby | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|lng|经度|String  |必选|
|lat|纬度|String  |必选|
|type|查找类型|String|必选，暂时只有：school|
|radius|查找半径|String|可选，单位：米，默认1000|
|q|关键字|String|可选，需要urlencode|
|page|页码|String|可选，默认0，从0开始，继承自百度|
|limit|获取数量|String|可选，默认10|
|返回值  | 
|code|状态码|int|必选|
|res|百度返回的结果|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: required" \
  -d "lng=123.46468" \
  -d "lat=41.813567" \
  -d "type=school" \
  -d "page=0" \
  -d "limit=5" \
  http://host:port/rest/s/geodata/nearby
```
返回JSON数据：res内的参数详细说明参见[百度lbs云检索，poi周边检索](http://lbsyun.baidu.com/index.php?title=lbscloud/api/geosearch)
```
{
    "code": 900,
    "res": {}   //参见百度文档
}
```

# 2、根据地区查询列表

|接口定义|http://xxx:port/rest/:userType/geodata/local | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|region|地区|String|选填，省、市、区名均可，如果没传则根据IP定位获得|
|type|查找类型|String|必选，暂时只有：school|
|q|关键字|String|可选|
|page|页码|String|可选，默认0，从0开始，继承自百度|
|limit|获取数量|String|可选，默认10|
|返回值  | 
|code|状态码|int|必选|
|res|百度返回的结果|Object|必选|
|msg|错误信息|string|可选|

说明：region和q参数都需要urlencode。

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: required" \
  -d "region=%E5%A4%A7%E4%B8%9C" \
  -d "type=school" \
  -d "page=0" \
  -d "limit=5" \
  http://host:port/rest/s/geodata/local
```
返回JSON数据：res内的参数详细说明参见[百度lbs云检索，poi本地检索](http://lbsyun.baidu.com/index.php?title=lbscloud/api/geosearch)
```
{
    "code": 900,
    "res": {}   //参见百度文档
}
```


# 3、根据ip地址获取本机定位

|接口定义|http://xxx:port/rest/:userType/geodata/ip | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|ip|待查询ip|String  |可选，不传则获取本机ip|
|返回值  | 
|code|状态码|int|必选|
|res|百度返回的结果|Object|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: required" \
  -d "ip=123.57.16.157" \
  http://host:port/rest/s/geodata/ip
```
返回JSON数据：res内的参数详细说明参见[普通IP定位API](http://lbsyun.baidu.com/index.php?title=webapi/ip-api)
```
{
    "code": 900,
    "res": {}   //参见百度文档
}
```


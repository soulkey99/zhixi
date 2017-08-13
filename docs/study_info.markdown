# 1、获取教材目录列表

| 接口定义  | http://xxx:port/rest/t/study/catalog | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|version|教材版本|String|必填|
|grade|年级|String|必填|
|subject|科目|String|必填|
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
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -G \
  -d "version=%E5%8C%97%E5%B8%88%E5%A4%A7%E7%89%88" \
  -d "grade=%E4%B8%83%E5%B9%B4%E7%BA%A7%E4%B8%8A" \
  -d "subject=%E6%95%B0%E5%AD%A6" \
  http://host:port/rest/t/study/catalog
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "cha_id": "5786f5d586bd1c837915224d",
            "title": "第一章 丰富的图形世界",
            "remark": "",
            "seq": 1,
            "sections": [
                {
                    "sec_id": "5786f5f686bd1c837915224e",
                    "title": "1  生活中的立体图形",
                    "remark": "",
                    "seq": 1
                },
                {
                    "sec_id": "5786f61986bd1c837915224f",
                    "title": "2  展开与折叠",
                    "remark": "",
                    "seq": 2
                }
            ]
        }
    ]
}
```

# 2、获取教材详情

|接口定义|http://xxx:port/rest/:userType/study/detail | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|version|教材版本|String|必填|
|grade|年级|String|必填|
|subject|科目|String|必填|
|返回值  | 
|code|状态码|int|必选|
|info|教材详情|Object||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/detail?grade=%E4%B8%83%E5%B9%B4%E7%BA%A7%E4%B8%8A&subject=%E6%95%B0%E5%AD%A6&version=%E5%8C%97%E5%B8%88%E5%A4%A7%E7%89%88
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "ver_id": "5786e9f086bd1c8379152247",
        "stage": "初中",
        "grade": "七年级上",
        "subject": "数学",
        "version": "北师大版",
        "title": "",
        "intro": "",
        "cover": "http://oss..com/upload/20160714/c5fe4f1226f03c9757d8428237716d5b.png",
        "remark": "北师大版",
        "type": "book",
        "seq": 0
    }
}
```

# 3、获取教材目录指定小节下的题目列表

| 接口定义  | http://xxx:port/rest/t/study/section/:sec_id/question | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
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
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -G \
  -d "start=1" \
  -d "limit=5" \
  http://host:port/rest/t/study/section/5786f5f686bd1c837915224e/question
```

返回JSON数据：
```
{
    "code": 900,
    "list": []  //题目列表
}
```


# 4、获取学习题目详情

|接口定义|http://xxx:port/rest/:userType/study/question/:q_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|info|题目信息|Object||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/study/question/5756714762cc0870779a6238
```

返回JSON数据：
```
{
    "code": 900,
    "info": {}  //题目内容
}
```

# 5、根据一串q_id获取题目列表

|接口定义|http://xxx:port/rest/:userType/study/questions | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|q_id|问题ID|String|必填，多个用逗号分隔|
|返回值  | 
|code|状态码|int|必选|
|list|题目列表|List||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/study/questions?q_id=5756714762cc0870779a6238,57625c67d926b5352c47cb92,5756714762cc0870779a6238,57553d3f62cc0870779a61db
```

返回JSON数据：
```
{
    "code": 900,
    "list": []  //题目列表
}
```


# 6、根据条件获取教材、练习册列表

|接口定义|http://xxx:port/rest/:userType/study/books | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|type|获取类型|String|可选，book、exercise|
|stage|学段|String|可选|
|grade|年级|String|可选|
|subject|学科|String|可选|
|version|版本|String|可选|
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
  -H "auth: xxxx" \
  -G \
  -d "start=1" \
  -d "limit=5" \
  -d "version=%E5%8C%97%E5%B8%88%E5%A4%A7%E7%89%88" \
  -d "grade=%E4%B8%83%E5%B9%B4%E7%BA%A7%E4%B8%8A" \
  -d "type=book" \
  http://host:port/rest/t/study/books
```

返回JSON数据：
```
{
    "code": 900,
    "list": []  //列表内容结构参见2：教材详情
}
```

# 7、根据ver_id获取目录信息

|接口定义|http://xxx:port/rest/:userType/study/version/:ver_id/catalog | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|optional|
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
  -H "auth: xxxx" \
  http://host:port/rest/s/study/version/5786e9f086bd1c8379152247/catalog
```

返回JSON数据：
```
{
    "code": 900,
    "list": []  //同接口1返回的目录结构
}
```

# 8、根据ver_id获取教材、练习册详情

|接口定义|http://xxx:port/rest/:userType/study/version/:ver_id/detail | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|optional|
|返回值  | 
|code|状态码|int|必选|
|info|返回详情|Object||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/version/5786e9f086bd1c8379152247/detail
```

返回JSON数据：
```
{
    "code": 900,
    "info": {}  //同接口2返回的详情结构
}
```


# 9、根据ver_id获取教材、练习册的学习进度

|接口定义|http://xxx:port/rest/:userType/study/version/:ver_id/process | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|optional|
|返回值  | 
|code|状态码|int|必选|
|info|返回详情|Object||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/version/5786e9f086bd1c8379152247/process
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "total": 11,    //总题目数
        "finish": 0,    //已做过的题目数
        "last_sec_id": "",  //上次练习的节ID
        "last_time": "",    //上次练习的时间
        "catalog": [    //目录
            {
                "cha_id": "5786f5d586bd1c837915224d",   //章ID
                "total": 8,     //章总题目数
                "finish": 0,    //章做过的题目数
                "seq": 1,       //顺序
                "sections": [   //节
                    {
                        "sec_id": "5786f5f686bd1c837915224e",   //节ID
                        "total": 3,     //节总题目数
                        "finish": 0,    //节已做过的题目数
                        "seq": 1        //顺序
                    },
                    {
                        "sec_id": "5786f61986bd1c837915224f",
                        "total": 2,
                        "finish": 0,
                        "seq": 2
                    }
                ]
            }
        ]
    }
}
```


# 10、获取指定小节下一道没有答过的题目

|接口定义|http://xxx:port/rest/:userType/study/section/:sec_id/next | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|q_id|问题ID|String|必填|
|返回值  | 
|code|状态码|int|必选|
|info|题目内容|Object|必选|
|msg|错误信息|string|可选|

说明：如果传递q_id参数，则获取该小节该问题后面的未答过的问题，否则获取该小节所有题目中的未回答过的问题。

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/section/57624369d926b5352c47cb91/next?q_id=5786f7dd86bd1c8379152252
```

返回JSON数据：
```
{
    "code": 900,
    "info": {}  //题目内容，如果该小节下所有题目都已经答完，那么返回一个空的Object
}
```


# 11、开始一个练习

|接口定义|http://xxx:port/rest/:userType/study/exercise/ | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|sec_id|节ID|String|必填|
|q_id|问题ID|String|必填|
|返回值  | 
|code|状态码|int|必选|
|e_id|练习ID|String|必选|
|msg|错误信息|string|可选|

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"sec_id":"57624369d926b5352c47cb91", "q_id":"5760eef2d926b5352c47cb61"}' \
  http://host:port/rest/s/study/exercise
```

返回JSON数据：
```
{
    "code": 900,
    "e_id": "57fb6834351d421c34fee03e"
}
```

# 12、获取学习题目

|接口定义|http://xxx:port/rest/s/study/question/:q_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|info|题目信息|Object||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/question/57552cfe62cc0870779a61d2
```

返回JSON数据：
```
{
    "code": 900,
    "info": {}  //题目详情
}
```

# 13、答题

|接口定义|http://xxx:port/rest/:userType/study/exercise/:e_id/check | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|choice_id|选项ID|String  |可选|
|q_id|问题ID|String  |可选|
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
  -d '{"choice_id":"570cb11ca130264826afe51a", "q_id":"570cb11ca130264826afe51b"}' \
  http://host:port/rest/s/study/exercise/57fb6834351d421c34fee03e/check
```

返回JSON数据：
```
{
    "code": 900
}
```

# 14、获取练习结果

|接口定义|http://xxx:port/rest/:userType/study/exercise/:e_id/result | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|info|结果信息|Object||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/exercise/57fb6834351d421c34fee03e/result
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "point": 0      //本题得分
    }
}
```

# 15、获取练习回顾

|接口定义|http://xxx:port/rest/:userType/study/exercise/:e_id/review | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|info|返回信息|Object||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/exercise/57fb6834351d421c34fee03e/review
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "root": "",     //题干的回顾
        "list": []      //各个错题的讲解
    }
}
```

# 16、获取下一小节

| 接口定义  | http://xxx:port/rest/s/study/section/:sec_id/nextSection | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|详情|Object||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/section/57873b1986bd1c837915229c/nextSection
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "ver_id": "5786e9f086bd1c8379152247",
        "ver_title": "",
        "type": "book",
        "grade": "七年级上",
        "subject": "数学",
        "version": "北师大版",
        "cha_id": "578737d686bd1c837915228d",    //章ID
        "cha_title": "第三章 整式及其加减",      //章标题
        "sec_id": "57873b3b86bd1c837915229d",  //下一小节ID，如果为空，表示本书结束
        "sec_title": "1 字母表示数"          //小节标题
    }
}
```

# 17、获取指定练习的全部答题流程

|接口定义|http://xxx:port/rest/:userType/study/exercise/:e_id/steps | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|info|返回信息|Object||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/exercise/57fb6834351d421c34fee03e/steps
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "q_id": "5788429786bd1c83791522c6",
        "sec_id": "57873b3b86bd1c837915229d",
        "status": "finished",
        "point": 86,
        "shortestPath": 9,
        "step": []   //结构与作业获取答题流程相同
    }
}
```

# 18、获取指定题目的最优答题路径

|接口定义|http://xxx:port/rest/:userType/study/question/:q_id/shortestPath | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|list|题目列表|List||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/question/5799529a86bd1c8379152760/shortestPath
```

返回JSON数据：
```
{
    "code": 900,
    "list": []  //题目列表
}
```

# 19、获取指定题目的所有练习历史列表

|接口定义|http://xxx:port/rest/:userType/study/question/:q_id/exercise | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|起始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|返回值  | 
|code|状态码|int|必选|
|list|练习列表|List||
|msg|错误信息|string|可选|

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/study/question/5799529a86bd1c8379152760/exercise
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "e_id": "578c74e3a415229579a79d20",   //一次练习唯一ID
            "createdAt": "2016-09-29T06:44:58.080Z",   //开始练习时间
            "point": 0,   //得分
            "q_id": "5786f3e686bd1c837915224a",  //问题ID
            "sec_id": "5786f5f686bd1c837915224e",   //小节ID
            "type": "exercise",    //类型，exercise：练习，homework：作业（暂无此类型）
            "status": "finished"   //该练习状态，finished：已完成（暂时只有此类型），其余值均为未完成
        }
    ]
}
```



# ----------------分隔之前的旧接口，暂时不用----------------

# 1、获取学段年级科目列表

|接口定义|http://xxx:port/rest/:userType/study/gsList | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|optional|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|List||
|msg|错误信息|string|可选|

# 2、开始一个新的练习

|接口定义|http://xxx:port/rest/:userType/study/exercise | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|type|练习类型|String  |必选，study：练习，homework：作业|
|sec_id|节ID|String  |必选|
|q_id|问题ID|String|必选|
|返回值  | 
|code|状态码|int|必选|
|info|返回信息|Object||
|msg|错误信息|string|可选|


# 3、获取历史练习列表

|接口定义|http://xxx:port/rest/:userType/study/exercise | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|start|开始位置 |String  |可选|
|limit|获取数量 |String  |可选|
|stage|学段|String|可选|
|grade|年级|String|可选|
|subject|科目|String|可选|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|List||
|msg|错误信息|string|可选|





# 5、获取问题的附加信息列表

|接口定义|http://xxx:port/rest/:userType/study/question/:q_id/extra | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|limit|获取数量 |String |可选|
|type|获取类型|String|point/related/enhance|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|List||
|msg|错误信息|string|可选|




# 8、获取练习记录详情

|接口定义|http://xxx:port/rest/:userType/study/exercise/:e_id/detail | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|info|返回结果|Object||
|msg|错误信息|string|可选|





# 10、关闭一个练习

|接口定义|http://xxx:port/rest/:userType/study/exercise/:e_id/cancel | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|msg|错误信息|string|可选|


# 11、获取教材版本列表

|接口定义|http://xxx:port/rest/:userType/study/versions | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|optional|
|请求参数|参数说明|参数类型|备注|
|start|开始位置 |String  |可选|
|limit|获取数量 |String  |可选|
|stage|学段|String|可选|
|grade|年级|String|可选|
|subject|科目|String|可选|
|city|城市|String|可选|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|List||
|msg|错误信息|string|可选|




# 13、获取节下问题列表

|接口定义|http://xxx:port/rest/:userType/study/section/:sec_id/questions | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|List||
|msg|错误信息|string|可选|

# 12、获取某道题是否有未完成的练习

|接口定义|http://xxx:port/rest/:userType/study/exercise | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|start|开始位置 |String  |可选|
|limit|获取数量 |String  |可选|
|stage|学段|String|可选|
|grade|年级|String|可选|
|subject|科目|String|可选|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|List||
|msg|错误信息|string|可选|

# 12、获取历史练习列表

|接口定义|http://xxx:port/rest/:userType/study/exercise | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
|请求参数|参数说明|参数类型|备注|
|start|开始位置 |String  |可选|
|limit|获取数量 |String  |可选|
|stage|学段|String|可选|
|grade|年级|String|可选|
|subject|科目|String|可选|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|List||
|msg|错误信息|string|可选|


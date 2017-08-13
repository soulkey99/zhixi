# 1、学生获取加入的班级列表

| 接口定义  | http://xxx:port/rest/s/class | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|status|申请状态|String|可选，默认verified|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|班级列表|List||
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
  -d "start=5" \
  http://host:port/rest/s/class
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "class_id": "57df4665053c674808325fe6",     //班级ID
            "class_name": "test class",                 //班级名称
            "class_num": 100001,                        //班号
            "status": "verified",                       //学生与班级的关系，verified已加入，pending申请中，fail申请被拒绝。
            "t_id": "57df43258bef4e802794dd0d",         //教师ID
            "t_name": "test teacher",                   //教师姓名
            "school_id": "57df43258bef4e802794dd0e",    //学校ID
            "school_name": "test school",               //学校名称
            "startAt": "2016/9/1",                      //开班日期
            "endAt": "2016/10/1",                       //结班日期
            "avatars": [                                //返回不超过5个同学的头像
                "http://oss.soulkey99.com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg",
                "http://oss.soulkey99.com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg"
            ],
            "s_count": 2                                //班级人数
        }
    ]
}
```

# 2、学生搜索班级

说明：暂时只支持通过班号进行查找，精确匹配。

| 接口定义  | http://xxx:port/rest/s/search/class | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|class_num|班号|String|必填|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|班级列表|List||
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
  -d "class_num=100001" \
  http://host:port/rest/s/search/class
```

返回JSON数据：
```
{
    "code": 900,
    "list": []      //结构同1.
}
```

# 3、学生申请加入班级

| 接口定义  | http://xxx:port/rest/s/class/:class_id/join | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |POST |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|msg|加入理由|String|可选|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|status|申请状态|String||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"msg": "我要加入"}'
  http://host:port/rest/s/class/57df4665053c674808325fe6/join
```

返回JSON数据：
```
{
    "code": 900,
    "status": "pending"      //一般是pending等待中，如果返回verified，那么这个班级已经加过并且通过了
}
```


# 4、学生获取班级申请列表

| 接口定义  | http://xxx:port/rest/s/classJoinHistory | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|status|获取状态|String|可选，pending，verified，fail，默认不传返回全部|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|班级申请|List||
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
  -d "limit=5" \
  http://host:port/rest/s/classJoinHistory
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "cs_id": "57e23ac226f08ee8381e97a8",    //申请记录ID
            "class_id": "57e23ac226f08ee8381e97a8", //班级ID
            "class_name": "class2",     //班级名称
            "msg": "",                  //申请理由
            "status": "pending"         //申请状态
        }
    ]
}
```

# 5、学生获取班级详情

|接口定义  | http://xxx:port/rest/s/class/:class_id | | |
| -------- | -------- | -------- | -------- |
|请求方式  |GET |
|auth   |required|
|返回值 | | 
| code | 状态码  | int | 必选 |
|info|班级信息|Object||
| msg | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/class/57e4f8e7f4e101b2288cc7b6
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "class_id": "57e4f8e7f4e101b2288cc7b6",
        "class_name": "xfclass",
        "class_num": 100002,
        "grade": "七年级上",
        "subject": "数学",
        "version": "北师大版",
        "t_id": "57e4be6bbb3561f91174e9f9",
        "t_name": "",
        "school_id": "57e4be6bbb3561f91174e9fa",
        "school_name": "",
        "status": "",   //学生对该班级的申请状态，为空表示未申请过
        "startAt": "2016/9/1",
        "endAt": "2017/1/1",
        "duration": 60,     
        "week": "every",
        "week_num": [
            "1",
            "2",
            "3"
        ],
        "noon": "before",
        "hour": 9,
        "minute": 30,
        "s_count": 1
    }
}
```

# 6、学生获取作业列表

说明：分别是获取所有作业列表以及仅获取指定班级所留的作业列表。

| 接口定义  | http://xxx:port/rest/s/homework <br/> http://xxx:port/rest/s/class/:class_id/homework| | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|getType|获取类型|String|可选，默认当前作业，history：作业本|
|status|获取状态|String|可选，逗号分隔，默认不传返回全部|
|sort|排序方式|String|默认不传按倒序排列，传asc则升序|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|作业列表|List||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/homework      //如果传class_id则是获取该学生班级的作业列表
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "swork_id": "57e4cf6ae83bdfa0296dbd04",     //学生作业ID
            "class_id": "57df4665053c674808325fe6",     //班级ID
            "schedule_id": "57df94cea824a5b41f25d8ad",  //课时ID
            "homework_id": "57e4cf67e83bdfa0296dbd03",  //教师作业ID
            "avatar": "",           //封面图，暂时未实现，为空则用默认图
            "needCheck": false,     //作业是否需要家长签字
            "status": "pending",        //作业状态：pending，submitted，confirmed，checked，timeout，timeoutFinished，进行中，已提交，家长已签字，教师已批阅，超时未完成，超时后完成
            "class_name": "test class", //班级名称
            "grade": "七年级上",        //年级
            "subject": "数学",            //科目
            "version": "北师大版",      //教材版本
            "homework_desc": "第3节课的作业。",        //作业描述
            "seq": 3,                   //课时号
            "total": 3,             //总题数
            "finished": 0,          //完成题数
            "is_new": true,            //是否新作业
            "endAt": "2016-10-16T03:00:00.000Z",     //提交截止时间
            "createdAt": "2016-09-16T03:00:00.000Z"     //创建时间
        }
    ]
}
```

# 7、学生获取指定作业下的全部题目列表

| 接口定义  | http://xxx:port/rest/s/homework/:swork_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式|GET|
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|题目列表|List||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/homework/57e4cf6ae83bdfa0296dbd04
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "q_id": "575512a05d7ae0c3460e7412",
            "step": [],                 //步骤详情
            "status": "pending",        //题目当前状态，pending未答，finished已答
            "point": 0,                 //题目得分
            "info": {       //题目详情
                "subject": "数学",
                "grade": "三年级",
                "stage": "初中",
                "next": "57552cfe62cc0870779a61d2",
                "remark": "等价变换，不失条件",
                "enhance": [],
                "related": [],
                "point": [],
                "choice": [],
                "content": "如图，已知$$\\Delta ABC$$中，$$AB=5$$，$$AC=3$$，点$$D$$在$$AB$$上，且$$∠ACD=∠B$$，求线段$$AD$$的长为多少？<img class='questionImg' src='http://oss.soulkey99.com/upload/20160606/87271a93c47bbf94d97bd8431e67ed14.png'>",
                "type": "root",
                "q_id": "575512a05d7ae0c3460e7412"
            }
        }
    ]
}
```

# 8、学生获取指定作业指定题目的详情

| 接口定义  | http://xxx:port/rest/s/homework/:swork_id/question/:q_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|题目详情|Object||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/homework/57e4cf6ae83bdfa0296dbd04/question/57553d3f62cc0870779a61db
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "q_id": "57553d3f62cc0870779a61db",
        "step": [],
        "point": 0,
        "status": "pending",
        "info": {
            "subject": "数学",
            "grade": "三年级",
            "stage": "初中",
            "next": "57553df462cc0870779a61dc",
            "remark": "矩形性质，面积，勾股定理",
            "enhance": [],
            "related": [],
            "point": [],
            "choice": [],
            "content": "如图，在矩形$$ABCD$$中，$$AB=3$$，$$BC=2$$，$$O$$是$$AD$$的中点，$$E$$是$$BC$$上的一点(不与$$B$$、$$C$$重合)，过点$$E$$作$$EM\\bot DB$$，$$EN\\bot OC$$，则$$EM+EN$$的值为多少？<img class='questionImg' src='http://oss.soulkey99.com/upload/20160606/e77c529bc663e924a566b4c99256af45.png'>",
            "type": "root",
            "q_id": "57553d3f62cc0870779a61db"
        }
    }
}
```


# 9、学生端获取作业下一道未答题目

| 接口定义  | http://xxx:port/rest/s/homework/:swork_id/next | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|题目详情|Object||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/homework/57e4cf6ae83bdfa0296dbd04/next
```

返回JSON数据：
```
{
    "code": 900,
    "info": {       //如果info={}，则表示这个作业下面的所有题目都已经答完。
        "q_id": "57553d3f62cc0870779a61db",
        "step": [],
        "point": 0,
        "status": "pending",
        "info": {
            "subject": "数学",
            "grade": "三年级",
            "stage": "初中",
            "next": "57553df462cc0870779a61dc",
            "remark": "矩形性质，面积，勾股定理",
            "enhance": [],
            "related": [],
            "point": [],
            "choice": [],
            "content": "如图，在矩形$$ABCD$$中，$$AB=3$$，$$BC=2$$，$$O$$是$$AD$$的中点，$$E$$是$$BC$$上的一点(不与$$B$$、$$C$$重合)，过点$$E$$作$$EM\\bot DB$$，$$EN\\bot OC$$，则$$EM+EN$$的值为多少？<img class='questionImg' src='http://oss.soulkey99.com/upload/20160606/e77c529bc663e924a566b4c99256af45.png'>",
            "type": "root",
            "q_id": "57553d3f62cc0870779a61db"
        }
    }
}
```

# 10、学生作业答题

|接口定义  | http://xxx:port/rest/s/homework/:swork_id/question/:q_id/check | | |
| -------- | -------- | -------- | -------- |
|请求方式  |POST  |
|auth   |required|
|请求参数  | 参数说明 | 参数类型| 备注 |
|choice_id|选项ID|String|必选|
|返回值 | | 
| code | 状态码  | int | 必选 |
| msg | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"choice_id":"57553e0962cc0870779a61dd"}' \
  http://host:port/rest/s/homework/57e4cf6ae83bdfa0296dbd04/question/57553df462cc0870779a61dc/check
```

返回JSON数据：
```
{
    "code": 900
}
```

# 11、学生获取作业回顾

|接口定义  | http://xxx:port/rest/s/homework/:swork_id/question/:q_id/review | | |
| -------- | -------- | -------- | -------- |
|请求方式 |GET |
|auth   |required|
|返回值 | | 
| code | 状态码  | int | 必选 |
|info|回顾信息|List||
| msg | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/homework/57e4cf6ae83bdfa0296dbd04/question/57553df462cc0870779a61dc/review
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "root": "",      //题干的备注
        "list": []      //错题的备注
    }
}
```

# 12、学生获取作业答题结果

|接口定义  | http://xxx:port/rest/s/homework/:swork_id/question/:q_id/result | | |
| -------- | -------- | -------- | -------- |
|请求方式 |GET |
|auth   |required|
|返回值 | | 
| code | 状态码  | int | 必选 |
|info|回顾信息|List||
| msg | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/homework/57e4cf6ae83bdfa0296dbd04/question/57553df462cc0870779a61dc/review
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "point": 0,     //得分
        "seq": 1,   //课时
        "total": 3,     //总题数
        "current": 2,   //当前第几题
        "percent": 80   //超越百分比
    }
}
```

# 13、学生端获取作业详情

| 接口定义  | http://xxx:port/rest/s/homework/:swork_id/detail | | |
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
  http://host:port/rest/s/homework/57e4cf6ae83bdfa0296dbd04/detail
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "swork_id": "57e4cf6ae83bdfa0296dbd04",
        "class_id": "57df4665053c674808325fe6",   //班级ID
        "class_name": "test class",    //班级名称
        "version": "北师大版",
        "grade": "七年级上",
        "subject": "数学",
        "schedule_id": "57df94cea824a5b41f25d8ad",  //课时ID
        "seq": 1    //第几课时
    }
}
```

# 14、学生端获取错题本列表

| 接口定义  | http://xxx:port/rest/s/wrongList | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
|请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|type|类型|String|可选，homework、exercise|
|subject|科目|String|可选|
|grade|年级|String|可选|
|version|教材版本|String|可选|
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
  http://host:port/rest/s/wrongList
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "q_id": "57553d3f62cc0870779a61db",   //问题ID
            "type": "exercise",         //错题类型（作业/练习）
            "subject": "数学",
            "grade": "九年级上",
            "version": "北师大版",
            "point": 87,                //错题得分
            "reviewed": false,          //是否复习过（待定，复习过就不再列表内出现）
            "info": {                   //题目信息
                "subject": "数学",
                "grade": "三年级",
                "stage": "初中",
                "next": "57553df462cc0870779a61dc",
                "remark": "矩形性质，面积，勾股定理",
                "shortestPath": 10,
                "difficulty": 1,
                "content": "如图，在矩形$$ABCD$$中，$$AB=3$$，$$BC=2$$，$$O$$是$$AD$$的中点，$$E$$是$$BC$$上的一点(不与$$B$$、$$C$$重合)，过点$$E$$作$$EM\\bot DB$$，$$EN\\bot OC$$，则$$EM+EN$$的值为多少？<img class='questionImg' src='http://oss.soulkey99.com/upload/20160606/e77c529bc663e924a566b4c99256af45.png'>",
                "type": "root",
                "q_id": "57553d3f62cc0870779a61db"
            },
            "e_id": "578c744aa415229579a79d16",     //练习ID
            "ver_id": "57624310d926b5352c47cb8f",   //教材版本ID
            "cha_id": "57624338d926b5352c47cb90",   //章ID
            "sec_id": "57624369d926b5352c47cb91"    //节ID
        },
        {
            "q_id": "570b36832119225382351b6c",     //错题ID
            "type": "homework",           //错题类型
            "subject": "数学",
            "grade": "七年级上",
            "version": "北师大版",
            "point": 87,                  //错题得分
            "reviewed": false,            //是否复习过
            "info": {
                "stage": "初中",
                "grade": "七年级下",
                "subject": "几何",
                "next": "570c9df730bf31e8209e4b0a",
                "remark": "我是第一个问题",
                "shortestPath": 0,
                "difficulty": 1,
                "content": "我是第一个问题11111",
                "type": "prepare",
                "q_id": "570b36832119225382351b6c"
            },
            "class_id": "57df4665053c674808325fe6",      //班级ID
            "schedule_id": "57df94cea824a5b41f25d8ad",   //课时ID
            "swork_id": "57e4cf6ae83bdfa0296dbd04"       //学生作业ID
        }
    ]
}
```


# 15、学生端获取首页最近列表

| 接口定义  | http://xxx:port/rest/s/recentList | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
|请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|type|类型|String|可选，homework、exercise|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|题目详情|Object||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/recentList
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "recent_id": "57fdb399ad6aaa9e01f708a2",
            "type": "homework",                         //类型，homework、exercise
            "userID": "57c4e70ff6d95f282d9729fa",
            "q_id": "57553d3f62cc0870779a61db",         //问题ID
            "avatar": "",                               //图标，如果为空则放置默认图
            "param": {},                                //预留参数位置
            "swork_id": "57e4cf6be83bdfa0296dbd05",     //学生作业ID
            "class_id": "57df4665053c674808325fe6",     //班级ID
            "class_name": "test class",                 //班级名称
            "subject": "数学",                          //科目
            "version": "北师大版",                      //教材版本
            "grade": "七年级上",                        //年级
            "total": 3,                                //题目总数
            "finished": 0,                             //完成题目数
            "endAt": "2016-10-16T06:43:33.533Z"        //作业截止提交时间
        },
        {
            "recent_id": "57fdb1f6ad6aaa9e01f708a1",
            "type": "exercise",                     //类型
            "userID": "57c4e70ff6d95f282d9729fa",
            "q_id": "5760eef2d926b5352c47cb61",
            "avatar": "http://oss.soulkey99.com/upload/20160616/6b1439b677ec497bc7f57bdfa71828d8.png",
            "param": {},
            "ver_id": "57624310d926b5352c47cb8f",    //教材版本ID
            "sec_id": "57624369d926b5352c47cb91",    //题目所在小节ID
            "version": "北师大版",                    //教材版本
            "stage": "初中",                          //学段
            "grade": "九年级上",                      //年级
            "subject": "数学",                        //科目
            "ver_type": "book",                       //教材类型，book：教材，exercise：练习册
            "ver_title": "",                          //教材标题（暂时仅练习册有）
            "sec_title": "第二节 矩形的性质与判定"      //小节标题
        }
    ]
}
```

# 16、学生端获取指定作业指定题目的全部答题流程

| 接口定义  | http://xxx:port/rest/s/homework/:swork_id/question/:q_id/steps | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|返回详情|Object||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/homework/57e4cf6ae83bdfa0296dbd04/question/575512a05d7ae0c3460e7412/steps
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "q_id": "575512a05d7ae0c3460e7412",
        "swork_id": "57e4cf6ae83bdfa0296dbd04",
        "status": "finished",  //答题状态
        "point": 0,   //答题得分
        "shortestPath": 3,    //本题答题最短路径，如果为零表示暂无
        "list": [  //答题过程
            {
                "q_id": "575512a05d7ae0c3460e7412",
                "type": "root",
                "content": "如图，已知$$\\Delta ABC$$中，$$AB=5$$，$$AC=3$$，点$$D$$在$$AB$$上，且$$∠ACD=∠B$$，求线段$$AD$$的长为多少？<img class='questionImg' src='http://oss.soulkey99.com/upload/20160606/87271a93c47bbf94d97bd8431e67ed14.png'>",
                "remark": "等价变换，不失条件",
                "stage": "初中",
                "subject": "数学",
                "grade": "三年级",
                "next": "57552cfe62cc0870779a61d2",
                "difficulty": 1,
                "shortestPath": 3
            },
            {
                "q_id": "57552cfe62cc0870779a61d2",
                "type": "prepare",
                "content": "由于相似三角形定义有两个角对应相等的三角形，所以题型等价变换为，在$$\\Delta ABC$$中，$$AB=5$$，$$AB=3$$，$$\\Delta ABC \\sim \\Delta ACB$$，求$$AD$$，那么能多出什么条件？",
                "remark": "相似三角形的性质",
                "root_id": "575512a05d7ae0c3460e7412",
                "choice": [
                    {
                        "action": "next",
                        "choice_id": "57552d7362cc0870779a61d3",
                        "content": "三角形，三个角相等，三边对应成比例",
                        "correct": true,
                        "flag": "A",
                        "hint": "",
                        "next": "57552e9d62cc0870779a61d5"
                    },
                    {
                        "action": "hint",
                        "choice_id": "57552ddf62cc0870779a61d4",
                        "content": "三角形，三个角相等，三边相等",
                        "correct": false,
                        "flag": "B",
                        "hint": "同学，请仔细审题哦！",
                        "next": ""
                    }
                ],
                "choice_id": "57552d7362cc0870779a61d3",    //这个choice_id表示本题用户选择的选项ID
                "t": "2016-10-11T04:14:59.410Z"             //这个是做题的时间
            },
            {
                "q_id": "57552e9d62cc0870779a61d5",
                "type": "prepare",
                "content": "由所求为线段长，同学会用角性质或是变性质能得出什么结论？",
                "remark": "引导列出对应边成比例",
                "root_id": "575512a05d7ae0c3460e7412",
                "choice": [
                    {
                        "action": "hint",
                        "choice_id": "57552f7462cc0870779a61d6",
                        "content": "$$\\frac{AD}{AC} = \\frac{AC}{BC} = \\frac{DC}{AB}$$",
                        "correct": false,
                        "flag": "A",
                        "hint": "同学，再仔细看看三角形中的各边",
                        "next": ""
                    },
                    {
                        "action": "next",
                        "choice_id": "57552f8f62cc0870779a61d7",
                        "content": "$$\\frac{AD}{AC} = \\frac{DC}{BC} = \\frac{AC}{AB}$$",
                        "correct": true,
                        "flag": "B",
                        "hint": "同学，再仔细看看三角形中的各边",
                        "next": "575530e562cc0870779a61d8"
                    }
                ],
                "choice_id": "57552f8f62cc0870779a61d7",
                "t": "2016-10-11T04:15:55.790Z"
            },
            {
                "q_id": "575530e562cc0870779a61d8",
                "type": "procedure",
                "content": "$$\\frac{AD}{AC} = \\frac{DC}{BC} = \\frac{AC}{AB}$$，将已知代入会发现什么？",
                "remark": "",
                "root_id": "575512a05d7ae0c3460e7412",
                "choice": [
                    {
                        "action": "hint",
                        "choice_id": "5755328962cc0870779a61d9",
                        "content": "$$\\frac{AD}{3} = \\frac{DC}{BC} = \\frac{3}{5}$$",
                        "correct": false,
                        "flag": "A",
                        "hint": "同学，尝试变换下等式",
                        "next": ""
                    },
                    {
                        "action": "result",
                        "choice_id": "5755330262cc0870779a61da",
                        "content": "$$\\frac{AD}{3} = \\frac{3}{5} = \\frac{DC}{BC}\\Rightarrow AD = \\frac{9}{5}$$",
                        "correct": true,
                        "flag": "B",
                        "hint": "同学，尝试变换下等式",
                        "next": ""
                    }
                ],
                "choice_id": "5755330262cc0870779a61da",
                "t": "2016-10-11T04:17:52.358Z"
            },
            {
                "q_id": "575530e562cc0870779a61d8",
                "type": "procedure",
                "content": "$$\\frac{AD}{AC} = \\frac{DC}{BC} = \\frac{AC}{AB}$$，将已知代入会发现什么？",
                "remark": "",
                "root_id": "575512a05d7ae0c3460e7412",
                "choice": [
                    {
                        "action": "hint",
                        "choice_id": "5755328962cc0870779a61d9",
                        "content": "$$\\frac{AD}{3} = \\frac{DC}{BC} = \\frac{3}{5}$$",
                        "correct": false,
                        "flag": "A",
                        "hint": "同学，尝试变换下等式",
                        "next": ""
                    },
                    {
                        "action": "result",
                        "choice_id": "5755330262cc0870779a61da",
                        "content": "$$\\frac{AD}{3} = \\frac{3}{5} = \\frac{DC}{BC}\\Rightarrow AD = \\frac{9}{5}$$",
                        "correct": true,
                        "flag": "B",
                        "hint": "同学，尝试变换下等式",
                        "next": ""
                    }
                ],
                "choice_id": "5755330262cc0870779a61da",
                "t": "2016-10-11T05:29:26.878Z"
            }
        ]
    }
}
```

# 17、学生端获取已绑定家长列表

| 接口定义  | http://xxx:port/rest/s/parents | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
|请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|家长列表|List||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/parents
```

返回JSON数据：
```
{
    "code": 900,
    "list": [  //返回列表
        {
            "p_id": "5822b47ffde225c607256630",
            "p_nick": "大耳朵劣人",
            "p_avatar": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLB8ZAicqHDhdfqyabXZVVspjS0FSiceryeeeN81N1efFmWh28jpX2vYFckYrYJBBQh6zOHaqzPia3IaA/0",
            "p_name": ""
        }
    ]
}
```

# 18、学生端解除家长绑定

| 接口定义  | http://xxx:port/rest/s/parent/:p_id/unbind | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
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
  -H "auth: xxxx" \
  http://host:port/rest/s/parent/5822b47ffde225c607256630/unbind
```

返回JSON数据：
```
{
    "code": 900
}
```

# 19、学生端获取自己的统计信息

说明：数据每日更新，非实时。

| 接口定义  | http://xxx:port/rest/s/stat | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|返回数据|Object||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/stat
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "userID": "57e4be6bbb3561f91174e9f9",
        "questions": {   //题目统计数据
            "total": 0,   //总数
            "perfect": 0,  //完美
            "excellent": 0,  //优秀
            "pass": 0,    //及格
            "fail": 0    //不及格
        },
        "createdAt": "2016-11-30T03:00:57.600Z"   //数据统计时间
    }
}
```


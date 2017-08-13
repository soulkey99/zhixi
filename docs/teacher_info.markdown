# 1、创建学校
说明：教师注册成功之后默认有一个type=default的学校，教师调用该接口将默认学校设置为相应类型的学校，每个教师只能创建一个学校。

| 接口定义  | http://xxx:port/rest/t/school | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|name|学校名称|String|必填|
|province|所属省份|String|必填|
|city|所属城市|String|必填|
|type|学校类型|String|必填，primary、middle、senior、after|
|master_name|管理员姓名|String||
|master_passwd|管理员密码|String||
|master_id_num|管理员身份证号|String||
|master_email|管理员邮箱|String||
|master_qq|管理员qq|String||
|master_weixin|管理员微信|String||
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
  -d '{"name":"test school", "province":"辽宁", "city":"沈阳", "type":"after", "master_name":"小明", "master_passwd":"123123", "master_id_num":"test", "master_email":"est@test.com", "master_qq":"789456123", "master_weixin":"ceshiweixin"}' \
  http://host:port/rest/t/school
```
返回JSON数据：
```
{
    "code": 900
}
```

# 2、修改学校信息

| 接口定义  | http://xxx:port/rest/t/school/:school_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|name|学校名称|String|必填|
|province|所属省份|String||
|city|所属城市|String||
|type|学校类型|String|primary、middle、senior、after|
|master_name|管理员姓名|String||
|master_passwd|管理员密码|String||
|master_id_num|管理员身份证号|String||
|master_email|管理员邮箱|String||
|master_qq|管理员qq|String||
|master_weixin|管理员微信|String||
|remark|备注|String||
|id_front|身份证正面图片|String||
|id_back|身份证背面图片|String||
|id_num|身份证号|String||
|org_name|机构名称|String||
|org_license|机构营业执照图片|String||
|admin_proof|管理员在职证明图片|String||
|org_num|工商注册号|String||
|org_capital|注册资本|String||
|org_people_num|机构人数范围|String||
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
  -d '{"city":"测试"}' \
  http://host:port/rest/t/school/57df43258bef4e802794dd0e
```
返回JSON数据：
```
{
    "code": 900
}
```


# 3、创建班级

说明：如果想要创建“我”作为校长创建的学校名下的班级，只要school_id=my即可。

| 接口定义  | http://xxx:port/rest/t/school/:school_id/class | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|name|班级名称|String||
|grade|年级|String||
|subject|学科|String||
|version|版本|String||
|duration|持续时长|String||
|startAt|开始日期|String||
|endAt|截止日期|String||
|week|单双周|String|每周，每两周，every、double|
|week_num|周几有课|String|可多选，逗号分隔，0-6|
|noon|上下午|String|before、after|
|hour|小时|String|取值范围：1-12|
|minute|分钟|String|0、30|
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
  -d '{"name":"test school", "grade":"七年级上", "subject":"数学", "version":"北师大版", "duration":"60", "week":"every", "week_num":"1,2,3", "day":"before", "hour":"9", "minute":"30", "startAt":"2016-09-01", "endAt":"2016-10-01"}' \
  http://host:port/rest/t/school/57df43258bef4e802794dd0e/class
```
返回JSON数据：
```
{
    "code": 900
}
```

# 4、获取班级信息

| 接口定义  | http://xxx:port/rest/t/class/:class_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|班级详情|Object||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -d 'auth: xxxx' \
  http://host:port/rest/t/class/57df4665053c674808325fe6
```
返回JSON数据：
```
{
    "code": 900,
    "info": {}  //班级信息
}
```

# 4.5、编辑班级信息

| 接口定义  | http://xxx:port/rest/t/class/:class_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|name |班级名称 | String  | |
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
  -d '{"name":"test class"}' \
  http://host:port/rest/t/class/57df4665053c674808325fe6
```
返回JSON数据：
```
{
    "code": 900
}
```


# 5、教师搜索学生列表

| 接口定义  | http://xxx:port/rest/t/search/student | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|phone|手机号| String  |以下参数三选一|
|nick|手机号| String  ||
|name|手机号| String  ||
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -G \
  -d "phone=" \
  http://host:port/rest/t/search/student
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "s_id": "57c4e70ff6d95f282d9729fa",
            "name": "",
            "nick": "",
            "avatar": "",
            "phone": ""
        }
    ]
}
```


# 6、教师为班级添加学生

| 接口定义  | http://xxx:port/rest/t/class/:class_id/student/add | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|s_id|学生id|String  | 必选，多个用逗号分隔 |
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
  -d '{"s_id": "57df8086079fcab024b45362,57df8087079fcab024b45363"}' \
  http://host:port/rest/t/class/57df4665053c674808325fe6/student/add
```
返回JSON数据：
```
{
    "code": 900
}
```


# 7、教师删除班级学生

| 接口定义  | http://xxx:port/rest/t/class/:class_id/student/del | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|s_id|学生id|String  | 必选，多个用逗号分隔 |
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
  -d '{"s_id": "57df8086079fcab024b45362,57df8087079fcab024b45363"}' \
  http://host:port/rest/t/class/57df4665053c674808325fe6/student/del
```
返回JSON数据：
```
{
    "code": 900
}
```

# 8、教师获取班级学生

| 接口定义  | http://xxx:port/rest/t/class/:class_id/student/ | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String  |可选，默认1|
|limit|获取数量|String  |可选，默认10|
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
  http://host:port/rest/t/class/57df4665053c674808325fe6/student
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "userID": "57c4e70ff6d95f282d9729fa",
            "nick": "",
            "name": "",
            "avatar": "http://oss..com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg"
        },
        {
            "userID": "57c927c6be55b1ef6c73eeac",
            "nick": "xf",
            "name": "",
            "avatar": "http://oss..com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg"
        }
    ]
}
```


# 9、教师获取班级课时计划列表

| 接口定义  | http://xxx:port/rest/t/class/:class_id/schedule | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET|
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|起始位置|String |可选，默认1|
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
  http://host:port/rest/t/class/57df4665053c674808325fe6/schedule
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "seq": 1,   //顺序
            "schedule_id": "57df94cea824a5b41f25d8ad",  //ID
            "startAt": "2016-09-01T01:30:00.000Z",  //上课时间
            "plan": "1.5 怎么学好数学"   //课时计划
        },
        {
            "seq": 2,
            "schedule_id": "57df94e6d095b0c02733922e",
            "startAt": "2016-09-02T01:30:00.000Z",
            "plan": ""
        }
    ]
}
```


# 10、教师编辑课时计划

| 接口定义  | http://xxx:port/rest/t/class/:class_id/schedule/:schedule_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|plan|课时计划|String  |必选|
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
  -H "auth: xxxx"  \
  -d '{"plan": "1.5 怎么学好数学"}' \
  http://host:port/rest/t/class/57df4665053c674808325fe6/schedule/57df94cea824a5b41f25d8ad
```
返回JSON数据：
```
{
    "code": 900
}
```

# 11、教师获取名下所有班级列表

| 接口定义  | http://xxx:port/rest/t/class | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
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
  -G \
  -d "start=5" \
  http://host:port/rest/t/class
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "createdAt": "2016-09-19T01:59:01.854Z",    //创建时间
            "week": "every",        //单周every、双周double
            "endAt": "2016/10/1",   //结班日期
            "startAt": "2016/9/1",  //开班日期
            "subject": "数学",        //科目
            "grade": "七年级上",        //年级
            "t_id": "57df43258bef4e802794dd0d",     //教师ID
            "school_id": "57df43258bef4e802794dd0e",    //学校ID
            "class_name": "test class",       //班级名称
            "minute": 30,       //上课时间（分钟）
            "hour": 9,          //上课时间（小时）
            "noon": "before",   //上午：before，下午晚上：after
            "week_num": [       //每周上课日
                "1",
                "2",
                "3"
            ],
            "duration": 60,     //每节课持续时间
            "valid": true,      //是否有效
            "class_id": "57df4665053c674808325fe6"      //班级ID
        }
    ]
}
```


# 12、教师获取加入班级申请列表

| 接口定义  | http://xxx:port/rest/t/classJoinList | | |
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
  http://host:port/rest/t/classJoinList
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

# 13、教师获取特定班级的申请列表

| 接口定义  | http://xxx:port/rest/t/class/:class_id/joinList | | |
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
  http://host:port/rest/t/class/57e23ac226f08ee8381e97a8/joinList
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "cs_id": "57e256b1a11fd1082274a684",    //申请记录ID
            "class_id": "57e23ac226f08ee8381e97a8", //班级ID
            "class_name": "class2",     //班级名称
            "reason": "",                  //申请理由
            "s_id": "57c4e70ff6d95f282d9729fa", //学生ID
            "s_name": "",       //学生姓名
            "s_nick": "",       //学生昵称
            "s_avatar": "http://oss..com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg",    //学生头像
            "msg": "",
            "status": "pending"         //申请状态
        }
    ]
}
```

# 14、教师审核学生的加入班级申请

| 接口定义  | http://xxx:port/rest/t/classJoin/:cs_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |POST |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|status|审核结果|String|必填，verified通过，fail：拒绝|
|msg|拒绝理由|String|可选|
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
  -d '{"status": "fail", "reason": "你没交学费"}'
  http://host:port/rest/t/classJoin/57e256b1a11fd1082274a684
```
返回JSON数据：
```
{
    "code": 900,
    "status": "fail"      //教师操作之后该条记录的状态
}
```


# 15、教师首页待办事项列表

说明：列表一共分为两种类型，type=schedule课时计划，type=homework作业。其中课时计划按状态分为status=pending即将上课，status=ongoing正在上课。作业按状态分为status=waiting待布置，status=assigned待批改。通过limit参数可以设置获取的课时计划(type=schedule)条目数量，作业(type=homework)的数量不可设置。

| 接口定义  | http://xxx:port/rest/t/todoList | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|limit|课时计划数量|String|可选，默认3|
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
  -d "limit=5" \
  http://host:port/rest/t/todoList
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "schedule_id": "57df94e7d095b0c027339240",
            "class_id": "57df4665053c674808325fe6",
            "class_name": "test class",
            "seq": 1,
            "startAt": "2016-09-23T01:30:00.000Z",
            "endAt": "2016-09-23T02:30:00.000Z",
            "plan": "",
            "homework_status": "waiting",
            "type": "schedule",
            "status": "pending",
            "student_total": 2,    //班级学生总数
            "student_finished": 1  //完成作业学生数
        },
        {
            "schedule_id" "57df94e7d095b0c02733923a",
            "class_id": "57df4665053c674808325fe6",
            "class_name": "test class",
            "seq": 2,
            "startAt": "2016-09-16T01:30:00.000Z",
            "endAt": "2016-09-16T02:30:00.000Z",
            "plan": "",
            "type": "homework",
            "status": "waiting",
            "student_total": 2,    //班级学生总数
            "student_finished": 1  //完成作业学生数
        },
        {
            "schedule_id": "57e23ac226f08ee8381e97aa",
            "class_id": "57e23ac226f08ee8381e97a8",
            "class_name": "class2",
            "seq": 3,
            "startAt": "2016-09-16T01:30:00.000Z",
            "endAt": "2016-09-16T03:00:00.000Z",
            "plan": "",
            "type": "homework",
            "status": "assigned",
            "homework_endAt": "2016-09-25T03:00:00.000Z",   //作业提交截止时间
            "student_total": 2,    //班级学生总数
            "student_finished": 1  //完成作业学生数
        }
    ]
}
```

# 16、教师给学生布置作业，编辑已布置的作业

说明：教师留作业如果要直接发布，需传status=assigned，如果要保存成草稿，需要传status=draft，如果直接放弃留作业，传status=abandoned，如果要重置课时的作业，传status=waiting。

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/homework | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|q_id|题目ID|String|多个ID用逗号分隔|
|qlist|题目列表|List|与q_id二选一|
|endAt|提交截止时间|String|可选|
|status|作业状态| String  |abandoned/assigned/draft|
|auto|是否自动发布|String|可选，true(默认)、false|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

说明：qlist是一个数组结构，与q_id二选一传给服务端，如果二者都有内容则取q_id内容。qlist的结构如下：
```
[
    {
        "chapter_id": "5786f5f686bd1c837915224e",
        "question_ids": [
            "570b36832119225382351b6c",
            "575512a05d7ae0c3460e7412"
        ]
    },
    {
        "chapter_id": "5786f5f686bd1c837915224f",
        "question_ids": [
            "57553d3f62cc0870779a61db",
            "575512a05d7ae0c3460e7412"
        ]
    }
]
```

 请求示例：
```
curl -X POST \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"q_id": "57c4e70ff6d95f282d9729fa,57c4e70ff6d95f282d9729fa,57c4e70ff6d95f282d9729fa", "endAt": "2016-10-16T03:00:00.000Z"}' \
  http://host:port/rest/t/schedule/57e23ac226f08ee8381e97a9/homework
```
返回JSON数据：
```
{
    "code": 900
}
```


# 17、教师发布指定课时作业的草稿

说明：将指定课时的作业草稿发布给学生。

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/publish | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |POST |
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
  -H "channel: TencentAPP" \
  -H "auth: xxxx"   \
  http://host:port/rest/t/schedule/57e23ac226f08ee8381e97a9/publish
```
返回JSON数据：
```
{
    "code": 900
}
```


# 18、教师获取指定课时的详情

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/detail | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|详细信息|Object||
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx"   \
  http://host:port/rest/t/schedule/57df94cea824a5b41f25d8ad/detail
```
返回JSON数据：
```
{
    "code": 900,
    "info": {
        "schedule_id": "57df94cea824a5b41f25d8ad",
        "seq": 1,
        "class_id": "57df4665053c674808325fe6",
        "class_name": "test class",
        "startAt": "2016-09-01T01:30:00.000Z",
        "endAt": "2016-09-01T01:30:00.000Z",
        "plan": "1.5",
        "grade": "七年级上",
        "subject": "数学",
        "version": "北师大版",
        "homework_status": "draft",
        "homework_endAt": "2016-10-16T03:00:00.000Z",
        "homework_waiting_num": 0
    }
}
```

# 19、教师获取指定课时所留作业的所有题目列表

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/homework | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
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
  -H "auth: xxxx"   \
  http://host:port/rest/t/schedule/57e23ac226f08ee8381e97a9/homework
```
返回JSON数据：
```
{
    "code": 900,
    "status": "draft",  //作业状态
    "list": []  //里面是题目详情
}
```


# 20、教师获取自己已经留过、未留过的作业列表

说明：本接口获取教师已经留过或者未留过的作业列表，可以指定作业布置状态，班级ID，排序方式等。

作业布置状态：timeout：超时，waiting：未布置，assinged：已布置，abandoned：放弃，draft：草稿。排序方式：asc：时间正序，desc：时间倒序（默认）。

20160929讨论结果：历史作业：timeout,abandoned,assigned，新作业：waiting,draft。
20161111确定历史作业只取一个assigned状态，其他的都不取了。

| 接口定义  | http://xxx:port/rest/t/homework <br/> http://xxx:port/rest/t/class/:class_id/homework| | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|status|作业状态|String|可选，逗号分隔|
|sort|排序方式|String|可选，默认desc倒序|
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
  -H "auth: xxxx"  \
  -G \
  -d "limit=5" \
  http://host:port/rest/t/homework
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "schedule_id": "57df94cea824a5b41f25d8ad",  //该作业所对应的课时ID
            "class_id": "57df4665053c674808325fe6",     //班级ID
            "class_name": "test class",     //班级名称
            "startAt": "2016-09-01T01:30:00.000Z",      //上课时间
            "endAt": "2016-09-01T01:30:00.000Z",        //下课时间
            "plan": "1.5",                              //课时计划
            "homework_status": "assigned",              //留作业情况
            "homework_endAt": "2016-10-16T03:00:00.000Z",   //作业提交截止时间
            "homework_waiting_num": 0        //已提交待批改作业数量
        }
    ]
}
```


# 21、教师获取班级详情

| 接口定义  | http://xxx:port/rest/t/class/:class_id | | |
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
  -H "auth: xxxx"  \
  http://host:port/rest/t/class/57df4665053c674808325fe6/
```
返回JSON数据：
```
{
    "code": 900,
    "info": {        //班级详细内容
        "class_id": "57df4665053c674808325fe6",
        "class_name": "test class",
        "class_num": 100000,        //班号
        "version": "北师大版",
        "grade": "七年级上",
        "subject": "数学",
        "t_id": "57df43258bef4e802794dd0d",
        "school_id": "57df43258bef4e802794dd0e",
        "school_name": "test school",
        "avatars": [    //学生头像
            "http://oss..com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg",
            "http://oss..com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg"
        ],
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
        "startAt": "2016/9/1",
        "endAt": "2016/10/1",
        "s_count": 2,   //学生数
        "s_pending_count": 0        //申请中学生数
    }
}
```


# 22、教师根据一串q_id获取题目列表

| 接口定义  | http://xxx:port/rest/t/question | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|phone|手机号| String  |以下参数三选一|
|nick|手机号| String  ||
|name|手机号| String  ||
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -G \
  -d "phone=" \
  http://host:port/rest/t/search/student
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "s_id": "57c4e70ff6d95f282d9729fa",
            "name": "",
            "nick": "",
            "avatar": "",
            "phone": ""
        }
    ]
}
```

# 23、教师获取指定课时的作业统计信息

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/homework/stat | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
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
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/schedule/57fde9bf8de68c9662a55150/homework/stat
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "homework_stat_id": "57ff5f869cf439e427b1491c",  //统计数据ID（只在finished状态存在）
        "class_id": "57fde9bf8de68c9662a5514f",     //班级ID
        "class_name": "小胖四班",       //班级名称
        "schedule_id": "57fde9bf8de68c9662a55150",  //课时ID
        "seq": 0,   //课时序号
        "student_total": 1,     //学生数量
        "student_finished": 0,  //学生完成数量
        "unfinished_students": [    //未完成学生
            {
                "s_id": "57d78fcd2bea409d6f0061e8",
                "s_nick": "",
                "s_avatar": "",
                "s_name": ""
            }
        ],
        "additional_students": [    //补充作业学生
            {
                "s_id": "57d78fcd2bea409d6f0061e8",
                "s_nick": "",
                "s_avatar": "",
                "s_name": ""
            }
        ],
        "status": "finished",   //数据统计状态：pending：进行中，finished：已完成（超过截止日期）
        "question_stat": [  //问题完成情况统计 （只在finished状态存在）
            {
                "q_id": "5786f3e686bd1c837915224a",
                "wrong_count": 0,   //答错数
                "correct_count": 0  //答对数
            },
            {
                "q_id": "5786f7dd86bd1c8379152252",
                "wrong_count": 0,
                "correct_count": 0
            }
        ],
        "student_stat": [   //学生完成情况统计（只在finished状态存在）
            {
                "s_id": "57d78fcd2bea409d6f0061e8",
                "s_nick": "",
                "s_avatar": "",
                "s_name": "",
                "wrong_count": 0,  //答错题数
                "correct_count": 0,   //答对题数
                "status": "timeout"
            }
        ]
    }
}
```

# 24、教师获取指定课时的作业统计信息中的未完成学生列表

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/homework/stat/unfinished | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/schedule/57fde9bf8de68c9662a55150/homework/stat/unfinished
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "s_id": "57d78fcd2bea409d6f0061e8",
            "s_nick": "",
            "s_name": "",
            "s_avatar": ""
        }
    ]
}
```

# 25、教师获取指定课时的作业统计信息中的题目统计列表

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/homework/stat/question | | |
| -------- | -------- | -------- | -------- |
| 请求方式|GET|
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
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/schedule/57fde9bf8de68c9662a55150/homework/stat/question
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "q_id": "5786f3e686bd1c837915224a",     //问题ID
            "info": {   //问题详情
                "subject": "数学",
                "grade": "七年级上",
                "stage": "初中",
                "next": "5786f54c86bd1c837915224c",
                "remark": "test",
                "difficulty": 1,
                "enhance": [],
                "related": [],
                "point": [],
                "choice": [],
                "content": "一个六棱柱模型如图所示，它的底面边长都是5 cm，侧棱长4 cm。观察这个模型，回答下列问题：\n(1)这个六棱柱的几个面分别是什么形状？那些面的形状、大小完全相同？\n(2)这个六棱柱的所有侧面的面积之和是多少？<img class='questionImg' src='http://oss.soulkey99.com/upload/20160718/493b6c9f788b2488da79acdb512da099.png'>",
                "type": "root",
                "q_id": "5786f3e686bd1c837915224a"
            },
            "wrong_count": 2    //答错学生数
        }
    ]
}
```

# 26、教师获取指定课时的作业统计信息中的学生掌握情况列表

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/homework/stat/student | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|学生列表|List|必选|
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/schedule/57fde9bf8de68c9662a55150/homework/stat/student
```

返回JSON数据：
```
{
    "code": 900,
    "list": [       //学生列表（一次返回全部，不分页）
        {
            "s_id": "57d78fcd2bea409d6f0061e8",
            "status": "timeout",    //学生作业提交状态
            "s_nick": "",
            "s_name": "",
            "s_avatar": "",
            "wrong_count": 0,    //错题数
            "question_total": 2     //本次作业问题总数
        }
    ]
}
```


# 27、教师获取指定课时作业的指定学生答题情况列表

说明：默认获取该课时留给该学生的所有题目的答题情况，type=schedule获取课时作业答题情况，type=additional获取所有的补充作业的题目答题情况。

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/homework/stat/student/:s_id | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|type|获取类型|String|可选，schedule、additional，默认获取所有作业题目|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|学生列表|List|必选|
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/schedule/57fde9bf8de68c9662a55150/homework/stat/student/57d78fcd2bea409d6f0061e8
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "swork_id": "",  //如果返回的只有一个swork的内容，那么返回ID
        "status": "",    //如果返回的只有一个sowrk的内容，那么返回type
        "type" "",       //swork的类型，schedule/additional，如果两种都有，那么该值为空
        "schedule_id": "",    //对应的课时ID
        "s_id": "57d78fcd2bea409d6f0061e8", //学生信息
        "s_nick": "",
        "s_name": "",
        "s_avatar": "",
        "question_total": 2,  //总题数
        "correct_count": 1,     //正确题数
        "wrong_count": 0,       //错题数
        "has_feedback": false,  //教师是否添加过反馈
        "list": [   //题目列表
            {
                "q_id": "5786f7dd86bd1c8379152252", //题目ID
                "swork_id": "",   //本题所属的swork的ID
                "type": "",       //本题所属的swork的类型
                "status": "pending",    //目前做题状态
                "point": 0,         //题目得分
                "info": {   //题目信息
                    "subject": "数学",
                    "grade": "七年级上",
                    "stage": "初中",
                    "next": "5786f89e86bd1c8379152253",
                    "remark": "",
                    "difficulty": 1,
                    "enhance": [],
                    "related": [],
                    "point": [],
                    "choice": [],
                    "content": "五棱柱、六棱柱各有多少个面？多少个顶点？多少条棱？猜测七棱柱的情形并设法验证你的猜测。",
                    "type": "root",
                    "q_id": "5786f7dd86bd1c8379152252"
                }
            }
        ]
    }
}
```

# 28、教师获取指定课时的作业指定题目答错学生列表

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/homework/stat/question/:q_id/wrong | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|学生列表|List|必选|
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/schedule/57fdef7bc700c30364ea7f86/homework/stat/question/57a166ad86bd1c83791529ac/wrong
```

返回JSON数据：
```
{
    "code": 900,
    "info": {   //题目信息
        "subject": "数学",
        "grade": "七年级上",
        "stage": "初中",
        "remark": "本题考察通过数轴表示有理数的大小，\n在数轴上从左往右逐渐增大，观察图片可以的出$$A\\lt D\\lt E\\lt C\\lt B$$",
        "difficulty": 1,
        "content": "指出数轴上$$A,B,C,D,E$$各点分别表示的有理数，并用\"$$\\lt $$\"将它们连接起来<img class='questionImg' src='http://oss.soulkey99.com/upload/20160803/242ea1aa48545718c9f79b2bb15b57f2.png'>",
        "type": "root",
        "q_id": "57a166ad86bd1c83791529ac",
        "list": [   //错题同学列表
            {
                "s_id": "57fa0ae3c5db9b850ef7fb76",
                "s_nick": "问号",
                "s_name": "",
                "s_avatar": "",
                "point": 0
            },
            {
                "s_id": "57ff2d9d2ba2a6ac51113516",
                "s_nick": "大耳朵",
                "s_name": "",
                "s_avatar": "",
                "point": 0
            }
        ]
    }
}
```

# 29、教师给指定学生指定课时留补充作业

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/student/:s_id/homework/ | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |POST |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|q_id|问题ID|String|必选，多个用逗号分隔|
|endAt|提交截止日期|String|可选，默认不传取第二天|
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
  -d '{"q_id": "57c4e70ff6d95f282d9729fa,57c4e70ff6d95f282d9729fa,57c4e70ff6d95f282d9729fa"}' \
  http://host:port/rest/t/schedule/57fdef7bc700c30364ea7f86/student/580082058e4f60fb52fe5593/homework
```

返回JSON数据：
```
{
    "code": 900
}
```

# 30、教师获取指定课时发布给学生的作业列表

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/sworkList/ | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|type|获取类型|String|可选，schedule课时作业，additional补充作业|
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
  -d "type=additional" \
  http://host:port/rest/t/schedule/57fdef7bc700c30364ea7f86/sworkList
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "swork_id": "581aea0fed177a1d5bd0ff9e",
            "s_id": "57c927c6be55b1ef6c73eeac",
            "s_nick": "xf",
            "s_name": "",
            "s_avatar": "http://oss..com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg",
            "status": "pending",
            "type": "additional",
            "createdAt": "2016-11-03T07:41:03.775Z"
        }
    ]
}
```

# 31、教师获取指定课时发布给学生的作业列表

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/sworkList/ | | |
| -------- | -------- | -------- | -------- |
| 请求方式  |GET |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
|type|获取类型|String|可选，schedule课时作业，additional补充作业|
|status|作业状态|String|可选，多个逗号分隔，pending,finished,timeout,submitted,timeoutFinished|
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
  -d "type=additional" \
  http://host:port/rest/t/schedule/57fdef7bc700c30364ea7f86/sworkList
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "swork_id": "581aea0fed177a1d5bd0ff9e",
            "s_id": "57c927c6be55b1ef6c73eeac",
            "s_nick": "xf",
            "s_name": "",
            "s_avatar": "http://oss..com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg",
            "status": "pending",
            "type": "additional",
            "createdAt": "2016-11-03T07:41:03.775Z"
        }
    ]
}
```

# 32、教师获取指定发布给学生的作业的答题情况

| 接口定义  | http://xxx:port/rest/t/swork/:swork_id/stat | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|答题情况|Object|必选|
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/swork/581aea0fed177a1d5bd0ff9e/stat
```

返回JSON数据：参见接口27.

# 33、教师获取指定学生作业的指定题目答题流程

| 接口定义  | http://xxx:port/rest/t/swork/:swork_id/question/:q_id/steps | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|info|答题情况|Object|必选|
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/swork/580720f8dd8eefe475e94435/question/5787472286bd1c83791522b1/steps
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "swork_id": "580720f8dd8eefe475e94435",
        "schedule_id": "58070085bcddcf1565feb0ea",
        "type": "schedule",  //所属作业类型，课时作业、补充作业
        "q_id": "5787472286bd1c83791522b1",
        "point": 80,   //题目得分
        "status": "finished",   //答题状态
        "step": [  //答题流程
            {      //第一个是问题的root节点，所以没有choice_id字段
                "q_id": "5787472286bd1c83791522b1",
                "info": {
                    "q_id": "5787472286bd1c83791522b1",
                    "type": "root", 
                    "content": "举出几对具有相反意义的量，并分别用正负数表示？",
                    "remark": "首先要了解什么是相反意义的量，是指相同意义的两个量并且有正负，像“零上与零下\"、\"高出于低于\"、\"存款与取款\"都是意义相反的量，常见的",
                    "stage": "初中",
                    "subject": "数学",
                    "grade": "七年级上",
                    "next": "5787483086bd1c83791522b2",
                    "difficulty": 1,
                    "shortestPath": [
                        "5787472286bd1c83791522b1",
                        "5787483086bd1c83791522b2",
                        "5787492986bd1c83791522b5",
                        "57874aaf86bd1c83791522b8",
                        "57874b6286bd1c83791522bb"
                    ]
                }
            },
            {   //接下来是答题的流程，包含整个问题以及所选的选项
                "q_id": "5787483086bd1c83791522b2",
                "info": {
                    "q_id": "5787483086bd1c83791522b2",
                    "type": "prepare",
                    "content": "相反意义的量是指什么？",
                    "remark": "",
                    "root_id": "5787472286bd1c83791522b1",
                    "choice": [
                        {
                            "action": "question",
                            "choice_id": "5787485286bd1c83791522b3",
                            "content": "相同意义的两个量",
                            "correct": false,
                            "flag": "A",
                            "hint": "",
                            "next": ""
                        },
                        {
                            "action": "next",
                            "choice_id": "578748a686bd1c83791522b4",
                            "content": "以上都是",
                            "correct": true,
                            "flag": "C",
                            "hint": "",
                            "next": "5787492986bd1c83791522b5"
                        },
                        {
                            "action": "question",
                            "choice_id": "57874cde86bd1c83791522be",
                            "content": "有正负",
                            "correct": false,
                            "flag": "B",
                            "hint": "",
                            "next": ""
                        }
                    ]
                },
                "choice_id": ["578748a686bd1c83791522b4"],   //用户所选的选项数组
                "t": "2016-10-19T08:57:17.874Z"
            }
        ]
    }
}
```

# 34、教师获取指定课时指定学生的作业反馈列表

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/student/:s_id/feedback | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|反馈列表|List|必选|
| msg       | 错误信息  | String  | 可选 |

说明：暂时只有一条，不需要分页参数

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/schedule/57df94cea824a5b41f25d8ad/student/57c4e70ff6d95f282d9729fa/feedback
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "feedback_id": "5822b75d30ec1e4c6c06c837",   //反馈ID
            "class_id": "57df4665053c674808325fe6",      //班级ID
            "schedule_id": "57df94cea824a5b41f25d8ad",   //课时ID
            "createdAt": "2016-11-09T05:42:53.266Z",     //创建时间
            "s_id": "57c4e70ff6d95f282d9729fa",
            "t_id": "57df43258bef4e802794dd0d",
            "content": "hello world.",     //老师填写的反馈内容
            "s_info": {    //学生信息
                "userID": "57c4e70ff6d95f282d9729fa",
                "nick": "",
                "name": "",
                "avatar": "http://oss..com/upload/20160324/8de9aba0c60f83891ddc05caa4068fc6.jpg"
            },
            "t_info": {   //教师信息
                "userID": "57df43258bef4e802794dd0d",
                "nick": "",
                "name": "test teacher",
                "avatar": ""
            }
        }
    ]
}
```

# 35、为指定课时指定学生添加一条反馈

| 接口定义  | http://xxx:port/rest/t/schedule/:schedule_id/student/:s_id/feedback | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | POST  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|content|反馈内容|String|必填|
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
  -d '{"content": "hello world."}' \
  http://host:port/rest/t/schedule/57df94cea824a5b41f25d8ad/student/57c4e70ff6d95f282d9729fa/feedback
```
返回JSON数据：
```
{
    "code": 900
}
```

# 36、教师获取反馈模板列表

| 接口定义  | http://xxx:port/rest/t/feedbackTemplateList | | |
| -------- | -------- | -------- | -------- |
| 请求方式  | GET  |
| auth   |required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|type|获取类型|String|可选，public、personal|
|start|开始位置|String|可选，默认1|
|limit|获取数量|String|可选，默认10|
| 返回值    | | 
| code      | 状态码  | int | 必选 |
|list|获取列表|List|必选|
| msg       | 错误信息  | String  | 可选 |

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/t/feedbackTemplateList
```
返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "ft_id": "582416744725da27e03c4a74",  //模板ID
            "content": "这个学生太优秀了",   //模板内容
            "type": "public",   //类型：public公共模板，personal个人模板
            "level": 4,   //级别
            "level_desc": "优秀"   //级别描述
        },
        {
            "ft_id": "582416894725da27e03c4a77",
            "content": "这个学生还算不错",
            "type": "public",
            "level": 3,
            "level_desc": "良好"
        },
        {
            "ft_id": "582416a14725da27e03c4a7a",
            "content": "这个学生一般般",
            "type": "public",
            "level": 2,
            "level_desc": "及格"
        },
        {
            "ft_id": "582416b44725da27e03c4a7d",
            "content": "这个学生有点差劲",
            "type": "public",
            "level": 1,
            "level_desc": "不及格"
        }
    ]
}
```

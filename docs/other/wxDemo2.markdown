# 1、获取初中列表
 
 - 参见demo1

# 2、获取高中列表

 - 参见demo1

# 3、添加初中

 - 参见demo1


# 4、学生填写信息

|接口定义|http://xxx:port/rest/s/wxdemo2/info | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|school_id|当前学校ID|String|必填|
|school_name|当前学校名称|String|必填|
|target_id|目标学校ID|String|必填|
|target_name|目标学校名称|String|必填|
|math_point|数学分数|String|必填|
|main_point|数语外三科成绩|String|必填|
|rank|排名|String|必填|
|返回值|
|code|状态码|int|必选|


 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"school_id":"5840dc9caf97e421cccc3fa8", "沈阳大东区中学":"", "target_id":"5840d878559bc43bcc724769", "target_name":"东北育才学校", "math_point":"70","rank":"20"}'
  http://host:port/rest/s/wxdemo2/info
```

返回JSON数据：
```
{
    "code": 900
}
```

# 5、获取小报告

|接口定义|http://xxx:port/rest/s/wxdemo2/shortReport | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|school_id|学校ID|String||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"name": "测试添加学校"}'
  http://host:port/rest/s/wxdemo/juniorSchool
```

 返回JSON数据：
```
{
    "code": 900,
    "info": {
        "school_id": "5840dc9caf97e421cccc3fa8",
        "school_name": "沈阳大东区中学",   //学生填写的学校名称
        "fill_math_point": 82,  //学生填写的数学分数
        "fill_main_point": 270,      //学生填写的数语外三科总分
        "target_id": "5840d878559bc43bcc724769",
        "target_name": "东北育才学校",    //目标学校名称
        "target_point": 721.8,       //目标学校录取分数
        "target_math_point": 116,      //目标学校数学录取分数
        "target_main_point": 431,      //目标学校数语外三科录取总分
        "target_desc": "这里是学校信息介绍。。。",
        "list": [
            {
                "range": "0-10",
                "count": 1600
            },
            {
                "range": "10-20",
                "count": 0
            },
            {
                "range": "20-30",
                "count": 269
            },
            {
                "range": "30-40",
                "count": 804
            },
            {
                "range": "40-50",
                "count": 1067
            },
            {
                "range": "50-60",
                "count": 1603
            },
            {
                "range": "60-70",
                "count": 1606
            },
            {
                "range": "70-80",
                "count": 3775
            },
            {
                "range": "80-90",
                "count": 10689
            },
            {
                "range": "90-100",
                "count": 14372
            },
            {
                "range": "100-110",
                "count": 10657
            },
            {
                "range": "110-120",
                "count": 6907
            }
        ],
        "gap": -34,
        "stat": {
            "total": 53349,
            "highest": 120,
            "average": 89,
            "median": 93.6,
            "variance": 566.2,
            "sd": 23.8,
            "mode": 92.4
        },
        "surpass": 37778
    }
}
```

# 6、开始一个新的练习

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|e_id|练习ID|String||


 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/wxdemo2/exercise
```

返回JSON数据：
```
{
    "code": 900,
    "e_id": "58466dfe70f0da36c87f09f8",    //本次练习ID
    "group": "a"   //测试组，a：答错可继续、b：答错不能继续
}
```

# 7、获取指定练习中的下一道题

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/next | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|q_id|下一题ID|String||


 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  http://host:port/rest/s/wxdemo2/exercise/5846693f6db84044b01009aa/next
```

返回JSON数据：
```
{
    "code": 900,
    "q_id": "584509633b06901b6412d86d"    //下一题ID，如果为空表示所有题目答完
}
```

# 8、根据ID获取问题详情

|接口定义|http://xxx:port/rest/s/wxdemo2/question/:q_id | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|no|
|返回值  | 
|code|状态码|int|必选|
|info|返回列表|Object||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/question/58450b95798c7639548a911f
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "q_id": "584509633b06901b6412d86d",
        "type": "question",    //类型，question普通选择题，root分步式题干，step分步式解题步骤
        "content": "这里是题干1",    //题干
        "remark": "备注",
        "next": "",   //下一步题目ID，root及step有
        "choice": [    //选项，root类型没有
            {
                "action": "result",    //选到result即为答题结束
                "choice_id": "584509633b06901b6412d86c",   //选项ID
                "content": "选项1",    //选项内容
                "correct": true,      //选项是否正确答案
                "flag": "A",
                "hint": "",
                "next": ""
            },
            {
                "action": "hint",
                "choice_id": "584509633b06901b6412d86b",
                "content": "选项2",
                "correct": false,
                "flag": "D",
                "hint": "提示2",
                "next": ""
            },
            {
                "action": "hint",
                "choice_id": "584509633b06901b6412d86a",
                "content": "选项3",
                "correct": false,
                "flag": "D",
                "hint": "提示3",
                "next": ""
            },
            {
                "action": "hint",
                "choice_id": "584509633b06901b6412d869",
                "content": "选项4",
                "correct": false,
                "flag": "D",
                "hint": "提示4",
                "next": ""
            }
        ]
    }
}
```

# 9、学生进行答题

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/check | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|q_id|问题ID|String|必填|
|choice_id|选项ID|String|必填|
|返回值  | 
|code|状态码|int|必选|


 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  -H "auth: xxxx" \
  -d '{"q_id":"584509633b06901b6412d86d", "choice_id":"584509633b06901b6412d86c"}'
  http://host:port/rest/s/wxdemo2/exercise/5846693f6db84044b01009aa/check
```

返回JSON数据：
```
{
    "code": 900
}
```

# 10、获取报告封面

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/cover <br/> http://xxx:port/rest/s/wxdemo2/report/cover | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|info|返回信息|Object||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/exercise/5846693f6db84044b01009aa/cover
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "name": "问号",   //姓名
        "avatar": "",     //头像
        "score": 42,      //得分
        //下面是封面中的三句话
        "desc1": "根据问号同学的这次测试结果，结合“沈阳市历年中考”的核心知识点分布，我们从知识点掌握程度、学习习惯、思维方式以及能力分布为其制定了专业的学习计划。",
        "desc2": "问号同学目前的成绩在沈阳市应届考生中处于下游，距离省重点中学有一定差距。我们认为问号同学在经过第一阶段90天学习后，能在接下来的模拟中考中提高68 - 78分，可以达到省重点中学数学学科的录取分数。",
        "desc3": "本测评为国家教委考试司、多位重点中学高级教师根据近五年中考数据分析总结，结合人工智能和大数据，给出每个学生专业、权威的测评结果和相关建议。"
    }
}
```

# 11、获取用户的练习信息以及填写的部分信息

说明：此处的文字模板组装，一些值的计算逻辑，尽量在web端完成，方便后期修改。

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/info | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|Array||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/exercise/585cedf8d7976d40b019d9b0/info
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "name": "问号",   //姓名
        "avatar": "",   //头像
        "score": 42,    //本次测试得分
        "target_point": 721.8,    //填写目标学校录取分数
        "target_main_point": 341,   //目标学校数语外三科分数
        "target_math_point": 116    //目标学校数学分数
    }
}
```


# 12、获取试卷分析

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/paperAnalysis <br/> http://xxx:port/rest/s/wxdemo2/report/paperAnalysis(调试用)  | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|Array||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/exercise/585cedf8d7976d40b019d9b0/paperAnalysis
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "subject": "数学",
        "total_score": 120,       //总分
        "question_quantity": 6,   //试题总量
        "point_quantity": 26,   //知识点数量
        "coverage": 70,    //历年中考覆盖率
        "total_difficulty": 4,  //综合难度系数（1：容易，2：一般，3：难，4：极难）
        "point": [   //本次考试一级知识点分布情况
            {
                "total": 7,
                "content": "数与式",
                "point_id": "584e1998c884bb20b41e293d"
            },
            {
                "total": 4,
                "content": "方程与不等式",
                "point_id": "584e19b2cbaf16204c4adbd8"
            },
            {
                "total": 3,
                "content": "图形的变化",
                "point_id": "584e19bea68e5158c4325568"
            },
            {
                "total": 1,
                "content": "统计与概率",
                "point_id": "584e19c991c446451cc92bef"
            },
            {
                "total": 9,
                "content": "图形的性质",
                "point_id": "584e19db1f78e7484001b8f7"
            },
            {
                "total": 6,
                "content": "函数",
                "point_id": "584e19d2c3e4dd3bec55b174"
            }
        ],
        "history_point": [    //历年考试一级知识点分布情况
            {
                "total": 9,
                "content": "数与式",
                "point_id": "584e1998c884bb20b41e293d"
            },
            {
                "total": 8,
                "content": "方程与不等式",
                "point_id": "584e19b2cbaf16204c4adbd8"
            },
            {
                "total": 5,
                "content": "图形的变化",
                "point_id": "584e19bea68e5158c4325568"
            },
            {
                "total": 4,
                "content": "统计与概率",
                "point_id": "584e19c991c446451cc92bef"
            },
            {
                "total": 6,
                "content": "图形的性质",
                "point_id": "584e19db1f78e7484001b8f7"
            },
            {
                "total": 3,
                "content": "函数",
                "point_id": "584e19d2c3e4dd3bec55b174"
            }
        ]
    }
}
```

# 13、获取成绩分析

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/resultAnalysis <br/> http://xxx:port/rest/s/wxdemo2/report/resultAnalysis(调试用) | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|Array||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/exercise/585cedf8d7976d40b019d9b0/resultAnalysis
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "score": 68,   //本次测评分数
        "average_score": 45,   //本次平均分
        "list": [    //题目难度分布情况
            {
                "difficulty": 1,  //难度系数（1：容易，2：一般，3：难，4：极难）
                "quantity": 11,   //题目数量
                "score": 15,      //占分
                "correct": 9      //该学生答对数
            },
            {
                "difficulty": 2,
                "quantity": 16,
                "score": 40,
                "correct": 8
            },
            {
                "difficulty": 3,
                "quantity": 2,
                "score": 5,
                "correct": 1
            },
            {
                "difficulty": 4,
                "quantity": 2,
                "score": 8,
                "correct": 0
            }
        ],
        "compare_list": [    //对照组
            {
                "type": "average",   //同届平均水平
                "list": [
                    {
                        "difficulty": 1,
                        "rate": 80    //正确率，百分比
                    },
                    {
                        "difficulty": 2,
                        "rate": 67
                    },
                    {
                        "difficulty": 3,
                        "rate": 35
                    },
                    {
                        "difficulty": 4,
                        "rate": 12
                    }
                ]
            },
            {
                "type": "provinceKeySchool",   //省重点水平
                "list": [
                    {
                        "difficulty": 1,
                        "rate": 98
                    },
                    {
                        "difficulty": 2,
                        "rate": 95
                    },
                    {
                        "difficulty": 3,
                        "rate": 90
                    },
                    {
                        "difficulty": 4,
                        "rate": 80
                    }
                ]
            },
            {
                "type": "cityKeySchool",   //市重点水平
                "list": [
                    {
                        "difficulty": 1,
                        "rate": 92
                    },
                    {
                        "difficulty": 2,
                        "rate": 86
                    },
                    {
                        "difficulty": 3,
                        "rate": 68
                    },
                    {
                        "difficulty": 4,
                        "rate": 50
                    }
                ]
            }
        ]
    }
}
```

# 14、获取排名分析

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/rankAnalysis <br/> http://xxx:port/rest/s/wxdemo2/report/rankAnalysis(调试用) | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|Array||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/exercise/585cedf8d7976d40b019d9b0/rankAnalysis
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "user": {
            "math_score": 42,      //用户的本次测试得分
            "main_score": 270      //用户在前面填写的数语外三科得分
        },
        "list": [   //各重点高中的录取分数线情况
            {
                "school_name": "辽宁省实验中学",
                "math_score": 117,    //该校数学成绩
                "main_score": 337,   //该校数语外三科成绩
                "list": [   //该校各年的分数线
                    {
                        "year": "2016",     //年
                        "total_score": 726,    //总分
                        "admitted_students": 500   //录取人数
                    },
                    {
                        "year": "2015",
                        "total_score": 719,
                        "admitted_students": 520
                    },
                    {
                        "year": "2014",
                        "total_score": 718,
                        "admitted_students": 496
                    },
                    {
                        "year": "2013",
                        "total_score": 722,
                        "admitted_students": 514
                    },
                    {
                        "year": "2012",
                        "total_score": 722,
                        "admitted_students": 504
                    }
                ]
            },
            {
                "school_name": "东北育才中学",
                "math_score": 116,
                "main_score": 341,
                "list": [
                    {
                        "year": "2016",
                        "total_score": 721.8,
                        "admitted_students": 70
                    },
                    {
                        "year": "2015",
                        "total_score": 715,
                        "admitted_students": 86
                    },
                    {
                        "year": "2014",
                        "total_score": 714,
                        "admitted_students": 56
                    },
                    {
                        "year": "2013",
                        "total_score": 714,
                        "admitted_students": 71
                    },
                    {
                        "year": "2012",
                        "total_score": 718,
                        "admitted_students": 102
                    }
                ]
            },
            {
                "school_name": "沈阳第二十中学",
                "math_score": 115,
                "main_score": 341,
                "list": [
                    {
                        "year": "2016",
                        "total_score": 720,
                        "admitted_students": 450
                    },
                    {
                        "year": "2015",
                        "total_score": 712,
                        "admitted_students": 456
                    },
                    {
                        "year": "2014",
                        "total_score": 696,
                        "admitted_students": 408
                    },
                    {
                        "year": "2013",
                        "total_score": 713,
                        "admitted_students": 437
                    },
                    {
                        "year": "2012",
                        "total_score": 711,
                        "admitted_students": 425
                    }
                ]
            },
            {
                "school_name": "沈阳市第120中学",
                "math_score": 114,
                "main_score": 338,
                "list": [
                    {
                        "year": "2016",
                        "total_score": 719,
                        "admitted_students": 360
                    },
                    {
                        "year": "2015",
                        "total_score": 711,
                        "admitted_students": 349
                    },
                    {
                        "year": "2014",
                        "total_score": 694,
                        "admitted_students": 328
                    },
                    {
                        "year": "2013",
                        "total_score": 706,
                        "admitted_students": 361
                    },
                    {
                        "year": "2012",
                        "total_score": 710,
                        "admitted_students": 359
                    }
                ]
            },
            {
                "school_name": "沈阳第一中学",
                "math_score": 115,
                "main_score": 327,
                "list": [
                    {
                        "year": "2016",
                        "total_score": 717,
                        "admitted_students": 436
                    },
                    {
                        "year": "2015",
                        "total_score": 709,
                        "admitted_students": 416
                    },
                    {
                        "year": "2014",
                        "total_score": 680,
                        "admitted_students": 423
                    },
                    {
                        "year": "2013",
                        "total_score": 708,
                        "admitted_students": 432
                    },
                    {
                        "year": "2012",
                        "total_score": 709,
                        "admitted_students": 408
                    }
                ]
            }
        ]
    }
}
```

# 15、获取能力雷达

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/skillAnalysis <br/>http://xxx:port/rest/s/wxdemo2/report/skillAnalysis(调试用) | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|Array||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/exercise/585cedf8d7976d40b019d9b0/skillAnalysis
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "skill_id": "58646d34a685d11a640ac45e",
            "content": "解题速度",   //能力项
            "remark": "",
            "difficulty": 1,    //能力难度
            "quantity": 1,      //题目数量
            "correct": 1,       //答对数量
            "total_score": 5,   //总占分
            "score": 5,         //得分情况
            "suggest": 100,     //建议掌握度
            "time": 0,          //所需时间
            "key": "多做题，提高解题速度",    //主要攻破能力项
            "current": 100     //当前掌握度
        },
        {
            "skill_id": "58646d420be8103218a3caab",
            "content": "审题",
            "remark": "",
            "difficulty": 1,
            "quantity": 26,
            "correct": 24,
            "total_score": 46,
            "score": 42,
            "suggest": 100,
            "time": 8,
            "key": "集中注意力，更充分的理解题意、提高正确率",
            "current": 92
        },
        {
            "skill_id": "58646d495c86701b3c86c20a",
            "content": "计算能力",
            "remark": "",
            "difficulty": 1,
            "quantity": 19,
            "correct": 17,
            "total_score": 35,
            "score": 31,
            "suggest": 100,
            "time": 11,
            "key": "避免因马虎出现的计算错误，提高计算准确度",
            "current": 89
        },
        {
            "skill_id": "58646d5214452252b8a5d183",
            "content": "类比能力",
            "remark": "",
            "difficulty": 3,
            "quantity": 11,
            "correct": 9,
            "total_score": 17,
            "score": 13,
            "suggest": 100,
            "time": 18,
            "key": "灵活运用知识点的同时达到举一反三的能力",
            "current": 82
        },
        {
            "skill_id": "58646d5a47fc713704dfaf83",
            "content": "辅助元素",
            "remark": "",
            "difficulty": 3,
            "quantity": 2,
            "correct": 1,
            "total_score": 3,
            "score": 1,
            "suggest": 87.5,
            "time": 37.5,
            "key": "掌握基础需要添加辅助元素的题型",
            "current": 50
        },
        {
            "skill_id": "58646d68a6920f0964b67543",
            "content": "归纳法",
            "remark": "",
            "difficulty": 3,
            "quantity": 2,
            "correct": 2,
            "total_score": 6,
            "score": 6,
            "suggest": 100,
            "time": 0,
            "key": "注意未知数在结论中的取值范围",
            "current": 100
        },
        {
            "skill_id": "58646d702fda6f0c702fd939",
            "content": "演绎法",
            "remark": "",
            "difficulty": 2,
            "quantity": 5,
            "correct": 5,
            "total_score": 7,
            "score": 7,
            "suggest": 100,
            "time": 0,
            "key": "提高定理推倒出结论的能力",
            "current": 100
        },
        {
            "skill_id": "58646d8183e28b12e481c118",
            "content": "特殊值法",
            "remark": "",
            "difficulty": 2,
            "quantity": 3,
            "correct": 2,
            "total_score": 4,
            "score": 2,
            "suggest": 100,
            "time": 33,
            "key": "掌握运用特殊值验证结论",
            "current": 67
        }
    ]
}
```


# 16、获取知识点分析

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/pointAnalysis <br/> http://xxx:port/rest/s/wxdemo2/report/pointAnalysis(调试用) | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|Array||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/exercise/585cedf8d7976d40b019d9b0/pointAnalysis
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "point_id": "585b69d0b2ca870c083a8de9",
            "type": "point",     //type=point：一级知识点，type=sub_point：二级知识点
            "content": "方程与不等式",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 7,    //出现次数
            "correct": 7,     //答对次数
            "total_score": 18,   //总占分
            "score": 18,      //总得分
            "list": [    //该知识点下的二级知识点列表
                {
                    "point_id": "5860d74aa9fb462234cfbeb6",
                    "type": "sub_point",
                    "content": "一元二次方程",
                    "remark": "",
                    "group": "b",
                    "parent_id": "585b69d0b2ca870c083a8de9",
                    "root_id": "585b69d0b2ca870c083a8de9",
                    "sub_id": "",
                    "seq": 3,
                    "difficulty": 2,    //难度
                    "exam_score": 7,    //中考占分（根据本测试得分比例计算中考预估得分比例）
                    "quantity": 5,
                    "correct": 5,
                    "total_score": 14,
                    "score": 14
                },
                {
                    "point_id": "5860d7610d75fe431cf131d7",
                    "type": "sub_point",
                    "content": "分式方程",
                    "remark": "",
                    "group": "c",
                    "parent_id": "585b69d0b2ca870c083a8de9",
                    "root_id": "585b69d0b2ca870c083a8de9",
                    "sub_id": "",
                    "seq": 2,
                    "difficulty": 2,
                    "exam_score": 4,
                    "quantity": 0,
                    "correct": 0,
                    "total_score": 0,
                    "score": 0
                },
                {
                    "point_id": "5860d77b1d5c1a3200f7942d",
                    "type": "sub_point",
                    "content": "一元一次方程",
                    "remark": "",
                    "group": "d",
                    "parent_id": "585b69d0b2ca870c083a8de9",
                    "root_id": "585b69d0b2ca870c083a8de9",
                    "sub_id": "",
                    "seq": 1,
                    "difficulty": 2,
                    "exam_score": 5,
                    "quantity": 0,
                    "correct": 0,
                    "total_score": 0,
                    "score": 0
                },
                {
                    "point_id": "5860d794bda71e4b0037cf42",
                    "type": "sub_point",
                    "content": "二元一次方程组",
                    "remark": "",
                    "group": "d",
                    "parent_id": "585b69d0b2ca870c083a8de9",
                    "root_id": "585b69d0b2ca870c083a8de9",
                    "sub_id": "",
                    "seq": 2,
                    "difficulty": 2,
                    "exam_score": 2,
                    "quantity": 2,
                    "correct": 2,
                    "total_score": 4,
                    "score": 4
                },
                {
                    "point_id": "5860d7bda2538b3324a55bc3",
                    "type": "sub_point",
                    "content": "不等式与不等式组",
                    "remark": "",
                    "group": "e",
                    "parent_id": "585b69d0b2ca870c083a8de9",
                    "root_id": "585b69d0b2ca870c083a8de9",
                    "sub_id": "",
                    "seq": 1,
                    "difficulty": 2,
                    "exam_score": 6,
                    "quantity": 0,
                    "correct": 0,
                    "total_score": 0,
                    "score": 0
                }
            ]
        },
        {
            "point_id": "585b87587ba9881cb08f60a1",
            "type": "point",
            "content": "函数",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 4,
            "correct": 2,
            "total_score": 6,
            "score": 2,
            "list": [
                {
                    "point_id": "5860d7e24f03de4094dc9edb",
                    "type": "sub_point",
                    "content": "二次函数",
                    "remark": "",
                    "group": "b",
                    "parent_id": "585b87587ba9881cb08f60a1",
                    "root_id": "585b87587ba9881cb08f60a1",
                    "sub_id": "",
                    "seq": 4,
                    "difficulty": 4,
                    "exam_score": 3,
                    "quantity": 3,
                    "correct": 1,
                    "total_score": 5,
                    "score": 1
                },
                {
                    "point_id": "5860d7f9770c3539a8928a08",
                    "type": "sub_point",
                    "content": "反比例函数",
                    "remark": "",
                    "group": "c",
                    "parent_id": "585b87587ba9881cb08f60a1",
                    "root_id": "585b87587ba9881cb08f60a1",
                    "sub_id": "",
                    "seq": 3,
                    "difficulty": 2,
                    "exam_score": 2,
                    "quantity": 0,
                    "correct": 0,
                    "total_score": 0,
                    "score": 0
                },
                {
                    "point_id": "5860d8113a766832008ce98b",
                    "type": "sub_point",
                    "content": "一次函数",
                    "remark": "",
                    "group": "e",
                    "parent_id": "585b87587ba9881cb08f60a1",
                    "root_id": "585b87587ba9881cb08f60a1",
                    "sub_id": "",
                    "seq": 2,
                    "difficulty": 2,
                    "exam_score": 2,
                    "quantity": 1,
                    "correct": 1,
                    "total_score": 1,
                    "score": 1
                }
            ]
        },
        {
            "point_id": "585b8c7a2aff4f42dc786ab5",
            "type": "point",
            "content": "图形的性质与变化",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 17,
            "correct": 17,
            "total_score": 29,
            "score": 29,
            "list": [
                {
                    "point_id": "5860d9e71aa4671b884cda1c",
                    "type": "sub_point",
                    "content": "图形的初步认识",
                    "remark": "",
                    "group": "f",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 1,
                    "difficulty": 1,
                    "exam_score": 12,
                    "quantity": 1,
                    "correct": 1,
                    "total_score": 4,
                    "score": 4
                },
                {
                    "point_id": "5860da0f3bbde548b081fbcf",
                    "type": "sub_point",
                    "content": "相交线与平行线",
                    "remark": "",
                    "group": "f",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 2,
                    "difficulty": 2,
                    "exam_score": 2,
                    "quantity": 0,
                    "correct": 0,
                    "total_score": 0,
                    "score": 0
                },
                {
                    "point_id": "5860da22781c1731104db10b",
                    "type": "sub_point",
                    "content": "三角形与多边形",
                    "remark": "",
                    "group": "f",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 3,
                    "difficulty": 2,
                    "exam_score": 4,
                    "quantity": 2,
                    "correct": 2,
                    "total_score": 4,
                    "score": 4
                },
                {
                    "point_id": "5860da3b05c9c73420a0570f",
                    "type": "sub_point",
                    "content": "全等三角形",
                    "remark": "",
                    "group": "f",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 4,
                    "difficulty": 2,
                    "exam_score": 4,
                    "quantity": 4,
                    "correct": 4,
                    "total_score": 4,
                    "score": 4
                },
                {
                    "point_id": "5860da641bf7c940c49d6f51",
                    "type": "sub_point",
                    "content": "相似形",
                    "remark": "",
                    "group": "f",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 4,
                    "difficulty": 3,
                    "exam_score": 12,
                    "quantity": 3,
                    "correct": 3,
                    "total_score": 4,
                    "score": 4
                },
                {
                    "point_id": "5860da7aae26684b583ade44",
                    "type": "sub_point",
                    "content": "平行四边形及特别的平行四边形",
                    "remark": "",
                    "group": "f",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 4,
                    "difficulty": 2,
                    "exam_score": 3,
                    "quantity": 0,
                    "correct": 0,
                    "total_score": 0,
                    "score": 0
                },
                {
                    "point_id": "5860da824477664d90f9468b",
                    "type": "sub_point",
                    "content": "圆",
                    "remark": "",
                    "group": "f",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 4,
                    "difficulty": 3,
                    "exam_score": 10,
                    "quantity": 6,
                    "correct": 6,
                    "total_score": 8,
                    "score": 8
                },
                {
                    "point_id": "5860da931f07412edc55450b",
                    "type": "sub_point",
                    "content": "锐角三角函数",
                    "remark": "",
                    "group": "f",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 4,
                    "difficulty": 2,
                    "exam_score": 2,
                    "quantity": 1,
                    "correct": 1,
                    "total_score": 5,
                    "score": 5
                },
                {
                    "point_id": "5860daf484e97033e4fae183",
                    "type": "sub_point",
                    "content": "视图",
                    "remark": "",
                    "group": "g",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 1,
                    "difficulty": 2,
                    "exam_score": 2,
                    "quantity": 0,
                    "correct": 0,
                    "total_score": 0,
                    "score": 0
                },
                {
                    "point_id": "5860db094c60721cb81711ac",
                    "type": "sub_point",
                    "content": "轴对称与图形的旋转",
                    "remark": "",
                    "group": "i",
                    "parent_id": "585b8c7a2aff4f42dc786ab5",
                    "root_id": "585b8c7a2aff4f42dc786ab5",
                    "sub_id": "",
                    "seq": 1,
                    "difficulty": 3,
                    "exam_score": 9,
                    "quantity": 0,
                    "correct": 0,
                    "total_score": 0,
                    "score": 0
                }
            ]
        },
        {
            "point_id": "585ba26c684d0c19001df3ef",
            "type": "point",
            "content": "数与式",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 20,
            "correct": 18,
            "total_score": 60,
            "score": 56,
            "list": [
                {
                    "point_id": "5860d564cc19014094cbde7f",
                    "type": "sub_point",
                    "content": "实数",
                    "remark": "实数的有关计算",
                    "group": "a",
                    "parent_id": "585ba26c684d0c19001df3ef",
                    "root_id": "585ba26c684d0c19001df3ef",
                    "sub_id": "",
                    "seq": 1,
                    "difficulty": 1,
                    "exam_score": 4,
                    "quantity": 10,
                    "correct": 10,
                    "total_score": 18,
                    "score": 18
                },
                {
                    "point_id": "5860d5bde7cdea4ddcaf98af",
                    "type": "sub_point",
                    "content": "二次根式",
                    "remark": "",
                    "group": "a",
                    "parent_id": "585ba26c684d0c19001df3ef",
                    "root_id": "585ba26c684d0c19001df3ef",
                    "sub_id": "",
                    "seq": 2,
                    "difficulty": 1,
                    "exam_score": 2,
                    "quantity": 1,
                    "correct": 1,
                    "total_score": 5,
                    "score": 5
                },
                {
                    "point_id": "5860d692252209427c81fbc9",
                    "type": "sub_point",
                    "content": "整式的加减",
                    "remark": "整式的加减运算",
                    "group": "b",
                    "parent_id": "585ba26c684d0c19001df3ef",
                    "root_id": "585ba26c684d0c19001df3ef",
                    "sub_id": "",
                    "seq": 1,
                    "difficulty": 1,
                    "exam_score": 2,
                    "quantity": 2,
                    "correct": 0,
                    "total_score": 4,
                    "score": 0
                },
                {
                    "point_id": "5860d6a9f8723c1a9029540a",
                    "type": "sub_point",
                    "content": "整式的乘除与因式分解",
                    "remark": "",
                    "group": "b",
                    "parent_id": "585ba26c684d0c19001df3ef",
                    "root_id": "585ba26c684d0c19001df3ef",
                    "sub_id": "",
                    "seq": 2,
                    "difficulty": 1,
                    "exam_score": 7,
                    "quantity": 5,
                    "correct": 5,
                    "total_score": 23,
                    "score": 23
                },
                {
                    "point_id": "5860d6d08c158a2504f2122f",
                    "type": "sub_point",
                    "content": "分式",
                    "remark": "",
                    "group": "c",
                    "parent_id": "585ba26c684d0c19001df3ef",
                    "root_id": "585ba26c684d0c19001df3ef",
                    "sub_id": "",
                    "seq": 1,
                    "difficulty": 1,
                    "exam_score": 2,
                    "quantity": 2,
                    "correct": 2,
                    "total_score": 10,
                    "score": 10
                }
            ]
        },
        {
            "point_id": "585ba2d0f4bb7917247ae84a",
            "type": "point",
            "content": "统计与概率",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 2,
            "correct": 2,
            "total_score": 6,
            "score": 6,
            "list": [
                {
                    "point_id": "5860db37d1edcb0b70091af7",
                    "type": "sub_point",
                    "content": "统计与概率",
                    "remark": "",
                    "group": "h",
                    "parent_id": "585ba2d0f4bb7917247ae84a",
                    "root_id": "585ba2d0f4bb7917247ae84a",
                    "sub_id": "",
                    "seq": 1,
                    "difficulty": 2,
                    "exam_score": 12,
                    "quantity": 2,
                    "correct": 2,
                    "total_score": 6,
                    "score": 6
                }
            ]
        }
    ]
}
```

# 17、获取提分策略

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/improveStrategy<br/>http://xxx:port/rest/s/wxdemo2/report/improveStrategy | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|Array||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/exercise/585cedf8d7976d40b019d9b0/improveStrategy
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "score": 42,   //本次得分
        "improve_list": [   //提升列表
            {
                "school_id": "5840d878559bc43bcc724769",
                "school_name": "东北育才学校",
                "math_score": 116
            },
            {
                "school_id": "5840d878559bc43bcc724771",
                "school_name": "沈阳市外国语学校（中加班）",
                "math_score": 69
            }
        ],
        "point": [   //知识点需要加强的情况
            {
                "point_id": "5860d692252209427c81fbc9",
                "type": "sub_point",
                "content": "整式的加减",   //二级知识点名称
                "remark": "整式的加减运算",
                "group": "b",
                "parent_id": "585ba26c684d0c19001df3ef",
                "root_id": "585ba26c684d0c19001df3ef",
                "sub_id": "",
                "seq": 1,
                "difficulty": 1,    //难度
                "exam_score": 2,
                "quantity": 2,
                "correct": 0,
                "total_score": 4,
                "score": 0,
                "key": [    //主要攻破知识点
                    "列代数式",
                    "合并同类项",
                    "去括号、添括号"
                ],
                "root_content": "数与式"   //一级知识点名称
            },
            {
                "point_id": "5860d7e24f03de4094dc9edb",
                "type": "sub_point",
                "content": "二次函数",
                "remark": "",
                "group": "b",
                "parent_id": "585b87587ba9881cb08f60a1",
                "root_id": "585b87587ba9881cb08f60a1",
                "sub_id": "",
                "seq": 4,
                "difficulty": 4,
                "exam_score": 3,
                "quantity": 3,
                "correct": 1,
                "total_score": 5,
                "score": 1,
                "key": [
                    "二次函数一般形式",
                    "顶点坐标及意义",
                    "二次函数图像平移",
                    "二次函数图像与性质",
                    "最值问题",
                    "二次函数图像与a.b.c关系",
                    "二次函数与一元二次方程",
                    "二次函数的综合运用计算"
                ],
                "root_content": "函数"
            }
        ]
    }
}
```

# 7、获取知识点认知图谱

|接口定义|http://xxx:port/rest/s/wxdemo2/exercise/:e_id/pointGraph <br/> http://xxx:port/rest/s/wxdemo2/report/pointGraph(调试用) | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|key|关键字|String|可选|
|返回值  | 
|code|状态码|int|必选|
|list|返回列表|Array||

 请求示例：
```
curl -X GET \
  -H "Content-Type: application/json" \
  -H "client: 1.2.3.4" \
  -H "platform: android" \
  -H "channel: TencentAPP" \
  http://host:port/rest/s/wxdemo2/exercise/585cedf8d7976d40b019d9b0/pointGraph
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "point_id": "585b69d0b2ca870c083a8de9",
            "type": "point",
            "content": "方程与不等式",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 7,
            "correct": 7,
            "total_score": 18,
            "score": 18
        },
        {
            "point_id": "585b87587ba9881cb08f60a1",
            "type": "point",
            "content": "函数",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 4,
            "correct": 2,
            "total_score": 6,
            "score": 2
        },
        {
            "point_id": "585b8c7a2aff4f42dc786ab5",
            "type": "point",
            "content": "图形的性质与变化",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 17,
            "correct": 17,
            "total_score": 29,
            "score": 29
        },
        {
            "point_id": "585ba26c684d0c19001df3ef",
            "type": "point",
            "content": "数与式",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 20,
            "correct": 18,
            "total_score": 60,
            "score": 56
        },
        {
            "point_id": "585ba2d0f4bb7917247ae84a",
            "type": "point",
            "content": "统计与概率",
            "remark": "",
            "parent_id": "",
            "root_id": "",
            "sub_id": "",
            "seq": 1,
            "quantity": 2,
            "correct": 2,
            "total_score": 6,
            "score": 6
        },
        {
            "point_id": "5860d564cc19014094cbde7f",
            "type": "sub_point",
            "content": "实数",
            "remark": "实数的有关计算",
            "group": "a",
            "parent_id": "585ba26c684d0c19001df3ef",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "",
            "seq": 1,
            "difficulty": 1,
            "exam_score": 4,
            "quantity": 10,
            "correct": 10,
            "total_score": 18,
            "score": 18
        },
        {
            "point_id": "5860d5bde7cdea4ddcaf98af",
            "type": "sub_point",
            "content": "二次根式",
            "remark": "",
            "group": "a",
            "parent_id": "585ba26c684d0c19001df3ef",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "",
            "seq": 2,
            "difficulty": 1,
            "exam_score": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 5,
            "score": 5
        },
        {
            "point_id": "5860d692252209427c81fbc9",
            "type": "sub_point",
            "content": "整式的加减",
            "remark": "整式的加减运算",
            "group": "b",
            "parent_id": "585ba26c684d0c19001df3ef",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "",
            "seq": 1,
            "difficulty": 1,
            "exam_score": 2,
            "quantity": 2,
            "correct": 0,
            "total_score": 4,
            "score": 0
        },
        {
            "point_id": "5860d6a9f8723c1a9029540a",
            "type": "sub_point",
            "content": "整式的乘除与因式分解",
            "remark": "",
            "group": "b",
            "parent_id": "585ba26c684d0c19001df3ef",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "",
            "seq": 2,
            "difficulty": 1,
            "exam_score": 7,
            "quantity": 5,
            "correct": 5,
            "total_score": 23,
            "score": 23
        },
        {
            "point_id": "5860d6d08c158a2504f2122f",
            "type": "sub_point",
            "content": "分式",
            "remark": "",
            "group": "c",
            "parent_id": "585ba26c684d0c19001df3ef",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "",
            "seq": 1,
            "difficulty": 1,
            "exam_score": 2,
            "quantity": 2,
            "correct": 2,
            "total_score": 10,
            "score": 10
        },
        {
            "point_id": "5860d74aa9fb462234cfbeb6",
            "type": "sub_point",
            "content": "一元二次方程",
            "remark": "",
            "group": "b",
            "parent_id": "585b69d0b2ca870c083a8de9",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "",
            "seq": 3,
            "difficulty": 2,
            "exam_score": 7,
            "quantity": 5,
            "correct": 5,
            "total_score": 14,
            "score": 14
        },
        {
            "point_id": "5860d7610d75fe431cf131d7",
            "type": "sub_point",
            "content": "分式方程",
            "remark": "",
            "group": "c",
            "parent_id": "585b69d0b2ca870c083a8de9",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "",
            "seq": 2,
            "difficulty": 2,
            "exam_score": 4,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860d77b1d5c1a3200f7942d",
            "type": "sub_point",
            "content": "一元一次方程",
            "remark": "",
            "group": "d",
            "parent_id": "585b69d0b2ca870c083a8de9",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "",
            "seq": 1,
            "difficulty": 2,
            "exam_score": 5,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860d794bda71e4b0037cf42",
            "type": "sub_point",
            "content": "二元一次方程组",
            "remark": "",
            "group": "d",
            "parent_id": "585b69d0b2ca870c083a8de9",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "",
            "seq": 2,
            "difficulty": 2,
            "exam_score": 2,
            "quantity": 2,
            "correct": 2,
            "total_score": 4,
            "score": 4
        },
        {
            "point_id": "5860d7bda2538b3324a55bc3",
            "type": "sub_point",
            "content": "不等式与不等式组",
            "remark": "",
            "group": "e",
            "parent_id": "585b69d0b2ca870c083a8de9",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "",
            "seq": 1,
            "difficulty": 2,
            "exam_score": 6,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860d7e24f03de4094dc9edb",
            "type": "sub_point",
            "content": "二次函数",
            "remark": "",
            "group": "b",
            "parent_id": "585b87587ba9881cb08f60a1",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "",
            "seq": 4,
            "difficulty": 4,
            "exam_score": 3,
            "quantity": 3,
            "correct": 1,
            "total_score": 5,
            "score": 1
        },
        {
            "point_id": "5860d7f9770c3539a8928a08",
            "type": "sub_point",
            "content": "反比例函数",
            "remark": "",
            "group": "c",
            "parent_id": "585b87587ba9881cb08f60a1",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "",
            "seq": 3,
            "difficulty": 2,
            "exam_score": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860d8113a766832008ce98b",
            "type": "sub_point",
            "content": "一次函数",
            "remark": "",
            "group": "e",
            "parent_id": "585b87587ba9881cb08f60a1",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "",
            "seq": 2,
            "difficulty": 2,
            "exam_score": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 1,
            "score": 1
        },
        {
            "point_id": "5860d9e71aa4671b884cda1c",
            "type": "sub_point",
            "content": "图形的初步认识",
            "remark": "",
            "group": "f",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 1,
            "difficulty": 1,
            "exam_score": 12,
            "quantity": 1,
            "correct": 1,
            "total_score": 4,
            "score": 4
        },
        {
            "point_id": "5860da0f3bbde548b081fbcf",
            "type": "sub_point",
            "content": "相交线与平行线",
            "remark": "",
            "group": "f",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 2,
            "difficulty": 2,
            "exam_score": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860da22781c1731104db10b",
            "type": "sub_point",
            "content": "三角形与多边形",
            "remark": "",
            "group": "f",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 3,
            "difficulty": 2,
            "exam_score": 4,
            "quantity": 2,
            "correct": 2,
            "total_score": 4,
            "score": 4
        },
        {
            "point_id": "5860da3b05c9c73420a0570f",
            "type": "sub_point",
            "content": "全等三角形",
            "remark": "",
            "group": "f",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 4,
            "difficulty": 2,
            "exam_score": 4,
            "quantity": 4,
            "correct": 4,
            "total_score": 4,
            "score": 4
        },
        {
            "point_id": "5860da641bf7c940c49d6f51",
            "type": "sub_point",
            "content": "相似形",
            "remark": "",
            "group": "f",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 4,
            "difficulty": 3,
            "exam_score": 12,
            "quantity": 3,
            "correct": 3,
            "total_score": 4,
            "score": 4
        },
        {
            "point_id": "5860da7aae26684b583ade44",
            "type": "sub_point",
            "content": "平行四边形及特别的平行四边形",
            "remark": "",
            "group": "f",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 4,
            "difficulty": 2,
            "exam_score": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860da824477664d90f9468b",
            "type": "sub_point",
            "content": "圆",
            "remark": "",
            "group": "f",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 4,
            "difficulty": 3,
            "exam_score": 10,
            "quantity": 6,
            "correct": 6,
            "total_score": 8,
            "score": 8
        },
        {
            "point_id": "5860da931f07412edc55450b",
            "type": "sub_point",
            "content": "锐角三角函数",
            "remark": "",
            "group": "f",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 4,
            "difficulty": 2,
            "exam_score": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 5,
            "score": 5
        },
        {
            "point_id": "5860daf484e97033e4fae183",
            "type": "sub_point",
            "content": "视图",
            "remark": "",
            "group": "g",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 1,
            "difficulty": 2,
            "exam_score": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860db094c60721cb81711ac",
            "type": "sub_point",
            "content": "轴对称与图形的旋转",
            "remark": "",
            "group": "i",
            "parent_id": "585b8c7a2aff4f42dc786ab5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "",
            "seq": 1,
            "difficulty": 3,
            "exam_score": 9,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860db37d1edcb0b70091af7",
            "type": "sub_point",
            "content": "统计与概率",
            "remark": "",
            "group": "h",
            "parent_id": "585ba2d0f4bb7917247ae84a",
            "root_id": "585ba2d0f4bb7917247ae84a",
            "sub_id": "",
            "seq": 1,
            "difficulty": 2,
            "exam_score": 12,
            "quantity": 2,
            "correct": 2,
            "total_score": 6,
            "score": 6
        },
        {
            "point_id": "5860dbe12cf2d545dcbb2a8c",
            "type": "item",
            "content": "有理数与无理数",
            "remark": "",
            "parent_id": "5860d564cc19014094cbde7f",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d564cc19014094cbde7f",
            "seq": 1,
            "quantity": 2,
            "correct": 2,
            "total_score": 7,
            "score": 7
        },
        {
            "point_id": "5860dbec5f81244dd893c6c6",
            "type": "item",
            "content": "有理数混合运算",
            "remark": "",
            "parent_id": "5860d564cc19014094cbde7f",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d564cc19014094cbde7f",
            "seq": 1,
            "quantity": 7,
            "correct": 7,
            "total_score": 9,
            "score": 9
        },
        {
            "point_id": "5860dbfaf331304ea408fb61",
            "type": "item",
            "content": "科学记数法",
            "remark": "",
            "parent_id": "5860d564cc19014094cbde7f",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d564cc19014094cbde7f",
            "seq": 1,
            "quantity": 1,
            "correct": 1,
            "total_score": 2,
            "score": 2
        },
        {
            "point_id": "5860dc072c78cb2064191aa2",
            "type": "item",
            "content": "平方根、立方根",
            "remark": "",
            "parent_id": "5860d564cc19014094cbde7f",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d564cc19014094cbde7f",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860dc2f48921a41a45c6fa6",
            "type": "item",
            "content": "二次根式的性质",
            "remark": "",
            "parent_id": "5860d5bde7cdea4ddcaf98af",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d5bde7cdea4ddcaf98af",
            "seq": 1,
            "quantity": 1,
            "correct": 1,
            "total_score": 5,
            "score": 5
        },
        {
            "point_id": "5860dc3ca032381eec935749",
            "type": "item",
            "content": "二次根式的运算",
            "remark": "",
            "parent_id": "5860dc2f48921a41a45c6fa6",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d5bde7cdea4ddcaf98af",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860dc596059123978f52a71",
            "type": "item",
            "content": "列代数式",
            "remark": "",
            "parent_id": "5860d692252209427c81fbc9",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d692252209427c81fbc9",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860dc626c936334341e1100",
            "type": "item",
            "content": "合并同类项",
            "remark": "",
            "parent_id": "5860d692252209427c81fbc9",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d692252209427c81fbc9",
            "seq": 1,
            "quantity": 2,
            "correct": 0,
            "total_score": 4,
            "score": 0
        },
        {
            "point_id": "5860dc6ee445d40ab82df3f5",
            "type": "item",
            "content": "去括号、添括号",
            "remark": "",
            "parent_id": "5860d692252209427c81fbc9",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d692252209427c81fbc9",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860ef8cdd8456493c723dd3",
            "type": "item",
            "content": "幂的有关计算",
            "remark": "",
            "parent_id": "5860d6a9f8723c1a9029540a",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d6a9f8723c1a9029540a",
            "seq": 1,
            "quantity": 1,
            "correct": 1,
            "total_score": 5,
            "score": 5
        },
        {
            "point_id": "5860ef99ae621833ccbecb6d",
            "type": "item",
            "content": "整式的乘除",
            "remark": "",
            "parent_id": "5860d6a9f8723c1a9029540a",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d6a9f8723c1a9029540a",
            "seq": 1,
            "quantity": 2,
            "correct": 2,
            "total_score": 8,
            "score": 8
        },
        {
            "point_id": "5860efe4aaf4d72e443955a4",
            "type": "item",
            "content": "完全平方公式、平方差公式",
            "remark": "",
            "parent_id": "5860ef99ae621833ccbecb6d",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d6a9f8723c1a9029540a",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f000ffc085534ca78e19",
            "type": "item",
            "content": "因式分解",
            "remark": "",
            "parent_id": "5860d6a9f8723c1a9029540a",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d6a9f8723c1a9029540a",
            "seq": 1,
            "quantity": 1,
            "correct": 1,
            "total_score": 5,
            "score": 5
        },
        {
            "point_id": "5860f0316fbbc753683b9ee9",
            "type": "item",
            "content": "提公因式法、公式法",
            "remark": "",
            "parent_id": "5860f000ffc085534ca78e19",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d6a9f8723c1a9029540a",
            "seq": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 5,
            "score": 5
        },
        {
            "point_id": "5860f05d479511502cab4860",
            "type": "item",
            "content": "解一元二次方程",
            "remark": "",
            "parent_id": "5860d74aa9fb462234cfbeb6",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d74aa9fb462234cfbeb6",
            "seq": 1,
            "quantity": 3,
            "correct": 3,
            "total_score": 8,
            "score": 8
        },
        {
            "point_id": "5860f06c249d192418c22560",
            "type": "item",
            "content": "根与系数的关系",
            "remark": "",
            "parent_id": "5860d74aa9fb462234cfbeb6",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d74aa9fb462234cfbeb6",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f09a7a6e084d30e40ff7",
            "type": "item",
            "content": "配方法、公式法、因式分解法",
            "remark": "",
            "parent_id": "5860f05d479511502cab4860",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d74aa9fb462234cfbeb6",
            "seq": 2,
            "quantity": 2,
            "correct": 2,
            "total_score": 6,
            "score": 6
        },
        {
            "point_id": "5860f104be351410207d11fc",
            "type": "item",
            "content": "二次函数一般形式",
            "remark": "",
            "parent_id": "5860d7e24f03de4094dc9edb",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7e24f03de4094dc9edb",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f115efaafa21d0b9ee0a",
            "type": "item",
            "content": "顶点坐标及意义",
            "remark": "",
            "parent_id": "5860d7e24f03de4094dc9edb",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7e24f03de4094dc9edb",
            "seq": 1,
            "quantity": 2,
            "correct": 1,
            "total_score": 3,
            "score": 1
        },
        {
            "point_id": "5860f120dcd4ce43b0fb4f11",
            "type": "item",
            "content": "二次函数图像平移",
            "remark": "",
            "parent_id": "5860d7e24f03de4094dc9edb",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7e24f03de4094dc9edb",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f12c0a6d1e46b4545dfa",
            "type": "item",
            "content": "二次函数图像与性质",
            "remark": "",
            "parent_id": "5860d7e24f03de4094dc9edb",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7e24f03de4094dc9edb",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f143ea46be37f01259bd",
            "type": "item",
            "content": "最值问题",
            "remark": "",
            "parent_id": "5860f115efaafa21d0b9ee0a",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7e24f03de4094dc9edb",
            "seq": 2,
            "quantity": 1,
            "correct": 0,
            "total_score": 2,
            "score": 0
        },
        {
            "point_id": "5860f1925add185544a2bd68",
            "type": "item",
            "content": "二次函数图像与a.b.c关系",
            "remark": "",
            "parent_id": "5860f12c0a6d1e46b4545dfa",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7e24f03de4094dc9edb",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f1b1a4d18f2de43768d2",
            "type": "item",
            "content": "二次函数与一元二次方程",
            "remark": "",
            "parent_id": "5860f1925add185544a2bd68",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7e24f03de4094dc9edb",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f1ceb9c9b74cf00fc649",
            "type": "item",
            "content": "二次函数的综合运用计算",
            "remark": "",
            "parent_id": "5860f1b1a4d18f2de43768d2",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7e24f03de4094dc9edb",
            "seq": 4,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f1f577b1635538e4feec",
            "type": "item",
            "content": "分式的基本性质",
            "remark": "",
            "parent_id": "5860d6d08c158a2504f2122f",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d6d08c158a2504f2122f",
            "seq": 1,
            "quantity": 1,
            "correct": 1,
            "total_score": 5,
            "score": 5
        },
        {
            "point_id": "5860f20aaed13d4fa85efcf0",
            "type": "item",
            "content": "分式的运算",
            "remark": "",
            "parent_id": "5860f1f577b1635538e4feec",
            "root_id": "585ba26c684d0c19001df3ef",
            "sub_id": "5860d6d08c158a2504f2122f",
            "seq": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 5,
            "score": 5
        },
        {
            "point_id": "5860f22dc9f89d533cc380bb",
            "type": "item",
            "content": "解分式方程",
            "remark": "",
            "parent_id": "5860d7610d75fe431cf131d7",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d7610d75fe431cf131d7",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f24eed09a5513476ac0c",
            "type": "item",
            "content": "列分式方程解应用题",
            "remark": "",
            "parent_id": "5860f22dc9f89d533cc380bb",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d7610d75fe431cf131d7",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f2737e950633a455a9e1",
            "type": "item",
            "content": "反比例函数一般形式",
            "remark": "",
            "parent_id": "5860d7f9770c3539a8928a08",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7f9770c3539a8928a08",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f283871acf08c452bf8d",
            "type": "item",
            "content": "反比例函数图像与形式",
            "remark": "",
            "parent_id": "5860d7f9770c3539a8928a08",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7f9770c3539a8928a08",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f29c8b948942e4928d5c",
            "type": "item",
            "content": "K值的几何意义",
            "remark": "",
            "parent_id": "5860f283871acf08c452bf8d",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d7f9770c3539a8928a08",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f2c60a98a33cb4634d5d",
            "type": "item",
            "content": "等式的基本性质",
            "remark": "",
            "parent_id": "5860d77b1d5c1a3200f7942d",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d77b1d5c1a3200f7942d",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f2dd0991c04e18dfadc5",
            "type": "item",
            "content": "解一元一次方程",
            "remark": "",
            "parent_id": "5860f2c60a98a33cb4634d5d",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d77b1d5c1a3200f7942d",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f2f1fe582b29a09c870c",
            "type": "item",
            "content": "列一元一次方程解应用题",
            "remark": "",
            "parent_id": "5860f2dd0991c04e18dfadc5",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d77b1d5c1a3200f7942d",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f329849e0754946304b0",
            "type": "item",
            "content": "解二元一次方程组",
            "remark": "",
            "parent_id": "5860d794bda71e4b0037cf42",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d794bda71e4b0037cf42",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f34add032412c4ec65cb",
            "type": "item",
            "content": "代入消元法、加减消元法",
            "remark": "",
            "parent_id": "5860f329849e0754946304b0",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d794bda71e4b0037cf42",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f361570b9a5004699362",
            "type": "item",
            "content": "列二元一次方程组解应用题",
            "remark": "",
            "parent_id": "5860f34add032412c4ec65cb",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d794bda71e4b0037cf42",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f435f8fed548b0976c61",
            "type": "item",
            "content": "解三元一次方程组",
            "remark": "",
            "parent_id": "5860d794bda71e4b0037cf42",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d794bda71e4b0037cf42",
            "seq": 1,
            "quantity": 1,
            "correct": 1,
            "total_score": 2,
            "score": 2
        },
        {
            "point_id": "5860f454acc5e453fc5f1945",
            "type": "item",
            "content": "消元法转化为二元一次方程组",
            "remark": "",
            "parent_id": "5860f435f8fed548b0976c61",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d794bda71e4b0037cf42",
            "seq": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 2,
            "score": 2
        },
        {
            "point_id": "5860f46e6b67a151ac6d5cb7",
            "type": "item",
            "content": "不等式的基本性质",
            "remark": "",
            "parent_id": "5860d7bda2538b3324a55bc3",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d7bda2538b3324a55bc3",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f48411fce93664db08bb",
            "type": "item",
            "content": "解一元一次不等式",
            "remark": "",
            "parent_id": "5860f46e6b67a151ac6d5cb7",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d7bda2538b3324a55bc3",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f48eb2de1a3294b2b9a6",
            "type": "item",
            "content": "解一元一次不等式组",
            "remark": "",
            "parent_id": "5860f46e6b67a151ac6d5cb7",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d7bda2538b3324a55bc3",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5860f60574d2af0458dacd41",
            "type": "item",
            "content": "列一元一次不等式(组)解应用题",
            "remark": "",
            "parent_id": "5860f48eb2de1a3294b2b9a6",
            "root_id": "585b69d0b2ca870c083a8de9",
            "sub_id": "5860d7bda2538b3324a55bc3",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c755e4488e2d88cc0dfd",
            "type": "item",
            "content": "一次函数的一般形式",
            "remark": "",
            "parent_id": "5860d8113a766832008ce98b",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d8113a766832008ce98b",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c77249f59e4078f5ccc9",
            "type": "item",
            "content": "待定系数法",
            "remark": "",
            "parent_id": "5861c755e4488e2d88cc0dfd",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d8113a766832008ce98b",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c788361338282cb0dd66",
            "type": "item",
            "content": "一次函数的图像特征与性质",
            "remark": "",
            "parent_id": "5860d8113a766832008ce98b",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d8113a766832008ce98b",
            "seq": 1,
            "quantity": 1,
            "correct": 1,
            "total_score": 1,
            "score": 1
        },
        {
            "point_id": "5861c79fe30dc9310c2b0bfc",
            "type": "item",
            "content": "一次函数与方程(组)、不等式",
            "remark": "",
            "parent_id": "5860d8113a766832008ce98b",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d8113a766832008ce98b",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c7c0b691ac31704bd539",
            "type": "item",
            "content": "求最值、求取值范围的问题",
            "remark": "",
            "parent_id": "5861c79fe30dc9310c2b0bfc",
            "root_id": "585b87587ba9881cb08f60a1",
            "sub_id": "5860d8113a766832008ce98b",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c7e4586e3b3040174765",
            "type": "item",
            "content": "图形的展开与折叠",
            "remark": "",
            "parent_id": "5860d9e71aa4671b884cda1c",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860d9e71aa4671b884cda1c",
            "seq": 1,
            "quantity": 1,
            "correct": 1,
            "total_score": 4,
            "score": 4
        },
        {
            "point_id": "5861c7f3c6d17524c0cd9564",
            "type": "item",
            "content": "直线、射线、线段定义",
            "remark": "",
            "parent_id": "5860d9e71aa4671b884cda1c",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860d9e71aa4671b884cda1c",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c814287a864c68d3885d",
            "type": "item",
            "content": "角的定义及表示",
            "remark": "",
            "parent_id": "5861c7f3c6d17524c0cd9564",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860d9e71aa4671b884cda1c",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c8356d231c1ba0a45639",
            "type": "item",
            "content": "相交线的性质",
            "remark": "",
            "parent_id": "5860da0f3bbde548b081fbcf",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da0f3bbde548b081fbcf",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c8575ea6941c203056f6",
            "type": "item",
            "content": "垂线段最短问题应用",
            "remark": "",
            "parent_id": "5861c8356d231c1ba0a45639",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da0f3bbde548b081fbcf",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c86a74b2f431e4f4810f",
            "type": "item",
            "content": "平行线的性质",
            "remark": "",
            "parent_id": "5860da0f3bbde548b081fbcf",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da0f3bbde548b081fbcf",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c87a573b883638c6f939",
            "type": "item",
            "content": "平行线的判定",
            "remark": "",
            "parent_id": "5861c86a74b2f431e4f4810f",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da0f3bbde548b081fbcf",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c88d3fb20552f40cf1d8",
            "type": "item",
            "content": "平行线的证明方式",
            "remark": "",
            "parent_id": "5861c87a573b883638c6f939",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da0f3bbde548b081fbcf",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c8a760cf203b743e0fc2",
            "type": "item",
            "content": "三角形的有关概念",
            "remark": "",
            "parent_id": "5860da22781c1731104db10b",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c8baa136b61df8128e04",
            "type": "item",
            "content": "三角形的性质",
            "remark": "",
            "parent_id": "5861c8a760cf203b743e0fc2",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c8cbab728a0828efb4a7",
            "type": "item",
            "content": "一般三角形的应用",
            "remark": "",
            "parent_id": "5861c8baa136b61df8128e04",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c8e052b501094c299dba",
            "type": "item",
            "content": "直角三角形性质",
            "remark": "",
            "parent_id": "5860da22781c1731104db10b",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c8f60298015720d1fc79",
            "type": "item",
            "content": "勾股定理及逆定理",
            "remark": "",
            "parent_id": "5861c8e052b501094c299dba",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c90cd4fe874f2c1d1ff9",
            "type": "item",
            "content": "直角三角形证明、计算",
            "remark": "",
            "parent_id": "5861c8f60298015720d1fc79",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c920a262ee43d4c465be",
            "type": "item",
            "content": "等腰三角形的性质",
            "remark": "",
            "parent_id": "5860da22781c1731104db10b",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 1,
            "quantity": 1,
            "correct": 1,
            "total_score": 2,
            "score": 2
        },
        {
            "point_id": "5861c937d79dff549c2022fe",
            "type": "item",
            "content": "三线合一",
            "remark": "",
            "parent_id": "5861c920a262ee43d4c465be",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 2,
            "score": 2
        },
        {
            "point_id": "5861c948f27e0e259cd43882",
            "type": "item",
            "content": "等腰三角形的应用",
            "remark": "",
            "parent_id": "5861c937d79dff549c2022fe",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c95c2525d6030049b22a",
            "type": "item",
            "content": "等边三角形性质",
            "remark": "",
            "parent_id": "5860da22781c1731104db10b",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c96ec6af192f4850b04f",
            "type": "item",
            "content": "等边三角形的判定",
            "remark": "",
            "parent_id": "5861c95c2525d6030049b22a",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c981d66f5b4070925192",
            "type": "item",
            "content": "等边三角形的应用",
            "remark": "",
            "parent_id": "5861c96ec6af192f4850b04f",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c9937b0dd550ac7e3c86",
            "type": "item",
            "content": "多边形的有关概念",
            "remark": "",
            "parent_id": "5860da22781c1731104db10b",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c9a3d4c2c10b8cb837ad",
            "type": "item",
            "content": "多边形的性质",
            "remark": "",
            "parent_id": "5861c9937b0dd550ac7e3c86",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c9b545fb380a38dbd8b7",
            "type": "item",
            "content": "多边形计算的应用",
            "remark": "",
            "parent_id": "5861c9a3d4c2c10b8cb837ad",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da22781c1731104db10b",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c9cf44d3eb4cac5ea4a9",
            "type": "item",
            "content": "全等三角形性质",
            "remark": "",
            "parent_id": "5860da3b05c9c73420a0570f",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da3b05c9c73420a0570f",
            "seq": 1,
            "quantity": 2,
            "correct": 2,
            "total_score": 2,
            "score": 2
        },
        {
            "point_id": "5861c9dddaf35456a8a0e8c2",
            "type": "item",
            "content": "全等三角形判定",
            "remark": "",
            "parent_id": "5861c9cf44d3eb4cac5ea4a9",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da3b05c9c73420a0570f",
            "seq": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 1,
            "score": 1
        },
        {
            "point_id": "5861c9f068029728dc5ad2d3",
            "type": "item",
            "content": "AAS",
            "remark": "",
            "parent_id": "5861c9dddaf35456a8a0e8c2",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da3b05c9c73420a0570f",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861c9f9dc3ec852b89c924b",
            "type": "item",
            "content": "ASA",
            "remark": "",
            "parent_id": "5861c9dddaf35456a8a0e8c2",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da3b05c9c73420a0570f",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861ca003787cc3438d725b0",
            "type": "item",
            "content": "SAS",
            "remark": "",
            "parent_id": "5861c9dddaf35456a8a0e8c2",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da3b05c9c73420a0570f",
            "seq": 3,
            "quantity": 1,
            "correct": 1,
            "total_score": 1,
            "score": 1
        },
        {
            "point_id": "5861ca13f9dd664e6c0a6a49",
            "type": "item",
            "content": "HL(直角三角形)",
            "remark": "",
            "parent_id": "5861c9dddaf35456a8a0e8c2",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da3b05c9c73420a0570f",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861ca2ad0ab1428b47d0f79",
            "type": "item",
            "content": "比例线段",
            "remark": "",
            "parent_id": "5860da641bf7c940c49d6f51",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da641bf7c940c49d6f51",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861ca3cbb8c0a09b01c3267",
            "type": "item",
            "content": "比例的基本性质",
            "remark": "",
            "parent_id": "5861ca2ad0ab1428b47d0f79",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da641bf7c940c49d6f51",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861ca4da142ac534878ceca",
            "type": "item",
            "content": "相似三角形的性质",
            "remark": "",
            "parent_id": "5860da641bf7c940c49d6f51",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da641bf7c940c49d6f51",
            "seq": 1,
            "quantity": 2,
            "correct": 2,
            "total_score": 3,
            "score": 3
        },
        {
            "point_id": "5861ca5eee363151884dd1d5",
            "type": "item",
            "content": "相似三角形的判定",
            "remark": "",
            "parent_id": "5861ca4da142ac534878ceca",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da641bf7c940c49d6f51",
            "seq": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 1,
            "score": 1
        },
        {
            "point_id": "5861ca723d92490538801413",
            "type": "item",
            "content": "相似三角形的证明",
            "remark": "",
            "parent_id": "5861ca5eee363151884dd1d5",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da641bf7c940c49d6f51",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861ca9b9bc05e10f89b0fd2",
            "type": "item",
            "content": "平行四边形的有关概念",
            "remark": "",
            "parent_id": "5860da7aae26684b583ade44",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da7aae26684b583ade44",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861caaa409a713ba8ed9eaf",
            "type": "item",
            "content": "平行四边形的性质",
            "remark": "",
            "parent_id": "5861ca9b9bc05e10f89b0fd2",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da7aae26684b583ade44",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861cac6fd773954287d9a29",
            "type": "item",
            "content": "矩形的性质及判定",
            "remark": "",
            "parent_id": "5861caaa409a713ba8ed9eaf",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da7aae26684b583ade44",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861cad1e2ddf22a540d4cd6",
            "type": "item",
            "content": "菱形的性质及判定",
            "remark": "",
            "parent_id": "5861caaa409a713ba8ed9eaf",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da7aae26684b583ade44",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861cadb515cf10390626ecb",
            "type": "item",
            "content": "正方形的性质及判定",
            "remark": "",
            "parent_id": "5861caaa409a713ba8ed9eaf",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da7aae26684b583ade44",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861caf1b700b02244b55bad",
            "type": "item",
            "content": "与圆有关的概念",
            "remark": "",
            "parent_id": "5860da824477664d90f9468b",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da824477664d90f9468b",
            "seq": 1,
            "quantity": 2,
            "correct": 2,
            "total_score": 3,
            "score": 3
        },
        {
            "point_id": "5861cb05b8d40d2e4069c920",
            "type": "item",
            "content": "圆的基本性质",
            "remark": "",
            "parent_id": "5861caf1b700b02244b55bad",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da824477664d90f9468b",
            "seq": 2,
            "quantity": 2,
            "correct": 2,
            "total_score": 3,
            "score": 3
        },
        {
            "point_id": "5861cc97937d1f5604b0ac4f",
            "type": "item",
            "content": "圆的位置关系",
            "remark": "",
            "parent_id": "5861cb05b8d40d2e4069c920",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da824477664d90f9468b",
            "seq": 3,
            "quantity": 1,
            "correct": 1,
            "total_score": 1,
            "score": 1
        },
        {
            "point_id": "5861cca6df1d13539804c486",
            "type": "item",
            "content": "圆的相关公式",
            "remark": "",
            "parent_id": "5861cb05b8d40d2e4069c920",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da824477664d90f9468b",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861ccbc199d25498c28c43a",
            "type": "item",
            "content": "圆的切线证明",
            "remark": "",
            "parent_id": "5861cc97937d1f5604b0ac4f",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da824477664d90f9468b",
            "seq": 4,
            "quantity": 1,
            "correct": 1,
            "total_score": 1,
            "score": 1
        },
        {
            "point_id": "5861ccd0258441257c6b29c7",
            "type": "item",
            "content": "正多边形与圆的相关计算",
            "remark": "",
            "parent_id": "5861cca6df1d13539804c486",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da824477664d90f9468b",
            "seq": 4,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d0c3d4c653008897bf03",
            "type": "item",
            "content": "正弦、余弦、正切",
            "remark": "",
            "parent_id": "5860da931f07412edc55450b",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da931f07412edc55450b",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d0e33fce005560dea529",
            "type": "item",
            "content": "特殊角三角函数值",
            "remark": "",
            "parent_id": "5861d0c3d4c653008897bf03",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da931f07412edc55450b",
            "seq": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 5,
            "score": 5
        },
        {
            "point_id": "5861d0f905c4e54f682630d6",
            "type": "item",
            "content": "解直角三角形问题",
            "remark": "",
            "parent_id": "5861d0e33fce005560dea529",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860da931f07412edc55450b",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d11a4bed392f287c947d",
            "type": "item",
            "content": "几何体的视图",
            "remark": "",
            "parent_id": "5860daf484e97033e4fae183",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860daf484e97033e4fae183",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d12e57764a1444e20ba0",
            "type": "item",
            "content": "判定几何体形状",
            "remark": "",
            "parent_id": "5861d11a4bed392f287c947d",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860daf484e97033e4fae183",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d14912b4f009cc868bc7",
            "type": "item",
            "content": "数据的收集整理及描述",
            "remark": "",
            "parent_id": "5860db37d1edcb0b70091af7",
            "root_id": "585ba2d0f4bb7917247ae84a",
            "sub_id": "5860db37d1edcb0b70091af7",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d15d96cc114e14a7062a",
            "type": "item",
            "content": "数据的分析相关概念",
            "remark": "",
            "parent_id": "5861d14912b4f009cc868bc7",
            "root_id": "585ba2d0f4bb7917247ae84a",
            "sub_id": "5860db37d1edcb0b70091af7",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d17a2404673d30c56d7a",
            "type": "item",
            "content": "概率的有关概念",
            "remark": "",
            "parent_id": "5860db37d1edcb0b70091af7",
            "root_id": "585ba2d0f4bb7917247ae84a",
            "sub_id": "5860db37d1edcb0b70091af7",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d18da4983d41b07d1334",
            "type": "item",
            "content": "概率的计算方法",
            "remark": "",
            "parent_id": "5861d17a2404673d30c56d7a",
            "root_id": "585ba2d0f4bb7917247ae84a",
            "sub_id": "5860db37d1edcb0b70091af7",
            "seq": 2,
            "quantity": 1,
            "correct": 1,
            "total_score": 3,
            "score": 3
        },
        {
            "point_id": "5861d19e35e9f64fd012619f",
            "type": "item",
            "content": "列举法",
            "remark": "",
            "parent_id": "5861d18da4983d41b07d1334",
            "root_id": "585ba2d0f4bb7917247ae84a",
            "sub_id": "5860db37d1edcb0b70091af7",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d1a9d0cd8d51ec0c4c09",
            "type": "item",
            "content": "树形法",
            "remark": "",
            "parent_id": "5861d18da4983d41b07d1334",
            "root_id": "585ba2d0f4bb7917247ae84a",
            "sub_id": "5860db37d1edcb0b70091af7",
            "seq": 3,
            "quantity": 1,
            "correct": 1,
            "total_score": 3,
            "score": 3
        },
        {
            "point_id": "5861d1b30e54b91db035fe0f",
            "type": "item",
            "content": "列表法",
            "remark": "",
            "parent_id": "5861d18da4983d41b07d1334",
            "root_id": "585ba2d0f4bb7917247ae84a",
            "sub_id": "5860db37d1edcb0b70091af7",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d3dbb4f52351d001569f",
            "type": "item",
            "content": "图形的旋转",
            "remark": "",
            "parent_id": "5860db094c60721cb81711ac",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860db094c60721cb81711ac",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d3ebbafde72450a24470",
            "type": "item",
            "content": "旋转的性质",
            "remark": "",
            "parent_id": "5861d3dbb4f52351d001569f",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860db094c60721cb81711ac",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d3fda871f20100753144",
            "type": "item",
            "content": "中心对称",
            "remark": "",
            "parent_id": "5861d3ebbafde72450a24470",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860db094c60721cb81711ac",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d4141361403768e2eb73",
            "type": "item",
            "content": "轴对称",
            "remark": "",
            "parent_id": "5861d3ebbafde72450a24470",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860db094c60721cb81711ac",
            "seq": 3,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d429a733be51fceef772",
            "type": "item",
            "content": "图形的平移",
            "remark": "",
            "parent_id": "5860db094c60721cb81711ac",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860db094c60721cb81711ac",
            "seq": 1,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        },
        {
            "point_id": "5861d438bf643954ac9679dd",
            "type": "item",
            "content": "平移及其性质",
            "remark": "",
            "parent_id": "5861d429a733be51fceef772",
            "root_id": "585b8c7a2aff4f42dc786ab5",
            "sub_id": "5860db094c60721cb81711ac",
            "seq": 2,
            "quantity": 0,
            "correct": 0,
            "total_score": 0,
            "score": 0
        }
    ]
}
```
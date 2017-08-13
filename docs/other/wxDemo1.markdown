# 1、获取初中列表

|接口定义|http://xxx:port/rest/s/wxdemo/juniorList | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|no|
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
  http://host:port/rest/s/wxdemo/juniorList
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "school_id": "5840dc9caf97e421cccc3fa8",
            "name": "沈阳大东区中学"
        },
        {
            "school_id": "5840dc9caf97e421cccc3faa",
            "name": "新民市大柳屯学校"
        }
    ]
}
```

# 2、获取高中列表

|接口定义|http://xxx:port/rest/s/wxdemo/highList | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|no|
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
  http://host:port/rest/s/wxdemo/highList
```

返回JSON数据：
```
{
    "code": 900,
    "list": [
        {
            "school_id": "5840d878559bc43bcc724769",
            "name": "东北育才学校"
        },
        {
            "school_id": "5840d878559bc43bcc72476a",
            "name": "沈阳市第二十中学"
        }
    ]
}
```

# 3、添加初中

|接口定义|http://xxx:port/rest/s/wxdemo/juniorSchool | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|name|关键字|String|必填|
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
    "school_id": "58464e282ba4512e74837ffa"
}
```

# 4、学生填写信息

|接口定义|http://xxx:port/rest/s/wxdemo/info | | |
| ---- | ---- | ---- | ---- |
|请求方式|POST|
|auth|required|
| 请求参数  | 参数说明 | 参数类型| 备注 |
|school_id|学校ID|String|必填|
|school_name|学校名称|String|必填|
|target_id|目标学校ID|String|必填|
|target_name|目标学校名称|String|必填|
|math_point|数学分数|String|必填|
|rank|排名|String|必填|
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
  -d '{"school_id":"5840dc9caf97e421cccc3fa8", "沈阳大东区中学":"", "target_id":"5840d878559bc43bcc724769", "target_name":"东北育才学校", "math_point":"70","rank":"20"}'
  http://host:port/rest/s/wxdemo/info
```

返回JSON数据：
```
{
    "code": 900
}
```

# 5、获取小报告

|接口定义|http://xxx:port/rest/s/wxdemo/shortReport | | |
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
        "school_id": "5840dc9caf97e421cccc408a",
        "school_name": "沈阳市第二十二中学",    //学生填写的学校名称
        "fill_math_point": 130,   //学生填写的数学分数
        "target_id": "5840d878559bc43bcc72478e",
        "target_name": "沈阳市第四中学",    //目标学校名称
        "target_point": 714,        //目标学校录取分数
        "target_math_point": 112,      //目标学校数学录取分数
        "target_desc": "这里是学校信息介绍。。。",
        "list": [   //上次中考分数分布
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
                "count": 263
            },
            {
                "range": "30-40",
                "count": 799
            },
            {
                "range": "40-50",
                "count": 1068
            },
            {
                "range": "50-60",
                "count": 1595
            },
            {
                "range": "60-70",
                "count": 1605
            },
            {
                "range": "70-80",
                "count": 3711
            },
            {
                "range": "80-90",
                "count": 10630
            },
            {
                "range": "90-100",
                "count": 14407
            }
        ],
        "gap": 18,    //差距（为负数表示学生填写分数小于目标分数，为正数表示学生分数超过目标分数）
        "stat": {    //上次考试分数统计信息
            "total": 53349,   //总考生
            "highest": 120,    //最高分
            "average": 89,     //平均分
            "median": 93.6,    //中位数
            "variance": 566.2,  //方差
            "sd": 23.8,     //标准差
            "mode": 0    //众数
        },
        "surpass": 0    //需要超越学生的人数
    }
}
```

# 6、开始一个新的练习

|接口定义|http://xxx:port/rest/s/wxdemo/exercise | | |
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
  http://host:port/rest/s/wxdemo/exercise
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

|接口定义|http://xxx:port/rest/s/wxdemo/exercise/:e_id/next | | |
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
  http://host:port/rest/s/wxdemo/exercise/5846693f6db84044b01009aa/next
```

返回JSON数据：
```
{
    "code": 900,
    "q_id": "584509633b06901b6412d86d"    //下一题ID，如果为空表示所有题目答完
}
```

# 8、根据ID获取问题

|接口定义|http://xxx:port/rest/s/wxdemo/question/:q_id | | |
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
  http://host:port/rest/s/wxdemo/question/58450b95798c7639548a911f
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

|接口定义|http://xxx:port/rest/s/wxdemo/exercise/:e_id/check | | |
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
  http://host:port/rest/s/wxdemo/exercise/5846693f6db84044b01009aa/check
```

返回JSON数据：
```
{
    "code": 900
}
```

# 10、获取最终的报告

|接口定义|http://xxx:port/rest/s/wxdemo/exercise/:e_id/report | | |
| ---- | ---- | ---- | ---- |
|请求方式|GET|
|auth|required|
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
  -H "auth: xxxx" \
  http://host:port/rest/s/wxdemo/exercise/5846693f6db84044b01009aa/report
```

返回JSON数据：
```
{
    "code": 900,
    "info": {
        "point": [   //知识点
            {
                "point_id": "584e1998c884bb20b41e293d",
                "content": "数与式",      //知识点名称
                "total": 7,         //总出现次数
                "correct": 3,       //正确次数
                "wrong": 4,         //错误次数
                "rate": 42.9     //掌握度
            },
            {
                "point_id": "584e19b2cbaf16204c4adbd8",
                "content": "方程与不等式",
                "total": 4,
                "correct": 3,
                "wrong": 0,
                "rate": 75
            },
            {
                "point_id": "584e19bea68e5158c4325568",
                "content": "图形的变化",
                "total": 3,
                "correct": 0,
                "wrong": 1,
                "rate": 0
            },
            {
                "point_id": "584e19c991c446451cc92bef",
                "content": "统计与概率",
                "total": 1,
                "correct": 0,
                "wrong": 1,
                "rate": 0
            },
            {
                "point_id": "584e19db1f78e7484001b8f7",
                "content": "图形的性质",
                "total": 9,
                "correct": 1,
                "wrong": 4,
                "rate": 11.1
            },
            {
                "point_id": "584e19d2c3e4dd3bec55b174",
                "content": "函数",
                "total": 6,
                "correct": 2,
                "wrong": 1,
                "rate": 33.3
            }
        ],
        "skill": [     //能力
            {
                "skill_id": "584a64cbb66a035540abf767",
                "content": "运算求解",    //能力名称
                "total": 18,      //出现次数
                "correct": 5,     //正确次数
                "wrong": 7,       //错误次数
                "rate": 27.8,      //掌握度
                "flag": "D",      //掌握等级
                "desc": "计算基础薄弱，存在马虎问题，急需提高计算准确度",     //等级描述
                "target_rate": 100     //目标学校所需掌握等级
            },
            {
                "skill_id": "584a64cbb66a035540abf766",
                "content": "逻辑思维",
                "total": 17,
                "correct": 3,
                "wrong": 8,
                "rate": 17.6,
                "flag": "D",
                "desc": "对题目中给出的已知条件不能够有效的进行分析理解得出相应结论",
                "target_rate": 80
            },
            {
                "skill_id": "584a64cbb66a035540abf768",
                "content": "应用意识",
                "total": 11,
                "correct": 2,
                "wrong": 6,
                "rate": 18.2,
                "flag": "D",
                "desc": "不能熟练的运用已学过的数学知识解决问题",
                "target_rate": 100
            },
            {
                "skill_id": "584a64cbb66a035540abf765",
                "content": "空间想象",
                "total": 1,
                "correct": 0,
                "wrong": 1,
                "rate": 0,
                "flag": "D",
                "desc": "缺乏空间立体感",
                "target_rate": 100
            },
            {
                "skill_id": "584a64cbb66a035540abf769",
                "content": "抽象概括",
                "total": 1,
                "correct": 0,
                "wrong": 0,
                "rate": 0,
                "flag": "D",
                "desc": "对事物的本质探索欠佳，缺乏区别某一类对象共同属性的思维过程",
                "target_rate": 100
            }
        ],
        "list": [  //上次中考分数分布情况
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
                "count": 263
            },
            {
                "range": "30-40",
                "count": 799
            },
            {
                "range": "40-50",
                "count": 1068
            },
            {
                "range": "50-60",
                "count": 1595
            },
            {
                "range": "60-70",
                "count": 1605
            },
            {
                "range": "70-80",
                "count": 3711
            },
            {
                "range": "80-90",
                "count": 10630
            },
            {
                "range": "90-100",
                "count": 14407
            }
        ],
        "math_point": 12,     //本次答题得分
        "target_id": "5840d878559bc43bcc72478e",
        "target_name": "沈阳市第四中学",    //填写的目标学校
        "target_point": 714,     //目标学校录取分数
        "target_math_point": 112,    //目标学校数学分数
        "question_total": 23,        //问题总数
        "question_correct": 12,       //问题答对数
        "question_partial_correct": 3,   //问题部分答对数
        "gap": -100,         //分数差距
        "total": 2,          //参加本次测试的总人数
        "rank": 1,           //本次测试在所有测试者的排名
        "need_surpass": 46178     //得分需要超越多少能达到目标人
    }
}
```




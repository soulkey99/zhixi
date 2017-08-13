export class Util {
    convertTime2Str(t: any): String {
        if (t == "" || t == undefined || t == "undefined") {
            return "暂无记录";
        } else {
            var ts = new Date(t);
            var year = ts.getFullYear().toString();
            var month = (ts.getMonth() + 1).toString();
            month = month.length < 2 ? '0' + month : month;
            var date = ts.getDate().toString();
            date = date.length < 2 ? '0' + date : date;
            var dateStr = year + '-' + month + '-' + date;
            var hour = ts.getHours().toString();
            hour = hour.length < 2 ? '0' + hour : hour;
            var min = ts.getMinutes().toString();
            min = min.length < 2 ? '0' + min : min;
            var sec = ts.getSeconds().toString();
            sec = sec.length < 2 ? '0' + sec : sec;
            var timeStr = hour + ':' + min;
            return dateStr + ' ' + timeStr;
        }
    }


    convertWeeklyScheduleStr(week_num: [string], week: string): string {
        var classWeekInfo = "";
        if (week == "every") {
            classWeekInfo += "每";
        }
        else {

        }

        week_num.forEach(element => {
            switch (element) {
                case "0":
                    classWeekInfo += "周一";
                    break;
                case "1":
                    classWeekInfo += "周二";
                    break;
                case "2":
                    classWeekInfo += "周三";
                    break;
                case "3":
                    classWeekInfo += "周四";
                    break;
                case "4":
                    classWeekInfo += "周五";
                    break;
                case "5":
                    classWeekInfo += "周六";
                    break;
                case "6":
                    classWeekInfo += "周日";
                    break;
                default:
                    break;
            }
            classWeekInfo += "/";
        });

        return classWeekInfo.substr(0, classWeekInfo.length - 1);
    }
    convertTime2DateStr(t: any): String {   //返回时间格式：2016/10/01
        if (t == "" || t == undefined || t == "undefined") {
            return "暂无记录";
        } else {
            let ts = new Date(t);
            let year = ts.getFullYear().toString();
            let month = (ts.getMonth() + 1).toString();
            let date = ts.getDate().toString();
            return `${year}.${month.length < 2 ? '0' + month : month}.${date.length < 2 ? '0' + date : date}`;
        }
    }
}



export class ClassItem {
  class_id: string;
  class_name: string;
  class_num:string;
  duration: number;
  endAt:string;
  grade:string;
  hour:number;
  minute:number;
  noon:string;
  s_count:number;
  createdAt:string;
  school_id:string;
  school_name:string;
  startAt:string;
  subject:string;
  t_id:string;
  version:string;
  week:string;
  week_num:number[];
  valid:boolean;
}

export class ClassInfo {
  class_id: string;
  class_name: string;
  class_num:string;
  duration: number;
  endAt:string;
  grade:string;
  hour:number;
  minute:number;
  noon:string;
  s_count:number;
  s_pending_count:number;
  school_id:string;
  school_name:string;
  startAt:string;
  subject:string;
  t_id:string;
  version:string;
  week:string;
  week_num:number[];
  avatars:string[];

}

export class StudentInfo {
    cs_id: string;
    s_id: string;
    s_name: string;
    s_avatar: string;
    s_nick: string;
}

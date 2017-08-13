/**
 * Created by MengLei on 2016-11-15.
 */

export class SimpleStudentInfo {
  s_id: string;
  s_nick: string;
  s_avatar: string;
  s_name: string;

  constructor(param) {
    this.s_id = param.s_id;
    this.s_nick = param.s_nick;
    this.s_avatar = param.s_avatar;
    this.s_name = param.s_name;
  }
}
class QuestionChoice {
  action: string;
  choice_id: string;
  content: string;
  correct: boolean;
  flag: string;
  hint: string;
  next: string;
}

export class ScheduleInfo {
  schedule_id: string;
  seq: number;
  class_id: string;
  class_name: string;
  startAt: string;
  endAt: string;
  plan: string;
  homework_status: string;
  homework_endAt: string;

  constructor(param) {
    this.schedule_id = param.schedule_id;
    this.seq = param.seq;
    this.class_id = param.class_id;
    this.class_name = param.class_name;
    this.startAt = param.startAt;
    this.endAt = param.endAt;
    this.plan = param.plan;
    this.homework_status = param.homework_status;
    this.homework_endAt = param.homework_endAt;
  }
}

export class StudyQuestion {
  q_id: string;
  type: string;
  content: string;
  remark: string;
  stage: string;
  subject: string;
  grade: string;
  next: string;
  difficulty: string;
  shortestPath: [string];
  root_id: string;
  choice: [QuestionChoice];

  constructor(param) {
    this.q_id = param.q_id;
    this.type = param.type;
    this.content = param.content;
    this.remark = param.remark;
    this.stage = param.stage;
    this.subject = param.subject;
    this.grade = param.grade;
    this.next = param.next;
    this.difficulty = param.difficulty;
    this.shortestPath = param.shortestPath;
    this.root_id = param.root_id;
    this.choice = param.choice;
  }
}

export class QuestionStat extends StudyQuestion {
  q_id: string;
  seq: number;
  wrong_count: number;
  correct_count: number;

  constructor(param) {
    super(param);
    this.q_id = param.q_id;
    this.wrong_count = param.wrong_count;
    this.correct_count = param.correct_count;
  }
}
class StudentQuestionStat extends SimpleStudentInfo {
  q_id: string;
  wrong_count: number;
  correct_count: number;
  status: string;

  constructor(param) {
    super(param);
    this.status = param.status;
    this.q_id = param.q_id;
    this.wrong_count = param.wrong_count;
    this.correct_count = param.correct_count;
  }
}
export class ScheduleHomeworkStat {
  homework_stat_id: string;
  schedule_startAt: string;
  class_id: string;
  class_name: string;
  schedule_id: string;
  seq: number;
  student_total: number;
  student_finished: number;
  unfinished_students: [SimpleStudentInfo];
  additional_students: [SimpleStudentInfo];
  status: string;
  question_stat: [QuestionStat];
  student_stat: [StudentStat];
}
class SimpleStudentPoint extends SimpleStudentInfo {
  point: number;

  constructor(param) {
    super(param);
    this.point = param.point;
  }
}
export class SworkItem extends SimpleStudentInfo {
  swork_id: string;
  status: string;
  type: string;
  total: number;
  finished: number;
  createdAt: string;

  constructor(param) {
    super(param);
    this.swork_id = param.swork_id;
    this.status = param.status;
    this.type = param.type;
    this.total = param.total;
    this.finished = param.finished;
    this.createdAt = param.createdAt;
  }
}
export class WrongQuestionInfo extends StudyQuestion {
  seq: number;
  list: SimpleStudentPoint[];

  constructor(param) {
    super(param);
    this.seq = param.seq;
    this.list = param.list;
  }
}
export class StudentStat extends SimpleStudentInfo {
  wrong_count: number;
  correct_count: number;
  question_total: number;
  status: string;

  constructor(param) {
    super(param);
    this.wrong_count = param.wrong_count;
    this.question_total = param.question_total;
    this.status = param.status;
  }
}

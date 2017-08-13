export class UserInfo {
    userID: string;
    avatar: string;
    intro: string;
    nick: string;
    phone: string;
    userInfo: {
        city: string,
        grade: string,
        school: string,
        target: string,
        version: string
    }
}

export class Choice {
    _id: string;
    action: string;
    choice_id: string;
    content: string;
    correct: boolean;
    flag: string;
    hint: string;
    id: string;
    next: string;
    remark: string;
    selected: boolean;
} 

export class SubQuestion {
    userID: string;
    updateAt: number;
    type: string;
    status: string;
    root_id: string;
    remark: string;
    q_id: string;
    msg: string;
    difficulty: number;
    createAt: number;
    content: string;
    choice: [Choice];
}
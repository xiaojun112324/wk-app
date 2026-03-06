export interface IUser {
    id: string;
    tel: string;
    nickname: string;
    telegramNickname: string;
    desc: string;
    avatar: string;
    refetchHandler?: () => void;
}
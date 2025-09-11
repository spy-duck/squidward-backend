export interface ICommandResponse<T> {
    code?: string;
    success: boolean;
    message?: string;
    response?: T;
}
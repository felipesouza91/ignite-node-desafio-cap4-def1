import { Statement } from "../../entities/Statement";
type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> &
  Pick<Statement, "user_id" | "description" | "amount" | "type">;
export type ICreateStatementDTO = OptionalExceptFor<Statement, "sender_id">;

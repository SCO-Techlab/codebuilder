import { InitWritter } from "../model/init-writter.model";
import { Writter } from "../model/writter.model";

export class CreateWritterSpace {
  static readonly type = "[Codebuilder] Create new writter space";
  constructor(public payload: { initWritter: InitWritter }) {}
}

export class WritteOnSpaceFiles {
  static readonly type = "[Codebuilder] Writte on space files";
  constructor(public payload: { writter: Writter }) {}
}

export class DesotryWritterSpace {
  static readonly type = "[Codebuilder] Destroy writter space";
  constructor(public payload: { initWritter: InitWritter }) {}
}
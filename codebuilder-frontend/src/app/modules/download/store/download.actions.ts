export class DownloadFolder {
  static readonly type = "[Download] Download folder";
  constructor(public payload: { folder: string }) {}
}
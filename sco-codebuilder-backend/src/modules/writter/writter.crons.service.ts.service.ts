import { CRON_CONSTANTS } from './../../constants/cron.constants';
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { CronJob } from "cron";
import { WritterService } from './writter.service';
import * as fs from 'fs';
import * as moment from 'moment';

@Injectable()
export class WritterCronsService {

  private _xamppPath: string;

  private deleteUnusedWorkSpacesCron: CronJob;

  constructor(
    private readonly configService: ConfigService,
    private readonly writterService: WritterService,
  ) { 
    this._xamppPath = this.configService.get('app.xamppPath');
  }

  /* Manage Crons */
  async onModuleInit() {
    this.deleteUnusedWorkSpacesCron = new CronJob(CRON_CONSTANTS.EVERY_DAY_MIDNIGHT, async () => {
      await this.deleteUnusedWorkSpaces();
    });

    this.startCrons();
  }

  async startCrons() {
    this.deleteUnusedWorkSpacesCron.start();
  }

  /* Crons */
  async deleteUnusedWorkSpaces() {
    const existXamppFolder: boolean = await this.writterService.existServerFolder();
    if (!existXamppFolder) {
      return;
    }

    const tokenFoldersList = fs.readdirSync(`${this._xamppPath}`);
    if (!tokenFoldersList || (tokenFoldersList && tokenFoldersList.length == 0)) {
      return;
    }

    const dateNow: Date = new Date();

    for (const tokenFolder of tokenFoldersList) {
      
      const tokenFolderFiles = fs.readdirSync(`${this._xamppPath}/${tokenFolder}`);
      if (!tokenFolder || (tokenFolder && tokenFolder.length == 0)) {
        continue;
      }

      let canDelete: boolean = true;
      for (const file of tokenFolderFiles) {
        const mtime: Date = moment(fs.statSync(`${this._xamppPath}/${tokenFolder}/${file}`).mtime).toDate();
        const duration = moment.duration(moment(dateNow).diff(mtime));
        const hours = duration.asHours();

        if (hours < 24) {
          canDelete = false;
          break;
        }
      }

      if (canDelete) {
        const deletedTokenFolder: boolean = await this.writterService.deleteTokenFolder(tokenFolder);
        if (!deletedTokenFolder) {
          console.log(`[deleteUnusedWorkSpaces] Unnable to delete token folder '${tokenFolder}'`);
        }
      }
    }
  }
}

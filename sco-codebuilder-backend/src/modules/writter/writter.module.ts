import { Module } from '@nestjs/common';
import { WritterController } from './writter.controller';
import { WritterService } from './writter.service';
import { WritterCronsService } from './writter.crons.service.ts.service';

@Module({
  controllers: [
    WritterController
  ],
  providers: [
    WritterService,
    WritterCronsService,
  ],
  exports: [
    WritterService,
    WritterCronsService,
  ]
})

export class WritterModule {}

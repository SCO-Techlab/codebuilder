import { InitWritterDto } from './dto/init-writter.dto';
import { WritterService } from './writter.service';
import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { WritterDto } from './dto/writter.dto';
import { httpErrorMessages } from 'src/constants/http-error-messages.constants';
import { Response } from 'express';
import { WritterConstants } from './constants/writter.constants';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { websocketEvents } from '../websocket/constants/websocket.events';

@Controller(`api/v1/writter`)
export class WritterController {

  constructor(
    private readonly writterService: WritterService,
    private readonly websocketsService: WebsocketGateway,
  ) {}

  async onModuleInit() {
    if (!await this.writterService.createServerFolder()) {
      throw new Error(httpErrorMessages.WRITTER.UNNABLE_CREATE_SERVER_FOLDER);
    }
  }

  @Post('writte')
  async writteValuesOnFiles(
    @Res() res: Response, 
    @Body() writter: WritterDto,
  ): Promise<Response<boolean, Record<string, boolean>>> {

    // Check if exists token/index.html
    const existHtmlFile: boolean = await this.writterService.existFile(
      writter.token, 
      `${WritterConstants.FILE_NAME}.${WritterConstants.FILE_EXTENSIONS.HTML}`
    );
    if (!existHtmlFile) {
      console.log(`[writte] Html file not found`);
      throw new HttpException(httpErrorMessages.WRITTER.HTML_FILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    
    // Write values in token/index.html
    const htmlFormated: string = await this.writterService.formatHtmlPage(writter.html);
    const writtedHtml: boolean = await this.writterService.writeFile(
      writter.token, 
      `${WritterConstants.FILE_NAME}.${WritterConstants.FILE_EXTENSIONS.HTML}`, 
      htmlFormated
    );
    if (!writtedHtml) {
      console.log(`[writte] Unnable to writte html file`);
      throw new HttpException(httpErrorMessages.WRITTER.UNNABLE_WRITTE_FILE, HttpStatus.CONFLICT);
    }

    // Check if exists token/index.css
    const existCssFil: boolean = await this.writterService.existFile(
      writter.token, 
      `${WritterConstants.FILE_NAME}.${WritterConstants.FILE_EXTENSIONS.CSS}`
    );
    if (!existCssFil) {
      console.log(`[writte] Css file not found`);
      throw new HttpException(httpErrorMessages.WRITTER.CSS_FILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Write values in token/index.css
    const writtedCss: boolean = await this.writterService.writeFile(
      writter.token, 
      `${WritterConstants.FILE_NAME}.${WritterConstants.FILE_EXTENSIONS.CSS}`, 
      writter.css
    );
    if (!writtedCss) {
      console.log(`[writte] Unnable to writte css file`);
      throw new HttpException(httpErrorMessages.WRITTER.UNNABLE_WRITTE_FILE, HttpStatus.CONFLICT);
    }

    // Check if exists token/index.js
    const existJsFile: boolean = await this.writterService.existFile(
      writter.token, 
      `${WritterConstants.FILE_NAME}.${WritterConstants.FILE_EXTENSIONS.JS}`
    );
    if (!existJsFile) {
      console.log(`[writte] Js file not found`);
      throw new HttpException(httpErrorMessages.WRITTER.JS_FILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Write values in token/index.js
    const jsFormated: string = await this.writterService.formatJavascriptPage(writter.js);
    const writtedJs: boolean = await this.writterService.writeFile(
      writter.token, 
      `${WritterConstants.FILE_NAME}.${WritterConstants.FILE_EXTENSIONS.JS}`, 
      jsFormated
    );
    if (!writtedJs) {
      console.log(`[writte] Unnable to writte js file`);
      throw new HttpException(httpErrorMessages.WRITTER.UNNABLE_WRITTE_FILE, HttpStatus.CONFLICT);
    }

    await this.websocketsService.notifyWebsockets(websocketEvents.WS_WRITTER);
    console.log(`[writte] Token '${writter.token}' files values updated successfully`);
    return res.status(200).json(true);
  }

  @Post("init")
  async initCLient(
    @Res() res: Response, 
    @Body() initWritter: InitWritterDto,
  ): Promise<Response<InitWritterDto, Record<string, InitWritterDto>>> {

    // Generate Init Writter Token (Folder name)
    initWritter.token = await this.writterService.generateInitWritterToken();
    
    // Create token folder
    const createdTokenFolder: boolean = await this.writterService.createTokenFolder(initWritter.token);
    if (!createdTokenFolder) {
      console.log(`[init] Unnable to create token folder`);
      throw new HttpException(httpErrorMessages.WRITTER.UNNABLE_CREATE_TOKEN_FOLDER, HttpStatus.CONFLICT);
    }

    // Create and write empty value in token/index.extensions
    const fileName: string = WritterConstants.FILE_NAME;
    const extensions: string[] = Object.values(WritterConstants.FILE_EXTENSIONS);
    for (const extension of extensions) {
      const createdFile: boolean = await this.writterService.writeFile(initWritter.token, `${fileName}.${extension}`);
      if (!createdFile) {
        console.log(`[init] Unnable to writte file ${fileName}.${extension}`);
        throw new HttpException(httpErrorMessages.WRITTER.UNNABLE_WRITTE_FILE, HttpStatus.CONFLICT);
      }
    }

    await this.websocketsService.notifyWebsockets(websocketEvents.WS_WRITTER);
    console.log(`[init] Token '${initWritter.token}' folder & files created successfully`);
    initWritter.result = true;
    return res.status(200).json(initWritter);
  }

  @Post("destroy")
  async destroyClient(
    @Res() res: Response, 
    @Body() initWritter: InitWritterDto,
  ): Promise<Response<boolean, Record<string, boolean>>> {

    // Check if exists folder with provided token
    const existTokenFolder: boolean = await this.writterService.existsTokenFolder(initWritter.token);
    if (!existTokenFolder) {
      console.log(`[destroyClient] Token folder not found`);
      throw new HttpException(httpErrorMessages.WRITTER.TOKEN_FOLDER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Delete folder provided token
    const deleteTokenFolder: boolean = await this.writterService.deleteTokenFolder(initWritter.token);
    if (!deleteTokenFolder) {
      console.log(`[destroyClient] Unnable to delete token folder`);
      throw new HttpException(httpErrorMessages.WRITTER.UNNABLE_DELETE_TOKEN_FOLDER, HttpStatus.CONFLICT);
    }

    await this.websocketsService.notifyWebsockets(websocketEvents.WS_WRITTER);
    console.log(`[destroyClient] Token '${initWritter.token}' folder deleted successfully`);
    return res.status(200).json(true);
  }
}
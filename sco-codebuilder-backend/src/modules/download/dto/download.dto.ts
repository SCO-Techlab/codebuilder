import { validationErrorMessages } from '../../../constants/validation-error-messages.constants';
import { IsNotEmpty, IsString } from "class-validator";

export class DownloadDto {
 
    @IsNotEmpty({ message: validationErrorMessages.DOWNLOAD.FILE_NAME.NOT_EMPTY })
    @IsString({ message: validationErrorMessages.DOWNLOAD.FILE_NAME.INVALID_VALUE })
    fileName: string;   
    
    @IsNotEmpty({ message: validationErrorMessages.DOWNLOAD.FILE_PATH.NOT_EMPTY })
    @IsString({ message: validationErrorMessages.DOWNLOAD.FILE_PATH.INVALID_VALUE })
    filePath: string;
    
    @IsNotEmpty({ message: validationErrorMessages.DOWNLOAD.FILE_TYPE.NOT_EMPTY })
    @IsString({ message: validationErrorMessages.DOWNLOAD.FILE_TYPE.INVALID_VALUE })
    fileType: string;
    
    @IsNotEmpty({ message: validationErrorMessages.DOWNLOAD.BASE64.NOT_EMPTY })
    @IsString({ message: validationErrorMessages.DOWNLOAD.BASE64.INVALID_VALUE })
    base64: string;
    
}
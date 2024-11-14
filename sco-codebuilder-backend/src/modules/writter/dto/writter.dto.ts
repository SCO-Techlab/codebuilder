import { validationErrorMessages } from './../../../constants/validation-error-messages.constants';
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class WritterDto {

    @IsNotEmpty({ message: validationErrorMessages.WRITTER.TOKEN.NOT_EMPTY })
    @IsString({ message: validationErrorMessages.WRITTER.TOKEN.INVALID_VALUE })
    token: string;
    
    @IsOptional()
    @IsString({ message: validationErrorMessages.WRITTER.HTML.INVALID_VALUE })
    html?: string;

    @IsOptional()
    @IsString({ message: validationErrorMessages.WRITTER.CSS.INVALID_VALUE })
    css?: string;

    @IsOptional()
    @IsString({ message: validationErrorMessages.WRITTER.JS.INVALID_VALUE })
    js?: string;
}
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.findProductImage(imageName);
    res.sendFile(path);
  }

  //the UploadedFile decorator is used to get the file from the request
  //the Express.Multer.File is the type of the file
  //the file is the file that is uploaded
  //the FileInterceptor is used to intercept the file and save it to the server
  //the fileFilter is used to filter the file in that function we can create different filters for different files
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 5, //5MB
      },
      storage: diskStorage({
        destination: './statics/uploads',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/products/${file.filename}`;
    return {
      secureUrl,
    };
  }
}

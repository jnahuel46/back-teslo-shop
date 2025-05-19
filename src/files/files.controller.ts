import {
  Controller,
  Post,
  UploadedFile,
  BadRequestException,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  @ApiOperation({ summary: 'Obtener imagen de producto' })
  @ApiParam({ name: 'imageName', description: 'Nombre de la imagen' })
  @ApiResponse({ status: 200, description: 'Imagen retornada.' })
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
  @ApiOperation({ summary: 'Subir imagen de producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
    },
    examples: {
      ejemplo: {
        summary: 'Example of image upload',
        value: {},
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida.' })
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

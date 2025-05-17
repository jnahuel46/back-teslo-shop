export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) callback(new Error('File is required'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${Date.now()}.${fileExtension}`;
  callback(null, fileName);
};

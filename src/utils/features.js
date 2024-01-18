import DataURIParser from "datauri/parser.js";

import Path from "path";

export const getDataUri = (file) => {
  const parser = new DataURIParser();
  const extName = Path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

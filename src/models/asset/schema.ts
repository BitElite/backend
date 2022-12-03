import * as mongoose from "mongoose";
import { globals } from "../../constants";
const assetSchema = {
  fileName: {
    type: String,
    required: true,
    index: true,
    maxlength: 100
  },
  fileType: {
    type: String,
    required: true,
    index: true,
    maxlength: 100
  },
  fileSize: {
    type: Number,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
    index: true,
    maxlength: 100
  },
  ipfs_cid: {
    type: String,
    required: true
  }
}

export const schema = assetSchema
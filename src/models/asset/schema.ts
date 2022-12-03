import * as mongoose from "mongoose";
import { globals } from "../../constants";
const assetSchema = {
  fileName: {
    type: String,
    required: false,
    index: true,
    maxlength: 100
  },
  fileType: {
    type: String,
    required: false,
    index: true,
    maxlength: 100
  },
  fileSize: {
    type: Number,
    required: false,
  },
  filePath: {
    type: String,
    required: false,
    index: true,
    maxlength: 100
  },
  fileOwners: {
    type: [String],
    required: false,
    index: true,
    maxlength: 100
  },
  ipfs_cid: {
    type: String,
    required: true
  },
  assetStatus: {
    type: String,
    enum: globals.ASSET_STATUS,
    default: globals.ASSET_STATUS[0]
  }
}

export const schema = assetSchema
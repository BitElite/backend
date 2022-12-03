import { Asset, AssetModel } from "../models/asset/asset.model";
import { ReadStream } from 'fs';


export default class AssetService {
    private asset: AssetModel;
    constructor(asset: AssetModel) {
        this.asset = asset;
    }

    createAsset(asset: Asset, files: Express.Multer.File[]) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(files);
                let file = files[0];
                let fileName = file.originalname;
                let fileType = file.mimetype;
                let fileSize = file.size;
                let filePath = file.path;
                let ipfs_cid = "abc";
                let newAsset = {
                    fileName,
                    fileType,
                    fileSize,
                    filePath,
                    ipfs_cid
                }

                let response = await this.asset.save(newAsset);
                
                console.log(JSON.stringify(response));
                
                resolve(response);
            } catch (e) {
                return reject(e);
            }
        })
    }

    readAsset(ipfs_cid: string) {

        return new Promise(async (resolve, reject) => {
            try {
                let asset = await this.asset.findOne({ ipfs_cid, deleted: false }, { deleted: 0 });
                if (!asset) {
                    return reject("Asset not found");
                }
                resolve(asset);
            } catch (e) {
                return reject(e);
            }
        })
    }
}
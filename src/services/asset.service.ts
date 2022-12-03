import { Asset, AssetModel } from "../models/asset/asset.model";
import { ReadStream } from 'fs';

import DedupService from "./dedup.service";
import getProofOfOwnership from "../utils/proofOfOwnership";

const rimraf = require("rimraf");

export default class AssetService {
    private asset: AssetModel;
    constructor(asset: AssetModel) {
        this.asset = asset;
    }

    createAsset(payload: any, files: Express.Multer.File[]) {
        return new Promise(async (resolve, reject) => {
            try {
                let file = files[0];
                let walletAddress = payload.walletAddress;
                let ipfsCid = payload.ipfsCid;
                let asset = await this.asset.findOne({ ipfs_cid: ipfsCid, deleted: false }, { deleted: 0 });

                if (!asset) {
                    // Initialize dedup service
                    let dedupService = new DedupService();
                    // check the price of the asset
                    let ipfsCid = payload.ipfsCid;

                    let priceResponse = await dedupService.getPrice(ipfsCid, file.size);

                    let fileName = file.originalname
                    let fileType = file.mimetype;
                    let fileSize = file.size;
                    let filePath = file.path;

                    await this.asset.save({ fileName, fileType, fileSize, filePath, ipfs_cid: ipfsCid })

                    return resolve(priceResponse);
                    // let fileName = file.originalname;
                    // let fileType = file.mimetype;
                    // let fileSize = file.size;
                    // let filePath = file.path;
                    // let ipfs_cid = payload.ipfs_cid;
                    // let fileOwners = asset.fileOwners;      
                    // // let fileOwners = asset.fileOwners;
                    // // if (!fileOwners.includes(walletAddress)) {
                    //     //     fileOwners.push(walletAddress);
                    //     //     await this.asset.updateOne({ ipfs_cid: ipfsCid, deleted: false }, { fileOwners });
                    //     // }

                    // let newAsset = {
                    //     fileName,
                    //     fileType,
                    //     fileSize,
                    //     filePath,
                    //     ipfs_cid,
                    //     fileOwners
                    // }
                    // let response = await this.asset.save(newAsset);

                } else {
                    // delete file from uploads folder
                    let path = file.path;
                    rimraf(path, (
                        err: any
                    ) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                    );
                    return resolve([])
                }
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

    updateAsset(ipfs_cid: string, payload: any) {
        return new Promise(async (resolve, reject) => {
            try {

                let asset = await this.asset.findOne({ ipfs_cid, deleted: false }, { deleted: 0 });
                if (!asset) {
                    return reject("Asset not found");
                }
                // now perform db update
                let response = await this.asset.updateOne({ ipfs_cid, deleted: false }, payload);

            } catch (e) {
                return reject(e);
            }
        })
    }

    getAssetPrice(assetProof: string, ipfsCid: string) {
        return new Promise(async (resolve, reject) => {
            try {

            } catch (e) {
                return reject(e);
            }
        })
    }

}
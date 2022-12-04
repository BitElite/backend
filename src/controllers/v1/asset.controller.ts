import { Request, Response, NextFunction } from "express";
import AssetService from "../../services/asset.service";
import { Asset, AssetModel } from "../../models/asset/asset.model";
import ethers from "ethers"
import DedupService from "../../services/dedup.service";
import Web3StorageService from "../../services/web3storage.service";
const path = require('path');
import * as fs from 'fs';
import { isNull } from "lodash";


const readAsset = async (req: Request, res: Response, next: NextFunction) => {
    let assetService = new AssetService(new AssetModel());
    try {
        let ipfs_cid = req.body.ipfs_cid;

        console.log(`ipfs_cid --> ${ipfs_cid}`)
        // check if asset exists in db
        let asset = await assetService.readAsset(ipfs_cid);

        return res.send({
            success: true,
            data: {
                asset
            }
        })

    } catch (e) {
        console.log(e);
        return next(e)
    }
}

const createAsset = async (req: any, res: Response, next: NextFunction) => {
    let assetService = new AssetService(new AssetModel());
    try {
        let payload = req.body
        const walletAddress = req.token.walletAddress;
        payload.walletAddress = walletAddress;
        console.log(payload)

        const files = req.files as Express.Multer.File[];

        let file = files[0]
        let filename = file.filename
        let absoluteFilePath = path.join(__dirname, '..', '..', '..', 'uploads', filename)

        let readable = fs.createReadStream(absoluteFilePath)

        payload.readable = readable

        let response = await assetService.createAsset(payload, req.files);

        return res.send({
            success: true,
            data: {
                response
            }
        })

    } catch (e) {
        console.log(e);
        return next(e)
    }
}

const verifyTransaction = async (req: any, res: Response, next: NextFunction) => {
    let assetService = new AssetService(new AssetModel());
    let dedupService = new DedupService()
    let web3storage = new Web3StorageService()

    try {
        let transactionHash = req.body.transactionHash

        let txReceipt: any = await dedupService.getTransactionReceipt(transactionHash)

        console.log(`tx Receipt --> ${JSON.stringify(txReceipt)}`)

        // TODO: complete verification of tx receipts

        // if(txReceipt.status === 1) {
        let walletAddress = req.token.walletAddress;
        console.log(`req body ${JSON.stringify(req.body)}`)
        let ipfsCid = req.body.ipfsCid;
        let asset: any = await assetService.readAsset(ipfsCid);

        let filePath
        let fileName
        if (!isNull(asset)) {
            console.log(`asset --> ${JSON.stringify(asset)}`)
            console.log(`asset --> ${JSON.stringify(asset)}`)
            filePath = asset.filePath
            fileName = asset.fileName
            let absoluteFilePath = path.join(__dirname, '..', '..', '..', filePath)
            console.log(`absoluteFilePath --> ${absoluteFilePath}`)

            let cid: any = await web3storage.put(absoluteFilePath)
            console.log(`cid --> ${cid}`)
            console.log(`ipfsCid --> ${ipfsCid}`)

            let fileOwners = asset.fileOwners;
            if (!fileOwners.includes(walletAddress)) {
                fileOwners.push(walletAddress);
                await assetService.updateAsset(ipfsCid, { fileOwners });
                // perform addOwner in dedup contract
                // change asset filesize from bytes to kb
                let fileSizeInKB = Math.floor(asset.fileSize / 1024);

                console.log(`fileSizeInKB --> ${fileSizeInKB}`)
                let addOwnerResponse = await dedupService.addOwner(cid, fileSizeInKB, walletAddress)

                return res.send({
                    success: true,
                    data: {
                        addOwnerResponse
                    }
                })
            }
            return res.send({
                success: true,
                data: {
                    message: "Asset verified"
                }
            })
        }
        return res.send({
            success: true,
            data: {
                txReceipt
            }
        })


    } catch (e) {
        console.log(e);
        return next(e)
    }
}

const getAssetPrice = async (req: any, res: Response, next: NextFunction) => {
    let assetService = new AssetService(new AssetModel());
    try {
        // let assetProof = req.params.assetProof;
        let ipfsCid = req.body.ipfsCid;
        let fileSize = req.body.fileSize;
        let asset: any = await assetService.getAssetPrice(ipfsCid, fileSize);
        if (isNull(asset)) {
            return res.send({
                success: false,
                data: {
                    message: "Asset does not exist"
                }
            })
        }

        let price = asset.price;
        return res.send({
            success: true,
            data: {
                price: asset
            }
        })

    } catch (e) {
        console.log(e);
        return next(e)
    }
}

export {
    readAsset,
    createAsset,
    verifyTransaction,
    getAssetPrice
}
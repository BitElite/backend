import { Request, Response, NextFunction } from "express";
import AssetService from "../../services/asset.service";
import { Asset, AssetModel } from "../../models/asset/asset.model";
import ethers from "ethers"
import DedupService from "../../services/dedup.service";
import Web3StorageService from "../../services/web3storage.service";
const path = require('path');
import * as fs from 'fs';


const readAsset = async (req: Request, res: Response, next: NextFunction) => {
    let assetService = new AssetService(new AssetModel());
    try {
        let ipfs_cid = req.params.ipfs_cid;

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
        let transactionHash = req.params.transactionHash

        let txReceipt: any = await dedupService.getTransactionReceipt(transactionHash)

        console.log(`tx Receipt --> ${JSON.stringify(txReceipt)}`)

        // TODO: complete verification of tx receipts

        if(txReceipt.status === 1) {
            let walletAddress = req.token.walletAddress;
            let ipfsCid = req.body.ipfsCid;
            let asset: any = await assetService.readAsset(ipfsCid);

            let filePath
            if(asset) {
                filePath = asset.filePath
                let cid = await web3storage.put(filePath)

                if(cid === ipfsCid) {
                    let fileOwners = asset.fileOwners;
                    if (!fileOwners.includes(walletAddress)) {
                        fileOwners.push(walletAddress);
                        await assetService.updateAsset(ipfsCid, { fileOwners });
                        // perform addOwner in dedup contract
                        let addOwnerResponse = await dedupService.addOwner(ipfsCid, asset.fileSize, walletAddress)

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
            }

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
        let assetProof = req.params.proof;
        let ipfsCid = req.params.ipfsCid;

        let asset: any = await assetService.getAssetPrice(assetProof, ipfsCid);
        if (!asset) {
            return res.status(404).send({
                success: false,
                message: "Asset not found"
            })
        }

        let price = asset.price;
        return res.send({
            success: true,
            data: {
                price
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
import { Request, Response, NextFunction } from "express";
import AssetService from "../../services/asset.service";
import { Asset, AssetModel } from "../../models/asset/asset.model";

const createAsset = async (req: Request, res: Response, next: NextFunction) => {
    let assetService = new AssetService(new AssetModel());
    try {
        let payload = req.body

        const files = req.files as Express.Multer.File[];
        let asset = await assetService.createAsset(payload, files);

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

const readAsset = async (req: Request, res: Response, next: NextFunction) => {
    let assetService = new AssetService(new AssetModel());
    try {
        let ipfs_cid = req.params.ipfs_cid;

        // check if asset exists in db
        let asset = await assetService.readAsset(ipfs_cid);
        if (!asset) {
            return res.status(404).send({
                success: false,
                message: "Asset not found"
            })

        }
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

export {
    createAsset,
    readAsset
}
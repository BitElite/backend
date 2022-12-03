import {schema} from './schema';
import * as mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
    schema, {
        timestamps: true
    }
);

export type Asset  = {
    _id?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    filePath?: string;
    fileOwners?: string[];
    ipfs_cid: string;
    deleted?: boolean | Date;
}

export  type Query = {
    _id?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    filePath?: string;
    ipfs_cid: string;
    deleted: boolean | Date;
}


export class AssetModel {
    private assetModel : mongoose.Model<any>;
    constructor() {
        this.assetModel = mongoose.model("Asset", AssetSchema);
    }

    save(asset: Asset): Promise<mongoose.Document>{
        const doc = new this.assetModel(asset);
        return  doc.save()
    }

    async findById(id: string, projection= {}, options: mongoose.QueryOptions = {}): Promise<mongoose.LeanDocument<Asset>>{
        return this.assetModel.findOne({_id: id},projection, options).lean();
    }

    async findOne(query:Query, projection= {}, options: mongoose.QueryOptions = {}): Promise<mongoose.LeanDocument<Asset>> {
        let q: mongoose.FilterQuery<any> = query;
        return this.assetModel.findOne(q, projection, options).lean();
    }

    async updateOne(query:Query, update: mongoose.UpdateQuery<any>, options: mongoose.QueryOptions = {}): Promise<mongoose.LeanDocument<Asset>>{
        let q: mongoose.FilterQuery<any> = query;
        return this.assetModel.findOneAndUpdate(q, update, options).lean();
    }
    async find(query: any, projection= {}, options: mongoose.QueryOptions = {}): Promise<mongoose.LeanDocumentOrArray<Asset[]>>{
        return this.assetModel.find(query,projection, options).lean()
    }
    async deleteOne(query: Query): Promise<any>{
        let q: mongoose.FilterQuery<any> = query;
        return this.assetModel.findOneAndUpdate(q, { $set: { deleted: new Date() }}).lean();
    }

}
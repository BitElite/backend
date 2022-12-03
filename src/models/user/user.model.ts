import {schema} from './schema';
import * as mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    schema, {
        timestamps: true
    }
);

export type User  = {
    _id?: string
    walletAddress:string;
    deleted?: boolean | Date
}

export type Query  = {
    _id?: string
    walletAddress:string;
    deleted: boolean | Date,
}


export class UserModel {
    private userModel : mongoose.Model<any>;
    constructor() {
        this.userModel = mongoose.model("User", UserSchema);
    }

    save(user: User): Promise<mongoose.Document>{
        const doc = new this.userModel(user);
        return  doc.save()
    }

    async findById(id: string, projection= {}, options: mongoose.QueryOptions = {}): Promise<mongoose.LeanDocument<User>>{
        return this.userModel.findOne({_id: id},projection, options).lean();
    }

    async findOne(query:Query, projection= {}, options: mongoose.QueryOptions = {}): Promise<mongoose.LeanDocument<User>> {
        let q: mongoose.FilterQuery<any> = query;
        return this.userModel.findOne(q, projection, options).lean();
    }

    async updateOne(query:Query, update: mongoose.UpdateQuery<any>, options: mongoose.QueryOptions = {}): Promise<mongoose.LeanDocument<User>>{
        let q: mongoose.FilterQuery<any> = query;
        return this.userModel.findOneAndUpdate(q, update, options).lean();
    }
    async find(query: any, projection= {}, options: mongoose.QueryOptions = {}): Promise<mongoose.LeanDocumentOrArray<User[]>>{
        return this.userModel.find(query,projection, options).lean()
    }
    async deleteOne(query: Query): Promise<any>{
        let q: mongoose.FilterQuery<any> = query;
        return this.userModel.findOneAndUpdate(q, { $set: { deleted: new Date() }}).lean();
    }

}
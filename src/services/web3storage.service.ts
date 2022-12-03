
//@ts-ignore
import { Web3Storage, getFilesFromPath } from 'web3.storage';

export default class Web3StorageService {
    storage: any;
    constructor() {
        this.storage = new Web3Storage({ token: process.env.WEB3_TOKEN })
    }

    async put(path:string) {
        const file = await getFilesFromPath(path)
        const cid = await this.storage.put(file)
        return cid;
    }
}
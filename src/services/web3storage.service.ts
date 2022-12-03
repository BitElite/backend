
//@ts-ignore
import { Web3Storage, getFilesFromPath } from 'web3.storage';

export default class Web3StorageService {
    storage: any;
    constructor() {
        this.storage = new Web3Storage({ token: process.env.WEB3_TOKEN })
    }

    put(path: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const file = await getFilesFromPath(path)
                const cid = await this.storage.put(file)
                return cid;
            } catch (e) {
                return reject(e);
            }
        })
    }

    get(ipfsCid: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const file = await this.storage.get(ipfsCid)
                return resolve(file)
            } catch (e) {
                return reject(e);
            }
        })
    }
}
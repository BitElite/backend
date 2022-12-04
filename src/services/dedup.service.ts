import { ethers } from "ethers";
import { format } from "winston";
import * as dedupABI from "../constants/abi/dedup.json"
import * as logger from "../commons/logger";

const privKey = process.env.ADMIN_PRIVATE_KEY;
const contractAddress = process.env.DEDUP_CONTRACT_ADDRESS;
const wallabyRpcProvider = process.env.WALLABY_RPC_PROVIDER

const provider = new ethers.providers.JsonRpcProvider(wallabyRpcProvider);
const signer = new ethers.Wallet(privKey, provider);


export default class DedupService {
    dedupContract: any

    constructor() {
        this.dedupContract = new ethers.Contract(contractAddress, dedupABI, signer)
        this.dedupContract.attach(signer);
    }

    async getPrice(CID: string, sizeInKB: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.dedupContract.getCurrentPrice(
                    CID,
                    sizeInKB
                )
                const formattedPrice = ethers.utils.formatEther(result.toNumber())
                return resolve(formattedPrice)
            } catch (e) {
                logger.error(`getPrice: error -> ${e}`);
                return reject(e);
            }
        })
    }

    async getTransactionReceipt(transactionHash: string) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(`tranasaction hash --> ${transactionHash}`)
                let txReceipt = await provider.waitForTransaction(transactionHash)
                return resolve(txReceipt)

            } catch (e) {
                logger.error(`getTransactionReceipt: error -> ${e}`);
                return reject(e);
            }

        })
    }

    async addOwner(CID: string, sizeInKB: number, owner: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.dedupContract.addOwner(
                    CID,
                    sizeInKB,
                    owner
                )
                return resolve(result)
            } catch (e) {
                logger.error(`getTransactionReceipt: error -> ${e}`);
                return reject(e);
            }
        })
    }
}
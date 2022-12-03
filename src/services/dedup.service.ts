import { ethers } from "ethers";
import { format } from "winston";
import * as dedupABI from "../constants/abi/dedup.json"

const privKey = process.env.ADMIN_PRIVATE_KEY;
const contractAddress = process.env.DEDUP_CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider("https://wallaby.node.glif.io/rpc/v0");
const signer = new ethers.Wallet(privKey, provider);


export default class DedupService {
    dedupContract: any
    
    constructor() {
        this.dedupContract = new ethers.Contract(contractAddress, dedupABI, signer)
        this.dedupContract.attach(signer);
    }

    async getPrice(CID:string, sizeInKB:number) { 
        const result = await this.dedupContract.getCurrentPrice(
            ethers.utils.formatBytes32String(CID),
            sizeInKB
        )
        const formattedPrice = ethers.utils.formatEther(result.toNumber())
        console.log(formattedPrice)
    }
}
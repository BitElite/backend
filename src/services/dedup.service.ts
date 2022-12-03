import { ethers } from "ethers";
import dedupABI from "../constants/abi/dedup.json"

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

    async getPrice() { 
        await this.dedupContract.getPrice("0x12345")
        console.log("Called get price")
    }
}
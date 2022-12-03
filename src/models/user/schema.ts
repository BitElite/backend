import * as mongoose from 'mongoose';

const userSchema = {
    walletAddress: {
        type: String,
        required: true,
        indexed: true,
    },
    deleted: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: false
    }
}

export const schema = userSchema;
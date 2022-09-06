import mongoose from "mongoose";

export function convertObjectId(arr: string[]) {
    if (arr.length > 0) {
        let result = arr.map(item => new mongoose.Types.ObjectId(item));

        return result;
    }
}
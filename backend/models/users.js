import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    noOfItemsOwned: {
        type: Number,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auctionItems'
    }],
    boughtAuctions : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auctionItems'
    }],
    betted : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auctionItems'
    }]
})
   
export const usersList = mongoose.model('users', userSchema);

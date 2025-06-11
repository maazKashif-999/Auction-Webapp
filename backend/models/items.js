import mongoose from "mongoose";

const auctionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startingPrice: {
        type: Number,
        required: true
    },
    startingTime: {
        type: Date,
        required:true
    },
    endingTime:{
        type:Date,
        required:true
    },
    currentPrice:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    topBidder:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    }

})
   
export const auctionList = mongoose.model('auctionItems', auctionSchema);

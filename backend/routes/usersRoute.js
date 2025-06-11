import express from "express";

import {usersList} from '../models/users.js'
import { auctionList } from "../models/items.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config.js";


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
  
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      req.user = decoded;
      next();
    });
  };

export const route = express.Router()

route.post('/login', async (req,res)=>{
    try {
        if (req.body.name == null || req.body.password == null){
            return res.status(400).json({ message: "Invalid data"})
        }
        const user = await usersList.findOne({userName: req.body.name}).populate('items')
        if (user && user.password == req.body.password){
            const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);
            return res.status(200).json({token});
        }
        return res.status(400).json({message:"Incorrect username or password"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message})
    }
})

route.post('/signup', async (req,res)=>{
    try {
        if (req.body.name == null || req.body.password == null){
            return res.status(400).json({ message: "Invalid data"})
        }
        const user = await usersList.findOne({userName: req.body.name})
        if (user ){
                return res.status(400).json({message:"User with this name already exist"})
        }
        await usersList.create({
            userName: req.body.name,
            password: req.body.password,
            noOfItemsOwned: 0
        })

        return res.status(200).json({message:"new user has been created"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message})
    }
})

route.get('/user', verifyToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const userData = await usersList.findById(userId).populate('items');
      const user = await usersList.findById(userId)
      let remove = []
      for (let i = 0;i< user.items.length;i++){
        let item = userData.items[i]
        const endingTime = new Date(userData.items[i].endingTime)
        if (item.status && endingTime < new Date() ){
          remove.push(item._id)
          item.status = false
          item.save()
          if (userId !== item.topBidder){
            const topBidder = await usersList.findById(item.topBidder)
            topBidder.betted.pull(item._id)
            topBidder.boughtAuctions.push(item._id)
            topBidder.noOfItemsOwned = topBidder.noOfItemsOwned + 1
            topBidder.save()
          }
        }
      }
      for (let i = 0;i< remove.length;i++){
        user.items.pull(remove[i])
      }
      remove = []
      for (let i = 0;i< user.betted.length;i++){
        let item = userData.betted[i]
        const endingTime = new Date(item.endingTime)
        if (item.status && endingTime < new Date()){
            remove.push(item._id)
            item.status = false
            item.save()
            const owner = await usersList.findById(item.owner)
            owner.items.pull(item._id)
            owner.save()
            user.boughtAuctions.push(item._id)
            user.noOfItemsOwned = user.noOfItemsOwned + 1
            
        }
      }
      for (let i = 0;i< remove.length;i++){
        user.betted.pull(remove[i])
      }
      user.save()
      const newuserData = await usersList.findById(userId).populate(['items','boughtAuctions'])
      console.log("haha",newuserData)
      return res.status(200).json(newuserData);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

route.post('/create',verifyToken,async(req,res)=>{
    try {
        if (req.body.title == null || req.body.description == null || req.body.startingPrice == null || req.body.startingDate == null || req.body.endingDate == null ){
            return res.status(400).json({message:"incorrect data"})
        }
        const startingTime = new Date(req.body.startingDate);
        const endingTime = new Date(req.body.endingDate);
        if (startingTime >= endingTime) {
            return res.status(400).json({ message: "Starting time must be less than ending time" });
        }
        const item = await auctionList.create({
            title: req.body.title,
            description: req.body.description,
            startingPrice: req.body.startingPrice,
            startingTime: req.body.startingDate,
            endingTime: req.body.endingDate,
            currentPrice: req.body.startingPrice,
            topBidder:req.user.userId,
            owner:req.user.userId,
            status: true
        })
        const user = await usersList.findById(req.user.userId)
        user.items.push(item._id)
        await user.save()
        return res.status(200).json(item.id);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
})

route.post('/browse',verifyToken,async(req,res)=>{
    if (req.body.title == null){
        return res.status(400).json({message: "incorrectData"})
    }
    const items = await auctionList.find({ title: { $regex: req.body.title, $options: "i" },status:true,owner : { $ne: req.user.userId }  });
    let remove = {}
    for (let i = 0; i < items.length; i++) {
        let item = items[i]
        const endingTime = new Date(item.endingTime)
        if (item.status && endingTime < new Date()){
            remove[item._id] = true
            item.status = false
            item.save()
            const owner = await usersList.findById(item.owner)
            if (owner.items){
                owner.items.pull(item._id)
                owner.save()
            }
           
            const winner= await usersList.findById(item.topBidder)
            if (winner._id !== owner._id){
                winner.betted.pull(item._id)
                winner.boughtAuctions.push(item._id)
                winner.noOfItemsOwned = winner.noOfItemsOwned + 1
                winner.save()
            } 
        }
        items.filter(item=>item.status)
    }
    return res.status(200).json(items)
})

route.get('/auction/:id',verifyToken,async(req,res)=>{
    const id = req.params.id
    try {
        const item = await auctionList.findById(id)
        return res.status(200).json(item)
    }
    catch{
        return res.status(500).json({message: "server error"})
    }
})

route.post('/auction/:id',verifyToken,async(req,res)=>{
    const id = req.params.id
    try {
        const item = await auctionList.findById(id)
        if (item.owner === req.user.userId){
            return res.status(400).json({message: "owner cannot place bid"})
        }
        if (item.currentPrice > req.body.amount){
            return res.status(400).json({message:"Place higher bid"})
        }
        const endingTime = new Date(item.endingTime)
        const currentTime = new Date()
        if (endingTime < currentTime ){
            return res.status(400).json({message:"Time Finished"})
        }
        item.currentPrice = req.body.amount
        const lastBidder = await usersList.findById(item.topBidder)
        lastBidder.betted.pull(item._id)
        await lastBidder.save()
        item.topBidder = req.user.userId
        const user = await usersList.findById(req.user.userId)
        user.betted.push(item._id)
        await user.save()
        await item.save()
        return res.status(200).json(item)
    }
    catch (err){
        return res.status(500).json({message: err})
    }
})


route.post('/pass',verifyToken,async(req,res)=>{
    try {
        if (req.body.oldPass == null || req.body.pass == null){
            return res.status(400).json({message:"Incorrect data"})
        }
        const user = await usersList.findById(req.user.userId)
        if (user.password !== req.body.oldPass){
            return res.status(400).json({message:"Old Password is incorrect"})
        }
        user.password = req.body.pass
        await user.save()
        return res.status(200).json({message:"Password changed successfully"})
    } catch (error) {
        return res.status(400).json({message:"An Error Occured"})
    }
    
})



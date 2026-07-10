import Payment from "../models/Payment.model.js"
import User from "../models/user.model.js"
import razorpay from "../services/razorpay.service.js"
import crypto from "crypto"

export const createOrder=async(req,res)=>{
try{
const {planId,amount,credits}=req.body
if(!amount || !credits){
    return res.status(400).json({message:"amount and credits are required"})
}
const options={
    amount:amount*100, //convert to paise
    currency:"INR",
    receipt:`receipt_${Date.now()}`,
}
const order=await razorpay.orders.create(options)
await Payment.create({userId:req.userId,planId,amount,credits,razorpayOrderId:order.id,status:"created"

})
return res.json(order)
}catch(error){
        return res.status(500).json({message: `failed to create order: ${error}`})
}
}

export const verifyPayment=async(req,res)=>{
    try{
        const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body
      const body=razorpay_order_id+"|"+razorpay_payment_id
      const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex")
      if(expectedSignature!==razorpay_signature){
        return res.status(400).json({message:"invalid signature"})
      }
      const payment=await Payment.findOne({razorpayOrderId:razorpay_order_id})
      if(!payment){
        return res.status(400).json({message:"payment not found"})
      }
      if(payment.status==="paid"){
        return res.status(400).json({message:"payment already verified"})
      }
      //update payment record
      payment.razorpayPaymentId=razorpay_payment_id
      payment.status="paid"
      await payment.save()
      //add credit to user
      const updateUser=await User.findByIdAndUpdate(payment.userId,{$inc:{credits:payment.credits}},{new:true})
      res.json({
        success:true,
        message:"payment verified and credits added",
        user:updateUser
      })
        
    }catch(error){
        return res.status(500).json({message: `failed to created Razorpay payment: ${error}`})
    }

}
import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({

  email:{
    type:String,
    required:true,
    lowercase:true,
    trim:true
  },

  productId:{
    type:String,
    required:true
  },

  variantId:{
    type:String,
    default:null
  },

  productName:{
    type:String,
    required:true
  },

  productImage:{
    type:String,
    default:""
  },

  productPrice:{
    type:Number,
    default:0
  },

  status:{
    type:String,
    enum:[
      "pending",
      "notified"
    ],
    default:"pending"
  },

  notifiedAt:{
    type:Date,
    default:null
  },

  createdAt:{
    type:Date,
    default:Date.now
  },

  updatedAt:{
    type:Date,
    default:Date.now
  }
});

SubscriberSchema.pre(
  "save",
  function(next){
    this.updatedAt =
    Date.now();
    next();
  }
);

SubscriberSchema.index({
  email:1,
  productId:1
});

const Subscriber =
mongoose.model(
  "Subscriber",
  SubscriberSchema
);

export default Subscriber;
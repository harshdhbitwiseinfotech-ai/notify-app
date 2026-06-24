import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({

  shopifyProductId:{
    type:String,
    required:true,
    unique:true
  },

  variantId:{
    type:String,
    default:null
  },

  title:{
    type:String,
    required:true
  },

  description:{
    type:String,
    default:""
  },

  image:{
    type:String,
    default:""
  },

  price:{
    type:Number,
    default:0
  },

  inventoryQuantity:{
    type:Number,
    default:0
  },

  status:{
    type:String,
    enum:[
      "in_stock",
      "out_of_stock"
    ],
    default:"out_of_stock"
  },

  notifyEnabled:{
    type:Boolean,
    default:true
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

ProductSchema.pre(
  "save",
  function(next){
    this.updatedAt =
    Date.now();
    next();
  }
);

const Product =
mongoose.model(
  "Product",
  ProductSchema
);

export default Product;
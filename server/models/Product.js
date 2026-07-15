import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    startingPrice: {
      type: Number,
      required: true,
    },

    currentPrice: {
      type: Number,
      default: 0,
    },

    auctionType: {
      type: String,
      enum: ["traditional", "reverse", "sealed"],
      default: "traditional",
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    auctionStart: {
    type: Date,
},

auctionEnd: {
    type: Date,
},

highestBid: {
    type: Number,
    default: 0,
},

highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default:null,
},
status:{
  type: String,
    enum: ["active", "closed"],
    default: "active",
},

winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
},

  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
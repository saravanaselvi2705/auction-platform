import Bid from "../models/Bid.js";
import Product from "../models/Product.js";
import { autoCloseExpiredAuctions } from "../utils/autoClose.js";

export const placeBid = async (req, res) => {
  try {
    await autoCloseExpiredAuctions();
    const { amount } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Seller cannot bid
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Seller cannot bid on own product",
      });
    }

    // Auction closed
    if (product.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Auction closed",
      });
    }

    // Bid validation
    if (amount <= product.highestBid) {
      return res.status(400).json({
        success: false,
        message: "Bid must be greater than current highest bid",
      });
    }

    // Save bid
    const bid = await Bid.create({
      product: product._id,
      bidder: req.user._id,
      amount,
    });

    // Update product
    product.highestBid = amount;
    product.highestBidder = req.user._id;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      bid,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBidHistory = async (req, res) => {
  try {

    const bids = await Bid.find({
      product: req.params.id,
    })
      .populate("bidder", "name email")
      .sort({ amount: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
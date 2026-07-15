import Product from "../models/Product.js";
import Bid from "../models/Bid.js";
import { autoCloseExpiredAuctions } from "../utils/autoClose.js";


export const sellerDashboard = async (req, res) => {
  try {
    await autoCloseExpiredAuctions();
    // Find all products created by the logged-in seller
    const products = await Product.find({
      seller: req.user._id,
    });

    const totalProducts = products.length;

    const activeAuctions = products.filter(
      (p) => p.status === "active"
    ).length;

    const closedAuctions = products.filter(
      (p) => p.status === "closed"
    ).length;

    let revenue = 0;

    products.forEach((product) => {
      if (product.status === "closed") {
        revenue += product.highestBid;
      }
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        activeAuctions,
        closedAuctions,
        revenue,
        products,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const buyerDashboard = async (req, res) => {
  try {
    await autoCloseExpiredAuctions();
    const bids = await Bid.find({
      bidder: req.user._id,
    }).populate("product");

    const totalBids = bids.length;

    const activeBids = bids.filter(
      (bid) => bid.product && bid.product.status === "active"
    ).length;

    const wonAuctions = bids.filter(
      (bid) =>
        bid.product &&
        bid.product.status === "closed" &&
        bid.product.winner &&
        bid.product.winner.toString() === req.user._id.toString()
    ).length;

    res.status(200).json({
      success: true,
      dashboard: {
        totalBids,
        activeBids,
        wonAuctions,
        bids,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
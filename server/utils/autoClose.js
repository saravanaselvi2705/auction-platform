import Product from "../models/Product.js";
import User from "../models/User.js";
import sendEmail from "./sendEmail.js";

export const autoCloseExpiredAuctions = async () => {
  try {
    const expiredProducts = await Product.find({
      status: "active",
      auctionEnd: { $lte: new Date() }
    });

    for (const product of expiredProducts) {
      product.status = "closed";
      product.winner = product.highestBidder;
      await product.save();

      if (product.highestBidder) {
        const winner = await User.findById(product.highestBidder);
        if (winner) {
          try {
            await sendEmail(
              winner.email,
              "Congratulations! You Won the Auction",
              `Congratulations ${winner.name},

You have won the auction.

Product: ${product.title}

Winning Bid: ₹${product.highestBid}

Thank you for participating.`
            );
          } catch (emailErr) {
            console.error(`Failed to send winning email to ${winner.email} for product ${product._id}:`, emailErr.message);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error in autoCloseExpiredAuctions:", err.message);
  }
};

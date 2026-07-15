import Product from "../models/Product.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      startingPrice,
      auctionType,
      image,
      images,
      auctionStart,
      auctionEnd,
    } = req.body;

    const product = await Product.create({
      seller: req.user._id,
      title,
      description,
      category,
      startingPrice,
      currentPrice: startingPrice,
      auctionType,
      image,
      images,
      auctionStart,
      auctionEnd,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name email");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get Single Product
export const getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)
      .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Product
export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // Only owner can update
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product Updated",
      product: updatedProduct,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete Product
export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // Only owner can delete
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const closeAuction = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Only seller can close auction
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (product.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Auction already closed",
      });
    }

    product.status = "closed";
    product.winner = product.highestBidder;

    await product.save();

    const winner = await User.findById(product.highestBidder);

if (winner) {
  await sendEmail(
    winner.email,
    "Congratulations! You Won the Auction",
    `Congratulations ${winner.name},

You have won the auction.

Product: ${product.title}

Winning Bid: ₹${product.highestBid}

Thank you for participating.`
  );
}

    res.status(200).json({
      success: true,
      message: "Auction closed successfully",
      winner: product.highestBidder,
      highestBid: product.highestBid,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
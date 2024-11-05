// controllers/WishlistController.js
const Wishlist = require('../Models/WishlistModel');

class WishlistController {
    static async getWishlist(req, res) {l
        const { userId } = req.body;

        try {
            const wishlist = await Wishlist.findOne({ userId }).populate('items.productId');
            if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
            res.json(wishlist);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async addItem(req, res) {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'User ID and Product ID are required.' });
        }

        try {
            let wishlist = await Wishlist.findOne({ userId });

            if (!wishlist) {
                wishlist = new Wishlist({ userId, items: [] });
            }

            const existingItem = wishlist.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                return res.status(400).json({ message: 'Item already in wishlist.' });
            }

            wishlist.items.push({ productId });
            await wishlist.save();
            res.status(201).json(wishlist);
        } catch (error) {
            console.error('Error adding item to wishlist:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    static async removeItem(req, res) {
        const { userId } = req.body;
        const { productId } = req.params;

        try {
            const wishlist = await Wishlist.findOneAndUpdate(
                { userId },
                { $pull: { items: { productId } } },
                { new: true }
            );

            if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
            res.json(wishlist);
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = WishlistController;

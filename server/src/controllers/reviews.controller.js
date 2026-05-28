import Reviews from '../models/review.model.js'

export const getAllReview = async (req, res) => {
    const id = req.query.id;

    try {
        const reviews = await Reviews.find({ listingId: id }).populate("author", "username image");

        return res.status(200).json({ reviews });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const addReview = async (req, res) => {
    const { listingId, comment, rating } = req.body;
    const author = req.userId;

    try {
        const review = await Reviews.create({
            listingId,
            author,
            rating,
            comment
        });

        await review.populate("author", "username image");

        return res.status(200).json({
            message: "Review added successfully!",
            review
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const editReview = async (req, res) => {
    const author = req.userId;
    const { reviewId, comment, rating } = req.body;

    try {
        const review = await Reviews.findOneAndUpdate(
            { _id: reviewId, author },
            { comment, rating },
            { new: true }
        ).populate("author", "username image");

        if (!review) {
            return res.status(400).json({ message: "Review not found!" });
        }

        return res.status(200).json({
            message: "Review updated successfully",
            review
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteReview = async (req, res) => {
    const reviewId = req.query.id;
    const author = req.userId;

    try {
        const review = await Reviews.findOneAndDelete({ _id: reviewId, author });

        if (!review) {
            return res.status(400).json({ message: "No review found!" });
        }

        return res.status(200).json({ message: "Review deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

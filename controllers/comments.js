const { Comment, Product } = require('../models'),
      { getPopulateQuery, CustomError } = require('../utils');

// GET: /api/v@/comments (Protected)
const getComments = async (req, res, next) => {
    try {
        const { userId, productId } = req.query;
        let condition = { };

        if ( userId && productId ) {
            condition = { user: userId, product: productId };
        } else if ( userId && !productId ) {
            condition = { user: userId };
        } else if ( !userId && productId ) {
            condition = { product: productId };
        }

        const query = getPopulateQuery(req.query, 'user', 'product');
        const comments = await Comment.find( condition )
                                      .populate( query )
                                      .lean();
                                      
        const status = comments.length > 0 ? 200 : 204;
        res.status( status ).json( comments );
    } catch (error) {
        next( error );
    }
};

// GET: /api/v@/comments/:id
const getComment = async (req, res, next) => {
    try {
        const query = getPopulateQuery(req.query, 'user', 'product');
        const { id: _id } = req.params;
      
        const comment = await Comment.findById( _id )
                                     .populate( query )
                                     .lean();
        if (!comment) {
            throw new CustomError('Could not found the comment', 404);
        }

        res.status( 200 ).json( comment );
    } catch (error) {
        next( error );
    }
};

// PATCH: /api/v@/comments/:id (Protected)
const editComment = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const { text } = req.body;

        const comment = await Comment.findById( _id )
                                     .populate( 'user' );
        if (!comment) {
            throw new CustomError('Could not found the comment', 404);
        }

        const currentUserRole = req.user.role.rank;
        const commentUserRole = comment.user.role.rank;

        // Reject if it's not the creater or lower role
        if ( req.user._id !== comment.user._id ||
             currentUserRole <= commentUserRole) {
            throw new CustomError('You are not allowd to manipulate this Comment!', 403);
        }

        comment.text = text;
        comment.lastEdit = new Date();
        // Is populated role saved as object instead of id?
        await comment.save();

        res.status( 200 ).json( comment );
    } catch (error) {
        next( error );
    }
};

// DELETE: /api/v@/comments/:id (Protected)
const deleteComment = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
    
        const comment = await Comment.findById( _id )
                                     .populate( 'user' );
        if (!comment) {
            throw new CustomError('Could not found the comment', 404);
        }
            
        const currentUserRole = req.user.role.rank;
        const commentUserRole = comment.user.role.rank;
    
        // Reject if it's not the creater or lower role
        if ( req.user._id !== comment.user._id ||
             currentUserRole <= commentUserRole) {
            throw new CustomError('You are not allowd to manipulate this Comment!', 403);
        }
    
        // Remove the comment id from the comments array prop on product.
        await Product.findOneAndUpdate({ _id: comment.product }, { $pull: { comments: _id }});
        await Comment.findByIdAndDelete( _id );
    
        res.status( 200 ).json({ message: 'The deleted successfully!' });
    } catch (error) {
        next( error );
    }
};

module.exports = {
  getComments,
  getComment,
  editComment,
  deleteComment
}

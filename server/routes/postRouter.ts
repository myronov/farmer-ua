import express from 'express';
import postCtrl from '../controllers/postCtrl';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/post', auth, postCtrl.createPost);

router.get('/home/posts', postCtrl.getHomePosts);

router.get('/posts/category/:id', postCtrl.getPostsByCategory);

router.get('/posts/user/:id', postCtrl.getPostsByUser);

router
  .route('/post/:id')
  .get(postCtrl.getPost)
  .put(auth, postCtrl.updatePost)
  .delete(auth, postCtrl.deletePost);

router.get('/search/posts', postCtrl.searchPosts);

export default router;

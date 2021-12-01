import { Request, Response } from 'express';
import Posts from '../models/postModel';
import Comments from '../models/commentModel';
import { IReqAuth } from '../config/interface';
import mongoose from 'mongoose';

const Pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;

  return { page, limit, skip };
};

const postCtrl = {
  createPost: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: 'Invalid Authentication.' });

    try {
      const { title, content, description, thumbnail, category } = req.body;

      const newPost = new Posts({
        user: req.user._id,
        title: title.toLowerCase(),
        content,
        description,
        thumbnail,
        category,
      });

      await newPost.save();
      res.json({
        ...newPost._doc,
        user: req.user,
      });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getHomePosts: async (req: Request, res: Response) => {
    try {
      const posts = await Posts.aggregate([
        // User
        {
          $lookup: {
            from: 'users',
            let: { user_id: '$user' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
              { $project: { password: 0 } },
            ],
            as: 'user',
          },
        },
        { $unwind: '$user' },
        // Category
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: '$category' },
        { $sort: { createdAt: -1 } },
        // Group by category
        {
          $group: {
            _id: '$category._id',
            name: { $first: '$category.name' },
            posts: { $push: '$$ROOT' },
            count: { $sum: 1 },
          },
        },
        // Posts pagination
        {
          $project: {
            posts: {
              $slice: ['$posts', 0, 4],
            },
            count: 1,
            name: 1,
          },
        },
      ]);

      res.json(posts);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPostsByCategory: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req);

    try {
      const Data = await Posts.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  category: mongoose.Types.ObjectId(req.params.id),
                },
              },
              // User
              {
                $lookup: {
                  from: 'users',
                  let: { user_id: '$user' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
                    { $project: { password: 0 } },
                  ],
                  as: 'user',
                },
              },
              // array -> object
              { $unwind: '$user' },
              // Sorting
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  category: mongoose.Types.ObjectId(req.params.id),
                },
              },
              { $count: 'count' },
            ],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);

      const posts = Data[0].totalData;
      const count = Data[0].count;

      // Pagination
      let total = 0;

      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }

      res.json({ posts, total });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPostsByUser: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req);

    try {
      const Data = await Posts.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  user: mongoose.Types.ObjectId(req.params.id),
                },
              },
              // User
              {
                $lookup: {
                  from: 'users',
                  let: { user_id: '$user' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
                    { $project: { password: 0 } },
                  ],
                  as: 'user',
                },
              },
              // array -> object
              { $unwind: '$user' },
              // Sorting
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  user: mongoose.Types.ObjectId(req.params.id),
                },
              },
              { $count: 'count' },
            ],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1,
          },
        },
      ]);

      const posts = Data[0].totalData;
      const count = Data[0].count;

      // Pagination
      let total = 0;

      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }

      res.json({ posts, total });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPost: async (req: Request, res: Response) => {
    try {
      const post = await Posts.findOne({ _id: req.params.id }).populate(
        'user',
        '-password'
      );

      if (!post) return res.status(400).json({ msg: 'Post does not exist.' });

      return res.json(post);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePost: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: 'Invalid Authentication.' });

    try {
      const post = await Posts.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        req.body
      );

      if (!post)
        return res.status(400).json({ msg: 'Invalid Authentication.' });

      res.json({ msg: 'Update Success!', post });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deletePost: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: 'Invalid Authentication.' });

    try {
      // Delete Post
      const post = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!post)
        return res.status(400).json({ msg: 'Invalid Authentication.' });

      // Delete Comments
      await Comments.deleteMany({ post_id: post._id });

      res.json({ msg: 'Delete Success!' });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Posts.aggregate([
        {
          $search: {
            index: 'searchTitle',
            autocomplete: {
              query: `${req.query.title}`,
              path: 'title',
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
          $project: {
            title: 1,
            description: 1,
            thumbnail: 1,
            createdAt: 1,
          },
        },
      ]);

      if (!posts.length)
        return res.status(400).json({ msg: 'Нічого не знайдено.' });

      res.json(posts);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default postCtrl;

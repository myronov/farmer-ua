import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { getPostsByCategoryId } from '../../redux/actions/postAction';

import { RootStore, IParams, IPost } from '../../utils/TypeScript';

import Loading from '../../components/global/Loading';
import Pagination from '../../components/global/Pagination';
import CardVert from '../../components/cards/CardVert';

const PostsByCategory = () => {
  const { categories, postsCategory } = useSelector(
    (state: RootStore) => state
  );
  const dispatch = useDispatch();
  const { slug } = useParams<IParams>();

  const [categoryId, setCategoryId] = useState('');
  const [posts, setPosts] = useState<IPost[]>();
  const [total, setTotal] = useState(0);

  const history = useHistory();
  const { search } = history.location;

  useEffect(() => {
    const category = categories.find((item) => item.name === slug);
    if (category) setCategoryId(category._id);
  }, [slug, categories]);

  useEffect(() => {
    if (!categoryId) return;

    if (postsCategory.every((item) => item.id !== categoryId)) {
      dispatch(getPostsByCategoryId(categoryId, search));
    } else {
      const data = postsCategory.find((item) => item.id === categoryId);
      if (!data) return;
      setPosts(data.posts);
      setTotal(data.total);

      if (data.search) history.push(data.search);
    }
  }, [categoryId, postsCategory, dispatch, search, history]);

  const handlePagination = (num: number) => {
    const search = `?page=${num}`;
    dispatch(getPostsByCategoryId(categoryId, search));
  };

  if (!posts) return <Loading />;
  return (
    <div className="posts_category">
      <div className="show_posts">
        {posts.map((post) => (
          <CardVert key={post._id} post={post} />
        ))}
      </div>

      {total > 1 && <Pagination total={total} callback={handlePagination} />}
    </div>
  );
};

export default PostsByCategory;

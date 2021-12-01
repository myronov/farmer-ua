import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { IParams, RootStore, IPost } from '../../utils/TypeScript';

import { getPostsByUserId } from '../../redux/actions/postAction';

import CardHoriz from '../cards/CardHoriz';
import Loading from '../global/Loading';
import Pagination from '../global/Pagination';

const UserPosts = () => {
  const { postsUser } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();
  const user_id = useParams<IParams>().slug;

  const [posts, setPosts] = useState<IPost[]>();
  const [total, setTotal] = useState(0);

  const history = useHistory();
  const { search } = history.location;

  useEffect(() => {
    if (!user_id) return;

    if (postsUser.every((item) => item.id !== user_id)) {
      dispatch(getPostsByUserId(user_id, search));
    } else {
      const data = postsUser.find((item) => item.id === user_id);
      if (!data) return;

      setPosts(data.posts);
      setTotal(data.total);
      if (data.search) history.push(data.search);
    }
  }, [user_id, postsUser, dispatch, search, history]);

  const handlePagination = (num: number) => {
    const search = `?page=${num}`;
    dispatch(getPostsByUserId(user_id, search));
  };

  if (!posts) return <Loading />;

  if (posts.length === 0 && total < 1)
    return <h3 className="text-center">Оголошень не знайдено</h3>;

  return (
    <div>
      <div>
        {posts.map((post) => (
          <CardHoriz key={post._id} post={post} />
        ))}
      </div>

      <div>
        <Pagination total={total} callback={handlePagination} />
      </div>
    </div>
  );
};

export default UserPosts;

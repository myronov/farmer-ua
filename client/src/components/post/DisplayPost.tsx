import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { IPost, RootStore, IUser, IComment } from '../../utils/TypeScript';

import Input from '../comments/Input';
import Comments from '../comments/Comments';
import Loading from '../global/Loading';
import Pagination from '../global/Pagination';

import { createComment, getComments } from '../../redux/actions/commentAction';

interface IProps {
  post: IPost;
}

const DisplayPost: React.FC<IProps> = ({ post }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth, comments } = useSelector((state: RootStore) => state);

  const [showComments, setShowComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleComment = (body: string) => {
    if (!auth.user || !auth.access_token) return;

    const data = {
      content: body,
      user: auth.user,
      post_id: post._id as string,
      post_user_id: (post.user as IUser)._id,
      replyCM: [],
      createdAt: new Date().toISOString(),
    };

    setShowComments([data, ...showComments]);
    dispatch(createComment(data, auth.access_token));
  };

  useEffect(() => {
    setShowComments(comments.data);
  }, [comments.data]);

  const fetchComments = useCallback(
    async (id: string, num = 1) => {
      setLoading(true);
      await dispatch(getComments(id, num));
      setLoading(false);
    },
    [dispatch]
  );

  useEffect(() => {
    if (!post._id) return;
    const num = history.location.search.slice(6) || 1;
    fetchComments(post._id, num);
  }, [post._id, fetchComments, history]);

  const handlePagination = (num: number) => {
    if (!post._id) return;
    fetchComments(post._id, num);
  };

  return (
    <div>
      <h2 className="text-center my-3 text-capitalize fs-1">{post.title}</h2>

      <div className="text-end fst-italic mb-3">
        <small>
          {typeof post.user !== 'string' && `Створено: ${post.user.name}`}
        </small>

        <small className="ms-2">
          {new Date(post.createdAt).toLocaleString()}
        </small>
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      />

      <hr className="my-1" />
      <h3 className="mt">Коментарі</h3>

      {auth.user ? (
        <Input callback={handleComment} />
      ) : (
        <h5>
          Будь-ласка <Link to={`/login?post/${post._id}`}>увійдіть</Link> щоб
          додати коментар.
        </h5>
      )}

      {loading ? (
        <Loading />
      ) : (
        showComments?.map((comment, index) => (
          <Comments key={index} comment={comment} />
        ))
      )}

      {comments.total > 1 && (
        <Pagination total={comments.total} callback={handlePagination} />
      )}
    </div>
  );
};

export default DisplayPost;

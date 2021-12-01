import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IParams, IPost, RootStore } from '../../utils/TypeScript';
import { getAPI } from '../../utils/FetchData';

import Loading from '../../components/global/Loading';
import { showErrMsg } from '../../components/alert/Alert';
import DisplayPost from '../../components/post/DisplayPost';

const DetailPost = () => {
  const id = useParams<IParams>().slug;
  const { socket } = useSelector((state: RootStore) => state);

  const [post, setPost] = useState<IPost>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    getAPI(`post/${id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data.msg);
        setLoading(false);
      });

    return () => setPost(undefined);
  }, [id]);

  // Join Room
  useEffect(() => {
    if (!id || !socket) return;
    socket.emit('joinRoom', id);

    return () => {
      socket.emit('outRoom', id);
    };
  }, [socket, id]);

  if (loading) return <Loading />;
  return (
    <div className="my-4">
      {error && showErrMsg(error)}

      {post && <DisplayPost post={post} />}
    </div>
  );
};

export default DetailPost;

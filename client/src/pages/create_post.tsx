import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { RootStore, IPost, IUser } from '../utils/TypeScript';
import { validCreatePost, shallowEqual } from '../utils/Valid';
import { getAPI } from '../utils/FetchData';

import NotFound from '../components/global/NotFound';
import CreateForm from '../components/cards/CreateForm';
import CardHoriz from '../components/cards/CardHoriz';

import ReactQuill from '../components/editor/ReactQuill';

import { ALERT } from '../redux/types/alertType';

import { createPost, updatePost } from '../redux/actions/postAction';

interface IProps {
  id?: string;
}
const CreatePost: React.FC<IProps> = ({ id }) => {
  const initState = {
    user: '',
    title: '',
    content: '',
    description: '',
    thumbnail: '',
    category: '',
    createdAt: new Date().toISOString(),
  };

  const [post, setPost] = useState<IPost>(initState);
  const [body, setBody] = useState('');

  const divRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');

  const { auth } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const [oldData, setOldData] = useState<IPost>(initState);

  const history = useHistory();

  useEffect(() => {
    if (!id) return;

    getAPI(`post/${id}`)
      .then((res) => {
        setPost(res.data);
        setBody(res.data.content);
        setOldData(res.data);
      })
      .catch((err) => console.log(err));

    const initData = {
      user: '',
      title: '',
      content: '',
      description: '',
      thumbnail: '',
      category: '',
      createdAt: new Date().toISOString(),
    };

    return () => {
      setPost(initData);
      setBody('');
      setOldData(initData);
    };
  }, [id]);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const text = div?.innerText as string;
    setText(text);
  }, [body]);

  const handleSubmit = async () => {
    if (!auth.access_token) return;

    const check = validCreatePost({ ...post, content: text });
    if (check.errLength !== 0) {
      return dispatch({ type: ALERT, payload: { errors: check.errMsg } });
    }

    let newData = { ...post, content: body };

    if (id) {
      if ((post.user as IUser)._id !== auth.user?._id)
        return dispatch({
          type: ALERT,
          payload: { errors: 'Invalid Authentication.' },
        });

      const result = shallowEqual(oldData, newData);
      if (result)
        return dispatch({
          type: ALERT,
          payload: { errors: 'The data does not change.' },
        });

      dispatch(updatePost(newData, auth.access_token));
      history.push('/');
    } else {
      dispatch(createPost(newData, auth.access_token));
      history.push('/');
    }
  };

  if (!auth.access_token) return <NotFound />;
  return (
    <div className="my-4 create_post">
      <div className="row mt-4">
        <div className="col-md-6">
          <h5>Нове оголошення</h5>
          <CreateForm post={post} setPost={setPost} />
        </div>

        <div className="col-md-6">
          <h5>Попередній перегляд</h5>
          <CardHoriz post={post} />
        </div>
      </div>

      <ReactQuill setBody={setBody} body={body} />

      <div
        ref={divRef}
        dangerouslySetInnerHTML={{
          __html: body,
        }}
        style={{ display: 'none' }}
      />

      <small>{text.length}</small>

      <button
        className="btn btn-dark mt-3 d-block mx-auto"
        onClick={handleSubmit}
      >
        {id ? 'Оновити оголошення' : 'Опублікувати оголошення'}
      </button>
    </div>
  );
};

export default CreatePost;

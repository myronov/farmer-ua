import { Dispatch } from 'redux';
import { IPost } from '../../utils/TypeScript';
import { imageUpload } from '../../utils/ImageUpload';
import { postAPI, getAPI, putAPI, deleteAPI } from '../../utils/FetchData';

import { ALERT, IAlertType } from '../types/alertType';

import {
  GET_HOME_POSTS,
  IGetHomePostsType,
  GET_POSTS_CATEGORY_ID,
  IGetPostsCategoryType,
  GET_POSTS_USER_ID,
  IGetPostsUserType,
  CREATE_POSTS_USER_ID,
  ICreatePostsUserType,
  DELETE_POSTS_USER_ID,
  IDeletePostsUserType,
} from '../types/postType';

import { checkTokenExp } from '../../utils/checkTokenExp';

export const createPost =
  (post: IPost, token: string) =>
  async (dispatch: Dispatch<IAlertType | ICreatePostsUserType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;

    let url;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      if (typeof post.thumbnail !== 'string') {
        const photo = await imageUpload(post.thumbnail);
        url = photo.url;
      } else {
        url = post.thumbnail;
      }

      const newPost = { ...post, thumbnail: url };

      const res = await postAPI('post', newPost, access_token);

      dispatch({
        type: CREATE_POSTS_USER_ID,
        payload: res.data,
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getHomePosts =
  () => async (dispatch: Dispatch<IAlertType | IGetHomePostsType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI('home/posts');

      dispatch({
        type: GET_HOME_POSTS,
        payload: res.data,
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getPostsByCategoryId =
  (id: string, search: string) =>
  async (dispatch: Dispatch<IAlertType | IGetPostsCategoryType>) => {
    try {
      let limit = 8;
      let value = search ? search : `?page=${1}`;

      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI(`posts/category/${id}${value}&limit=${limit}`);

      dispatch({
        type: GET_POSTS_CATEGORY_ID,
        payload: { ...res.data, id, search },
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const getPostsByUserId =
  (id: string, search: string) =>
  async (dispatch: Dispatch<IAlertType | IGetPostsUserType>) => {
    try {
      let limit = 3;
      let value = search ? search : `?page=${1}`;

      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI(`posts/user/${id}${value}&limit=${limit}`);

      dispatch({
        type: GET_POSTS_USER_ID,
        payload: { ...res.data, id, search },
      });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const updatePost =
  (post: IPost, token: string) => async (dispatch: Dispatch<IAlertType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    let url;
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      if (typeof post.thumbnail !== 'string') {
        const photo = await imageUpload(post.thumbnail);
        url = photo.url;
      } else {
        url = post.thumbnail;
      }

      const newPost = { ...post, thumbnail: url };

      const res = await putAPI(`post/${newPost._id}`, newPost, access_token);

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

export const deletePost =
  (post: IPost, token: string) =>
  async (dispatch: Dispatch<IAlertType | IDeletePostsUserType>) => {
    const result = await checkTokenExp(token, dispatch);
    const access_token = result ? result : token;
    try {
      dispatch({
        type: DELETE_POSTS_USER_ID,
        payload: post,
      });

      await deleteAPI(`post/${post._id}`, access_token);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

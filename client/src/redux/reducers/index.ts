import { combineReducers } from 'redux';
import auth from './authReducer';
import alert from './alertReducer';
import categories from './categoryReducer';
import homePosts from './homePostsReducer';
import postsCategory from './postsCategoryReducer';
import otherInfo from './otherInfoReducer';
import postsUser from './postsUserReducer';
import comments from './commentReducer';
import socket from './socketReducer';

export default combineReducers({
  auth,
  alert,
  categories,
  homePosts,
  postsCategory,
  otherInfo,
  postsUser,
  comments,
  socket,
});

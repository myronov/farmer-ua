import { IUser } from '../../utils/TypeScript';

import {
  IPostsUser,
  GET_POSTS_USER_ID,
  CREATE_POSTS_USER_ID,
  DELETE_POSTS_USER_ID,
  IPostUserType,
} from '../types/postType';

const postsUserReducer = (
  state: IPostsUser[] = [],
  action: IPostUserType
): IPostsUser[] => {
  switch (action.type) {
    case GET_POSTS_USER_ID:
      if (state.every((item) => item.id !== action.payload.id)) {
        return [...state, action.payload];
      } else {
        return state.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      }

    case CREATE_POSTS_USER_ID:
      return state.map((item) =>
        item.id === (action.payload.user as IUser)._id
          ? {
              ...item,
              posts: [action.payload, ...item.posts],
            }
          : item
      );

    case DELETE_POSTS_USER_ID:
      return state.map((item) =>
        item.id === (action.payload.user as IUser)._id
          ? {
              ...item,
              posts: item.posts.filter(
                (post) => post._id !== action.payload._id
              ),
            }
          : item
      );
    default:
      return state;
  }
};

export default postsUserReducer;

import {
  GET_POSTS_CATEGORY_ID,
  IPostsCategory,
  IGetPostsCategoryType,
} from '../types/postType';

const postsCategoryReducer = (
  state: IPostsCategory[] = [],
  action: IGetPostsCategoryType
): IPostsCategory[] => {
  switch (action.type) {
    case GET_POSTS_CATEGORY_ID:
      if (state.every((item) => item.id !== action.payload.id)) {
        return [...state, action.payload];
      } else {
        return state.map((post) =>
          post.id === action.payload.id ? action.payload : post
        );
      }

    default:
      return state;
  }
};

export default postsCategoryReducer;

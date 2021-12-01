import React from 'react';
import { useSelector } from 'react-redux';

import { RootStore, IPost, InputChange } from '../../utils/TypeScript';

interface IProps {
  post: IPost;
  setPost: (post: IPost) => void;
}

const CreateForm: React.FC<IProps> = ({ post, setPost }) => {
  const { categories } = useSelector((state: RootStore) => state);

  const handleChangeInput = (e: InputChange) => {
    const { value, name } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleChangeThumbnail = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      const file = files[0];
      setPost({ ...post, thumbnail: file });
    }
  };

  return (
    <form>
      <div className="form-group position-relative">
        <input
          type="text"
          className="form-control"
          value={post.title}
          name="title"
          onChange={handleChangeInput}
        />

        <small
          className="text-muted position-absolute"
          style={{ bottom: 0, right: '3px', opacity: '0.3' }}
        >
          {post.title.length}/50
        </small>
      </div>

      <div className="form-group my-3">
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleChangeThumbnail}
        />
      </div>

      <div className="form-group position-relative">
        <textarea
          className="form-control"
          rows={4}
          value={post.description}
          style={{ resize: 'none' }}
          name="description"
          onChange={handleChangeInput}
        />

        <small
          className="text-muted position-absolute"
          style={{ bottom: 0, right: '3px', opacity: '0.3' }}
        >
          {post.description.length}/200
        </small>
      </div>

      <div className="form-group my-3">
        <select
          className="form-control text-capitalize"
          value={post.category}
          name="category"
          onChange={handleChangeInput}
        >
          <option value="">Оберіть категорію</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default CreateForm;

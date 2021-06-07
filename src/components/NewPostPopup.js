import { FaPlus, FaImage } from "react-icons/fa";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as AC from "../redux/AC";

const NewPostPopup = ({
  s,
  togglePopup,
  uploadPhoto,
  // error,
  // isPhotoUploading,
}) => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const onKeyDownHandler = (e) => {
      if (e.key === "Escape") {
        togglePopup();
      }
    };
    document.addEventListener("keydown", onKeyDownHandler);

    return () => document.removeEventListener("keydown", onKeyDownHandler);
  }, []);

  const handlePhotoChange = (e) => {
    setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    setPhoto(e.target.files[0]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photo) return;
    uploadPhoto({
      photo,
      description,
    });
    setTimeout(() => togglePopup(), 1000);
  };

  return (
    <div className={s.overlay} onClick={togglePopup}>
      <section onClick={(e) => e.stopPropagation()} className={s.NewPost}>
        <>
          <form onSubmit={handleSubmit}>
            <label
              className={s.label}
              htmlFor="file"
              aria-label="Choose a photo from your device"
            >
              <FaPlus />
              <FaImage />
              Choose a Photo
            </label>
            <input
              className={s.fileInput}
              multiple={false}
              id="file"
              accept="image/*"
              type="file"
              onChange={(e) => handlePhotoChange(e)}
            />
            <textarea
              className={s.descriptionInput}
              placeholder="Description..."
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <button className={s.post}>Post</button>
              <button
                className={s.cancel}
                onClick={togglePopup}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    togglePopup();
                  }
                }}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
          {photoPreview && (
            <img className={s.image} src={photoPreview} alt="description" />
          )}
        </>
      </section>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  uploadPhoto: ({ photo, description }) => {
    return dispatch(AC.uploadPhoto({ photo, description }));
  },
});
// const mapStateToProps = (state) => ({
//   isPhotoUploading: state.photoUploading.isPhotoUploading,
//   error: state.photoUploading.error,
// });

export default connect(null, mapDispatchToProps)(NewPostPopup);

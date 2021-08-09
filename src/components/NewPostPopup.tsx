import { FaPlus, FaImage } from 'react-icons/fa'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { uploadPhoto } from '../redux/AC'
import { AppDispatch } from '../redux/store'

type Props = {
  s: any
  togglePopup: () => void
  uploadPhoto: Function | undefined
}

const NewPostPopup = ({ s, togglePopup, uploadPhoto }: Props) => {
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')

  useEffect(() => {
    const onKeyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        togglePopup()
      }
    }
    document.addEventListener('keydown', onKeyDownHandler)

    return () => document.removeEventListener('keydown', onKeyDownHandler)
  }, [])

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhotoPreview(URL.createObjectURL(e.target.files![0]))
    setPhoto(e.target.files![0])
  }
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!photo) return
    setTimeout(() => togglePopup(), 1000)
    if (uploadPhoto) {
      return uploadPhoto({
        photo,
        description,
      })
    }
  }

  return (
    <div className={s.overlay} onClick={togglePopup}>
      <section onClick={(e) => e.stopPropagation()} className={s.NewPost}>
        <>
          <form onSubmit={handleSubmit}>
            <label
              className={s.label}
              htmlFor="file"
              aria-label="Choose a photo from your device">
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <button className={s.post}>Post</button>
              <button
                className={s.cancel}
                onClick={togglePopup}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    togglePopup()
                  }
                }}
                type="button">
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
  )
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  uploadPhoto: ({ photo, description }: TPhoto) => {
    return dispatch(uploadPhoto({ photo, description }))
  },
})
// const mapStateToProps = (state) => ({
//   isPhotoUploading: state.photoUploading.isPhotoUploading,
//   error: state.photoUploading.error,
// });

export default connect(null, mapDispatchToProps)(NewPostPopup)

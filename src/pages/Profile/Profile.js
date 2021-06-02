import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import * as AC from '../../redux/AC';
import Header from './Header';
import Photos from './Photos';
import s from './Profile.module.scss';
import { NewPostPopup } from './NewPostPopup';
import PostInfoPopup from './PostInfoPopup';

const Profile = ({
  deleteTargetUser,
  setTargetUserListenerByName,
  setTargetPostId,
}) => {
  const { userId: userName } = useParams();
  const [isNewPostPopupOpen, setIsNewPostPopupOpen] = useState(false);
  const [isPostInfoPopupOpen, setIsPostInfoPopupOpen] = useState(false);

  const toggleNewPostPopup = () => {
    setIsNewPostPopupOpen((state) => !state);
  };
  const togglePostInfoPopup = (postId) => {
    if (postId) {
      setTargetPostId(postId);
    }
    setIsPostInfoPopupOpen((state) => !state);
  };

  useEffect(() => {
    document.title = `${userName} - Instagram`;
  }, []);

  useEffect(() => {
    let listener;
    setTargetUserListenerByName(userName).then((res) => (listener = res));

    return () => {
      deleteTargetUser();
      listener();
    };
  }, [userName]);

  return (
    <>
      {isNewPostPopupOpen && (
        <NewPostPopup toggleNewPostPopup={toggleNewPostPopup} s={s} />
      )}
      {isPostInfoPopupOpen && (
        <PostInfoPopup togglePostInfoPopup={togglePostInfoPopup} s={s} />
      )}
      <main className={`container ${s.container}`}>
        <Header toggleNewPostPopup={toggleNewPostPopup} s={s} />
        <Photos togglePostInfoPopup={togglePostInfoPopup} s={s} />
      </main>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  deleteTargetUser: () => {
    dispatch(AC.setTargetUser(null));
  },
  setTargetUserListenerByName: (name) => {
    return dispatch(AC.setTargetUserListenerByName(name));
  },
  setTargetPostId: (id) => {
    dispatch(AC.setTargetPostId(id));
  },
});

export default connect(null, mapDispatchToProps)(Profile);

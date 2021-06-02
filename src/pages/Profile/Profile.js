import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import * as AC from '../../redux/AC';
import Header from './Header';
import Photos from './Photos';
import s from './Profile.module.scss';

const Profile = ({
  deleteTargetUser,
  setTargetUserListenerByName,
  toggleNewPostPopup,
  togglePostInfoPopup,
}) => {
  const { userId: userName } = useParams();

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
});

export default connect(null, mapDispatchToProps)(Profile);

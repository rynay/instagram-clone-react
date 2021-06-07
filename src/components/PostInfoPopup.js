import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Post from "./Post";

const PostInfoPopup = ({ s, targetUser }) => {
  const [targetPostInfo, setTargetPostInfo] = useState(null);
  const { postId } = useParams();
  const history = useHistory();
  useEffect(() => {
    if (!targetUser || !targetUser.photos) return;
    setTargetPostInfo(targetUser.photos.find((post) => post.photoId == postId));
  }, [targetUser]);
  useEffect(() => {
    const onKeyDownHandler = (e) => {
      if (e.key === "Escape") {
        history.goBack();
      }
    };
    document.addEventListener("keydown", onKeyDownHandler);
    return () => document.removeEventListener("keydown", onKeyDownHandler);
  }, []);
  return (
    <div onClick={() => history.goBack()} className={s.overlay}>
      <section
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={s.PostInfo}
      >
        <Post poppedUp post={targetPostInfo} />
      </section>
    </div>
  );
};

const mapStateToProps = (state) => ({
  targetUser: state?.targetUser,
});

export default connect(mapStateToProps)(PostInfoPopup);

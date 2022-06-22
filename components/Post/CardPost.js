import React, { useState } from "react";
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Grid,
  Button,
  Popup,
  Header,
  Modal
} from "semantic-ui-react";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputField";
import calculateTime from "../../utils/calculateTime";
import Link from "next/link";
import { deletePost, likePost } from "../../utils/postActions";
import LikesList from "./LikesList";
import ImageModal from "./ImageModal";
import NoImageModal from "./NoImageModal";


function CardPost({ post, user, setPosts, setShowToastr, socket }) {
  const [likes, setLikes] = useState(post.likes);

  const isLiked =
    likes.length > 0 && likes.filter(like => like.user === user._id).length > 0;

  const [comments, setComments] = useState(post.comments);

  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const addPropsToModal = () => ({
    post,
    user,
    setLikes,
    likes,
    isLiked,
    comments,
    setComments
  });

  return (
    <>
      {showModal && (
        <div style={{marginLeft:"120px"}}>
        <Modal 
          open={showModal}
          closeIcon
          closeOnDimmerClick
          onClose={() => setShowModal(false)}
        >
          <Modal.Content>
            {post.picUrl ? (
              <ImageModal {...addPropsToModal()} />
            ) : (
              <NoImageModal {...addPropsToModal()} />
            )}
          </Modal.Content>
        </Modal>
        </div>
      )}

      <Segment basic>
      <Card color="teal" fluid className="posts" 
        style={{width:"100%" , height:"450px"}}
        >
          {post.picUrl && (
            <Image 
              src={post.picUrl}
              style={{ cursor: "pointer" , width:"100%",height:"150px" ,objectFit:"cover" }}
              floated="left"
              
              ui={false}
              alt="PostImage"
              onClick={() => setShowModal(true)}
            />
          )}

          <Card.Content>
            <Image floated="left" src={post.user.profilePicUrl} avatar circular />

            {(user.role === "root" || post.user._id === user._id) && (
              <>
                <Popup
                  on="click"
                  position="top right"
                  trigger={
                    <Image
                      src="/deleteIcon.svg"
                      style={{ cursor: "pointer" }}
                      size="mini"
                      className="del"
                      floated="right"
                    />
                  }
                >
                  <Header as="h4" content="Are you sure?" />
                  <p>This action is irreversible!</p>

                  <Button
                    color="red"
                    className="ml-4"
                    icon="trash"
                    content="Delete"
                    onClick={() => deletePost(post._id, setPosts, setShowToastr)}
                  />
                </Popup>
              </>
            )}

            <Card.Header>
              <Link href={`/${post.user.username}`}>
                <a>{post.user.name}</a>
              </Link>
            </Card.Header>

            <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

            {post.location && <Card.Meta content={post.location} />}

            <Card.Description
              style={{
                fontSize: "17px",
                letterSpacing: "0.1px",
                wordSpacing: "0.35px", textTransform:"capitalize"
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>

          <Card.Content style={{marginTop:"2px"}}>
            <Icon
              name={isLiked ? "heart" : "heart outline"}
              color="red"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (socket.current) {
                  socket.current.emit("likePost", {
                    postId: post._id,
                    userId: user._id,
                    like: isLiked ? false : true
                  });

                  socket.current.on("postLiked", () => {
                    if (isLiked) {
                      setLikes(prev => prev.filter(like => like.user !== user._id));
                    }
                    //
                    else {
                      setLikes(prev => [...prev, { user: user._id }]);
                    }
                  });
                } else {
                  likePost(post._id, user._id, setLikes, isLiked ? false : true);
                }
              }}
            />

            <LikesList
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">
                    {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
                  </span>
                )
              }
            />

            <Icon name="comment outline" style={{ marginLeft: "7px" }} color="blue" />

            {comments.length > 0 &&
              comments.map(
                (comment, i) =>
                  i < 0 && (
                    <PostComments
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  )
              )}
              <br />

            {comments.length > 0 && (
              <Button
                content="View Comments"
                color="orange"
                basic
                circular
                onClick={() => setShowModal(true)}
              />
            )}

            <Divider hidden />

            <CommentInputField user={user} postId={post._id} setComments={setComments} />
          </Card.Content>
        </Card>
        
      </Segment>
      <Divider hidden />
    </>
  );
}

export default CardPost;

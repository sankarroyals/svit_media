import React, { useState, useRef } from "react";
import { Form, Button, Image, Divider, Message, Icon } from "semantic-ui-react";
import uploadPic from "../../utils/uploadPicToCloudinary";
import { submitNewPost } from "../../utils/postActions";
import CropImageModal from "./CropImageModal";

function CreatePost({ user, setPosts }) {
  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === "media") {
      if (files && files.length > 0) {
        setMedia(files[0]);
        setMediaPreview(URL.createObjectURL(files[0]));
      }
    }

    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const addStyles = () => ({
    textAlign: "center",
    height: "150px",
    width: "150px",
    border: "dotted",
   
    paddingTop: media === null && "60px",
    cursor: "pointer",
    borderColor: highlighted ? "green" : "black"
  });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError("Error Uploading Image");
      }
    }

    await submitNewPost(
      newPost.text,
      newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    mediaPreview && URL.revokeObjectURL(mediaPreview);
    setTimeout(() => setMediaPreview(null), 3000);
    setLoading(false);
  };

  return (
    <>
      {showModal && (
        <CropImageModal
          mediaPreview={mediaPreview}
          setMedia={setMedia}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}

      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops!"
        />

        <Form.Group>
          <Image src={user.profilePicUrl} circular avatar inline />
          <Form.TextArea
          className="mb-4"
            placeholder="Whats Happening"
            name="text"
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>

        <Form.Group>
          <Form.Input
          className="smallH"
          style={{}}
            value={newPost.location}
            name="location"
            onChange={handleChange}
            
            icon="map marker alternate"
            placeholder="Want to add Location?"
          />

          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: "none" }}
            type="file"
            accept="image/*"
          />
        </Form.Group>

        <div 
          onClick={() => inputRef.current.click()}
          className="smallH"
          style={addStyles()}
          onDragOver={e => {
            e.preventDefault();
            setHighlighted(true);
          }}
          onDragLeave={e => {
            e.preventDefault();
            setHighlighted(false);
          }}
          onDrop={e => {
            e.preventDefault();
            setHighlighted(true);

            const droppedFile = Array.from(e.dataTransfer.files);

            setMedia(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }}
        >
          {media === null ? (
            <Icon name="plus" size="big"  />
          ) : (
            <Image className="ml-4"
              style={{ height: "150px", width: "150px" }}
              src={mediaPreview}
              alt="PostImage"
              centered
              size="medium"
            />
          )}
        </div>

        {mediaPreview !== null && (
          <>
            <Divider hidden />

            <Button
              className="smallH"
              content="Crop Image"
              type="button"
              primary
              circular
              onClick={() => setShowModal(true)}
            />
          </>
        )}

        <Divider hidden />

        <Button 
          circular
          disabled={newPost.text === "" || loading}
          content={<strong>Post</strong>}
          style={{ backgroundColor: "#1DA1F2", color: "white" }} 
          className="smallH"
          icon="send"
          loading={loading}
        />
      </Form>
      <Divider />
    </>
  );
}

export default CreatePost;

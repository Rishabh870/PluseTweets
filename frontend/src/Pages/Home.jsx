import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import styled from "styled-components";
import TweetCard from "../Components/TweetCard";
import requestMethod from "../requestMethod";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// Left Component
const LeftSection = styled.div`
  /* background-color: #f2f2f2; */
  border-right: 2px solid #f3f3f3;
  /* padding: 16px; */
  max-width: 15rem;
  height: 100%;
  font-family: "Open Sans", sans-serif;
  flex: 0 0 290px; /* Set a fixed width for the left section */
`;

const Title = styled.h5`
  display: flex;
  font-weight: bold;
  font-size: 1.5rem;
  align-items: center;
`;

const TweetBtn = styled.button`
  padding: 0.3rem 3rem;
`;

// Right Component
const RightSection = styled.div`
  padding: 16px;
  height: 100%;
  font-family: "Open Sans", sans-serif;
  border-right: 2px solid #f3f3f3;
  flex: 1; /* Allow the right section to occupy remaining space */
  overflow-y: auto; /* Enable vertical scrolling for the right section */

  /* Scrollbar Styles */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #f8f9fa #dee2e6; /* Firefox */
  -ms-overflow-style: none; /* Hide scrollbar in IE and Edge */
  &::-webkit-scrollbar {
    width: 8px; /* Chrome, Safari, and Opera */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #adb5bd; /* Color of the thumb */
    border-radius: 4px; /* Border radius of the thumb */
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #6c757d; /* Color of the thumb on hover */
  }
  &::-webkit-scrollbar-track {
    background-color: #dee2e6; /* Color of the track */
    border-radius: 4px; /* Border radius of the track */
    margin-right: -8px; /* Adjust for the border width */
  }
`;

const Home = () => {
  const currentUser = localStorage.getItem("token");
  if (currentUser === null || currentUser === undefined) {
    window.location.href = "/login";
  }
  // State variables
  const [tweets, setTweets] = useState([]); // Array to store tweets
  const [showModal, setShowModal] = useState(false); // Boolean to control modal visibility
  const [textareaValue, setTextareaValue] = useState(""); // State to store textarea value
  const [update, setUpdate] = useState(false); // A flag to trigger tweet update (could be removed if not used)
  const [previewImage, setPreviewImage] = useState(null); // State to store the preview image URL
  const [isLoaded, setIsLoaded] = useState(false); // Boolean to track if tweets are loaded

  // Function to handle posting a new tweet
  const handlePost = async () => {
    try {
      // Create a new FormData object to send the tweet data
      const formData = new FormData();
      if (!textareaValue) {
        alert("Please Enter the Tweet."); // Alert the user if the tweet content is empty
        return;
      }
      formData.append("content", textareaValue); // Add the tweet content to the FormData

      // If there's a previewImage, fetch it and append to the FormData
      if (previewImage) {
        const img = await fetch(previewImage).then((res) => res.blob());
        formData.append("tweetImg", img, "previewImage.jpg");
      }

      console.log(formData);
      // Send the tweet data to the server using the requestMethod function
      const response = await requestMethod("POST", "/tweet/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Display a success toast notification after successful tweet
      toast.success("Tweeted successful!");

      // Reset the state variables after successful tweet
      setShowModal(false); // Close the tweet modal
      setPreviewImage(null); // Reset the preview image
      setTextareaValue(""); // Reset the tweet content
    } catch (error) {
      // Display an error toast notification if tweet fails
      console.log(error);
      toast.error(`Tweet failed. ${error.response.data.error}.`);
    }
  };

  // Function to handle closing the tweet modal
  const handleClose = () => {
    setShowModal(false); // Close the tweet modal
    setPreviewImage(null); // Reset the preview image
  };

  // Function to handle showing the tweet modal
  const handleShow = () => setShowModal(true);

  // Function to handle changes in the tweet content textarea
  const handleChange = (event) => {
    setTextareaValue(event.target.value); // Update the state with the new textarea value
  };

  // Function to handle image selection for preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read the selected image file and set it as preview
      const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
      if (allowedFormats.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result); // Set the preview image URL to the state
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Only .jpg, .jpeg, and .png files are allowed.");
        setPreviewImage(null);
        return;
      }
    }
  };

  // Effect hook to fetch tweets when textareaValue, previewImage, or update changes
  useEffect(() => {
    const getTweets = async () => {
      try {
        const response = await requestMethod("GET", "/tweet/"); // Fetch tweets from the server
        setIsLoaded(true); // Set the isLoaded flag to true
        setTweets(response); // Update the tweets state with the fetched data
      } catch (error) {}
    };
    getTweets(); // Call the function to fetch tweets
  }, [textareaValue, previewImage, update]); // Dependencies that trigger the effect when they change

  return (
    <Container className="px-lg-5" style={{ height: "100vh" }}>
      <div
        style={{ minWidth: "48rem", maxWidth: "50rem" }}
        className="mx-auto row h-100"
      >
        <LeftSection className="col-5 p-0">
          <Sidebar />
        </LeftSection>
        <RightSection className="col-7">
          <div className="d-flex justify-content-between mb-3">
            <Title>Home</Title>
            <TweetBtn onClick={handleShow} className="btn-primary btn">
              Tweet
            </TweetBtn>
          </div>

          {isLoaded ? (
            tweets.map((tweet, index) => (
              <TweetCard
                tweet={tweet}
                key={index}
                setUpdate={setUpdate}
                update={update}
              />
            ))
          ) : (
            <div className="justify-content-center d-flex align-items-center w-100 h-75">
              <div className="spinner-border " role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </RightSection>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control mb-2"
            style={{ width: "100%" }}
            rows="4"
            value={textareaValue}
            onChange={handleChange}
          ></textarea>
          <input type="file" onChange={handleImageChange} />
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: "100%",
                objectFit: "contain",
                maxHeight: "20rem",
                marginTop: "10px",
              }}
            />
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePost}>
            Post
          </button>
          {/* Add additional buttons or actions here if needed */}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Home;

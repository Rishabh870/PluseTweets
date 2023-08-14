import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import {
  FaRegHeart,
  FaHeart,
  FaRetweet,
  FaRegCommentDots,
} from "react-icons/fa6";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Modal } from "react-bootstrap";
import requestMethod from "../requestMethod";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Img from "../Images/default.jpg";

const UserName = styled.div`
  font-size: small;
  color: black;
  font-weight: bold;
`;

const TweetTime = styled.span`
  font-size: small;
  font-weight: normal;
  color: gray;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  width: 2rem;
  font-size: larger;
  height: 2rem;
  border: none;
  &:hover {
    background-color: #00a2ff52;
  }
`;

const TweetContent = styled.p`
  font-size: small;
  padding-top: 0.5rem;
  margin-bottom: 0.1rem;
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const Button = styled.p`
  margin: 0;
  margin-right: 2rem;
  padding: 0.2rem 0.3rem;
  font-size: medium;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #9accf8;
  }
`;

const ProfileImage = styled.img`
  border-radius: 9999px;
  width: 2.5rem;
  height: 2.5rem;
`;

const PostImg = styled.img`
  width: 100%;
  max-height: 20rem;
  object-fit: contain;
  margin-bottom: 0.5rem;
`;

const UserNavLink = styled(NavLink)`
  text-decoration: none;
  color: black;
  &:hover {
    text-decoration: underline;
  }
`;

const Retweeted = styled.p`
  margin: 0%;
  margin-bottom: 0.5rem;
  margin-left: 3rem;
  font-size: 0.75rem;
`;

const TweetCard = ({ tweet, setUpdate, update }) => {
  // Define and initialize state variables
  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal
  const [textareaValue, setTextareaValue] = useState(""); // State for the value of the textarea
  const [isLiked, setIsLiked] = useState(false); // State for tracking if the tweet is liked by the user
  const [isRetweeted, setIsRetweeted] = useState(false); // State for tracking if the tweet is retweeted by the user

  const formatDate = (date) => {
    const convertDate = new Date(date);
    const formattedDate = convertDate.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formattedDate;
  };

  // Function to close the modal
  const handleClose = () => {
    setShowModal(false);
  };

  // Function to handle posting a reply
  const handlePost = () => {
    try {
      // Make a POST request to add a reply to the tweet
      const response = requestMethod("POST", `/tweet/${tweet._id}/reply`, {
        content: textareaValue,
      });

      // Display success message and reset the textarea and modal
      toast.success("You Have Posted A Reply");
      setTextareaValue("");
      setShowModal(false);
      setUpdate(!update);
    } catch (error) {
      // Display error message if posting reply fails
      toast.error(`Posting Reply Failed. ${error.response.data.error}.`);
    }
  };

  // Function to show the modal
  const handleShow = () => setShowModal(true);

  // Get the user ID from localStorage
  const userId = localStorage.getItem("userId");

  // UseEffect hook to check if the tweet is liked or retweeted by the user
  useEffect(() => {
    const check = () => {
      // Check if the tweet is liked by the user
      const isLikedByUser = tweet?.likes.some((like) => {
        return like._id === userId;
      });
      // Update the state variable
      if (isLikedByUser) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }

      // Check if the tweet is retweeted by the user
      const isRetweetedByUser = tweet?.retweetBy.some((retweet) => {
        return retweet._id === userId;
      });
      // Update the state variable
      if (isRetweetedByUser) {
        setIsRetweeted(true);
      } else {
        setIsRetweeted(false);
      }
    };
    // Call the check function
    check();
  }, [tweet, userId]);

  // Get the date string from the tweet's createdAt date
  const dateObject = tweet.createdAt ? new Date(tweet.createdAt) : null;
  const dateString = dateObject ? dateObject.toISOString().split("T")[0] : "";

  // Function to handle liking a tweet
  const handleLikeClick = async () => {
    try {
      // Make a POST request to like the tweet
      const response = await requestMethod("POST", `/tweet/${tweet._id}/like`);

      // Display success message and update the state
      toast.success("You Have Liked A Tweet");
      setIsLiked(true);
      setUpdate(!update);
    } catch (error) {
      // Display error message if liking fails
      toast.error(`Failed To Like. ${error.response.data.error}.`);
    }
  };

  // Function to handle unliking a tweet
  const handleunLikeClick = async () => {
    try {
      // Make a POST request to unlike the tweet
      const response = await requestMethod(
        "POST",
        `/tweet/${tweet._id}/dislike`
      );

      // Display success message and update the state
      toast.success("You Have Unliked A Tweet");
      setIsLiked(false);
      setUpdate(!update);
    } catch (error) {
      // Display error message if unliking fails
      toast.error(`Failed to Unlike. ${error.response.data.error}.`);
    }
  };

  // Function to handle retweeting a tweet
  const handleRetweetClick = async () => {
    try {
      // Make a POST request to retweet the tweet
      const response = await requestMethod(
        "POST",
        `/tweet/${tweet._id}/retweet`
      );

      // Display success message and update the state
      toast.success("Retweeted successful!");
      setIsRetweeted(true);
      setUpdate(!update);
    } catch (error) {
      // Display error message if retweeting fails
      toast.error(`Retweet failed. ${error.response.data.error}.`);
    }
  };

  // Function to handle changes in the textarea
  const handleChange = (event) => {
    setTextareaValue(event.target.value);
  };

  // Function to handle deleting a tweet
  const handleDelete = async (tweetId) => {
    try {
      // Make a DELETE request to delete the tweet
      const response = await requestMethod("DELETE", `/tweet/${tweetId}`);

      // Display success message and update the state
      toast.success("Tweet Deleted successful!");
      setUpdate(!update);
    } catch (error) {
      // Display error message if deletion fails
      toast.error(`Deletion failed. ${error.response.data.error}.`);
    }
  };
  console.log(tweet);

  return (
    <div className="card border mb-2 p-2 py-3">
      <div>
        {tweet.retweetBy.length ? (
          <Retweeted>
            Recently Retweeted By -{" "}
            {tweet.retweetBy[tweet?.retweetBy?.length - 1].name}
          </Retweeted>
        ) : null}
      </div>
      <div className="d-flex">
        <div className="">
          <ProfileImage
            src={
              tweet?.tweetedBy?.profilePic
                ? `http://localhost:5000/` + tweet?.tweetedBy?.profilePic
                : Img
            }
            alt=""
          />
        </div>
        <div className="ms-2 w-100">
          <div className="d-flex w-100 justify-content-between">
            <div className="text-start w-100">
              <NavLink
                className={"text-decoration-none , text-dark"}
                to={`/tweet/${tweet?._id}`}
              >
                <UserName>
                  <UserNavLink to={`/profile/${tweet?.tweetedBy?._id}`}>
                    @{tweet?.tweetedBy?.username}
                  </UserNavLink>
                  - <TweetTime>{formatDate(dateString)}</TweetTime>
                </UserName>

                <div className="">
                  <TweetContent>{tweet?.content}</TweetContent>
                </div>
                {tweet.image ? (
                  <div className="">
                    <PostImg
                      src={`http://localhost:5000/` + tweet?.image}
                      alt=""
                    />
                  </div>
                ) : null}
              </NavLink>
            </div>
            <div>
              {userId === tweet?.tweetedBy?._id ? (
                <DeleteButton onClick={() => handleDelete(tweet?._id)}>
                  <RiDeleteBin2Line />
                </DeleteButton>
              ) : (
                ""
              )}
            </div>
          </div>

          <div>
            <div className=" d-flex">
              {isLiked ? (
                <Button onClick={handleunLikeClick}>
                  <IconWrapper>
                    <FaHeart color="red" style={{ cursor: "pointer" }} />
                  </IconWrapper>

                  <span>{tweet?.likes?.length}</span>
                </Button>
              ) : (
                <Button onClick={handleLikeClick}>
                  <IconWrapper>
                    <FaRegHeart color="red" style={{ cursor: "pointer" }} />
                  </IconWrapper>

                  <span>{tweet?.likes?.length}</span>
                </Button>
              )}

              <Button onClick={handleRetweetClick}>
                <IconWrapper>
                  <FaRetweet
                    color={isRetweeted ? "green" : "lightgreen"}
                    style={{ cursor: "pointer" }}
                  />
                </IconWrapper>
                <span>{tweet?.retweetBy?.length}</span>
              </Button>
              <Button onClick={handleShow}>
                <IconWrapper>
                  <FaRegCommentDots color="#00a2ff" />
                </IconWrapper>
                <span>{tweet?.replies?.length}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tweet Your Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            style={{ width: "100%" }}
            rows="4"
            value={textareaValue}
            onChange={handleChange}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            variant="secondary "
            onClick={handlePost}
          >
            Send
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TweetCard;

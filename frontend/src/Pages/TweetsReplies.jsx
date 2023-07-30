import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import TweetCard from '../Components/TweetCard';
import { Container } from 'react-bootstrap';
import Sidebar from '../Components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import requestMethod from '../requestMethod';
import { NavLink } from 'react-router-dom';
import {
  FaRegHeart,
  FaHeart,
  FaRetweet,
  FaRegCommentDots,
} from 'react-icons/fa6';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Img from '../Images/default.jpg';

// Left Component
const LeftSection = styled.div`
  font-family: 'Open Sans', sans-serif;
  border-right: 2px solid #f3f3f3;
  max-width: 15rem;
  height: 100%;
  flex: 0 0 290px; /* Set a fixed width for the left section */
`;

const Title = styled.h5`
  display: flex;
  font-weight: bold;
  font-size: 1.5rem;
  align-items: center;
`;

// Right Component
const RightSection = styled.div`
  padding: 16px;
  height: 100%;
  font-family: 'Open Sans', sans-serif;
  border-right: 2px solid #f3f3f3;
  overflow-y: auto; /* Enable vertical scrolling for the right section */
  flex: 1; /* Allow the right section to occupy remaining space */
  -ms-overflow-style: none; /* Hide scrollbar in IE and Edge */
  scrollbar-width: 1px; /* Hide scrollbar in Firefox */
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar in Chrome and Safari */
  }
`;

const Retweeted = styled.p`
  margin: 0%;
  margin-left: 4.3rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
`;

const UserName = styled.span`
  margin-bottom: 0;
  font-size: small;
  color: black;
  font-weight: bold;
  text-decoration: none;
  &hover {
    text-decoration: underline;
  }
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
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const Button = styled.p`
  margin: 0;
  margin-right: 3rem;
  font-size: medium;
  display: flex;
  align-items: center;
  padding: 0.2rem 0.3rem;
  &:hover {
    background-color: #9accf8;
  }
`;

const ProfileImage = styled.img`
  border-radius: 9999px;
  width: 3.2rem;
  height: 3.2rem;
`;

const PostImg = styled.img`
  width: 100%;
  margin-bottom: 0.5rem;
`;

const TweetsReplies = () => {
  const currentUser = localStorage.getItem('token');
  if (currentUser === null || currentUser === undefined) {
    console.log(currentUser);
    // naivgate('/login');
    window.location.href = '/login';
  }
  const [openTweet, setOpenTweet] = useState([]);
  const params = useParams();
  const [showModal, setShowModal] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => {
    setShowModal(false);
  };

  const handlePost = () => {
    try {
      const response = requestMethod('POST', `/tweet/${openTweet._id}/reply`, {
        content: textareaValue,
      });
      toast.success('You Have Posted A Reply');
      setShowModal(false);
      setTextareaValue('');
    } catch (error) {
      toast.error(`Posting Reply Failed. ${error.response.data.error}.`);
    }
  };

  const handleLikeClick = async () => {
    try {
      const response = await requestMethod(
        'POST',
        `/tweet/${openTweet._id}/like`
      );
      toast.success('You Have Liked A Post');
      setIsLiked(true);
    } catch (error) {
      toast.error(`Liking A Post Failed. ${error.response.data.error}.`);
    }
  };
  const handleunLikeClick = async () => {
    try {
      const response = await requestMethod(
        'POST',
        `/tweet/${openTweet._id}/dislike`
      );
      toast.success('You Have Unliked A Post');
      setIsLiked(false);
    } catch (error) {
      toast.error(`Unliking A Post Failed. ${error.response.data.error}.`);
    }
  };
  const handleRetweetClick = async () => {
    try {
      const response = await requestMethod(
        'POST',
        `/tweet/${openTweet._id}/retweet`
      );
      toast.success('You Have Retweeted A Post');
      setIsRetweeted(true);
    } catch (error) {
      toast.error(`Retweeting A Post Failed. ${error.response.data.error}.`);
    }
  };

  const handleChange = (event) => {
    setTextareaValue(event.target.value);
  };

  // Function to handle deleting a tweet
  const handleDelete = async (tweetId) => {
    try {
      const response = await requestMethod('DELETE', `/tweet/${tweetId}`);
      toast.success('Deleted successful!');
      setUpdate(!update);
      navigate('/');
    } catch (error) {
      toast.error(`Deleting A Post Failed. ${error.response.data.error}.`);
    }
  };

  const handleShow = () => setShowModal(true);

  const userId = localStorage.getItem('userId');
  const imagePathFromServer = openTweet?.image;

  // Assuming userData.createdAt is provided and valid
  const dateObject = openTweet.createdAt ? new Date(openTweet.createdAt) : null;
  const dateString = dateObject ? dateObject.toISOString().split('T')[0] : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestMethod('GET', `/tweet/${params.id}`);
        setIsLiked(false);
        setOpenTweet(response);
        setIsLoaded(true);
        const isLikedByUser = openTweet.likes?.some((like) => {
          return like._id === userId;
        });
        // Check if isLiked is being updated correctly
        if (isLikedByUser) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
        const isRetweetedByUser = openTweet.retweetBy?.some((retweet) => {
          return retweet._id === userId;
        });

        if (isRetweetedByUser) {
          setIsRetweeted(true);
        } else {
          setIsRetweeted(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [params.id, openTweet, userId]);

  return (
    <Container className='px-lg-5' style={{ height: '100vh' }}>
      <div
        style={{ minWidth: '48rem', maxWidth: '50rem' }}
        className='mx-auto row h-100'
      >
        <LeftSection className='col-5 p-0'>
          <Sidebar />
        </LeftSection>
        <RightSection className='col-7'>
          <div className=' mb-3 '>
            <Title>Tweets</Title>
          </div>
          {isLoaded ? (
            <div className=' my-3'>
              <div>
                {openTweet.retweetBy.length ? (
                  <Retweeted>
                    Recently Retweeted By -{' '}
                    {openTweet.retweetBy[openTweet.retweetBy.length - 1].name}
                  </Retweeted>
                ) : null}
              </div>
              <div className='d-flex'>
                <div className=''>
                  <ProfileImage
                    src={
                      openTweet.tweetedBy?.profilePic
                        ? `http://localhost:5000/` +
                          openTweet.tweetedBy?.profilePic
                        : Img
                    }
                    alt=''
                  />
                </div>
                <div className='ms-3 w-100'>
                  <div className='text-start d-flex justify-content-between'>
                    <NavLink
                      className={'text-decoration-none'}
                      to={`/profile/${openTweet?.tweetedBy?._id}`}
                    >
                      <p>
                        <UserName>@{openTweet?.tweetedBy?.username}</UserName> -{' '}
                        <TweetTime>{dateString}</TweetTime>
                      </p>
                    </NavLink>
                    {userId === openTweet.tweetedBy?._id ? (
                      <DeleteButton onClick={() => handleDelete(openTweet._id)}>
                        <RiDeleteBin2Line />
                      </DeleteButton>
                    ) : (
                      ''
                    )}
                  </div>

                  <NavLink
                    className={'text-decoration-none , text-dark'}
                    to={`/tweet/${openTweet._id}`}
                  >
                    <div className=''>
                      <TweetContent>{openTweet.content}</TweetContent>
                    </div>
                    {imagePathFromServer ? (
                      <div className=''>
                        <PostImg
                          src={`http://localhost:5000/` + imagePathFromServer}
                          alt=''
                        />
                      </div>
                    ) : null}
                  </NavLink>
                  <div className=' d-flex'>
                    {isLiked ? (
                      <Button onClick={handleunLikeClick}>
                        <IconWrapper>
                          <FaHeart color='red' style={{ cursor: 'pointer' }} />
                        </IconWrapper>

                        <span>{openTweet.likes.length}</span>
                      </Button>
                    ) : (
                      <Button onClick={handleLikeClick}>
                        <IconWrapper>
                          <FaRegHeart
                            color='red'
                            style={{ cursor: 'pointer' }}
                          />
                        </IconWrapper>

                        <span>{openTweet.likes.length}</span>
                      </Button>
                    )}
                    <Button onClick={handleRetweetClick}>
                      <IconWrapper>
                        <FaRetweet
                          color={isRetweeted ? 'green' : 'lightgreen'}
                          style={{ cursor: 'pointer' }}
                        />
                      </IconWrapper>
                      <span>{openTweet.retweetBy?.length}</span>
                    </Button>
                    <Button onClick={handleShow}>
                      <IconWrapper>
                        <FaRegCommentDots color='#00a2ff' />
                      </IconWrapper>
                      <span>{openTweet.replies?.length}</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className=' my-3'>
                <p className='fw-bold'>Replies</p>
                {openTweet.replies?.map((tweet, index) => (
                  <TweetCard
                    tweet={tweet}
                    key={index}
                    setUpdate={setUpdate} // Pass the setUpdate function to TweetCard
                    update={update}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className='justify-content-center d-flex align-items-center w-100 h-75'>
              <div className='spinner-border ' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            </div>
          )}
        </RightSection>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tweet Your Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className='form-control'
            style={{ width: '100%' }}
            rows='4'
            value={textareaValue}
            onChange={handleChange}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <button
            className='btn btn-primary'
            variant='secondary '
            onClick={handlePost}
          >
            Send
          </button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TweetsReplies;

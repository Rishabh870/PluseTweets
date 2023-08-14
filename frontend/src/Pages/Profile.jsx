import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import requestMethod from "../requestMethod";
import TweetCard from "../Components/TweetCard";
import { useParams } from "react-router-dom";
import { BsCalendar3 } from "react-icons/bs";
import { HiOutlineCake } from "react-icons/hi2";
import { MdOutlineLocationOn } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Img from "../Images/default.jpg";

const ProfileImage = styled.img`
  border-radius: 9999px;
  width: 7rem;
  height: 7rem;
`;

const LeftSection = styled.div`
  border-right: 2px solid #f3f3f3;
  font-family: "Open Sans", sans-serif;
  max-width: 15rem;
  height: 100%;
  flex: 0 0 290px;
`;

const Title = styled.h5`
  display: flex;
  font-weight: bold;
  font-size: 1.5rem;
  align-items: center;
`;

const Name = styled.h5`
  margin: 0;
  font-weight: bold;
`;
const Username = styled.p`
  font-weight: normal;
  color: gray;
  font-size: small;
  margin: 0;
`;
const Span = styled.span`
  margin: 0 10px;
  font-weight: normal;
  font-size: small;
  color: grey;
`;
const Info = styled.span`
  font-weight: bold;
`;

const Sub = styled.p`
  font-weight: bold;
  margin-right: 20px;
`;
// Right Component
const RightSection = styled.div`
  padding: 16px;
  border-right: 2px solid #f3f3f3;
  height: 100%;
  font-family: "Open Sans", sans-serif;
  overflow-y: auto; /* Enable vertical scrolling for the right section */
  flex: 1; /* Allow the right section to occupy remaining space */
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

const Profile = () => {
  const currentUser = localStorage.getItem("token");
  if (currentUser === null || currentUser === undefined) {
    console.log(currentUser);
    // naivgate('/login');
    window.location.href = "/login";
  }

  const [showEditModal, setShowEditModal] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [tweets, setTweets] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [update, setUpdate] = useState(false);
  const [editName, seteditName] = useState("");
  const [editLocation, seteditLocation] = useState("");
  const [editDob, seteditDob] = useState("");
  const following = userData?.following?.length;
  const follower = userData?.follower?.length;

  const params = useParams();
  const formatDate = (date) => {
    const convertDate = new Date(date);
    const formattedDate = convertDate.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formattedDate;
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read the selected image file and set it as preview
      const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];
      if (allowedFormats.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Only .jpg, .jpeg, and .png files are allowed.");
      }
    }
  };

  const Follow = async () => {
    try {
      const response = await requestMethod("POST", `/user/${params.id}/follow`);
      toast.success("You Have Followed A User");
      setUpdate(!update);
      setIsFollowed(true);
    } catch (error) {
      toast.error(`Following Failed. ${error.response.data.error}.`);
    }
  };
  const UnFollow = async () => {
    try {
      const response = await requestMethod(
        "POST",
        `/user/${params.id}/unfollow`
      );
      toast.success("You Have Unfollowed A User ");
      setIsFollowed(false);
      setUpdate(!update);
    } catch (error) {
      toast.error(`Unfollow Failed. ${error.response.data.error}.`);
    }
  };
  const handleEditPost = async () => {
    if (!editName && !editLocation && !editDob) {
      toast.error(`Fill All The Fields`);
      return;
    }

    try {
      const name = editName ? editName : userData.name;
      const location = editLocation ? editLocation : userData.location;
      const dob = editDob ? editDob : userData.DOB;
      const response = await requestMethod("PUT", `/user/${params.id}`, {
        name,
        location,
        dob,
      });
      toast.success("You Profile Have Been Edited");

      setShowEditModal(false);
      seteditDob("");
      seteditName("");
      seteditLocation("");
      window.location.reload();
    } catch (error) {
      toast.error(`Editing Profile Failed. ${error.response.data.error}.`);
    }
  };
  const handleEditShow = () => setShowEditModal(true);
  const handleEditClose = async () => {
    setShowEditModal(false);
  };

  const handleProfilePicPost = async () => {
    if (!previewImage) {
      toast.error(`Please Select An Image.`);
      return;
    }
    try {
      const formData = new FormData();
      const img = await fetch(previewImage).then((res) => res.blob());
      formData.append("profilePic", img, "previewImage.jpg");
      const response = await requestMethod(
        "POST",
        `/user/${params.id}/uploadProfilePic`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("You Have Updated The Profile Pic");
      setShowModal(false);
      setPreviewImage(null);
      window.location.reload();
    } catch (error) {
      toast.error(`Updating Profile Pic Failed. ${error.response.data.error}.`);
    }
  };
  const handleProfilePicShow = () => setShowModal(true);
  const handleProfilePicClose = async () => {
    setShowModal(false);
  };

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const getTweetData = async () => {
      try {
        const response = await requestMethod(
          "GET",
          `/user/${params.id}/tweets`
        );
        setTweets(response);
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };

    const getUserData = async () => {
      try {
        const response = await requestMethod("GET", `/user/${params.id}`);
        setUserData(response);

        const isUserFollowed = response.follower?.includes(userId);
        if (isUserFollowed) {
          setIsFollowed(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
    getTweetData();
  }, [params, userId, update, previewImage, isFollowed]);

  const joinedDate = userData.createdAt ? new Date(userData.createdAt) : null;
  const joinedString = joinedDate ? joinedDate.toISOString().split("T")[0] : "";
  const dateOfBirth = userData.DOB ? new Date(userData.DOB) : null;
  const dobString = dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : "";

  return (
    <div>
      <Container className="px-lg-5" style={{ height: "100vh" }}>
        <div
          style={{ minWidth: "45rem", maxWidth: "50rem" }}
          className="mx-auto row h-100"
        >
          <LeftSection className="col-5 p-0">
            <Sidebar />
          </LeftSection>
          <RightSection className="col-7">
            <div className="d-flex justify-content-between mb-3">
              <Title>Profile</Title>
            </div>
            {isLoaded ? (
              <>
                <div className="">
                  <div
                    style={{ position: "relative", height: "10rem" }}
                    className=" bg-primary"
                  >
                    <div
                      style={{
                        paddingTop: "6.5rem",
                        position: "absolute",
                      }}
                      className="d-flex px-3 justify-content-between"
                    >
                      <div
                        style={{
                          backgroundColor: "white",
                          borderRadius: "999px",
                        }}
                      >
                        <ProfileImage
                          src={
                            userData.profilePic
                              ? `http://localhost:5000/` + userData.profilePic
                              : Img
                          }
                          alt=""
                        />
                      </div>
                    </div>
                  </div>

                  {params.id === userId ? (
                    <div className=" mt-3 d-flex justify-content-end ">
                      <button
                        className="btn btn-outline-primary fw-bold"
                        onClick={handleProfilePicShow}
                      >
                        Upload Profile Photo
                      </button>
                      <button
                        className="btn btn-outline-dark mx-2 fw-bold"
                        onClick={handleEditShow}
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className=" mt-3 d-flex justify-content-end ">
                      {isFollowed ? (
                        <button
                          onClick={UnFollow}
                          className="btn btn-secondary fw-bold"
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          onClick={Follow}
                          className="btn btn-primary mx-2 fw-bold"
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="my-3 pt-3">
                  <Name>{userData.name}</Name>
                  <Username>@{userData.username}</Username>
                  <div className="row mt-4">
                    {userData.DOB ? (
                      <Info className="col-6 pt-2">
                        <HiOutlineCake />
                        <Span>Date, {formatDate(dobString)}</Span>
                      </Info>
                    ) : null}
                    {userData.location ? (
                      <Info className="col-6 pt-2">
                        <MdOutlineLocationOn />
                        <Span>Location, {userData.location}</Span>
                      </Info>
                    ) : null}
                    <Info className="col-6 pt-2">
                      <BsCalendar3 />
                      <Span>Joined, {formatDate(joinedString)}</Span>
                    </Info>
                  </div>
                </div>

                <div className="d-flex">
                  <Sub>
                    {following}
                    <span> Following</span>
                  </Sub>
                  <Sub>
                    {follower}
                    <span> Follower</span>
                  </Sub>
                </div>

                <hr />

                <div className="">
                  <div className="text-center">
                    <h6>Tweets and Replies</h6>
                  </div>
                  {tweets.map((tweet, index) => (
                    <TweetCard
                      tweet={tweet}
                      key={index}
                      setUpdate={setUpdate}
                      update={update}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="justify-content-center d-flex align-items-center w-100 h-75">
                <div className="spinner-border " role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </RightSection>
        </div>
        <Modal show={showEditModal} onHide={handleEditClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={editName}
                onChange={(e) => seteditName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                className="form-control"
                value={editLocation}
                onChange={(e) => seteditLocation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date of Birth:</label>
              {/* You can use a date picker or calendar component here */}
              <input
                type="date"
                id="dob"
                className="form-control"
                value={editDob}
                onChange={(e) => seteditDob(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleEditClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={handleEditPost}>
              Post
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModal} onHide={handleProfilePicClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile Pic</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="file" onChange={handleImageChange} />
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: "100%", marginTop: "10px" }}
              />
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={handleProfilePicClose}
            >
              Close
            </button>
            <button className="btn btn-primary" onClick={handleProfilePicPost}>
              Post
            </button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Profile;

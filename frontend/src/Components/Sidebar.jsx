import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { HiUser } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { styled } from "styled-components";
import requestMethod from "../requestMethod";
import Img from "../Images/default.jpg";
const Logo = styled.div`
  font-size: 2rem;
  color: #0d6efd;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  padding: 0 10px;
  margin: 5px 0;
  border-radius: 20rem;
  color: black;
  /* background-color: ${({ isActive }) =>
    isActive ? "blue" : "transparent"}; */
  &.active {
    background-color: #008cff;
    color: white;
  }
  &:hover {
    background-color: #008cff;
    color: white;
  }
`;

const LogoutBtn = styled.p`
  text-decoration: none;
  padding: 0 10px;
  margin: 5px 0;
  border-radius: 20rem;
  cursor: pointer;
  color: black;
  &:hover {
    background-color: #008cff;
    color: white;
  }
`;
const Username = styled.p`
  font-size: small;
  cursor: auto;
`;
const Name = styled.h6`
  font-size: medium;
  cursor: auto;
  font-weight: bold;
`;

const IconWrapper = styled.p`
  margin: 0.3rem 0;
  display: flex;
  font-weight: 600;
  align-items: center;
`;

const ProfileImage = styled.img`
  border-radius: 9999px;
  width: 2.5rem;
  height: 2.5rem;
`;

const NameWrapper = styled.div`
  margin-left: 0.8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const UserSectionConatiner = styled(NavLink)`
  padding: 0.2rem 1rem;
  text-decoration: none;
  border-radius: 9999px;
  color: black;
  &:hover {
    background-color: #008cff;
    color: white;
  }
`;

const Sidebar = () => {
  // State to store user data
  const [userData, setUserData] = useState({});

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  // Fetch user data on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await requestMethod("GET", `/user/${userId}`);
        setUserData(response);
      } catch (error) {}
    };

    getUserData();
  }, []);

  const userId = localStorage.getItem("userId");
  return (
    <Container className="d-flex h-100 px-4 py-2 flex-column">
      {/* Sidebar Logo */}
      <Logo>
        <BiMessageRoundedDetail />
      </Logo>
      <div className="d-flex navbar-nav py-2 flex-column">
        {/* Home NavLink */}
        <StyledNavLink to="/" activeclassname="active">
          <IconWrapper>
            <IoHome />
            <span className="mx-2">Home</span>
          </IconWrapper>
        </StyledNavLink>
        {/* Profile NavLink */}
        <StyledNavLink to={`/profile/${userId}`} activeclassname="active">
          <IconWrapper>
            <HiUser />
            <span className="mx-2">Profile</span>
          </IconWrapper>
        </StyledNavLink>
        {/* Logout Button */}
        <LogoutBtn>
          <IconWrapper onClick={handleLogout}>
            <MdLogout />
            <span className="mx-2">Logout</span>
          </IconWrapper>
        </LogoutBtn>
      </div>
      <div className=" flex-grow-1"></div>
      {/* User Profile Section */}
      <UserSectionConatiner
        to={`/profile/${userId}`}
        className="d-flex mb-3 align-items-center"
      >
        <div className=" my-auto d-flex align-items-center">
          {/* User Profile Image */}
          <ProfileImage
            src={
              userData.profilePic
                ? `http://localhost:5000/` + userData.profilePic
                : Img
            }
            alt=""
          />
        </div>
        {/* User Name and Username */}
        <NameWrapper>
          <Name className="mb-0">{userData.name}</Name>
          <Username className="mb-0">@{userData.username}</Username>
        </NameWrapper>
      </UserSectionConatiner>
    </Container>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import requestMethod from "../requestMethod";
import { toast } from "react-toastify";
import { BiMessageRoundedDetail } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";

const Contain = styled(Container)`
  display: flex;
  align-items: center;
  height: 100vh;
  font-family: "Open Sans", sans-serif;
`;

const LeftDiv = styled.div`
  background-color: #008cff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 17rem;
  border-radius: 1rem 0 0 1rem;
`;

const RightDiv = styled.div`
  padding: 0 40px;
  justify-content: space-evenly;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 5px 13px;
`;

const Button = styled.button`
  padding: 10px 20px;
  width: fit-content;
  color: white;
  border: none;
  cursor: ${(props) => (props.loading ? "not-allowed" : "pointer")};
`;

const LoginLink = styled(Link)`
  /* Styles for the "Login" link */
  color: #0084ff;
  cursor: pointer;
  text-decoration: none;
`;

const AlreadyHaveAccount = styled.p`
  /* Styles for the paragraph */
  font-size: 14px;
  margin-top: 30px;

  /* Make the "Login" span a child of this paragraph */
  & ${LoginLink} {
    margin-left: 5px;
  }
`;

const Icon = styled(BiMessageRoundedDetail)`
  font-size: 7rem;
  color: white;
`;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        name,
        email,
        password,
        username,
      };

      // Use await when calling requestMethod to wait for the response
      const response = await requestMethod("POST", "/auth/register", formData);
      toast.success("You Have Been Registered");
      navigate("/login");
      setLoading(false); // Set loading to false after the request is complete
    } catch (error) {
      console.log(error.message);
      toast.error(`Registration Failed. ${error.response.data.error}.`);
      setLoading(false); // Set loading to false in case of an error as well
    }
  };

  return (
    <Contain className=" m-auto ">
      <div
        style={{
          borderRadius: " 1rem",
          width: "45rem",
        }}
        className="row mx-auto shadow"
      >
        <LeftDiv className="col-5 p-0">
          <h4 className="text-white">Join Us</h4>
          <div>
            <Icon />
          </div>
        </LeftDiv>
        <RightDiv className="col-7 mx-auto px-3 pt-4 pb-3">
          <h2 className="mb-3 mt-2 fw-bold">Register</h2>
          <Form onSubmit={handleSubmit}>
            <Input
              className="form-control mb-3"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="form-control mb-3"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="form-control mb-3"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="form-control mb-3"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button className="btn btn-dark" type="submit" loading={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>
          </Form>
          <AlreadyHaveAccount>
            Already have an account?
            <span>
              <LoginLink to="/login">Login</LoginLink>
            </span>
          </AlreadyHaveAccount>
        </RightDiv>
      </div>
    </Contain>
  );
};

export default Register;

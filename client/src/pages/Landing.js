import React from "react";
import { Logo } from "../components";
import styled from "styled-components";
// import Main from "../assets/images/main.svg";
import Main from "../assets/images/main2.webp";
import { Link } from "react-router-dom";
function landing() {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Smart <span>Doctor</span>
          </h1>
          <p>
            I'm baby lo-fi selfies vinyl austin, actually iceland helvetica
            direct trade next level YOLO. Knausgaard vibecession DIY marfa tonx
            tattooed la croix mukbang, single-origin coffee try-hard franzen
            chartreuse ethical.
          </p>
          {/* <button className="btn btn-hero">Login/Register</button> */}
          <Link to="/register" className="btn btn-hero">
            Login / Register
          </Link>
        </div>
        <img src={Main} alt="job hunt" className="img main-img"></img>
      </div>
    </Wrapper>
  );
}
const Wrapper = styled.main`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
  }
  .main-img {
    display: none;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;
export default landing;

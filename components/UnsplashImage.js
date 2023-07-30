import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  background-size:cover;
  box-shadow: 0px 0px 5px 2px #282c34;
`;

export const UnsplashImage = ({ url, key }) => {
  return (
    <>
      <Img key={key} src={url} alt="" />
    </>
  )
}

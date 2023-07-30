import Image from 'next/image'
import styles from '../styles/Home.module.css'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UnsplashImage } from '../components/UnsplashImage';
import { Loader } from '../components/Loader';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    background-color: ${(props) => (props.darkMode ? '#222' : '#fff')};
    color: ${(props) => (props.darkMode ? '#fff' : '#222')};
  }
`;

const WrapperImages = styled.section`
  max-width: 75rem;
  height: auto;
  margin: 6rem auto;
  display: grid;
  grid-gap: 2em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 450px;
`;

const CACHE_KEY = 'unsplashImages';
const CACHE_EXPIRATION = 2400;

const Home = () => {
  const [images, setImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION * 1000) {
      setImages(cachedData.images);
    } else {
      fetchImages();
    }
  }, []);

  const fetchImages = (count = 10) => {
    const apiRoot = 'https://api.unsplash.com';
    const accessKey = process.env.REACT_APP_ACCESSKEY;

    axios
      .get(`${apiRoot}/photos/random?client_id=${accessKey}&count=${count}`)
      .then((res) => {
        const newImages = res.data.map((image) => ({
          ...image,
          comments: [],
        }));
        setImages((prevImages) => [...prevImages, ...newImages]);

        // Cache the new data in localStorage
        const cacheData = {
          timestamp: Date.now(),
          images: [...images, ...newImages],
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      })
      .catch((error) => {
        console.log(error);
      });
  };
console.log(images);
  const handleLike = (imageId) => {
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === imageId ? { ...image, likes: image.likes + 1 } : image
      )
    );

    if (likedImages.includes(imageId)) {
      setLikedImages((prevLikedImages) => prevLikedImages.filter((id) => id !== imageId));
      setImages((prevImages) =>
        prevImages.map((image) =>
          image.id === imageId ? { ...image, likes: image.likes - 2 } : image
        )
      );
    } else {
      setLikedImages((prevLikedImages) => [...prevLikedImages, imageId]);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  return (
      <div>
        <div className={styles.nav1}>
          <h1>FEEDS</h1>
          <h6>Infinite Scrolling Application using unsplash API</h6>
        </div>
        <button onClick={handleDarkModeToggle}>Toggle Dark mode</button>
        <GlobalStyle darkMode={darkMode} />
        <InfiniteScroll dataLength={images.length} next={fetchImages} hasMore={true} loader={<Loader />}>
          <WrapperImages style={{ background: darkMode ? '#333' : 'white' }}>
            {images.map((image) => (
              <div className={styles.imgsec}>
                <div key={image.id} style={{ padding: '1vw', borderRadius: '5px' }}>
                  <Link href={`/profileHader/${image.user.username}`} passHref>
                    <b>@{image.user.username} </b>
                  </Link>
                  <p>
                    <i>Location: {image.location.country}</i>
                  </p>

                  <UnsplashImage url={image.urls.thumb} style={{ height: '200px' }} />
                  <p style={{ display: 'inlineFlex', justifyContent: 'spaceBetween', position: 'relative' }}>
                    Resolutions: <Link href={image.urls.raw}>Raw</Link> <Link href={image.urls.full}>Full</Link>{' '}
                    <Link href={image.urls.regular}>Regular</Link>{' '}
                  </p>

                  <div style={{ borderRadius: '2px' }}>
                    <div className={styles.like}>
                      <button onClick={() => handleLike(image.id)}>
                        {likedImages.includes(image.id) ? (
                          <AiFillHeart size={22} color="red" />
                        ) : (
                          <AiOutlineHeart size={22} color="black" />
                        )}
                      </button>
                      <p>Likes: {image.likes}</p>
                    </div>
                  </div>
                  <h>
                    <b>About:</b> {image.alt_description}
                  </h>
                </div>
              </div>
            ))}
          </WrapperImages>
        </InfiniteScroll>
      </div>
  );
};

export default Home;

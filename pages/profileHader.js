import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { UnsplashImage } from '../components/UnsplashImage';
import styles from "../styles/Home.module.css"

const ProfileHeader = ({ username }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [Image, setImage] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
        const response = await axios.get(
          `https://api.unsplash.com/users/${username}?client_id=${accessKey}`
        );
        setUserDetails(response.data);
        const newImages = response.data.photos.map((image) => ({ ...image }));
        setImage((prevImages) => [...prevImages, ...newImages]);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [username]);

  const toggleView = () => {
    setViewType((prevType) => (prevType === 'grid' ? 'list' : 'grid'));
  };

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.darkMode ? 'styles.darkMode' : 'styles.lightMode'}>
      <div className={styles.nav1}>
        <h1>User Profile</h1>
        <h6>Infinite Scrolling Application using Unsplash API</h6>
      </div>
      <button onClick={toggleDarkMode} style={{ marginLeft: '1rem', position: 'absolute' }}>
        Toggle Dark Mode
      </button>
      <div className={styles.proinfo}>
        <div className={styles.dp}>
          <img
            src={userDetails.profile_image.large}
            alt={<FaUser />}
            style={{ borderRadius: '80px' }}
          />
        </div>
        <div className={styles.info1}>
          <h3>
            {userDetails.first_name} {userDetails.last_name}
          </h3>
          <h5>@{userDetails.username}</h5>
          <h4>Bio: {userDetails.bio}</h4>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5vw 2vw 0.5vw 2vw',
          backgroundColor: 'grey',
        }}
      >
        <h4>
          Followers: <i>{userDetails.followers_count}</i>
        </h4>
        <h4>
          Followings: <i>{userDetails.following_count}</i>
        </h4>
      </div>
      <br />
      <button onClick={toggleView} style={{ height: '3vw', minHeight: '30px' }}>
        Switch to {viewType === 'grid' ? 'List' : 'Grid'} View
      </button>

      <div className={viewType === 'grid' ? 'gridContainer' : 'listContainer'}>
        {userDetails.photos.map((image) => (
          <div key={image.id} className={viewType === 'grid' ? 'gridItem' : 'listItem'}>
            <UnsplashImage url={image.urls.thumb} />
            <p>
              Resolution: <a href={image.urls.full}>Full</a>{' '}
              <a href={image.urls.raw}>Raw</a> <a href={image.urls.regular}>Regular</a>
            </p>
            <p>Uploaded on: {image.created_at}</p>
            <p>{image.slug} </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const { username } = query;
  return { props: { username } };
}

export default ProfileHeader;

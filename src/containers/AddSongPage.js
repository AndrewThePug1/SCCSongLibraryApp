import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const AddSongPage = () => {
  const [songData, setSongData] = useState({
    metadata: {
      title: '',
      artist: '',
      language: '',
      singers: '',
      labels: '',
      links: {
        spotify: '',
        youtube: '',
        pista: '',
      }
    },
    lyrics: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...songData };
    const keys = name.split('.');
    keys.reduce((acc, key, index) => {
      if (index === keys.length - 1) {
        acc[key] = value;
        return value;
      }
      if (!acc[key]) acc[key] = {};
      return acc[key];
    }, data);
    setSongData(data);
  };

  const generateHash = () => {
    const combinedData = JSON.stringify({ ...songData.metadata, lyrics: songData.lyrics });
    return CryptoJS.SHA256(combinedData).toString(CryptoJS.enc.Hex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!songData.metadata.title || !songData.metadata.artist || !songData.metadata.singers || !songData.metadata.labels) {
      alert('Please fill in all required fields: Title, Artist, Singers, and Labels.');
      return;
    }
  
    const hash = generateHash();
    const submitData = {
      ...songData,
      hash: hash
    };

    // Original API call to Azure
    try {
      const originalApiUrl = 'https://sccsongsblobupload.azurewebsites.net/api/func-UploadJSON?code=kvFM9NHu5LO2v9LkX3BzbBKOxR_mANyjUIlp-2BmCaX2AzFu5TvhzQ==';
      await axios.post(originalApiUrl, submitData);
      console.log('Song added to Azure successfully!');
      alert('Song added successfully to Azure!');
    } catch (error) {
      console.error('Error uploading song to Azure:', error);
      alert('Error adding song to Azure. Please try again.');
    }

    // Additional API call to your Flask backend
    try {
      const backendApiUrl = 'http://localhost:5000/add_song';
      await axios.post(backendApiUrl, submitData);
      console.log('Song added to backend successfully!');
      alert('Song added successfully to backend!');
    } catch (error) {
      console.error('Error uploading song to backend:', error);
      alert('Error adding song to backend. Please try again.');
    }
  };


  return (
    <div>
      <h2>Add Song</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="metadata.title" value={songData.metadata.title} onChange={handleChange} placeholder="Title" />
        <input type="text" name="metadata.artist" value={songData.metadata.artist} onChange={handleChange} placeholder="Artist" />
        <select name="metadata.language" value={songData.metadata.language} onChange={handleChange}>
          <option value="">Select Language</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
        </select>
        <input type="text" name="metadata.singers" value={songData.metadata.singers} onChange={handleChange} placeholder="Singers (comma-separated)" />
        <input type="text" name="metadata.labels" value={songData.metadata.labels} onChange={handleChange} placeholder="Labels (comma-separated)" />
        <input type="text" name="metadata.links.spotify" value={songData.metadata.links.spotify} onChange={handleChange} placeholder="Spotify Link" />
        <input type="text" name="metadata.links.youtube" value={songData.metadata.links.youtube} onChange={handleChange} placeholder="YouTube Link" />
        <input type="text" name="metadata.links.pista" value={songData.metadata.links.pista} onChange={handleChange} placeholder="Pista Link (if available)" />
        <textarea name="lyrics" value={songData.lyrics} onChange={handleChange} placeholder="Lyrics"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddSongPage;

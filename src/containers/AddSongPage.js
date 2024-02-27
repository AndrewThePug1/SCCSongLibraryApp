import React, { useState } from 'react';
import axios from 'axios';

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
    const nameParts = name.split('.');
    if (nameParts.length === 1) {
      setSongData({ ...songData, [name]: value });
    } else {
      let temp = { ...songData };
      let ref = temp;
      for (let i = 0; i < nameParts.length - 1; i++) {
        ref = ref[nameParts[i]];
      }
      ref[nameParts[nameParts.length - 1]] = value;
      setSongData(temp);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation for required fields
    if (!songData.metadata.title || !songData.metadata.artist || !songData.metadata.singers || !songData.metadata.labels) {
      alert('Please fill in all required fields: Title, Artist, Singers, and Labels.');
      return; // Stop the form submission if validation fails
    }
    // Convert singers and labels to arrays
    const submitData = {
      ...songData,
      metadata: {
        ...songData.metadata,
        singers: songData.metadata.singers.split(',').map(singer => singer.trim()),
        labels: songData.metadata.labels.split(',').map(label => label.trim()),
      },
    };

    try {
      const apiUrl = 'https://sccsongsblobupload.azurewebsites.net/api/func-UploadJSON?code=kvFM9NHu5LO2v9LkX3BzbBKOxR_mANyjUIlp-2BmCaX2AzFu5TvhzQ==';
      const response = await axios.post(apiUrl, submitData);
      console.log(response.data);
      alert('Song added successfully!');
      // Reset form or redirect as needed
    } catch (error) {
      console.error('Error uploading song:', error);
      alert('Error adding song. Please try again.');
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

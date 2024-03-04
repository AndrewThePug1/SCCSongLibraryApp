import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { BlobServiceClient } from '@azure/storage-blob';

const UpdateSongForm = () => {
  const { songName } = useParams();
  const history = useHistory();
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
      },
    },
    lyrics: '',
  });

  const sasToken = process.env.REACT_APP_SAS_TOKEN;
  const containerName = "songs-scc";
  const storageAccountName = "sccsongsfortworth";

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net?${sasToken}`);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // Correctly handle the blob name to avoid appending '.json' twice
        const blobNameWithExtension = decodeURIComponent(songName).endsWith('.json') ? decodeURIComponent(songName) : decodeURIComponent(songName) + '.json';
        const blockBlobClient = containerClient.getBlockBlobClient(blobNameWithExtension);
        const downloadResponse = await blockBlobClient.download(0);
        const downloadedContent = await downloadResponse.blobBody.then(blob => blob.text());
        const songDetails = JSON.parse(downloadedContent);
        setSongData(songDetails);
      } catch (error) {
        console.error('Error fetching song details:', error);
        alert('Error fetching song details. Please try again.');
      }
    };

    fetchSongDetails();
  }, [songName, sasToken, storageAccountName, containerName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...songData };
    let keys = name.split('.');
    keys.reduce((current, key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
        return;
      }
      if (!current[key]) current[key] = {};
      return current[key];
    }, data);
    setSongData(data);
  };

  // Updated to include lyrics in hash generation
  const generateHash = () => {
    const dataToHash = JSON.stringify(songData);
    return CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Hex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashValue = generateHash();
    const submitData = { ...songData, hash: hashValue };

    try {
      const apiUrl = 'https://sccsongsblobupload.azurewebsites.net/api/func-UploadJSON?code=kvFM9NHu5LO2v9LkX3BzbBKOxR_mANyjUIlp-2BmCaX2AzFu5TvhzQ==';
      await axios.post(apiUrl, submitData);
      alert('Song updated successfully!');
      history.push('/songs');
    } catch (error) {
      console.error('Error updating song:', error);
      alert('Error updating song. Please try again.');
    }
  };

  return (
    <div>
      <h2>Update Song</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <input type="text" name="metadata.title" value={songData.metadata.title} onChange={handleChange} placeholder="Title" />
        <input type="text" name="metadata.artist" value={songData.metadata.artist} onChange={handleChange} placeholder="Artist" />
        <select name="metadata.language" value={songData.metadata.language} onChange={handleChange}>
          <option value="">Select Language</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          {/* Add more languages as needed */}
        </select>
        <input type="text" name="metadata.singers" value={songData.metadata.singers} onChange={handleChange} placeholder="Singers (comma-separated)" />
        <input type="text" name="metadata.labels" value={songData.metadata.labels} onChange={handleChange} placeholder="Labels (comma-separated)" />
        <input type="text" name="metadata.links.spotify" value={songData.metadata.links.spotify} onChange={handleChange} placeholder="Spotify Link" />
        <input type="text" name="metadata.links.youtube" value={songData.metadata.links.youtube} onChange={handleChange} placeholder="YouTube Link" />
        <input type="text" name="metadata.links.pista" value={songData.metadata.links.pista} onChange={handleChange} placeholder="Pista Link (if available)" />
        <textarea name="lyrics" value={songData.lyrics} onChange={handleChange} placeholder="Lyrics"></textarea>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateSongForm;

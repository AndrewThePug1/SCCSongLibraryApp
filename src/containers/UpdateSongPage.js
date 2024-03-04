import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BlobServiceClient } from '@azure/storage-blob';

const UpdateSongPage = () => {
  const [songsList, setSongsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const sasToken = process.env.REACT_APP_SAS_TOKEN;
  const containerName = "songs-scc";
  const storageAccountName = "sccsongsfortworth";

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        const blobServiceClient = new BlobServiceClient(`https://${storageAccountName}.blob.core.windows.net?${sasToken}`);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobsIterator = containerClient.listBlobsFlat();
        const songs = [];
        for await (const blob of blobsIterator) {
          // Assuming blob names are URL-safe; adjust as necessary
          songs.push({ name: blob.name });
        }
        setSongsList(songs);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError('Error fetching songs. See console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handleSongSelect = (songName) => {
    history.push(`/update-song/${encodeURIComponent(songName)}`);
  };

  return (
    <div>
      <h2>Update Song</h2>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <ul>
        {songsList.map((song, index) => (
          <li key={index} onClick={() => handleSongSelect(song.name)}>
            {song.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdateSongPage;

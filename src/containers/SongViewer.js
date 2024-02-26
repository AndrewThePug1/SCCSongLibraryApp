import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlobServiceClient } from '@azure/storage-blob';

const SongViewer = () => {
  const [songMetadata, setSongMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { songName } = useParams(); // This will get the song name from the URL

  const sasToken = process.env.REACT_APP_SAS_TOKEN;
  const containerName = "songs-scc";
  const storageAccountName = "sccsongsfortworth";

  useEffect(() => {
    const fetchSongMetadata = async () => {
      setLoading(true);
      setError(null);
      try {
        const blobServiceClient = new BlobServiceClient(
          `https://${storageAccountName}.blob.core.windows.net?${sasToken}`
        );
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // Append .json to the songName to form the correct blob name
        const blobNameWithExtension = decodeURIComponent(songName) + '.json'; // Updated line
        const blockBlobClient = containerClient.getBlockBlobClient(blobNameWithExtension); // Updated line
        console.log(`Attempting to fetch metadata for blob: ${blobNameWithExtension}`); // Updated line
        const blobUrl = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(blobNameWithExtension)}?${sasToken}`; // Updated line
        console.log("Attempting to fetch metadata from URL:", blobUrl); // Updated line
        const response = await blockBlobClient.download(0);
        const blobContent = await response.blobBody.then(blob => blob.text());
        const metadata = JSON.parse(blobContent);
        setSongMetadata(metadata);
      } catch (error) {
        console.error('Error fetching song metadata:', error);
        setError('Error fetching metadata. See console for details.');
      } finally {
        setLoading(false);
      }
    };

    if (songName) {
      fetchSongMetadata();
    }
  }, [songName]); // The useEffect hook will run when songName changes

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {songMetadata && (
        <div>
          <h2>{songMetadata.name || 'Song Details'}</h2>
          {/* You can structure your song metadata details here */}
          <pre>{JSON.stringify(songMetadata, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SongViewer;

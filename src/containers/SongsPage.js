// SongsPage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlobServiceClient } from '@azure/storage-blob';

const SongsPage = () => {
  const [songsMetadata, setSongsMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sasToken = process.env.REACT_APP_SAS_TOKEN;
  
  const containerName = "songs-scc";
  const storageAccountName = "sccsongsfortworth";

  useEffect(() => {
    const blobServiceClient = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net?${sasToken}`
    );

    const fetchSongsMetadata = async () => {
      setLoading(true);
      setError(null);
      try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        let blobs = containerClient.listBlobsFlat();
        const metadataList = [];
        for await (const blob of blobs) {
          const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
          const response = await blockBlobClient.download(0);
          const blobContent = await response.blobBody.then(blob => blob.text());
          const metadata = JSON.parse(blobContent);
          const name = blob.name.replace(/\.[^/.]+$/, "");
          metadataList.push({ name, ...metadata });
        }
        setSongsMetadata(metadataList);
      } catch (error) {
        console.error('Error fetching songs metadata:', error);
        setError('Error fetching metadata. See console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongsMetadata();
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error loading songs: {error}</div>}
      <ul>
        {songsMetadata.map((metadata, index) => (
          <li key={index}>
            {/* We use Link to navigate to the SongViewer component */}
            <Link to={`/song/${encodeURIComponent(metadata.name)}`}>
              {metadata.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongsPage;

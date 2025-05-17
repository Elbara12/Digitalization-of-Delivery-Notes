// services/ipfsUploader.js
const { Readable } = require('stream');
const pinataSDK = require('@pinata/sdk');

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function uploadPDFBufferToPinata(buffer, fileName) {
  const stream = Readable.from(buffer);
  stream.path = fileName; // Necessario per pinFileToIPFS

  const options = {
    pinataMetadata: {
      name: fileName,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  const result = await pinata.pinFileToIPFS(stream, options);
  return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
}

module.exports = { uploadPDFBufferToPinata };
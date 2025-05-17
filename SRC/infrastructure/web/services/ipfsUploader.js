const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function uploadToPinata(filePath) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const res = await axios.post(url, formData, {
    maxBodyLength: "Infinity",
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
  });

  const cid = res.data.IpfsHash;
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

module.exports =  uploadToPinata ;
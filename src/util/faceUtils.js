// src/util/faceUtils.js
const faceapi = require('@vladmandic/face-api');
const path = require('path');
const canvas = require('canvas');

// patch node-canvas into face-api
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

// Load models
async function loadModels() {
  if (modelsLoaded) return;
  const modelPath = path.join(__dirname, '../train_models'); // adjust path if needed
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  modelsLoaded = true;
  console.log('✅ Face models loaded successfully');
}

// Extract face embeddings from an image buffer
async function getFaceEmbedding(imageBuffer) {
  const img = await canvas.loadImage(imageBuffer);

  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error('No face detected in image');
  return detection.descriptor; // embedding
}

// Register staff: average embedding from multiple images
async function registerStaff(imagesBuffers) {
  const embeddings = [];
  for (const buffer of imagesBuffers) {
    const descriptor = await getFaceEmbedding(buffer);
    embeddings.push(descriptor);
  }

  const avgEmbedding = embeddings[0].map((val, idx) =>
    embeddings.reduce((sum, e) => sum + e[idx], 0) / embeddings.length
  );

  return avgEmbedding; // Save this in DB against staff
}

// Compare embeddings
function compareEmbeddings(embedding1, embedding2, threshold = 0.6) {
  const distance = Math.sqrt(
    embedding1.reduce((sum, val, i) => sum + Math.pow(val - embedding2[i], 2), 0)
  );
  return { match: distance < threshold, distance };
}

module.exports = {
  loadModels,
  getFaceEmbedding,
  registerStaff,
  compareEmbeddings,
};

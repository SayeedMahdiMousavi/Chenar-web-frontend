import Compressor from 'compressorjs';

export default (file, { quality, width, height }) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      height,
      width,
      strict: true,
      convertSize: 50000000,
      success: resolve,
      error: reject,
    });
  });
};

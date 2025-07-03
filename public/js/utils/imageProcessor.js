
  
async function processImageHelper(imageElement) {
    const MAX_SIZE = 400;
    let { width: w, height: h } = imageElement;
    if (w > MAX_SIZE || h > MAX_SIZE) {
        const ratio = w / h;
        if (ratio > 1) {
            w = MAX_SIZE;
            h = Math.round(MAX_SIZE / ratio);
        } else {
            h = MAX_SIZE;
            w = Math.round(MAX_SIZE * ratio);
        }
    }
    

    // Create a canvas for original compression
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = w;
    canvas.height = h;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(imageElement, 0, 0, w, h);

    const originalBlob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/webp", 0.75)
    );

    // Pixelation on offscreen canvas
    const scale = 0.6;
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    offscreen.width = w * scale;
    offscreen.height = h * scale;
    offCtx.drawImage(imageElement, 0, 0, offscreen.width, offscreen.height);

    canvas.width = w;
    canvas.height = h;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(offscreen, 0, 0, offscreen.width, offscreen.height, 0, 0, w, h);

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const tintStrength = 0.5;
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = 0;
        data[i + 1] = gray * tintStrength;
        data[i + 2] = 0;
    }
    ctx.putImageData(imageData, 0, 0);

    const transformedBlob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/webp", 0.7)
    );
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return { originalBlob, transformedBlob, previewCanvas: canvas };
}

export { processImageHelper }
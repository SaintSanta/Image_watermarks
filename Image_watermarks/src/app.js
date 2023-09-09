const imageInput = document.getElementById("imageInput");
const watermarkInput = document.getElementById("watermarkInput");
const opacitySlider = document.getElementById("opacitySlider");
const previewButton = document.getElementById("previewButton");
const exportButton = document.getElementById("exportButton");
const previewArea = document.getElementById("previewArea");
const previewImage = document.getElementById("previewImage");
const horizontalSlider = document.getElementById("horizontalSlider");
const verticalSlider = document.getElementById("verticalSlider");
const scaleSlider = document.getElementById("scaleSlider");
const rotateAngleInput = document.getElementById("rotateAngle");
const userWatermarkImg = new Image(); // Создаем изображение для пользовательского водяного знака

let selectedImage = null;
let watermark = null;
let watermarkOpacity = 0.5;
let offsetX = 0;
let offsetY = 0;
let scale = 1.0;
let rotateAngle = 0;
let defaultWatermarkSrc = null; // URL дефолтного водяного знака

imageInput.addEventListener("change", (event) => {
  selectedImage = event.target.files[0];
  if (selectedImage) {
    watermarkInput.style.display = "block";
  }
  updatePreview();
});

watermarkInput.addEventListener("change", (event) => {
  watermark = event.target.files[0];
  if (watermark) {
    opacitySlider.style.display = "block";
    exportButton.disabled = false;
    const reader = new FileReader();
    reader.onload = (e) => {
      userWatermarkImg.src = e.target.result;
      updatePreview();
    };
    reader.readAsDataURL(watermark);
  } else {
    userWatermarkImg.src = ""; // Очищаем изображение пользовательского водяного знака
    updatePreview();
  }
});

opacitySlider.addEventListener("input", (event) => {
  watermarkOpacity = parseFloat(event.target.value);
  updatePreview();
});

previewButton.addEventListener("click", () => {
  if (!selectedImage || !watermark) {
    alert("Пожалуйста, выберите изображение и водяной знак.");
    return;
  }
  updatePreview();
});

horizontalSlider.addEventListener("input", (event) => {
  offsetX = parseFloat(event.target.value);
  updatePreview();
});

verticalSlider.addEventListener("input", (event) => {
  offsetY = parseFloat(event.target.value);
  updatePreview();
});

scaleSlider.addEventListener("input", (event) => {
  scale = parseFloat(event.target.value) / 100;
  updatePreview();
});

rotateAngleInput.addEventListener("input", (event) => {
  rotateAngle = parseFloat(event.target.value);
  updatePreview();
});

// Обработчики событий для дефолтных водяных знаков
const defaultWatermarkButtons = document.querySelectorAll("[id^='defaultWatermark']");

defaultWatermarkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    defaultWatermarkSrc = button.querySelector("img").getAttribute("src");
    updatePreview();
  });
});

function updatePreview() {
  if (!selectedImage) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 800;
      if (img.width > maxWidth) {
        const scaleFactor = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleFactor;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (defaultWatermarkSrc) {
        // Если есть URL дефолтного водяного знака, накладываем его
        const defaultWatermarkImg = new Image();
        defaultWatermarkImg.src = defaultWatermarkSrc;
        drawWatermark(ctx, defaultWatermarkImg);
      }

      if (userWatermarkImg.src) {
        // Если выбран пользовательский водяной знак, накладываем его
        drawWatermark(ctx, userWatermarkImg);
      }

      previewImage.src = canvas.toDataURL();
      previewArea.style.display = "block";
    };
  };
  reader.readAsDataURL(selectedImage);
}

// Вспомогательная функция для наложения водяного знака
function drawWatermark(ctx, watermarkImg) {
  const watermarkWidth = watermarkImg.width * scale;
  const watermarkHeight = watermarkImg.height * scale;

  ctx.save();
  ctx.translate(
    offsetX / 100 * (ctx.canvas.width - watermarkWidth) + watermarkWidth / 2,
    offsetY / 100 * (ctx.canvas.height - watermarkHeight) + watermarkHeight / 2
  );
  ctx.rotate((rotateAngle * Math.PI) / 180);
  ctx.translate(-watermarkWidth / 2, -watermarkHeight / 2);

  ctx.globalAlpha = watermarkOpacity;
  ctx.drawImage(watermarkImg, 0, 0, watermarkWidth, watermarkHeight);

  ctx.restore();
}

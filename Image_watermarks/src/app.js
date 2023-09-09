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
const defaultWatermarkImg = new Image(); // Создаем изображение для дефолтного водяного знака

let selectedImage = null;
let userWatermark = null;
let defaultWatermark = null;
let watermarkOpacity = 0.5;
let offsetX = 0;
let offsetY = 0;
let scale = 1.0;
let rotateAngle = 0;
let useUserWatermark = false; // Флаг для отслеживания выбора пользовательского водяного знака
let useDefaultWatermark = false; // Флаг для отслеживания выбора дефолтного водяного знака

imageInput.addEventListener("change", (event) => {
  selectedImage = event.target.files[0];
  if (selectedImage) {
    watermarkInput.style.display = "block";
  }
  updatePreview();
});

watermarkInput.addEventListener("change", (event) => {
  userWatermark = event.target.files[0];
  useUserWatermark = true;
  useDefaultWatermark = false;
  if (userWatermark) {
    opacitySlider.style.display = "block";
    exportButton.disabled = false;
    const reader = new FileReader();
    reader.onload = (e) => {
      userWatermarkImg.src = e.target.result;
      updatePreview();
    };
    reader.readAsDataURL(userWatermark);
  } else {
    userWatermarkImg.src = ""; // Очищаем изображение пользовательского водяного знака
    updatePreview();
  }
});

// Обработчики событий для дефолтных водяных знаков
const defaultWatermarkButtons = document.querySelectorAll("[id^='defaultWatermark']");

defaultWatermarkButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const defaultWatermarkSrc = button.querySelector("img").getAttribute("src");
    useDefaultWatermark = true;
    useUserWatermark = false;
    defaultWatermarkImg.src = defaultWatermarkSrc;
    updatePreview();
  });
});

opacitySlider.addEventListener("input", (event) => {
  watermarkOpacity = parseFloat(event.target.value);
  updatePreview();
});

previewButton.addEventListener("click", () => {
  if (!selectedImage || (!userWatermark && !useDefaultWatermark)) {
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

      ctx.save();

      if (useUserWatermark) {
        // Используем пользовательский водяной знак
        const watermarkWidth = userWatermarkImg.width * scale;
        const watermarkHeight = userWatermarkImg.height * scale;
        ctx.translate(
          offsetX / 100 * (canvas.width - watermarkWidth) + watermarkWidth / 2,
          offsetY / 100 * (canvas.height - watermarkHeight) + watermarkHeight / 2
        );
        ctx.rotate((rotateAngle * Math.PI) / 180);
        ctx.translate(-watermarkWidth / 2, -watermarkHeight / 2);
        ctx.globalAlpha = watermarkOpacity;
        ctx.drawImage(userWatermarkImg, 0, 0, watermarkWidth, watermarkHeight);
      } else if (useDefaultWatermark) {
        // Используем дефолтный водяной знак
        const watermarkWidth = defaultWatermarkImg.width;
        const watermarkHeight = defaultWatermarkImg.height;
        ctx.globalAlpha = watermarkOpacity;
        ctx.drawImage(defaultWatermarkImg, 0, 0, watermarkWidth, watermarkHeight);
      }

      ctx.restore();

      previewImage.src = canvas.toDataURL();
      previewArea.style.display = "block";
    };
  };
  reader.readAsDataURL(selectedImage);
}

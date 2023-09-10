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
const userWatermarkImg = new Image();
const defaultWatermarkImg = new Image();

let selectedImage = null;
let userWatermark = null;
let defaultWatermark = null;
let watermarkOpacity = 0.5;
let offsetX = 0;
let offsetY = 0;
let scale = 1.0;
let rotateAngle = 0;
let useUserWatermark = false;
let useDefaultWatermark = false;

imageInput.addEventListener("change", function (event) {
    selectedImage = event.target.files[0];
    if (selectedImage && userWatermark) {
        watermarkInput.style.display = "block";
        exportButton.disabled = false;
    } else if (selectedImage) {
        watermarkInput.style.display = "block";
    }
    updatePreview();
});

watermarkInput.addEventListener("change", function (event) {
    userWatermark = event.target.files[0];
    useUserWatermark = true;
    useDefaultWatermark = false;
    if (userWatermark) {
        if (selectedImage) {
            opacitySlider.style.display = "block";
            exportButton.disabled = false;
            const reader = new FileReader();
            reader.onload = function (e) {
                userWatermarkImg.src = e.target.result;
                updatePreview();
            };
            reader.readAsDataURL(userWatermark);
        } else {
            opacitySlider.style.display = "block";
            const reader = new FileReader();
            reader.onload = function (e) {
                userWatermarkImg.src = e.target.result;
                updatePreview();
            };
            reader.readAsDataURL(userWatermark);
        }
    }
    else {
        userWatermarkImg.src = "";
        updatePreview();
    }
});

const defaultWatermarkButtons = document.querySelectorAll("[id^='defaultWatermark']");

defaultWatermarkButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const defaultWatermarkSrc = button.querySelector("img").getAttribute("src");
        useDefaultWatermark = true;
        useUserWatermark = false;
        defaultWatermarkImg.src = defaultWatermarkSrc;
        updatePreview();

        if (selectedImage && useDefaultWatermark) {
            exportButton.disabled = false;
        }
    });
});

opacitySlider.addEventListener("input", function (event) {
    watermarkOpacity = parseFloat(event.target.value);
    updatePreview();
});

previewButton.addEventListener("click", function () {
    if (!selectedImage || (!userWatermark && !useDefaultWatermark)) {
        alert("Пожалуйста, выберите изображение и водяной знак.");
        return;
    }
    updatePreview();
});

horizontalSlider.addEventListener("input", function (event) {
    offsetX = parseFloat(event.target.value);
    updatePreview();
});

verticalSlider.addEventListener("input", function (event) {
    offsetY = parseFloat(event.target.value);
    updatePreview();
});

scaleSlider.addEventListener("input", function (event) {
    scale = parseFloat(event.target.value) / 100;
    updatePreview();
});

rotateAngleInput.addEventListener("input", function (event) {
    rotateAngle = parseFloat(event.target.value);
    updatePreview();
});

function updatePreview() {
    if (!selectedImage) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
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

                const watermarkWidth = userWatermarkImg.width * scale;
                const watermarkHeight = userWatermarkImg.height * scale;
                ctx.translate(
                    offsetX / 100 * (canvas.width - watermarkWidth) + watermarkWidth / 2,
                    offsetY / 100 * (canvas.height - watermarkHeight) + watermarkHeight / 2
                );
                ctx.rotate((rotateAngle * Math.PI) / 180);
                ctx.scale(scale, scale);
                ctx.translate(-watermarkWidth / 2, -watermarkHeight / 2);
                ctx.globalAlpha = watermarkOpacity;
                ctx.drawImage(userWatermarkImg, 0, 0, watermarkWidth, watermarkHeight);
            } else if (useDefaultWatermark) {

                const watermarkWidth = defaultWatermarkImg.width * scale;
                const watermarkHeight = defaultWatermarkImg.height * scale;
                ctx.translate(
                    offsetX / 100 * (canvas.width - watermarkWidth) + watermarkWidth / 2,
                    offsetY / 100 * (canvas.height - watermarkHeight) + watermarkHeight / 2
                );
                ctx.rotate((rotateAngle * Math.PI) / 180);
                ctx.scale(scale, scale);
                ctx.translate(-watermarkWidth / 2, -watermarkHeight / 2);
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

exportButton.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = previewImage.src;
    a.download = "image_with_watermark.png";
    a.click();
});

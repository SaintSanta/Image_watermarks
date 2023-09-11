(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const e of r)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function l(r){const e={};return r.integrity&&(e.integrity=r.integrity),r.referrerPolicy&&(e.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?e.credentials="include":r.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function a(r){if(r.ep)return;r.ep=!0;const e=l(r);fetch(r.href,e)}})();const B=document.getElementById("imageInput"),A=document.getElementById("watermarkInput"),h=document.getElementById("opacitySlider"),p=document.getElementById("exportButton"),S=document.getElementById("previewArea"),E=document.getElementById("previewImage"),W=document.getElementById("horizontalSlider"),b=document.getElementById("verticalSlider"),F=document.getElementById("scaleSlider"),x=document.getElementById("rotateAngle"),O=document.querySelector(".previewImageWrapper"),L=document.querySelector(".previewAreaText"),P=document.querySelector(".customFileUpload"),R=document.querySelectorAll("[id^='defaultWatermark']"),u=new Image,g=new Image;let d=null,m=null,w=.5,y=0,I=0,c=1,v=0,k=!1,f=!1;O.addEventListener("click",()=>{document.getElementById("imageInput").click()});P.addEventListener("click",()=>{document.getElementById("watermarkInput").click()});B.addEventListener("change",function(t){d=t.target.files[0],E.style.display="block",d&&m?(L.style.display="none",p.disabled=!1):d&&(L.style.display="none"),i()});A.addEventListener("change",t=>{if(m=t.target.files[0],k=!0,f=!1,m)if(d){h.style.display="block",p.disabled=!1;const o=new FileReader;o.onload=function(l){u.src=l.target.result,i()},o.readAsDataURL(m)}else{h.style.display="block";const o=new FileReader;o.onload=function(l){u.src=l.target.result,i()},o.readAsDataURL(m)}else u.src="",i()});R.forEach(t=>{t.addEventListener("click",()=>{const o=t.querySelector("img").getAttribute("src");f=!0,k=!1,g.src=o,i(),d&&f&&(p.disabled=!1)})});h.addEventListener("input",function(t){w=parseFloat(t.target.value),i()});W.addEventListener("input",function(t){y=parseFloat(t.target.value),i()});b.addEventListener("input",function(t){I=parseFloat(t.target.value),i()});F.addEventListener("input",function(t){c=parseFloat(t.target.value)/100,i()});x.addEventListener("input",function(t){v=parseFloat(t.target.value),i()});function i(){if(!d)return;const t=new FileReader;t.onload=function(o){const l=new Image;l.src=o.target.result,l.onload=function(){const a=document.createElement("canvas"),r=1280;if(l.width>r){const n=r/l.width;a.width=r,a.height=l.height*n}else a.width=l.width,a.height=l.height;const e=a.getContext("2d");if(e.drawImage(l,0,0,a.width,a.height),e.save(),k){const n=u.width*c,s=u.height*c;e.translate(y/100*(a.width-n)+n/2,I/100*(a.height-s)+s/2),e.rotate(v*Math.PI/180),e.scale(c,c),e.translate(-n/2,-s/2),e.globalAlpha=w,e.drawImage(u,0,0,n,s)}else if(f){const n=g.width*c,s=g.height*c;e.translate(y/100*(a.width-n)+n/2,I/100*(a.height-s)+s/2),e.rotate(v*Math.PI/180),e.scale(c,c),e.translate(-n/2,-s/2),e.globalAlpha=w,e.drawImage(g,0,0,n,s)}e.restore(),E.src=a.toDataURL(),S.style.display="block"}},t.readAsDataURL(d)}p.addEventListener("click",()=>{const t=document.createElement("a");t.href=E.src,t.download="image_with_watermark.png",t.click()});

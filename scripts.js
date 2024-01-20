const resumeFilePath = './assets/resume.pdf';
const nameText = document.getElementById('name-text');
const crsr = document.querySelector(".cursor");

let scrolledPixelsX = 0;
let scrolledPixelsY = 0;
let pos=0;

nameText.addEventListener('click', function () {
  const link = document.createElement('a');
  link.href = resumeFilePath;
  link.download = 'Kaif_Resume.pdf';
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
});

document.addEventListener("mousemove", function (e) {
  crsr.style.left = e.clientX + scrolledPixelsX + "px";
  crsr.style.top = e.clientY + scrolledPixelsY + "px";
  pos=e.clientY;
});

document.addEventListener("scroll", function () {
  scrolledPixelsX = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
  scrolledPixelsY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
  crsr.style.top = pos + scrolledPixelsY + "px";
});

const resumeFilePath = './assets/resume.pdf';
const nameText = document.getElementById('name-text');
const crsr = document.querySelector(".cursor");

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
  crsr.style.left = e.clientX + "px";
  crsr.style.top = e.clientY + "px";
  pos=e.clientY;
});

document.addEventListener("scroll", function () {
  scrolledPixelsY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
  crsr.style.top = pos + scrolledPixelsY + "px";
});

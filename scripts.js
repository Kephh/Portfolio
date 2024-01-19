const resumeFilePath = './assests/resume.pdf';
    
        const nameText = document.getElementById('name-text');
    
        nameText.addEventListener('click', function() {
          const link = document.createElement('a');
          link.href = resumeFilePath;
          link.download = 'Kaif_Resume.pdf';
          document.body.appendChild(link);
    
          link.click();
    
          document.body.removeChild(link);
        });

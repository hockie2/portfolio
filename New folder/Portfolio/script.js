function loadContent(src) {
    const iframe = document.getElementById('contentFrame');
    iframe.src = src;
    iframe.onload = () => {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const style = document.createElement('style');
        style.innerHTML = `
            body, html {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                margin: 0;
                background-color: #f0f0f0;
            }
            .centered-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
            }
            img {
                max-width: 100%;
                height: auto;
                margin: 0 auto
            }
        `;
        iframeDocument.head.appendChild(style);

        // Wrap all images with a div and apply 'centered-container' class
        const images = iframeDocument.querySelectorAll('img');
        images.forEach(img => {
            const wrapper = iframeDocument.createElement('div');
            wrapper.className = 'centered-container';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        });

        // Optionally wrap all videos similarly, if needed
        const videos = iframeDocument.querySelectorAll('video');
        videos.forEach(video => {
            const wrapper = iframeDocument.createElement('div');
            wrapper.className = 'centered-container';
            video.parentNode.insertBefore(wrapper, video);
            wrapper.appendChild(video);
        });
    };
}

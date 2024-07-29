document.addEventListener('DOMContentLoaded', function() {
    const platforms = ['website', 'youtube', 'twitter', 'facebook', 'github', 'linkedin', 'instagram', 'snapchat', 'tiktok', 'pinterest', 'tumblr', 'reddit', 'flickr', 'vimeo', 'discord', 'slack'];

    platforms.forEach(platform => {
        const icon = document.getElementById(platform);
        icon.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default action of the anchor tag
            chrome.storage.sync.get([platform], function(result) {
                if (result[platform]) {
                    chrome.tabs.create({ url: result[platform] });
                } else {
                    showCustomPrompt(`Please enter your ${platform} URL:`, function(url) {
                        if (url) {
                            chrome.storage.sync.set({ [platform]: url }, function() {
                                alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL saved!`);
                                chrome.tabs.create({ url: url });
                                moveIconToMain(platform);
                            });
                        }
                    });
                }
            });
        });
    });

    const toggleArrow = document.getElementById('toggleArrow');
    const additionalIcons = document.getElementById('additionalIcons');

    toggleArrow.addEventListener('click', () => {
        if (additionalIcons.classList.contains('visible')) {
            additionalIcons.classList.remove('visible');
            toggleArrow.innerHTML = `<i class="fa fa-arrow-down"></i><div class="tooltip" id="tooltip">Show more apps</div>`;
        } else {
            additionalIcons.classList.add('visible');
            toggleArrow.innerHTML = `<i class="fa fa-arrow-up"></i><div class="tooltip" id="tooltip">Hide</div>`;
        }
    });

    function showCustomPrompt(message, callback) {
        const modal = document.getElementById('customPrompt');
        const promptInput = document.getElementById('promptInput');
        const promptTitle = document.getElementById('promptTitle');
        const okBtn = document.getElementById('okBtn');
        const cancelBtn = document.getElementById('cancelBtn');

        promptTitle.innerText = message;
        promptInput.value = '';

        modal.style.display = 'flex';

        okBtn.onclick = function() {
            modal.style.display = 'none';
            callback(promptInput.value);
        };

        cancelBtn.onclick = function() {
            modal.style.display = 'none';
            callback(null);
        };
    }

    function moveIconToMain(platform) {
        const icon = document.getElementById(platform);
        const mainContainer = document.querySelector('.flex-container');
        const additionalContainer = document.querySelector('.additional-icons .flex-container');

        // Check if the icon is already in the main container
        if (mainContainer.querySelector(`#${platform}`)) {
            return; // Icon is already in the main container
        }

        // Create a new flex div and add the icon to it
        const flexDiv = document.createElement('div');
        flexDiv.classList.add('flex');

        const anchor = document.createElement('a');
        anchor.href = '#';
        anchor.id = platform;
        anchor.target = '_blank';

        const iconClass = icon.querySelector('i').className;
        const iconElement = document.createElement('i');
        iconElement.className = iconClass;

        anchor.appendChild(iconElement);
        flexDiv.appendChild(anchor);

        mainContainer.appendChild(flexDiv);

        // Remove the old icon from the additional icons container
        const oldIcon = additionalContainer.querySelector(`#${platform}`);
        if (oldIcon && oldIcon.parentNode) {
            oldIcon.parentNode.removeChild(oldIcon);
        }

        // Re-assign the event listener to the new icon
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            chrome.storage.sync.get([platform], function(result) {
                if (result[platform]) {
                    chrome.tabs.create({ url: result[platform] });
                } else {
                    showCustomPrompt(`Please enter your ${platform} URL:`, function(url) {
                        if (url) {
                            chrome.storage.sync.set({ [platform]: url }, function() {
                                alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL saved!`);
                                chrome.tabs.create({ url: url });
                                moveIconToMain(platform);
                            });
                        }
                    });
                }
            });
        });
    }
});

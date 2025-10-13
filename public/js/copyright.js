// Add this to a JS file (e.g., static/js/copyright.js)
// Or include it in your base template within <script> tags

document.addEventListener('copy', function(e) {
    // Get the selected text
    let selectedText = window.getSelection().toString();
    
    // Only proceed if there's actually text selected
    if (selectedText.length > 0) {
        // Create the copyright notice
        const copyrightNotice = '\n\nCopyright https://interfacecraft.online/';
        
        // Create the combined text
        const textWithCopyright = selectedText + copyrightNotice;
        
        // Set the clipboard data
        e.clipboardData.setData('text/plain', textWithCopyright);
        
        // Prevent the default copy behavior
        e.preventDefault();
    }
});
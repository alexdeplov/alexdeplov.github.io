+++
title = "How I Automated My Computer Life With Macos Folder Actions"
date = 2025-02-12T21:53:39+01:00
draft = false
featured = false
author = "Alexander Deplov"
+++

I've always believed that computers should handle repetitive tasks better than humans. It frustrates me when something can't be automated the way I want or when simple actions require more effort than they should.

Let’s say we want to convert one video format to another. This happens to me often when I need to share a screencast video with colleagues on Slack. By default, macOS records in .MOV format, which is too large for sharing on Slack. Or sometimes, I have another file that I want to reduce in size. Before sending it to someone, I usually convert it to .MP4 to reduce the size.

Previously, I used a macOS GUI app for this, and the steps from start to finish were:
- Open the video converter app
- Click a button to select a file
- Select the output format
- Click the “Convert” button, wait
- Close the video converter app
- Find and delete the original .MOV file manually

Such a simple need, yet so many manual actions were required.

So I realized that I could use the powerful macOS Folder Actions. I decided to use them as a trigger for my needs—any need. Set it up once, and then reuse it with just a drag and drop. Drop the file in, and the folder action trigger does the job.

Here’s a quick demo of how much easier converting .MOV files into .MP4 has become with drag and drop. Drop a file, wait, and it's done. It’s pure magic! And original file deleted as well.

![](images/1.gif)

## List of My Folder Actions
After some time, I created folder actions for various tasks.

Need to convert .JPG or .webp to .WEBP? I have a folder for that.
Need to download a Twitter video with a nice UI animation that caught my attention? Not a problem—I have a folder for that. And so on.

![](images/2.webp)

And it’s pretty easy to set up. Here’s how.

## How to Set Up macOS Folder Actions
Please note that once you set up Folder Actions, you can’t change the folder name without breaking the folder actions. If you rename the folder, you must reattach the folder actions again.

### Steps:
1. In Terminal: 

```
brew install ffmpeg
```

2. Create and name a folder.
3. Open Automator and create a new **Folder Action** project.
![](images/4.webp)
4. Add **Get Selected Finder Items** and **Run Shell Script**. Change **Pass input** to **“as arguments”**. Select the folder.
![](images/5.webp)
5. To convert .MOV to .MP4, enter the following shell script (in all privided scripts you need to change file output path to yours):

```sh
for f in "$@"; do
    /opt/homebrew/bin/ffmpeg -n -loglevel error -i "$f" -vcodec libx264 -crf 23 -preset ultrafast -tune film "/Users/alexander/Library/Mobile\ Documents/com\~apple\~CloudDocs/Downloads/$(date +"%Y_%m_%d_%I_%M_%p_%s").mp4";
    rm -f "$f"
done
```

6. Save and exit.
7. Drag and drop a .MOV file into the folder. If it works, you should see an icon in the menu bar.
![](images/6.webp)

## Additional Folder Actions
### Convert Video to GIF

```sh
for f in "$@"; do
    /opt/homebrew/bin/ffmpeg -n -loglevel error -i "$f" -vf "fps=18,scale=720:-1:flags=lanczos" "/Users/alexander/Library/Mobile Documents/com~apple~CloudDocs/Downloads/$(date +"%Y_%m_%d_%I_%M_%p_%s").gif";
    rm -f "$f"
done
```

### Convert Image to WEBP:

```sh
for f in "$@"; do
    /opt/homebrew/bin/cwebp -q 70 "$f" -o "/Users/alexander/Library/Mobile Documents/com~apple~CloudDocs/Downloads/$(date +"%Y_%m_%d_%I_%M_%p_%s").webp";
    rm -f "$f"
done
```

### Download YouTube Videos:
1. In Terminal:

```
brew install yt-dlp
```

2. Use this script:

```sh
# Process each .webloc file
for f in "$@"; do
    echo "Processing file: $f"
    
    # Extract URL between <string> tags
    url=$(grep -o '<string>.*</string>' "$f" | sed 's/<string>\(.*\)<\/string>/\1/')
    echo "Extracted URL: $url"
    
    # Check if URL was found
    if [ -n "$url" ]; then
        echo "Attempting to download from: $url"
        
        # Download video using yt-dlp to the Downloads folder
        /opt/homebrew/bin/yt-dlp -P "~/Downloads" "$url"
        
        # Check if the download was successful
        if [ $? -eq 0 ]; then
            echo "Download successful, removing webloc file"
            rm -f "$f"
        else
            echo "Download failed"
        fi
    else
        echo "Error: No URL found in '$f'"
    fi

done
```

![](images/8.gif)

3. Drop a website URL directly into the folder.

### Download Twitter Videos:

```sh
#!/bin/bash

# Process each .webloc file
for f in "$@"; do
    echo "Processing file: $f"
    
    # Extract URL between <string> tags
    url=$(grep -o '<string>.*</string>' "$f" | sed 's/<string>\(.*\)<\/string>/\1/')
    echo "Extracted URL: $url"
    
    # Check if URL was found
    if [ -n "$url" ]; then
        echo "Attempting to download from: $url"
        
        # Download video using yt-dlp to the Downloads folder
        /opt/homebrew/bin/yt-dlp -P "~/Downloads" "$url"
        
        # Check if the download was successful
        if [ $? -eq 0 ]; then
            echo "Download successful, removing webloc file"
            rm -f "$f"
        else
            echo "Download failed"
        fi
    else
        echo "Error: No URL found in '$f'"
    fi

done
```

## Folder Actions Tweaking
If you need to change a folder action, right-click on the folder and select **Folder Action Setup**.
![](images/7.webp)

All saved actions are stored in:
```
Macintosh HD / Users / YourName / Library / Workflows / Applications / Folder Actions/
```

It’s become so powerful that I’m willing to extend this system to even more actions. Now my desktop is more useful than ever:

![](images/9.webp)

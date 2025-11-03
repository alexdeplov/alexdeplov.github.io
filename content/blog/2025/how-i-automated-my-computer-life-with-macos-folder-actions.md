+++
title = "How I Automated My Computer Routine With macOS Folder Actions"
date = 2025-02-12T21:53:39+01:00
draft = false
aliases = ["/posts/blog/2025/how-i-automated-my-computer-life-with-macos-folder-actions/"]
featured = false
author = "Alexander Deplov"
+++

> I've always believed that computers should handle repetitive tasks better than humans. It frustrates me when something can't be automated the way I want or when simple actions require more effort than they should.

Let's say we want to convert a {{% highlighter %}}video from one format to another{{% /highlighter %}}. This often happens to me when I need to share a screencast video with colleagues on Slack. By default, macOS records in {{% highlighter %}}.MOV{{% /highlighter %}} format, which is too large to share. Sometimes, I also have another file that I want to shrink for easier sharing in a message.

Previously, I used a macOS GUI app to convert in .MP4, and the steps from start to finish were:
- Open the video converter app
- Click a button to select a file
- Select the output format
- Click the “Convert” button, wait
- Close the video converter app
- Find and delete the original .MOV file manually

Such a simple need, yet so many manual actions were required.

So I realized that I could use the powerful {{% highlighter %}}macOS Folder Actions{{% /highlighter %}} . I decided to use them as a trigger for my needs—any need. Drop the file in, and the folder action trigger does the job.

Here’s a quick demo of how much easier converting .MOV files into .MP4 has become with drag and drop. Drop a file, wait, and it's done. It’s pure magic! 

![](images/1.gif)

And original file deleted automatically as well.

## My Folder Actions List

After some time, I created folder actions for various tasks.

Need to convert .JPG to .WEBP? I have a folder for that.\
Need to download a Twitter video? I have a folder for that.

![](images/2.webp)

And it’s pretty easy to set up too.

## How to Set Up macOS Folder Actions

Please note that once you do the Folder Actions Setup, you can’t change the folder name without breaking the folder actions. If you rename the folder, you must reattach the folder actions again.

### Steps:
1. In Terminal: 

```sh
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
    /opt/homebrew/bin/ffmpeg -n -loglevel error -i "$f" -vcodec libx264 -crf 23 -preset ultrafast -tune film "$HOME/Library/Mobile\ Documents/com\~apple\~CloudDocs/Downloads/$(date +"%Y_%m_%d_%I_%M_%p_%s").mp4";
    rm -f "$f"
done
```

6. Save and exit.
7. Drag and drop a .MOV file into the folder. If it works, you should see gear icon in the menu bar. When it goes away - it means script is finished the task.

![](images/6.gif)

## Additional Folder Actions
### Convert Video to GIF

```sh
for f in "$@"; do
    /opt/homebrew/bin/ffmpeg -n -loglevel error -i "$f" -vf "fps=18,scale=720:-1:flags=lanczos" "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Downloads/$(date +"%Y_%m_%d_%I_%M_%p_%s").gif";
    rm -f "$f"
done
```

### Convert Image to WEBP:

First, install <a href="http://www.graphicsmagick.org/" target="_blank">GraphicsMagick</a>. GM is more efficient than ImageMagick so it gets the job done faster using fewer resources. GM is much smaller and lighter than ImageMagick (3-5X smaller installation footprint). 

```sh
brew install GraphicsMagick
```

Then use this code in Automator:

```sh
for f in "$@"; do
    /opt/homebrew/bin/gm convert "$f" -quality 70 "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Convert to WEBP$(date +"%Y_%m_%d_%I_%M_%p_%s").webp"
    rm -f "$f"
done
```

### macOS Folder Actions to Download YouTube Videos

1. In Terminal:

```sh
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

### Convert YouTube Videos to MP3 File Directly:
1. In Terminal:

```sh
brew install yt-dlp; brew install ffmpeg

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
        /opt/homebrew/bin/yt-dlp -x --audio-format mp3 --audio-quality 0 --ffmpeg-location /opt/homebrew/bin/ffmpeg -P "~/Downloads" "$url"
        
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

3. Drop a website URL directly into the folder.


### Convert .mov file to .mp4 and change the speed to 1.5x:

Change the output folder from /Users/alexander/Downloads/ to your user.
Change atempo=1.5 to any other speed you need.

1. In Terminal:

```sh
brew install ffmpeg

```

2. Use this script:

```sh
#!/bin/bash

# Process each input file
for f in "$@"; do
    echo "Processing file: $f"
    
    # Check if file is an MP4 or MOV
    if [[ "$f" == *.mp4 || "$f" == *.mov ]]; then
        # Generate output filename with current date (e.g., video_20250808.mp4)
        output_file="/Users/alexander/Downloads/video_$(date +%Y%m%d).mp4"
        
        echo "Converting $f to $output_file with 1.5x speed"
        
        # Run ffmpeg to speed up video and audio by 1.5x, converting to MP4
        /opt/homebrew/bin/ffmpeg -i "$f" -filter:v "setpts=0.666667*PTS" -filter:a "atempo=1.5" -c:v libx264 -c:a aac "$output_file"
        
        # Check if ffmpeg conversion was successful
        if [ $? -eq 0 ]; then
            echo "Conversion successful, removing original file: $f"
            rm -f "$f"
        else
            echo "Conversion failed for $f"
        fi
    else
        echo "Error: $f is not an MP4 or MOV file"
    fi
done
```

3. Drop a website URL directly into the folder.


## Folder Actions Tweaking
If you need to change a folder action, right-click on the folder and select **Folder Action Setup**.
![](images/7.webp)

All saved actions are stored in:
```sh
Macintosh HD / Users / YourName / Library / Workflows / Applications / Folder Actions/
```

It’s become so powerful that I’m willing to extend this system to even more actions. Because now you can turn a folder to an interface for any conmmand line app. So now my desktop is more useful than ever:

![](images/9.webp)

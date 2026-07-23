+++
title = "I Built a FreeBSD Cloud to Use with FreeBSD"
short_title = "My FreeBSD Cloud"
date = 2026-07-22T09:00:00+02:00
draft = false
featured = false
author = "Alexander Deplov"
tags = ["FreeBSD", "automation", "technology"]
headingAnchors = true
+++

At the moment, I’m working on my own window manager for FreeBSD, called Asterwm. The goal is to make its UX similar to macOS, so I can switch from Mac to FreeBSD during the day without having to readjust my muscle memory.

[![User interface for Asterwm](asterwm-for-freebsd.jpg)](asterwm-for-freebsd.jpg)
[![User interface for Asterwm](asterwm-for-freebsd-2.png)](asterwm-for-freebsd-2.png)


One of the most important things for me was being able to access both my work and personal files.

I know I could install ready-to-use software for Google Drive or something similar. But I decided to use the power of Codex to build my own cloud solution instead.

## Technical Stack of the FreeBSD Cloud

1. A simple VPS running FreeBSD 15 to manage files, syncing, and related tasks.
2. A Hetzner Storage Box, where the files are actually stored.
3. macOS, iOS, and Asterwm clients to manage files in the cloud: sending, receiving, modifying, and deleting them.

![Technical Stack of the FreeBSD Cloud](freebsd-cloud-technical-stack.jpg)

<br/>

<video playsinline autoplay loop muted>
  <source src="new-folder-in-asterwm.mp4" type="video/mp4">
</video>


## Roles

Every file is stored in the Hetzner Storage Box, but no client can talk to that box directly. Each client connects to the VPS to send, receive, update, or delete files. The FreeBSD server keeps track of changes, records them in SQL, and sends files to the Storage Box.

At the same time, the VPS resolves sync conflicts and notifies every client about changes.

<br/>
<blockquote class="mastodon-embed" data-embed-url="https://mastodon.social/@alex_deplov/116855231416692941/embed" style="background: #FCF8FF; border-radius: 8px; border: 1px solid #C9C4DA; margin: 0; max-width: 540px; min-width: 270px; overflow: hidden; padding: 0;"> <a href="https://mastodon.social/@alex_deplov/116855231416692941" target="_blank" style="align-items: center; color: #1C1A25; display: flex; flex-direction: column; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Roboto, sans-serif; font-size: 14px; justify-content: center; letter-spacing: 0.25px; line-height: 20px; padding: 24px; text-decoration: none;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 79 75"><path d="M63 45.3v-20c0-4.1-1-7.3-3.2-9.7-2.1-2.4-5-3.7-8.5-3.7-4.1 0-7.2 1.6-9.3 4.7l-2 3.3-2-3.3c-2-3.1-5.1-4.7-9.2-4.7-3.5 0-6.4 1.3-8.6 3.7-2.1 2.4-3.1 5.6-3.1 9.7v20h8V25.9c0-4.1 1.7-6.2 5.2-6.2 3.8 0 5.8 2.5 5.8 7.4V37.7H44V27.1c0-4.9 1.9-7.4 5.8-7.4 3.5 0 5.2 2.1 5.2 6.2V45.3h8ZM74.7 16.6c.6 6 .1 15.7.1 17.3 0 .5-.1 4.8-.1 5.3-.7 11.5-8 16-15.6 17.5-.1 0-.2 0-.3 0-4.9 1-10 1.2-14.9 1.4-1.2 0-2.4 0-3.6 0-4.8 0-9.7-.6-14.4-1.7-.1 0-.1 0-.1 0s-.1 0-.1 0 0 .1 0 .1 0 0 0 0c.1 1.6.4 3.1 1 4.5.6 1.7 2.9 5.7 11.4 5.7 5 0 9.9-.6 14.8-1.7 0 0 0 0 0 0 .1 0 .1 0 .1 0 0 .1 0 .1 0 .1.1 0 .1 0 .1.1v5.6s0 .1-.1.1c0 0 0 0 0 .1-1.6 1.1-3.7 1.7-5.6 2.3-.8.3-1.6.5-2.4.7-7.5 1.7-15.4 1.3-22.7-1.2-6.8-2.4-13.8-8.2-15.5-15.2-.9-3.8-1.6-7.6-1.9-11.5-.6-5.8-.6-11.7-.8-17.5C3.9 24.5 4 20 4.9 16 6.7 7.9 14.1 2.2 22.3 1c1.4-.2 4.1-1 16.5-1h.1C51.4 0 56.7.8 58.1 1c8.4 1.2 15.5 7.5 16.6 15.6Z" fill="currentColor"/></svg> <div style="color: #787588; margin-top: 16px;">Post by @alex_deplov@mastodon.social</div> <div style="font-weight: 500;">View on Mastodon</div> </a> </blockquote> <script data-allowed-prefixes="https://mastodon.social/" async src="https://mastodon.social/embed.js"></script>

## My Cloud Automation

Because I control every part of the cloud drive, I can also control its most interesting part: automation.

I made a folder called **Upscale by AI**, where I can drop any image file. The VPS runs a local 4xNomosWebPhoto_RealPLKSR model to upscale it while my main computer keeps running normally, without any extra load. 

![Technical Stack of the FreeBSD Cloud](freebsd-cloud-upscaled-by-ai.jpg)

I set the model’s CPU priority to low, so it does not affect the server much. Usually I need an image upscaled, but I do not care whether it takes two minutes or 15—it is not an urgent task.

Another automated folder uses FFmpeg to convert any dropped video to MP4 at 80% quality. Again, all I need to do is drop a file into a folder. The FreeBSD Cloud client uploads it to the FreeBSD server, runs the conversion, and replaces the original file. I automatically get the converted version without putting any load on the client machine.

## File Analysis by AI

At this point, I realized that I could run a local LLM to analyze small files and create additional metadata. Then, when I am looking for a specific file, I can find it quickly and accurately.

Not every file needs to be analyzed, of course. But text files, PDFs, images, videos, and similar files can benefit from it.

All analyzed data is stored alongside the file’s metadata. So if I am looking for a photo of a cat, I can find it without sending my personal data to big tech companies trying to get their dirty hands on my family photos. Haha.

## Keep Local Storage Clean

I set the rule to keep most files on the server rather than locally. When a new file arrives, the server creates a ghost file for the client, along with a thumbnail for images and videos.

The client is then notified that the file exists and downloads only its name and thumbnail, not the file itself.

When I need the file, I just double-click it to start downloading.

At the same time, each client has an option to select folders that should always stay downloaded. All files in those folders are downloaded automatically and never removed from the local cache.

<br/>
<blockquote class="mastodon-embed" data-embed-url="https://mastodon.social/@alex_deplov/116901032695717263/embed" style="background: #FCF8FF; border-radius: 8px; border: 1px solid #C9C4DA; margin: 0; max-width: 540px; min-width: 270px; overflow: hidden; padding: 0;"> <a href="https://mastodon.social/@alex_deplov/116901032695717263" target="_blank" style="align-items: center; color: #1C1A25; display: flex; flex-direction: column; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Roboto, sans-serif; font-size: 14px; justify-content: center; letter-spacing: 0.25px; line-height: 20px; padding: 24px; text-decoration: none;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 79 75"><path d="M63 45.3v-20c0-4.1-1-7.3-3.2-9.7-2.1-2.4-5-3.7-8.5-3.7-4.1 0-7.2 1.6-9.3 4.7l-2 3.3-2-3.3c-2-3.1-5.1-4.7-9.2-4.7-3.5 0-6.4 1.3-8.6 3.7-2.1 2.4-3.1 5.6-3.1 9.7v20h8V25.9c0-4.1 1.7-6.2 5.2-6.2 3.8 0 5.8 2.5 5.8 7.4V37.7H44V27.1c0-4.9 1.9-7.4 5.8-7.4 3.5 0 5.2 2.1 5.2 6.2V45.3h8ZM74.7 16.6c.6 6 .1 15.7.1 17.3 0 .5-.1 4.8-.1 5.3-.7 11.5-8 16-15.6 17.5-.1 0-.2 0-.3 0-4.9 1-10 1.2-14.9 1.4-1.2 0-2.4 0-3.6 0-4.8 0-9.7-.6-14.4-1.7-.1 0-.1 0-.1 0s-.1 0-.1 0 0 .1 0 .1 0 0 0 0c.1 1.6.4 3.1 1 4.5.6 1.7 2.9 5.7 11.4 5.7 5 0 9.9-.6 14.8-1.7 0 0 0 0 0 0 .1 0 .1 0 .1 0 0 .1 0 .1 0 .1.1 0 .1 0 .1.1v5.6s0 .1-.1.1c0 0 0 0 0 .1-1.6 1.1-3.7 1.7-5.6 2.3-.8.3-1.6.5-2.4.7-7.5 1.7-15.4 1.3-22.7-1.2-6.8-2.4-13.8-8.2-15.5-15.2-.9-3.8-1.6-7.6-1.9-11.5-.6-5.8-.6-11.7-.8-17.5C3.9 24.5 4 20 4.9 16 6.7 7.9 14.1 2.2 22.3 1c1.4-.2 4.1-1 16.5-1h.1C51.4 0 56.7.8 58.1 1c8.4 1.2 15.5 7.5 16.6 15.6Z" fill="currentColor"/></svg> <div style="color: #787588; margin-top: 16px;">Post by @alex_deplov@mastodon.social</div> <div style="font-weight: 500;">View on Mastodon</div> </a> </blockquote> <script data-allowed-prefixes="https://mastodon.social/" async src="https://mastodon.social/embed.js"></script>

## Unique Feature for Asterwm

In Asterwm I set it to download not 1, but 4 thumbnails for video files. So I can hover it to see what’s inside without even downloading the file. 

<br/>

<video playsinline autoplay loop muted>
  <source src="video-files-hover-in-asterwm.mp4" type="video/mp4">
</video>

All thumbnails generated once cached on the server, so if requested by other client, it will be existed already. 


## Cloud Trash

Each deleted file goes to the server’s Trash folder, so I can restore it within **N** days.

The best part is that I control how many days deleted files are kept. I can even set different automatic deletion periods for different folders.

## Further Plans

Currently, I’m performing a smoke test. Before I can use it daily, I need to ensure that it works well without losing any data. 

I also need to create a system that automatically sorts dropped files into subfolders. 
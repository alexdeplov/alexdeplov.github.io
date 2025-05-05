+++
title = 'Can cheap MiniPC with FreeBSD 14 outperform MacBook Pro M1 Pro?'
date = 2025-02-05T22:25:51+01:00  
draft = false
featured = false
author = "Alexander Deplov"
+++

### TL;DR

> I put my €1800 MacBook Pro M1 Pro head-to-head with a €300 mini PC and found the cheaper option surprisingly fast. While the mini PC couldn't completely replace my Mac for work due to some software and hardware limitations, it made me question the need for expensive purchases. Do we really need the latest and greatest hardware to be productive? Or are we being pushed to constantly upgrade for features we might not even fully utilize?

### Introduction

I often wonder how much computing power we need to strike a balance between "fast enough to use comfortably" and "overpowered and overpriced so you never use it to its full potential"?

Slow computer hardware frustrates me. If you can **think faster** than your computer or perform operations quickly, but it takes "time to think while showing you a beach ball," you're wasting your time. When a computer takes seconds to think "here" and another few seconds "there," it adds up to hours of wasted time over the years. Additionally, waiting for the computer to finish operations fragments your attention significantly.

I know this from experience. Growing up with slow dial-up modems in the 90s, I had to wait several seconds, sometimes even dozens of seconds, for a web page with all its images to fully load. Since then, I've developed a habit of getting distracted by other tasks too often while working.

For me, having a fast computer is both a way to stay focused and save time.

But I often wonder: how much computing power is enough?

As a longtime Mac user, I decided to look for a cheap alternative by installing FreeBSD to see what I could achieve.

Why FreeBSD? Simply because I had experience with it in 90s. I understand its principles better than Linux (which has evolved in different directions over time). For me, FreeBSD has always been about efficiency multiplied by customizability. I was aware of the problems with Wi-Fi, but since I mostly use an Ethernet connection, the Wi-Fi issues weren't an obstacle. 

### €1800 MacBook Pro vs. €300 Mini PC review

My MacBook Pro M1 Pro, which cost around €1800, has the following specs:
- 10 CPU cores (8 performance and 2 efficiency)
- 16 GB of RAM, LPDDR5
- SSD hard drive
- macOS Sequoia

For this test, I bought a mini PC with the following specs:
- Mini PC Beelink SER5 5560U, AMD Ryzen 5 with integrated CPU (Cezanne Radeon Vega)
- 16 GB RAM, DDR4
- M.2 NVMe SSD
- FreeBSD 14.0

I installed FreeBSD 14.0, Xfce, and Firefox.

![](images/1.jpg)

After some basic tweaking [using this amazing guide](https://vermaden.wordpress.com/2018/03/29/freebsd-desktop-part-1-simplified-boot/), FreeBSD achieved the same boot time as my expensive MacBook.

<blockquote class="mastodon-embed" data-embed-url="https://mastodon.social/@alex_deplov/113066422708143286/embed" style="background: #FCF8FF; border-radius: 8px; border: 1px solid #C9C4DA; margin: 0; max-width: 540px; min-width: 270px; overflow: hidden; padding: 0;"> <a href="https://mastodon.social/@alex_deplov/113066422708143286" target="_blank" style="align-items: center; color: #1C1A25; display: flex; flex-direction: column; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Roboto, sans-serif; font-size: 14px; justify-content: center; letter-spacing: 0.25px; line-height: 20px; padding: 24px; text-decoration: none;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 79 75"><path d="M63 45.3v-20c0-4.1-1-7.3-3.2-9.7-2.1-2.4-5-3.7-8.5-3.7-4.1 0-7.2 1.6-9.3 4.7l-2 3.3-2-3.3c-2-3.1-5.1-4.7-9.2-4.7-3.5 0-6.4 1.3-8.6 3.7-2.1 2.4-3.1 5.6-3.1 9.7v20h8V25.9c0-4.1 1.7-6.2 5.2-6.2 3.8 0 5.8 2.5 5.8 7.4V37.7H44V27.1c0-4.9 1.9-7.4 5.8-7.4 3.5 0 5.2 2.1 5.2 6.2V45.3h8ZM74.7 16.6c.6 6 .1 15.7.1 17.3 0 .5-.1 4.8-.1 5.3-.7 11.5-8 16-15.6 17.5-.1 0-.2 0-.3 0-4.9 1-10 1.2-14.9 1.4-1.2 0-2.4 0-3.6 0-4.8 0-9.7-.6-14.4-1.7-.1 0-.1 0-.1 0s-.1 0-.1 0 0 .1 0 .1 0 0 0 0c.1 1.6.4 3.1 1 4.5.6 1.7 2.9 5.7 11.4 5.7 5 0 9.9-.6 14.8-1.7 0 0 0 0 0 0 .1 0 .1 0 .1 0 0 .1 0 .1 0 .1.1 0 .1 0 .1.1v5.6s0 .1-.1.1c0 0 0 0 0 .1-1.6 1.1-3.7 1.7-5.6 2.3-.8.3-1.6.5-2.4.7-7.5 1.7-15.4 1.3-22.7-1.2-6.8-2.4-13.8-8.2-15.5-15.2-.9-3.8-1.6-7.6-1.9-11.5-.6-5.8-.6-11.7-.8-17.5C3.9 24.5 4 20 4.9 16 6.7 7.9 14.1 2.2 22.3 1c1.4-.2 4.1-1 16.5-1h.1C51.4 0 56.7.8 58.1 1c8.4 1.2 15.5 7.5 16.6 15.6Z" fill="currentColor"/></svg> <div style="color: #787588; margin-top: 16px;">Post by @alex_deplov@mastodon.social</div> <div style="font-weight: 500;">View on Mastodon</div> </a> </blockquote> <script data-allowed-prefixes="https://mastodon.social/" async src="https://mastodon.social/embed.js"></script>

### The good

Surprisingly, Firefox was able to play YouTube videos faster than on the Mac. It felt as if videos were loading from local storage every time I clicked somewhere on the timeline. The Mac would take a fraction of a second to resume playback with the same version of Firefox. Both machines were connected via Ethernet cable during testing, not Wi-Fi.

CPU usage on FreeBSD was nearly idle at 0-0.5% across a couple of cores. Impressive! With the same applications on macOS, I typically see about 10-20% usage across several cores when idle.

I believe macOS is accumulating more and more unnecessary features, each of which occupies memory and uses CPU even when not actively used. Features like video wallpapers, desktop widgets, handoff, photo library analysis, and so on. Some of these are built into macOS, so you can't completely disable them even if you're not using them.

At one point, I experimented with Motif Window Manager (MWM), which uses no more than 25MB (MB!!) of RAM. On macOS, it's usually 10 times more. Impressive.

After completing the test, I realized that I couldn't completely switch platforms. Without Zoom, Figma, and other specific software, and considering the font rendering issues, I couldn't use the mini-PC running FreeBSD as my main work computer. Figma works fine in Firefox, but I couldn't get it to read local fonts, which was critical for me. And as an Apple developer and iOS/Mac interface designer, I still need to use macOS.

This experiment showed me the impressive capabilities of low-cost hardware. If you can work with FreeBSD, you don't need to replace your computer every 5 years or so. However, with each macOS update, Apple adds more features, driven primarily by marketing to achieve more sales. In reality, we all — existing and new users — pay for this, as more features require more powerful hardware to run well, forcing us to upgrade. Consequently, Mac users get less value for their money.

Ultimately, I was pleased to discover that a €300 mini PC can run most basic tasks at the same speed as an €1800 Mac.

[This video of FreeBSD running on a white MacBook 2009](https://www.youtube.com/watch?v=3scLHnwwgn0) impressed me. Most applications open almost instantly. Meanwhile, my 2017 MacBook struggles to run its latest supported macOS version smoothly! Remarkably, a 15-year-old white MacBook running FreeBSD performs better than an 8-year-old 2017 MacBook running macOS.

This indicates we're somewhat locked into Apple's hardware ecosystem, paying more than necessary, and this situation is unlikely to change soon, if ever. I'll continue experimenting with FreeBSD as a side project, hoping that the FreeBSD Foundation will invest more in the desktop experience, as they recently promised.
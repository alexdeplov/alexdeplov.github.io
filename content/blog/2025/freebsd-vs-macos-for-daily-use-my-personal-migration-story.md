---
title: "FreeBSD vs macOS for Daily Use: My Personal Migration Story"
date: 2025-05-19T22:15:36+02:00
draft: false
---


As a designer I've been using macOS since 2005, but with each new update, I dislike where Apple is going. They add unnecessary features that use system resources and can't be turned off. If your Mac can't handle macOS, the only solution is to buy a more powerful Mac. This is probably okay; people upgrade their hardware from time to time, and this is part of the evolution of the field. However, Apple can abandon any five-year-old Mac as obsolete. In my opinion, though, a five-year-old computer can still handle many things and should have enough power to be fast enough. That would be true if macOS didn't outgrow the hardware so quickly.

To make macOS last longer and remove unnecessary features from the system, I decided to learn more about how macOS works. To my surprise, I found that it was very similar to my past FreeBSD experience.
- Both Unix
- macOS has many terminal apps that I've seen before, such as top, ps, and ifconfig.
- Bash, Zsh, and Tcsh.
- As we know, Apple only uses [part of FreeBSD in their kernel](https://youtu.be/ton0ZaGKOsc?si=k0AB804p5UVxevEz). 
- Services called "daemons" are also present, just like in FreeBSD.
- macOS and FreeBSD share a similar file system hierarchy: ~/ for the user folder, ~/Desktop, ~/Downlods and so on.
- System directories such as /etc, /bin, /usr, etc.
- The man page is very similar to FreeBSD.

After discovering all these similarities, I started thinking that, instead of trying to do something with macOS (which is closed and restrictive), it might make more sense to focus on FreeBSD, where I have full control and can change how things work.

I had some experience with FreeBSD 4.5 on my old 486 IBM PC, but after 20 years, I decided to refresh my knowledge and see how far I could go.

## In this experiment, I switched from macOS to FreeBSD to achieve the following goals:

- To compare the performance of both systems for desktop usage. This is important because Macs are expensive. What hardware will be needed to comfortably use one in 2025? In this comparison, I pit a $2,000 MacBook Pro M1 Pro against a $300 MiniPC. As you may recall, the introduction of the M1 processor was a significant event for Apple, marking the beginning of a new era of speed an optimization.
- I wanted to tweak FreeBSD to match macOS as closely as possible so that, when switching from a working computer to FreeBSD, I would have a similar experience.
- To show my friends and the world that there is a good alternative to macOS that is not Windows or Linux.

Before I begin, here are my quick tests for both systems. I'm running mostly apps that I've used before to see how quickly each one can be run and how responsive they feel during the initial launch and subsequent usage.


## YouTube video loading in Firefox on FreeBSD vs macOS
<div class="break-inside-avoid rounded-md overflow-hidden mt-5" title="YouTube video loading in Firefox on FreeBSD vs macOS">
<video class="" loop muted playsinline controls>
    <source src="youtube.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
</div>

## Open an image on FreeBSD vs on macOS
<div class="break-inside-avoid rounded-md overflow-hidden mt-5" title="Open an image on FreeBSD vs on macOS">
<video class="" loop muted playsinline controls>
    <source src="open-image.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
</div>

## Play a video on FreeBSD vs on macOS
<div class="break-inside-avoid rounded-md overflow-hidden mt-5" title="Play a video on FreeBSD vs on macOS">
<video class="" loop muted playsinline controls>
    <source src="vlc.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
</div>

## Open the Photos app on FreeBSD vs on macOS
<div class="break-inside-avoid rounded-md overflow-hidden mt-5" title="Open the Photos app on FreeBSD vs on macOS">
<video class="" loop muted playsinline controls>
    <source src="photos-app.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
</div>

## Hardware

<table class="table-auto w-full text-left text-sm mt-10">
  <thead class="">
    <tr>
      <th class="border px-4 py-2"></th>
      <th class="border px-4 py-2">FreeBSD System on mini PC</th>
      <th class="border px-4 py-2">MacBook Pro M1 Pro</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border px-4 py-2">CPU</td>
      <td class="border px-4 py-2">AMD Ryzen 5 5560U (6 cores / 12 threads, Zen 3)</td>
      <td class="border px-4 py-2">10-core (8 performance and 2 efficiency)</td>
    </tr>
    <tr>
      <td class="border px-4 py-2">GPU</td>
      <td class="border px-4 py-2">Radeon Vega (Cezanne, amdgpu)</td>
      <td class="border px-4 py-2">Integrated M1 Pro GPU</td>
    </tr>
    <tr>
      <td class="border px-4 py-2">RAM</td>
      <td class="border px-4 py-2">16 GB DDR4</td>
      <td class="border px-4 py-2">16 GB LPDDR5</td>
    </tr>
    <tr>
      <td class="border px-4 py-2">Storage</td>
      <td class="border px-4 py-2">512 GB M.2 NVMe SSD</td>
      <td class="border px-4 py-2">Built-in SSD 512 GB</td>
    </tr>
    <tr>
      <td class="border px-4 py-2">Network</td>
      <td class="border px-4 py-2">Realtek RTL8111/8168</td>
      <td class="border px-4 py-2">Built-in Ethernet (via adapter)</td>
    </tr>
    <tr>
      <td class="border px-4 py-2">Wi-Fi</td>
      <td class="border px-4 py-2">Intel AX200 (iwlwifi)</td>
      <td class="border px-4 py-2">Built-in Wi-Fi 6</td>
    </tr>
    <tr>
      <td class="border px-4 py-2">WM / OS</td>
      <td class="border px-4 py-2">MATE on FreeBSD</td>
      <td class="border px-4 py-2">macOS Sequoia 15.4.1</td>
    </tr>
  </tbody>
</table>

### Resources

FreeBSD, htop:
![](./htop-freebsd.png)

macOS, htop:
![](./htop-macos.png)

FreeBSD, top:
![](./top-freebsd.png)

macOS, top:
![](./top-macos.png)



## FreeBSD Settings to Match macOS Behavior

If you already have FreeBSD installed, you can follow my approach to make it look and operate more like macOS. I'm using MATE because it runs faster than Xfce on my computer.

## Enable vsync


```sh
/usr/local/etc/X11/xorg.conf.d/20-amdgpu.conf 

Section "Device"
    Identifier "AMD Graphics"
    Driver "amdgpu"
    Option "TearFree" "true"
EndSection
```

## Replaced MATE's UI fonts to SF Pro Display

  1. Install <a href="https://github.com/sahibjotsaggu/San-Francisco-Pro-Fonts" target="_blank">SF Pro Display, Regular</a> and set it as default in MATE's UI.</p>
  2. To set MATE's font rendering similar to macOS I connected both computers to my 1080p monitor and made screenshots on both operating systems, then step by step I tried to achieve similarity **as close as possible** by using Figma and zoom tool and different FreeType font rendering settings. Here is result that I achieved:
  
  ![](./font-rendering-results.png)

  <video class="mb-5" autoplay loop muted playsinline>
    <source src="fonts-compare.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>    

To achive that add this:

  ```sh
    ~/.profile

    export FREETYPE_PROPERTIES="cff:no-stem-darkening=0.0 autofitter:no-stem-darkening=0.0"
  ```

  Set Smoothing to Grayscale and Hinting to None (I also set font size to be 10 and DPI to 95):

   ![](./fonts-smoothing.png)



  3. For console I'm using <a href="https://github.com/supercomputra/SF-Mono-Font" target="_blank">SF Mono.</a>

</details>


## Mate Settings

Then I changed MATE's most common shortcuts to:
- CMD + Tab to app switch
- CMD + M to minimize
- CMD + Q to close app
- CMD + W to close tabs
- CMD + H to hide apps

I decided not to use [Picom](https://www.freshports.org/x11-wm/picom/) because I wanted to achieve better performance.

## Firefox Settings

To change CTRL to CMD in Firefox go to about:profiles, find the Default Profile (marked "Yes"), open that folder, and create a user.js file with the following content:

```sh
user_pref("ui.key.accelKey", 224);
```

To disable the ability to open the menu by pressing Alt (since it's often pressed accidentally), add the following in about:config:

```sh
ui.key.menuAccessKeyFocuses: false
```

## Apps Performance 

In order to achieve better performance, I'm using the [ports compilation to my hardware method](https://docs.freebsd.org/en/books/handbook/ports/#ports-using) (make clean) instead of installing from packages (pkg install), inspired by this video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/zboBAUOhyws?si=Bqwdt2f3IoYotwo8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

I also started using the [Synth app](https://man.freebsd.org/cgi/man.cgi?query=synth&sektion=1&manpath=freebsd-release-ports) for that.

## macOS Wallpapers

![](./freebsd-desktop.png)

My favorite wallpapers are from [macOS Sequoia and macOS Ventura](https://512pixels.net/projects/default-mac-wallpapers-in-5k/). 

## Mate Theme & Icons & Cursors
Will be added soon.

## Dock 

Will be added soon.


## FreeBSD Desktop Project

If you’ve read the article up to this point and have never tried FreeBSD on real hardware—or tried it before but ran into issues—I want to mention that the FreeBSD Foundation is [actively working on improving the desktop experience](https://wiki.freebsd.org/LaptopDesktopWorkingGroup).
---
title: "Comparing Performance of MacBook Pro M1 Pro to mini PC on FreeBSD"
date: 2025-05-19T22:15:36+02:00
draft: false
---

As a designer I've been using macOS since 2005, but with each new update, I dislike the direction Apple is heading in. They add unnecessary features that use system resources and can't be disabled. My seven-year-old MacBook Pro with an Intel processor became so slow and unresponsive with the latest macOS version that I can't use it at all anymore. If your Mac can't handle the latest macOS version, the only solution is to buy a more powerful Mac. This is probably fine, people upgrade their hardware from time to time, and this is part of the evolution of the field. However, Apple can deem any five-year-old Mac obsolete. It seems like they have more control over your computer than you do.

In order to optimize macOS and turn off unnecessary system services, I decided to learn deeply about how macOS works. I was surprised to find that it was very similar to my past experience with FreeBSD:

- Both Unix or Unix-like.
- macOS has many terminal apps that I've seen before, such as top, ps, dmesg, and ifconfig.
- Bash, Zsh, and Tcsh.
- As we know, Apple only uses [part of FreeBSD in their kernel](https://youtu.be/ton0ZaGKOsc?si=k0AB804p5UVxevEz). 
- Services called "daemons".
- macOS and FreeBSD share a similar file system hierarchy: ~/ for the user folder, ~/Desktop, ~/Downlods and so on.
- System directories such as /etc, /bin, /usr, etc.
- The man page.

After discovering all these similarities, I started thinking that it might make more sense to focus on FreeBSD than on macOS, which is closed and highly restrictive. With FreeBSD, I have full control and can change how things work.

I had some experience with FreeBSD 4.5 on my old 486 IBM PC, but after 20 years, I decided to refresh my knowledge and see how far I could go.

## In this experiment, I switched from macOS to FreeBSD to achieve the following goals:

- To compare the performance of both systems for desktop usage. This is important because Macs are expensive. What hardware will we need to comfortably use a desktop in 2025? For this comparison, I pitted a $1800 MacBook Pro with an M1 Pro processor against a $300 Mini PC.
- To tweak FreeBSD to closely match the macOS look and feel so that when I switch from my working computer to FreeBSD, the experience is similar.
- To show my friends and the world that there is a good alternative to macOS besides Windows or Linux.

Before I begin, here are my quick test results for both operating systems. I ran desktop apps on each operating system to see how quickly they could be launched and how responsive they felt during initial and subsequent usage.


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
      <th class="border px-4 py-2">FreeBSD on Mini PC, Beelink SER5 5560U</th>
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
      <td class="border px-4 py-2"><a href="https://www.amazon.de/dp/B0C58GBT93?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1" target="_blank">512 GB M.2 NVMe SSD, 7200 MB/s Read, 6600 MB/s Write</a></td>
      <td class="border px-4 py-2">Built-in SSD 512 GB (5500 MB/s Read, 5000 MB/s Write)</td>
    </tr>
    <tr>
      <td class="border px-4 py-2">Network</td>
      <td class="border px-4 py-2">Realtek RTL8111/8168</td>
      <td class="border px-4 py-2">Ethernet via adapter</td>
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
    <tr>
      <td class="border px-4 py-2">Price</td>
      <td class="border px-4 py-2">€299 mini PC, €50 SSD</td>
      <td class="border px-4 py-2">$1800</td>
    </tr>
  </tbody>
</table>

When I tell people that a $300 AMD mini PC can keep up with an $1800 M1 Pro MacBook in daily use, the first reaction is disbelief. How is this even possible? As you may recall, the introduction of the M1 processor was a significant event for Apple, marking the beginning of a new era of speed an optimization.

I guess the answer lies in the efficiency of FreeBSD and the lack of unnecessary background processes, also on fast SSD. Unlike macOS, which runs a lot of services (daemons) in the background, some of which can’t even be disabled, FreeBSD gives you full control. Combined with lightweight desktop environments like MATE and compiled apps optimized for your specific hardware, the system feels snappy—even on budget CPUs.

### Where Performance Declines

My budget mini PC isn’t perfect for everything. One clear limitation is graphics performance. The integrated Radeon Vega GPU is not very powerful by today’s standards, and that becomes noticeable in GPU-intensive applications like Blender. While basic 3D previews and light modeling work are possible, rendering times are much longer compared to macOS on the M1 Pro, and viewport performance can lag when working with complex scenes. If you're doing serious 3D work or GPU-heavy tasks, this setup quickly shows its limits.

### Resource Usage When No Apps Are Open

FreeBSD, htop:
![](./htop-freebsd.png)

macOS, htop:
![](./htop-macos.png)


## Apps Performance

Inspired by this video, I tried using [ports](https://docs.freebsd.org/en/books/handbook/ports/#ports-using), but I can't say for sure if they provide any performance improvements compared to installing from packages (pkg install). If you know the answer for sure, please send me a message at the bottom of the article.

<div class="relative w-full pt-[56.25%]">
  <iframe
    class="absolute top-0 left-0 w-full h-full"
    src="https://www.youtube.com/embed/zboBAUOhyws?si=Bqwdt2f3IoYotwo8"
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen>
  </iframe>
</div>

## FreeBSD Desktop Project

If you’ve read the article up to this point and have never tried FreeBSD on real hardware—or tried it before but ran into issues—I want to mention that the FreeBSD Foundation is [actively working on improving the desktop experience](https://wiki.freebsd.org/LaptopDesktopWorkingGroup).

---

## Similar Articles

- [MATE on FreeBSD: macOS-Like Setup Guide: Font Rendering, UI Tweaks, and Settings](https://interfacecraft.online/blog/2025/mate-on-freebsd-macos-like-setup-guide-font-rendering-ui-tweaks-and-settings/)

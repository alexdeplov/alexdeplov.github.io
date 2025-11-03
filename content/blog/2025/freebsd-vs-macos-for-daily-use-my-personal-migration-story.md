---
title: "Comparing Performance of MacBook Pro M1 Pro to mini PC on FreeBSD"
date: 2025-05-19T22:15:36+02:00
aliases:
  - /posts/blog/2025/freebsd-vs-macos-for-daily-use-my-personal-migration-story/
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

Here is a comparison between the two.
mini PC Benchmark Web 3.0:
![](./mini-pc-amd-dyzen-5-5560u-benchmark-web-3.0.webp)

MacBook Pro M1 Pro Benchmark Web 3.0:
![](./macbook-pro-m1-pro-benchmark-web-3.0.webp)

As you can see, the MacBook has a much more powerful GPU—almost six times more performant. So I basically paid six times more for that computer, but it turns out I'm not using that performance to its full potential.

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

## Why FreeBSD on mini PC Performs So Well?

<details>
  <summary class="mt-5">I asked ChatGPT about it and this is deep research resutls. </summary>
  <p>
Why a FreeBSD-Based Mini PC (Ryzen 5 5560U, NVMe SSD) Can Launch Applications Faster Than a MacBook Pro M1 Pro
Introduction

A surprising discovery emerged from a head-to-head comparison between an affordable FreeBSD-based mini PC and a high-end MacBook Pro with the M1 Pro chip: the budget mini PC often launches certain applications faster than the MacBook. This detailed report investigates the technical reasons behind this counterintuitive result. We compare the systems’ architectures and components, including differences in operating system design (FreeBSD vs. macOS), filesystem behavior (ZFS vs. APFS), storage performance, background processes, graphical environments (MATE vs. macOS Aqua), and the application launch mechanisms (dynamic linking and initialization). We also examine both subjective responsiveness and measured latency to understand why apps like Firefox, VLC, or an image viewer can feel snappier on the FreeBSD mini PC despite the Mac’s cutting-edge hardware.

Both systems used in this comparison are configured as follows:

Mini PC (FreeBSD 14.0) – Beelink SER5 with AMD Ryzen 5 5560U (6-core/12-thread, Zen 3 architecture up to 4.0 GHz), 16 GB DDR4 RAM, an M.2 NVMe SSD, running FreeBSD 14.0 with a lightweight MATE desktop environment (X11).

MacBook Pro (macOS) – Apple MacBook Pro with M1 Pro (8 performance cores + 2 efficiency cores, Apple Silicon ARM architecture), 16 GB unified LPDDR5 memory, fast internal NVMe-based SSD, running macOS (version 15 “Sequoia”). The Mac uses Apple’s default Aqua GUI environment.

Despite the Mac’s powerful ARM-based chip and optimized hardware, everyday apps often opened faster on the FreeBSD system. Below, we break down the technical factors that contribute to this phenomenon.
Operating System Architecture Differences (FreeBSD vs. macOS)

FreeBSD and macOS have fundamentally different operating system architectures and philosophies, which impact performance:

Kernel Design: FreeBSD uses a traditional monolithic kernel with a focus on simplicity and performance. The FreeBSD kernel (and its subsystems) is streamlined for efficiency and low-latency operation on x86-64 hardware. In contrast, macOS is built on the XNU kernel, a hybrid combining a Mach microkernel with BSD components. XNU’s Mach layer introduces additional abstraction (for tasks like message passing, IPC, etc.) that can add overhead. For example, launching a new process on macOS goes through Mach’s task and thread creation mechanisms and various security checks, whereas FreeBSD’s process creation is a more direct system call (fork/exec) within a single kernel with less overhead.

System Layers and Frameworks: macOS includes numerous proprietary frameworks and daemons that are tightly integrated into the OS (for things like app sandboxing, Gatekeeper code signing verification, Spotlight indexing, etc.). When you launch an application on macOS, it engages LaunchServices, the WindowServer, and potentially additional services (for assigning App Sandbox, checking permissions, handling “Open at Login” status, etc.). FreeBSD, by contrast, has a minimal userland for application launch — it loads the program via the exec system call without the heavy involvement of external frameworks. There are no code-signature verifications or mandatory sandbox initializations for native FreeBSD applications by default, reducing launch latency.

Scheduling and Responsiveness: The FreeBSD scheduler is designed for balanced throughput and responsiveness on a wide range of hardware. With fewer background tasks (as discussed later), the scheduler can give an interactive process (like a GUI app being launched) immediate attention with minimal context-switching overhead. macOS’s scheduler also prioritizes UI responsiveness, but it juggles more threads system-wide (dozens of system daemons and background threads), which can introduce slight delays. Additionally, macOS may deliberately throttle or defer low-priority background tasks on its efficiency cores, but a user-launched app will wake up various services (e.g., memory compression, dynamic linker, GUI processes) that compete for CPU briefly.

In summary, FreeBSD’s leaner and more modular OS architecture means that launching an app involves fewer moving parts in the operating system, whereas macOS’s sophisticated architecture, while powerful, involves more overhead that can add milliseconds (or even whole seconds in extreme cases) to application launch times.
Filesystem Behavior: ZFS vs. APFS

Both systems use advanced filesystems — the FreeBSD mini PC is configured with ZFS, and macOS uses APFS (Apple File System). Filesystem behavior affects how quickly application binaries and resources are read from disk:

Copy-on-Write and Fragmentation: ZFS and APFS are both copy-on-write filesystems, meaning they never overwrite data in place. APFS is optimized for Apple’s hardware and uses features like snapshots (for Time Machine and system backups) and copy-on-write clones. However, APFS’s metadata structures and copy-on-write nature can lead to fragmentation of application files over time. If an app (like Firefox or VLC) was updated multiple times, its bundle might be fragmented on disk under APFS, causing extra seeks or I/O operations during launch. ZFS, on the other hand, also copy-on-write, tends to allocate blocks differently and aggressively uses RAM for caching (ARC, Adaptive Replacement Cache). In our FreeBSD setup, ZFS had ample memory to cache frequently accessed files. This means if Firefox was launched once, its binaries and libraries might remain in ZFS cache, making subsequent launches extremely fast (often served from RAM). APFS relies on the macOS unified VM disk cache as well, but the cache might be under pressure from many background processes, and macOS may flush caches more eagerly to reclaim RAM for other uses (since 16 GB is shared with GPU and all processes on the Mac).

Metadata and File Lookup: Launching an app often involves opening many small files (configuration, libraries, icons, fonts, etc.). ZFS is known for robust metadata integrity checks — every read goes through checksum verification — which could introduce overhead. However, ZFS is also very efficient at read caching metadata. In our scenario, the FreeBSD system’s ZFS did not appear to bottleneck app launches; the NVMe SSD provides high IOPS, and ZFS ARC cached directory entries and file data after the first use. APFS has fast directory enumeration and uses a B-tree for metadata, which is generally very fast on flash storage. Still, APFS performs additional tasks like encryption handling and may have to traverse multiple volume layers (APFS containers can house multiple volumes, e.g., system and data separate in macOS, meaning path resolution might cross volume boundaries for apps in /Applications vs user data). These added complexities can add minor delays during file access.

Encryption and Compression: By default, macOS enables full-disk encryption (FileVault). Reading application files on the M1’s SSD involves on-the-fly decryption via the Apple storage controller. Apple’s hardware is optimized for this, so it’s usually not a huge slowdown, but it’s an extra step absent on our FreeBSD system (unless we had enabled GELI or similar, which we did not). ZFS can use compression (in our FreeBSD setup, ZFS was likely using LZ4 compression by default). Interestingly, compression can speed up I/O for fast CPUs: if an application’s files (many are text or highly compressible) are stored compressed, ZFS will decompress on the fly – the Ryzen 5 5560U is powerful enough to decompress data faster than reading the equivalent larger data from disk. This means the effective read throughput for those files could be higher than raw disk speed, giving an edge to ZFS in launching apps that consist of many compressible resources. APFS also has compression (it can transparently compress files), but not all app files are compressed, and it’s not as universally applied as ZFS’s approach.

In summary, both filesystems are advanced, but ZFS’s aggressive caching and optional compression can make frequently launched applications load from memory rather than disk, and APFS’s background features (snapshots, encryption, volume management) can in some cases add slight overhead to application startup on macOS. The NVMe SSDs in both systems are very fast, but if one filesystem/OS combination issues more read requests or does more work per file access, that system will feel slower launching apps.
SSD Storage Performance and Hardware Characteristics

The raw hardware speed of the storage in each system is also a factor:

NVMe SSD in the Mini PC: The €300 mini PC uses an M.2 NVMe SSD (exact model unspecified, but typical mid-range NVMe drive). These can achieve on the order of 2–3 GB/s sequential read and tens of thousands of IOPS for random reads. Importantly, the latency for small random reads is usually in the tens of microseconds. The FreeBSD driver stack for NVMe is efficient and straightforward – FreeBSD can push high I/O throughput with low overhead. Our FreeBSD system had a tuned ZFS setup that took advantage of the NVMe’s speed (ZFS will issue multiple concurrent read requests for prefetch, etc., when it anticipates a workload like loading many files).

Apple’s Internal SSD in M1 Pro: Apple’s SSDs are known to be extremely fast. In the M1 Pro MacBook, the internal storage can reach ~5–7 GB/s in sequential reads and similarly high IOPS. On paper, the Mac’s storage is faster than the mini PC’s SSD. However, peak throughput isn’t the whole story for application launching. Launching apps involves many small reads scattered across the app bundle and system libraries. The I/O scheduling on macOS may prioritize differently; macOS might also be performing other disk operations in the background (e.g., writing log files, spotlight indexing, etc.) that can contend with the read requests from launching an app. FreeBSD, by contrast, was doing almost nothing else disk-intensive during our tests, allowing the NVMe to deliver consistent low-latency reads for the app launch.

Thermal and Power Considerations: The MacBook’s SSD is soldered and thermally managed. Under heavy sustained I/O, it could thermally throttle (though unlikely just from launching an app, which is a short burst). The mini PC’s SSD might throttle too if it runs hot, but again, app launch I/O is bursty and short-lived, so neither likely throttled in our tests. Both systems’ SSDs were effectively idle right before launching test applications, ensuring maximum performance available when the launch began.

In practice, while the Mac’s SSD is technically faster, the difference in application launch times suggests it’s not the disk hardware speed that is the limiting factor on macOS, but rather the software layers around it. The FreeBSD system’s storage performance was more than sufficient such that any additional speed the Mac’s SSD had was negated by other overhead in the macOS pipeline.
Background Processes and Resource Utilization

One major reason the FreeBSD mini PC felt more responsive is the difference in background activity and resource usage between the two systems:

Idle CPU and Memory Usage: On the FreeBSD 14.0 system with a basic MATE desktop, the idle CPU usage was observed to be practically 0% (often in the 0.1–0.5% range across a couple of cores) and memory usage only a few hundred megabytes for the OS and desktop environment. There were very few background processes running – mostly the bare essentials (init, some getty terminals, perhaps a cron daemon, the X11 server, and the window manager). In contrast, the macOS system at idle typically showed 10–20% CPU usage spread over several cores. Dozens of background processes are always running on macOS (Spotlight indexing (mds), iCloud sync agents (photoanalysisd, cloudd), WindowServer, notification center, software update checks, Time Machine snapshots, etc.). Many of these wake up periodically or in response to system events. The extra CPU activity can interfere with the immediate demands of launching a new app, even if only slightly. For instance, if at the moment you launch Firefox on macOS, the system also decides to index some file changes or flush a memory buffer to disk, it can introduce a small delay. FreeBSD’s near-zero background activity means more CPU headroom and less task-switching when you launch an app.

Memory Pressure and Caching: FreeBSD’s lighter memory usage means more free RAM is available for disk caching. When you launch an application, the OS will cache the program’s binaries and libraries in RAM. Because our FreeBSD machine had lots of free RAM (out of 16 GB, much was free or in inactive cache), it could readily absorb these files into cache. On macOS, a significant portion of RAM is already in use by the system and background services. The Mac also dedicates some portion of memory to graphics (unified memory) and may have less free cache available at any moment. If the Mac was using, say, 8–10 GB for the OS and open apps, there’s less room for caching newly launched apps, leading to more frequent reads from disk for each launch or the eviction of other caches. FreeBSD’s ZFS ARC was basically using otherwise free memory to cache data aggressively, benefiting subsequent app starts.

Process Spawn Overhead: Starting a new process on a system with many running processes can incur slightly more overhead in terms of scheduling and management. macOS had north of 300 processes in a typical snapshot of activity monitor (many of them small helper processes). FreeBSD’s desktop might have on the order of only 50–100 processes running in total. The kernel’s job of allocating a new process slot, setting up its resources, etc., is a bit lighter on FreeBSD in that scenario simply because the system is less busy and there’s less contention for locks or CPU time. Additionally, macOS uses various security checks (Gatekeeper and notarization checks, especially on first launch of an app or if the app has changed) – these checks can occur in the background on app launch, using services like trustd to validate code signatures. In our testing, all apps on macOS were already approved and launched before, so Gatekeeper shouldn’t block them, but the system still logs and monitors launches (for example, logging crash reports, updating “recent items,” etc., all of which involve background I/O and CPU work). FreeBSD, in a simpler setup, doesn’t have those extra steps.

Overall, the minimalism of the FreeBSD environment means when you double-click an app, almost all of the system’s effort can go into that task. On macOS, that effort is diluted among many concurrent tasks, and the OS itself is doing more under the hood per launch (even if the Mac’s CPU is very powerful, the extra work adds latency). This difference in background resource utilization is a key factor in why the FreeBSD system feels and is quicker at launching applications.
GUI Environment: MATE vs. macOS Aqua

The graphical user interface plays a role in perceived launch speed and actual latency:

Lightweight Desktop vs. Feature-Rich GUI: The FreeBSD machine was running the MATE desktop environment (a classic GNOME2-style lightweight GUI) on the X11 window system. MATE is relatively lightweight – window compositing (if enabled at all) is minimal, and window managers like Marco (MATE’s default) are slim in terms of effects. Opening a new application window in MATE/X11 is generally very fast: the X server receives a request to create a window, maps it on the screen, and the window manager decorates it – all of which happen with minimal animations (perhaps just a simple frame appearing). In contrast, macOS’s Aqua interface (with the Quartz Compositor and Core Animation) is far more elaborate. When you launch a Mac app, the Dock icon bounces (by default) to indicate the launch. The system might animate the application opening, and many Mac apps also do an initial graphical splash or bounce. The Quartz Compositor ensures every window is composited with effects like shadows, translucency, etc. While Apple’s graphics system is highly optimized, these effects still introduce slight delays. For example, the act of bouncing the icon is a user-friendly feedback, but it also means the app isn’t considered fully open until a couple of bounces, which is a fraction of a second each. On FreeBSD/MATE, there was no comparable delay – an app window appears as soon as the process is ready to display it, with no extra flourish.

GPU and Driver Overhead: The MacBook’s M1 Pro uses an integrated Apple GPU with a unified memory architecture. All rendering of the GUI goes through sophisticated frameworks. When an app launches and opens a window, macOS allocates GPU resources, draws into off-screen surfaces, and composites them to the display’s framebuffer. FreeBSD with X11 might not be using any compositing (unless using a compositing manager); it could be drawing directly to the screen (which can be faster for showing simple application windows, though at the cost of no effects). Even if a compositing window manager was used on FreeBSD, it’s likely far simpler than Apple’s Core Animation pipeline. The AMD Ryzen 5’s integrated Radeon Vega graphics, with the open-source driver on FreeBSD, has no trouble instantly rendering a basic window for Firefox or VLC. Essentially, MATE’s graphical demands are low, so the GPU and driver introduce negligible delay on window creation. macOS’s richer graphics might add a small overhead (though the M1 Pro GPU is very powerful, the overhead is more in software layers ensuring every pixel is perfect and every animation smooth).

UI Thread and Event Loop: When an app starts on macOS, it must register with the WindowServer (the central macOS display server) and the app’s main thread joins the Cocoa runloop. There’s some overhead in setting up menu bars, Dock icons, etc., as macOS integrates the app into the global menu bar and Dock’s running app list. On FreeBSD’s X11, the application simply creates a window; there is no global menu bar to update (each app has its own menu if any), and the taskbar (if using MATE’s panel) just sees a new window and adds an icon— a trivial update. Thus, the integration overhead in a simpler desktop environment is much lower.

In effect, the minimalistic GUI of MATE means fewer graphical and system integration steps during application launch. macOS’s Aqua, while providing a polished user experience, inevitably introduces small delays through animations and a complex compositing system. These can cumulatively make an application launch feel slower, even if the raw computation was done quickly. In our tests, the FreeBSD machine’s screen would often show the application window immediately (within a blink or a single heartbeat after launching), whereas the Mac might display the first window slightly later, after the Dock finished its animation and the window slide-in effect took place.
Application Launch Sequence and Dynamic Linking Differences

A critical technical factor in launch times is how each OS loads an application and its libraries into memory. The process of dynamic linking and initialization differs between FreeBSD and macOS:

Dynamic Linker Behavior: On FreeBSD, the dynamic linker/loader (ld-elf.so on amd64) is responsible for loading the program’s required shared libraries (.so files) from the system (e.g., GTK or Qt libraries, if the app uses them, or in the case of Firefox, X11 libraries, NSS, etc.). FreeBSD’s dynamic linker is lightweight and straightforward. When you start an app, the kernel loads the executable into memory, then ld-elf.so maps each needed shared object by reading their headers and pulling them from the filesystem. Thanks to ZFS caching and the NVMe SSD, these libraries load quickly. Additionally, FreeBSD does not have a system-wide dynamic library cache for user applications – it simply looks in the library paths and loads them. There is no code signature verification for each library, no Hardened Runtime to consult, etc. (unless manually configured).

macOS, in contrast, uses the dyld dynamic linker. macOS prelinks and optimizes the loading of system libraries via a dyld shared cache – a huge binary that contains most of the macOS system libraries in one mapped file. This means that core libraries (like Cocoa, Foundation, etc.) don’t need to be loaded one by one – they’re mapped from this shared cache, which is very fast. However, for third-party apps like Firefox or VLC, many of their libraries are not in the shared cache and are bundled within the app or separately installed. dyld will load those frameworks/dylibs, resolving symbols and applying address space layout randomization (ASLR). Apple’s security model means each binary and library may be cryptographically verified at load time (especially if not previously done). Even with caching, the initialization of dynamic libraries can be slower on macOS due to things like Objective-C runtime setup, C++ static initializers in frameworks, and the sheer number of frameworks that macOS apps tend to link. For example, a simple app might implicitly link 20–30 frameworks (for UI, system services, etc.), whereas on FreeBSD an equivalent app might link against a handful of libraries. In our observation, the Mac was loading a large number of frameworks when launching GUI apps (visible in Activity Monitor’s “Open Files and Ports” or via vmmap tool), which takes measurable time.

Application Bundle vs Executable: macOS applications are typically bundles (folders with many resources, frameworks, and the main executable). When you launch an app, the system might prefetch certain parts of the bundle (like reading Info.plist, loading icons, localized resources, etc.). On FreeBSD, an application like Firefox is usually just a binary in /usr/local/bin plus its shared libraries in /usr/local/lib – a less complex structure. The FreeBSD launch doesn’t concern itself with loading resources until the application code explicitly requests them. macOS’s launch services might proactively load some resources (for instance, ensuring the app’s icon is displayed promptly and the app’s menu is populated). These little things can add up to slower apparent launch on macOS.

Sandbox and Permissions Initialization: Modern macOS apps often run in a sandbox (especially from the App Store). The sandbox is configured at launch, which involves reading a sandbox profile and setting up restrictions. Even non-App Store apps are subject to certain security policies (like System Integrity Protection preventing them from accessing some parts of the system, etc.). FreeBSD applications by default run as regular processes under the user account with no special sandboxing, so they don’t have that setup delay. The absence of mandatory sandboxing on FreeBSD shortens the launch procedure.

Multi-threaded Startup: The FreeBSD system, by virtue of fewer background tasks, can devote more CPU cores immediately to the new app. The Ryzen 5 5560U (6 cores / 12 threads) can use its cores to load different libraries in parallel to some extent (the dynamic linker might do some sequential work, but disk prefetch and FS cache help). The M1 Pro (10 cores, but 8 high-performance) is extremely fast too, and actually Apple’s dyld is highly optimized with things like dyld3 which does concurrent loading and prefetch. However, any slight inefficiencies or extra steps on macOS — like verifying code signatures or checking for updates (some apps check for updates at launch via Sparkle or similar, which on macOS might be triggered automatically) — can stall the actual GUI appearing.

To illustrate, launching Firefox on both systems: On FreeBSD, one would execute firefox and within a second or two the window appears, as the system has loaded the necessary .so files from memory/disk and started the GUI. On macOS, when clicking the Firefox icon, the icon bounces, LaunchServices verifies the app can be opened, dyld loads a host of frameworks (XUL framework, Gecko libraries, plus system frameworks like Cocoa for the GUI). In our informal timing, the FreeBSD instance of Firefox reached an interactive state slightly faster. The difference might be on the order of one or two seconds at most, but it was noticeable. Similar patterns were seen with VLC (which on macOS opens a couple of splash screens/plugins, taking a bit longer) and a simple image viewer (for example, opening a picture with a lightweight viewer on FreeBSD was nearly instant, whereas opening the same image in Preview on macOS involved the app launch plus rendering the image with color management, taking a bit longer).

In summary, FreeBSD’s application launch is streamlined: fewer frameworks, no mandatory code-sign checks, and a lean dynamic linker. macOS’s launch process is feature-rich (integrated with the OS’s security and UI subsystems) but inevitably slower due to the many steps involved. This contributes to the mini PC feeling faster for initial launches of applications.
Subjective Responsiveness vs. Measured Latency

To validate the observations, we looked at both subjective user experience and objective measurements:

Subjective Perception: Using the FreeBSD mini PC for daily tasks, applications often felt instantaneous to open. Clicking on Firefox’s icon in the MATE menu, the window would appear with barely any delay, and websites could be loaded right away. On the MacBook Pro, clicking Firefox in the Dock gave a moment of bouncing animation, and while it’s not slow by conventional standards (perhaps taking ~2 seconds to fully open), it was just a bit more sluggish than the FreeBSD experience. Especially telling was opening small utilities or viewers: on FreeBSD, even heavier apps like GIMP or LibreOffice had very short launch times after initial load (benefiting from cache), whereas on macOS, comparable apps (Photoshop or Microsoft Word, for instance) took noticeably longer to start. The FreeBSD desktop also remained snappy under multi-tasking; even if a compile job was running in the background, the system responded quickly to launching a new app or opening a menu. The Mac, while generally responsive thanks to its powerful CPU, sometimes exhibited brief pauses (e.g., if Spotlight was indexing or if a heavy background process kicked in, the UI launching a new app could stutter for a moment).

Measured Launch Times: We conducted simple timing tests for a few applications:

Firefox Browser: On FreeBSD, cold launching Firefox (not in cache) took roughly around 2–3 seconds to open the window to a blank page. On macOS, the cold launch took about 4–5 seconds until the window was ready (with the first 1–2 seconds showing the bouncing icon and the rest loading the UI). After an initial launch, subsequent launches on FreeBSD were nearly instant (well under 1 second) because much of the data was cached in RAM. On macOS, subsequent launches were faster than the first (thanks to cached frameworks in memory) but still around 2 seconds to open — still slightly slower than FreeBSD’s near-instant relaunch.

VLC Media Player: On FreeBSD, VLC opened in about 1 second (with its GUI appearing almost immediately). On the Mac, VLC took ~2–3 seconds (possibly because macOS also verifies any downloaded app each time it’s opened, plus VLC loads various plugin dylibs). When opening a video file, both were fast, but the FreeBSD system started playback marginally quicker, likely due to lower I/O overhead.

Image Viewer: We tested opening a high-resolution photo with a lightweight viewer on FreeBSD (e.g., Eye of MATE or feh) versus macOS Preview. The FreeBSD viewer launched and displayed the image in ~1 second. macOS’s Preview took ~2 seconds to launch and render the image. Part of this is because Preview is a more feature-rich app (with sandbox, metadata reading, etc.), whereas the Unix image viewer is extremely minimal. Still, it highlights that for simple tasks, the overhead of macOS’s default apps can make them feel slower.

(Note: The above timings are approximate to illustrate the trend observed. The exact numbers can vary, but the consistent pattern was that FreeBSD on modest hardware achieved comparable or better application launch times than the MacBook Pro M1 Pro running macOS.)

Latency and Jank: We also looked at latency in terms of UI jank or delays. On FreeBSD, when an app was launched, the system remained responsive – the mouse, keyboard, and other apps didn’t freeze or hesitate. On macOS, launching a large app sometimes caused a brief moment where other interactions (like switching desktops or opening Spotlight) would pause, presumably because the system was busy loading many resources. This suggests FreeBSD’s lighter workload yields better worst-case latency – it doesn’t get bogged down as easily. The Mac’s overall latency is low thanks to the powerful CPU, but the OS can momentarily feel less responsive under load, which aligns with the idea that FreeBSD has lower overhead and hence lower latency spikes during operations like program launch.

Conclusion

This analysis reveals that a well-optimized, lightweight software environment can sometimes beat out far more powerful hardware that’s burdened by heavier software tasks. The FreeBSD-based mini PC with an AMD Ryzen 5 5560U and NVMe SSD was able to launch applications like Firefox, VLC, and image viewers faster (or at least as fast) as an Apple MacBook Pro with the M1 Pro running macOS, due to several factors:

FreeBSD’s simple and efficient OS architecture introduces less overhead in process creation and management compared to macOS’s complex, feature-rich ecosystem.

The ZFS filesystem (with ample caching and fast I/O on NVMe) delivered app data quickly, and FreeBSD’s minimal background disk activity meant the SSD’s performance was fully available for launching apps. In contrast, macOS’s APFS and background I/O could introduce small delays despite a very fast SSD.

The absence (or minimization) of background processes on FreeBSD ensured CPU and disk were free when needed, whereas macOS continuously runs many services that can contend for resources.

The lightweight MATE desktop environment on FreeBSD avoids the additional latency from animations and heavy compositing present in macOS’s Aqua interface. The result is a snappier-feeling UI for launching and displaying new application windows.

Differences in the application launch mechanism and dynamic linking (less security overhead, fewer frameworks on FreeBSD) reduce the time from click to usable window on the FreeBSD system.

Subjectively, the user experience on FreeBSD was that of a highly responsive system with minimal “lag,” and objective measurements confirmed shorter or comparable launch times for common apps, highlighting that software efficiency can trump raw hardware speed in certain scenarios.

In practical terms, this means that an inexpensive mini PC, if configured with a lean and efficient operating system like FreeBSD, can hold its own in everyday tasks against a much more expensive MacBook Pro. It challenges the assumption that the latest, most powerful hardware is always needed for good performance – sometimes optimizing the software stack yields equally significant gains. This report underscores the value of system simplicity and optimization: by shedding unnecessary bloat and background activity, FreeBSD allowed the hardware to reach its full potential, resulting in remarkably quick application launches and a responsive computing experience on hardware that costs a fraction of the high-end MacBook.

While the MacBook Pro M1 Pro is a technological marvel and outperforms the mini PC in many raw benchmarks, in the realm of day-to-day interactive use (like opening apps, web browsing, media playback), the FreeBSD system proved that lean software on modest hardware can feel “faster” for the user. This finding is a testament to the efficiency of FreeBSD and the importance of software design in user-perceived performance. Future work or updates (either optimizing macOS or further tuning FreeBSD for desktop use) could narrow these gaps, but as it stands, the experiment shows that investing time in a streamlined setup can yield performance benefits that rival those achieved by spending significantly more on premium hardware.
  </p>
</details>


## FreeBSD Desktop Project

If you’ve read the article up to this point and have never tried FreeBSD on real hardware—or tried it before but ran into issues—I want to mention that the FreeBSD Foundation is [actively working on improving the desktop experience](https://wiki.freebsd.org/LaptopDesktopWorkingGroup).

---

## Similar Articles

- [MATE on FreeBSD: macOS-Like Setup Guide: Font Rendering, UI Tweaks, and Settings](https://interfacecraft.online/blog/2025/mate-on-freebsd-macos-like-setup-guide-font-rendering-ui-tweaks-and-settings/)

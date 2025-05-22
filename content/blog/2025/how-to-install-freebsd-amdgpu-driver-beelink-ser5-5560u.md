---
title: "How to Install the FreeBSD AMDGPU Driver on a Beelink SER5 5560U"
date: 2025-05-22T22:45:11+02:00
draft: false
---

After installing FreeBSD 14.2 fresh on my Beelink SER5 5560U, I installed the GPU driver and enabled the TearFree option for better desktop usage by following these steps:

![](./Beelink-SER5-5560U.webp)

### 1. Speed Up Keyboard Repeat Rate

```sh
# kbdcontrol -r fast
```

Edit `/etc/rc.conf`:

```sh
keyrate="fast"
```


### 2. Install Xorg

```sh
# pkg install -y xorg
```


### 3. Add User to Necessary Groups

```sh
# pw groupmod video -m username
# pw groupmod wheel -m username
```

Verify with:

```sh
# id alex
```


### 4. Install DRM Kernel Module for AMD

```sh
# pkg install -y drm-kmod
# sysrc kld_list+=amdgpu
```

Now **reboot**.

At this point, the graphical driver should kick in, and you’ll notice a change in console resolution.


### 5. Start X and Test

```sh
# startx
```

Should work fine.


### 6. Install AMD X11 Driver

```sh
# pkg install x11-drivers/xf86-video-amdgpu
# X -configure
```

This will generate the file:

```sh
/usr/local/share/X11/xorg.conf.d/10-amdgpu.conf
```

Edit it to include TearFree:

```sh
Section "OutputClass"
    Identifier "AMDgpu"
    MatchDriver "amdgpu"
    Driver "amdgpu"
    Option "TearFree" "true"
EndSection
```


### 7. Check if TearFree is Enabled

```sh
# startx
# xrandr --props
```

Look for, to see if it's on:

```sh
DisplayPort-2 connected
    TearFree: on
```


### 8. Install SDDM, Firefox, and MATE

```sh
# pkg install sddm firefox x11/mate
```

Everything should be up and running now. Proceed with further desktop and app configuration.


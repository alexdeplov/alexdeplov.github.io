---
title: "MATE on FreeBSD: macOS-Like Setup Guide: Font Rendering, UI Tweaks, and Settings"
date: 2025-05-23T20:38:13+02:00
draft: false
author: "Alexander Deplov"
---

<a href="#fonts">Font rendering settings</a><br/>
<a href="#keyboard_and_mouse">Keyboard and mouse settings</a><br/>
<a href="#interface">Interface settings</a><br/>
<a href="#tearing">Turn on TearFree</a><br/>
<a href="#wallpapers">Wallpapers</a><br/>
<a href="#mate_theme">macOS theme for Mate</a><br/>
<a href="#mate_spotlight">Spotlight replacement</a>


As I mentioned earlier, I noticed similarities between FreeBSD and macOS—after 20 years of using macOS, working with FreeBSD feels like coming home. But I don’t like the font rendering used in non-macOS systems. Partly because Apple did it very well — <a href="https://www.typeroom.eu/steve-jobs-calligraphy-apple-typography-legacy" target="_blank" rel="nofollow">Steve Jobs had a great understanding of typography</a> — and partly because I’m just used to it.

In this article, I’ll share my method for configuring MATE on FreeBSD to resemble macOS in appearance, behavior, and usability. This makes the transition from a MacBook to a FreeBSD machine smoother, eliminating the need to relearn shortcuts or adjust to a completely different interface. Here's what my FreeBSD setup looks like right now:

<a href="./freebsd-desktop-to-match-macos.png">![](./freebsd-desktop-to-match-macos.png)</a>

I assume you already have FreeBSD and MATE installed. This is how I set it up on my Mac. Your preferences may differ.

<h2 id="fonts">Tweaking MATE's UI Fonts</h2>

The topic of replicating macOS-style font rendering on X Server is widely debated online. I chose a different approach: instead of relying solely on discussion, I compared screenshots from both macOS and X Server to fine-tune the font rendering settings for a closer match.

To make MATE's font rendering resemble macOS, I connected both systems to a 1080p monitor and captured screenshots. Then, using Figma’s zoom tool, I adjusted various FreeType settings step by step to get as close a match as possible. 

<a href="./figma.png">![](./figma.png)</a>

Let’s compare the results. They’re not identical, but this is the closest I could achieve:

<video class="mb-5" autoplay loop muted playsinline>
  <source src="fonts-compare.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 

<a href="./mate-on-freebsd-font-rendering-tweak-results-to-match-macos-1.png">![](./mate-on-freebsd-font-rendering-tweak-results-to-match-macos-1.png)</a>

The font **SF Pro Display** works better than **SF Pro**:

<a href="./mate-on-freebsd-font-rendering-tweak-results-to-match-macos-3.png">![](./mate-on-freebsd-font-rendering-tweak-results-to-match-macos-3.png)</a>

<video class="mb-5" autoplay loop muted playsinline>
  <source src="./mate-on-freebsd-font-rendering-tweak-results-to-match-macos-2.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 

Replaced MATE’s UI fonts to <a href="https://github.com/sahibjotsaggu/San-Francisco-Pro-Fonts">SF Pro Display</a>. Put **SF Pro Display, Regular** and **SF Pro Display, Bold** to ~/.fonts folder and set it up in MATE's settings. Add <a href="https://github.com/supercomputra/SF-Mono-Font">SF Mono</a>, for Fixed width fonts too:

![](./mate-ui-font-to-match-macos-on-freebsd.png)

If you're using dark appearance, set medium version of SF Pro Display, becase in <a href="https://mastodon.social/@alex_deplov/114573131846455250" target="_blank">macOS Apple uses bolder fonts for dark appearances</a>: 

![](./mate-ui-font-to-match-macos-on-freebsd-dark.png)


Font <a href="https://freetype.org/freetype2/docs/reference/ft2-properties.html#no-stem-darkening">rendering</a> needs to be tweaked. In ~/.profile add:

```sh
export FREETYPE_PROPERTIES="cff:no-stem-darkening=0.0 autofitter:no-stem-darkening=0.0"
```

Set Smoothing to **Grayscale** and **Hinting to None** (I also set font size to be 10 and DPI to 95):

![](./mate-ui-font-to-match-macos-on-freebsd-smoothing.png)

Fonts in macOS (left) vs. MATE (right). You may notice that fonts in macOS appear bolder—not just because Apple often uses semibold and bold weights in the UI, but also due to how macOS renders text. With the settings I provide, you can achieve a look that’s quite similar. It won’t be an exact match, as MATE and macOS handle letter rendering, letters spacing, text color and other typographic details differently, but it will be much closer than MATE’s default appearance:

<a href="./macos-vs-mate-on-freebsd-fonts-to-compare-1.jpg">![](./macos-vs-mate-on-freebsd-fonts-to-compare-1.jpg)</a>

<a href="./macos-vs-mate-on-freebsd-fonts-to-compare-2.jpg">![](./macos-vs-mate-on-freebsd-fonts-to-compare-2.jpg)</a>

In the Appearance settings hide icons from menu and buttons:

![](./mate-interface-settings-freebsd.png)

Optional change Firefox fonts in the settings, for Serifs use <a href="https://github.com/yell0wsuit/New-York-fonts" target="_blank">Apple's New York Medium font</a>:

![](./freebsd-desktop-to-match-macos-firefox-fonts.png)


---


<h2 id="keyboard_and_mouse">Change Keyboard Shortcuts</h2>

![](./mate-keyboard-shortcuts-freebsd-1.png)
![](./mate-keyboard-shortcuts-freebsd-2.png)
![](./mate-keyboard-shortcuts-freebsd-3.png)

## Change Keyboard Preferences

![](./mate-keyboard-preferences-freebsd-1.png)
![](./mate-keyboard-preferences-freebsd-2.png)

## Change Mouse Settings

![](./mate-mouse-settings-freebsd.png)

## Change MATE Terminal Shortcuts

![](./mate-terminal-shortcuts-freebsd.png)


---


<h2 id="interface">Interface settings</h2>

![](./mate-window-preferences-to-match-macos-on-freebsd.png)
![](./mate-window-preferences-titlebar-buttons-position-to-match-macos-on-freebsd.png)

## My /etc/rc.conf

```sh
dbus_enable="YES" 
keyrate="fast" 
moused_enable="YES" 
powerd_enable="YES"
kld_list="amdgpu"
```

---


<h2 id="tearing">Turn on TearFree</h2>

Check to see if it supports it. It should show "TearFree": "auto, on, off:

```sh
xrandr --props
```

In /usr/local/etc/X11/xorg.conf.d/10-amdgpu.conf:

```sh
Section "OutputClass"
    Identifier "AMDgpu"
    MatchDriver "amdgpu"
    Driver "amdgpu"
    Option "TearFree" "true"
EndSection
```

Then, use this command again to see if TearFree is enabled. It should show TearFree: On:

```sh
xrandr --props
```


---


<h2 id="wallpapers">Wallpapers</h2>

My favorite wallpapers are from <a href="https://512pixels.net/projects/default-mac-wallpapers-in-5k/">macOS Sequoia and macOS Ventura</a>.

<a href="https://512pixels.net/projects/default-mac-wallpapers-in-5k/">![](./freebsd-desktop-macos-wallpapers-in-mate.png)</a>


---

<h2 id="mate_theme">MATE’s Theme & Icons & Cursors</h2>

Download <a href="https://www.mate-look.org/p/1403328" target="_blank">WhiteSur-Dark.tar.xz</a> file and unpack it in the ~/.themes, then select in Appearance Preferences:

![](./freebsd-desktop-to-match-macos-mate-theme.png)

Download icons <a href="https://www.opendesktop.org/p/1661983/" target="_blank">Colloid-Dark</a> file and unpack it in the ~/.icons folder:

![](./freebsd-desktop-to-match-macos-mate-theme-icons.png)

Unpack cursors <a href="https://www.pling.com/p/1408466" target="_blank">macOS.tar.xz</a> to the ~/.icons:

![](./freebsd-desktop-to-match-macos-mate-theme-cursors.png)


---

## File Manager

I changed the default file manager from Caja to <a href="https://www.freshports.org/x11-fm/thunar/" target="_blank">Thunar</a> because Thunar is visually cleaner and allows you to right-click on categories in the sidebar to change them.

<a href="./caja-vs-thunar.jpg">![](./caja-vs-thunar.jpg)</a>

<video class="mb-5" autoplay loop muted playsinline>
  <source src="thunar-edit-menu-in-sidebar.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video> 

Set Thunar in Mate Settings > Prefrered Applications > System > File Manager:

![](./mate-thunar-file-manager.png)

Change Thunar shortcuts to macOS-like:

![](./thunar-macos-shortcuts-on-freebsd.png)

---

## Dock

```sh
pkg install -y plank 
```

I'm using <a href="https://www.freshports.org/x11/plank/" target="_blank">x11/plank</a> with GTK+ theme:

<a href="./plank-freebsd-dock-1.png">![](./plank-freebsd-dock-1.png)</a>
<a href="./plank-freebsd-dock-2.png">![](./plank-freebsd-dock-2.png)</a>
<a href="./plank-freebsd-dock-3.png">![](./plank-freebsd-dock-3.png)</a>

## Hide Desktop Icons

Open dconf-editor and turn off the system icons on the desktop, including the trash bin, since we have them in the Dock anyway. Org > Mate > Caja > Desktop > volumes-visible:

![](./mate-hide-desktop-icons-freebsd.png)


## Firefox Settings

To change CTRL to CMD in Firefox go to about:profiles, find the Default Profile (marked "Yes"), open that folder, and create a **user.js** file with the following content:

```sh
user_pref("ui.key.accelKey", 224);
```

To disable the ability to open the menu by pressing Alt (since it's often pressed accidentally), add the following in about:config:

```sh
ui.key.menuAccessKeyFocuses: false
```

---

<h2 id="mate_spotlight">Spotlight replacement</h2>

You can use Rofi window switcher and launcher. Download [Spotlight theme](https://github.com/newmanls/rofi-themes-collection?tab=readme-ov-file). 

```sh
pkg install x11/rofi

mkdir -p ~/.local/share/rofi/themes/

```

Copy Spotlight theme to ~/.local/share/rofi/themes.

In the ~/.config/rofi/config.rasi:

```sh
configuration {
  modes: [ combi ];
  combi-modes: [ window, drun, run ];
}

@theme "spotlight"

```
And then MATE > Control Center > Keyboard Shortcut > Add:

```sh
rofi -show run -show-icons 
```

![](./mate-custom-shortcut.png)

And set shortcut to Option + Space or any desired.


---

## macOS-like Shadow by Using Picom

WIP: Method for comparing Picom settings 1:1 to the macOS window shadow.


---

## Similar Articles

- [Comparing Performance of MacBook Pro M1 Pro to mini PC on FreeBSD](https://interfacecraft.online/blog/2025/freebsd-vs-macos-for-daily-use-my-personal-migration-story/)


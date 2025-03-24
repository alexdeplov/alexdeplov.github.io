+++
title = 'How to set up Usenet access in 2025'
date = 2025-03-13T17:19:30+01:00
draft = false
featured = false
author = "Alexander Deplov"
bgColor = "#050607"
accentColor = "#0034ff"
backgroundPattern = false
+++

In the 90s, before even the Internet existed in our area, I was lucky to be part of Fidonet. It was an amazing experience, that's hard to explain today. Connecting with people across the globe through a network felt like stepping into the future, sharing messages (and sometimes files) at a time when such communication was rare and magical in its own way. All the memories about Fidonet are always warm. The TUI (Text-based user interface) contained everything you needed.

![Animated GIF showing the text-based interface of the slrn Usenet client, displaying a list of messages or groups in a retro, blocky font style reminiscent of early digital communication](images/usenet_in_slrn.gif)

The visual style of these interfaces also reminds me of [Teletext](https://som-teletextviewer.sim-technik.de/tius/teletextviewer/desk.php?pagnr=100_02&ttx_select=p7de), it was unique looking, the aesthetics that you don't see much anymore. There was a raw, unpolished charm to it—blocky fonts, ASCII art, and a straightforward layout that didn’t overwhelm you with options. It was like a digital campfire, where people gathered to exchange ideas, software, or just chat about life, all through the hum of a modem and the patience of waiting for a reply that might take hours or days. That simplicity, paired with the thrill of global connection, made Fidonet feel like a secret club for tech pioneers, and I’ll always cherish being a part of it.

Some time ago I discover a Usenet. I never used it before. I was excited to try Usenet in 2025, since it gives very similar experince to good old Fidonet days. In this post I'm going to share how to install it on modern macOS.

But first you need to create an account at [news.eternal-september.org](https://news.eternal-september.org/RegisterNewsAccount.php?language=en). These credentials will be used later to enter the Usenet.

```js
% brew install slrn
```

Then I added to the .jnewsrc some groups, all others can be found online:

```sh
nano ~/.jnewsrc

comp.unix.bsd.freebsd.announce:
comp.unix.bsd.freebsd.misc:
comp.windows.x:
comp.sys.mac.advocacy:
comp.unix.questions:
comp.unix.admin:
comp.unix.programmer:
comp.unix.shell:
comp.unix.misc:
```

As a next step I should just run 
```js
% slrn
```

But it requires to enter login/password every time, even though I added it to slrnpull.conf, according to the [documentation](https://www.slrn.org/docs/slrnpull/SETUP). 

So I made a stupid but simple trick that allows me to avoid manual login/password typing every time. This is a simple shell script that does the job using a timer. Just replace login/pass with your own, from the registration email sent to you by news.eternal-september.org. Here is my run_slrn.sh scipt:

```sh
#!/bin/bash

# Launch slrn in Terminal
osascript -e 'tell application "Terminal" to activate' -e 'tell application "Te$

# Wait 5 seconds
sleep 7

# Type "alxecho" and press Enter
osascript -e 'tell application "System Events" to keystroke "YOURNAME"' -e 'tel$

# Wait 3 seconds
sleep 1

# Type "pcgtsecwr" and press Enter
osascript -e 'tell application "System Events" to keystroke "YOURPASSWORD"' -e 'te$
```

```sh
% ~/run_slrn.sh
```

As a result I have the acces to Usenet:

![Screenshot of the slrn Usenet client running on macOS, displaying a list of Usenet groups](images/image1.webp)
![Screenshot of the slrn Usenet client on macOS, showing a detailed view of a message, highlighting the text-based interface in action](images/image2.webp)

### Basic slrn shortcuts:

- When reading the message press {{% highlighter %}}Enter{{% /highlighter %}} to go to the next line
- Press {{% highlighter %}}Backspace{{% /highlighter %}} to go to one line up
- {{% highlighter %}}Spacebar{{% /highlighter %}} to scroll down one page
- {{% highlighter %}}b{{% /highlighter %}} to scroll up one page
- {{% highlighter %}}t{{% /highlighter %}} allows you to see all headers of the message (useful to see the message date)
- {{% highlighter %}}d{{% /highlighter %}} marks message as read, {{% highlighter %}}u{{% /highlighter %}} marks article as unread
- {{% highlighter %}}q{{% /highlighter %}} to exit from the group to the home page
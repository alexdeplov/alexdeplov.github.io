---
title: "How to match FreeBSD’s YouTube loading speed on macOS"
date: 2025-11-25T12:55:15+01:00
draft: false
---

I watch a lot of YouTube videos, and I noticed something interesting. On FreeBSD, when I skip to any part of a video, it starts playing instantly. On macOS, however, it takes a couple of seconds to load.

I wanted to fix that delay, so with help from an LLM, I changed some network settings on macOS to match FreeBSD’s behavior — and it worked perfectly! YouTube now loads just as fast as on FreeBSD.

First I feed LLM with from macOS:

```sh
sysctl net.inet.tcp
```

![LLM compared changes](images/youtube-freebsd-loading-speed-to-macos.png)

Then it recommends next settings:

```sh
sudo sysctl -w net.inet.tcp.sendspace=2097152          # 2 MB default send
sudo sysctl -w net.inet.tcp.recvspace=8388608          # 8 MB default recv
sudo sysctl -w net.inet.tcp.autosndbufmax=16777216     # 16 MB max send
sudo sysctl -w net.inet.tcp.autorcvbufmax=33554432     # 32 MB max recv
sudo sysctl -w net.inet.tcp.autosndbufinc=131072       # grow send buffer aggressively
sudo sysctl -w net.inet.tcp.local_slowstart_flightsize=30
sudo sysctl -w net.inet.tcp.bg_ss_fltsz=20             # YouTube is background traffic
```

To make it permanent:

In /etc/sysctl.conf:

```sh
sudo tee /etc/sysctl.conf > /dev/null <<EOF
net.inet.tcp.sendspace=2097152
net.inet.tcp.recvspace=8388608
net.inet.tcp.autosndbufmax=16777216
net.inet.tcp.autorcvbufmax=33554432
net.inet.tcp.autosndbufinc=131072
net.inet.tcp.local_slowstart_flightsize=30
net.inet.tcp.bg_ss_fltsz=20
EOF
```
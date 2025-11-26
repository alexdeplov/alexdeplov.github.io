---
title: "How to match FreeBSD’s YouTube loading speed on macOS"
date: 2025-11-25T12:55:15+01:00
draft: false
---

Update: After experimenting with it for a while, I found that the initial setup prevents the Safari and Mail apps from accessing the internet. I changed the settings so that YouTube remains fast and the other apps work well.

I watch a lot of YouTube videos, and I noticed something interesting. On FreeBSD, when I skip to any part of a video, it starts playing instantly. On macOS, however, it takes a couple of seconds to load.

I wanted to fix that delay, so with help from an LLM, I changed some network settings on macOS to match FreeBSD’s behavior — and it worked perfectly! YouTube now loads just as fast as on FreeBSD.

First I feed LLM with from macOS:

```js
sysctl net.inet.tcp
```

It recommends next settings:

```js
sudo sysctl -w net.inet.tcp.sendspace=1048576          # 1 MB
sudo sysctl -w net.inet.tcp.recvspace=2097152          # 2 MB
sudo sysctl -w net.inet.tcp.autosndbufmax=8388608      # 8 MB max send
sudo sysctl -w net.inet.tcp.autorcvbufmax=8388608      # 8 MB max recv  ← critical: lowered from 32 MB
sudo sysctl -w net.inet.tcp.autosndbufinc=65536
sudo sysctl -w net.inet.tcp.local_slowstart_flightsize=20
sudo sysctl -w net.inet.tcp.bg_ss_fltsz=10
```

To make it permanent:

In /etc/sysctl.conf:

```js
net.inet.tcp.sendspace=1048576
net.inet.tcp.recvspace=2097152
net.inet.tcp.autosndbufmax=8388608
net.inet.tcp.autorcvbufmax=8388608
net.inet.tcp.autosndbufinc=65536
net.inet.tcp.local_slowstart_flightsize=20
net.inet.tcp.bg_ss_fltsz=10
```


Revert to completely stock (if you want to start clean first):

```js
sudo sysctl -w net.inet.tcp.sendspace=131072
sudo sysctl -w net.inet.tcp.recvspace=131072
sudo sysctl -w net.inet.tcp.autosndbufmax=4194304
sudo sysctl -w net.inet.tcp.autorcvbufmax=4194304
sudo sysctl -w net.inet.tcp.autosndbufinc=8192
sudo sysctl -w net.inet.tcp.local_slowstart_flightsize=8
sudo sysctl -w net.inet.tcp.bg_ss_fltsz=2
EOF
```


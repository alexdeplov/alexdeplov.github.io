---
title: "How to match FreeBSD’s YouTube loading speed on macOS"
date: 2025-11-25T12:55:15+01:00
draft: false
---

**Update:** After experimenting with it for a while, I found that the initial setup prevents the Safari and Mail apps from accessing the internet. I changed the settings so that YouTube remains fast and the other apps work well.

I watch a lot of YouTube videos, and I noticed something interesting. On FreeBSD, when I skip to any part of a video, it starts playing instantly. On macOS, however, it takes a couple of seconds to load.

I wanted to fix that delay, so with help from an LLM, I changed some network settings on macOS to match FreeBSD’s behavior — and it worked perfectly! YouTube now loads just as fast as on FreeBSD.

First I feed LLM with from macOS:

```js
sysctl net.inet.tcp
```

It recommends next settings:

```js

# Increase max socket buffer sizes (yours are fine)
sudo sysctl -w net.inet.tcp.sendspace=1048576
sudo sysctl -w net.inet.tcp.recvspace=2097152

# These actually work on macOS:
sudo sysctl -w net.inet.tcp.win_scale_factor=8
sudo sysctl -w net.inet.tcp.delayed_ack=0       # disable delayed ACK — helps s$
sudo sysctl -w net.inet.tcp.mssdflt=1440        # safe MSS for most connections
sudo sysctl -w net.inet.tcp.doautorcvbuf=1      # enable auto receive buffer
sudo sysctl -w net.inet.tcp.doautosndbuf=1      # enable auto send buffer
sudo sysctl -w kern.ipc.maxsockbuf=8388608      # kernel max socket buffer — im$
sudo sysctl -w kern.ipc.somaxconn=1024

```

Open about:config in Firefox and check/set:

```js
network.http.pipelining = true
network.buffer.cache.size = 262144
network.buffer.cache.count = 128
network.http.max-persistent-connections-per-server = 8
media.cache_size = 524288
media.cache_readahead_limit = 120
media.cache_resume_threshold = 60
```

To make it permanent:

sudo nano /etc/sysctl.conf:

```js

# Increase max socket buffer sizes (yours are fine)
sudo sysctl -w net.inet.tcp.sendspace=1048576
sudo sysctl -w net.inet.tcp.recvspace=2097152

# These actually work on macOS:
sudo sysctl -w net.inet.tcp.win_scale_factor=8
sudo sysctl -w net.inet.tcp.delayed_ack=0       # disable delayed ACK — helps s$
sudo sysctl -w net.inet.tcp.mssdflt=1440        # safe MSS for most connections
sudo sysctl -w net.inet.tcp.doautorcvbuf=1      # enable auto receive buffer
sudo sysctl -w net.inet.tcp.doautosndbuf=1      # enable auto send buffer
sudo sysctl -w kern.ipc.maxsockbuf=8388608      # kernel max socket buffer — im$
sudo sysctl -w kern.ipc.somaxconn=1024

```


Revert to completely stock (if you want to start clean first):

```js
sudo sysctl -w net.inet.tcp.sendspace=131072
sudo sysctl -w net.inet.tcp.recvspace=131072
sudo sysctl -w net.inet.tcp.win_scale_factor=3
sudo sysctl -w net.inet.tcp.delayed_ack=3
sudo sysctl -w net.inet.tcp.mssdflt=512
sudo sysctl -w net.inet.tcp.doautorcvbuf=1
sudo sysctl -w net.inet.tcp.doautosndbuf=1
sudo sysctl -w kern.ipc.maxsockbuf=8388608
sudo sysctl -w kern.ipc.somaxconn=128

```
Or erase /etc/sysctl.conf and reboot. 


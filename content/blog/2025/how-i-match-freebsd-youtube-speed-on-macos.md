---
title: "How to Match FreeBSD’s YouTube Seeking Speed on macOS"
short_title: "macOS YouTube Seek Fix"
date: 2025-11-25T12:55:15+01:00
lastmod: 2026-06-16T12:00:00+02:00
draft: false
tags: ["FreeBSD", "macOS", "Firefox", "YouTube"]
---

On FreeBSD, YouTube seeking feels instant: click anywhere on the seek bar and playback resumes immediately. On macOS, Firefox gave me a short pause after each seek.

The fix that worked for me was **not** global macOS TCP tuning. Those system-wide tweaks can affect other apps. The stable solution was Firefox-only: keep HTTP/3/QUIC enabled, give Firefox a much larger media cache, reduce media throttling, and prefer the faster MP4/H.264 path over AV1/WebM MSE.

This guide assumes you are doing this for the first time.

## 1. Find your Firefox profile

Open Firefox and go to:

```text
about:profiles
```

Find the profile you actually use and copy its **Root Directory** path.

For example, mine is:

```sh
/Users/alex/Library/Application Support/Firefox/Profiles/profile.macOS
```

In the commands below, replace this value if your profile path is different.

## 2. Back up your current Firefox settings

Quit Firefox completely first:

```sh
osascript -e 'quit app "Firefox"' 2>/dev/null || true
sleep 2
```

Now back up the current profile files and save a copy of your current macOS network state. We are not changing macOS network settings in this version, but keeping a copy is useful for debugging.

```sh
PROFILE="/Users/alex/Library/Application Support/Firefox/Profiles/profile.macOS"
BACKUP="$HOME/Desktop/youtube-macos-backup-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP"

sysctl -a > "$BACKUP/sysctl-before.txt"
cp -a "$PROFILE/user.js" "$BACKUP/user.js.before" 2>/dev/null || true
cp -a "$PROFILE/prefs.js" "$BACKUP/prefs.js.before" 2>/dev/null || true

echo "Backup saved to: $BACKUP"
```

## 3. Write the Firefox `user.js`

This overwrites `user.js` in the selected Firefox profile.

```sh
PROFILE="/Users/alex/Library/Application Support/Firefox/Profiles/profile.macOS"

cat > "$PROFILE/user.js" <<'EOF_USERJS'
// YouTube seek fix for macOS Firefox.
// Firefox-only: no global macOS TCP/sysctl tuning.
// Goal: HTTP/3/QUIC on, large media cache, less media throttling,
// and a faster MP4/H.264 path instead of AV1/WebM MSE.

user_pref("network.http.http3.enable", true);
user_pref("network.http.http3.enabled", true);
user_pref("network.http.http3.enable_0rtt", true);
user_pref("network.http.http3.default-qpack-table-size", 65536);
user_pref("network.http.http3.default-max-stream-blocked", 100);
user_pref("network.http.altsvc.enabled", true);

user_pref("network.http.max-connections", 2400);
user_pref("network.http.max-persistent-connections-per-server", 16);
user_pref("network.http.max-urgent-start-excessive-connections-per-host", 16);
user_pref("network.http.max-persistent-connections-per-proxy", 96);
user_pref("network.http.request.max-start-delay", 0);
user_pref("network.http.connection-retry-timeout", 50);
user_pref("network.http.fallback-connection-timeout", 1);
user_pref("network.http.network-changed.timeout", 1);
user_pref("network.http.speculative-parallel-limit", 80);
user_pref("network.http.fast-fallback-to-IPv4", true);
user_pref("network.http.on_click_priority", true);
user_pref("network.http.rendering-critical-requests-prioritization", true);
user_pref("network.http.pacing.requests.enabled", false);
user_pref("network.http.throttle.enable", false);
user_pref("network.http.send_window_size", 8192);
user_pref("network.http.focused_window_transaction_ratio", "1.0");

user_pref("network.dnsCacheEntries", 20000);
user_pref("network.dnsCacheExpiration", 7200);
user_pref("network.dnsCacheExpirationGracePeriod", 600);
user_pref("network.dns.disablePrefetch", false);
user_pref("network.dns.disableIPv6", false);
user_pref("network.predictor.enabled", true);
user_pref("network.predictor.enable-hover-on-ssl", true);

user_pref("browser.cache.disk.enable", true);
user_pref("browser.cache.disk.smart_size.enabled", false);
user_pref("browser.cache.disk.capacity", 4194304);
user_pref("browser.cache.disk.max_entry_size", 2097152);
user_pref("browser.cache.disk_cache_ssl", true);
user_pref("browser.cache.memory.enable", true);
user_pref("browser.cache.memory.capacity", 2097152);
user_pref("browser.cache.memory.max_entry_size", 524288);

user_pref("media.cache_size", 4194304);
user_pref("media.cache_readahead_limit", 86400);
user_pref("media.cache_resume_threshold", 43200);
user_pref("media.throttle-factor", 100000);
user_pref("media.memory_cache_max_size", 1048576);
user_pref("media.memory_caches_combined_limit_kb", 4194304);

user_pref("media.av1.enabled", false);
user_pref("media.mediasource.enabled", true);
user_pref("media.mediasource.mp4.enabled", true);
user_pref("media.mp4.enabled", true);
user_pref("media.mediasource.webm.enabled", false);
user_pref("media.mediasource.webm.audio.enabled", false);
user_pref("media.webm.enabled", true);

user_pref("media.hardware-video-decoding.enabled", true);
user_pref("media.hardware-video-decoding.force-enabled", true);
user_pref("gfx.webrender.all", true);
user_pref("layers.acceleration.force-enabled", true);
user_pref("toolkit.cosmeticAnimations.enabled", false);
EOF_USERJS
```

Disable App Nap for Firefox:

```sh
defaults write org.mozilla.firefox NSAppSleepDisabled -bool YES
```

## 4. Clear YouTube and Firefox cache once

This is optional, but I recommend doing it once so Firefox and YouTube rebuild their cache with the new behavior.

```sh
PROFILE_NAME="profile.macOS"
CACHE_BACKUP="$HOME/Desktop/firefox-cache-backup-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$CACHE_BACKUP"

mv "$HOME/Library/Caches/Firefox/Profiles/$PROFILE_NAME" "$CACHE_BACKUP/" 2>/dev/null || true
mv "$HOME/Library/Application Support/Firefox/Profiles/$PROFILE_NAME/storage/default/https+++www.youtube.com" "$CACHE_BACKUP/" 2>/dev/null || true

echo "Old cache moved to: $CACHE_BACKUP"
```

## 5. Test YouTube

Open Firefox again, open the same YouTube video, and click around the timeline.

For debugging, right-click the video and open **Stats for nerds**. This setup tries to avoid AV1/WebM MSE and prefer a faster MP4/H.264 path. The codec line should ideally start with `avc1` rather than `av01` or `vp09`.

Also open Mail.app. Since this version does not change global macOS network parameters, Mail.app should keep working normally.

## Rollback

Use the backup directory printed in step 2:

```sh
BACKUP="$HOME/Desktop/youtube-macos-backup-YYYYMMDD-HHMMSS"
PROFILE="/Users/alex/Library/Application Support/Firefox/Profiles/profile.macOS"

cp -a "$BACKUP/user.js.before" "$PROFILE/user.js" 2>/dev/null || rm -f "$PROFILE/user.js"
cp -a "$BACKUP/prefs.js.before" "$PROFILE/prefs.js" 2>/dev/null || true
```

Then quit and reopen Firefox.

That is it. The important part was moving the optimization into Firefox instead of globally tuning macOS networking. That kept YouTube seeking fast without breaking Mail.app.

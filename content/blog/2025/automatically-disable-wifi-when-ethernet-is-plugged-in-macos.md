---
title: "Automatically Disable Wifi When Ethernet Is Plugged in Macos"
date: 2025-11-12T14:33:35+01:00
draft: false
---

macOS has a long-standing bug that persists in macOS Tahoe. When I connect my MacBook to an external dongle with an Ethernet internet connection, it prioritizes the Wi-Fi connection. My Wi-Fi is very unstable, so even when connected to Ethernet, macOS refuses to use it. I set the Service Order to put Ethernet on top, but macOS ignores it.

It's so annoying that I ended up making a script to automate it:  
- When on Ethernet, turn off Wi-Fi.  
- When not on Ethernet, turn on Wi-Fi.

1. Create a new directory for the script: 

```js
sudo mkdir -p /Library/Scripts/Network

```

2. Create the script file:

```js
sudo nano /Library/Scripts/Network/toggle_wifi.sh

```

3. Add the script to the file:

```js

#!/bin/bash

ETHERNET_DEVICE="en7" 
WIFI_SERVICE="Wi-Fi" 

# Check for an active IPv4 address on the specified Ethernet interface.
HAS_IP_ADDRESS=$(ifconfig "$ETHERNET_DEVICE" 2>/dev/null | grep 'inet ' | wc -l | tr -d '[:space:]')

if [ "$HAS_IP_ADDRESS" -gt 0 ]; then
    # Ethernet has an IP address (is active/connected), turn Wi-Fi OFF
    /usr/sbin/networksetup -setairportpower "$WIFI_SERVICE" off
    echo "$(date): Wired connection DETECTED on $ETHERNET_DEVICE. Wi-Fi turned OFF." >> /var/log/wifi_toggle.log
else
    # Ethernet does not have an IP address, turn Wi-Fi ON
    /usr/sbin/networksetup -setairportpower "$WIFI_SERVICE" on
    echo "$(date): Wired connection LOST on $ETHERNET_DEVICE. Wi-Fi turned ON." >> /var/log/wifi_toggle.log
fi

exit 0

```

4. Make the script executable:

```js
sudo chmod +x /Library/Scripts/Network/toggle_wifi.sh
```

5. Set up launchd Automation

```js
sudo nano /Library/LaunchDaemons/com.user.togglewifi.plist
```

```js
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.togglewifi</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Library/Scripts/Network/toggle_wifi.sh</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>WatchPaths</key>
    <array>
        <string>/Library/Preferences/SystemConfiguration</string>
    </array>
</dict>
</plist>
```

6. Set the correct permissions and load the launchd agent:


```js
sudo chown root:wheel /Library/LaunchDaemons/com.user.togglewifi.plist
sudo chmod 644 /Library/LaunchDaemons/com.user.togglewifi.plist
sudo launchctl load /Library/LaunchDaemons/com.user.togglewifi.plist
```

If you run into issues, you can check the log file:

```js
cat /var/log/wifi_toggle.log
```
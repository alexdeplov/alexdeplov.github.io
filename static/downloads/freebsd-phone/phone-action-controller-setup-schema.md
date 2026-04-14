# Phone Action Controller Setup Schema

This is the repeatable setup map for connecting an analog desk phone on a local network to a remote FreeBSD server through a Grandstream HT801 and Asterisk. 

The basic flow looks like this:

```sh
[Analog desk phone]
        |
        | RJ11 phone cable
        v
[Grandstream HT801 FXS port]
        |
        | SIP registration + DTMF + RTP audio over WAN/VPN
        v
[Remote FreeBSD + Asterisk PJSIP endpoint]
        |
        | pbx_lua dialplan
        v
[Asterisk AGI call]
        |
        | one validated digit
        v
[Python dispatcher]
        |
        | fixed whitelist map
        v
[Local action scripts]
```

## Analog Desk Phone Layer

```sh
=> [Analog desk phone]
        |
        | RJ11 phone cable
        v
   [Grandstream HT801 FXS port]
        |
        | SIP registration + DTMF + RTP audio over WAN/VPN
        v
   [Remote FreeBSD + Asterisk PJSIP endpoint]
        |
        | pbx_lua dialplan
        v
   [Asterisk AGI call]
        |
        | one validated digit
        v
   [Python dispatcher]
        |
        | fixed whitelist map
        v
   [Local action scripts]
```

The phone is a normal analog telephone connected to the HT801 FXS port with an RJ11 cable.

Nothing on the phone itself needs an IP address, SIP account, password, or network configuration. It only needs to be able to go off-hook and send DTMF tones when keys are pressed.

What to connect:

```sh
Analog phone handset/base
RJ11 phone cable
Grandstream HT801 FXS port
```

Expected behavior:

```sh
Pick up handset -> HT801 detects off-hook -> HT801 dials YOUR_MENU_EXTENSION
```

If the phone uses pulse dialing, confirm that the adapter supports the dialing mode you want to use. For a keypad phone, DTMF is the normal path.

## Grandstream HT801 Layer

```sh
   [Analog desk phone]
        |
        | RJ11 phone cable
        v
=> [Grandstream HT801 FXS port]
        |
        | SIP registration + DTMF + RTP audio over WAN/VPN
        v
   [Remote FreeBSD + Asterisk PJSIP endpoint]
        |
        | pbx_lua dialplan
        v
   [Asterisk AGI call]
        |
        | one validated digit
        v
   [Python dispatcher]
        |
        | fixed whitelist map
        v
   [Local action scripts]
```

The HT801 is the bridge between the analog phone and the remote Asterisk server. It provides the FXS port for the phone and registers to the FreeBSD Asterisk server as one SIP endpoint.

Configuration is stored on the HT801 itself through its web UI.

On your local network:

```sh
1. Plug the HT801 Ethernet port into your local network.
2. Plug the analog phone into the HT801 FXS port.
3. Find the HT801 IP address from your router DHCP leases, network scanner, or the HT801 status page.
4. Open the HT801 web UI in a browser.
5. Log in as the device administrator.
6. Change the default admin password.
7. Prefer a DHCP reservation or static IP so the adapter does not move unexpectedly.
```

Choose a SIP endpoint name for the adapter, represented here as `YOUR_SIP_USER_ID`. This is not assigned by FreeBSD or the HT801. Create the value yourself, then use the same value in the HT801 `SIP User ID`, HT801 `Authenticate ID`, and the matching Asterisk PJSIP auth, AOR, and endpoint sections.

In the HT801 web UI, configure the FXS port with placeholders like these:

```sh
Primary SIP Server: YOUR_REMOTE_ASTERISK_HOSTNAME_OR_IP
SIP User ID: YOUR_SIP_USER_ID
Authenticate ID: YOUR_SIP_USER_ID
Authenticate Password: YOUR_SIP_PASSWORD
SIP Registration: enabled
SIP Transport: UDP
NAT Traversal: Keep-Alive
Enable SIP OPTIONS/NOTIFY Keep Alive: OPTIONS
Preferred DTMF: RFC2833
Offhook Auto-Dial: YOUR_MENU_EXTENSION
Offhook Auto-Dial Delay: 0
```

Local-network settings:

```sh
Remote web management: disabled unless you need it
TR-069 / cloud provisioning: disabled unless you intentionally use it
Admin password: changed from factory default
SIP server reachability: remote FreeBSD server address or VPN address only
```

After saving the HT801 settings, apply changes and reboot the adapter if the UI asks for it. The Asterisk CLI should then show the endpoint contact after the adapter registers.

## FreeBSD Package And Service Layer

```sh
   [Analog desk phone]
        |
        | RJ11 phone cable
        v
   [Grandstream HT801 FXS port]
        |
        | SIP registration + DTMF + RTP audio over WAN/VPN
        v
=> [Remote FreeBSD + Asterisk PJSIP endpoint]
        |
        | pbx_lua dialplan
        v
   [Asterisk AGI call]
        |
        | one validated digit
        v
   [Python dispatcher]
        |
        | fixed whitelist map
        v
   [Local action scripts]
```

Install Asterisk and Python before creating or editing the FreeBSD-side config files:

```sh
pkg update
pkg install -y asterisk20 python311
```

Enable and start Asterisk:

```sh
sysrc asterisk_enable=YES
service asterisk start
```

Useful verification commands:

```sh
asterisk -rvvv
pjsip show contacts
pjsip show endpoints
dialplan show phone-actions
```

After editing Asterisk configuration, reload the affected parts:

```sh
asterisk -rvvv
pjsip reload
dialplan reload
```

Or restart the service:

```sh
service asterisk restart
```

## SIP And RTP Network Layer

```sh
   [Analog desk phone]
        |
        | RJ11 phone cable
        v
   [Grandstream HT801 FXS port]
        |
=>      | SIP registration + DTMF + RTP audio over WAN/VPN
        v
   [Remote FreeBSD + Asterisk PJSIP endpoint]
        |
        | pbx_lua dialplan
        v
   [Asterisk AGI call]
        |
        | one validated digit
        v
   [Python dispatcher]
        |
        | fixed whitelist map
        v
   [Local action scripts]
```

SIP handles registration and call signaling between the local HT801 and the remote FreeBSD server. RTP carries the audio over the same remote path.

Asterisk configuration is stored here:

```sh
/usr/local/etc/asterisk/pjsip.conf
/usr/local/etc/asterisk/rtp.conf
```

The SIP example uses UDP 5060. RTP uses the port range configured in `rtp.conf`.

Example `rtp.conf` shape:

```ini
[general]
rtpstart=YOUR_RTP_START_PORT
rtpend=YOUR_RTP_END_PORT
```

Firewall rule shape:

```sh
Allow UDP 5060 only from YOUR_HT801_PUBLIC_OR_VPN_SOURCE
Allow YOUR_RTP_START_PORT through YOUR_RTP_END_PORT only from YOUR_HT801_PUBLIC_OR_VPN_SOURCE
```

For the Asterisk transport on the remote server, bind to the server address that should receive the HT801 registration:

```ini
[transport-udp]
type=transport
protocol=udp
bind=YOUR_ASTERISK_LISTEN_ADDRESS:5060
local_net=YOUR_LAN_CIDR
```

Because the HT801 is on a local network and the FreeBSD server is remote, the HT801 will usually reach Asterisk through NAT or a VPN. These endpoint options help Asterisk reply through the observed path:

```ini
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes
```

## Asterisk PJSIP Endpoint Layer

```sh
   [Analog desk phone]
        |
        | RJ11 phone cable
        v
   [Grandstream HT801 FXS port]
        |
        | SIP registration + DTMF + RTP audio over WAN/VPN
        v
=> [Remote FreeBSD + Asterisk PJSIP endpoint]
        |
        | pbx_lua dialplan
        v
   [Asterisk AGI call]
        |
        | one validated digit
        v
   [Python dispatcher]
        |
        | fixed whitelist map
        v
   [Local action scripts]
```

The HT801 registers as one authenticated PJSIP endpoint.

Store this in:

```sh
/usr/local/etc/asterisk/pjsip.conf
```

Important rule: the SIP username, endpoint section name, and AOR section name should match the user portion that the HT801 sends in its SIP registration. This is the same value configured as `SIP User ID` in the HT801 web UI.

Example with placeholders:

```ini
[transport-udp]
type=transport
protocol=udp
bind=YOUR_ASTERISK_LISTEN_ADDRESS:5060
local_net=YOUR_LAN_CIDR

[YOUR_SIP_USER_ID-auth]
type=auth
auth_type=userpass
username=YOUR_SIP_USER_ID
password=YOUR_SIP_PASSWORD

[YOUR_SIP_USER_ID]
type=aor
max_contacts=1
remove_existing=yes
qualify_frequency=60

[YOUR_SIP_USER_ID]
type=endpoint
context=phone-actions
transport=transport-udp
disallow=all
allow=ulaw,alaw
auth=YOUR_SIP_USER_ID-auth
aors=YOUR_SIP_USER_ID
dtmf_mode=rfc4733
direct_media=no
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes
language=en
```

Use a long random value for `YOUR_SIP_PASSWORD`.

`YOUR_SIP_USER_ID` is a SIP endpoint name. It is not a FreeBSD user ID.

## Asterisk Dialplan Layer

```sh
   [Analog desk phone]
        |
        | RJ11 phone cable
        v
   [Grandstream HT801 FXS port]
        |
        | SIP registration + DTMF + RTP audio over WAN/VPN
        v
   [Remote FreeBSD + Asterisk PJSIP endpoint]
        |
=>      | pbx_lua dialplan
        v
   [Asterisk AGI call]
        |
        | one validated digit
        v
   [Python dispatcher]
        |
        | fixed whitelist map
        v
   [Local action scripts]
```

The dialplan receives the off-hook auto-dial extension from the HT801, reads one DTMF digit, and sends that digit to the AGI dispatcher.

For the Lua dialplan, store this in:

```sh
/usr/local/etc/asterisk/extensions.lua
```

The `pbx_lua` Asterisk module must be loaded for `extensions.lua` to be active. If your Asterisk installation uses the traditional dialplan, put equivalent logic in:

```sh
/usr/local/etc/asterisk/extensions.conf
```

Minimal Lua example:

```lua
local valid_digits = {
	["1"] = true,
	["2"] = true,
	["3"] = true,
	["4"] = true,
}

local function execute_selection(selection)
	if not valid_digits[selection] then
		app.playback("invalid")
		return false
	end

	app.answer()
	app.agi("/usr/local/phone-actions/phone_action_dispatcher.py", selection)

	local status = channel.ACTION_STATUS:get()
	if status == "ok" then
		local prompt = channel.ACTION_PROMPT:get()
		if prompt ~= nil and prompt ~= "" then
			app.playback(prompt)
		else
			app.playback("beep")
		end
		app.hangup()
		return true
	end

	app.playback("invalid")
	return false
end

local function action_menu()
	app.answer()
	channel.TIMEOUT("response"):set(5)
	app.read("SELECTION", "beep", 1, "", 1, 5)

	local selection = channel.SELECTION:get()
	if selection == nil or selection == "" then
		app.playback("vm-goodbye")
		app.hangup()
		return
	end

	if execute_selection(selection) then
		return
	end

	return action_menu()
end

extensions = {
	["phone-actions"] = {
		["YOUR_MENU_EXTENSION"] = action_menu;
	};
}
```

Asterisk `Playback()` uses sound names, not full filenames with extensions. Generated audio may need conversion to a format supported by the installed Asterisk format modules.

## Python AGI Dispatcher Layer

```sh
   [Analog desk phone]
        |
        | RJ11 phone cable
        v
   [Grandstream HT801 FXS port]
        |
        | SIP registration + DTMF + RTP audio over WAN/VPN
        v
   [Remote FreeBSD + Asterisk PJSIP endpoint]
        |
        | pbx_lua dialplan
        v
   [Asterisk AGI call]
        |
        | one validated digit
        v
=> [Python dispatcher]
        |
        | fixed whitelist map
        v
   [Local action scripts]
```

The dispatcher is launched by Asterisk. It validates the selected digit and maps it to a fixed script path.

Store it here:

```sh
/usr/local/phone-actions/phone_action_dispatcher.py
```

The dispatcher should:

```sh
Accept exactly one digit
Reject anything else
Use a whitelist map from digit to script path
Call subprocess.run() with a list, not shell=True
Use a timeout
Set Asterisk channel variables for the dialplan
Log failures
```

Shortened example:

```python
#!/usr/bin/env python3.11

import subprocess
from pathlib import Path

SCRIPT_DIR = Path("/usr/local/phone-actions")

ACTION_MAP = {
    "1": SCRIPT_DIR / "one.py",
    "2": SCRIPT_DIR / "two.py",
    "4": SCRIPT_DIR / "four.py",
}

def set_channel_variable(name: str, value: str) -> None:
    print(f'SET VARIABLE {name} "{value}"', flush=True)
    input()

def run_action_script(digit: str) -> int:
    if len(digit) != 1 or not digit.isdigit():
        set_channel_variable("ACTION_STATUS", "fail")
        return 1

    script_path = ACTION_MAP.get(digit)
    if script_path is None:
        set_channel_variable("ACTION_STATUS", "fail")
        return 1

    if not script_path.is_file():
        set_channel_variable("ACTION_STATUS", "fail")
        return 1

    completed = subprocess.run(
        [str(script_path)],
        check=False,
        capture_output=True,
        text=True,
        timeout=30,
    )

    if completed.returncode == 0:
        set_channel_variable("ACTION_STATUS", "ok")
    else:
        set_channel_variable("ACTION_STATUS", "fail")

    return completed.returncode
```

The real dispatcher also needs normal AGI environment parsing and logging. The key safety point is that keypad input never becomes shell syntax.

## Local Action Scripts Layer

```sh
   [Analog desk phone]
        |
        | RJ11 phone cable
        v
   [Grandstream HT801 FXS port]
        |
        | SIP registration + DTMF + RTP audio over WAN/VPN
        v
   [Remote FreeBSD + Asterisk PJSIP endpoint]
        |
        | pbx_lua dialplan
        v
   [Asterisk AGI call]
        |
        | one validated digit
        v
   [Python dispatcher]
        |
        | fixed whitelist map
        v
=> [Local action scripts]
```

Action scripts are normal executable programs called only through the dispatcher whitelist.

Store them under:

```sh
/usr/local/phone-actions/
```

Example layout:

```sh
/usr/local/phone-actions/phone_action_dispatcher.py
/usr/local/phone-actions/one.py
/usr/local/phone-actions/two.py
/usr/local/phone-actions/four.py
/usr/local/phone-actions/recordings/
```

Permissions should allow Asterisk to execute the scripts, while keeping write access restricted:

```sh
install -d -o root -g wheel -m 0755 /usr/local/phone-actions
install -m 0755 phone_action_dispatcher.py /usr/local/phone-actions/phone_action_dispatcher.py
install -m 0755 one.py /usr/local/phone-actions/one.py
install -m 0755 two.py /usr/local/phone-actions/two.py
install -m 0755 four.py /usr/local/phone-actions/four.py
```

## Verification Layer

```sh
=> [Analog desk phone]
        |
        | RJ11 phone cable
        v
=> [Grandstream HT801 FXS port]
        |
        | SIP registration + DTMF + RTP audio over WAN/VPN
        v
=> [Remote FreeBSD + Asterisk PJSIP endpoint]
        |
        | pbx_lua dialplan
        v
=> [Asterisk AGI call]
        |
        | one validated digit
        v
=> [Python dispatcher]
        |
        | fixed whitelist map
        v
=> [Local action scripts]
```

After all layers are configured:

```sh
service asterisk restart
asterisk -rx 'pjsip show contacts'
asterisk -rx 'pjsip show endpoints'
asterisk -rx 'dialplan show phone-actions'
```

Expected result:

```sh
HT801 registered as YOUR_SIP_USER_ID
Dialplan context phone-actions exists
Picking up the handset auto-dials YOUR_MENU_EXTENSION
Asterisk answers and waits for one digit
Pressing a whitelisted digit runs only the mapped local script
```

For troubleshooting, watch logs while testing:

```sh
tail -f /var/log/messages /var/log/asterisk/messages.log
```

If registration fails, check:

```sh
HT801 Primary SIP Server
HT801 SIP User ID
HT801 Authenticate ID
HT801 Authenticate Password
Asterisk pjsip.conf endpoint/auth/AOR names
Firewall rules for UDP 5060 and RTP
Whether the HT801 can reach YOUR_REMOTE_ASTERISK_HOSTNAME_OR_IP
```

Alex Deplov. Product designer, FreeBSD hobbist: https://interfacecraft.online/blog/
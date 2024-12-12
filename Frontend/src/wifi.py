import subprocess

# specify the Wi-Fi network name and password
network_name = "realme 6i"
password = "123456789"

# construct the netsh command to connect to the Wi-Fi network
command = f'netsh wlan connect ssid="{network_name}" key="{password}"'

# execute the netsh command using subprocess
result = subprocess.run(command, shell=True, capture_output=True, text=True)

# print the output of the command
print(result.stdout)

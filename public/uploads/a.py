import requests
import time
f=open('uniq.txt','r')
data=f.readlines()
for ip in data:
	resp=requests.get(f'https://tools.keycdn.com/geo.json?host={ip}')
	print(resp.json()['data']['geo']['country_name'])
	time.sleep(1)

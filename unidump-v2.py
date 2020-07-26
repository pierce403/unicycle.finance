import requests
import json
from time import time 

#url = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap'
url = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2'

now = int(time())
today = now-(now%86400) # get timestamp at start of day
yesterday = today-86400
print("Yesterday's timestamp was "+str(yesterday))

data = '''
query{
  pairDayDatas(first: 10, where:{date:'''+str(yesterday)+'''}, orderBy:dailyVolumeUSD, orderDirection:desc) {
    id
    pairAddress
    dailyVolumeUSD
    reserveUSD
    token0{
      name
      symbol
    }
    token1{
      name
      symbol
    }
  }
}
'''

response = requests.post(url,json={'query': data})
print(response.content)

for exchange in json.loads(response.content)['data']['pairDayDatas']:
  print(exchange['token0']['symbol']+'/'+exchange['token1']['symbol'])

  gainz_data = '''
query {
pairDayDatas(where:{pairAddress: "'''+exchange['pairAddress']+'''"}, orderBy:date, orderDirection:desc, first:14)
  {
    id
    date
    dailyVolumeUSD
    reserveUSD
  }
}
'''

  response2 = requests.post(url,json={'query': gainz_data})
  #print(response2.content)
  for gainz in json.loads(response2.content)['data']['pairDayDatas']:
    vol = float(gainz['dailyVolumeUSD'])
    liq = float(gainz['reserveUSD'])
    print(str(round(vol*0.003/liq*100*365,2)), end=" ")
  print("")


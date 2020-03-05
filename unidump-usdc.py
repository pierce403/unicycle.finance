import requests
import json

url = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap'
#url = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapbackup'

data = '''
query {
exchangeDayDatas(where:{exchangeAddress: "0x97dec872013f6b5fb443861090ad931542878126"}, orderBy:date, orderDirection:desc, first:10)
  {
    id
    date
    ethVolume
    ethBalance
  }
}
'''

response = requests.post(url,json={'query': data})
#print(response.content)
#print('\n')

for exchange in json.loads(response.content)['data']['exchangeDayDatas']:
  vol = float(exchange['ethVolume'])
  liq = float(exchange['ethBalance'])*2
  print(str(exchange['date'])+": "+str(vol*0.003/liq*100*365))

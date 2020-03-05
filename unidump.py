import requests
import json

url = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap'
#url = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapbackup'

data = '''
query {
  exchanges(first: 20, orderBy:tradeVolumeEth, orderDirection:desc) {
    id
    tokenAddress
    tokenSymbol
    tokenName
    combinedBalanceInEth
    tradeVolumeEth
  }
}
'''

response = requests.post(url,json={'query': data})
#print(response.content)

for exchange in json.loads(response.content)['data']['exchanges']:
  print(exchange['tokenName'])

  gainz_data = '''
query {
exchangeDayDatas(where:{exchangeAddress: "'''+exchange['id']+'''"}, orderBy:date, orderDirection:desc, first:14)
  {
    id
    date
    ethVolume
    ethBalance
  }
}
'''

  response2 = requests.post(url,json={'query': gainz_data})
  #print(response2.content)
  for gainz in json.loads(response2.content)['data']['exchangeDayDatas']:
    vol = float(gainz['ethVolume'])
    liq = float(gainz['ethBalance'])*2
    print(str(round(vol*0.003/liq*100*365,2)), end=" ")
  print("")


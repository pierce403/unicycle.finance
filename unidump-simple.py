import requests
import json

url = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap'
#url = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapbackup'

data = '''
query {
  uniswaps(first: 5) {
    id
    exchangeCount
    exchanges {
      id
    }
    totalVolumeInEth
  }
  exchanges(first: 5) {
    id
    tokenAddress
    tokenSymbol
    tokenName
  }
}
'''

response = requests.post(url,json={'query': data})
print(response.content)

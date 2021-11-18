import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

const projectAPI = process.env.INFURA_PROJECT_ID;

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {   
    // new instance of web3modal to connect metamask (other wallets supported)
    const web3Modal = new Web3Modal({
      network: "rinkeby", // optional
      cacheProvider: true, // optional, cache last chosen provider
    })
    // create connection via web3modal instance
    const connection = await web3Modal.connect()
    // provider creates READ ONLY access to blockchain data via connection
    const provider = new ethers.providers.Web3Provider(connection)
    // signer can be used to sign messages & transactions, can execute state changes 
    const signer = provider.getSigner() // if no addressOrIndex is used, first account is used => accounts[0] 

    // new ethers.Contract(contractAddress, abi, signerOrProvider)
    // marketContract use signer to allow state changes
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    // tokenContract use provider so no state changes are allowed
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    // instantiate data as all items returned from the fetchMarketItems() method
    const data = await marketContract.fetchMarketItems()
    console.log(data);
    
    // map data const to generate an array of item objects
    const items = await Promise.all(data.map(async i => {
      // uniform resource identifier for IPFS
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      // console.log(tokenUri);
      // axios api request for IPFS metadata
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    // update nfts state with mapped items
    setNfts(items)
    // console.log(...nfts);
    // update state to loaded
    setLoadingState('loaded') 
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4 w-10/12" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="pt-6 border shadow rounded-xl overflow-hidden text-right">
                <img src={nft.image} className="m-auto h-48"/>
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-800">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                  <button className="w-full bg-pink-800 text-gray-200 hover:text-gray-400 font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

import { Injectable } from "@nestjs/common";
import { ApproveDto } from "./dto/approve.dto";
import { SetBaseUriDto } from "./dto/set.baseuri.dto";
import { Web3Service } from "nest-web3";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";
const fs = require('fs');

@Injectable()
export class BlockchainService {
  constructor(
    private web3Service: Web3Service,
  ) {}

  // async getWeb3Test(): Promise<any> {
  //   const client = this.web3Service.getClient('eth');
  //   const contract = this.makeContractObject(client);
  //
  //   await contract.methods.getIsOnMarket(1).call({from: '0x4d6B9F1fA7ED84E2A78d218B2b7f0FA46ecCf3ea'}).then((result) => {
  //     console.log(result);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  //
  //   return 1;
  // }

  async setBaseUri(setBaseUriDto: SetBaseUriDto): Promise<any> {
    const client = this.web3Service.getClient('eth');
    const contract = this.makeContractObject(client);
    const gasPrice = await client.eth.getGasPrice();
    const gasEstimate = await contract.methods.setBaseUri(setBaseUriDto.baseUri).estimateGas({from: process.env.CORP_WALLET_ADDRESS });

    const tx = {
      from: process.env.CORP_WALLET_ADDRESS,
      to: process.env.MILLIMX_NFT_CONTRACT,
      gasPrice: gasPrice,
      gas: gasEstimate,
      data: contract.methods.setBaseUri(setBaseUriDto.baseUri).encodeABI()
    }

    let response: any = undefined;

    return await client.eth.accounts.signTransaction(tx, process.env.CORP_WALLET_PK).then(async (signedTx) => {
      return await client.eth.sendSignedTransaction(signedTx.rawTransaction).then((receipt) => {
        return response = receipt;
      });
    }).catch(function (error){
      console.log(error);
      throw new RuntimeException('setBaseUri failed...');
    });
  }

  async showtimeApprove(approveDto: ApproveDto): Promise<any> {
    const client = this.web3Service.getClient('eth');
    const contract = this.makeContractObject(client);
    const gasPrice = await client.eth.getGasPrice();
    const gasEstimate = await contract.methods.approve(approveDto.toAddress, approveDto.tokenId).estimateGas({from: process.env.CORP_WALLET_ADDRESS });

    const tx = {
      from: process.env.CORP_WALLET_ADDRESS,
      to: process.env.MILLIMX_NFT_CONTRACT,
      gasPrice: gasPrice,
      gas: gasEstimate,
      data: contract.methods.approve(approveDto.toAddress, approveDto.tokenId).encodeABI()
    }

    let response: any = undefined;

    return await client.eth.accounts.signTransaction(tx, process.env.CORP_WALLET_PK).then(async (signedTx) => {
      return await client.eth.sendSignedTransaction(signedTx.rawTransaction).then((receipt) => {
        return response = receipt;
      });
    }).catch(function (error){
      console.log(error);
      throw new RuntimeException('setBaseUri failed...');
    });
  }


  makeContractObject(client: any): any {
    const contractAddress = process.env.MILLIMX_NFT_CONTRACT;
    const contractAbi = fs.readFileSync('./MillimxNft.json', {encoding: 'utf-8'});
    return new client.eth.Contract(JSON.parse(contractAbi), contractAddress);
  }
}

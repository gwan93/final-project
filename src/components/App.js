import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import Color from '../abis/Color.json';
import Admin from '../screens/admin';
import Login from '../screens/login';
import Home from '../screens/home';

class App extends Component {

  // Executes when App component is attached to DOM
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  // Connect app to blockchain using Web3 library
  // Web3 turns the browser into a blockchain browser
  // The following configured to work with Ganache + MetaMask
  async loadWeb3() {
    // Create Web3 like so for Ethereum browsers
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    // Create Web3 for browsers with MetaMask Chrome extension addon
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    // If user has neither, Web3 cannot be created
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account/user
    // Grab all accounts within MetaMask
    const accounts = await web3.eth.getAccounts()
    // Set the account to the first account in MetaMask
    this.setState({ account: accounts[0] })

    // Make a copy of the smart contract
    // Grab network data based on the network MetaMask is currently connected to
    const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    // Check if smart contract is deployed to the network
    if(networkData) {
      const abi = Color.abi
      const address = networkData.address
      // Make the smart contract and then update state
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      // .call() reads data from the blockchain
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Colors
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call()
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
      console.log(this.state.colors)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = (color) => {
    // .send() puts new colors on the blockchain
    // requires an arg of the who is making the send request
    this.state.contract.methods.mint(color).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: []
    }
  }

  render() {
    return (
     
        <Switch>
          <Route path="/admin" exact> \
          <Admin
          account={this.state.account}
          colors={this.state.colors}
          color={this.color}
          mint={this.mint}
          /> </Route>

          <Route path="/login"><Login/> </Route>

          <Route path="/"><Home/></Route>
           </Switch>
        
    );
  }
}

export default App;

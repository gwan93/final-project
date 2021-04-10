import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Color from '../abis/Color.json'

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
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  {/* ref used to keep track of input form value 
                  this.color is defined from the ref function below*/}
                  const color = this.color.value
                  this.mint(color)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => { this.color = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.colors.map((color, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import React, {Component} from 'react';
import { inject, observer } from "mobx-react";
import '../../assets/stylesheets/application.css';
import {Link} from 'react-router-dom'
import CrowdsalesList from '../Common/CrowdsalesList'
import {Loader} from '../Common/Loader'
import {Button} from '../Common/Button'
import {loadRegistryAddresses,loadRegistryAddrsWithInfura} from '../../utils/blockchainHelpers'
import {ModalContainer} from '../Common/ModalContainer'
import { InputField } from "../Common/InputField";

@inject("web3Store")
@observer
export class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      showModalInp: false,
      loading: false,
      addressInpErr: ''
    }
  }

  chooseContract = () => {
    const { web3Store } = this.props
    const { web3 } = web3Store
    this.setState({loading: true, showModal: false, showModalInp: false});

    if (!web3) {
      console.log('No Metamask, only Infura');
      this.setState({loading: false, showModalInp: true})
    } else {
      if (!web3.eth.accounts[0]) {
        console.log('Metamask exists, but not logged in');
        this.setState({loading: false, showModalInp: true})
      } else {
        console.log('Metamask exists and loggedd in');
        loadRegistryAddresses().then(() => {
          this.setState({loading: false, showModal: true})
        }, (e) => {
          console.error('There was a problem loading the crowdsale addresses from the registry', e)
          this.setState({loading: false})
        })
      }
    }

  }

  onSubmitInp = () => {
    this.setState({loading: true, addressInpErr: ''})
    const addr = this.state.address
    const netId = '4'

    loadRegistryAddrsWithInfura(addr,netId).then(() => {
      this.setState({loading: false, showModalInp: false, showModal: true})
    }, (e) => {
      const addressInpErr = 'Please, check your address. No crowsales for it.'
      console.error(addressInpErr, e)
      this.setState({loading: false, addressInpErr: addressInpErr})
    })
  }

  updateAddress = (event) => {
    const val = event.target.value
    //this.setState(this.state,...{address: val})
    this.setState({address: val})
  }

  onClick = crowdsaleAddress => {
    this.props.history.push('/manage/' + crowdsaleAddress)
  }

  hideModal = () => {
    this.setState({showModal: false})
  }

  hideModalInp = () => {
    this.setState({showModalInp: false})
  }

  render() {
    return (<div>
      <section className="home">
        <div className="crowdsale">
          <div className="container">
            <h1 className="title">Welcome to ICO Wizard</h1>
            <p className="description">
              ICO Wizard is a client side tool to create token and crowdsale contracts in five steps. It helps you to publish contracts on the Ethereum network, verify them in Etherscan, create a crowdsale page with stats. For participants, the wizard creates a page to invest into the campaign.
              <br/>Smart contracts based on
              <a href="https://github.com/TokenMarketNet/ico">TokenMarket</a>
              contracts.
            </p>
            <div className="buttons">
              <Link to='/1'>
                <span className="button button_fill">New crowdsale</span>
              </Link>
              <div onClick={() => this.chooseContract()} className="button button_outline">Choose Contract</div>
            </div>
          </div>
        </div>
        <div className="process">
          <div className="container">
            <div className="process-item">
              <div className="step-icons step-icons_crowdsale-contract"></div>
              <p className="title">Crowdsale Contract</p>
              <p className="description">
                Select a strategy for crowdsale contract
              </p>
            </div>
            <div className="process-item">
              <div className="step-icons step-icons_token-setup"></div>
              <p className="title">Token Setup</p>
              <p className="description">
                Setup token and reserved distribution
              </p>
            </div>
            <div className="process-item">
              <div className="step-icons step-icons_crowdsale-setup"></div>
              <p className="title">Crowdsale Setup</p>
              <p className="description">
                Setup tiers and crowdsale parameters
              </p>
            </div>
            <div className="process-item">
              <div className="step-icons step-icons_publish"></div>
              <p className="title">Publish</p>
              <p className="description">
                Get generated code and artifacts for verification in Etherscan
              </p>
            </div>
            <div className="process-item">
              <div className="step-icons step-icons_crowdsale-page"></div>
              <p className="title">Crowdsale Page</p>
              <p className="description">
                Bookmark this page for the campaign statistics
              </p>
            </div>
          </div>
        </div>

        <ModalContainer title={'InputBox for Ethereum address'} description={`Please, make sure, that you have enabled your Metamask plugin. Otherwise, you can write your Ethereum wallet address to get information about your crowsales.`} hideModal={this.hideModalInp} showModal={this.state.showModalInp}>
          <div className="reserved-tokens-input-container-inner">
            <InputField side='left' type='text'
              errorMessage={this.state.addressInpErr}
              valid={''}
              title={'Address'}
              onChange={e => this.updateAddress(e)}
              description={`Your Ethereum wallet address.`}
            />
          </div>
          <Button containerStyle='button-container' text='Continue' onClick={this.onSubmitInp}/>
        </ModalContainer>

        <ModalContainer title={'Crowdsale List'} description={`The list of your updatable crowdsales. Choose crowdsale address, click Continue and you'll be able to update the parameters of crowdsale.`} hideModal={this.hideModal} showModal={this.state.showModal}>
          <CrowdsalesList onClick={this.onClick}/>
        </ModalContainer>

        <Loader show={this.state.loading}></Loader>
      </section>
    </div>);
  }
}



/*

        <ModalContainer title={'InputBox for address and net'} description={`Please, make sure, that you have enabled your Metamask plugin. Otherwise, you can write your Ethereum wallet address and the name of a net, in which you have added your crowsale contract.`} hideModal={this.hideModalInp} showModal={this.state.showModalInp}>
          <InputField side='left' type='text'
            errorMessage={''}
            valid={''}
            title={'Address'}
            value={'0x3c8DF154241e6917959BcE6Ad1d8E3D3D1B13C64'}
            onChange={e => this.updateAddress(e)}
            description={`Your Ethereum wallet address.`}
          />
          <div onClick={this.onSubmitInp} className="button button_fill"> Continue </div>
        </ModalContainer>

*/

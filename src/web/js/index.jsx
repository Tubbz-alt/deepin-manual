import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

import Scrollbar from './scrollbar.jsx';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      title: '',
      logo: '',
      show: false
    };
    const path = `${global.path}/${this.props.appName}/${global.lang}/`;
    const file = path + `index.md`;
    global.readFile(file, data => {
      let [title, logo] = data
        .substr('# '.length, data.indexOf('\n'))
        .split('|');
      logo = `${path}${logo}`;

      this.setState({ title, logo, file, show: true });
    });
  }
  render() {
    var contentSpan = null;
    if (this.props.isOpened)
    {
      contentSpan = (<span className="content" lang={global.lang}>{this.state.title}</span>)
    }
    else
    {
      contentSpan = (<span className="content" lang={global.lang}><span className="tag"></span>{this.state.title}</span>)
    }

    return (
      this.state.show && (
        <div
          draggable="false"
          tabIndex="1"
          className="item"
          onClick={() => global.open(this.props.appName)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              global.open(this.props.appName);
            }
          }}
        >
          
          <img
            draggable="false"
            src={this.state.logo}
            alt={this.props.appName}
          />
          <br />
          {contentSpan}
        </div>
      )
    );
  }
}

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appList: [],
      openedAppList:[]
    };

    global.qtObjects.manual.getSystemManualList(appList =>
      this.setState({ appList })
    );

    global.qtObjects.manual.getUsedAppList(openedAppList =>
      this.setState({openedAppList})
    );
  }

  bIsBeOpen(app){
    if (this.state.openedAppList.indexOf(app) != -1)
    {
      return true;
    }
    return false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("index shouldcomponentupdate");
    if (nextState.appList.toString() == this.state.appList.toString() 
          && nextState.openedAppList.toString() == this.state.openedAppList.toString()) 
    {
      console.log("index no update");
      return false;
    }
    return true;
  }
  componentDidUpdate() {
    ReactDOM.findDOMNode(this)
      .querySelector('#index')
      .focus();
  }
  render() {
    let sysSoft = ['dde'].filter(
      appName => this.state.appList.indexOf(appName) != -1
    );

    let appSoft = this.state.appList.concat(); //使用数据副本
    var index = appSoft.indexOf("dde");
    appSoft.splice(index, 1);
    // let otherSoft = [""];

    return (
      <Scrollbar>
        <div id="index" tabIndex="-1">
          <h2>{global.i18n['System']}</h2>
          {sysSoft.length > 0 && (
            <div id="forMargin">
                <div className="items">
                  {sysSoft.map(appName => <Item key={appName} appName={appName} isOpened={this.bIsBeOpen(appName)}/>)}
                </div>
            </div>
          )}
          <h2>{global.i18n['Applications']}</h2>
          <div id="forMargin">
              <div className="items">
                {appSoft.map(appName => <Item key={appName} appName={appName} isOpened={this.bIsBeOpen(appName)}/>)}
                {/* {otherSoft.map(appName => <Item key={appName} appName={appName} isOpened={this.bIsBeOpen(appName)}/>)}
                {Array.from(new Array(10), (val, index) => index).map(i => (
                  <a key={i} className="empty" />
                ))} */}
              </div>
           </div>
        </div>
      </Scrollbar>
    );
  }
}

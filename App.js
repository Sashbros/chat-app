import React from 'react';
import './App.css';

class AddPer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="AddPer">
        <button className="addContacts" onClick={this.props.handleAddingContacts}><h1>ADD SOMEONE</h1></button>
      </div>
    );
  }
}
class Contacts extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="Contacts">
        <br />
        {
          this.props.people.map((name) => {
            return (
              <input type="button" className='user' onClick={(e) => this.props.toggleClass(e)} value={name} />
            );
          }
          )
        }
      </div>
    );
  }
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="Chat">
        {/* <div className="chatmsgother">Hey there!</div>
        <div className="chatmsgself">Hi hello</div>
        <div className="chatmsgother">Hey there!Her </div>
        <div className="chatmsgself">Heyyey th there!Hey re!tHey re!</div>
        <div className="chatmsgself">Heyyey th there!Hey re!tHey re!</div> */}
        {
          this.props.msgSend.map((name) => {
            if (this.props.activeUser == name.other || this.props.selfName == name.other) {
              if (name.type == "chatmsgself") {
                return (
                  <div className="chatmsgself">{name.text}</div>
                );
              }
              else if (name.type == "chatmsgother") {
                return (
                  <div className="chatmsgother">{name.text}</div>
                );
              }
            }

          }
          )
        }
      </div>
    );
  }
}
class Message extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  handleTextChange(e) {
    this.props.onTextChange(e.target.value);
  }
  render() {
    const message = this.props.message;
    return (
      <div className="Message">
        <input className="msg" type="text" value={message} onChange={this.handleTextChange} />
        <button className="sendmsg" onClick={this.props.handleSendingMsg}>SEND</button>
      </div>
    );
  }
}
var flag = 1;
class Split extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddingContacts = this.handleAddingContacts.bind(this);
    this.handleSendingMsg = this.handleSendingMsg.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.state = {
      people: [],
      msgSend: [

      ],
      message: '',
      activeUser: '',
      sendmsg: '',
      selfName: '',

      webmes: '',
      webfrom: ''
    }
  }
  _exsocket = null

  handleAddingContacts() {
    if (flag == 1) {
      this.setState({ selfName: prompt("Register yourself first to access web chat") }, () => {
        console.log(this.state.selfName);
        flag = 0;
        var a = prompt("ADD?");
        this.setState(
          state => ({people : [a, ...state.people]}), ()=>{
            this._exsocket = new WebSocket("ws://localhost:8080/chat?username="+this.state.selfName)
            this._exsocket.onmessage = (event) => {
              console.log("WEBSOCKET IS BEING USED");
              var msgToBeRece = JSON.parse(event.data);
              this.setState({
                webmes: msgToBeRece.message,
                //var to = msgToBeRece.to;
                webfrom: msgToBeRece.from
                //var date = msgToBeRece.timestamp
              },() => {
              this.setState(
                state => ({msgSend : [...state.msgSend, { text: state.webmes, type: "chatmsgother", other: state.webfrom, self: state.selfName }]}), 
                ()=>console.log(this.state)
              )
              }
              );
              
              
        
              //console.log("ComponentDIDMOUNT");
        
        
            }
          } 
        )
      });
    } else {

      var a = prompt("ADD?");
      this.setState(
        this.state.people = [a, ...this.state.people]
      )
    }
    console.log(this.state.people);
  }
  handleSendingMsg() {
    var msg = this.state.message;
    this.state.sendmsg = msg;
    //websocket code is here
    var msgToBeSend = {
      to: this.state.activeUser,
      from: this.state.selfName,
      message: this.state.sendmsg,
      timestamp: new Date()
    }
      this._exsocket.send(JSON.stringify(msgToBeSend));
    // console.log(msgToBeSend.to, msgToBeSend.from, msgToBeSend.message, "this is going to server");

    /* this._ws.onmessage = function (event) {
      var msgToBeRece = JSON.parse(event.data);
      this._webmes = msgToBeRece.message;
      var to = msgToBeRece.to;
      this._webfrom = msgToBeRece.from;
      var date = msgToBeRece.timestamp;
    } */
    //console.log(this.state.sendmsg);//what message is to be sent to other
    this.setState(
      this.state.msgSend = [...this.state.msgSend, { text: msg, type: "chatmsgself", other: this.state.activeUser, self: this.state.selfName },
                                                  /* {text: this.state.webmes, type: "chatmsgother", other: this.state.webfrom, self: this.state.selfName} */]
    )
    console.log(this.state.msgSend);
    this.state.message = "";
    //this.componentDidMount();
  }
  onTextChange(message) {
    this.setState(
      { message }
    );
    //this.handleSendingMsg(message);
    console.log(this.state.message);
  }
  toggleClass(e) {
    //console.log(e.target.value);

    var element = document.getElementsByClassName("user");
    for (var name = 0; name < element.length; name++) {

      if (element[name].classList.contains("active")) {
        element[name].classList.remove("active");

      }
      /* else
      {
        element[name].classList.remove("");
      } */
    }
    //console.log("Hey you clicked");
    for (var name = 0; name < element.length; name++) {
      if (e.target.value == element[name].value) {
        element[name].classList.add("active");
      }
    }
    this.setState({
      activeUser: e.target.value
    }
    )
    console.log(this.state.activeUser, "I M THE GOD");//this is the name of other
    //element[0].classList.add("active");
  }
  componentDidMount() {
    //var exsocket = new WebSocket("ws://localhost:8080/chat?username=abc");


    /* this._exsocket.onmessage = function (event) {
      console.log("WEBSOCKET IS BEING USED");
      var msgToBeRece = JSON.parse(event.data);
      this.state.webmes = msgToBeRece.message;
      var to = msgToBeRece.to;
      this.state.webfrom = msgToBeRece.from;
      var date = msgToBeRece.timestamp;
      this.setState(
        this.state.msgSend = [...this.state.msgSend, { text: this.state.webmes, type: "chatmsgother", other: this.state.webfrom, self: this.state.selfName }]
      );

      console.log("ComponentDIDMOUNT");


    } */
    console.log(this.state.webmes, this.state.webfrom);

  }
  /*  componentDidUpdate()
   {
     if(this.state.msgSend)
     {
       this.componentDidMount();
     }
   } */

  //websocket code

  /*   WebSocket() {
      var exampleSocket = new WebSocket("ws://localhost:8080/chat?username=%s");
      var msgToBeSend = {
        To: this.state.activeUser,
        From: this.state.selfName,
        Message: this.state.sendmsg,
        Timestamp: Date.now()
      }
      exampleSocket.onopen = function (event) {
        exampleSocket.send(JSON.stringify(msgToBeSend));
      };
      exampleSocket.onmessage = function (event) {
        var msgToBeRece = JSON.parse(event.data);
        var mess = msgToBeRece.Message;
        var to = msgToBeRece.To;
        var from = msgToBeRece.From;
        var date = msgToBeRece.Timestamp;
      };
    } */

  render() {
    const message = this.state.message;
    return (
      <div className="Split">
        <div className="left">
          <div className="ltop">
            <AddPer handleAddingContacts={this.handleAddingContacts} />
          </div>
          <div className="lbottom">
            <Contacts people={this.state.people}
              toggleClass={(e) => this.toggleClass(e)}
            />
          </div>
        </div>

        <div className="right">
          <div className="rtop">
            <Chat msgSend={this.state.msgSend}
              activeUser={this.state.activeUser}
            />
          </div>
          <div className="rbottom">
            <Message
              handleSendingMsg={this.handleSendingMsg}
              message={message}
              onTextChange={this.onTextChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
function App() {
  //var a = prompt("name?");

  return (
    <Split

    />
  );
}

export default App;

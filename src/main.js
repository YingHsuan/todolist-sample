var List = React.createClass({
  getInitialState: function(){
      return {editTexts: this.props.items, editModes: _.cloneDeep(this.props.items)};
  },

  btnEdit: function(index, editModeValue){
    //copy item from Init
    //this.setState({editTexts: this.props.items});
    this.btnSetMode(index, editModeValue);
  },

  btnOk: function(index, value, editModeValue){
    this.props.btnOk(index, value);
    this.btnSetMode(index, editModeValue);
  },

  btnSetMode: function(index, editModeValue){
    //this.state.editModes.splice(index, 1, editModeValue);
    this.state.editModes[index] = editModeValue;
    this.setState({editModes: this.state.editModes});
  },

  editTextOnChange: function(index, e){
    //update editTexts
    this.state.editTexts.splice(index, 1, e.target.value);
    //this.state.editTexts[index] = e.target.value;
    this.setState({editTexts: this.state.editTexts});
  },

  render: function(){
    var _self = this;
    var createItem = function(itemText, index) {
      return (
        <li key={index} className={_self.state.editModes[index] == true ? 'editing' : ''}>
        <div className="edit">
          <input onChange={_self.editTextOnChange.bind(this, index)} value={_self.state.editTexts[index]} />
          <button onClick={_self.btnOk.bind(this, index, _self.state.editTexts[index], false)} className="btn btn-primary btn-xs">ok</button>
        </div>
        <div className="display">{itemText}
          <button onClick={_self.props.btnDelete.bind(this, index)} className="btn btn-danger btn-xs">delete</button>
          <button onClick={_self.btnEdit.bind(this, index, true)} className="btn btn-info btn-xs">edit</button>
        </div>
      </li>
      )
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

var Init = React.createClass({
  getInitialState: function(){
    return {items: [], text: ''};
  },

  onChange: function(e){
    this.setState({text: e.target.value});
  },

  componentWillReceiveProps: function(e){
    console.log('Init update: '+this.state.items);
  },

  btnAdd: function(e){
    e.preventDefault();//避免預設的事件
    //start propagation -> 避免Bubble問題
    //var nextItems = this.state.items.concat([this.state.text]);
    this.state.items.push(this.state.text);
    var nextText = '';
    this.setState({items: this.state.items, text: nextText});
  },

  btnOk: function(index, value){
    this.state.items.splice(index, 1, value);
    this.setState({items: this.state.items});
  },

  btnDelete: function(index){
    this.state.items.splice(index, 1);
    this.setState({items: this.state.items});
  },

  render: function() {
    return (
      <div>
        <form id="addForm">
          <div className="input-group has-success">
            <input onChange={this.onChange} value={this.state.text} className="form-control"/>
            <span className="input-group-btn">
              <button onClick={this.btnAdd} className=" btn btn-success btn">Add to list</button>
            </span>
          </div>
        </form>
        <List items={this.state.items} btnOk={this.btnOk} btnDelete={this.btnDelete} />
      </div>
    );
  }
});

React.render(
  <Init />,
  document.getElementById('container')
);








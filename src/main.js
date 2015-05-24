var List = React.createClass({
  getInitialState: function(){
      return {editTexts: _.cloneDeep(this.props.items), editModes: _.cloneDeep(this.props.items)};
  },

  componentWillMount: function(){
  },

  componentWillReceiveProps: function(){
    this.setState({editTexts: _.cloneDeep(this.props.items)});
  },

  btnEdit: function(e){
    //copy item from Init
    var idx = e.target.getAttribute('data-idx');
    this.btnSetMode(idx, true);
  },

  btnOk: function(e){
    var idx = e.target.getAttribute('data-idx');
    var _self = this;
    var todoitem = new Firebase('https://todolist-storage.firebaseio.com/todolists/'+this.state.editTexts[idx].key);
    var onComplete = function(error){
      if(error)
      {
        alert('Update failed.');
      }
      else
      {
        _self.props.btnOk(idx, _self.state.editTexts[idx].content);
        _self.btnSetMode(idx, false);
      }

    };
    todoitem.update({'todo-items' :_self.state.editTexts[idx].content}, onComplete);
    
  },

  btnSetMode: function(index, editModeValue){
    this.state.editModes[index] = editModeValue;
    this.setState({editModes: this.state.editModes});
  },

  btnDelete: function(e){

    var idx = e.target.getAttribute('data-idx');
    var _self = this;
    var todoitem = new Firebase('https://todolist-storage.firebaseio.com/todolists/'+this.state.editTexts[idx].key);
    var complete = function(error){
      if(error)
      {
        alert('Delete item failed.');
      }
      else
      {
        _self.props.btnDelete(idx);

        // _self.state.editTexts.splice(idx, 1);
        // _self.setState({editTexts: _self.state.editTexts});

        // _self.state.editModes.splice(idx, 1);
        // _self.setState({editModes: _self.state.editModes}); 
      }
    };
    todoitem.remove(complete);
  },

  editTextOnChange: function(e){
    var idx = e.target.getAttribute('data-idx');
    // update editTexts
    //this.state.editTexts.splice(idx, 1, e.target.value);
    this.state.editTexts[idx].content = e.target.value;
    this.setState({editTexts: this.state.editTexts});
  },

  render: function(){
    var _self = this;
    var createItem = function(itemText, index) {
      return (
        <li key={index} className={_self.state.editModes[index] == true ? 'editing' : ''}>
        <div className="edit">
          <input onChange={_self.editTextOnChange} data-idx={index} value={_self.state.editTexts[index].content} />
          <button onClick={_self.btnOk} data-idx={index} className="btn btn-primary btn-xs">ok</button>
        </div>
        <div className="display">{itemText.content}
          <button onClick={_self.btnDelete} data-idx={index} className="btn btn-danger btn-xs">delete</button>
          <button onClick={_self.btnEdit} data-idx={index} className="btn btn-info btn-xs">edit</button>
        </div>
      </li>
      )
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

var Main = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {items: [], text: ''};
  },

  componentDidMount: function(){
    var _self = this;
    var todolists = new Firebase('https://todolist-storage.firebaseio.com/todolists');
    todolists.on('child_added', function(snapshot){
      if(snapshot.exists())
      {
          snapshot.forEach(function(todolistsChildSnapshot){
          _self.state.items.push({"content": todolistsChildSnapshot.val(), "key": snapshot.key()});
          _self.setState({items: _self.state.items});
        });
      }
      else
      {
        console.log('no todo-items');
      };
    });
  },
  // onChange: function(e){
  //   this.setState({text: e.target.value});
  // },

  btnAdd: function(e){
    e.preventDefault();//避免預設的事件
    //start propagation -> 避免Bubble問題
    //var nextItems = this.state.items.concat([this.state.text]);
    //this.state.items.push(this.state.text);

    //store data to firebase
    var myData = new Firebase('https://todolist-storage.firebaseio.com/todolists');
    myData.push({'todo-items': this.state.text});
    
    var nextText = '';
    this.setState({text: nextText});
  },

  btnOk: function(index, value){
      this.state.items[index].content = value;
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
            <input valueLink={this.linkState('text')} className="form-control"/>
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
  <Main />,
  document.getElementById('container')
);








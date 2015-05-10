var List = React.createClass({
  getInitialState: function(){
    return {editTexts: [], editModes: []};
  },

  componentWillReceiveProps: function(){
    this.setState({editModes: _.cloneDeep(this.props.items)});
  },

  btnEdit: function(index, editModeValue){
    //copy item from Init
    this.setState({editTexts: _.cloneDeep(this.props.items)});
    this.btnSetMode(index, editModeValue);
  },

  btnOk: function(index, value, editModeValue){
    this.props.btnOk(index, value);
    this.btnSetMode(index, editModeValue);
  },

  btnSetMode: function(index, editModeValue){
    this.state.editModes.splice(index, 1, editModeValue);
    this.setState({editModes: this.state.editModes});
  },

  editTextOnChange: function(index, e){
    //update editTexts
    this.state.editTexts.splice(index, 1, e.target.value);
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
    return {items: [], text: '', IndexOnEdit: -1};
  },

  onChange: function(e){
    this.setState({text: e.target.value});
  },

  btnAdd: function(e){
    e.preventDefault();//避免預設的事件
    //start propagation -> 避免Bubble問題
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
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
        <List items={this.state.items} btnOk={this.btnOk} btnDelete={this.btnDelete} getIndexOnEdit={this.state.IndexOnEdit}/>
      </div>
    );
  }
});

React.render(
  <Init />,
  document.getElementById('container')
);


// --------------------------------------------------  //


var App = {};
//init todo list data structure
App.init = function(){

  $('#add').keypress(function(e){
    if(e.which == 13){
      //$('#addbtn').click();
      $('#myForm').submit();
      //console.log('add enter get');
    }
  });

  //use delegate replace event bind func
  $('#todo-list').delegate('.btnEdit','click',function(event){
    $target = $(event.target);
    //console.log(data.length-1-parseInt($target.index('.btnEdit')));
    $target.parent().parent().addClass("editing");
  });

  $('#todo-list').delegate('.btnDelete','click',function(event){
    $target = $(event.target);
    App.remove($target.index('.btnDelete'));
    App.render();
  });

  $('#todo-list').delegate('.btnOk','click',function(event){
    $target = $(event.target);
    
    App.update($target.index('.btnOk'), $target.prev().val());
    $target.parent().parent().removeClass();
    App.render();
  });
  
  //this.data = [];

  var getStorage = localStorage.getItem('Dataset');
  if(typeof getStorage !== 'undefined' && getStorage != null)
  {
    this.data = JSON.parse(getStorage);
    //console.log(data);
  }
  else
  {
    this.data = [];
  }
  
  App.render();

  // for(var i=0; i<10000; i++){
  //   //add html string here
  //   App.add("testword");
  // }

  $('#addbtn').on('click', function(event){
    //console.log('addbtn clicked');
    $target = $(event.target);
    var str = $target.parent().prev().val();
    //console.log(str);
    App.add(str);
    //clean input
    $target.parent().prev().val("");
  });
};

//Add function to add list
App.add = function(str){
  this.data.push(encodeURIComponent(str));
  //localStorage
  localStorage.setItem('Dataset', JSON.stringify(this.data));


  App.render();
};

//bind btn event 
// App.btnBinding = function(){
//   $('.btnEdit').on('click', function(event){
//     $target = $(event.target);
//     $target.parent().parent().addClass("editing");
//   });

//   $('.btnOk').on('click', function(event){
//     $target = $(event.target);
//     App.update($target.val(), $target.prev().val());
//     $target.parent().parent().removeClass();
//     App.render();
//   });

//   $('.btnDelete').on('click', function(event){
//     $target = $(event.target);
//     App.remove($target.val());
//     App.render();
//   });
// };

//remove
App.remove = function(index){
  this.data.splice(this.data.length-1-index, 1);
  localStorage.setItem('Dataset', JSON.stringify(this.data));
};
//update
App.update = function(index, value){
  console.log('update start');
  this.data.splice(this.data.length-1-index, 1, value);
  localStorage.setItem('Dataset', JSON.stringify(this.data));
};

//decode
App.decode = function(str){
  var item = decodeURIComponent(str);
  return item
};

//render
App.render = function(){

  //use cloneDeep to avoid call by reference
  var tempData = _.cloneDeep(this.data);

  tempData = tempData.reverse();
  html = "";
  for(var i=0; i<tempData.length; i++){
    //add html string here
    tempData[i] = App.decode(tempData[i]);
    html += 
    '<li class="list-group-item">' +
    '<div class="edit"><input value="'+$('ul').text(tempData[i]).html()+'" /><button class="btn btn-info btn-xs btnOk">ok</button></div>'+
    '<div class="display"><span>'+$('ul').text(tempData[i]).html()+'</span><button class="btn btn-danger btn-xs btnDelete">delete</button><button class="btn btn-success btn-xs btnEdit">edit</button></div>'+
    '</li>'
    ;
  }

  //for(var i=0; i<data.length; i++){
    //add html string here
    //React.render(
  //   '<li class="list-group-item">' +
  //   '<div class="edit"><input value="'+data[i]+'" /><button class="btn btn-info btn-xs btnOk">ok</button></div>'+
  //   '<div class="display"><span>'+data[i]+'</span><button class="btn btn-danger btn-xs btnDelete">delete</button><button class="btn btn-success btn-xs btnEdit">edit</button></div>'+
  //   '</li>'
  //    );
  //}

  $('ul').html(html);
  //this.data.reverse();
};


//App.init();








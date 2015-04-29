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
    var str = encodeURIComponent($target.parent().prev().val());
    //console.log(str);
    App.add(str);
    //clean input
    $target.parent().prev().val("");
  });
};

//Add function to add list
App.add = function(str){
  this.data.push(str);
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
//render
App.render = function(){

  //use cloneDeep to avoid call by reference
  var tempData = _.cloneDeep(this.data);

  tempData = tempData.reverse();
  html = "";
  for(var i=0; i<tempData.length; i++){
    //add html string here
    html += 
    '<li class="list-group-item">' +
    '<div class="edit"><input value="'+$('ul').text(decodeURIComponent(tempData[i])).html()+'" /><button class="btn btn-info btn-xs btnOk">ok</button></div>'+
    '<div class="display"><span>'+$('ul').text(decodeURIComponent(tempData[i])).html()+'</span><button class="btn btn-danger btn-xs btnDelete">delete</button><button class="btn btn-success btn-xs btnEdit">edit</button></div>'+
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


App.init();






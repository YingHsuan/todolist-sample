var App = {};
//init todo list data structure
App.init = function(){
  //check localStorage
  this.data = [];

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

  $('#addbtn').on('click', function(event){
  //console.log('addbtn clicked');
  $target = $(event.target);
  var str = $target.prev().val();
  //console.log(str);
  App.add(str);
  //clean input
  $target.prev().val("");
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
  this.data.splice(index, 1);
  localStorage.setItem('Dataset', JSON.stringify(this.data));
};
//update
App.update = function(index, value){
  console.log('update start');
  this.data.splice(index, 1, value);
  localStorage.setItem('Dataset', JSON.stringify(this.data));
};
//render
App.render = function(){
  //console.log('render start');

  data = this.data;
  html = "";
  for(var i=0; i<data.length; i++){
    //add html string here
    html += 
    '<li>' +
    '<div class="edit"><input value="'+data[i]+'" /><button class="btnOk">ok</button></div>'+
    '<div class="display"><span>'+data[i]+'</span> <button class="btnEdit">edit</button> <button class="btnDelete">delete</button></div>'+
    '</li>'
    ;
  }
  $('ul').html(html);
  //bind btn event
  //this.btnBinding();
};


App.init();

//use delegate replace event bind func
$('#todo-list').delegate('.btnEdit','click',function(event){
  $target = $(event.target);
  //console.log($target.index('.btnEdit'));
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




 $(document).ready(function () {
       var planets=null;
       var vehicles=null;
       var planetNameArray=[];
    var selectedPlanets=[];
    var selectedVehicles=[];
    var timeTaken=0;
    var totalDistance=0;


   
    $('#radioBtn1').change(function(){
      debugger;
      var elements = document.getElementsByName('group1');
      radioValueBind(elements,"#dr1");
    });
    $('#radioBtn2').change(function(){

      var elements = document.getElementsByName('group2');
      radioValueBind(elements,"#dr2");
    });
    $('#radioBtn3').change(function(){
   
      var elements = document.getElementsByName('group3');
      radioValueBind(elements,"#dr3");
    });
    $('#radioBtn4').change(function(){
      var elements = document.getElementsByName('group4');
      radioValueBind(elements,"#dr4");
      $('#getResult').prop("disabled", true);
      $('#getResult').removeAttr("disabled");
    });


var radioValueBind=function(elements,pId){
  var checkedButton;
      console.log(elements);
      elements.forEach(e => {
          if (e.checked) {
              //if radio button is checked, set sort style
              checkedButton = e.value;
              var vInd= vehicles.findIndex(o=>o.name==e.value.replace("_"," "));
              vehicles[vInd].total_no=vehicles[vInd].total_no-1;
              selectedVehicles.push(vehicles[vInd].name.replace("_"," "));
              var pInd=planets.findIndex(o=>o.name==$(pId).val());
              timeTaken= timeTaken + (planets[pInd].distance / vehicles[vInd].speed);
              $("#timetaken").text(timeTaken);

          }
      });
}

    var disableClass=" ";
    $('#dr1').change(function () {
       
              mapData( this.options[this.selectedIndex].text); 
                        
              appendData("#dr2");

              $.each(vehicles, function (index, value) { 
                if(value.total_no < 1)
                            disableClass="disabled";
                        else 
                        disableClass=" ";
                  $( '<input type="radio" class="radio-btn" name="group1" value='+$.trim(value.name).replace(" ", "_")+' '+disableClass+' /> <label  class="radio-label" > '+value.name +'('+value.total_no+')'+ ' </label>  <br>' ).appendTo('#radioBtn1');              
                  if(value.total_no < 1)
                    $('#radioBtn1').attr('disabled', 'disabled')
              });
              
            });
            $('#dr2').change(function () {
              
              mapData( this.options[this.selectedIndex].text); 
                    appendData("#dr3");
                    
                    $.each(vehicles, function (index, value) { 
                        if(value.total_no < 1)
                            disableClass="disabled";
                        else 
                        disableClass=" ";

                      $( '<input type="radio" class="radio-btn" name="group2" value='+$.trim(value.name).replace(" ", "_")+' '+disableClass+' /> <label class="radio-label" > '+value.name +'('+value.total_no+')'+ ' </label>  <br>' ).appendTo('#radioBtn2');              
                     
                    });

                  });
                  $('#dr3').change(function () {
                   
                    mapData( this.options[this.selectedIndex].text);                        
                          appendData("#dr4");
                          $.each(vehicles, function (index, value) { 

                            if(value.total_no < 1)
                            disableClass="disabled";
                        else 
                        disableClass=" ";

                            $( ' <input type="radio" class="radio-btn" name="group3" value='+$.trim(value.name).replace(" ", "_")+' '+disableClass+' /> <label class="radio-label" > '+value.name +'('+value.total_no+')'+ ' </label>  <br>' ).appendTo('#radioBtn3');              
                          });

                        });
                        $('#dr4').change(function () {
                         
                          mapData( this.options[this.selectedIndex].text); 
                          $.each(vehicles, function (index, value) { 

                            if(value.total_no < 1)
                            disableClass="disabled";
                        else 
                        disableClass=" "; 

                            $( '<input type="radio" class="radio-btn" name="group4" value='+$.trim(value.name).replace(" ", "_")+' '+disableClass+' /> <label class="radio-label" > '+value.name +'('+value.total_no+')'+ ' </label>  <br>' ).appendTo('#radioBtn4');              
                          });

                              });
                        
                              var mapData=function(selectedValue){
                                selectedPlanets.push(selectedValue);
                                var IndexVal= planets.find(function(item, i){  if(item.name === selectedValue){ return i } });
                                if(IndexVal!=undefined && IndexVal !=-1 )
                                  totalDistance=totalDistance + IndexVal.distance;  
                              }

    var appendData =function(id){
       $(id).empty();  
       $(id).append('<option> Select </option>');
        $.each(planetNameArray, function (index, value) {
                      if(selectedPlanets.indexOf(value)==-1)
                        $(id).append('<option value="' + value + '">' + value + '</option>');
                    });
    }

       function loadData(){
        $.get('https://findfalcone.herokuapp.com/planets',  // url
          function (data, textStatus, jqXHR) {  // success callback
           
              planets=data;
              $.each(planets, function (index, value) { planetNameArray.push(value.name);  });
              appendData("#dr1");
        });
        $.get('  https://findfalcone.herokuapp.com/vehicles',  // url
          function (data, textStatus, jqXHR) {  // success callback
           
            vehicles=data;
        });

       }

     var findFalcone= function (token) {
      
      var newData =   {
      "token":token,
      "planet_names":selectedPlanets,
      "vehicle_names":selectedVehicles
    };
      var dataJson = JSON.stringify(newData);
      $.ajax({
        url: "https://findfalcone.herokuapp.com/find",
        type: "POST",
        headers: {
          "Accept" : "application/json",  
          "Content-Type" : "application/json"      
      },
        data: dataJson,
        dataType:"json",
               
        success: function (data) {
          debugger;
            console.info(data);
            if(data.status=="success"){
              localStorage.setItem('timeTaken', JSON.stringify(timeTaken));
              localStorage.setItem('planetFound', JSON.stringify(data.planet_name));
             
               window.location.href ="Result.html";
            }
            else{
              alert("Failed ! Try with some other vehicle and planets.");
              location.reload();
            }
            
        }
    });

  }
    
 

    $("#getResult").click(function(){
    $.ajax({
      url:"https://findfalcone.herokuapp.com/token",
      type:"POST",
      headers: {
        "Accept" : "application/json",
      },
      data: {},
      dataType:"json",
      success: function (data) {
          debugger;
          findFalcone(data.token);
        
        }
    })
  });

$("#reset").click(function(){
  location.reload();
});

  loadData();

 });
      
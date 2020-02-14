function myDemo (widgetsRequiredID,widgetContainerId,widgetsClass){
	this.widgetsRequired = document.getElementById(widgetsRequiredID);
	this.widgetContainer = document.getElementById(widgetContainerId);
	this.widgets = document.getElementsByClassName(widgetsClass);
	this.count = 0;
	this.widgetsRequired.focus();
}
myDemo.prototype.removeEl = function(){
	if(this.widgets.length > 0){
		for(let i =0;i< this.widgets.length; i++){
			this.widgetContainer.removeChild(this.widgetContainer.childNodes[0]);
		}		
	}

}
myDemo.prototype.createContainer = function(numberOfWdiget){
	for(let i=0;i< numberOfWdiget; i++) {
		let thisElement = document.createElement("div");
			thisElement.className = "required-widget cols-2-sm cols-3-md";
			this.widgetContainer.appendChild(thisElement); 
	}
}
myDemo.prototype.createWidget = function(myContainer,index){
	let option;
	let array = ["EUR","USD","HKD"];
	let thisElement = document.createElement("h2");
	let t = document.createTextNode("Currency converter");
	
		thisElement.appendChild(t);
		thisElement.className = "mtb-10";
		myContainer.appendChild(thisElement); 
		thisElement = document.createElement("h3");
		t = document.createTextNode("Type in amount and select currency");
		thisElement.appendChild(t);
		thisElement.className = "mb-10";
		myContainer.appendChild(thisElement); 
		thisElement = document.createElement("input");
		thisElement.type="text";
		thisElement.value= "";
		thisElement.id="pair_base_input"+index;
		thisElement.setAttribute("placeholder", "0.00");
		thisElement.className = "pair_input";
		myContainer.appendChild(thisElement);


		//Create and append select list
		thisElement = document.createElement("select");
		thisElement.id ="base_list"+index;
		thisElement.className = "pair_list";

		//Create and append the options
		for (let j = 0; j < array.length; j++) {
			option = document.createElement("option");
			option.value = array[j];
			option.text = array[j];
			thisElement.appendChild(option);
		}
		myContainer.appendChild(thisElement);

		thisElement = document.createElement("input");
		thisElement.type="text";
		thisElement.value= "";
		thisElement.id="pair_targ_input"+index;
		thisElement.setAttribute("placeholder", "0.00");
		thisElement.className = "pair_input";
		myContainer.appendChild(thisElement);


		//Create and append select list
		thisElement = document.createElement("select");
		thisElement.id ="target_list"+index;
		thisElement.className = "pair_list";

		//Create and append the options
		for (let k = 0; k < array.length; k++) {
			option = document.createElement("option");
			option.value = array[k];
			option.text = array[k];
			if(k==1) {
				option.setAttribute("selected", 1)
			}
			thisElement.appendChild(option);
		}
		myContainer.appendChild(thisElement);
		thisElement = document.createElement("a");
		thisElement.className = "Disclaimer";
		thisElement.id = "Disclaimer"+index;
		t = document.createTextNode("Disclaimer");
		thisElement.appendChild(t);
		myContainer.appendChild(thisElement);
		
}

myDemo.prototype.validate =	function (s) {
	let rgx = /^[0-9]*\.?[0-9]*$/;
	return s ? s.match(rgx) : null;
}
myDemo.prototype.getRate = function(indicator) {
	let base_list = document.getElementById('base_list'+indicator);
	let target_list = document.getElementById('target_list'+indicator);
	let base=base_list.options[base_list.selectedIndex].text;
	let target = target_list.options[target_list.selectedIndex].text;
	if(base!=target) {
		  let xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			  let obj = JSON.parse(this.responseText);
				for (let key in obj) {
				  if (obj.hasOwnProperty(key) && key=='rates') {

					  alert('Demo currency exchange rate is : '+ obj[key][target]);
				  }
				}		  

			}
		  };
		  xhttp.open("GET", "http://data.fixer.io/api/latest?access_key=2b81c7684c1d1d43f49d4561e04c3a76&base="+base+"&symbols="+target, true);
		  xhttp.send();				
	}
}

myDemo.prototype.getResult = function(indicator) {
  let base_list = document.getElementById('base_list'+indicator);
  let target_list = document.getElementById('target_list'+indicator);
  let base=base_list.options[base_list.selectedIndex].text;
  let target = target_list.options[target_list.selectedIndex].text;
  if(base!=target) {
	  let xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		  let obj = JSON.parse(this.responseText);
			for (let key in obj) {
			  if (obj.hasOwnProperty(key) && key=='rates') {

				  document.getElementById("pair_targ_input"+indicator).value = (document.getElementById("pair_base_input"+indicator).value * obj[key][target]).toFixed(2);
			  }
			}		  

		}
	  };
	  xhttp.open("GET", "http://data.fixer.io/api/latest?access_key=2b81c7684c1d1d43f49d4561e04c3a76");
	  xhttp.send();		  
  }
  else {
	document.getElementById("pair_targ_input"+indicator).value = document.getElementById("pair_base_input"+indicator).value;
  }
}

myDemo.prototype.addListener = function  (){
	let required = document.querySelectorAll('*[id^="pair_base_input"]');
	required.forEach((req,i)=>{
		let input = document.getElementById("pair_base_input"+i);
		let base_list = document.getElementById("base_list"+i);
		let target_list = document.getElementById("target_list"+i);
		let Disclaimer = document.getElementById("Disclaimer"+i);
	   input.addEventListener('blur', ()=>this.getResult(i));
	   input.addEventListener('keyup', () =>{
			if (!this.validate(this.value)) {
				this.value = '';
				return false;
			}
	   });	   
	   base_list.addEventListener('change', ()=> this.getResult(i)); 
	   Disclaimer.addEventListener('click', ()=>this.getRate(i));	   
	   target_list.addEventListener('change', ()=>  this.getResult(i));    

	});

}	


myDemo.prototype.doCreate = function(){
	for(let i = 0; i < this.count; i++)
	{
		this.createWidget(this.widgets.item(i),i);
	}

}
myDemo.prototype.create = function(){
	this.widgetsRequired.addEventListener('blur', () => {
		while  (this.widgets.length >0){
			this.removeEl();
		};
		this.count = this.widgetsRequired.value;
		this.createContainer(this.count);
		this.doCreate();
		this.addListener();

	});
}
const myDemo1 = new myDemo('widget-needed','widget-container','required-widget');
myDemo1.create();


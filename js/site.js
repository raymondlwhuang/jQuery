function myDemo (widgetsRequiredID,widgetContainerId){
	this.widgetsRequired = $('#'+widgetsRequiredID);
	this.widgetContainer = $('#'+widgetContainerId);
	this.widgetsRequired.focus();
}
myDemo.prototype.createWidget = function(count){
		let elementToInsert = `
			<div class="required-widget cols-2-sm cols-3-md">
			<h2 class="mtb-10">Currency converter</h2>
			<h3 class="mb-10">Type in amount and select currency</h3>
			<input type="text" id="pair_base_input${count}" placeholder="0.00" class="pair_input">
			<select id="base_list${count}" class="pair_list">
				<option value="EUR">EUR</option><option value="USD">USD</option>
				<option value="HKD">HKD</option>
			</select>
			<input type="text" id="pair_targ_input${count}" placeholder="0.00" class="pair_input">
			<select id="target_list${count}" class="pair_list">
				<option value="EUR">EUR</option>
				<option value="USD" selected="1">USD</option>
				<option value="HKD">HKD</option>
			</select>
			<a class="Disclaimer" id="Disclaimer${count}">Disclaimer</a>
			</div>`;
			this.widgetContainer.append(elementToInsert);
}

myDemo.prototype.validate =	function (s) {
	let rgx = /^[0-9]*\.?[0-9]*$/;
	return s ? s.match(rgx) : null;
}
myDemo.prototype.getReq = function(indicator,flag = 'rate') {
	let baseId = '#base_list'+indicator;
	let targetId = '#target_list'+indicator;
	let base=$(baseId +" option:selected" ).text();
	let target = $(targetId +" option:selected" ).text();

	if(base!=target) {
		fetch("http://data.fixer.io/api/latest?access_key=2b81c7684c1d1d43f49d4561e04c3a76&base="+base +"&symbols="+target)
		.then((response) => !response.ok ? Error(response.statusText) : response.json())
		.then(data => {
			if(flag != 'rate') {
				alert('Demo currency exchange rate is : '+ data.rates[target]);
				let convertedTotal = $("#pair_base_input"+indicator).val() * data.rates[target].toFixed(2);
				$("#pair_targ_input"+indicator).val(convertedTotal);

			}
		})
		.catch(error =>console.log(error));
	}
}

myDemo.prototype.addListener = function  (){
	let required = $('input[id^="pair_base_input"]');
	for(let i = 0; i < required.length; i++){
		let input = $("#pair_base_input"+i);
		let base_list = $("#base_list"+i);
		let target_list = $("#target_list"+i);
		let Disclaimer = $("#Disclaimer"+i);
	   input.on('blur', ()=>this.getReq(i,'result'));
	   input.on('keyup', () =>{
			if (!this.validate(this.value)) {
				this.value = '';
				return false;
			}
	   });	   
	   base_list.on('change', ()=> this.getReq(i,'result')); 
	   Disclaimer.on('click', ()=>this.getReq(i));	  
	   target_list.on('change', ()=>  this.getReq(i,'result'));    
	}
}	
myDemo.prototype.doCreate = function(count){
	this.widgetContainer.empty();
	for(let i = 0; i < count; i++)
		this.createWidget(i);
}
myDemo.prototype.create = function(){
	this.widgetsRequired.on('blur', () => {
		let count = this.widgetsRequired.val();
		this.doCreate(count);
		this.addListener();
	});
}
const myDemo1 = new myDemo('widget-needed','widget-container');
myDemo1.create();
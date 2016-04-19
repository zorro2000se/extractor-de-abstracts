function debug_alert( message ) {
    //	return alert( message );
}


function moveToPageLocation (locName){
	if (locName != null && locName != "") {
		//alert("Moving to page location: "+locName);
		window.location.hash=locName;
	}
}


function confirmLink(warning_txt, url_1, url_2) {

	if (confirm(warning_txt))
		return url_1;
	else
		return url_2;
}

function JavaScriptTest() {
   document.forms[0].JavaScript.value="Yes";
}

function noenter() {
	return !(window.event && (window.event.keyCode == 13));
}

function set_new_window_props() {
    var winprops;

    var win_w = parseInt(screen.width * .85);
    var win_h = parseInt(screen.height * .70);

    winprops = 'height='+ win_h +',width='+ win_w +',top=70,left=60,toolbar=yes,menubar=yes,'+
               'resizable=yes,scrollbars=yes,status=no';

	return winprops;
}

//Open new browser window
// NOTE: This won't work in IE if the winName has spaces in it.
function openBrWindow(theURL,winName,features) {
		if(typeof features !='object'){
			features=set_new_window_props();
		}

//		alert("calling window.open. winName: ("+ winName+")");
		newWindow = window.open(theURL,winName,features);
		
        if (newWindow) {
			newWindow.focus();
        }

        return false;
}

// open a new window. not using openBrWindow because of a quirk.
function open_window (name, url, props) {
  var newwindow;
  var is_safari = navigator.userAgent.indexOf('Safari')>0;

  if (is_safari) {
      newwindow = window.open("", name, props);
      if (newwindow != null) { newwindow.close(); }
  }
//  alert("calling window.open. name: ("+ name+")");
  newwindow = window.open(url, name, props);

  if (window.focus) { newwindow.focus(); }

  return false;
}

// NOTE: This won't work in IE if the winName has spaces in it.
function open_location(theURL,winName,features) {
    if(winName.length){
    	winName=winName.replace(' ','');
    }
//    	alert("calling openBrWindow. winName: ("+ winName+")");
    return openBrWindow(theURL,winName,'');
}


function go_to_url( url ) {
    if(url.length){
    	window.location = url;
    	return true;
    } else {
    	return false;
    }
}

function open_opac(winName) {
    var theURLobject =  document.getElementById('opac');
    var theURL = theURLobject.value;
//    alert("calling openBrWindow. winName: ("+ winName+")");
    return openBrWindow(theURL,winName,'');
}

function open_ncbi(winName, theURL) {
        return openBrWindow(theURL,winName,'');
}

//for Quick Search  from home page
//If textbox has "Enter a topic search" do nothing
//If textbox is empty display "Enter a topic search"
//If textbox has a term , search it
function submit_quicksearch_go() {
   var quicksearch = document.forms[0].qs_topic.value;
   if(quicksearch.length > 0)
   {
      if(quicksearch == "Enter a topic")
      {
         return false;
      }
      else
      {
        return true;
      }
   }
   else
   {
      document.forms[0].qs_topic.value="Enter a topic";
      return false;
   }
}
// ########################################
// ------------ UPWS related  -------------
// ########################################

function winsize() {
  var h, w;
  if (document.all) {
     h = Math.round(document.body.clientHeight * (0.81));
     w = Math.round(document.body.clientWidth);
  } else {
     h = Math.round(document.height * (0.81));
     w = Math.round(document.width);
  }
  document.GeneralSearch_input_form.winh.value = h;
  document.GeneralSearch_input_form.winw.value = w;
}

//------------- summary : go to page -------------
function check_the_input(pg_num, len) {
    var flag = true;
    var val = "1234567890, ";
    for(i = 0; i < len; i++) {
        var letter = pg_num.charAt(i);
        if (val.indexOf(letter) === -1) {
        	flag = false;
        	break;
        }
    }
    return flag;
}

function process_input(pg_num, len) {
    var flag1 = 0;
    var flag2 = 0;
    var num = new String();
    for(i = 0; i < len; i++) {
        var letter = pg_num.charAt(i);
        if(letter == " ") {
            if(flag1 == 1) { flag1 = flag1 + 1; }
        }
        else if(letter == ",") {
            if(flag2 == 1) { flag2 = flag2 + 1; }
        }
        else {
            if(flag1 == 0) { flag1 = 1; }
            else if(flag1 == 2) { flag1 = 0; return false; }
            if(flag2 == 0) { flag2 = 1; }
            else if(flag2 == 3) { flag2 = 0; return false; }
            var num1 = new String(letter);
            num = num.concat(num1);
        }
    }
    return num;
}
function process_page_number(pg_num, max) {
    var len = pg_num.length;
    var error_msg = document.getElementById('pleaseEnterANumberMsg');
    if(!check_the_input(pg_num, len)) {
        alert(error_msg.value);
        return false;
    }
    pg_num = process_input(pg_num, len);
    if(pg_num <= 0) {
        alert(error_msg.value);
        return false;
    }

    return pg_num;
}

function mark_then_navigate( page_input, max ) {

  update_mark_list( 'add' );

  // could use summary_records_form.action instead of null below
  return go_to_page( page_input, max, null );
}

function go_to_page(page_input, max, paging_action, bowserBackLink, lastPage, sortAction, sortSelect, showFirstPage, pageSizeAction, pageSizSelect, noAutoSubmit) {
    var pg_num = page_input.value;
    pg_num = process_page_number(pg_num, max);
    if(pg_num > 0) {
        page_input.value = pg_num;
        //always submit the records form instead of the navigation form to save checkboxes, if needed
        var paging_url = document.forms["summary_records_form"].getAttribute("paging_url");
        if (paging_url) {
	    if ( invokeAutoSubmit() ) {
		window.location = paging_url + pg_num;
	    }
	} else {
	    handle_nav( null, pg_num, paging_action, bowserBackLink, lastPage, sortAction, sortSelect, showFirstPage, pageSizeAction, pageSizSelect, noAutoSubmit);
        }
    } else {
        page_input.select();
    }
    return false;
}



function confirm_new_session(url) {
	if (confirm('This will clear all your forms and inputs and start a new session. Click OK to continue.\n\n\nNote: To continue with your current session, click "New Search" link.')) {
	   location.href = url + "/new_session";
	}
}

function JQcheck_form_inputs (form, action) {
    if (check_form_inputs(form, action) && jQuery) {
    	disableSearchButton();
    	return true;
    }
    else {
    	return false;
    }
}

function setValSaveform (source, target, form) {
    var sourceID = "#" + source;
    var sourceVal = $(sourceID).val();
    var targetID = "#" + target;
    $(targetID).val(sourceVal);
    saveForm(form);
}

function disableSearchButton () {
    if (jQuery) {
    	$(".searchRunning").show();
    	$(".searchButton").hide();
    }
}

function AFdisableSearchButton () {
    var retValue = validateAFNames(true);
	if (jQuery && retValue) {
    	$(".searchRunning").show();
    	$(".searchButton").hide();
    }
	return retValue;
}

function checkUncheckByClass (className, status) {
    if (jQuery && className) {
    	var classVal = "." + className;
    	$(classVal).prop("checked", status);
    	if (typeof QuickOutput !== 'undefined') {
            QuickOutput.pageSelected = $(".SelectPageChk").prop('checked');
  		}
    }
}

function check_form_inputs (form, action) {
	mergeMultiSelects();
	try {
		var search_mode = document.forms[form].elements["search_mode"].value;
		var product_code = document.forms[form].elements["product"].value;
		if (action == null) {
			action = document.forms[form].elements["action"].value;
		}

		if ((search_mode == "GeneralSearch" || search_mode == "UA_GeneralSearch" ||
			search_mode == "AdvancedSearch" || search_mode == "CitedReferenceSearch") && action != "savePreferences" ) {
			var valid_inputs = false;
			var numVals = false;

			if(product_code == "INSPEC" && search_mode == "GeneralSearch") {
				numVals = parse_INSPEC_special_fields(form, action);
			}

			if(!numVals){
				valid_inputs = parse_search_inputs(form);
				//the search should work if only numbers are entered for INSPEC.
				if( !valid_inputs ){
					return false;
				}
			}
		}
		else if(search_mode == "CompoundSearch"){
			var notice = document.getElementById("input_invalid_notice");
			var invalid_input = true;
			for (i=0; i<document.forms[form].elements.length; i++) {
				var e = document.forms[form].elements[i];
				if ( (e.type == "text" || e.type == "textarea") && !(e.name == "formSimilarityMin" ||e.name == "formSimilarityMax")){
					trim_input(e);
					if(e.value.length>0){
						invalid_input = false;
						break;
					}
				}
				if (e.name == "molecule") {
					trim_input(e);
					if (e.value.length>0) {
						invalid_input = false;
						break;
					}
				}
			}
			if(invalid_input){
				if(notice != null)
					show_client_error("errorMessageDiv",notice.value);
				return false;
			}
		}
		else if(search_mode == "CitedPatentSearch" && action != "savePreferences"){
			var notice = document.getElementById("input_invalid_notice");
			var exp_notice = document.getElementById("exp_notice");
			var invalid_input = true;
			var expandFieldID = '';
			var expand = false;
			var wildcard = false;
			for (i=0; i<document.forms[form].elements.length; i++) {
				var e = document.forms[form].elements[i];
				//we don't need to trim every input, like "select".Comment out for WOKVX-20057
				//trim_input(e);	
				if($.trim(e.value) == "CX"){
					expandFieldID = "value(input" + e.id.substr(6,8) + ")";
					expand = true;
					var cx = document.getElementById(expandFieldID);
					if(cx.value.indexOf("*") >= 0 || cx.value.indexOf("?") >= 0){
						wildcard = true;
					}
				}
				if (e.type == "text" || e.type == "textarea") {
					trim_input(e);
					if(e.value.length>0){
						invalid_input = false;
					}
				}
			}
			if(wildcard && expand){
				if(exp_notice != null)
					show_client_error("errorMessageDiv",exp_notice.value);
					return false;
			}
			if(invalid_input){
				if(notice != null)
					show_client_error("errorMessageDiv",notice.value);
				return false;
			}
		} else if(search_mode == "CombineSearches"){
			// We do not need to continue if there are no sets in the search history. (Bug WOKVX-281)
			if (document.forms[form].elements["combineSets"] == null) {
				return false;
			}
		}
		document.forms[form].action.value = action;
	} catch (e) {
		return true;
	}
	if ( typeof WOKTimespan !== "undefined" ) {
	    return WOKTimespan.validateDateRange();
	}
	return true;
}

// This function is used by the radio buttons on the Advanced Search (Edit mode) to set the appropriate form variables.
function set_edit_form_inputs (formName, newAction, newReplaceSetId, newGoToPageLoc) {
	if (formName != null && newAction != null) {
		if (newAction == "reExecute" && newReplaceSetId == null) {
			newAction = "search";
		}
		if (newAction == "search" || newReplaceSetId == null) {
			newReplaceSetId = "";
		} 
		try {
			var action = document.forms[formName].elements["action"].value;
			document.forms[formName].action.value = newAction;
			var replaceSetId = document.forms[formName].elements["replaceSetId"].value;
			document.forms[formName].replaceSetId.value = newReplaceSetId;
			var goToPageLoc = document.forms[formName].elements["goToPageLoc"].value;
			document.forms[formName].goToPageLoc.value = newGoToPageLoc;
		} catch (e) {
			return true;
		}
	}
	return true;
}



//Function to parse the search inputs across general search
//Advanced search, cited reference search and all products search
//for invalid inputs(no input or just spaces)
function parse_search_inputs(form){
	var field_count_ele = document.forms[form].elements["fieldCount"];
	var i;
	var valid_inputs = false;
	var multi_select = false;
	var field_count = 0;
	//for Advanced search
	var search_mode = document.forms[form].elements["search_mode"].value;
	if(search_mode == "AdvancedSearch") {
		// For AdvancedSearch input value(input1) is the textarea. Fail the check if no user input there.
		field_count = 1;
	    }
	//For all other searches Including general_search,cited_reference_search, Collections search.
	else{
		field_count = field_count_ele.value;
	}
	try {
		//loop through rows
		for (i=1; i<=field_count; i++) {
			var fieldInput = document.getElementById('value(input' + i + ')');
			if (fieldInput !== null) {
			var fieldType = fieldInput.type;
			//TODO: not to use jquery?
			var placeholder = $(fieldInput).attr("placeholder");
		
			if(fieldType == "text" || fieldType == "textarea"  ){
				trim_input(fieldInput);
				//Checking for at least one valid input.
				if(!valid_inputs && fieldInput.value.length != 0 && fieldInput.value != placeholder)
					valid_inputs = true;
			}
			else if(fieldType == "select-multiple"){
				multi_select = true;
			}
			}
		}
	} catch (e) {
	 ;
	}
	var notice = document.getElementById("input_invalid_notice").value;
	var notice_limits = document.getElementById("input_invalid_notice_limits").value;
	var combinedNotice = notice + notice_limits;
	if(!valid_inputs && multi_select) {
	    
		show_client_error("errorMessageDiv", notice + notice_limits);
	}
	else if(!valid_inputs) {
		show_client_error("errorMessageDiv", combinedNotice);
	}
	return valid_inputs;
}

function parse_INSPEC_special_fields (form, action) {

	var field_count = document.forms[form].elements["fieldCount"].value;
	var tbl = document.getElementById('search_table');
	var i;
	var numVals=false;

	//loop through rows
	for (i=1; i<=field_count; i++) {
		var trow = document.getElementById('searchrow' + i);

		var values = "";
		var fieldSelect = document.getElementById('select' + i);
		var idx = fieldSelect.selectedIndex;
  		var id = fieldSelect.options[idx].id;
  		var val_selected = fieldSelect.value;

		//handle special parsing for numqty and chemical searches
		if(id.match("double_inputs")) {
			values = parse_INSPEC_numqty_double_inputs(form, i);
		} else if (val_selected.match("CH")) {
			parse_INSPEC_chemical_input(form, i, id);
		}

		//for numqty, get the generic hidden, value(inputX),
		//clone it, change the id and name to match the row number
		//paste the new appended value inside and append the new input clone to that row

		if(values != "" && values != " ") {
			var inputX = document.getElementById('value(inputX)');
			var inputX_clone = inputX.cloneNode(true);
			inputX_clone.id = ('value(input' + i + ')');
			inputX_clone.name = ('value(input' + i + ')');
			inputX_clone.value = values;
			trow.appendChild(inputX_clone);
			numVals = true;
		}
	}
	return numVals;
}

function parse_INSPEC_numqty_double_inputs (form, rowIndex) {

	//Find the two inputs, if they have values, paste them together with a space between.
	// If only mininum value exist, put "GTE " bofore the value.
	// If only maximum value exist, put "LTE " bofore the value.
	var values = "";
	var minValue = "";
	var maxValue = "";
	var haveMinValue=false;
	var haveMaxValue=false;

	var numqty_el_1 = document.getElementById('value(double_input_1_row' + rowIndex + ')');
	trim_input(numqty_el_1);
	if(numqty_el_1 != null && numqty_el_1.value != "") {
		minValue = numqty_el_1.value;
		haveMinValue=true;
	}

	var numqty_el_2 = document.getElementById('value(double_input_2_row' + rowIndex + ')');
	trim_input(numqty_el_2);
	if(numqty_el_2 != null && numqty_el_2.value != "") {
		maxValue = numqty_el_2.value;
		haveMaxValue=true;
	}

	if ( haveMinValue==true && haveMaxValue==true) {
		values = minValue + " " + maxValue;
	}
	else if (haveMinValue==true){
		    values = "GTE " + minValue;
	}
	else if (haveMaxValue==true) {
		    values = "LTE " + maxValue;
	}

	return values;

}//end function parse_INSPEC_numqty_double_inputs

function change_select(select, selectValue )
{
//debug_alert("fn change_select is called. selectValue= "+ selectValue);
//debug_alert("get selection: "+select.length);
	var match=0;

	if (select != null) {
		for (i=0; i<select.length; i++) {
			if (select.options[i].value==selectValue) {
				select.options[i].selected = true;
				match=1;
				break;
			}
		}
	}
//debug_alert("match value is "+ match);
	return match;
}

function parse_INSPEC_chemical_input (form, rowIndex, id) {
	var values = "";

	//Get the user input and the role (from the select option id).
	//Put these two together with a backslash between into the input value.
	var chem_input = document.getElementById('value(input' + rowIndex + ')');
	if(chem_input.value != "") {
		var chem_role_array = new Array();
    	chem_role_array = id.split("_");
    	var selected_chem_role = chem_role_array[0];
    	if(selected_chem_role == "all") { return; }

    	if(!chem_input.value.match("/")){
    		 chem_input.value = chem_input.value + "/" + selected_chem_role;
    	}
    }
    return true;

}//end function parse_INSPEC_chemical_input

// ------ on Search Input page: -----
// -- automatically control selection of the radio buttons for year/week select boxes --

function select_week_button(idx) {
  if (! idx.length) idx = 0;

  document.GeneralSearch_input_form.period[idx].checked = true;
  return true;
}

function select_year_range_button(idx) {
  if (! idx.length) idx = 1;

  document.GeneralSearch_input_form.period[idx].checked = true;
  return true;
}

var CitedReferenceSearch = {

  popup_error_message: function () {
    if ( $('#searchErrorMessage #client_error_input_message').text() == getMessageById('citedReferenceSearchTooManySelections') ) {
      $('#searchErrorMessage').fadeOut();
      this.display_too_many_selections_message();
      return false;
    }
  },

  clear_all: function () {
    this.selectedCitedRecsSize = 0;
    if($('#selectedIdsFastLane_bottom').length!=0){
        $('#selectedIdsFastLane_bottom').text("");
    }
    if($('input[id="selected_cited_recs.bottom"]').length!=0){
        $('input[id="selected_cited_recs.bottom"]').attr("value", 0);
    }
  },

  display_too_many_selections_message: function () {
    alert(getMessageById('citedReferenceSearchTooManySelections'));
  },

  finish_search: function (opts) {
	var checked = opts.checked;
    if ( null == checked ) {
      checked = true;
    }
    // 1-or-more-pages-beyond limit check (501st record check)
    var pageNumber = opts.pageNumber;
    if ( isNaN(pageNumber) || "NaN" == pageNumber ) {
      pageNumber = 1;
    }
    var pageSize = opts.pageSize;
    if ( isNaN(pageSize) || "NaN" == pageSize ) {
      pageSize = 50; // There should be a better fallback than this....
    }
    var firstRecordOfPage = ( pageNumber - 1 ) * pageSize + 1;
    var checkedCheckboxes = checked
      ? $("input:checked[name='" + opts.id + "']")
      : $("input[name='"         + opts.id + "']").not(":checked");
    
    if ( null == this.selectedCitedRecsSize ) {
      this.selectedCitedRecsSize = 0;
    }
    var CurrentPageSelection = checkedCheckboxes.length > 0? checkedCheckboxes.length : 0;

    var currentPageAlreadySelected = 0;
    var hiddenCount = document.getElementById( opts.currentPageAlreadySelected );
	if(hiddenCount != null){
		trim_input(hiddenCount);
		currentPageAlreadySelected = hiddenCount.value;
	}
	if (currentPageAlreadySelected == null) {
		currentPageAlreadySelected = 0;
	}
	
    if (this.selectedCitedRecsSize - currentPageAlreadySelected + CurrentPageSelection > opts.maxSelectedCitedRecs) {
      //alert("this.selectedCitedRecsSize=" + this.selectedCitedRecsSize + " firstRecordOfPage=" + firstRecordOfPage + " opts.maxSelectedCitedRecs=" + opts.maxSelectedCitedRecs + " checkedCheckboxes.length=" + checkedCheckboxes.length);
      this.display_too_many_selections_message();
      return false;
    }

	if ( ! this.too_many_selections(opts) ) {
      if ( invokeAutoSubmit() )
    	var retValue = submit_summary_form(opts.formAction, opts.id, opts.searchMode);
    	if (retValue == true) {
    		disableSearchButton();
    	}      
	    return retValue; 
    }
    return false;
  },
  
  check_mark_then_navigate: function (opts) {
		var checked = opts.checked;
	    if ( null == checked ) {
	      checked = true;
	    }
	    // 1-or-more-pages-beyond limit check (501st record check)
	    var pageNumber = opts.pageNumber;
	    if ( isNaN(pageNumber) || "NaN" == pageNumber ) {
	      pageNumber = 1;
	    }
	    var checkedCheckboxes = checked
	      ? $("input:checked[name='" + opts.id + "']")
	      : $("input[name='"         + opts.id + "']").not(":checked");
	    
	    if ( null == this.selectedCitedRecsSize ) {
	      this.selectedCitedRecsSize = 0;
	    }
	    var CurrentPageSelection = checkedCheckboxes.length > 0? checkedCheckboxes.length : 0;

	    var currentPageAlreadySelected = 0;
	    var hiddenCount = document.getElementById( opts.currentPageAlreadySelected );
		if(hiddenCount != null){
			trim_input(hiddenCount);
			currentPageAlreadySelected = hiddenCount.value;
		}
		if (currentPageAlreadySelected == null) {
			currentPageAlreadySelected = 0;
		}
		
	    if (this.selectedCitedRecsSize - currentPageAlreadySelected + CurrentPageSelection > opts.maxSelectedCitedRecs) {
	      //alert("this.selectedCitedRecsSize=" + this.selectedCitedRecsSize + " opts.maxSelectedCitedRecs=" + opts.maxSelectedCitedRecs + " currentPageAlreadySelected=" + currentPageAlreadySelected + " checkedCheckboxes.length=" + checkedCheckboxes.length);
	      this.display_too_many_selections_message();
	      return false;
	    }
	    else {
	    	this.selectedCitedRecsSize = this.selectedCitedRecsSize - currentPageAlreadySelected + CurrentPageSelection;
	    }

		if ( ! this.too_many_selections(opts) ) {
			mark_then_navigate(opts.pageNumber, opts.total_pages_num); 
	    }
	    return false;
  },

  select_all: function (opts) {
    var checked = opts.checked;
    if ( null == checked ) {
      checked = true;
    }
    // 1-or-more-pages-beyond limit check (501st record check)
    var pageNumber = opts.pageNumber;
    if ( isNaN(pageNumber) || "NaN" == pageNumber ) {
      pageNumber = 1;
    }
    var pageSize = opts.pageSize;
    if ( isNaN(pageSize) || "NaN" == pageSize ) {
      pageSize = 50; // There should be a better fallback than this....
    }
    var firstRecordOfPage = ( pageNumber - 1 ) * pageSize + 1;
    var checkedCheckboxes = checked
      ? $("input:checked[name='" + opts.id + "']")
      : $("input[name='"         + opts.id + "']").not(":checked");
    if ( firstRecordOfPage > opts.maxSelectedCitedRecs && checkedCheckboxes.length > 0 ) {
      this.display_too_many_selections_message();
      return false;
    }
	// General limit check
    var remainder = opts.maxSelectedCitedRecs - this.selectedCitedRecsSize;
    if ( isNaN(remainder) || "NaN" == remainder ) {
      remainder = opts.maxSelectedCitedRecs;
    }
    if ( remainder <= 0 ) {
      if ( remainder < 0 ) {
    	this.display_too_many_selections_message();
      }
      return false; // max number of records already legitimately selected
    }
    var pagingAction = opts.pagingActionPrefix + opts.maxSelectedCitedRecs; // this value is ignored by the FW
    handle_nav_no_auto_submit(opts.summaryNavForm, opts.pageNumber, pagingAction);
  },

  select_page: function (opts) {
    var checked = opts.checked;
    if ( null == checked ) {
      checked = true;
    }
    var uncheckedCheckboxes = checked
      ? $("input[name='"         + opts.id + "']").not(":checked")
      : $("input:checked[name='" + opts.id + "']");
    var uncheckedLength = uncheckedCheckboxes.length;
    var checkOrUncheck  = checked ? 1 : -1;
    var selectionLength = uncheckedLength * checkOrUncheck + this.selectedCitedRecsSize;
    if ( this.too_many_selections(opts, selectionLength) ) {
      return false;
    }
    for ( var i in uncheckedCheckboxes ) {
      if ( null != uncheckedCheckboxes[i] && null != uncheckedCheckboxes[i].id ) {
        uncheckedCheckboxes[i].checked = checked;
        this.update_selected_cited_recs_size(checked);
        $(uncheckedCheckboxes[i]).trigger("change");
        
      }
    }
    
    // Already added to total. So update currentPageAlreadySelected
    var currentPageAlreadySelected = 0;
    var hiddenCount = document.getElementById( "currentPageAlreadySelected" );
	if(hiddenCount != null){
		trim_input(hiddenCount);
		currentPageAlreadySelected = hiddenCount.value;
		hiddenCount.value = currentPageAlreadySelected + selectionLength;
	}
	
    return false;
  },

  too_many_selections: function (opts, selectionLength) {
    if ( null == selectionLength ) {
      selectionLength = this.selectedCitedRecsSize;
    }
    if ( selectionLength > opts.maxSelectedCitedRecs ) {
      this.display_too_many_selections_message();
      return true;
    }
    return false;
  },

  update_selected_cited_recs_size: function (checked) {
    if ( null == this.selectedCitedRecsSize ) {
      this.selectedCitedRecsSize = 0;
    }
    this.selectedCitedRecsSize   += checked ? 1 : -1;
  }

}

function do_all_named_checkboxes( form, id, checked ) {

  var found = false;

  if ( form ) {

    var value = checked
//debug_alert('value is '+(value == false ? 'false' : 'true'));
    var i;

    for (i=0; i<form.elements.length; i++) {
      var e = form.elements[i];
      if (e.tagName == "INPUT" && e.type == "checkbox" &&
	  e.name == id) {
			e.checked = value;
			found = true;
      }
    }
    if(!checked){
    	var selectedRecsObj=form.selectedRecs;
    	//don't assume that "selectedRecs" is there for all pages
    	if(selectedRecsObj !=null){
    		form.selectedRecs.value=0;
    	}
    }
  }

  return found;
}

function select_named_checkboxes( list ) {

  var found = false;

  if ( typeof( list ) == 'object' ) {

    for (i=0; i<list.length; i++) {
      var e = document.getElementById( list[i] );
      if (e && e.tagName == "INPUT" && e.type == "checkbox") {

	e.checked = true;
      }
    }
  }

  return found;
}

function confirm_message(id){
	var errorMessage = getMessageById(id);
	return confirm(errorMessage);
}

function check_summary_records_form_inputs(id) {
	var f = document.summary_records_form;

	var i;
	var hasInput = false;

	for (i=0; i<f.elements.length; i++) {
		var e = f.elements[i];
		if (e.tagName == "INPUT" && e.type == "checkbox" &&
			e.name == id && e.checked)
		{
			hasInput = true;
			break;
		}
	}

	if(!hasInput){
		try{
			var selRecs = f.selectedRecs.value;
			if(selRecs>0){
				hasInput=true;
			}
		}catch(e){
			;
		}
	}

	if (!hasInput) {
		var errorMessage = getMessageById('quickOutputSelectAtLeastOneCheckbox');
		alert(errorMessage);
	}
	return hasInput;
}

function do_refine(form_name, more_form_name, refSwitch, button_name) {
	if(form_name == null){
		return false;
	}
	
	if(form_name != null && more_form_name != null && document.forms[more_form_name] != null){
		if (check_refine_inputs(form_name, more_form_name) == false) {
			return false;
		}
	}
	else {
		if (check_refine_inputs(form_name, null) == false) {
			return false;
		}
	}

	try
	{
		var f = document.forms[form_name];
		var pageElement = document.createElement("input");
		pageElement.setAttribute("type", "hidden");
		pageElement.setAttribute("name", "mode");
		pageElement.setAttribute("value", "refine");
		document.getElementById(form_name).appendChild(pageElement);
		var excludeElement=document.forms[form_name].elements["exclude"];
		if(excludeElement != null) {
			if (refSwitch == 'exclude') {
				excludeElement.value = "exclude";
			} else {
				excludeElement.value = "";
			}
		}
		disableRefineButton();
		f.submit();
		return true;		
	}
	catch (error)
	{
		return false;
	}

}

function set_refine_or_exclude (form_name, refSwitch) {
	if(form_name == null){
		return false;
	}

	try
	{
		var f = document.forms[form_name];		
		
		// Make sure only one mode
		if (document.forms[form_name].elements["mode"]==null) {			
			var pageElement = document.createElement("input");
			pageElement.setAttribute("type", "hidden");
		    pageElement.setAttribute("name", "mode");
		    pageElement.setAttribute("value", "refine");
		    document.getElementById(form_name).appendChild(pageElement);
		}
		var excludeElement=document.forms[form_name].elements["exclude"];
		if(excludeElement != null) {
			if (refSwitch == 'exclude') {
				excludeElement.value = "exclude";
			} else {
				excludeElement.value = "";
			}
		}
		return true;		
	}
	catch (error)
	{
		return false;
	}

}

function check_refine_inputs(form1, form2) {
//debug_alert("call check_refine_inputs");
    //if the browser is not support place holder, we need to remove placeholder text before we submit
    if (!$.fn.placeholder.input) {
    	var f1,f2;
    	if(form1){
 	        f1 = document.forms[form1]; 
 	       
			var $inputs = $('.placeholder', f1).each(function(){
				this.value = '';
				$(this).removeClass('placeholder');
			});

    	}
    	if(form2){
 	        f2 = document.forms[form2]; 
			var $inputs = $('.placeholder', f1).each(function(){
				this.value = '';
				$(this).removeClass('placeholder');
			});
    	}
 	} 
	var hasInput = check_refine_form(form1);
	if( !hasInput){
		hasInput = check_refine_form(form2);
	}

	if (!hasInput) {
		var errorMessage = document.getElementById('refineSelectAtLeastOneCheckbox').value;
		alert(errorMessage);
	}else{
		merge_input_forms(form1,form2);
	        if ( ! invokeAutoSubmit() )
			hasInput = false;
	}

	return hasInput;
}

function check_refine_form(form_name) {
	if(form_name == null){
		return false;
	}

	var i;

	var swsElement=document.getElementById('sws');
	if(swsElement !=null){
		trim_input(swsElement);
		var swsVal=swsElement.value;
		var placeHolder = swsElement.getAttribute('placeholder');
		//IE sends the placeholder as a value; so we also check for that here
		if(swsVal.length >0 && swsVal != placeHolder){
			return true;
		}
	}

	var refineSelectionElements=document.getElementsByName('refineSelection');
	if(refineSelectionElements !=null){
		for (i=0; i< refineSelectionElements.length; i++){
			var refineSelectionElement=refineSelectionElements[i];
			if(refineSelectionElement.checked){
				return true;

				break;
			}
		}
	}

	return false;
}

function merge_input_forms(form1, form2) {
//debug_alert("We are going to merge forms "+form1+" and "+form2);
	if(form1 == null){
		return;
	}

	if(form2 == null){
		return;
	}

	var f1 = document.forms[form1];
	if(f1 == null){
//debug_alert (form1 +" is null");
		return;
	}

	var f2 = document.forms[form2];
	if(f2 == null){
//debug_alert (form2 +" is null");

		return;
	}

	var f2ElementsNum=f2.elements.length;

	var i;

	var wrappingDiv=document.createElement("wrappingDiv");
	wrappingDiv.style.visibility="hidden";
	f1.appendChild(wrappingDiv);

	for (i=0; i<f2ElementsNum; i++) {
		var e =f2.elements[i];

		var tagName=e.tagName;
		var type=e.type;
		var name=e.name;
		var value=e.value;

		var newE=e.cloneNode(true);
		wrappingDiv.appendChild(newE);

		if(type == "checkbox"){
			var checked=e.checked;

			var total=f1.elements.length;
			f1.elements[total-1].checked=e.checked;
		}

		var brE=document.createElement("br");
		wrappingDiv.appendChild(brE);
	}
}

function disableRefineButton () {
    if (jQuery) {
    	$(".button3Running").show();
    	$(".button3").hide();
    }
}

function click_ra_more(){
  autoSubmitMarkedList();
  var clickRaMoreMsg = document.getElementById('clickRaMore').value;

  var hasInput=check_refine_form("refine_form");
  if(! hasInput){
	  hasInput=check_refine_form("refine_more_form");
  }

  if(hasInput){
	  return confirm(clickRaMoreMsg);
  }

  return true;
}

function addTextWithExtras(text_field_default_extras, iteration)
{
	try {

  		//add "extras" (so far only MEDLINE does this and it is for a radio group)
  		var extras = document.getElementById(text_field_default_extras);
  		var extrasclone = extras.cloneNode(true);
  		extrasclone.id = 'RadsNChecksContainer' + iteration;
  		return extrasclone;

	} catch (e) {
  	;
 	}
	return null;
}

function criteria_last_child() {
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {
		$('.criteria-last-child').removeClass('criteria-last-child');
        $('.search-criteria-item:last-child').addClass('criteria-last-child');
    }
};

function markFormUpdated (formId) {
	if (formId == null) {
		return false;
	}
	document.getElementById("formUpdated").value = 'true';
	return false;
}


function promptFormReset (formId) {
	if (formId == null) {
		return false;
	}
	var formUpdated = document.getElementById("formUpdated").value;
	//alert("formUpdated: "+formUpdated);
	if (formUpdated === 'true') {
	    var confirmMessage = document.getElementById("fieldChangeMessage").value
		if (confirm(confirmMessage)) {
			setTimeout(function() { $("a#resetForm")[0].click(); }, 750); 
		}
		
	} else {
		setTimeout(function() { $("a#resetForm")[0].click(); }, 750); 
		
	}
	return false;
}


function addSearchRow(imgpath, text_field_default_extras, defaultNewField, booleansEnabled)
{
 try {
  var fcount = document.getElementById('fieldCount');
  var maxcount = document.getElementById('max_field_count');
  var notice = document.getElementById('max_field_notice').value;

  //limit the number of rows added
  if((parseInt(fcount.value) + 1) > (parseInt(maxcount.value))){
     alert(notice);
  	return false;
  }

  var tbl = document.getElementById('search_table');
  var lastRow = tbl.rows.length;
  var iteration = lastRow+1;

  var row = tbl.insertRow(iteration-1);
  row.id = 'searchrow' + iteration;
  row.className = "search-criteria-item";

  //add the boolean operator
  var cell0 = row.insertCell(0);
  cell0.className = "search-criteria-cell0 ";
  if (booleansEnabled !== 'true') {
	  cell0.className = "search-criteria-cell0 nodisplay";
  }
  var bool = document.getElementById('bool_default');
  var boolclone = bool.cloneNode(true);
  var boolid = 'value(bool_' + (iteration-1) + '_' + (iteration) + ')';
  boolclone.name= boolid;
  boolclone.id= boolid;
  boolclone.value ="AND";
  boolclone.className = "j-custom-select select-criteria2";
  cell0.appendChild(boolclone);

  
  //get the appropriate placeholder and field text
  var newPlaceholder = document.getElementById(defaultNewField+'_placeholder');
  var fieldText = document.getElementById(defaultNewField+'_fieldText');
  var defaultAddSearchRow = document.getElementById('addSearchRow_default');
  
  //add the text input
  var cell1 = row.insertCell(1);
  cell1.vAlign = "top";
  cell1.className = "search-criteria-cell1"
  var elcontainer = document.createElement('div');
  elcontainer.id = 'container(input' + iteration + ')';
  elcontainer.className = 'search-criteria-input-wr';
  
  var el = document.getElementById('text_field_default');
  var elclone = el.cloneNode(true);
  elclone.name = 'value(input' + iteration + ')';
  elclone.id = 'value(input' + iteration + ')';
  elclone.value = '';
  elclone.placeholder = newPlaceholder.innerHTML;
  
  var eli = document.getElementById('text_field_default_i');
  var eliclone = eli.cloneNode(true);
  eliclone.id = 'clearIcon' + iteration;
  
  elcontainer.appendChild(elclone);
  elcontainer.appendChild(eliclone);
  
  /* if the browser didn't support placeholder function,we are using our handling*/ 
  if (!$.fn.placeholder.input) { 
	  $(elclone).attr("placeholder", newPlaceholder.innerHTML);
	  $(elclone).placeholderDirectly();
  } 

  //so far, this is used for MEDLINE radio and checkbox groups, but could be used for other elements
  //in this location.
  if(text_field_default_extras != null && text_field_default_extras.length > 0) {
  	var extra_text_element = addTextWithExtras(text_field_default_extras, iteration);
  }

  

  cell1.appendChild(elcontainer);
  if(extra_text_element != null) {
  	cell1.appendChild(extra_text_element);
  }
  
  if (fieldText != null) {
	var fieldTextclone = fieldText.cloneNode(true);
	fieldTextclone.id = "fieldText" + iteration;
	cell1.appendChild(fieldTextclone);
  }
  
  if (defaultAddSearchRow != null) {
	var addSearchRowclone = defaultAddSearchRow.cloneNode(true);
	addSearchRowclone.id = "addSearchRow" + iteration;
	cell1.appendChild(addSearchRowclone);
  }

 
  var cell2 = row.insertCell(2);
  cell2.className = "search-criteria-cell2"

  //add the field select dropdown
  var foo = document.getElementById('field_select_default');
  var selectid = 'select' + iteration;
  var cloneselect = foo.cloneNode(true);
  cloneselect.id = selectid;
  cloneselect.name = 'value('+ selectid +')';
  cloneselect.className = "j-custom-select select-criteria2";
  cell2.appendChild(cloneselect);
	
  //get the appropriate searchAid text for this field
  var searchAidTextDefaultId = defaultNewField+'_searchAidText';
  var searchAidTextNewId = 'searchAidText'+iteration;
  var searchAidText = document.getElementById(searchAidTextDefaultId);
  
  
  if (searchAidText != null) {
		var searchAidTextclone = searchAidText.cloneNode(true);
		searchAidTextclone.id = searchAidTextNewId;
		cell2.appendChild(searchAidTextclone);
  }


  // Safari 1.3 and 2.x set the name wrong after it is appended to cell2
  var foo2 = document.getElementById(selectid);
  foo2.name = 'value('+ selectid +')';

  // alert('cloned select: '+cloneselect.name+';'+cloneselect.id+';'+cloneselect.innerHTML);
  
  
  var cell3 = row.insertCell(3)
  cell3.className = "search-criteria-cell3"
  var searchCell = document.getElementById('searchCell1');
  var searchCellclone = searchCell.cloneNode(true);
  searchCellclone.id = "searchCell"+iteration;
  cell3.appendChild(searchCellclone);
  

  var cell4 = row.insertCell(4);
  var sahid1 = document.getElementById('value(hidInput1)');
  var clonehid0, clonehid1;
  clonehid1 = sahid1.cloneNode(true);
  clonehid1.name = 'value(hidInput' + iteration + ')';
  clonehid1.id = 'value(hidInput' + iteration + ')';

  cell4.appendChild(clonehid1);
  
  //row.find("select").addClass('j-custom-select').select2({dropdownAutoWidth: true});

  if (booleansEnabled === 'true') {
	  $("[id='"+boolid+"']").select2({dropdownAutoWidth: true, minimumResultsForSearch: -1});
  }
  $("[id='"+selectid+"']").select2({dropdownAutoWidth: true, minimumResultsForSearch: -1});
  
  $("[id='clearIcon"+iteration+"']").click (function(){
	if($(this))
	var inputElement = document.getElementById("value(input" + iteration + ")");
	inputElement.value= '';
	$(this).parent().find("input[type='text'][title]").attr("value", $(this).parent().find("input[type='text'][title]").attr("title"));
	});
  
  var searchAidTextUrl = $("[id='"+searchAidTextNewId+"']").find("a").attr("href");
  if (searchAidTextUrl != null) {
	  searchAidTextUrl = searchAidTextUrl.replace(/SA_INPUT_NUM/, iteration);
	  $("[id='"+searchAidTextNewId+"']").find("a").attr("href", searchAidTextUrl);
  }
  
  fcount.value = parseInt(fcount.value) + 1;

 } catch (e) {
  ;
 }
 return null;
}

function searchFieldChanged(fieldselect,imgpath,config)
{
  try {
  	var fieldnum = (fieldselect.id).substring(6);
  	var input_element = document.getElementById("value(input" + fieldnum + ")");

  	//handle search limits
  	var idx = fieldselect.selectedIndex;
  	var id = fieldselect.options[idx].id;
	var val = fieldselect.value;
	var switch_element_id = "";

	if(id == val + "_" + "search_limit") {
		switch_element_id = val + "Drop";
		swapSearchElements(fieldnum, val, switch_element_id, null);
	} else if (id.match("double_inputs")) {
		switch_element_id = "double_input";
		swapSearchElements(fieldnum, val, switch_element_id, null);
	} else if (id.match("radio_group")) {
		//special additions for MEDLINE. Other prods may have something similar in the future.
		switch_element_id = val + "Radios";
		swapSearchElements(fieldnum, val, switch_element_id, null);
	} else if (id.match("checkbox_group")) {
		//special additions for MEDLINE. Other prods may have something similar in the future.
		switch_element_id = val + "Checks";
		swapSearchElements(fieldnum, val, switch_element_id, null);
	} else {
		if(input_element != null) {

			if ( (input_element.type == "select-multiple") || (input_element.type == "select-one")) {
				switch_element_id = "text_field_default";
				swapSearchElements(fieldnum, val, switch_element_id, null);
			} else {
				var newPlaceholder = document.getElementById(val+'_placeholder');
				input_element.placeholder = newPlaceholder.innerHTML;
				/* if the browser didn't support placeholder function,we are using our handling*/
				if (!$.fn.placeholder.input) {					
				 	if(isQualified4AddPlaceHolder(input_element)){
					    clearPlaceholderDirectly(input_element);
				        $(input_element).attr("placeholder", newPlaceholder.innerHTML);
				        $(input_element).trigger('blur.placeholder');
				 	}
				}
			}
		} else {
				switch_element_id = "text_field_default";
				swapSearchElements(fieldnum, val, switch_element_id, null);
		}
	}

	//special checks and radios for MEDLINE. Other products may use them later.
	//Always clear out the container for these if we are switching to a search field or a limit or
	//anything other than a check or radio group.
	if( (!switch_element_id.match("Checks")) && (!switch_element_id.match("Radios")) ) {
		var special_group_container = document.getElementById("RadsNChecksContainer" + fieldnum);
		if(special_group_container != null) {
			special_group_container.innerHTML = "";
		}
	}


    swapFieldText(val, fieldnum);
    swapSearchAidText(val, fieldnum);

	defineHiddenInput(fieldnum,imgpath, config);


	
  } catch (e) {
   ;
  }
}

function swapFieldText(field_name, fieldnum)
{
	var newFieldText = document.getElementById(field_name + "_fieldText");
	var oldFieldText = document.getElementById("fieldText" + fieldnum);
	oldFieldText.innerHTML = newFieldText.innerHTML;
}

function swapSearchAidText(field_name, fieldnum)
{
	var searchAidTextId = "searchAidText" + fieldnum;
	var newSearchAidText = document.getElementById(field_name + "_searchAidText");
	var oldSearchAidText = document.getElementById(searchAidTextId);
	oldSearchAidText.innerHTML = newSearchAidText.innerHTML;
	
	var searchAidTextUrl = $("[id='"+searchAidTextId+"']").find("a").attr("href");
	if (searchAidTextUrl != null) {
		searchAidTextUrl = searchAidTextUrl.replace(/SA_INPUT_NUM/, fieldnum);
		$("[id='"+searchAidTextId+"']").find("a").attr("href", searchAidTextUrl);
	}
}

function swapSearchElements(rownum, val, switch_element_id, selected)
{
	if(switch_element_id.match("double_input")) {
		//special handling here
		swapWithDoubleInputs(rownum, switch_element_id, "", "", val);
		return false;
	}

	if( (switch_element_id.match("Radios")) || (switch_element_id.match("Checks")) ) {
		//special handling here
		addRadsNChecksGroup(rownum, switch_element_id, "", "");
		//after adding the radio or check element, we must also swap the input container
		switch_element_id = "text_field_default";
	}
	
	

	var sf_drop_hidden = document.getElementById(switch_element_id);
	var sf_drop_clone = sf_drop_hidden.cloneNode(true);
	sf_drop_clone.name = "value(input" + rownum + ")";
	sf_drop_clone.id = "value(input" + rownum + ")";
	//alert("sf drop clone id: " + sf_drop_clone.id);

	// Get IE to select the first value in a limits select box
	if((selected == null) && (switch_element_id.match(val + "Drop"))) {
		sf_drop_clone.selectedIndex = 0;
	// If we have a selected value (or a comma separated list), reselect it/them
	} else if (selected != null) {
		selectMultiSelects(sf_drop_clone, selected);
	}

	var input_container = document.getElementById("container(input" + rownum + ")");
	input_container.innerHTML = "";
	if (switch_element_id === 'text_field_default') {
		input_container.className = "search-criteria-input-wr";
		var newPlaceHolder = document.getElementById(val+'_placeholder');
		sf_drop_clone.placeholder = newPlaceHolder.innerHTML;
	} else {
		input_container.className = "";
	}
	
	input_container.appendChild(sf_drop_clone);
	
	/*start : Added for the defect WOKVX-22168 */
	var optionsCount = $( "#searchrow"+rownum+" select" ).attr("size");

	if (optionsCount < 5)
	{
		$( "#searchrow"+rownum+" select" ).height(26 + (optionsCount - 1) * 20);
	}
	/*end : Added for the defect WOKVX-22168 */

	if (switch_element_id === 'text_field_default') {
		/* if the browser didn't support placeholder function,we are using our handling*/	
		if (!$.fn.placeholder.input) {
		    $(sf_drop_clone).attr("placeholder", $('#'+val+'_placeholder').html());
     		$(sf_drop_clone).placeholderDirectly();
		}
	} 
	if (switch_element_id === "text_field_default") {
		
		var eli = document.getElementById('text_field_default_i');
		var eliclone = eli.cloneNode(true);
		eliclone.id = 'clearIcon' + rownum;
		input_container.appendChild(eliclone);
		
		$("[id='clearIcon"+rownum+"']").click (function(){
			if($(this))
			$(this).parent().find("input[type='text']").attr("value", "");
			$(this).parent().find("input[type='text'][title]").attr("value", $(this).parent().find("input[type='text'][title]").attr("title"));
		});
	}

	return true;
}

function swapWithDoubleInputs(rownum, switch_element_id, input1, input2, val)
{
	var sf_doubles_hidden_1 = document.getElementById(switch_element_id + "_1");
	var sf_doubles_clone_1 = sf_doubles_hidden_1.cloneNode(true);
	sf_doubles_clone_1.name = "value(" + switch_element_id + "_1_row" + rownum + ")";
	sf_doubles_clone_1.id = "value(" + switch_element_id + "_1_row" + rownum + ")";
	sf_doubles_clone_1.className = "search-criteria-input";
  	sf_doubles_clone_1.value=input1;
	
	var eli = document.getElementById('text_field_default_i');
	var sf_doubles_clear_clone_1 = eli.cloneNode(true);
	sf_doubles_clear_clone_1.id = 'double1clearIcon' + rownum;
	var sf_doubles_clear_clone_2 = eli.cloneNode(true);
	sf_doubles_clear_clone_2.id = 'double2clearIcon' + rownum;
	

  	var toText = document.getElementById('to_el');
  	var to_el_clone = toText.cloneNode(true);
  	to_el_clone.id = 'to_el' + rownum;

	var sf_doubles_hidden_2 = document.getElementById(switch_element_id + "_2");
	var sf_doubles_clone_2 = sf_doubles_hidden_2.cloneNode(true);
	sf_doubles_clone_2.name = "value(" +  switch_element_id + "_2_row" + rownum + ")";
	sf_doubles_clone_2.id = "value(" + switch_element_id + "_2_row" + rownum + ")";
	sf_doubles_clone_2.className = "search-criteria-input";
	sf_doubles_clone_2.value=input2;
	
	// Get placeholders for this field type.
	var newPlaceholder = document.getElementById(val+'_placeholder');
	if (newPlaceholder != null) {
		sf_doubles_clone_1.placeholder = newPlaceholder.innerHTML;
		if (!$.fn.placeholder.input) { 
			  $(sf_doubles_clone_1).attr("placeholder", newPlaceholder.innerHTML);
		} 
	}
	newPlaceholder = document.getElementById(val+'_placeholder2');
	if (newPlaceholder != null) {
		sf_doubles_clone_2.placeholder = newPlaceholder.innerHTML;
		if (!$.fn.placeholder.input) { 
			  $(sf_doubles_clone_2).attr("placeholder", newPlaceholder.innerHTML);
		} 		
	}

	var input_container = document.getElementById("container(input" + rownum + ")");
	input_container.innerHTML = "";
	input_container.className = "";
	
	// Put each numeric field in its own container so classes and clear icons can be applied.
	var input1_container = input_container.cloneNode(true);
	input1_container.id = val + "_container1_row" + rownum;
	if (rownum == 1) {
		input1_container.className = "search-criteria-input-wr search-criteria-input-double-1 first-row";
	} else {
		input1_container.className = "search-criteria-input-wr search-criteria-input-double-1";
	}
	
	input1_container.appendChild(sf_doubles_clone_1);
	input1_container.appendChild(sf_doubles_clear_clone_1);
	
	var input2_container = input_container.cloneNode(true);
	input2_container.id = val + "_container2_row" + rownum;
	if (rownum == 1) {
		input2_container.className = "search-criteria-input-wr search-criteria-input-double-2 first-row";
	} else {
		input2_container.className = "search-criteria-input-wr search-criteria-input-double-2";
	}
	input2_container.appendChild(sf_doubles_clone_2);
	input2_container.appendChild(sf_doubles_clear_clone_2);
	
	if (!$.fn.placeholder.input) { 
		  $(sf_doubles_clone_1).placeholderDirectly();
		  $(sf_doubles_clone_2).placeholderDirectly();  		  
	}
	// Combine evrything into main input container.
	input_container.appendChild(input1_container);
	input_container.appendChild(to_el_clone);
	input_container.appendChild(input2_container);
	
	/*this code replaces the one commented out below; for some reason with jQuery selectors the click event attaches to both 
	input fields and one click clears both (WOKVX-19378))*/
	var el1 = document.getElementById("double1clearIcon"+rownum);
	var el2 = document.getElementById("double2clearIcon"+rownum);
	
	el1.onclick = function() {
			if($(this))
			var inputElement = document.getElementById("value(double_input_1_row" + rownum + ")");
			inputElement.value= '';
			$(this).parent().find("input[type='text'][title]").attr("value", $(this).parent().find("input[type='text'][title]").attr("title"));
		};
		
			
	el2.onclick = function() {
			if($(this))
			var inputElement = document.getElementById("value(double_input_2_row" + rownum + ")");
			inputElement.value= '';
			$(this).parent().find("input[type='text'][title]").attr("value", $(this).parent().find("input[type='text'][title]").attr("title"));
		};
		
	/*	
	$("[id='double1clearIcon"+rownum+"']").click (function(){
			if($(this))
			var inputElement = document.getElementById("value(double_input_1_row" + rownum + ")");
			inputElement.value= '';
			$(this).parent().find("input[type='text'][title]").attr("value", $(this).parent().find("input[type='text'][title]").attr("title"));
		});
		
	$("[id='double2clearIcon"+rownum+"']").click (function(){
			if($(this))
			var inputElement = document.getElementById("value(double_input_2_row" + rownum + ")");
			inputElement.value= '';
			$(this).parent().find("input[type='text'][title]").attr("value", $(this).parent().find("input[type='text'][title]").attr("title"));
		});
		*/
	//criteria_last_child();
}


//new func for MEDLINE. New addition to the General Search for mesh mapping
//This func adds this control to the page following the same paradigm as above functions:
//copy from a hidden control on the page and paste in the proper location after renaming for the row number.
function addRadsNChecksGroup(rownum, switch_element_id, input1, input2)
{
	var radsNchecks_hidden = document.getElementById(switch_element_id);
	var radsNchecks_clone = radsNchecks_hidden.cloneNode(true);
	radsNchecks_clone.id = switch_element_id + rownum;

	var radsNchecks_container = document.getElementById("RadsNChecksContainer" + rownum);
	radsNchecks_container.innerHTML = "";
	radsNchecks_container.innerHTML = radsNchecks_clone.innerHTML;
}

function toggle_limit_settings(value)
{
  try {
     if (value=="show") {
          document.getElementById('showLimits').style.display = "block";
          document.getElementById('currentSettings').style.display = "none";
	      document.getElementById('hideLimitsLabel').style.display = "block";
          document.getElementById('changeLimitsLabel').style.display = "none";
          document.getElementById('limitStatus').value = 'expanded';
     }
     else {
          document.getElementById('showLimits').style.display = "none";
          document.getElementById('currentSettings').style.display = "block";
          document.getElementById('hideLimitsLabel').style.display = "none";
          document.getElementById('changeLimitsLabel').style.display = "block";
		  document.getElementById('limitStatus').value = 'collapsed';
     }
   } catch (e) {
     ;
   }
}

function more_hide(id)
{
	el = document.getElementById(id);
	if (el.style.display == 'none')
	{
		el.style.display = '';
		el = document.getElementById('more'+id);
		el.innerHTML = '[hide]';
	} else {
		el.style.display = 'none';
		el = document.getElementById('more'+id);
		el.innerHTML = '[more]';
	}
}

function toggleRefineResultsPanel(showSrc, hideSrc, showClass, hideClass,
                                  alt_text_hide, alt_text_show,
				  title_text_hide, title_text_show) {

	var field = 'refine_panel';
	var td_name = 'summary_left_td';
	var tr  = document.getElementById(field);
	var td  = document.getElementById(td_name);
	var img = document.getElementById(field + "_img");


	if (tr.style.display == 'none') {
		img.src = showSrc;
		img.alt = alt_text_hide;
		img.title = title_text_hide;
		tr.style.display = '';
		if ( td && showClass != null ) {
			td.className=showClass;
		}
		ra_showRefinePanel(field);
	} else {
		img.src = hideSrc;
		img.alt = alt_text_show;
		img.title = title_text_show;
		tr.style.display = 'none';
		if ( td && hideClass != null ) {
			td.className=hideClass;
		}
		ra_hideRefinePanel(field);
	}

}

function check_all(list) {

    if(typeof list != 'object') {
        return false;
    }

    var len = list.length;

    if (typeof len == 'undefined') {
        list.checked = true;
        return false;
    }

    for(i = 0; i < len; i++) {
        list[i].checked = true;
    }
    return false;
}


//initial use is for deleting search history sets.
//could be used for other situations of this kind.
function list_selected_checks (list) {
	if(typeof list != 'object') {
        return false;
    }

    var len = list.length;
    var selectedSets = new Array();

    if (typeof len == 'undefined') {
        len = 1;
    }

    for(i = 0; i < len; i++) {
        if(list[i].checked == true) {
        	selectedSets.push(list[i].value);
        }
    }

    return selectedSets;
}

function toggleDAISCheckboxInputs( elemId ) {
	
	var field = document.getElementsByName('selectedId');
	if (document.getElementById(elemId).checked == 1) {
		
		for (i = 0; i < field.length; i++) {
			field[i].checked = true ;
		}
		
	} else {

		for (i = 0; i < field.length; i++) {
			field[i].checked = false ;
		}
	}
}


function verifyDAISRecordCount( currentRecordCount, elemId) {

	var authorUTCountElement = document.getElementById("AuthorUTCount");
	var existingRecordCount = authorUTCountElement.value;
	
	if (existingRecordCount.length == 0) {
		existingRecordCount = 0;
	}
	
	var selectedCheckBox = document.getElementById(elemId);
	var noOfSelectedUTs = 0;

	if (selectedCheckBox.checked) {

		noOfSelectedUTs = eval(existingRecordCount) + currentRecordCount

	} else {

		noOfSelectedUTs = eval(existingRecordCount) - currentRecordCount

	} 
	
	if (noOfSelectedUTs < 0 ) {
		noOfSelectedUTs = 0
	}
	
	authorUTCountElement.value = noOfSelectedUTs;
}


function submit_form( form ) {
  // if ( form )  {
//debug_alert('gotta form');
  //   form.submit();
  // }
  // else {
  //for( var i=0;i<document.forms["summary_records_form"].elements.length;i++){
  	//if(document.forms["summary_records_form"].elements[i].type == 'hidden')
	  //	alert(document.forms["summary_records_form"].elements[i].name+": "+
  		//		document.forms["summary_records_form"].elements[i].value);
  //}
  document.forms["summary_records_form"].submit();
  // }
  return true;
}

//Added this new function for the Data correction form updates fo Wok 5.3
function submit_corrections_form(form, url ) {
 var form = document.forms['correction_form'];
 form.setAttribute("target", "DataCorrectionForm");

 window.open('', 'DataCorrectionForm', '');
 form.submit();
  return true;
}

function submitFormWithoutInput(form) {
    //get the form element's document to create the input control with
    //(this way will work across windows in IE8)
    var button = form.ownerDocument.createElement('input');
    //make sure it can't be seen/disrupts layout (even momentarily)
    button.style.display = 'none';
    //make it such that it will invoke submit if clicked
    button.type = 'submit';
    //append it and click it
    form.appendChild(button).click();
    //if it was prevented, make sure we don't get a build up of buttons
    form.removeChild(button);
}

function logg (message) {
	if (       typeof console     !== 'undefined'
			&& typeof console.log !== 'undefined') {
		var port = window.location.port;
		if (port !== '' && port !== '80' && port != '443') {
			console.log(message);
		}
	}
}

var Summary = {
	searchModeName: 'search_mode',

	submitForm: function (event, formAction, id, searchModeValue, doAutoSubmit, fields) {
		if (       typeof jQuery === 'undefined'
				|| typeof fields === 'undefined'
				|| jQuery.isEmptyObject(fields)) {
			return submit_summary_form(formAction, id, searchModeValue, doAutoSubmit);
		}
		var checked = true;
		if (id && id.length > 0) {
			checked = check_summary_records_form_inputs(id);
		}
		if (checked && doAutoSubmit) {
			checked = invokeAutoSubmit();
		}
		if (!checked) {
			return checked;
		}
		var $event = $.Event(event);
		$event.preventDefault();
		$event.stopPropagation();
		var $summaryRecordsForm = $('form[name="summary_records_form"]');
		var $form = $(document.createElement('form'))
			.css('display', 'none')
			.attr('action', formAction)
			.attr('method', 'POST')
				;
		if (typeof searchModeValue !== 'undefined' && searchModeValue.length > 0) {
			$(document.createElement('input'))
				.attr('type', 'hidden')
				.attr('name', Summary.searchModeName)
				.val(searchModeValue)
				.appendTo($form)
					;
		}
		for (var field in fields) {
			var multiple = fields[field];
			var $els = $summaryRecordsForm.find('[name="' + field + '"]');
			if ($els.length && !multiple) {
				$els = [$els[0]];
			}
			for (var i = 0; i < $els.length; i++) {
				var $el = $els[i];
				var tagName = $el.tagName;
				if (tagName === 'INPUT') {
					$($el.cloneNode()).appendTo($form);
				} else if (tagName === 'SELECT') {
					var $checkedOptions = $el.find('option:checked');
					if ($checkedOptions.length) {
						var combinedValue = $checkedOptions
							.map(function () { return this.value })
							.get()
							.join(';')
								;
						$(document.createElement('input'))
							.attr('name', field)
							.attr('type', 'hidden')
							.val(combinedValue)
							.appendTo($form)
								;
					}
				}
			}
		}
		$form.appendTo('body').submit();
	}
};

function submit_summary_form( form_action, id, search_mode, doAutoSubmit ) {

  var checked = true;
  if ( id && id.length > 0 ) {
      checked = check_summary_records_form_inputs( id );
//debug_alert("got back checked="+checked);
  }

  if ( checked == true && doAutoSubmit )
	  checked = invokeAutoSubmit();

  if ( checked == true ) {
      // form containing summary recs
      var summary_records_form = document.forms["summary_records_form"];

//debug_alert("got a form? "+(summary_records_form?"yes":"no"));

    if ( search_mode && search_mode.length > 0 ) {
		var searchMode = summary_records_form.elements["search_mode"];
		var objectType = Object.prototype.toString.call(searchMode);
		if (objectType === '[object Array]' || objectType === '[object NodeList]') {
			for (var i = 0; i < searchMode.length; ++i) {
				searchMode[i].value = search_mode;
			}
		} else {
			searchMode.value = search_mode;
		}
    }
      // NOTE: this will fail on IE if a form element named "action" exists
      //   quick fix: remove the form element & add ?action=xxx to the
      //              form action string
      //document.forms["summary_records_form"].action = form_action;
      summary_records_form.action = form_action;

//debug_alert("set form action: "+ summary_records_form.getAttribute("action"));
  }
//debug_alert("returning with "+checked);

  if ( checked == true ) {
      if ( checked == true )
	  mergeMultiSelects();
  }

  return checked;
}

function get_url_components( form ) {
  var qid_src = form.elements["qid"];
  if ( qid_src == null ) {
    qid_src = form.elements["parentQid"];
  }
  var qid = qid_src.value;
  var sid = form.SID.value;
  var product = form.product.value;
  var mode = form.search_mode.value;

  var parms = "qid="  + qid + "&SID=" + sid + "&product=" + product +
    "&search_mode=" + mode;

  return parms;
}

function submit_go_to_page(page_input, max, paging_action, bowserBackLink, lastPage, sortAction, sortSelect, showFirstPage, pageSizeAction, pageSizSelect) {
    var pg_num = page_input.value;
    pg_num = process_page_number(pg_num, max);
    if(pg_num > 0) {
        page_input.value = pg_num;
        //always submit the records form instead of the navigation form to save checkboxes, if needed
		submit_handle_nav( null, pg_num, paging_action, bowserBackLink, lastPage, sortAction, sortSelect, showFirstPage, pageSizeAction, pageSizSelect);
    }
    else {
        page_input.select();
    }
	return false;
}

function submit_handle_nav(summary_nav_form, page_number, paging_action, browserBackLink, lastPage, sortAction, sortSelect, showFirstPage, pageSizeAction, pageSizeSelect) {
//debug_alert('in submit_handle_nav');
	mergeMultiSelects();

//debug_alert('did merging');
	// form containing summary recs
	var summary_records_form = document.forms["summary_records_form"];

	if ( summary_nav_form ) {
	  var page_element = summary_nav_form.elements.page;
	  page_element.value = page_number;
//debug_alert('got form & set page '+page_number);
	}

	//save the page element from the navigation form into the results form as a hidden value.
	//change the action to something that will handle navigation
	//submit the results form instead of the nav form that called this method.
	//this is done so that elements on the results, such as checkboxes can be retained and used.
	document.forms["summary_records_form"].elements["page"].value = page_number;
//debug_alert('we just set page.value to '+page_number);
//debug_alert('and it is '+document.forms["summary_records_form"].elements["page"].value );
	if ( paging_action && paging_action.length > 0 ) {
//05_28_08	  document.forms["summary_records_form"].action = paging_action;
		document.forms["summary_records_form"].setAttribute("action",paging_action);
//		if (action_att)
//		{
//debug_alert('action att obtained ' + action_att);
//		action_att.value=paging_action;
//		}

//debug_alert('set paging action '+paging_action);
	} else {
	  document.forms["summary_records_form"].elements["redirect_url"].value =
		document.forms["summary_records_form"].getAttribute("paging_url") +
		page_number;
//debug_alert('setting redirect url for page '+page_number);
	}

	if (browserBackLink != null ){
	    var location= browserBackLink + page_number;
//	    var location= browserBackLink + lastPage;
	    if (sortAction !=null) {
	     	location += "&action=" + sortAction;
	     	if (sortSelect  !=null ) {
	     	   		location += "&sortBy=" + sortSelect;
	     	 }
	    }
	 if (pageSizeAction !=null) {
	     	location += "&action=" + pageSizeAction;
	     	if (pageSizeSelect  !=null ) {
	     	   		location += "&pageSize=" + pageSizeSelect;
	     	 }
			if (showFirstPage !=null) {
	     	   		location += "&showFirstPage=" + showFirstPage;
					document.forms["summary_records_form"].elements.showFirstPage.value="1";
	     	 }
	    }

	document.forms["summary_records_form"].submit();
//debug_alert("location:" + window.location);
	return false;
    }  else {
	document.forms["summary_records_form"].submit();
//debug_alert("window location:" + window.location);
	return false;
    }
}

function handle_nav(summary_nav_form, page_number, paging_action, browserBackLink, lastPage, sortAction, sortSelect, showFirstPage, pageSizeAction, pageSizeSelect, noAutoSubmit) {
//debug_alert('in handle nav');
	mergeMultiSelects();

//debug_alert('did merging');
	// form containing summary recs
	var summary_records_form = document.forms["summary_records_form"];

	if ( summary_nav_form ) {
	  var page_element = summary_nav_form.elements.page;
	  page_element.value = page_number;
//debug_alert('got form & set page '+page_number);
	}

	//save the page element from the navigation form into the results form as a hidden value.
	//change the action to something that will handle navigation
	//submit the results form instead of the nav form that called this method.
	//this is done so that elements on the results, such as checkboxes can be retained and used.
	var page = summary_records_form.elements["page"];
	if ( page ) {
		page.value = page_number;
	} else {
		var pageElement = document.createElement("input");
		pageElement.setAttribute("type", "hidden");
		pageElement.setAttribute("name", "page");
		pageElement.setAttribute("value", page_number);
		document.getElementById("summary_records_form").appendChild(pageElement);
	}
//debug_alert('we just set page.value to '+page_number);
//debug_alert('and it is '+document.forms["summary_records_form"].elements["page"].value );
	if ( paging_action && paging_action.length > 0 ) {
//05_28_08	  document.forms["summary_records_form"].action = paging_action;
		summary_records_form.setAttribute("action",paging_action);
//		if (action_att)
//		{
//debug_alert('action att obtained ' + action_att);
//		action_att.value=paging_action;
//		}

//debug_alert('set paging action '+paging_action);
	} else {
          var redirect_url = summary_records_form.elements["redirect_url"];
	  if ( redirect_url ) {
		redirect_url.value =
			summary_records_form.getAttribute("paging_url") +
					page_number;
	  } else {
			var redirectUrl = document.createElement("input");
			redirectUrl.setAttribute("type", "hidden");
			redirectUrl.setAttribute("name", "redirect_url");
			redirectUrl.setAttribute("value", document.forms["summary_records_form"].getAttribute("paging_url")
					? document.forms["summary_records_form"].getAttribute("paging_url") + page_number
					: page_number);
			document.getElementById("summary_records_form").appendChild(redirectUrl);
		}
//debug_alert('setting redirect url for page '+page_number);
	}

	if (browserBackLink != null ){
	    var location= browserBackLink + page_number;
//	    var location= browserBackLink + lastPage;
	    if (sortAction !=null) {
	     	location += "&action=" + sortAction;
	     	if (sortSelect  !=null ) {
	     	   		location += "&sortBy=" + sortSelect;
	     	 }
	    }

	    if (pageSizeAction !=null) {
	     	location += "&action=" + pageSizeAction;
	     	if (pageSizeSelect  !=null ) {
	     	   		location += "&pageSize=" + pageSizeSelect;
	     	 }
		 if (showFirstPage !=null) {
	     	 	location += "&showFirstPage=" + showFirstPage;
			summary_records_form.elements.showFirstPage.value="1";
	     	 }
	    }

	if ( noAutoSubmit || invokeAutoSubmit() )
	    window.location = location;
        //document.forms["summary_records_form"].submit();
        //debug_alert("locaion:" + window.location);
	    return false;
    }  else {
        if ( summary_records_form.count_new_items_marked ) {
        	if ( summary_records_form.count_new_items_marked == 0 ) {
        		disable_auto_submit();
        	}
        } else {
        	disable_auto_submit();
        }

	    summary_records_form.submit();

        //debug_alert("window locaion:" + window.location);
	    return false;
    }


}//end function handle_nav


function handle_nav_no_auto_submit(summary_nav_form, page_number,
				   paging_action, browserBackLink, lastPage,
				   sortAction, sortSelect, showFirstPage,
				   pageSizeAction, pageSizeSelect) {
    return handle_nav( summary_nav_form, page_number, paging_action,
		       browserBackLink, lastPage, sortAction, sortSelect,
		       showFirstPage, pageSizeAction, pageSizeSelect, true);
}


function handle_sort(summary_sort_form, page_number, browserBackLink, lastPage, action, sortSelect, showFirstPage) {
	if (browserBackLink != null ){
	    var location= browserBackLink + lastPage;
//debug_alert("Location 1:" + location);

	    if (action !=null) {
	     	location +=  "&action=" + action;
//debug_alert("Location 2:" + location);
	     	if (sortSelect  != null) {
	     	   		location  += "&sortBy=" + sortSelect;
			if (showFirstPage !=null) {
	     	   		location += "&showFirstPage=" + showFirstPage;
	     	 }
//debug_alert("Location 3:" + location);
		   }
	    }


//debug_alert("Final location:" + location);
	    if (summary_sort_form != null) {
//debug_alert("submit the form and update window location");
//			summary_sort_form.submit();
		}
		if ( invokeAutoSubmit() )
		    window.location = location;
//debug_alert("Final window locaion:" + window.location);
		return false;
    }  else {
	    if (summary_sort_form != null) {
//debug_alert("submit the form directly");
			summary_sort_form.submit();
		} else {
//debug_alert("No form to submit");
		}
	}
	return false;

}


// This function is used on the Cited References Summary Page
function do_RR_action ( search ) {

    // Form containing 'Related Record' button and hidden element: all_summary_IDs
    var cited_references_form = document.forms["summary_records_form"];

    // Pass the all_summary_IDs to Related Records Page
    var path = "Related.do?";

    // Complete URL for Related Records Action
    var url = path + search;

    // Replace form action with URL
    cited_references_form.action = url;

    window.location = url;
//    return true;
    return false;

}

//call RAMore.do action with required params
//currently only used by the RA sort
function do_RAMore_sort_action ( sort_select, search_params ) {

    //set the selected sort as a hidden value and submit the form with the params sent.
    var refine_more_form = document.forms["refine_more_form"];
    var more_sort_hidden = refine_more_form.elements["more_sort_order"];

    if(sort_select.value == "alpha") {
    	more_sort_hidden.value = "alpha";
    } else {
    	more_sort_hidden.value = "default";
    }

    // Pass the all_summary_IDs to Related Records Page
    var path = "RAMore.do?";

    // Complete URL
    var url = path + search_params;

    // Replace form action with URL
    //06_05_08 refine_more_form.action = url;
    window.location=url + "&more_sort_order=" + sort_select.value ;
    return true;
}

function update_signin_and_quick_output(format, redirect_url, return_url) {
	// First take care of quick output
	update_quick_output(format);

	// Now save data and signin
	//alert("update_signin_and_quick_output: format: "+format+"   redirect_url="+redirect_url);

	// form containing top 'Print', 'Email', etc. buttons plus summary recs
	var form = document.forms["summary_records_form"];

	// Full Record Page
    if (form == null) {
    	//alert("update_signin_and_quick_output: no summary form (full record) ");
    	form = document.forms["full_record_form"];

    	form.elements["next_mode"].value = form.elements["mode"].value;
    	form.elements["mode"].value = "saveDataAndSignIn";
    	//alert("update_signin_and_quick_output: next_mode: "+form.elements["next_mode"].value + "   mode: "+form.elements["mode"].value);
    	if (return_url != null) {
    		redirect_url += "&rurl="+return_url;
    	}
    	form.elements["redirect_url"].value = redirect_url;

    // Summary Page
    } else {
    	// form containing summary records
    	var mode = form.elements["mode"].value;
    	form.elements["next_mode"].value = mode;
    	form.elements["mode"].value = "saveDataAndSignIn";
    	if (return_url != null) {
    		redirect_url += "&rurl="+return_url;
    	}
    	form.elements["redirect_url"].value = redirect_url;
    	//alert("update_signin_and_quick_output: next_mode: "+form.elements["next_mode"].value + " mode: "+form.elements["mode"].value);

    	// Now change form containing the bottom quick output widgets
    	form = document.forms["output_form"];
    	if (form != null) {
    		form.elements["next_mode"].value = mode;
    		form.elements["mode"].value = "saveDataAndSignIn";
    		form.elements["redirect_url"].value = redirect_url;
    		//alert("update_signin_and_quick_output: (output_form) setting next_mode: "+form.elements["next_mode"].value+ " mode: "+form.elements["mode"].value);
    	} else {
    		//alert("update_signin_and_quick_output: no summary output form");
    	}
    }

}

function update_quick_output(format) {
	// form containing top 'Print', 'Email', etc. buttons plus summary recs
	var summary_records_form = document.forms["summary_records_form"];

	// form containing the bottom quick output widgets
	var output_form = document.forms["output_form"];

	// get all selected records on page
	var selectedIdsArray = new Array();

    var dont_populate_summary_records_form = document.getElementById("dont_populate_summary_records_form");

	// Summary Page
    if (summary_records_form != null) {
    	//alert("update_quick_output: (summary) format: "+format);

	    if (summary_records_form.marked_list_candidates != null)
	    {
	    	//alert("update_quick_output: marked_list_candidates: "+summary_records_form.marked_list_candidates);
	    	summary_records_form.mode.value = "outputService";
			output_form.mode.value = "outputService";
	    	var allSummaryIdsArray = new Array();

	        try {
		        // BUG:600,601,619 : for single record summary page and single record selection.
	        	// summary_records_form.marked_list_candidates.length turns to be undefined when
	        	// there is only record in the summary page. The following condition
	        	// checks for single record and whether its selected or not before sumitted.
		        if( summary_records_form.marked_list_candidates.type == "checkbox") {
		        	var val = summary_records_form.marked_list_candidates.value;
		        	if(summary_records_form.marked_list_candidates.checked == true) {
			      	        selectedIdsArray.push(val);
			        }
			        allSummaryIdsArray.push(val);
		        }
		        else{
			        for( var i=0; i<summary_records_form.marked_list_candidates.length; i++){
		      		    var val = summary_records_form.marked_list_candidates[i].value;
			    	    if(summary_records_form.marked_list_candidates[i].checked == true) {
			      	        selectedIdsArray.push(val);
			            }
			            allSummaryIdsArray.push(val);
			        }
				}

		        // 2nd radio button means send all records on page to mark list
		       if (output_form.record_select_type[1].checked == true) {
		    	   selectedIdsArray = allSummaryIdsArray;
		       }
	        } catch (e) {
	         ;
	        }

		    var fields = "";

	        try  {
			    if (output_form.qo_fields.type == "hidden") {
			    	// Authors, Title, Source plus Abstract
			    	var abstractBox = document.forms["output_form"].elements["abstract"].checked;
			    	if (abstractBox == true) {
			    		fields = "BibAbs";
			    	}
			    	// Authors, Title, Source
			    	else {
			    		fields = "Bib";
			    	}
			    } else if (output_form.qo_fields[0].checked == true) {
			    	// Authors, Title, Source plus Abstract
			    	var abstractBox = document.forms["output_form"].elements["abstract"].checked;
			    	//if (output_form.abstract.checked == true) {
			    	if (abstractBox == true) {
			    		fields = "BibAbs";
			    	}
			    	// Authors, Title, Source
			    	else {
			    		fields = "Bib";
			    	}
			    }
			    else if (output_form.qo_fields[1].checked == true) {
			    	// Full Record plus Cited Reference
			    	// Fix for Bug #1339.
			    	if (output_form.citedref != null && output_form.citedref.checked == true) {
			    		fields = "Full";
			    	}
			    	// Full Record
			    	else {
			    		fields = "FullNoCitRef";
			    	}
			    }
	        } catch (e) {
	          // use try/catch to continue execution leaving fields as undefined, in case of exception.

	        }

		    // Copy values to hidden elements in both forms for submission
		    document.forms["output_form"].elements["selectedIds"].value  = selectedIdsArray.join(";");
			document.forms["output_form"].elements["format"].value = format;
			document.forms["output_form"].elements["fields"].value = fields;

	        // no need to create and copy variables to summary records form if we do not have
	        // quick output buttons on that form.
	        if (dont_populate_summary_records_form == null) {
		        document.forms["summary_records_form"].elements["selectedIds"].value = selectedIdsArray.join(";");
	    		document.forms["summary_records_form"].elements["format"].value = format;
			    document.forms["summary_records_form"].elements["fields"].value = fields;

			    // Add value from the bottom form's 'Step 1' radio selections
			    // (select, all, range) to hidden in top form
			    for (var i=0; i < output_form.record_select_type.length; i++)	{
	   			    if (output_form.record_select_type[i].checked) {
			          document.forms["summary_records_form"].elements["record_select_type"].value =
			      	    output_form.record_select_type[i].value;
	      		    }
	   		    }

				try {	// in the event we dont have a output_form as in cited ref pages
	   		    // Add value from the bottom form's 'Step 3' save options
			    // (text, html, reference, etc.) to hidden in top form
			    document.forms["summary_records_form"].elements["mark_to"].value =
				    document.forms["output_form"].elements["mark_to"].value;

			    document.forms["summary_records_form"].elements["mark_from"].value =
				    document.forms["output_form"].elements["mark_from"].value;
				} catch (e) {

	        	}
	        }
		}
	}
	// Full record page
	else {
		//alert("update_quick_output: (full_record) format: "+format);
      var full_record_form = document.forms["full_record_form"];
	  var fields = "";

	    if (full_record_form.qo_fields[0].checked == true) {
	    	// Authors, Title, Source plus Abstract
	    	var abstractBox = document.forms["full_record_form"].elements["abstract"].checked;
	    	//if (full_record_form.abstract.checked == true) {
	    	if (abstractBox == true) {
	    		fields = "BibAbs";
	    	}
	    	// Authors, Title, Source
	    	else {
	    		fields = "Bib";
	    	}
	    }
	    else if (full_record_form.qo_fields[1].checked == true) {
		    // BugNo: 1432 display of Citedreferences on fullrecord page.
	      	if (full_record_form.citedref != null && full_record_form.citedref.checked == true) {
		    	fields = "Full";
	    	}
	    	else {
	    		fields = "FullNoCitRef";
	    	}
	    }
		document.forms["full_record_form"].elements["format"].value = format;
		document.forms["full_record_form"].elements["fields"].value = fields;

	}
}//end update_quick_output


function disable_auto_submit() {
    if ( false ) {
	var markForm = document.forms["mark_records_form"];
	if ( markForm ) {
		markForm.setAttribute("url", null);
	}
	return true;
    }
    return disableAutoSubmit();
}


function auto_submit_markedlist( redirect_url ) {

  // form containing summary recs and checkboxes
  var summary_records_form = document.forms["summary_records_form"];
  var count_new_items_marked = 0;

  if ( summary_records_form ) {
	//Making sure AutoSubmit to honor the currently selected records on the page.
	mark_selected_records_onpage('add');

	if ( redirect_url && redirect_url.length > 0 ) {
	  //summary_records_form.elements["redirect_url"].value = redirect_url;
	  var redirectUrlObj= summary_records_form.elements["redirect_url"];
	  if(redirectUrlObj !=null){
	  	redirectUrlObj.value=redirect_url;
	  }

//debug_alert('setting redirect url');
	  // summary_records_form.submit();
	} else {
		// This works even for undefined, empty, null, nonnumeric, or NaN values.
		count_new_items_marked = summary_records_form.count_new_items_marked.value;
		if (count_new_items_marked > 0) {
	  		postAsyncForm( 'summary_records_form', 'auto_submit_url' );
		}
	}
  }
  // just in case
  disable_auto_submit();

  return false;
}

function auto_submit_checkboxes( redirect_url ) {
  // form containing summary recs and checkboxes
  var summary_records_form = document.forms["summary_records_form"];
//debug_alert('In auto_submit_checkboxes');

  if ( summary_records_form ) {
//debug_alert('Calling postAsyncForm');
	postAsyncCheckboxForm( 'summary_records_form', 'auto_submit_url' );
  }

  return false;
}

// Update the marked list for quick output
function update_mark_list(format) {

	// form containing top 'Print','Add to MarkedList' 'Email', etc. buttons plus summary recs
	var summary_records_form = document.forms["summary_records_form"];

	var mark_id = null;
	if(summary_records_form != null)
		mark_id=summary_records_form.mark_id;

	// form containing the bottom quick output widgets
	var output_form = document.forms["output_form"];

	// get all selected records on page
	var selectedIdsArray = new Array();

    // Summary Page
    if(summary_records_form != null) {

	    if (mark_id != null && (mark_id.value == 'RXN' || mark_id.value == 'CPD')) {
			var selected_range=0;

			if (format == "add_page") {
			   for( var i=0; i<summary_records_form.marked_list_candidates.length; i++){
			       summary_records_form.marked_list_candidates[i].checked = true;
			   }
			   format = "add";
			}

			for( var i=0; i<summary_records_form.marked_list_candidates.length; i++){
				if(summary_records_form.marked_list_candidates[i].checked == true){
					var val = summary_records_form.marked_list_candidates[i].value;
					selectedIdsArray.push(val);
				}
			}
			summary_records_form.selectedIds.value = selectedIdsArray.join(";");
			selected_range = selectedIdsArray.length;

			summary_records_form.mode.value = "addToMark";
			summary_records_form.count_new_items_marked.value = selected_range;

		}
		else if (summary_records_form.marked_list_candidates != null)
	    {

	    	//new code for usage reporting
			var selected_range=0;

			if (format == "add_page") {
			   for( var i=0; i<summary_records_form.marked_list_candidates.length; i++){
			       summary_records_form.marked_list_candidates[i].checked = true;
			   }
			   format = "add";
			}

	    	if (output_form.record_select_type[0].checked == true) {
	    	   mark_selected_records_onpage(format);
	    	   return;
	        }
	        else if (output_form.record_select_type[1].checked == true) {
		    	for( var i=0; i<summary_records_form.marked_list_candidates.length; i++){
					var val = summary_records_form.marked_list_candidates[i].value;
					selectedIdsArray.push(val);
				}

			    // Copy values to hidden elements in both forms for submission
			    output_form.selectedIds.value  = selectedIdsArray.join(";");
				summary_records_form.selectedIds.value = selectedIdsArray.join(";");
				selected_range = selectedIdsArray.length;
			}
	        else if (output_form.record_select_type[2].checked == true) {
				summary_records_form.mark_to.value =output_form.mark_to.value;
				summary_records_form.mark_from.value =output_form.mark_from.value;

				selected_range = summary_records_form.mark_to.value - summary_records_form.mark_from.value + 1;
			}

			if(format == "add") {
				output_form.mode.value = "addToMark";
				summary_records_form.mode.value = "addToMark";
			}
			// code for usage reporting
			output_form.count_new_items_marked.value = selected_range;
			summary_records_form.count_new_items_marked.value = selected_range;
			// Add value from the bottom form's 'Step 1' radio selections
			// (select, all, range) to hidden in top form
			for (var i=1; i < output_form.record_select_type.length; i++)	{
	 			if (output_form.record_select_type[i].checked) {
		        	summary_records_form.record_select_type.value =output_form.record_select_type[i].value;
	     		}
			}
		}
	}
	// Full record page
	else {
      	var full_record_form = document.forms["full_record_form"];

		if(format == "add") {
    		document.forms["full_record_form"].elements["mode"].value = "addToMark";
    		document.forms["full_record_form"].elements["count_new_items_marked"].value = "1";
    	}
	}
}

function get_named_inputs( input_name ) {

  var results = new Array();
  var summary_records_form = document.forms["summary_records_form"];

  if (summary_records_form != null &&
	  summary_records_form.elements[input_name] != null)
    {
      var type = summary_records_form.elements[input_name].type;
      if ( type == "hidden" || type == "checkbox" ) {
		results[0] = summary_records_form.elements[input_name];
	  } else {
		results = summary_records_form.elements[input_name];
	  }
	}

  return results;
}

function get_markedlist_checkboxes() {

  var results = new Array();
  var summary_records_form = document.forms["summary_records_form"];

  if (summary_records_form != null &&
	  summary_records_form.marked_list_candidates != null)
    {
// BUG:600,601,619 : for single record summary page and single record selection.
// summary_records_form.marked_list_candidates.length turns to be undefined when
// there is only record in the summary page. The following condition
// checks for single record and whether its selected or not before sumitted.
	  if( summary_records_form.marked_list_candidates.type == "checkbox") {
		results[0] = summary_records_form.marked_list_candidates;
	  } else {
		results = summary_records_form.marked_list_candidates;
	  }
	}

  return results;
}

// Prepare for request to update marked list indicators
function update_markedlist_indicators( mlForm ) {

  if ( ! mlForm )
	return false;

  var candidateForm = null;
  var formName = mlForm.getAttribute('records_form_name');

  if ( formName && formName.length > 0 ) {

	candidateForm = document.forms[formName];
  } else {
	candidateForm = document.forms["summary_records_form"];
	if ( ! candidateForm )
	  candidateForm = document.forms["full_record_form"];
  }
  var candidates = new Array();
  if ( candidateForm ) {
//06_05_08	var candidates = new Array();
	var markId = candidateForm.elements["mark_id"];
	if ( markId ) {
		mlForm.elements["mark_id"].value = markId.value;
		var allCandidates = get_named_inputs('ml_indicator_candidates');
		if ( allCandidates.length > 0 ) {
			for ( var i = 0; i < allCandidates.length; ++i ) {
				candidates.push( allCandidates[i].value );
			}
			// unset allCandidates?
			//alert(" candidates= "+candidates.toString());
		} else {
			var currIdx = null;
			var startRec = mlForm.elements["startRec"];
			if ( startRec ) {
	  			currIdx = startRec.value;
			}
			if ( currIdx == null ) {
		  		currIdx = 1;
			}

			var allCheckboxes = get_markedlist_checkboxes();
			if ( allCheckboxes.length > 0 ) {
 			    var indicator, name;

				for ( var i = 0; i < allCheckboxes.length; ++i, ++currIdx ) {
				    name = "ml_indicator_" + currIdx;
					indicator = document.getElementById( name );
	//if ( indicator )
	//alert('indicator '+name+' is '+indicator+' and has:"'+indicator.innerHTML+'"');
	//else
	//alert('indicator '+name+' is null');

					if ( indicator == null || indicator.innerHTML.length == 0 ) {
					   candidates.push( allCheckboxes[i].value );
					   candidates.push( currIdx );
					}
				}
			} else {
			    // full record, most likely
			    //  this could be extended to handle multiple records by
			    //    splitting "selected" on ';' and iterating as is done
			    //    above for allCheckboxes
			    var selected = candidateForm.elements["selectedIds"];
				if ( selected ) {
				  // alert('trying with selected '+selected.value);
				   candidates.push( selected.value );
				   candidates.push( currIdx );
				}
			}
		}
		mlForm.elements["candidates"].value = candidates.join(";");
	}
  }

  return ( candidates.length > 0 );
}

// Update the marked list for quick output
function mark_selected_records_onpage(format){

	var summary_records_form = document.forms["summary_records_form"];
	var output_form = document.forms["output_form"];

	// get all selected records on page
	var selectedIdsArray = new Array();
	var mark_id = null;
	if(summary_records_form != null)
		mark_id=summary_records_form.mark_id;

	if(summary_records_form != null && mark_id != null && (mark_id.value == 'RXN' || mark_id.value == 'CPD')) {
		//output_form is not available in WOS-CHEM StructureSearch summary results page.
		output_form = summary_records_form;
	}

	if (summary_records_form != null) {

		if(format == "add") {
				output_form.mode.value = "addToMark";
				summary_records_form.mode.value = "addToMark";
		}

		if (summary_records_form.marked_list_candidates != null)
    	{
	     try {
		     // BUG:600,601,619 : for single record summary page and single record selection.
		     // summary_records_form.marked_list_candidates.length turns to be undefined when
		     // there is only record in the summary page. The following condition
		     // checks for single record and whether its selected or not before sumitted.
		     if( summary_records_form.marked_list_candidates.type == "checkbox") {
		      	var val = summary_records_form.marked_list_candidates.value;
		      	if(summary_records_form.marked_list_candidates.checked == true) {
		     	    selectedIdsArray.push(val);
		       }
		     }
		     else{
		       for( var i=0; i<summary_records_form.marked_list_candidates.length; i++){
					var val = summary_records_form.marked_list_candidates[i].value;
					if(summary_records_form.marked_list_candidates[i].checked == true) {
					    selectedIdsArray.push(val);
					}
		       }
			 }
	     } catch (e) {
	      ;
	     }

	    // Copy values to hidden elements in both forms for submission
	    try {
		    output_form.selectedIds.value  = selectedIdsArray.join(";");
			summary_records_form.selectedIds.value = selectedIdsArray.join(";");

			//WOS-CHEM Structure Summary does not have the summary_output form.
			if(mark_id != null && mark_id.value != 'RXN' && mark_id.value != 'CPD')
		    	summary_records_form.record_select_type.value = output_form.record_select_type[0].value;
			output_form.count_new_items_marked.value = selectedIdsArray.length;
			summary_records_form.count_new_items_marked.value = selectedIdsArray.length;
		} catch (e) {
		 ;
		}
		}
	}
}

// validate input for quick output
function check_qo_input() {
    if (!check_output_range()) {
        //if there is an error, clear input from the boxes
        var output_form = document.forms["output_form"];

    //8.26.2009 CS - For now, I am commenting these two out because NPD would not like us to ever
    //clear these boxes. However, since we have had navigation issues in the past from failing to clear them,
    //I wanted to leave the code here temporarily until we are sure this won't happen again.

        //output_form.elements["markFrom"].value = "";
        //output_form.elements["markTo"].value = "";
        return false;
    }

    return true;
}

function check_ml_input() {
	if (!check_output_range("marked_list")) {
	    //if there is an error, clear input from the boxes
        var output_form = document.forms["output_form"];

    //8.26.2009 CS - For now, I am commenting these two out because NPD would not like us to ever
    //clear these boxes. However, since we have had navigation issues in the past from failing to clear them,
    //I wanted to leave the code here temporarily until we are sure this won't happen again.

        //output_form.elements["markFrom"].value = "";
        //output_form.elements["markTo"].value = "";
    	return false;
  	}

	return true;
}

var MARKED_LIST_MAX_RECORDS = 5000;
var QUICK_OUTPUT_MAX_RECORDS = 500;
var FAST_SAVE_MAX_RECORDS = 5000;
var QUICK_OUTPUT_HIGHEST_RECORDS = 100000;
var CURRENT_NUM_MARKED_LIST_RECORDS = 0;
var FINAL_DISPLAY_RESULTS_COUNT = 0;
var EIDS_MAX_ORDER_RECORDS = 35;

// check if from and to values for the range are valid. If not display the appropriate
// message.
function check_output_range(format) {

	// Get form containing top 'Print','Add to MarkedList' 'Email', etc. buttons plus summary recs
	var summary_records_form = document.forms["summary_records_form"];
	// Summary page with no checkboxes (bug 1828)
	if (summary_records_form != null && summary_records_form.marked_list_candidates == null && summary_records_form.elements["service_mode"].value != 'CitedRefList-outputService'){
			//alert("Quick Output features are not available for this page.");
			var errorMessage = getMessageById("quickOutputNotAvailable");
			alert(errorMessage);
			return false;
		}

    var mark_from =  document.forms["output_form"].elements["markFrom"].value;
    var mark_to =  document.forms["output_form"].elements["markTo"].value;
    mark_from = (mark_from).replace(/^\s*|\s*$/g,'');
    mark_to = (mark_to).replace(/^\s*|\s*$/g,'');

    //first make sure both boxes are populated
    if (mark_from == "" || mark_to == "") {
        var range_null_error =  getMessageById("quickOutputNullInARange");
        alert(range_null_error);
        return false;
    }

    //make sure we have positive integers, no special characters
    if(!isPosInteger(mark_from) || !isPosInteger(mark_to)) {
        var range_specialchar_error =  getMessageById("range_specialchar_error");
		alert (range_specialchar_error);
        return false;
    }

    //make sure range is in the right numerical order
    // Condition logic changed due to FF error when from_to > 9. Dan Eisenstein 08/25/09
    if ( (mark_to - mark_from) < 0 ) {
        var range_notsequential_error = getMessageById("range_notsequential_error");
        alert (range_notsequential_error);
        return false;
    }

    //make sure numbers entered are in the set
    var result_count;
    var resultId = document.getElementById("trueFinalResultCount");
    if (resultId == null) {
        resultId = document.getElementById('hitCount.top');
    }
    if (resultId != null) {
    	result_count = resultId.innerHTML.toString();
        if ( null == result_count || "" === result_count ) {
    		result_count=resultId.value;
    	}
    }

    if (result_count == null) {
    	result_count =  CURRENT_NUM_MARKED_LIST_RECORDS;
    }

    if(result_count != null) {
    	if(result_count != CURRENT_NUM_MARKED_LIST_RECORDS) {
    	   result_count = result_count.replace(",", "");
    	}
        result_count = parseInt(result_count);
        var range_notinset_error =  getMessageById("range_notinset_error");

        //8.26.2009 CS - At this point, we know we have integers in the correct numerical order, so
        //it was requested that if we try to mark beyond the range, as long as we started marking within the
        //range, we would allow that, and the ML would only mark what it could,
        //so I'm taking out the mark_to > result_count condition for this error message.
        if ( (mark_to == 0) || (mark_from == 0) || (mark_from > result_count)) {
            alert(range_notinset_error);
            return false;
        }
    }

    //mark limit
    var range_morethan_maxrec_error;
    var range_morethan_highestrec_error = getMessageById("qo_range_morethan_highestrec_error");
    var max_record_limit;
    var highest_record = QUICK_OUTPUT_HIGHEST_RECORDS;
    if (format == "marked_list") {
        range_morethan_maxrec_error =  getMessageById("ml_range_morethan_maxrec_error");
        max_record_limit = MARKED_LIST_MAX_RECORDS;
    } else {
        range_morethan_maxrec_error =  getMessageById("qo_range_morethan_maxrec_error");
        max_record_limit = QUICK_OUTPUT_MAX_RECORDS;
    }

    if ( (mark_to - mark_from + 1) > max_record_limit) {
        alert(range_morethan_maxrec_error);
        return false;
    }
    if ( (parseInt(mark_to)) > parseInt(highest_record)) {
    	alert(range_morethan_highestrec_error);
    	return false;
	}
	return true;
}

function isPosInteger(testInt) {
    testInt = testInt.toString();
    if(isNaN(testInt)) {
        return false;
    }
    for (var i = 0; i < testInt.length; i++) {
        var oneChar = testInt.charAt(i);
        if (oneChar < "0" || oneChar > "9") {
            return false;
        }
    }
    return true;
}

function set_output_range_option() {
     var record_select_type_range = document.getElementById("record_select_type_range");
     record_select_type_range.checked = true;
     return true;
}

function open_cwc_location(theURL,winName) {
     var win_w = parseInt(screen.width * .85);
     var win_h = parseInt(screen.height * .70);
     winprops = 'height='+win_h+',width='+win_w+',top=70,left=60,directories=yes,location=yes,'+
                'menubar=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes';
     newwindow=window.open(theURL, winName, winprops);
     if (window.focus) {newwindow.focus()}
     return false;
}

function handle_nav_final_counts_MovedToAsyncJS(final_hit_count, final_page_count) {

	//declare spans to be changed
	var recs_count_top = document.getElementById('hitCount.top');
	var page_count_top = document.getElementById('pageCount.top');
	var recs_count_bottom = document.getElementById('hitCount.bottom');
	var page_count_bottom = document.getElementById('pageCount.bottom');

	//replace all the ...'s with real values, if needed. Clear it and replace it.
	if (recs_count_top.innerHTML.match(/\.\.\./)) {
			recs_count_top.innerHTML = "";
			recs_count_top.innerHTML = final_hit_count;
	}


	if (page_count_top.innerHTML.match(/\.\.\./)) {
			page_count_top.innerHTML = "";
			page_count_top.innerHTML = final_page_count;
	}


	if (recs_count_bottom.innerHTML.match(/\.\.\./)) {
			recs_count_bottom.innerHTML = "";
			recs_count_bottom.innerHTML = final_hit_count;
	}


	if (page_count_bottom.innerHTML.match(/\.\.\./)) {
			page_count_bottom.innerHTML = "";
			page_count_bottom.innerHTML = final_page_count;
	}

}//end function handle_nav_final_counts

// Function to handle multiple options in a search box
// Params: 1) Selected extended option
//         2) Default option
//		   3) Element ID to toggle
function updateExtendedOption(selectE, defaultE, elemID){
	if (document.getElementById(elemID).value == selectE) {
		document.getElementById(elemID).value = defaultE;
	}
	else {
		document.getElementById(elemID).value = selectE;
	}
}


function initMultiSelectDelimiter() {
	var multiSelectDelimiter = '### ';
	// Dan Eisenstein - 07/23/2010 - This condition is not required under WOK5X
	// Fixed part of WOKVX-6618.
	//if (document.forms[0].product.value=="MEDLINE") {
	//	multiSelectDelimiter = ';;';
	//}
	return multiSelectDelimiter;
}

function initMultiSelectDelimiterEncoded() {
	var multiSelectDelimiter = '&amp;#35;&amp;#35;&amp;#35; ';
	return multiSelectDelimiter;
}


// Function to select values in a multiselect box
// Params: 1) Select box object
//         2) String of selected values, delimited by '### '
function selectMultiSelects(select, selected) {
	selected = selected.replace(/&amp;#45;/g, "-"); 
	selected = selected.replace(/&amp;#59;/g, ";"); 
	selected = selected.replace(/&amp;#46;/g, "."); 
	selected = selected.replace(/&amp;#44;/g, ","); 
	selected = selected.replace(/###/g, "&amp;#35;&amp;#35;&amp;#35;"); 
	var multiSelectDelimiter = initMultiSelectDelimiterEncoded();

	var anymatch = 0;

	if (selected.length > 0) {
		select.options[0].selected = false;
		var selects = selected.split(multiSelectDelimiter);
		for (i=0; i<select.length; i++) {
			var match = false;
			for (j=0; j<selects.length; j++) {
				if (select.options[i].value == selects[j]) {
					anymatch = 1;
					match = true;
				}
			}
			if (match == true) {
			  select.options[i].selected = true;
			}
			else {
				select.options[i].selected = false;
			}
    	}
  	}

  	if (anymatch == 0) {
		select.options[0].selected = true;
		for (i=1; i<select.length; i++) {
			select.options[i].selected = false;
		}	
  	}
}

// remove unwanted starting and trailing spaces of the input textbox.
function trim_input (val) {
	if(val != null)
		val.value = val.value.replace (/^\s+|\s+$/g, '');
}

function hideClientError (layer) {
	if ( typeof layer === "undefined" ) {
		layer = "errorMessageDiv";
	}
	var clientError = document.getElementById(layer);
	if ( clientError ) {
		document.getElementById("client_error_input_message").innerHTML = "";
		if ( clientError.style.display === "block" ) {
			clientError.style.display = "none";
		}
	}
}

//To display the hidden client error messages
function show_client_error(layer,notice) {
    var client_error = document.getElementById(layer);
    if(client_error != null){
	    var display_msg = document.getElementById('client_error_input_message');

		if(client_error.style.display == "none") {
		  display_msg.innerHTML=notice;
		  client_error.style.display='block';
		}
		else{
			display_msg.innerHTML=notice;
		}
	}
    else {
    	// fall back
    	alert(notice);
    }
    return false;
  }

//	Function to combine the selected options in a multi-select box into
//	a single (option[0]) value to be submitted to the server.  This
//	method will check all forms and process all multi-select selects.
//  This method is called from other javascript funcitons that assist in
//  form submittion (search forms, page navigation forms, etc)
function mergeMultiSelects() {
	var multiSelectDelimiter = initMultiSelectDelimiter();

	// Loop through all forms
	for(i=0; i<document.forms.length; i++) {
		var form = document.forms[i];

		// Loop through form elements
		for(j=0; j<form.elements.length; j++) {
			// We only care about multiselect boxes
			if (form.elements[j].type == "select-multiple") {
				var select = form.elements[j];
				var selected = '';

				// Loop through all options in this multi-select box
				for(k=0; k<select.options.length; k++) {
					// If this option is selected, add it to our single string
					if (select.options[k].selected == true) {
						if (selected.length > 0) {
							selected = selected + multiSelectDelimiter + select.options[k].value;
						} else {
							selected = select.options[k].value;
						}
						// Now unselect it
						select.options[k].selected = false;
					}
				}

				// Re-select the first option, and set the value to our delimited string
				select.options[0].value = selected;
				select.options[0].selected = true;
			}
		}
	}
}

//a more generic way of trimming a string
function _trim (str) {
	if(str == null){
		return str;
	}

	var s1 = str.replace (/^\s+|\s+$/g, '');

	return s1;
}


function hide_show(id, status){
	 document.getElementById(id).style.display = status;
}

function is_enter_key (event) {
  var charCode = (event.charCode) ? event.charCode :
        ((event.which) ? event.which : event.keyCode);
  return (charCode == 13 || charCode == 3 );
}

function submit_on_enter (format, objevent) {

  if (! objevent) objevent = event;

  var charcode = objevent.which;
  if (! charcode)
      charcode = objevent.keyCode;

  var is_safari = navigator.userAgent.indexOf('Safari')>0;
  if (is_safari && charcode == 3) charcode = 13;

  if (charcode == 13) {
  	disable_auto_submit();
  	update_mark_list(format);
  	if(check_ml_input()){
	  	document.forms["output_form"].submit();
	  	return false;
  	}
  }
  return true;
}

function submit_ML (format, objevent) {

	  if (! objevent) objevent = event;

	  var charcode = objevent.which;
	  if (! charcode)
	      charcode = objevent.keyCode;

	  var is_safari = navigator.userAgent.indexOf('Safari')>0;
	  if (is_safari && charcode == 3) charcode = 13;

	  if (charcode == 13) {
  		return mark_records(getOutputForm());
	  }
	  return true;
	}

function check_chem_editions(skip_input_field,action)
{
	var invalid_rgroup_exactmatch_message = document.getElementById("invalid_rgroup_exactmatch_error").value;
	var incomplete_structure_message = document.getElementById("incomplete_structure_error").value;
	var invalid_substructure_message = document.getElementById("invalid_substructure_error").value;
	var invalid_exactmatch_message = document.getElementById("invalid_exactmatch_error").value;
	var undefined_rgroup_message = document.getElementById("undefined_rgroup_error").value;
	var rgroup_unsupported_message = document.getElementById("rgroup_unsupported_error").value;
	var substructure=true;
	
	var no_chem_editions_selected_message = document.getElementById("editions_not_selected_error").value;
	var no_ccr_or_ic_message = document.getElementById("no_ccr_or_ic_error").value;
	var no_ccr_message = document.getElementById("no_ccr_error").value;
	var notice = document.getElementById("input_invalid_notice").value;

	var structure_search_form = document.forms["WOS_StructureSearch_input_form"];
	var editions = structure_search_form;
	var invalid_input=true;

	var ncpdfields=0;
	var nrxnfields=0;

	structure_search_form.action.value = action;
	
	var ccrChecked    = false;
	var icChecked     = false;
	var ccrInputSelector         = $('#WOS_StructureSearch_input_form').find("input[type=checkbox][value='CCR']");
    var icInputSelector         = $('#WOS_StructureSearch_input_form').find("input[type=checkbox][value='IC']");
	
    if(ccrInputSelector.filter(':checked').length > 0) {
	  ccrChecked = true;
    }	
    if(icInputSelector.filter(':checked').length > 0) {
  	  icChecked = true;
    }
    
	if ( !icChecked && !ccrChecked ) {
		if (skip_input_field == "yes") {
			//	alert(no_chem_editions_selected_message);
			show_client_error("errorMessageDiv", no_chem_editions_selected_message);
		}
		else {
			//	alert(no_ccr_or_ic_message);
			show_client_error("errorMessageDiv", no_ccr_or_ic_message);
		}
		//return true;
		return false;
	}

	for (i=0; i<structure_search_form.elements.length; i++) {
		var e = structure_search_form.elements[i];

		if ( e.name == "granularity" ){ 
			if( e.value == "substructure" )substructure=e.checked;
		}
		else if ( e.name == "ISRXNQRY" ){ 
			trim_input(e);
			
			if(e.value == "$RXN")nrxnfields += 1;
			else if(e.value == "A") ncpdfields += 1;
			else if(e.value == "$MDL") ncpdfields += 1;
		}
		else if ( e.type == "text" || e.type == "textarea"){
			trim_input(e);
			if(e.value.length>0){
				if(e.name.substring(0,5) == "COMP_" )ncpdfields += 1;
				else if (e.name.substring(0,2) == "RX") {
					nrxnfields += 1;
				}
			}
		}
		else if ( e.type == "checkbox" ) {
			if ( e.name == "RXREFLUX") {
				if(e.checked == true ) nrxnfields += 1;
			} 
		}
		else if ( e.type == "select-one" && e.name == "RXATMOSPHERE"){
			if(e.value.length>0) nrxnfields += 1;
		}
	}

	if(ncpdfields == 0){
		if(nrxnfields == 0){ 
			//		alert(notice);
			show_client_error("errorMessageDiv",notice);
			return false;
		} 
	}

	if ( !ccrChecked && nrxnfields > 0 ) {
		show_client_error("errorMessageDiv", no_ccr_message);
		return false;
	}
	
	// Structure Drawing validation
	var molfile=document.getElementById('molfile').value;
	var rxnqry=molfile.substring(0, 10).replace(/^\s+|\s+$/g, '');
		
	if(molfile.indexOf("M  V30 BEGIN CTAB") <= -1 ) {

	if(rxnqry.indexOf("$RXN") > -1 ){
		var lpos = molfile.indexOf("$MOL")

		if(lpos < 0){
			show_client_error("errorMessageDiv", incomplete_structure_message);
			return false;
		}

		var irct=parseInt(molfile.substring(lpos-6, lpos-4) );
		var iprd=parseInt(molfile.substring(lpos-3, lpos-1) );

		if(irct*iprd == 0 && !substructure){
			show_client_error("errorMessageDiv", invalid_exactmatch_message);
			return false;
		}
		else{
			var molpos = molfile.indexOf("$MOL"); 
			for(j=0; j<irct+iprd; j++){

				var molend = molfile.indexOf("M  END", molpos);
				var msize = molend - molpos; 

				if(msize<80 && substructure){
					show_client_error("errorMessageDiv", invalid_substructure_message);
					return false;
				}

				molpos = molfile.indexOf("$MOL", molend );
			}
		}
			
		var RRpos = molfile.indexOf("M  RGP");
		if(RRpos > 0){
			show_client_error("errorMessageDiv", rgroup_unsupported_message);
			return false;
		}
	}
	else if(rxnqry.indexOf("ACL") > -1 ){
		var molpos = molfile.indexOf("M  END");
		if(molpos<80 && substructure){
			show_client_error("errorMessageDiv", invalid_substructure_message);
			return false;
		}	
		
		var RRpos = molfile.indexOf("M  RGP");
		if(RRpos > 0){
			show_client_error("errorMessageDiv", undefined_rgroup_message);
			return false;
		}
	}
	else if(rxnqry.indexOf("$MDL") > -1 ){
		if(!substructure){
			show_client_error("errorMessageDiv", invalid_exactmatch_message);
			return false;
		}	
		var rgppos = molfile.indexOf("$RGP");
		while(rgppos<molfile.length && rgppos>-1){
			var rgpend = molfile.indexOf("$END RGP", rgppos);

			if(rgpend - rgppos < 15){
				show_client_error("errorMessageDiv", undefined_rgroup_message);
				return false;
			}
			rgppos = molfile.indexOf("$RGP", rgpend);
		}
	}

	}

	if ( typeof WOKTimespan !== "undefined" ) {
	    return WOKTimespan.validateDateRange();
	}
    return true;
}

function check_plugin(url){
	var ISI_plugin_installed=plugin_check(url);
	var plugin_param="";
	if(!ISI_plugin_installed)
	{
		plugin_param="&ISIPlugin=false";
	}
	window.location=url+plugin_param;
	return true;
}

function prepare_window_location(window_location) {
//	alert("Assigning window location:" + window_location);
		 return go_to_url(window_location);
//		 return false;
}
//////////Follwoing function is used for right click /////////////////////////////////
function IsAllowedRightClick(o){
   //Business Logic is here
  var allowedLinks=document.getElementsByName("LinksAreAllowedRightClick");
  for (i=0;i<allowedLinks.length;i++) {
       if(o.href.indexOf(allowedLinks[i].value)>(-1)){
          if(o.href.indexOf('&cacheurlFromRightClick=no')<=(-1)){//this is make assure the param only added once
             o.href=o.href+'&cacheurlFromRightClick=no';
          }
          //Only for the link which has been rightclicked,this click handler is added for remove cacheurlFromRightClick
	  /****  clean up!
	  if(navigator.appName.indexOf("Microsoft Internet Explorer")>(-1)){
	          addEvent(o, "click",CLHandlerRmCFRC(o));
	  }
	  if(navigator.appName.indexOf("Netscape")>(-1)){
	          o.setAttribute("onclick","javascript:return RmCacheurlFromRightClick(this);");
          }
	  *****/
	  addEvent( o, "click",
		    function() { return RmCacheurlFromRightClick(o); } );
          return true;
       }
  }
  return false;
}
//this function will be revoked for the link which has been rightclicked before
function RmCacheurlFromRightClick(o){
    /*** clean up
  if(o.href.indexOf('&cacheurlFromRightClick=no')>(-1)){//If there is a right click on this link
     o.href=o.href.replace('&cacheurlFromRightClick=no','');
  }
    *****/
    var newHref = o.href.replace('&cacheurlFromRightClick=no','');
    //alert( "have "+newHref.length+" and "+o.href.length+" ("+newHref+")" );
    if ( newHref.length != o.href.length )
	o.href = newHref;

  return true;
}



function addEvent(obj, eventType, fn)
{
	if (obj.addEventListener)
	{
		obj.addEventListener(eventType, fn, false);
		return true;
	}
	else if (obj.attachEvent)
	{
		var r = obj.attachEvent("on" + eventType, fn);
		return r;
	}
	else
	{
		return false;
	}
}

function getAutoSubmitFunctionName( form ) {

    if ( form == null ) {    	
    	form = getRecordsForm();
    }
    var af;
    if(form!=null) { 
	af = form.getAttribute('auto_submit_function');
	}
    if (typeof af == 'undefined') {
    	af = autoSubmit;    	
    }
    
    return eval(af);
}

function isAutoSubmitAllowed( form ) {

    if ( form ) {
	var allowed = form.getAttribute('autoSubmitAllowed');
	
	return ( allowed != 'false' );
    }

    return true;
}


function autoSubmit() {
    var form = getRecordsForm();
    if ( isAutoSubmitAllowed(form) )
    postAsyncCheckboxForm( form.id, "auto_submit_url" );
    return true;
}

function autoSubmitMarkedList() {
  var markForm = document.forms[ "mark_records_form" ];
  var checkboxForm = getRecordsForm();
  if ( markForm && checkboxForm && !markForm.CELNoAutoSubmit) {
      if ( isAutoSubmitAllowed(checkboxForm) )
    return mark_selected_records( checkboxForm, true );
  }
  return true;
}

function autoSubmitSelected() {
  var checkboxForm = getRecordsForm();
  if ( checkboxForm ) {
    setSelectedForForm( checkboxForm );
  }
  return autoSubmit();
}

function autoSubmitSelectedForCitedRefSearch() {
  var checkboxForm = getRecordsForm();
  //postAsyncCheckboxForm( checkboxForm.id, "auto_submit_url" );
  var targetUrl = checkboxForm.getAttribute( "auto_submit_url" );
  
  var formData = $('#'+checkboxForm.id).serializeArray();
  
  if(!formData){
     return;
  }
  var currentAllIds = $('#selectedIdsFastLane_bottom').text();

  if(typeof currentAllIds == 'undefined'){
       return;
  }
  
 
  var chunkSize = Math.ceil(currentAllIds.length/10);
  
  var splittedChunks = splitSubstring(currentAllIds, chunkSize);
  $.each(splittedChunks, function( index, value ) {
      formData[formData.length] = { name: "splittedSelectedIdsPart"+index, value: value };
  });
  
  $.ajax({type:'POST', 
			url: targetUrl, 
			data:formData, 
			async:false,
			success: function(data) {
			},
	        error: function(data){
	         }  
		});

  return true;
}

function splitSubstring(str, len) {
  var ret = [ ];
  for (var offset = 0, strLen = str.length; offset < strLen; offset += len) {
    ret.push(str.substring(offset, offset + len));
  }
  return ret;
}

function autoSubmitSelectedAndMarked() {
  return (autoSubmitSelected() && autoSubmitMarkedList());
}

function disableAutoSubmit( form ) {
    if ( ! form )
	form = getRecordsForm();

    if ( form ) {
	form.setAttribute('autoSubmitAllowed', 'false');
	if ( false ) {
	var autoFunction = getAutoSubmitFunctionName( form );
	// now, redefine the auto submit function to do nothing
	eval( autoFunction + ' = function() { return true; };' );
	}
    }
    return true;
}

function enableAutoSubmit( form ) {
    if ( ! form )
	form = getRecordsForm();

    if ( form ) {
	form.setAttribute('autoSubmitAllowed', 'true');
    }
    return true;
}

function invokeAutoSubmit( form ) {
    if ( ! form )
	form = getRecordsForm();

    if ( form ) {
	var autoFunction = getAutoSubmitFunctionName( form );
	//alert("will do autosubmit");
	
        if ( typeof(autoFunction) === 'function' )
	    return autoFunction();
    }

    return true;
}

function processPageLinks(singleLinkName) {
	if (singleLinkName==undefined){
	    var tester = function( form, link ) { return false; };
	    var form = getRecordsForm();
	    var autoFunction = getAutoSubmitFunctionName( form );
	    if ( form ) {
		//alert("will do autosubmit");
	
		var testerName = form.getAttribute("enable_auto_submit_function");
		if ( testerName != null && tester.length > 0 )
		    tester = eval(testerName);
		else
	            tester = function( form, link ) {
			var rc = true;
			if ( link.getAttribute( "no_auto_submit" ) )
			    rc = false;
			return rc;
		    };
	    }
	
	    for (var i=0;i<document.links.length;i++) {
			var link = document.links[i];
			if (link.getAttribute("hasAutoSubmit")){
				continue;
			}
			if(navigator.appName.indexOf("Microsoft Internet Explorer")>(-1)){
			    addEvent(link, "contextmenu",CTHandler(link));
			}
		
			if(navigator.appName.indexOf("Netscape")>(-1)){
			    link.setAttribute("oncontextmenu",
					      "javascript:return IsAllowedRightClick(this);");
			}
			// handle auto-submit (generically)
			if ( link.protocol != "javascript:" && link.hash == "" &&
			     tester( form, link ) ) {
			    var onclickFunc = link.onclick;
			    if ( onclickFunc == null ) { 
				link.onclick = autoFunction;
			    } 
			    else 
			    {
				    var callableOnclickFunc = eval(onclickFunc);
					link.onclick = function() {
				    var rc = callableOnclickFunc();
				    if ( rc ) {
					rc = autoFunction();
				    }
				    return rc;
				    };
			    }
			}
			link.setAttribute("hasAutoSubmit",true);
	    }
	} //end if singleLink
	else
	{
		var singleLink = document.getElementById(singleLinkName);
		if (singleLink.getAttribute("hasAutoSubmit")){
			return true;
		}
		if(navigator.appName.indexOf("Microsoft Internet Explorer")>(-1)){
		    addEvent(singleLink, "contextmenu",CTHandler(link));
		}
	
		if(navigator.appName.indexOf("Netscape")>(-1)){
			singleLink.setAttribute("oncontextmenu",
				      "javascript:return IsAllowedRightClick(this);");
		}
	
		// handle auto-submit (generically)
		if ( link.protocol != "javascript:" && link.hash == "" &&
		     tester( form, singleLink ) ) {
		    var onclickFunc = singleLink.onclick;
		    if ( onclickFunc == null ) { 
		    	singleLink.onclick = autoFunction;
		    } 
		    else 
		    {
			    var callableOnclickFunc = eval(onclickFunc);
			    singleLink.onclick = function() {
			    var rc = callableOnclickFunc();
			    if ( rc ) {
				rc = autoFunction();
			    }
			    return rc;
			    };
		    }
		}
		link.setAttribute("hasAutoSubmit",true);
	} // end else singleLink
}

function processPageInputButtons() {

    var tester = function( form, link ) { return false; };
    var form = getRecordsForm();
    var autoFunction = getAutoSubmitFunctionName( form );
    if ( form ) {
	//alert("will do autosubmit");

	var testerName = form.getAttribute("enable_auto_submit_function");
	if ( testerName != null && tester.length > 0 )
	    tester = eval(testerName);
	else
            tester = function( form, object ) {
		var rc = true;
		if ( object.getAttribute( "no_auto_submit" ) )
		    rc = false;
		return rc;
	    };
    }

	    var fIdx;
	    var i;
    for (fIdx=0;fIdx<document.forms.length;fIdx++) {
	var thisForm = document.forms[fIdx];
    for (i=0;i<thisForm.elements.length;i++) {
	var element = thisForm.elements[i];

	// handle auto-submit (generically)
	if ( element.type == "button" && tester( form, element ) ) {

	    var onclickFunc = element.onclick;
	    if ( onclickFunc == null ) { // should we handle != null???
		element.onclick = autoFunction;
		//alert(element.onclick);
	    } else {
		//debug_alert("handling element with onclick: " + element.name + "(" + element.id + "); " +onclickFunc);

	        var callableOnclickFunc = eval(onclickFunc);
		element.onclick = function() {
		    var rc = callableOnclickFunc();
		    if ( rc ) {
			rc = autoFunction();
		    }
		    return rc;
		};
	    }
	}
    }
    }
}


function displayProd(key){
	var span =  document.getElementById("editions_" + key);
	span.style.display="inline";
	var spanMore =  document.getElementById("editions_more_" + key);
	spanMore.style.display="none";
	var spanHide =  document.getElementById("editions_hide_" + key);
	spanHide.style.display="inline";
}

function undisplayProd(key){
	var span =  document.getElementById("editions_" + key);
	span.style.display="none";
	var spanMore =  document.getElementById("editions_more_" + key);
	spanMore.style.display="inline";
	var spanHide =  document.getElementById("editions_hide_" + key);
	spanHide.style.display="none";
}

// Generic handling of hide/show a span or div
function toggleDisplay(action, name){

    var style = (action == "show") ? "block" : "none";
    var span;

    try {
	span = document.getElementById(name);
	span.style.display = style;

	span = document.getElementById(name + "_hide");
	span.style.display = style;

	span = document.getElementById(name + "_show");
	/* Bug# 2945 Fix: style changes to "block" previously it is "inline". -->*/
	span.style.display = (style == "none") ? "block" : "none";
    } catch ( errMsg ) {
	alert( "toggleDisplay: failure! -- " + errMsg );
	return false;
    }
}

//Generic handling of hide/show a span or div
function toggleDisplayInline(action, name){

    var style = (action == "show") ? "inline" : "none";
    var span;

    try {
	span = document.getElementById(name);
	span.style.display = style;

	span = document.getElementById(name + "_hide");
	span.style.display = style;

	span = document.getElementById(name + "_show");
	/* Bug# 2945 Fix: style changes to "block" previously it is "inline". -->*/
	span.style.display = (style == "none") ? "inline" : "none";
    } catch ( errMsg ) {
	alert( "toggleDisplay: failure! -- " + errMsg );
	return false;
    }
}

function CTHandler(o)
{
	return function(){return IsAllowedRightClick(o);}
}

function CLHandlerRmCFRC(o)
{
	return function(){return RmCacheurlFromRightClick(o);}
}
//////////ABOVE function is used for right click /////////////////////////////////


function toggleCollapsedList(item, statusInput, formName, inputName, inputIdType, listPrefix, listSuffix) {
    var obj = document.getElementById(item);
    var status = document.getElementById(statusInput);
    var collapsedList = "";
    //alert("item: "+item);
    //alert("statusInput: "+statusInput);
    //alert("formName: "+formName);
    //alert("inputName: "+inputName);
    //alert("inputIdType: "+inputIdType);
    //alert("status.value: "+status.value);

    if (obj.style.display == "none") {
    	
	    // Get list of editions
    	var candidateForm = document.forms[formName];
    	var namedInputs = getNamedFormInputs( candidateForm, inputName );
    	//alert("namedInputs.length: "+namedInputs.length);
    	         	
    	// Get list of checked editions
    	//var selectedInputs = getCheckedFormInputs( candidateForm, inputName );
        //alert("selectedInputs.length: "+selectedInputs.length);
    	
    	// Loop thru all inputs and construct string of full names contained in hidden spans.
		  for (i=0; i<namedInputs.length; i++) {
			  
			// Only consider inputs of the ID type requested.
			  if (namedInputs[i].id == inputIdType) { 
				  
				// If NO inputs are checked, treat as if EVERY one is checked.
				  if (namedInputs[i].checked == true) {

    				  //alert("namedInputs["+i+"].value: "+namedInputs[i].value);
    				  var itemName = getMessageById(namedInputs[i].value); 
    				  //alert("itemName: "+itemName);
    				  if (collapsedList != "") {
    					  collapsedList = collapsedList + "; ";
    				  }
    				  collapsedList = collapsedList + itemName;
				  }
			  }
		  }
		  
		  // If NO inputs were checked, re-loop treating as if EVERY one is checked.
		  if (collapsedList == "") {
			  
		      // Loop thru all inputs and construct string of full names contained in hidden spans.
			  for (i=0; i<namedInputs.length; i++) {
				  
				// Only consider inputs of the ID type requested.
				  if (namedInputs[i].id == inputIdType) { 
					  
					  // If they are checkboxes, then check them all (just for clarity).
					  if (namedInputs[i].type == "checkbox") {
						  namedInputs[i].checked = true;
					  }
    				  //alert("namedInputs["+i+"].value 2: "+namedInputs[i].value);
    				  var itemName = getMessageById(namedInputs[i].value); 
    				  //alert("itemName 2: "+itemName);
    				  if (collapsedList != "") {
    					  collapsedList = collapsedList + "; ";
    				  }
    				  collapsedList = collapsedList + itemName;
				  }
			  }
		  }

		// If string isn't empty, add specified prefix and/or suffix.
    	if (collapsedList != "") {
        	if ((listPrefix != null) && (listPrefix != "")) {
        		collapsedList = listPrefix + " " + collapsedList;
        	}       
	        if ((listSuffix != null) && (listSuffix != "")) {
	        	collapsedList = collapsedList + " " + listSuffix;
	        }
        }
        
        //alert("collapsedList: "+collapsedList);
        obj.innerHTML = collapsedList;
        
        // Expand and change the image to minus sign
        obj.style.display = "inline";
        status.value = "display:inline";
    }
    else {
        // Collapse and change the image to plus sign
        obj.style.display = "none";
        status.value = "display: none";
    }   
    return true;
}


function collapseExpandItem(item, icon, statusInput, images_url) {
    var obj = document.getElementById(item);
    // The object to collapse or expand

    var image = document.getElementById(icon);
    // The plus sign or minus sign to trigger the collapse-expand

    var status = document.getElementById(statusInput);
    // The hidden field to hold the collapse-expand status for persistence

    if (obj.style.display == "none") {
        // Expand and change the image to minus sign
        obj.style.display = "block";
        image.src = images_url + "/collapse.gif";
        image.alt = document.getElementById("collapse_alt").value;
        image.title = document.getElementById("collapse_title").value;
        status.value = "display: block";
    }
    else {
        // Collapse and change the image to plus sign
        obj.style.display = "none";
        image.src = images_url + "/expand.gif";
        image.alt = document.getElementById("expand_alt").value;
        image.title = document.getElementById("expand_title").value;
        status.value = "display: none";
    }
}

function collapseExpandItemList(itemList, icon, statusInput, images_url) {
    var delimiter = ",";
    var items = itemList.split(delimiter);
    var image = document.getElementById(icon);
    // The plus sign or minus sign to trigger the collapse-expand

    var status = document.getElementById(statusInput);
    // The hidden field to hold the collapse-expand status for persistence

    if (image == null || status == null) {
        return false;
    }

    var obj = null;
    for (i=0; i<items.length; i++) {
        obj = document.getElementById(items[i]);
        // The object to collapse or expand

        if (obj == null) {
            continue;
        }

        if (obj.style.display == "none") {
            // Expand and change the image to minus sign
            obj.style.display = "";
            if (i == 0) {
                image.src = images_url + "/collapse.gif";
                image.alt = document.getElementById("collapse_alt").value;
                image.title = document.getElementById("collapse_title").value;
                status.value = "display: block";
            }
        }
        else {
            // Collpase and change the image to plus sign
            obj.style.display = "none";
            if (i == 0) {
                image.src = images_url + "/expand.gif";
                image.alt = document.getElementById("expand_alt").value;
                image.title = document.getElementById("expand_title").value;
                status.value = "display: none";
            }
        }
    }
    return true;
}

function mark_records_by_range( rangeStart, rangeEnd, validate ) {
    var markForm = document.forms["mark_records_form"];

    if(!markForm) { return false; }

    var from = markForm.elements["mark_from"];
    var to = markForm.elements["mark_to"];

    if ( !(from && to) ) { return false; }

    //we only need to validate user input. If the user selects
    //"all records on page", we don't want to validate.
    var valid = true;
    if(validate) {
        valid = check_ml_input();
    }

    if(!valid) { return false; }

    from.value = rangeStart;
    to.value = rangeEnd;
    markForm.submit();

    return false;
}

//Updated for WOKVX-8697 autosubmit code update.
function mark_selected_records( checkboxForm, isAsync ) {
  var markForm = document.forms["mark_records_form"];
  var checkedRecs = 0;
  var rc = false;

  if ( markForm ) {

      var selectedIds = markForm.elements["selectedIds"];
      
      // Fixed WOKVX-19936 for search_mode = CitedRefList
      var search_mode = $("form[name='summary_records_form'] :input[name='search_mode']").val();
      if(search_mode != null && search_mode == 'CitedRefList') {
    	  checkedRecs = setSelectedForCitedRefList( selectedIds );
      } else {
    	  checkedRecs = setSelected( selectedIds, checkboxForm );
      }

      if ( checkedRecs > 0 ) {
	  if ( isAsync ) {
	      rc = submitAsyncForm( markForm, null, handleErrorMessageDataPopUp);
	  } else
	      markForm.submit();
      } else {
          if(!isAsync) {
              var errorMessage =
		  getMessageById('quickOutputSelectAtLeastOneCheckbox');
              alert(errorMessage);
          } else
	      rc = true;

      }
  }

  return rc;
}


function setSelected(target, candidateForm, checkboxName, delimiter) {
  if ( ! delimiter || delimiter.length < 1 )
    delimiter = ";";
  if ( ! checkboxName || checkboxName.length < 1 )
    checkboxName = "marked_list_candidates";

  var result = -1;

  var targetForm = ( target != null ) ? target.form : null;

  if ( targetForm == null )
    return result;

  var formName = targetForm.getAttribute('records_form_name');

  if ( candidateForm == null ) {
      candidateForm = getRecordsForm( formName );
      if ( ! candidateForm )
		  candidateForm = targetForm;
  }
  
  var selectedValues = getCheckedFormValues( candidateForm, checkboxName );

  if ( selectedValues.length > 0 )
    target.value = selectedValues.join( delimiter );

  return selectedValues.length;
}

// Created to fix WOKVX-19936 for search_mode = CitedRefList
// To get the marked_list_candidates in a different way
function setSelectedForCitedRefList(target) {	  
	  var selectedValues = "";
	  var selectedValuesLength = 0;
	  
	  $("#records_chunks :input[name='marked_list_candidates']:checked").each(function() {
		  selectedValues += $(this).val() + ";";
		  selectedValuesLength++;
	  });
	  
	  if ( selectedValuesLength > 0 ) {
		  target.value = selectedValues;
	  }
	  
	  return selectedValuesLength;  
}

// If there are multiple inputs with the specified name, this returns all of them. (in which case "type" will be "undefined")
// If there is only one, it puts it into the first/only element of the array.
function getNamedFormInputs( form, inputName ) {

  var results = new Array();

 if (form != null && (typeof form.elements !='undefined') && form.elements[inputName] != null ) {
      var type = form.elements[inputName].type;
      switch ( type ) {
	      case "hidden":
	      case "checkbox":
	      case "radio":
			  results[0] = form.elements[inputName];
			  break;
	      default:
		  	  results = form.elements[inputName];
      }
  }

  return results;
}

function getCheckedFormInputsOrValues( form, inputName, valuesOnly ) {

    if ( valuesOnly == null )
		valuesOnly = false;

    var selected = new Array();
    var candidates = getNamedFormInputs( form, inputName );
    //alert("candidates: "+candidates);
    if ( candidates.length > 0 ) {
		for ( var i = 0; i < candidates.length; ++i ) {
			
		    if ( candidates[i].checked == true ) {

				var input = candidates[i];
				selected.push( valuesOnly ? input.value : input );
		    }
		}
    }

    return selected;
}

function getCheckedFormInputs( form, inputName ) {

    return getCheckedFormInputsOrValues( form, inputName, false );
}

function getCheckedFormValues( form, inputName ) {

    return getCheckedFormInputsOrValues( form, inputName, true );
}

/*** not needed yet
MARK_TYPE {
  SELECTED : 0,
  PAGE : 1,
  RANGE : 2,
  ALL : 3
}
***/

var RECORDS_MAX = 500000;

function getRecordsForm( formName ) {

    var candidateForm = null;
    var candidateFormJQ = null;

    if ( formName && formName.length > 0 ) {
		candidateForm = document.forms[formName];
    }
    if ( ! candidateForm ) {
    	if ( typeof(jQuery) == 'function' ) {
    		candidateFormJQ = $('form[name="records_form"]');
    		if ( !candidateFormJQ.size() ) {
    			candidateFormJQ = $('form[name="summary_records_form"]');
    			if ( !candidateFormJQ.size() ) {
					candidateFormJQ = $('form[name="full_record_form"]');
					if ( !candidateFormJQ.size() ) {
						return null;
					}
				}
			}
			candidateForm = candidateFormJQ.get(0);
    	} else {
    		candidateForm = document.getElementsByName("records_form");
    		if ( candidateForm.length === 0 ) {
    			candidateForm = document.getElementsByName("summary_records_form");
    			if ( candidateForm.length === 0 ) {
    				candidateForm = document.getElementsByName("full_record_form");
    				if ( candidateForm.length === 0 ) {
    					return null;
    				}
    			}
    		}
    	}
    }

    return candidateForm;
}

function mark_records( inputForm, markType ) {

  if ( inputForm != null ) {

      var recordsForm = getRecordsForm();
      if ( recordsForm == null )
	  	  recordsForm = inputForm;

	  // var markType = MARK_TYPE.SELECTED;
	  var option = markType;
	  if (option == null) {
		  var checked = getCheckedFormValues( inputForm, "value(record_select_type)" );
	
		  if ( checked.length > 0 ) {
		      // we expect only 1, so take first one
		      option = checked[0];
		  }
	  }
	  
      switch ( option ) {
	    case 'allrecord':
	    case 'pagerecords':
	      var inputs = getNamedFormInputs( inputForm, "marked_list_candidates" );
	      var length = inputs.length;

	      if ( length < 1 ) {

			inputs = getNamedFormInputs( recordsForm, "marked_list_candidates" );
			length = inputs.length;
	      }
	      if ( length > 0 ) {
			var start = inputs[0].value;
			var end = inputs[length - 1].value;
			mark_records_by_range( start, end, false );
	      }
	      if ( length == 0) {
			  var errorMessage = getMessageById('quickOutputSelectAtLeastOneCheckbox');
	          alert(errorMessage);
		  }
	      break;
	    case 'range':
	      var from = inputForm.elements["markFrom"];
	      var to = inputForm.elements["markTo"];
	      if ( from && to ) {
	        var fromValue = trimString( from.value );
	        var toValue = trimString( to.value );
			mark_records_by_range( fromValue, toValue, true );
	      }
	      break;
	    case 'allrecords':
	      mark_records_by_range( 1, RECORDS_MAX, false );
	      break;
            case 'pagerecordsByValue':
		var checked = checkAllByName();
		if ( checked < 1 )
		    break;
		// else fall through
	    case 'selrecord':
	    case 'selrecords':
	    default:
	      mark_selected_records( recordsForm );
    }
  }

  return false;
}

function trimString( string ) {

  if ( string.length ) {
      string = string.replace( /^\s\s*/, '' );

      var whiteSpace = /\s/;
      var i = string.length;

	  while ( whiteSpace.test(string.charAt(--i)) ) ;

      return string.slice(0, i + 1);
  }
  return "";
}

function fillTodayDateById() {
  	//populate and format the date value to be written to the field.
	var today = new Date();
	var month = new String(today.getMonth() + 1);
	var day = new String(today.getDate());
	var year = today.getFullYear();
	if (month.length == 1) {
		month = "0"+month;
	}
	if (day.length == 1) {
		day = "0"+day;
	}
  	var formattedDate = year+"-"+month+"-"+day;
  	//get the field passed to us to populate
  	var since = document.getElementById("since");
  	if (!since || since.value.length < 1 )
  		since.value = formattedDate;
}

function getMessageById( id ) {

  var message;
  var element = document.getElementById( id );

  if ( element.tagName == "input" )
    message = element.value;
  else
    message = element.innerHTML;

  return trimString( message );
}

function resetOptionsToDefaults( inputForm, checkboxName ) {

  if ( ! checkboxName || checkboxName.length < 1 ) {
    checkboxName = "fields";
  }

  var checkboxes = getNamedFormInputs( inputForm, checkboxName );
  for ( var i = 0; i < checkboxes.length; ++i ) {
    if (checkboxes[i].getAttribute("default") == "default") {
        checkboxes[i].checked = true;
    } else {
        checkboxes[i].checked = false;
    }
  }
  inputForm.elements["value(select_All)"].checked = false;
  saveForm(inputForm.id);
  return false;
}

function checkAllByName( inputForm, checkboxName ) {

  if ( ! inputForm )
      inputForm = getRecordsForm();
  if ( ! checkboxName || checkboxName.length < 1 ) {
    checkboxName = "marked_list_candidates";
  }

  var checked = 0;

  var checkboxes = getNamedFormInputs( inputForm, checkboxName );
  for ( var i = 0; i < checkboxes.length; ++i ) {
      ++checked;
      checkboxes[i].checked = true;
  }
  return checked;
}

function checkOrUncheckAllByName( inputForm, checkboxName ) {

	  if ( ! inputForm )
	      inputForm = getRecordsForm();
	  if ( ! checkboxName || checkboxName.length < 1 ) {
	    checkboxName = "marked_list_candidates";
	  }

	  var checked = 0;
	  var isChecked = inputForm.elements["select_All"].checked;
	 
	  var checkboxes = getNamedFormInputs( inputForm, checkboxName );
	  for ( var i = 0; i < checkboxes.length; ++i ) {
	      ++checked;
	      checkboxes[i].checked = isChecked;
	  }
	  return checked;
	}

function toggleCheckBoxesByName( formName, checkboxName, toggler ) {

	  var inputForm = document.forms[ formName ];
	  if ( ! inputForm )
	      inputForm = getRecordsForm();
	  if ( ! checkboxName || checkboxName.length < 1 ) {
	    checkboxName = "marked_list_candidates";
	  }

	  var checked = 0;
	  var isChecked = inputForm.elements[toggler].checked;
      //alert("checked=" + isChecked);	 
	  var checkboxes = getNamedFormInputs( inputForm, checkboxName );
	  for ( var i = 0; i < checkboxes.length; ++i ) {
	      ++checked;
	      checkboxes[i].checked = isChecked;
	  }
	  saveForm( formName );
	  return checked;
}

function toggleCheckBoxesByKeypress( formName, checkboxName, toggler ) {

	  var inputForm = document.forms[ formName ];
	  if ( ! inputForm )
	      inputForm = getRecordsForm();
	  if ( ! checkboxName || checkboxName.length < 1 ) {
	    checkboxName = "marked_list_candidates";
	  }

	  var checked = 0;
	  var isChecked = inputForm.elements[toggler].checked;
	  if(isChecked) {
		 isChecked = false;
	  }
	  else {
		  isChecked = true;
	  }
	  inputForm.elements[toggler].checked = isChecked;
    //alert("checked=" + isChecked);	 
	  var checkboxes = getNamedFormInputs( inputForm, checkboxName );
	  for ( var i = 0; i < checkboxes.length; ++i ) {
	      ++checked;
	      checkboxes[i].checked = isChecked;
	  }
	  saveForm( formName );
	  return checked;
}

// With a given id, this function will return the associated string. 
function confirmationMessage( id ) {
	var msg = null;
	if ( id ) {
		msg = getMessageById(id);
	}
	if ( msg && msg.length > 0 )
		return confirm( msg );

	return false;
}

//Changes the action of the current output form with the specified URL
//Fixed WOKVX-11287 by addind the rurl parameter to the outputform action
function changeFormActionForSaveToRID(input, url, rurl) {
	var outputForm = getOutputForm();
	if ( input && outputForm ) {

	      var inputForm = input.form;

	      if ( inputForm ) {
		  var formName = inputForm.getAttribute('input_form_name');

		  var form = document.forms[ formName ];

		  if ( form )
		      inputForm = form;
	      }

	      var foundFilters = setFilters( inputForm, outputForm );

	      outputForm.elements[ "format" ].value = input.name;

	      var recordsForm = getRecordsForm();
	      if ( recordsForm == null )
		  	  recordsForm = inputForm;

	      var option = "";
	      var checked = getCheckedFormValues( inputForm, "value(record_select_type)" );

	      if ( checked.length > 0 ) {
			  // we expect only 1, so take first one
			  option = checked[0];
	      }
	      if( option =='range') {
	    	  var valid = true;
	    	  valid = check_qo_input();
	    	    if(!valid) { return false; }

	      }
	}
	if (outputForm && url) {
		outputForm.action = url + "&rurl=" + encodeURIComponent(rurl);
	}
	return true;
}

// Asks the user to certify that the records that he/she would like to add to his/her RID
// publication list are his/her own.
function certifyPublicationsForRID() {
      var accept = confirmationMessage('quickOutputCertifyPublicationsForRID');
      return accept;
}

// Called when clicking on the "Save to ResearcherID" button
// Fixed WOKVX-11287 by adding the rurl parameter to the url 
function outputRIDRecords(form, url, rurl) {
	var outputForm = getOutputForm();
	
	if (outputForm && outputForm.colName.value == "DIIDW") {
		outputForm.mode.value = "outputServiceForSaveToRID";
	}
	
	if (url && rurl) {
		url = url + "&rurl=" + encodeURIComponent(rurl);
	}
	
	output_records(form, outputForm, url, null, certifyPublicationsForRID);
	return false;
}

function output_records_by_range( rangeStart, rangeEnd, validate, url, presubmitFunction ) {
  	var outputForm = document.forms["output_form"];

    if(!outputForm) { return false; }

    var from = outputForm.elements["mark_from"];
    var to = outputForm.elements["mark_to"];

    if ( !(from && to) ) { return false; }

    //we only need to validate user input. If the user selects
    //"all records on page", we don't want to validate.
    var valid = true;
    if(validate) {
        valid = check_qo_input();
    }

    if(!valid) { return false; }
    
    var submit = true;
	if ( presubmitFunction ) {
		submit = presubmitFunction( outputForm );
	}
	if ( submit == true ) {
		if (outputForm && url) {
			outputForm.action = url;
		}
	    from.value = rangeStart;
	    to.value = rangeEnd;
	    if ( invokeAutoSubmit() )
	        outputForm.submit();
	}
    return false;
}

function output_selected_records( checkboxForm, outputForm, url, presubmitFunction ) {

    if ( outputForm == null )
    	outputForm = document.forms[ "output_form" ];

  	var checkedRecs = 0;
  	if ( outputForm ) {
  		
	    var selectedIds = outputForm.elements["selectedIds"];
      	checkedRecs = setSelected( selectedIds, checkboxForm );

      	if ( checkedRecs > 0 ) {
      		var submit = true;
      		if ( presubmitFunction ) {
      			submit = presubmitFunction( outputForm );
      		}
      		if ( submit == true ) {
      			if (outputForm && url) {
      				outputForm.action = url;
      			}
	      		disable_auto_submit();
				outputForm.submit();
      		}
      	} else {
            var errorMessage = getMessageById('quickOutputSelectAtLeastOneCheckbox');
            alert(errorMessage);
        }
  	}
  	return false;
}

function FIELDS() { return "fields"; };

function setFilters( inputForm, outputForm, defaultToAll ) {

    var found = false;

    if ( inputForm == null )
		return found;

    if ( defaultToAll == null )
	defaultToAll = true;

    if ( outputForm == null )
		outputForm = getOutputForm();

    var filters = outputForm.elements[ "filters" ];

    if ( filters == null )
		return found;

    // look for checked checkboxes
    var numFilters = setSelected( filters, inputForm, "fields", " " );

    if ( numFilters == 0 && defaultToAll ) {
		var fields = getNamedFormInputs( inputForm, "fields" );

		if ( fields.length == 0 ) {
		    // try for selection

		    fields = getCheckedFormInputs( inputForm, "fields_selection" );   	
		    if ( fields != null && fields.length != 0) {
				found = true;
				var values = fields[0].value;

				var optName = fields[0].id + "_option";
				var options = getCheckedFormInputs( inputForm, optName );

				if ( options ) {
				    for ( var i = 0; i < options.length; ++i )
					values += " " + options[i].value;
				}
				filters.value = values;
		    }
		}
    } else
		found = true;

    return found;
}

function getOutputForm( formName ) {

    var candidateForm = null;

    if ( formName && formName.length > 0 ) {
		candidateForm = document.forms[formName];
    }
    if ( ! candidateForm ) {
		candidateForm = document.forms["output_form"];
		if ( ! candidateForm ) {
		    candidateForm = getRecordsForm();
		}
    }

    return candidateForm;
}

var MAX_OUTPUT_RECORDS = 500;

function prepareAllRecordsOnPageForOutput( inputs ) {
	var i;
	var allIds = new Array();
	for ( i = 0; i < inputs.length; i++ ) {
		allIds.push(inputs[i].value);
	}
	if(document.forms["output_form"].elements["product"].value != "DIIDW") {
	  document.forms["output_form"].elements["selectedIds"].value = allIds.join(";");
	}
	if(document.forms["output_form"].elements["totalMarked"]) {
		document.forms["output_form"].elements["totalMarked"].value = inputs.length;
	}
	if(document.forms["summary_records_form"].elements["product"].value != "DIIDW") {
	   document.forms["summary_records_form"].elements["selectedIds"].value = allIds.join(";");
	}
	if(document.forms["summary_records_form"].elements["totalMarked"]) {
	  document.forms["summary_records_form"].elements["totalMarked"].value = inputs.length;
	}
}

function output_records( input, outputForm, url, orderType, presubmitFunction ) {

  if ( outputForm == null ) {
      outputForm = getOutputForm();
  }

  if ( input && outputForm ) {

      var inputForm = input.form;

      if ( inputForm ) {
	  var formName = inputForm.getAttribute('input_form_name');

	  var form = document.forms[ formName ];

	  if ( form )
	      inputForm = form;
      }

      var foundFilters = setFilters( inputForm, outputForm );

      outputForm.elements[ "format" ].value = input.name;

      var recordsForm = getRecordsForm();
      if ( recordsForm == null )
	  	  recordsForm = inputForm;

      var option = "";
      var checked = getCheckedFormValues( inputForm, "value(record_select_type)" );

      if ( checked.length > 0 ) {
		  // we expect only 1, so take first one
		  option = checked[0];
      }
	
      //Once tests are validated for ranges and other options, disable autosubmit
      switch ( option ) {
	      case 'allrecord':
	      case 'pagerecords':
			  var checkboxName = "marked_list_candidates";
			  var inputs = getNamedFormInputs( inputForm, checkboxName );
			  var length = inputs.length;

			  if ( length < 1 ) {

			      inputs = getNamedFormInputs( recordsForm, checkboxName );
			      length = inputs.length;
			      prepareAllRecordsOnPageForOutput(inputs);
			  }
			  if ( length > 0 ) {
			      var start = inputs[0].value;
			      var end = inputs[length - 1].value;
			      prepareAllRecordsOnPageForOutput(inputs);
				  output_records_by_range( start, end, false, url, presubmitFunction );
			  }
			  if ( length == 0) {
				  var errorMessage = getMessageById('quickOutputSelectAtLeastOneCheckbox');
		          alert(errorMessage);
		          do_output = false;
			  }
			  break;
	      case 'range':
			  var from = inputForm.elements["markFrom"];
			  var to = inputForm.elements["markTo"];
			  var fromValueString;
			  var toValueString;
			  var eids_max_recs_limit = EIDS_MAX_RECORDS;
			  if ( from && to ) {
				  fromValueString = trimString( from.value );
				  toValueString = trimString( to.value );
				  var numRecs = parseInt(toValueString) - parseInt(fromValueString) + 1;
				  if ( (numRecs > eids_max_recs_limit ) && (orderType == 'EIDS') )	{
				    	allrecs_morethan_maxrec_eids_notice =  getMessageById("ml_eids_morethan_maxrec_output_notice");
				        alert(allrecs_morethan_maxrec_eids_notice);        
				    }
				  else {
					  output_records_by_range( fromValueString, toValueString, true, url, presubmitFunction );
				  }
			  }
			  
			  break;
		  case 'allrecords':
			    var current_num_ml_recs = CURRENT_NUM_MARKED_LIST_RECORDS;
		        var qo_max_record_limit = QUICK_OUTPUT_MAX_RECORDS;
		        var eids_max_recs_limit = EIDS_MAX_RECORDS;
		        
		        var do_output = true;
			    if ( current_num_ml_recs > qo_max_record_limit) {
			        allrecs_morethan_maxrec_output_notice =  getMessageById("ml_allrecs_morethan_maxrec_output_notice");
			        //do_output = confirm(allrecs_morethan_maxrec_output_notice);
			        alert(allrecs_morethan_maxrec_output_notice);
					do_output = true;
			    }
			    
			    if ( (current_num_ml_recs > eids_max_recs_limit ) && (orderType == 'EIDS') )	{
			    	allrecs_morethan_maxrec_eids_notice =  getMessageById("ml_eids_morethan_maxrec_output_notice");
			        alert(allrecs_morethan_maxrec_eids_notice);
			        do_output = false;
			    }
			    
			    if (do_output) {
			    	if (current_num_ml_recs > MAX_OUTPUT_RECORDS) {
			    		output_records_by_range( 1, MAX_OUTPUT_RECORDS, false, url, presubmitFunction );
			    	}
			    	else {
			    		output_records_by_range( 1, current_num_ml_recs, false, url, presubmitFunction );
			    	}
	        	}
			  break;
              case 'pagerecordsByValue':
		  var checked = checkAllByName();
		  if ( checked < 1 )
		      break;
		  // else fall through
	      case 'selrecord':
	      case 'selrecords':
	      default:
			  output_selected_records( recordsForm, outputForm, url, presubmitFunction );
      }
  }
  return false;
}

//Added below two functions for bug fix: 1010.

function quick_summary_output(output_form)
{
	if (document.output_form.fields_selection[0].checked == true) {
		document.output_form.fullrec_fields_option.checked = false;

	} else if (document.output_form.fields_selection[1].checked == true) {
		document.output_form.bib_fields_option.checked = false;
	}
}

function quick_fullrecord_output(records_form)
{
	if (document.records_form.fields_selection[0].checked == true) {
		document.records_form.fullrec_fields_option.checked = false;

	} else if (document.records_form.fields_selection[1].checked == true) {
		document.records_form.bib_fields_option.checked = false;
	}
}

function isEnterEvent( objevent ) {

  if (! objevent)
      objevent = event;

  var charcode = objevent.which;
  if (! charcode)
      charcode = objevent.keyCode;

  var is_safari = navigator.userAgent.indexOf('Safari')>0;
  if (is_safari && charcode == 3)
      charcode = 13;

      return (charcode == 13);
}

function setSelectedForForm( form ) {
  var rc = true;
  if ( form ) {
    var selectedIds = form.elements['selectedIds'];
    var target = 'isickref';
    var numSet = setSelected( selectedIds, form, target );
  }
  return true;
}

function saveFormPreferences( form ) {

  if ( form ) {
      return submitAsyncForm( form, "savePreferencesUrl" );
  }
  return false;
}

function saveMarkedListPreferences( form ) {
  var rc = false;
  if ( ! form )
      form = getOutputForm();

  if ( setFilters( form, null, false ) ) {
      rc = saveFormPreferences( form );
      if (rc = 'true') {
        var input =  document.getElementById('savedMLPreferences').style.display = "inline";
      }
      
  }
  return rc;
}
function saveOneSettingPreference(formName, fieldName) {
   var form = getRecordsForm( formName );
   var url = form.getAttribute("savePreferencesUrl");
   var saveField = document.getElementById(fieldName);
   var newSaveField = document.getElementById(fieldName).cloneNode(true);
   newSaveField.value = saveField.value;
   var newForm = form.cloneNode(false);
   newForm.setAttribute("savePreferencesUrl", url);
   newForm.appendChild(newSaveField);
   var sid = form.elements["SID"].cloneNode(true);
   newForm.appendChild(sid);
   var product = form.elements['product'].cloneNode(true);
   newForm.appendChild(product);
   
  var sdhaHandler = function(data) { document.write( data ); };
   var rc = true;

  try {
    dojo.io.bind({
      url: url,
      encoding: "utf8",
      sync: true,
      formNode: newForm,
      mimetype: "text/plain",
       load: function(type, data, evt) { },
    mimetype: "text/plain"
  });
  }  catch (e)  {
    return false;
  }
  
   return true;
}

function setOtherPageSelectedRecCount( totalSelected, checkboxName, formName ) {
    var count;

    var input = document.getElementById( "selectedRecs" );
    if ( input ) {
	if ( totalSelected == null )
	    count = 0;
	else {
	    if ( ! checkboxName )
		checkboxName = "isickref";

	    var form = getRecordsForm( formName );
	    var checked = getCheckedFormValues( form, checkboxName );

	    count = totalSelected - checked.length;
	}
	input.value = count;
    }

    return count;
}

function getSearchInputForm( formName ) {

    var candidateForm = null;

    if ( formName && formName.length > 0 ) {
	candidateForm = document.forms[formName];
    }
    if ( ! candidateForm ) {
	if ( jQuery ) { 
	    var formSelector = $('.searchInputForm');
	    if ( formSelector )
		candidateForm = formSelector[0];
	}
	if ( ! candidateForm )
	    candidateForm = document.forms[0];
    }
    return candidateForm;
}

    
function numberMatch() {
	
	var re = new RegExp("\\w-\\d{4}-\\d{4}");
    var textValue = document.getElementById('value(input3)').value;
    /*check entered value is Empty if not then check for expression match
      if expression match fails display expression match error message
    */
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('author.search.error.fullName').style.display = 'none';
    document.getElementById('author.search.invalidQuery').style.display = 'none';
    
    if (textValue == null || textValue.length == 0) {
    	if (document.getElementById('errorMessage').style.display == 'none') {                       
    		document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('author.search.reasearchId.validation').style.display = 'block';
        }
    } else if (textValue.match(re)) {
    	document.getElementById('RID').value = textValue;
    	document.getElementById('WOS_AuthorSearch_input_form').submit();
    } else {
    	if (document.getElementById('errorMessage').style.display == 'none') {
    		document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('author.search.reasearchIdFormat').style.display = 'block';
        }
    }              
}

function validateAuthorName() {

	var authorName = null;

	var firstInitialRegEx = new RegExp("[@%&*#!$\\d]");
	var lastNameRegEx1 = new RegExp("[@%&#!\\d]");
	var lastNameRegEx2 = new RegExp("\\*[a-zA-Z]?");
	var lastNameRegEx3 = new RegExp("\\$[a-zA-Z]?");
	
	var lastName = document.getElementById('value(input1)').value;
    var firstInitial = document.getElementById('value(input2)').value;
    var exactMatch = document.getElementById('exactMatch').checked;
	
	document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('author.search.reasearchIdFormat').style.display = 'none';
    document.getElementById('author.search.reasearchId.validation').style.display = 'none';
    if (lastName == null || lastName.length == 0) {
    	document.getElementById('author.search.invalidQuery').style.display = 'none';
    	document.getElementById('errorMessage').style.display = 'block';
    	document.getElementById('author.search.error.fullName').style.display = 'block';
    	checkForErrorSpans();
    } else if ( firstInitial == null || firstInitial.length == 0 || firstInitial == ' ') {
    	document.getElementById('author.search.invalidQuery').style.display = 'none';
    	document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('author.search.error.fullName').style.display = 'block';
		checkForErrorSpans();
    } else if ( firstInitial.match(firstInitialRegEx) ) {
    	document.getElementById('author.search.error.fullName').style.display = 'none';
    	document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('author.search.invalidQuery').style.display = 'block';
		checkForErrorSpans();
    } else if ( lastName.match(lastNameRegEx1)) {
    	document.getElementById('author.search.error.fullName').style.display = 'none';
    	document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('author.search.invalidQuery').style.display = 'block';
		checkForErrorSpans();
    } else if ( lastName.match(lastNameRegEx2) && exactMatch == true) {
    	document.getElementById('author.search.error.fullName').style.display = 'none';
    	document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('author.search.invalidQuery').style.display = 'block';
		checkForErrorSpans();
    } else if ( lastName.match(lastNameRegEx3) && exactMatch == true) {
    	document.getElementById('author.search.error.fullName').style.display = 'none';
    	document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('author.search.invalidQuery').style.display = 'block';
		checkForErrorSpans();
    } else {   
    	authorName = lastName+" "+firstInitial;
        // Surround term with single quotes if term == boolean operators 'and' or 'or'. 
    	if (lastName.toUpperCase() == 'OR' || lastName.toUpperCase() == 'AND' || lastName.toUpperCase() == 'NOT' || lastName.toUpperCase() == 'SAME' ) {
        	authorName = "\""+authorName+"\"";
        } 
        	
        document.getElementById('authorName').value = authorName;
        document.getElementById('WOS_AuthorSearch_input_form').submit();
		checkForErrorSpans();
    }
}

function clearAuthorSearchFields(pType) {
	document.getElementById('value(input1)').value="";
	document.getElementById('value(input2)').value="";
	checkForErrorSpans();
	saveForm('WOS_AuthorSearch_input_form');
}

function checkForErrorSpans() {

	if (document.getElementById('searchErrorMessage')!= null && document.getElementById('searchErrorMessage').style.display == "") {
		document.getElementById('searchErrorMessage').style.display = 'none';
    } else if (document.getElementById('searchErrorMessageDiv')!= null && document.getElementById('searchErrorMessageDiv').style.display == "") {
    		document.getElementById('searchErrorMessageDiv').style.display = 'none';
    } else if (document.getElementById('noRecordsDiv')!= null && document.getElementById('noRecordsDiv').style.display == "") {
    		document.getElementById('noRecordsDiv').style.display = 'none';
    } else {
    	
    }
}

function check_author_variant_inputs(form) {

	var i;
	var hasInput = false;
	
	var authorVariantSelectionElements = document.getElementsByName('radiobutton');
	if (authorVariantSelectionElements != null) {
		for (i = 0; i < authorVariantSelectionElements.length; i++) {
			var authorVariantSelectionElement = authorVariantSelectionElements[i];
			if (authorVariantSelectionElement.checked) {
				hasInput = true;
				break;
			}
		}
	}
	
	if (!hasInput) {
		var errorMessage = document.getElementById('refineSelectAtLeastOneRadioButton').value;
		alert(errorMessage);
	}

	return hasInput;
}

function setAuthorVariantName(radioObj){
	
	var radioLength = radioObj.length;
	if (typeof radioLength == 'undefined') {
		document.forms['author_variant_more_form'].authorName.value = radioObj.value;
		return radioObj.value;
	}
	
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			document.forms['author_variant_more_form'].authorName.value = radioObj[i].value;
			return radioObj[i].value;
		}
	}
	return "";
}

function authorEnterFunction(event) {
	if (event && event.keyCode == 13) {
		validateAuthorName();
		
	} else {
		return false; 
	}		  
}

/*--------------- For wos-chem numerical fields ---------------*/
function toggleInputDisplay(item1, item2, operatorInput) {
    var obj1 = document.getElementById(item1);
    var obj2 = document.getElementById(item2);
    
    if(operatorInput == "between"){
    	obj1.style.display = 'inline';
    	obj2.style.display = 'inline';
    }
    else{
    	obj1.value = '';
    	obj1.style.display = 'none';
    	obj2.style.display = 'none';
    }	
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 58 && charCode > 44 && charCode != 47))
       return true;
    else if (charCode == 8)return true;

    return false;
}
/*--------------- For wos-chem numerical fields ---------------*/



function check_email(form) {
	
		
	var email_to = $('#' + form.id + ' input[name="emailAddress"]').val();
	
	var re = /^([a-zA-Z0-9])+([\.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+$/;
	var emailTos = new String(email_to);
	var emailTo = emailTos.split(';');
	if(emailTo.length == 1 ) {
		emailTo = emailTos.split(',');
	}

	
	var toEbox = document.getElementById('emailAddress_error');
	toEbox.style.display = 'none';
	
	for(i=0; i < emailTo.length; i++) {

		emailTo[i] = emailTo[i].replace(/\s/g, "");
          
		if (!emailTo[i].match(re) ||(emailTo[i].length ==0 && i ==0)) {
			toEbox.style.display = 'block';
			return false;
		} 
	}
	var str = emailTo.join(",");
	form.emailAddress.value = str;
	
	return true;	
}

function swapCheckboxLabel(checkboxvar, labelId, uncheckedText, checkedText) {
	//Swaps the text on a label associated with a checkbox
	//Used to make dynamic labels for JAWS
	//To call this include the following in the checkbox:
	//onclick="swapCheckboxLabel(this, 'labelId', 'uncheckedText', 'checkedText');"
	var labelvar = document.getElementById(labelId);
	if(!checkboxvar.checked) {
		labelvar.innerHTML = uncheckedText;
	}
	else {
		labelvar.innerHTML = checkedText;
	}
}

function updateResultOptions( name, value ) {

    var id = 'value(' + name + ')';

    var form = $('.autoSaveForm');

    var selector = $(form).find('input[name="' + id + '"]');

    if ( selector ) {
        selector[0].value = value;

        saveForm(form.attr('name'));
    }

    return true;
}

function updateResultContentOption( selectObj ) {

    if ( selectObj ) {
	var index = selectObj.selectedIndex;
        var opt = selectObj.options[index];
	var value = opt.getAttribute("id");

        if ( ! value ) {
	    value = opt.value;
        }

	updateResultOptions('contentType', value);
    }
}

function prepareSQCDropDownMenu() {
	var width = $("#sqcDropDownMenuTitleLink" ).width();

	$("#sqcDropDownMenuTitleLink")
	.hover(function() {
		$(this).addClass("sqcDropDownMenuLink");
		$("#sqcDropDownMenuTitleLink #sqcMenuArrow").hide();
		$("#sqcDropDownMenuTitleLink #sqcMenuArrowHover").show();
		var menu = $("#sqcDropDownMenuItems")
			.show()
			.position({my: "left top", at: "left bottom", of: this});
		$(document).one("click", function() {
			menu.hide();
		});		
		return false;
	},function(e) {
		$(this).removeClass("sqcDropDownMenuLink");
		$("#sqcDropDownMenuTitleLink #sqcMenuArrowHover").hide();
		$("#sqcDropDownMenuTitleLink #sqcMenuArrow").show();
	
		if(e.pageX < $("#sqcDropDownMenuItems").position().left 
			|| e.pageX > $("#sqcDropDownMenuItems").position().left + $("#sqcDropDownMenuItems").width()
			|| e.pageY < $("#sqcDropDownMenuTitleLink").position().top 
			|| e.pageY > $("#sqcDropDownMenuItems").position().top + $("#sqcDropDownMenuItems").height() ) {
			$("#sqcDropDownMenuItems").hide();
		}
		return false;
	});
	
	$("#sqcDropDownMenuTitleLink")
	.focus(function() {
		$(this).addClass("sqcDropDownMenuLink");
		$("#sqcDropDownMenuTitleLink #sqcMenuArrow").hide();
		$("#sqcDropDownMenuTitleLink #sqcMenuArrowHover").show();
		var menu = $("#sqcDropDownMenuItems")
			.show()
			.position({my: "left top", at: "left bottom", of: this});
		$(document).one("click", function() {
			menu.hide();
		});		
		return false;
	}).focusout(function(e) {
		$(this).removeClass("sqcDropDownMenuLink");
		$("#sqcDropDownMenuTitleLink #sqcMenuArrowHover").hide();
		$("#sqcDropDownMenuTitleLink #sqcMenuArrow").show();		
		$(".sqcDropDownMenuItem").first().find("a").focus();
		return false;
	});
	
	$(".sqcDropDownMenuItem")
	.focus(function() {
		$(this).find("a").addClass("sqcDropDownMenuItemHover");
	}).focusout(function(e) {
		$(this).find("a").removeClass("sqcDropDownMenuItemHover");
		var next = $(this).next();
		if(next.attr("class") == $(this).attr("class")) {
			next.find("a").focus();
		} else {
			$("#sqcDropDownMenuItems").hide();
		}
	});
		
	$("#sqcDropDownMenuItems")
		.menu()
		.width(width)
		.mouseleave(function() {
			$("#sqcDropDownMenuItems").hide();
		});
				
	$("#sqcDropDownMenuItems li a").click(function() {
		var href = $(this).attr('href');
		$(location).attr('href', href);
	});	
	
}

function hideLinksDropdown( event ) {
    var $target = $(event.target);
    if (!event.target) {
	$target = event.srcElement;
    }
    
    $('.popup-full-text').hide();

    if ( $target.is('.button-ft') ) {
	if ( $target.is('.button-active') ) {
	    $target.removeClass('button-active');
	} else {
	    $target.addClass('button-active');
	    
	    var name = $target.attr('name');
	    var $menu = $('#'+name+'_menu');
	    $menu.show();
	}
    } else {
	$('.button-ft').removeClass('button-active');
    }
}

function initHideShow( id, isActivated ) {
    if ( id ) {
	var prefix = '.' + id;
	var showClass = ( isActivated ) ? ( prefix + 'On' ) : ( prefix + 'Off' );
	var hideClass = ( isActivated ) ? ( prefix + 'Off' ) : ( prefix + 'On' );
	
	$(hideClass).hide();
	$(showClass).show();
    }
}

function toggleOnOff( id ) {
    if ( id ) {
	var prefix = '.' + id;
	
	$(prefix + 'On').toggle();
	$(prefix + 'Off').toggle();
    }
}
//this global variable will be used for journal overlay and ESI badge overlay
var globalDialog = null;

function open_journal_overlay( overlaySpan, linkSpan ) {
    if ( overlaySpan && linkSpan ) {
    	var opt = {
    	    autoOpen: false,
    	    closeOnEscape: true,
    	    modal: false,
    	    closeText: 'close',
    	    resizable: false,
    	    close: function() {
    	        $(this).dialog('destroy');
    	        globalDialog = null;
    	    },
    	    dialogClass: 'ui-dialog-quickoutput journal-overlay',
    	    position: {of: $( '#' + linkSpan), my: 'left top', at: 'left bottom'}
    	};
	    if(globalDialog!=null){
            //if there is overlay is opened at this moment, we will close that one at first	    	
	    	$(globalDialog).dialog('close');
	    	globalDialog = null;
	    }
    	var theDialog = $('#' + overlaySpan).dialog(opt);
    	theDialog.dialog("open");
        globalDialog = theDialog;
    	return true;
    }
    else {
    	return false;
    }
}


function open_esi_badge_overlay( overlaySpan, linkSpan ) {	
    if ( overlaySpan && linkSpan ) {
    	var opt = {
    	    autoOpen: false,
    	    closeOnEscape: true,
    	    modal: false,
            resizable: false,
            draggable: false,
    	    closeText: 'close',
    	    close: function() {
    	        $(this).dialog('destroy');
    	        globalDialog = null;
    	    },
    	    dialogClass: 'ui-dialog-quickoutput journal-overlay esi-badge-overlay',
    	    position: {of: $( '#' + linkSpan), my: 'right top', at: 'left bottom'}
    	};
	    if(globalDialog!=null){
            //if there is overlay is opened at this moment, we will close that one at first
	    	$(globalDialog).dialog('close');
	    	globalDialog = null;
	    }    	
    	var theDialog = $('#' + overlaySpan).dialog(opt);
    	theDialog.dialog("open");
        globalDialog = theDialog;
    	return true;
    }
    else {
    	return false;
    }
}

function close_journal_overlay(thiscontext, overlaySpan) {
    try {
        $('#' + overlaySpan).dialog('close');
	    return true;    
    } catch (e) {
    	//alert("in catch");
        $(thiscontext).parents('#' + overlaySpan).dialog('close');
    	return false;
    }
}
function close_SML_overlay(thiscontext, overlaySpan) {
    try {
    	$(thiscontext).closest('.ui-dialog-content').dialog('close'); 
	    return true;    
    } catch (e) {
    	//alert("in catch");
        $(thiscontext).parents('#' + overlaySpan).dialog('close');
    	return false;
    }
}
function close_SML_error_overlay(thiscontext, overlaySpan) {
    try {
        $(thiscontext).dialog('close');
	    return true;    
    } catch (e) {
    	//alert("in catch");
        $(thiscontext).parents('#' + overlaySpan).dialog('close');
    	return false;
    }
}
function save_markedlist(smlurl){
	if(isMLFormValid() == true) {
		reload = false;
		if(!isMLReachLimit()) {
			if(isListNameDuplicate(smlurl)) {
				$("#saveToMLDialog").dialog("close");
				var msg = $("#smlDuplicateMessage").val();
				$("#smlDuplicateDialogText").text("'" + $('#MarkedListName').val() + "' " + msg);
				$("#saveToMLDuplicateDialog").dialog( "open" );
				
			}
			else {
				savedLists(smlurl);
			}
		}
		else {
			$("#saveToMLDialog").dialog("close");
			$("#saveToMLLimitDialog").dialog("open");
		}
	}	
}

function isMLReachLimit() {
	var maxMarkedList =  $("#maxMarkedList").val();
	var currentMLCount = $("#currentMLCount").val();
	if(maxMarkedList == currentMLCount) {
		return true;
	}

	return false;
}

function isListNameDuplicate(smlurl) {
	smlurl = smlurl + "&action=saveUniqueList&product=UA";
	var duplicate = false;
	 $.ajax({type:'POST', 
			url: smlurl,
			data: { listName: $('#MarkedListName').val() }, 
			async:false,
			success: function(data) {
				if(data == 'DUPLICATE') {
					duplicate = true;
				}
			},
	        error: function(data){
	        	$("#saveToMLDialog").dialog( "close" );
				 $("#saveToMLErrorDialog").dialog( "open" );
	         }  
		});	
	   return duplicate;
}

function savedLists(smlurl) {
	smlurl = smlurl + "&action=saveList&product=UA";
	var args = { listName: $('#MarkedListName').val() };
	if($("#listDescription").val().length != 0) {
		args['desc'] = $('#listDescription').val();
	}
	 $.ajax({type:'POST', 
			url: smlurl,
		        data: args,
			async:false,
			success: function(data) {
				$("#saveToMLDialog").dialog( "close" );
				$("#saveToMLDuplicateDialog").dialog("close");
				if(data == 'OK') {
				 $("#saveToMLDoneDialog").dialog( "open" );
				}
				else {
					$("#saveToMLErrorDialog").dialog( "open" );
				}
	         
			},
	        error: function(data){
	        	$("#saveToMLDialog").dialog( "close" );
				 $("#saveToMLErrorDialog").dialog( "open" );
	         }  
		});	
	
}
function isMLFormValid() {
	
	if($('#MarkedListName').val().length == 0) {
		$('#SMLnameEmpty').css("visibility", "visible");
		return false;
	}

	return true;
}

function MLDetection() {

	$("#mlFirstUse").dialog( "open" );


	$('#hasMLPopUpShown').val(true);
	
	saveForm('UA_options_input_form');
	
};

function openMarkedListOverlay(listName, possibleCount, index) {
	

	$("input.replaceButton").click(function(){
		submitAndRetrieveSml(index, "&replace=true");
	});
	if (possibleCount > 5000) {
		$(".replaceAddSpan").css("display", "none");
		$("input.replaceAddButton").html("");
		$(".replaceRecordsOrAdd").html("");
	}
	else {
		$("input.replaceAddButton").click(function(){
			submitAndRetrieveSml(index, "&replace=false");
		});
		$(".replaceRecords").html("");
	}
	
	$("#mlOpen").dialog( "open" );
};

function browserDetection() {
    var popupStatus = $('#hasBrowserPopUpShown').val();

    if (navigator.appName.indexOf("Internet Explorer") > -1) {
        if (navigator.appVersion.indexOf("MSIE 9") > -1 || navigator.appVersion.indexOf("MSIE 8") > -1 ) {
            if (location.protocol !== "https:") {
		var protocol = "https://";
	        var host = $('#applicationHostString').html();
		if ( host.length == 0 )
	            host = location.host;
		var path = location.pathname;
	 	var query = location.search;
		var destination = protocol + host + path + query;
                location.replace(destination);
	    }
        }
    }

    if (popupStatus != 'true')    {
    	
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName  = navigator.appName;
        var fullVersion  = ''+parseFloat(navigator.appVersion); 
        var majorVersion = parseInt(navigator.appVersion,10);
        var nameOffset,verOffset,ix;
        var operatingSystem, winVersion;
        var popUpMessage;

        /* In Opera, the true version is after "Opera" or after "Version" */
        if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
         browserName = "Opera";
         fullVersion = nAgt.substring(verOffset+6);
         if ((verOffset=nAgt.indexOf("Version"))!=-1) 
           fullVersion = nAgt.substring(verOffset+8);
        }
        /* In MSIE, the true version is after "MSIE" in userAgent */
        else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
         browserName = "Internet Explorer";
         fullVersion = nAgt.substring(verOffset+5);
        }
        /* In Chrome, the true version is after "Chrome" */
        else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
         browserName = "Chrome";
         fullVersion = nAgt.substring(verOffset+7);
        }
        /* In Safari, the true version is after "Safari" or after "Version"  */
        else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
         browserName = "Safari";
         fullVersion = nAgt.substring(verOffset+7);
         if ((verOffset=nAgt.indexOf("Version"))!=-1) 
           fullVersion = nAgt.substring(verOffset+8);
        }
        /* In Firefox, the true version is after "Firefox" */
        else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
         browserName = "Firefox";
         fullVersion = nAgt.substring(verOffset+8);
        }
        /* In most other browsers, "name/version" is at the end of userAgent -*/
        else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) 
        {
         browserName = nAgt.substring(nameOffset,verOffset);
         fullVersion = nAgt.substring(verOffset+1);
         if (browserName.toLowerCase()==browserName.toUpperCase()) {
          browserName = navigator.appName;
         }
        }
        
        majorVersion = parseInt(''+fullVersion,10);
        if (isNaN(majorVersion)) {
         fullVersion  = ''+parseFloat(navigator.appVersion); 
         majorVersion = parseInt(navigator.appVersion,10);
        }

        if (/Windows/.test(nAgt)) {
        	operatingSystem = "Windows";
        	if (/Windows NT 5.1|Windows XP/.test(nAgt)) {
        		winVersion = "XP";
        	} else if (/Windows NT 5.2/.test(nAgt)) {
	        	winVersion = "Server 2003";
	        } else if (/Windows NT 6.0/.test(nAgt)) {
	        	winVersion = "Vista";
	        } else if (/Windows NT 6.1/.test(nAgt)) {
	        	winVersion = "7";
	        } else if (/Windows NT 6.2/.test(nAgt)) {
	        	winVersion = "8";
	        }

        } else if (/Mac_PowerPC|Macintosh/.test(nAgt)) {
        	operatingSystem = "Mac";
        	
        } else if (/Linux|X11/.test(nAgt)) {
        	operatingSystem = "Linux";
        	
        } else if (/SunOS/.test(nAgt)) {
        	operatingSystem = "SunOS";
    	
        } else {
        	operatingSystem = "other";
        }
        
        //browserName = "Internet Explorer";
        //majorVersion = 8;
        //winVersion = "XP";
        
        //alert ("operatingSystem: "+operatingSystem+"    winVersion: "+winVersion);
        //alert ("browserName: "+browserName+"    majorVersion: "+majorVersion+"   fullVersion: "+fullVersion);

           
        if (browserName === "Firefox") {
            if (majorVersion <= 19)	{
            	popUpMessage = $('#browserMessage').val();
    		}
    	} else if (browserName === "Internet Explorer") {
    		if (majorVersion <= 7)	{
    	    	popUpMessage = $('#browserMessageIE').val();
    		}
    	} else if (browserName === "Chrome") {
    	    if (majorVersion <= 24)	{
    	    	popUpMessage = $('#browserMessage').val();
    		}
    	} else if (browserName === "Safari") {
    	    if (majorVersion <= 5)	{
    	    	popUpMessage = $('#browserMessage').val();
    		}
    	}  
        
        if (popUpMessage != null && !(/\?\?\?/.test(popUpMessage))) {
        	popUpMessage = popUpMessage.replace("BROWSERNAME", browserName);
        	popUpMessage = popUpMessage.replace("MAJORVERSION", majorVersion);
        	popUpMessage = popUpMessage.replace("OSVERSION", operatingSystem);
        	popUpMessage = popUpMessage.replace("WINVERSION", winVersion);
        	popUpMessage = popUpMessage.replace("+", "\n");
            alert(popUpMessage);
        }
        popupStatus = 'true'; 
        $('#hasBrowserPopUpShown').val(popupStatus);
        saveForm('UA_options_input_form');
    }
};

var Email = {
	isValid: function (address) {
		var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(address);
	}
};

/*--------------- this should always be last in the script ---------------*/
addEvent(window, "load", function(){
	processPageLinks();
	    //	processPageInputButtons();
    });
	
function proxyAddToPubList_submit(){
    var form = document.forms["ProxyClaimForm"];
    var error_msg = document.getElementById('no.radio.button.selected');
    var Radios = getNamedFormInputs(form, 'rid_steamID');
    var len = Radios.length;
    if (typeof len == 'undefined') {
        len = 1;
    }
    var atleastOneRadioChecked = false;
    for(i = 0; i < len; i++) {
        if(Radios[i].checked == true) {
        	atleastOneRadioChecked = true;
        }
    }
    
    if (atleastOneRadioChecked) {
    	form.submit;
    }
    else {
    		alert(error_msg.value);
    		return false;
    }
    return true;
}


function paintGenericESILinkInOverlay(id){
    var currentESILink = $('#HS_ESILink').attr("onclick");
	//alert("shang:paintGenericESILinkInOverlay2:"+currentESILink);
    var esilink = "";
    	                                
    if($( '#'+id ).length != 0){
    	if(id.indexOf("esi_hp_overlay_generic_") != -1)
	      esilink = currentESILink.replace("OutboundService.do?", "OutboundService.do?esitype=esi_hot&");
    	else 
	      esilink = currentESILink.replace("OutboundService.do?", "OutboundService.do?esitype=esi_highlycited&");
    	//alert("shang:paintGenericESILinkInOverlay3:copy....");
    	$( '#'+id ).attr("onclick",esilink );
    	//$( '#'+id ).attr("onclick",currentESILink );
    }
}

function formatESIBadgeLink(id){
    if($( '#'+id ).length != 0){
        $('#'+id).hover(function(){
            $('#'+id).css("cursor","pointer");
            $('#'+id).css("text-decoration","underline");	        	                            
                },function(){
                    $('#'+id).css("text-decoration","none");
                });
    }
}



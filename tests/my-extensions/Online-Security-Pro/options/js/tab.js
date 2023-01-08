var maxItems = 10;
var currentPosition = 0;
var exclusionCurrentPosition = 0;
var mainItems = [];
var mainExclsionItems = [];
var paginationContent = $('#paginationContent');
var exclusionsPaginationContent = $('#exclusionsPaginationContent');
var urlMenuContent = $('#url_menu_content');
var exclusionMenuContent = $('#exclusion_menu_content');
var tableContent = $("#content_table");
var exclusionTableContent = $("#exclusion_content_table");
var tableBody = $("#content_table_body");
var exclusionTableBody = $("#exclusion_content_table_body");
var rootData = [];
var exclusionRootData = [];
var APP_VERSION;

var optionsUrlShowingpage = chrome.i18n.getMessage("options_url_showingpage");
var optionsExclusionsShowingpage = chrome.i18n.getMessage("options_exclusions_showingpage");

var optionsTitle = chrome.i18n.getMessage("options_header");
document.title = optionsTitle;

$( document ).ready(function() {
	var optionsHeader = chrome.i18n.getMessage("options_header");
	$("#options_header").text(optionsHeader);
	
	var optionsTitleUrl = chrome.i18n.getMessage("options_title_url");
	$("#options_title_url").text(optionsTitleUrl);
	
	var optionsTitleExclusions = chrome.i18n.getMessage("options_title_exclusions");
	$("#options_title_exclusions").text(optionsTitleExclusions);
	
	var optionsTabTitleUrl = chrome.i18n.getMessage("options_tab_title_url");
	$("#options_tab_title_url").text(optionsTabTitleUrl);
	
	var optionsUrlRemoveselected = chrome.i18n.getMessage("options_url_removeselected");
	$("#removeSelected").text(optionsUrlRemoveselected);
	
	var optionsUrlRemoveall = chrome.i18n.getMessage("options_url_removeall");
	$("#removeAll").text(optionsUrlRemoveall);
	
	var optionsUrlPlaceholder = chrome.i18n.getMessage("options_url_placeholder");
	$("#SearchField").attr('placeholder',optionsUrlPlaceholder);
	
	var optionsUrlSearch = chrome.i18n.getMessage("options_url_search");
	$("#searchUrl").text(optionsUrlSearch);
	
	var optionsUrlType = chrome.i18n.getMessage("options_url_type");
	$("#options_url_type").text(optionsUrlType);
	
	var optionsUrlTime = chrome.i18n.getMessage("options_url_time");
	$("#options_url_time").text(optionsUrlTime);
	
	var optionsUrlUrl = chrome.i18n.getMessage("options_url_url");
	$("#options_url_url").text(optionsUrlUrl);
	
	var optionsUrlAction = chrome.i18n.getMessage("options_url_action");
	$("#options_url_action").text(optionsUrlAction);
	
	var optionsTabTitleExclusions = chrome.i18n.getMessage("options_tab_title_exclusions");
	$("#options_tab_title_exclusions").text(optionsTabTitleExclusions);
	
	var optionsExclusionsRemoveselected = chrome.i18n.getMessage("options_exclusions_removeselected");
	$("#removeSelectedExclusion").text(optionsExclusionsRemoveselected);
	
	var optionsExclusionsRemoveall = chrome.i18n.getMessage("options_exclusions_removeall");
	$("#removeAllExclusions").text(optionsExclusionsRemoveall);
	
	var optionsExclusionsPlaceholder = chrome.i18n.getMessage("options_exclusions_placeholder");
	$("#exclusionSearchField").attr('placeholder',optionsExclusionsPlaceholder);
	
	var optionsExclusionsSearch = chrome.i18n.getMessage("options_exclusions_search");
	$("#searchExclusion").text(optionsExclusionsSearch);
	
	var optionsExclusionsType = chrome.i18n.getMessage("options_exclusions_type");
	$("#options_exclusions_type").text(optionsExclusionsType);
	
	var optionsExclusionsTime = chrome.i18n.getMessage("options_exclusions_time");
	$("#options_exclusions_time").text(optionsExclusionsTime);
	
	var optionsExclusionsUrl = chrome.i18n.getMessage("options_exclusions_url");
	$("#options_exclusions_url").text(optionsExclusionsUrl);
	
	$(".tab_content").hide();
	var url = location.href;
	if(url.indexOf('history')>-1){	
		$(".tabs li[rel^='tab1']").addClass("active");
		$("#tab1").show();
	}else if(url.indexOf('exclusion')>-1){
		$("#tab2").show();
		$(".tabs li[rel^='tab2']").addClass("active");
	}
	
	chrome.runtime.sendMessage({cmd: "getItems"}, getDataResponse);
    chrome.runtime.sendMessage({cmd: "getExclusionItems"}, getExclusionDataResponse);

    $("ul.tabs li").click(function() {
        $(".tab_content").hide();

        var activeTab = $(this).attr("rel");
        $("#"+activeTab).fadeIn();
        $("ul.tabs li").removeClass("active");
        $(this).addClass("active");
        $(".tab_drawer_heading").removeClass("d_active");
        $(".tab_drawer_heading[rel^='"+activeTab+"']").addClass("d_active");

        chrome.runtime.sendMessage({cmd: "getItems"}, getDataResponse);
        chrome.runtime.sendMessage({cmd: "getExclusionItems"}, getExclusionDataResponse);

    })
    
    chrome.runtime.sendMessage({cmd: "getState"}, function(response) {
        APP_VERSION = response.version;
        $('#versionDiv').text(APP_VERSION);
    });

    $("#selectAll").click(function () {
        var rootCheck =  this.checked
        $(".checkBox").each(function () {
            this.checked = rootCheck;
        });

    })
    
    //exclusions
    $("#selectAllExclusions").click(function () {
        var rootCheck =  this.checked
        $(".exclusionCheckBox").each(function () {
            this.checked = rootCheck;
        });

    })

    $("#removeSelected").click(function () {
        var deleteList = [];
        $(".checkBox:checked").each(function () {
            deleteList.push($(this).attr("data-item-id"));
        });

        var elementToDelete = [];
        for (var i = 0; i < deleteList.length; i++) {
            elementToDelete.push(mainItems[deleteList[i]].url);
        }

        chrome.runtime.sendMessage({cmd: "removeSelected", list: JSON.stringify(elementToDelete)}, function(response) {
            chrome.runtime.sendMessage({cmd: "getItems"}, getDataResponse);
        })
    })

	//exclusions
	$("#removeSelectedExclusion").click(function () {
        var deleteList = [];
        $(".exclusionCheckBox:checked").each(function () {
            deleteList.push($(this).attr("data-item-id"));
        });

        var elementToDelete = [];
        for (var i = 0; i < deleteList.length; i++) {
            elementToDelete.push(mainExclsionItems[deleteList[i]].url);
        }

        chrome.runtime.sendMessage({cmd: "removeSelectedExclusion", list: JSON.stringify(elementToDelete)}, function(response) {
            chrome.runtime.sendMessage({cmd: "getExclusionItems"}, getExclusionDataResponse);
        })
    })

    $("#removeAll").click(function () {
        tableBody.empty();
        hideAllTableContent();
        chrome.runtime.sendMessage({cmd: "removeAll"}, function(response) {
            chrome.runtime.sendMessage({cmd: "getItems"}, getDataResponse);
        });
    })
    
    //exclusions
    $("#removeAllExclusions").click(function () {
        exclusionTableBody.empty();
        hideAllExclusionTableContent();
        chrome.runtime.sendMessage({cmd: "removeAllExclusions"}, function(response) {
            chrome.runtime.sendMessage({cmd: "getExclusionItems"}, getExclusionDataResponse);
        });
    })

    $("#searchUrl").click(function () {
        var searchVal = $("#SearchField").val();
        if (searchVal == "") {
            mainItems = rootData;
        } else {
            mainItems = [];
            for (var i = 0; i < rootData.length; i++) {
                var item = rootData[i];
                if (item.url.indexOf(searchVal) > -1) {
                    mainItems.push(item);
                }
            }
        }
        currentPosition = 0;
        hideAllTableContent();
        updateItems(mainItems);
    })
    
    //exclusions
    $("#searchExclusion").click(function () {
        var searchVal = $("#exclusionSearchField").val();
        if (searchVal == "") {
            mainExclsionItems = exclusionRootData;
        } else {
            mainExclsionItems = [];
            for (var i = 0; i < exclusionRootData.length; i++) {
                var item = exclusionRootData[i];
                if (item.url.indexOf(searchVal) > -1) {
                    mainExclsionItems.push(item);
                }
            }
        }
        exclusionCurrentPosition = 0;
        hideAllExclusionTableContent();
        updateExclusionItems(mainExclsionItems);
    })

    $("#gotoFirstPage").click(function () {
        hideAllTableContent();
        currentPosition = 0;
        updateItems(mainItems);
    });

	//exclusions
	$("#gotoFirstExclusionsPage").click(function () {
        hideAllExclusionTableContent();
        exclusionCurrentPosition = 0;
        updateExclusionItems(mainExclsionItems);
    });
	
    $("#gotoPreviousPage").click(function () {
        hideAllTableContent();
        currentPosition--;
        if (currentPosition <0) {
            currentPosition = 0;
        }
        updateItems(mainItems);

    });

	//exclusions
	$("#gotoPreviousExclusionsPage").click(function () {
        hideAllExclusionTableContent();
        exclusionCurrentPosition--;
        if (exclusionCurrentPosition <0) {
            exclusionCurrentPosition = 0;
        }
        updateExclusionItems(mainExclsionItems);

    });

    $("#gotoNextPage").click(function () {
        hideAllTableContent();
        currentPosition++;
        var maxPage = Math.floor(mainItems.length / maxItems);
        if (currentPosition > maxPage) {
            currentPosition = maxPage
        }
        updateItems(mainItems);
    });
	
	//exclusions
	$("#gotoNextExclusionsPage").click(function () {
        hideAllExclusionTableContent();
        exclusionCurrentPosition++;
        var maxPage = Math.floor(mainExclsionItems.length / maxItems);
        if (exclusionCurrentPosition > maxPage) {
            exclusionCurrentPosition = maxPage
        }
        updateExclusionItems(mainExclsionItems);
    });
	
    $("#gotoLastPage").click(function () {
        hideAllTableContent();
        currentPosition = Math.floor(mainItems.length / maxItems);
        updateItems(mainItems);

    });
    
    //exclusions
    $("#gotoLastExclusionsPage").click(function () {
        hideAllExclusionTableContent();
        exclusionCurrentPosition = Math.floor(mainExclsionItems.length / maxItems);
        updateExclusionItems(mainExclsionItems);

    });

});

function updateItems(items) {
    tableBody.empty();
    if (items.length > 0) {
        tableBody.show();
        if (items.length > maxItems) {
            paginationContent.show();
            var maxPage = Math.floor(items.length / maxItems) + 1;
            $('#textOfPages').text(optionsUrlShowingpage + "  " + (currentPosition + 1) + " / " + maxPage)
        } else {
            paginationContent.hide();
        }

        var firstIndex = currentPosition * maxItems;
        var lastPosition = firstIndex + maxItems;
        lastPosition = lastPosition > items.length ? items.length: lastPosition;
        for (var i = firstIndex; i < lastPosition; i++){
            var item = items[i];
            var threatType = chrome.i18n.getMessage(item.name);
            var actionTaken = chrome.i18n.getMessage("options_"+item.action);
            var str = '<tr><td><input class="checkBox" type="checkbox" data-item-id="' + i + '"></td><td>' + threatType +  '</td><td>'+ new Date(item.time) +'</td>'
            str += '<td>' + item.url + '</td><td>'+ actionTaken + '</td></tr>'
            tableBody.append(str);
            checkBoxClick();
        }
    }

}

//exclusion
function updateExclusionItems(items) {
    exclusionTableBody.empty();
    if (items.length > 0) {
        exclusionTableBody.show();
        if (items.length > maxItems) {
            exclusionsPaginationContent.show();
            var maxPage = Math.floor(items.length / maxItems) + 1;
            $('#textOfExclusionsPages').text(optionsExclusionsShowingpage + "  " + (exclusionCurrentPosition + 1) + " / " + maxPage)
        } else {
            exclusionsPaginationContent.hide();
        }

        var firstIndex = exclusionCurrentPosition * maxItems;
        var lastPosition = firstIndex + maxItems;
        lastPosition = lastPosition > items.length ? items.length: lastPosition;
        for (var i = firstIndex; i < lastPosition; i++){
            var item = items[i];
            var threatType = chrome.i18n.getMessage(item.name);
            var str = '<tr><td><input class="exclusionCheckBox" type="checkbox" data-item-id="' + i  + '"></td><td>' + threatType +  '</td><td>'+ new Date(item.time) +'</td>'
            str += '<td>' + item.url + '</td></tr>'
            exclusionTableBody.append(str);
            exclusionCheckBoxClick();
        }
    }

}

function hideAllTableContent() {
    paginationContent.hide();
    tableBody.hide();
}

function hideAllExclusionTableContent() {
    exclusionsPaginationContent.hide();
    exclusionTableBody.hide();
}

function getDataResponse(response) {
    $("#selectAll").val([]);
    mainItems = JSON.parse(response.data);
    rootData = mainItems;

    hideAllTableContent();
    currentPosition = 0;
    updateItems(mainItems);
}

//exclusion
function getExclusionDataResponse(response) {
    $("#selectAllExclusions").val([]);
    mainExclsionItems = JSON.parse(response.data);
    exclusionRootData = mainExclsionItems;

    hideAllExclusionTableContent();
    exclusionCurrentPosition = 0;
    updateExclusionItems(mainExclsionItems);
}

function checkBoxClick() {
	for(var i = 0; i < $(".checkBox").length; i++) {
		$(".checkBox")[i].onclick = function() {
			var checkBoxLength = $(".checkBox").length;
			var checkedLength = $(".checkBox:checked").length;
			if (checkBoxLength == checkedLength) {
				$("#selectAll").prop("checked", true);	
			} else {
				$("#selectAll").prop("checked", false);
			}
		}
	}
}

function exclusionCheckBoxClick() {
	for(var i = 0; i < $(".exclusionCheckBox").length; i++) {
		$(".exclusionCheckBox")[i].onclick = function() {
			var checkBoxLength = $(".exclusionCheckBox").length;
			var checkedLength = $(".exclusionCheckBox:checked").length;
			if (checkBoxLength == checkedLength) {
				$("#selectAllExclusions").prop("checked", true);	
			} else {
				$("#selectAllExclusions").prop("checked", false);
			}
		}
	}
}
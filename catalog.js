// posting degrees and programs
!(function ($) {
  window.onload = function getPrograms() {
    $(".ba, .ma, .phd, .cert").css("display", "block");
    $(".container").css("display", "block");
    var glanceExpander =
      '<button type="button" class="glance-expander">&nbsp;Program at a Glance&nbsp</button>';
    $(glanceExpander).insertAfter(".program-desc");
    $('<p class="plus">+</p>').appendTo(".glance-expander");
    $('<p class="minus">-</p>').appendTo(".glance-expander");
    $('.minus').hide();
    // reference to degree buttons in program button function
    var that;
    var count;
    var countSub;
    var countSubTotal;
    var countTotal;
    var hiddenDegrees;
    var degreeObj = $(".deg");
    var degObjChild;
    // count number of degrees being displayed
    function degreeCount() {
      var countArr = [];
      var listStyle;
      count = 0;
      // loop through all degrees
      for (var i in degreeObj) {
        var countSubArr = [];
        countSub = 0;
        degObjChild = degreeObj[i].children;
        // loop through all degree children
        for (var j in degObjChild) {
          // setting list class style
          listStyle = degObjChild[j].attributes;
          // counting degrees for each program
          if (listStyle) {
            if (listStyle[1].value == "display: block;" || listStyle[1].value == "display: block; visibility: hidden;" || listStyle[1].value == "display: block; visibility: visible;") {
              countSub++;
              countSubArr.push(countSub);
            }
          }
          countSubTotal = countSubArr.length;
          // setting list parent (degree div)
          var listParent = degObjChild[j].parentElement;
          if (listStyle && listParent) {
            if (listParent.parentElement.style) {
              // setting degree container parent (container) style
              var containerStyle = listParent.parentElement.style.display;
              //checking if list div and parent container are both showing and counting if so
              if (
                listStyle[1].value == "display: block;" || listStyle[1].value == "display: block; visibility: hidden;" || listStyle[1].value == "display: block; visibility: visible;" &&
                containerStyle == "block;"
              ) {
                count++;
                // push degree count into array and get the total amount
                countArr.push(count);
                countTotal = countArr.length;
              }
            }
          }
        }
        // appending number of degrees for each program to header
        if (countSubArr.length != 0) {
          var degHeader = degreeObj[i].previousElementSibling;
          // checking if degree header p child exists
          if (degHeader) {
            if (degHeader.children[1]) {
              var degreeCount = degHeader.children[1];
              $(degreeCount).append(countSubTotal);
            }
          }
        }
      }
      $(".count-num").prepend(countTotal);
    }
    degreeCount();
    // adjust the height of containers
    function adjustHeight(thisDegreeContainer) {
      //  checking the holding container of the program at a glance button that has been clicked
      if (thisDegreeContainer != undefined) {
        // grabbing number of degrees for this program
        var thisDegreeCount = thisDegreeContainer.previousElementSibling.children[1].innerHTML;
        // if less than 2 programs don't factor view more button and continue to adjust height normally
        if (thisDegreeCount > 3) {
          // if view more expander has already been clicked when user clicks program at a glance 
          // and max height is none, don't readjust height (which collapses entire container)
          if (thisDegreeContainer.style.maxHeight === "none") {
            return;
          }
        }
      }
      var lastEl;
      var heightArr = [];
      var expandButton;
      var listCountSub = 0;
      var headerHeight;
      for (var i in degreeObj) {
        var maxHeight;
        if (degreeObj[i].previousElementSibling) {
          headerHeight = degreeObj[i].previousElementSibling.clientHeight;
        }
        var listCount = 0;
        if (degreeObj[i]) {
          if (degreeObj[i].children === undefined) {
            continue;
          }
          degObjChild = degreeObj[i].children;
          // checking if expand button exists on page and assigning
          if (degreeObj[i].nextElementSibling) {
            expandButton = degreeObj[i].nextElementSibling;
            var degObjWidth = degreeObj[i].clientWidth;
            if (degObjWidth) {
              $(".expander").css("width", degObjWidth);
            }
          }
        }
        var visibleArr = [];
        for (var j in degObjChild) {
          if (degObjChild[j].style) {
            // height of each degree list
            var childHeight = degObjChild[j].clientHeight;
            // if degree child list is showing on page
            if (degObjChild[j].style.display == "block" && childHeight != 0) {
              visibleArr.push(degObjChild[j]);
              listCount++;
              if (listCount > 3) {
                // grabbing degrees that are available for each program but are hidden by the expander
                hiddenDegrees = visibleArr.slice(3, visibleArr.length);
                $(expandButton).show();
              } else {
                $(expandButton).hide();
                // prevents collapsing container if view more and is expanded and program at glance is clicked
              }
              // checking first three degrees
              if (listCount <= 3) {
                // need to clear array if more than 3
                if (heightArr.length > 2) {
                  // need last num in array to add to new array
                  lastEl = heightArr.pop();
                  heightArr = [];
                }
                // need to adjust if previous programs only have 2 degrees listed
                if (
                  (listCount == 3 && heightArr.length == 1) ||
                  (listCount == 2 && heightArr.length == 0)
                ) {
                  // add last height from array after cleared
                  heightArr.push(lastEl);
                }
                // need to adjust if previous program only has 1 degree listed
                if (listCount == 3 && heightArr.length == 0) {
                  heightArr.push(lastEl * 2);
                }
                heightArr.push(childHeight);
                maxHeight = heightArr.reduce(function (a, b) {
                  return a + b;
                });
                // adjusting max height plus a bit of padding
                $(degreeObj[i]).css("max-height", maxHeight + headerHeight);
              }
            }
          }
        }
        // hiding degrees from screen reader
        $(hiddenDegrees).css({ "visibility": "hidden" });
      }
    }
    adjustHeight();
    //degree click handlers
    $(".degree-button").click(function () {
      $(".degree-count").text("");
      // if degree button pushed while active do stuff
      if ($(this).hasClass("active")) {
        if ($(".program-button").hasClass("active")) {
          $(this).removeClass("active");
          $(this).click();
          return;
        }
      }
      // clearing num count
      $(".count-num").text("");
      // need reference to degree buttons in program button function
      that = this;
      $(".container").show();
      $(".degree-button").removeClass("active");
      // making sure program buttons are disabled until degree button is pushed
      $(this).addClass("active");
      $(".program-button").attr("disabled", false).removeClass("disabled");
      this.id == "certificates" ? $(".ba, .phd, .ma, .technology, .dissertation, .health-sciences, .social, .glance-expander").attr('style', 'display: none !important') &
        $(".cert, .law").attr('style', 'display: block;') & $('input#bachelors, input#masters, input#doctoral').prop("checked", false) &
        $(
          "#health-sciences, #technology, #dissertation-completion, #social-work"
        )
          .attr("disabled", true)
          .addClass("disabled")
          .removeClass("active")
          .prop("checked", false)
        & $('label[for="health-sciences"], label[for="technology"], label[for="dissertation-completion"], label[for="social-work"]').addClass("disabled") & $('label[for="education"], label[for="marriage-and-family-therapy"], label[for="business"], label[for="psychology"]').removeClass("disabled")
        : this.id == "bachelors" ? $(
          ".cert, .phd, .ma, .mft, .dissertation, .health-sciences, .technology, .social, .education"
        ).attr('style', 'display: none') &
          $(".ba, .glance-expander").attr('style', 'display: block;') & $('input#certificates, input#masters, input#doctoral').prop("checked", false) &
          $(
            "#health-sciences, #marriage-and-family-therapy, #technology, #dissertation-completion, #social-work, #education"
          )
            .attr("disabled", true)
            .addClass("disabled")
            .removeClass("active")
            .prop("checked", false)
          & $('label[for="health-sciences"], label[for="technology"], label[for="dissertation-completion"], label[for="social-work"], label[for="education"], label[for="marriage-and-family-therapy"]').addClass("disabled") & $('label[for="law"]').removeClass("disabled").prop("checked", false)
          : this.id == "masters" ? $(".cert, .phd, .ba, .dissertation, .law").attr('style', 'display: none') &
            $(".ma, .glance-expander").attr('style', 'display: block;') & $('input#certificates, input#bachelors, input#doctoral').prop("checked", false) &
            $("#dissertation-completion, #law")
              .attr("disabled", true)
              .addClass("disabled")
              .removeClass("active")
              .prop("checked", false)
            & $('label[for="dissertation-completion"], label[for="law"]').addClass("disabled") & $('label[for="health-sciences"], label[for="social-work"], label[for="technology"], label[for="education"], label[for="marriage-and-family-therapy"], label[for="business"], label[for="psychology"]').removeClass("disabled").prop("checked", false)
            : this.id == "doctoral" ? $(".ba, .cert, .ma, .social").attr('style', 'display: none') &
              $(".phd, .glance-expander").attr('style', 'display: block;') & $('input#certificates, input#bachelors, input#masters').prop("checked", false) &
              $("#social-work")
                .attr("disabled", true)
                .addClass("disabled")
                .removeClass("active")
                .prop("checked", false)
              & $('label[for="social-work"]').addClass("disabled") & $('label[for="health-sciences"], label[for="technology"], label[for="dissertation-completion"], label[for="education"], label[for="marriage-and-family-therapy"], label[for="law"], label[for="business"], label[for="psychology"]').removeClass("disabled").prop("checked", false)
              : console.log("error");
      if ($(".program-button").hasClass("active")) {
        $("#business").hasClass("active") ? $(".business").show()
          : $(".business").hide() & $(".business-degrees").children().css({ "display": "none" });
        $("#education").hasClass("active") ? $(".education").show()
          : $(".education").hide() & $(".education-degrees").children().css({ "display": "none" });
        $("#health-sciences").hasClass("active") ? $(".health-sciences").show()
          : $(".health-sciences").hide() & $(".health-sciences-degrees").children().css({ "display": "none" });
        $("#marriage-and-family-therapy").hasClass("active") ? $(".mft").show()
          : $(".mft").hide() & $(".mft-degrees").children().css({ "display": "none" });
        $("#psychology").hasClass("active") ? $(".psychology").show()
          : $(".psychology").hide() & $(".psychology-degrees").children().css({ "display": "none" });
        $("#technology").hasClass("active") ? $(".technology").show()
          : $(".technology").hide() & $(".technology-degrees").children().css({ "display": "none" });
        $("#dissertation-completion").hasClass("active") ? $(".dissertation").show()
          : $(".dissertation").hide() & $(".dissertation-degrees").children().css({ "display": "none" });
        $("#social-work").hasClass("active") ? $(".social").show()
          : $(".social").hide() & $(".social-degrees").children().css({ "display": "none" });
        $("#law").hasClass("active") ? $(".law").show() : $(".law").hide() & $(".law-degrees").children().css({ "display": "none" });
      }
      $(".degree-count").text("");
      $(".count-num").text("");
      degreeCount();
      adjustHeight();
    });
    $(".program-button").click(function () {
      $(".container").hide();
      $(".degree-count").text("");
      $(".count-num").text("");
      // if someone clicks on program button that's currently active do stuff
      if ($(this).hasClass("active")) {
        $(this).toggleClass("active");
        $("#business").hasClass("active") ? $(".business").toggle()
          : $(".business").hide() & $(".business-degrees").children().css({ "display": "none" });
        $("#education").hasClass("active") ? $(".education").toggle()
          : $(".education").hide() & $(".education-degrees").children().css({ "display": "none" });
        $("#health-sciences").hasClass("active") ? $(".health-sciences").toggle()
          : $(".health-sciences").hide() & $(".health-sciences-degrees").children().css({ "display": "none" });
        $("#marriage-and-family-therapy").hasClass("active") ? $(".mft").toggle()
          : $(".mft").hide() & $(".mft-degrees").children().css({ "display": "none" });
        $("#psychology").hasClass("active") ? $(".psychology").toggle()
          : $(".psychology").hide() & $(".psychology-degrees").children().css({ "display": "none" });
        $("#technology").hasClass("active") ? $(".technology").toggle()
          : $(".technology").hide() & $(".technology-degrees").children().css({ "display": "none" });
        $("#dissertation-completion").hasClass("active") ? $(".dissertation").toggle()
          : $(".dissertation").hide() & $(".dissertation-degrees").children().css({ "display": "none" });
        $("#social-work").hasClass("active") ? $(".social").toggle()
          : $(".social").hide() & $(".social-degrees").children().css({ "display": "none" });
        $("#law").hasClass("active") ? $(".law").toggle() : $(".law").hide() & $(".law-degrees").children().css({ "display": "none" });
        // if no program buttons are active click currently active degree button
        if ($(".program-button").hasClass("active") == false) {
          if ($(".degree-button").hasClass("active") == false) {
            $(degreeObj).children().css({ "display": "block" });
            $(".container").show();
            $(".expander").show();
            degreeCount();
            adjustHeight();
            return;
          }
          $(".degree-count").text("");
          $(".count-num").text("");
          $(that).click();
          return;
        }
        degreeCount();
        adjustHeight();
        return;
      }
      // program button show/hide logic
      $(this).addClass("active");
      if (this.id == "business" || $("#business").hasClass("active")) {
        $("#business").addClass("active");
        $(".business").toggle();
        $(".business-degrees").children().css({ "display": "block" });
      } else {
        $(".business").hide() & $(".business-degrees").children().css({ "display": "none" });
      }
      if (this.id == "education" || $("#education").hasClass("active")) {
        $("#education").addClass("active");
        $(".education").toggle();
        $(".education-degrees").children().css({ "display": "block" });
      } else {
        $(".education").hide() & $(".education-degrees").children().css({ "display": "none" });
      }
      if (this.id == "health-sciences" || $("#health-sciences").hasClass("active")) {
        $("#health-sciences").addClass("active");
        $(".health-sciences").toggle();
        $(".health-sciences-degrees").children().css({ "display": "block" });
      } else {
        $(".health-sciences").hide() & $(".health-sciences-degrees").children().css({ "display": "none" });
      }
      if (this.id == "marriage-and-family-therapy" || $("#marriage-and-family-therapy").hasClass("active")) {
        $("#marriage-and-family-therapy").addClass("active");
        $(".mft").toggle();
        $(".mft-degrees").children().show();
      } else {
        $(".mft").hide() & $(".mft-degrees").children().css({ "display": "none" });
      }
      if (this.id == "psychology" || $("#psychology").hasClass("active")) {
        $("#psychology").addClass("active");
        $(".psychology").toggle();
        $(".psychology-degrees").children().css({ "display": "block" });
      } else {
        $(".psychology").hide() & $(".psychology-degrees").children().css({ "display": "none" });
      }
      if (this.id == "technology" || $("#technology").hasClass("active")) {
        $("#technology").addClass("active");
        $(".technology").toggle();
        $(".technology-degrees").children().css({ "display": "block" });
      } else {
        $(".technology").hide() & $(".technology-degrees").children().css({ "display": "none" });
      }
      if (this.id == "dissertation-completion" || $("#dissertation-completion").hasClass("active")) {
        $("#dissertation-completion").addClass("active");
        $(".dissertation").toggle();
        $(".dissertation-degrees").children().css({ "display": "block" });
      } else {
        $(".dissertation-completion").hide() & $(".dissertation-degrees").children().css({ "display": "none" });
      }
      if (this.id == "social-work" || $("#social-work").hasClass("active")) {
        $("#social-work").addClass("active");
        $(".social").toggle();
        $(".social-degrees").children().css({ "display": "block" });
      } else {
        $(".social-work").hide() & $(".social-degrees").children().css({ "display": "none" });
      }
      if (this.id == "law" || $("#law").hasClass("active")) {
        $("#law").addClass("active");
        $(".law").toggle();
        $(".law-degrees").children().css({ "display": "block" });
      } else {
        $(".law").hide() & $(".law-degrees").children().css({ "display": "none" });
      }
      if ($(".degree-button").hasClass("active") == true) {
        $(".degree-button.active").click();
        $(".degree-count").text("");
        $(".count-num").text("");
      }
      degreeCount();
      adjustHeight();
    });
    // clear filter button
    $(".filter-button").click(function () {
      $(".plus").show();
      $(".minus").hide();
      $(".popup").addClass("slide-down");
      $(".popup").hide();
      $(".glance-expander").show();
      $(".degree-count").text("");
      $(".count-num").text("");
      $(".list").css("visibility", "");
      $(".deg, .list, .container").show();
      $(".list").css({ "display": "block" });
      $(".degree-button, .program-button").removeClass("active");
      $(".program-button").attr("disabled", false).removeClass("disabled");
      $('input.program-button').prop("checked", false);
      $('input#certificates, input#bachelors, input#doctoral, input#masters').prop("checked", false) &
        $('label[for="health-sciences"], label[for="technology"], label[for="dissertation-completion"], label[for="social-work"], label[for="education"], label[for="marriage-and-family-therapy"], label[for="law"]').removeClass("disabled");
      $(".expander").show();
      $("html, body").animate(
        {
          scrollTop: $(".breadcrumb").scrollTop(),
        },
        500
      );
      degreeCount();
      adjustHeight();
    });
    // expand programs button
    $(".expander").click(function () {
      var visibleElArr = [];
      // putting all visible elements in seperate array
      $(this).prev().children().each(function (i, e) {
        if (e.style.display === "block") {
          visibleElArr.push(e);
        }
      });
      // element to be focused on after viewing all
      var refocusedEl = visibleElArr[3].children[0].children[0];
      adjustHeight();
      this.id == "bus-expand" ? $(".business-degrees").css("max-height", "none") & $(this).prev().children().css({ "visibility": "visible" }) & $(refocusedEl).focus() &
        $("#bus-expand").hide()
        : this.id == "edu-expand" ? $(".education-degrees").css("max-height", "none") & $(this).prev().children().css({ "visibility": "visible" }) & $(refocusedEl).focus() &
          $("#edu-expand").hide()
          : this.id == "health-expand" ? $(".health-sciences-degrees").css("max-height", "none") & $(this).prev().children().css({ "visibility": "visible" }) & $(refocusedEl).focus() &
            $("#health-expand").hide()
            : this.id == "mft-expand" ? $(".mft-degrees").css("max-height", "none") & $(this).prev().children().css({ "visibility": "visible" }) & $(refocusedEl).focus() & $("#mft-expand").hide()
              : this.id == "psy-expand" ? $(".psychology-degrees").css("max-height", "none") & $(this).prev().children().css({ "visibility": "visible" }) & $(refocusedEl).focus() &
                $("#psy-expand").hide()
                : this.id == "tech-expand" ? $(".technology-degrees").css("max-height", "none") & $(this).prev().children().css({ "visibility": "visible" }) & $(refocusedEl).focus() &
                  $("#tech-expand").hide()
                  : this.id == "dis-expand" ? $(".dissertation-degrees").css("max-height", "none") & $(this).prev().children().css({ "visibility": "visible" }) & $(refocusedEl).focus() &
                    $("#dis-expand").hide()
                    : this.id == "soc-expand" ? $(".social-degrees").css("max-height", "none") & $(this).prev().children().css({ "visibility": "visible" }) & $(refocusedEl).focus() &
                      $("#soc-expand").hide()
                      : this.id == "law-expand" ? $(".law-degrees").css("max-height", "none") & $(this).prev().children().css({ "visibility": "visible" }) & $(refocusedEl).focus() & $("#law-expand").hide()
                        : console.log("error");
    });
    // need to change all bold tags to strong for accessibility
    $("b").each(function () {
      $("b").replaceWith(function () {
        return $("<strong>", {
          html: this.innerHTML,
        });
      });
    });
    // accessibility changes
    $(".person-type-filters").wrap('<nav aria-label="person type"></nav>');
    $(".pager").wrap('<nav aria-label="pager"></nav>');
    $(".breadcrumb").wrap('<nav aria-label="breadcrumb"></nav>');
    $(".list a").wrap('<h4></h4>');
    $(".degree-header a").wrap('<h3></h3>');
    $(".result-content").children().wrap('<h3></h3>');
    var popup = '<div class="popup></div>';
    // pulling programs with catalog api
    function getCatalog(programFinderProgramTitle, currentProgramClick, thisDegreeContainer, popup, plus, minus) {
      // need to set to false initially
      var specializationPages = false;
      console.log(programFinderProgramTitle + " current program title");
      // need to hide static and dynamic catalog data at first
      $("#why-tab-3").hide();
      $(programGlance).hide();
      $('#prog-2').hide();
      var programGlance =
        '<div class="program-glance"><h3 class="glance-title">Program at a Glance</h3></div>';
      var loader = '<div class="loader"></div>';
      //hiding program at a glance button for all certs and social work programs
      $(".cert").children(".glance-expander").hide();
      $(".social-degrees").children().children(".glance-expander").hide();
      jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
          options.url =
            "https://morning-fjord-44995.herokuapp.com/" + options.url;
        }
      });
      $(loader).insertAfter("#prog-2");
      $(loader).appendTo(".hours");
      $(loader).appendTo(".courses");
      $(loader).appendTo(".time");
      if (
        $("#page-title")[0].innerText.toLowerCase() ===
        "programs and degree finder"
      ) {
        $(loader).insertAfter(currentProgramClick);
      }
      // grabbing all catalogs and their id's and program page titles
      $.get(
        "API",
        function getCatalogId(data) {
          //grabbing most recent catalog number, first value on second children object is the most recent
          var currentCatalogId = data.children[0].children[1].id.replace(
            /\D+/g,
            ""
          );
          console.log(currentCatalogId + " --CURRENT CATALOG ID--");
          getProgram(currentCatalogId);
        }
      );
      var pageTitle;
      var fieldBody;
      // grabbing current program based on page title
      function getProgram(currentCatalogId, pageTitle, altTitleCheck) {
        var degreeAbrv;
        var count = 0;
        fieldBody = document.getElementsByClassName("field-body");
        if (specializationPages === false) {
          if (document.getElementById("page-title")) {
            if (document.getElementById("page-title").innerText) {
              pageTitle = document
                .getElementById("page-title")
                .innerText.toLowerCase();
            }
          }
        }
        // checking if we're on specialization page or not
        if (fieldBody) {
          if (fieldBody[0]) {
            if (fieldBody[0].children[0]) {
              if (
                fieldBody[0].children[0].innerText.includes("Specialization") ||
                fieldBody[0].children[0].innerText.includes("Specialized")
              ) {
                // need degree type to add H2 title to help accurately pull program
                degreeAbrv = $(".degree")[0].innerText;
                specializationPages = true;
                // grabbing h2 title which should include specialization text rather than page title
                pageTitle = pageTitle.toLowerCase().replace(/[^a-zA-Z ]/g, "");
              } else {
                pageTitle = pageTitle.toLowerCase().replace(/[^a-zA-Z ]/g, " ");
              }
            }
          }
        }
        // need to see if we're on certificate pages
        if (JSON.stringify(window.location).includes("certificate")) {
          // can't accurately search for stringified cert titles
          pageTitle = document
            .getElementById("page-title")
            .innerText.toLowerCase();
          console.log(pageTitle);
        }
        // pulling program titles if we're on program finder page
        if (
          $("#page-title")[0].innerText.toLowerCase() ===
          "programs and degree finder"
        ) {
          pageTitle = JSON.stringify(programFinderProgramTitle);
          console.log(pageTitle + " title being pulled if on program finder");
          if (pageTitle) {
            if (pageTitle.includes("bachelor of business")) {
              pageTitle = "bachelors of business administration";
            }
          }
        }
        // grabbing list of programs based on catalog id and pagetitle we're currently on
        $.get(
          "API" +
          currentCatalogId +
          "&query=" +
          pageTitle +
          "&options[sort]=rank&options[group]=degreetype",
          function getProgramId(data) {
            var hierarchyCount = 0;
            var altTitleCheck;
            var allWordsExist = false;
            var degreeType;
            var programId;
            // all program hierarchies
            var allProgramHierarchy =
              data.children[0].children[0].children[2].children;
            // need to grab degree names listed in program heirarchy to match with programs titles on specialization pages
            for (var i = 0; i < allProgramHierarchy.length; i++) {
              hierarchyCount++;
              var degreeName = allProgramHierarchy[i].children[1].innerHTML
                .toLowerCase()
                .replace(/[^a-zA-Z ]/g, "");
              var singleProgramHierarchy = allProgramHierarchy[i].children;
              // need to grab degree type from catalog to match with page/program titles on normal pages and degree finder
              if (singleProgramHierarchy) {
                degreeType = singleProgramHierarchy[singleProgramHierarchy.length - 1].textContent.toLowerCase();
              }
              // if we're on programs and degree finder need to keep first letter of each word
              // from degree type capitalized for accurate matches
              if (
                $("#page-title")[0].innerText.toLowerCase() ===
                "programs and degree finder"
              ) {
                degreeType = JSON.stringify(singleProgramHierarchy[singleProgramHierarchy.length - 1].textContent);
              }
              // if we're on specialization pages need to check that each word in the page title exists in degree name we are trying to pull
              // if all words exists, set to true and continue
              if (specializationPages === true) {
                degreeName = degreeName.split(" ");
                pageTitle = pageTitle.split(" ");
                console.log(degreeName);
                console.log(pageTitle);
                for (var k = 0; k < pageTitle.length; k++) {
                  if (degreeName.includes(pageTitle[k])) {
                    allWordsExist = true;
                  } else {
                    allWordsExist = false;
                    break;
                  }
                }
                degreeName = degreeName.join(" ");
                pageTitle = pageTitle.join(" ");
                // same word to word check for normal pages and degree finder
              } else {
                pageTitle = pageTitle.split(" ");
                degreeType = degreeType.split(" ");
                for (var j = 0; j < degreeType.length; j++) {
                  if (pageTitle.includes(degreeType[j])) {
                    allWordsExist = true;
                  } else {
                    allWordsExist = false;
                    break;
                  }
                }
                degreeType = degreeType.join(" ");
                pageTitle = pageTitle.join(" ");
              }
              console.log(degreeName + " --DEGREE NAME FROM CATALOG--");
              console.log(degreeType + " --DEGREE TYPE FROM CATALOG--");
              console.log(pageTitle + " --PROGRAM WE ARE TRYING TO PULL--");
              // only grab program id if degree type or degree name for each program is the same as the page title we are checking
              if (degreeType != undefined) {
                if (
                  degreeType === pageTitle ||
                  degreeName.toLowerCase() === pageTitle ||
                  allWordsExist === true
                ) {
                  // set the program id and pull the program content
                  programId = allProgramHierarchy[i].children[0].innerHTML;
                  console.log(programId + " --PROGRAM ID--");
                  getProgramContent(programId, currentCatalogId, pageTitle);
                  count++;
                  return;
                }
              }
            }
            // if program id can't be set the API can't correctly query this page title
            // if the degree we are trying to pull doesn't have all words from the current page title
            // we need to change the page title to the secondary title (specialization pages only) and call the api again
            if (programId === undefined || allWordsExist == false) {
              altTitleCheck = true;
              if (specializationPages === true) {
                pageTitle = fieldBody[0].innerText.toLowerCase().replace(/[^a-zA-Z ]/g, " ");
                console.log(pageTitle);
                console.log("PULLING SPECIALIZATION ALT TITLE");
                getProgram(currentCatalogId, pageTitle, altTitleCheck);
              }
            }
            // if we've tried to pull different titles and it's still not working, need to show static data or alt popup
            if (
              programId === undefined &&
              allWordsExist === false &&
              altTitleCheck === true
            ) {
              $("#prog-2").show();
              $(".program-glance").hide();
              $(".loader").hide();
              // show alt popup for program finder
              if (
                $("#page-title")[0].innerText.toLowerCase() ===
                "programs and degree finder"
              ) {
                popup = '<div class="popup"><p>Please see <a class="catalog-link" href="https://catalog.ncu.edu/">Course Catalog</a> for more information regarding this program.</p></div>';
                $(popup).insertAfter(currentProgramClick);
                adjustHeight(thisDegreeContainer);
                console.log("showing static data");
                return;
              }
              console.log("showing static data");
            }
          }
        );
      }
      // grabbing content for all programs
      function getProgramContent(programId, currentCatalogId, pageTitle) {
        $.get(
          "" +
          programId +
          "&catalog=" +
          currentCatalogId,
          function (data) {
            // program listed at the top of the catalog program page
            console.log(
              data.children[0].children[0].children[0].children[0].innerHTML +
              " --ACTUAL PROGRAM BEING PULLED FROM CATALOG--"
            );
            var count = 0;
            var countArr = [];
            var courseTotal;
            var specializationTotal;
            var staticCourseCount;
            var completionTimeNum;
            var creditHoursNum;
            var creditHoursNumCert;
            // access to lists of courses for each program
            var courseLists = data.children[0].children[4].children;
            // total specializations total
            // console.log(data.children[0].children[0].children[0].children[6].children[1].children[5].children[0].children[4].children)
            // turning into array
            var courseListsArr = Object.values(courseLists);
            // grabbing lists for each program and counting the number of courses
            for (var i = 0; i < courseListsArr.length; i++) {
              count++;
              countArr.push(count);
            }
            var countArrNum = countArr.length - 1;
            if ($("#prog-2").children("p").children()[4]) {
              staticCourseCount = $("#prog-2").children("p").children()[4].innerHTML.replace(/\D+/g, "");
            }
            // count total minus "field" element which is not a course
            courseTotal =
              "<div>Courses: " +
              '<p class="bold-glance">' +
              staticCourseCount +
              " Courses</p></div>";
            // access to all page content non-certs
            var pageContent = data.children[0].children[3].children[0].children;
            // need to turn into array
            var pageContentArr = Object.values(pageContent);
            var deanCompletionTime;
            var creditHours;
            console.log(
              programFinderProgramTitle +
              " --PROGRAM TRYING TO PULL FROM PROGRAM FINDER--"
            );
            console.log("vvv-CATALOG PAGE CONTENT-vvv");
            console.log(pageContentArr);
            // need to loop through each child to find completion times and minimum credits required
            for (var j = 0; j < pageContentArr.length; j++) {
              //if page content has children
              if (pageContentArr[j]) {
                // if each page section has a title
                if (pageContentArr[j].children[0]) {
                  if (pageContentArr[j].children[0].children[0]) {
                    // all pageTitles
                    var catalogPageTitles = pageContentArr[
                      j
                    ].children[0].children[0].innerHTML.toLowerCase();
                  }
                  if (pageContentArr[j].children[0].textContent) {
                    if (pageContentArr[j].children[0].children[3]) {
                      if (pageContentArr[j].children[0].children[3].children[0])
                        var creditDescription = pageContentArr[
                          j
                        ].children[0].children[3].children[0].textContent.toLowerCase();
                    }
                  } else {
                    continue;
                  }

                  var overviewTitle = $(".degree").context.title;
                  var getCredits = function () {
                    // if catalog page title is degree requirements
                    if (catalogPageTitles === "degree requirements") {
                      // if we're on any BA pages or specializations pages
                      if (
                        pageTitle.includes("Bachelor") ||
                        pageTitle.includes("bachelor") ||
                        overviewTitle.includes("BBA") ||
                        overviewTitle.includes("BAPSY")
                      ) {
                        creditHoursNum = creditDescription
                          .replace(/\D+/g, "")
                          .slice(0, 3);
                        creditHours =
                          "<div>Total Credit Hours: " +
                          "<p class='bold-glance'>" +
                          creditHoursNum +
                          " Credit Hours</p></div>";
                        return;
                      }
                      // if mimimum credits are listed under degree requirmennts
                      if (
                        creditDescription.includes("minimum") ||
                        creditDescription.includes("edd") ||
                        creditDescription.includes("phd") ||
                        creditDescription.includes("eds") ||
                        creditDescription.includes("med")
                      ) {
                        // some content has more numbers in the text so we just need the first 2 which is the minimum credit amount
                        creditHoursNum = creditDescription
                          .replace(/\D+/g, "")
                          .slice(0, 2);
                      }
                      creditHours =
                        "<div>Total Credit Hours: " +
                        "<p class='bold-glance'>" +
                        creditHoursNum +
                        " Credit Hours</p></div>";
                      return;
                      // if minimum credits are listed under course sequence instead of degree requirements
                    } else if (
                      (catalogPageTitles === "course sequence" &&
                        creditHoursNum === "") ||
                      (catalogPageTitles === "course sequence" &&
                        creditHoursNum === undefined) ||
                      catalogPageTitles === "course sequence"
                    ) {
                      if (
                        pageTitle.includes("Bachelor") ||
                        pageTitle.includes("bachelor") ||
                        overviewTitle.includes("BBA") ||
                        overviewTitle.includes("BAPSY")
                      ) {
                        return;
                      }
                      var creditHoursAlt = creditDescription
                        .replace(/\D+/g, "")
                        .slice(0, 2);
                      if (
                        creditHoursAlt > creditHoursNum ||
                        creditHoursNum === "" ||
                        creditHoursNum === undefined
                      ) {
                        creditHoursNum = creditHoursAlt;
                      }
                      creditHours =
                        "<div>Total Credit Hours: " +
                        "<p class='bold-glance'>" +
                        creditHoursNum +
                        " Credit Hours</p></div>";
                    }
                  };
                  getCredits();
                  // making sure page content exists (redundant?)
                  if (pageContentArr[j].children[0].children[3]) {
                    if (pageContentArr[j].children[0].children[3].children[3]) {
                      // if sentence in time to completion array does not have any numbers after removing characters or the number returned is less than 10 (months) and we aren't on any cert pages (some certs have less than 10) we want to ignore it - might need to find a better way
                      if (
                        pageContentArr[j].children[0].children[3].children[3].innerHTML.replace(
                          /\D+/g,
                          ""
                        ) === "" ||
                        (pageContentArr[j].children[0].children[3].children[3].innerHTML
                          .replace(/\D+/g, "")
                          .slice(0, 2) < 9 &&
                          JSON.stringify(window.location).includes(
                            "certificate"
                          ) === false)
                      ) {
                      } else if (
                        pageContentArr[j].children[0].children[3].children[3].innerHTML.includes(
                          "Dean"
                        )
                      ) {
                        completionTimeNum = pageContentArr[j].children[0].children[3].children[3].innerHTML
                          .replace(/\D+/g, "")
                          .slice(0, 2);
                        deanCompletionTime =
                          "<div>Recommended Completion Time: " +
                          '<p class="bold-glance">' +
                          completionTimeNum +
                          " Months</p></div>";
                      }
                    }
                  }
                }
              }
            }
            // need to check if program outcomes exists for each program
            if (data.children[0]) {
              if (data.children[0].children[3]) {
                if (data.children[0].children[3].children[0]) {
                  if (
                    data.children[0].children[3].children[0].children[5]
                      .children[0].children[3]
                  ) {
                    if (
                      data.children[0].children[3].children[0].children[5]
                        .children[0].children[3].children[0]
                    ) {
                      var outcomesArr =
                        data.children[0].children[3].children[0].children[5]
                          .children[0].children[3].children;

                      var outcomesTitleCatalog =
                        data.children[0].children[3].children[0].children[5]
                          .children[0].children[0].textContent;

                      var outcomesListTitle =
                        '<p class="outcome-title">Learning Outcomes</p>';

                      var outcomesBlock = document.getElementById("why-tab-3");

                      var activeTab = document.getElementsByClassName(
                        "r-tabs-state-active"
                      );
                      // if we click a tab
                      $(".r-tabs-anchor").click(function () {
                        $(".outcome-list").remove();
                        $(".outcome-title").remove();
                        // need to see if we're on outcomes tab and if learning outcomes exist for this program
                        if (
                          activeTab[2].id === "why-tab-3" &&
                          outcomesTitleCatalog === "Learning Outcomes"
                        ) {
                          // hiding static outcomes
                          $(outcomesBlock).hide();
                          $(outcomesListTitle).insertBefore("div#why-tab-3");
                          // grabbing all outcomes and creating new list
                          for (var i = 0; i < outcomesArr.length; i++) {
                            if (
                              outcomesArr[i].tagName === "h:ol" ||
                              outcomesArr[i].tagName === "h:ul"
                            ) {
                              var outcomesArrInner = outcomesArr[i].children;
                              for (
                                var j = 0;
                                j < outcomesArrInner.length;
                                j++
                              ) {
                                console.log(outcomesArrInner[j]);

                                var outcomesList =
                                  '<li class="outcome-list">' +
                                  outcomesArrInner[j].innerText +
                                  "</li>";
                                $(outcomesList).insertAfter("div#why-tab-3");
                                // $(outcomesTab).show();
                              }
                            }
                          }
                        } else {
                          // hiding catalog outcomes on other tabs
                          $(".outcome-list").add(".outcome-title").hide();
                        }
                      });
                    }
                  }
                }
              }
            }
            var specializations = document.getElementsByClassName(
              "ncu-degrees-specializations-block"
            );
            // checking to see if page lists specializations and grabbing count
            if (specializations[0]) {
              if (specializations[0].children) {
                if (specializations[0].children[0].children) {
                  specializations = Object.values(
                    document.getElementsByClassName(
                      "ncu-degrees-specializations-block"
                    )[0].children[0].children
                  );
                  var specializationCount = 0;
                  for (var k = 0; k < specializations.length; k++) {
                    specializationCount++;
                  }
                  specializationTotal =
                    '<div><p class="bold-glance">' +
                    specializationCount +
                    " profesionally relevant specializations</p></div>";
                }
              }
            }
            // if we're missing any data from the catalog or not pulling it correctly need to show static data
            if (
              completionTimeNum === "" ||
              completionTimeNum === undefined ||
              creditHoursNum === "" ||
              creditHoursNum === undefined ||
              courseTotal === "" ||
              programId === undefined
            ) {
              $("#prog-2").show();
              $(".program-glance").hide();
              $(".loader").hide();
              popup = '<div class="popup"><p>Please see <a class="catalog-link" href="https://catalog.ncu.edu/">Course Catalog</a> for more information regarding this program.</p></div>';
              $(popup).insertAfter(currentProgramClick);
              adjustHeight();
              console.log("using static program data, check missing data");
              if (
                $("#page-title")[0].innerText.toLowerCase() ===
                "programs and degree finder"
              ) {
                return;
              }
              return;
            } else {
              $(".program-glance").show();
              console.log("using catalog program data");
            }
            var startDate =
              '<div>Next Start Date:<p class="bold-glance"> Every Monday</p></div>';
            var classSize =
              '<div>Classroom Size:<p class="bold-glance"> One</p></div>';
            // if were on program specialization pages
            if (fieldBody[0]) {
              if (fieldBody[0].innerText.includes("Specialization")) {

                creditHoursNum =
                  '<p class="course-info">' + creditHoursNum + "</p>";
                countArrNum = '<p class="course-info">' + countArrNum + "</p>";
                completionTimeNum =
                  '<p class="course-info">' + completionTimeNum + " months</p>";
                // $(creditHoursNum).appendTo(".hours");
                // $(completionTimeNum).appendTo(".time");
                // $(specializationTotal)
                //   .add(creditHours)
                //   .add(courseTotal)
                //   .add(deanCompletionTime)
                //   .add(startDate)
                //   .add(classSize)
                //   .appendTo(".program-glance");
                $(".loader").hide();
                // if we're on cert page heirarchies and specializations are listed
              } else if (
                pageTitle.includes("certificate") ||
                (JSON.stringify(window.location).includes("certificate") &&
                  specializations.length > 0)
              ) {
                creditHoursNumCert = data.children[0].children[0].children[0].children[6].children[1].children[5].textContent
                  .replace(/\D+/g, "")
                  .slice(0, 2);
                creditHours =
                  "<div>Total Credit Hours: " +
                  '<p class="bold-glance">' +
                  creditHoursNumCert +
                  " Credit Hours</p></div>";
                $(specializationTotal)
                  .add(creditHours)
                  .add(courseTotal)
                  .add(deanCompletionTime)
                  .add(startDate)
                  .add(classSize)
                  .appendTo(".program-glance");
                $(".loader").hide();
                // if were on a cert specialization page
              } else if (
                JSON.stringify(window.location).includes("social-work")
              ) {
                $(".program-glance").hide();
              }
              // if we're on a normal program page
              else {
                $(specializationTotal)
                  .add(creditHours)
                  .add(courseTotal)
                  .add(deanCompletionTime)
                  .add(startDate)
                  .add(classSize)
                  .appendTo(".program-glance");
                $(".loader").hide();
              }
            } else if (
              JSON.stringify(window.location).includes("certificate") ||
              (JSON.stringify(window.location).includes("certificate") &&
                specializations.length === 0)
            ) {
              creditHoursNumCert = data.children[0].children[0].children[0].children[6].children[1].children[5].textContent
                .replace(/\D+/g, "")
                .slice(0, 2);
              creditHoursNum =
                '<p class="course-info">' + creditHoursNumCert + "</p>";
              countArrNum = '<p class="course-info">' + countArrNum + "</p>";
              completionTimeNum =
                '<p class="course-info">' + completionTimeNum + " months</p>";
              $(creditHoursNum).appendTo(".hours");
              $(countArrNum).appendTo(".courses");
              $(completionTimeNum).appendTo(".time");
              $(".loader").hide();
              // hiding for now if we're on social work
            } else if (
              // if we're on program finder page
              $("#page-title")[0].innerText.toLowerCase() ===
              "programs and degree finder"
            ) {
              // need static number of courses to add to program finder program at a glance
              switch (programFinderProgramTitle) {
                case 'Bachelor of Business Administration': staticCourseCount = 20; break;
                case 'Doctor of Philosophy in Business Administration': staticCourseCount = 20; break;
                case 'Doctor of Philosophy in Organizational Leadership': staticCourseCount = 19; break;
                case 'Doctor of Philosophy in Human Resource Management': staticCourseCount = 20; break;
                case 'Doctor of Business Administration': staticCourseCount = 20; break;
                case 'Doctor of Criminal Justice': staticCourseCount = 18; break;
                case 'Doctor of Public Administration': staticCourseCount = 18; break;
                case 'Master of Business Administration': staticCourseCount = 11; break;
                case 'Master of Science in Organizational Leadership': staticCourseCount = 11; break;
                case 'Master of Science in Accounting': staticCourseCount = 13; break;
                case 'Master of Public Administration': staticCourseCount = 12; break;
                case 'Master of Human Resource Management': staticCourseCount = 10; break;
                case 'Master of Legal Studies': staticCourseCount = 11; break;
                case 'Doctor of Philosophy Technology Innovation Management': staticCourseCount = 26; break;
                case 'Doctor of Philosophy in Data Science': staticCourseCount = 21; break;
                case 'Doctor of Philosophy in Computer Science': staticCourseCount = 25; break;
                case 'Master of Science Technology and Innovation Management': staticCourseCount = 11; break;
                case 'Master of Science in Data Science': staticCourseCount = 11; break;
                case 'Master of Science in Cybersecurity': staticCourseCount = 10; break;
                case 'Master of Science in Information Technology': staticCourseCount = 10; break;
                case 'Master of Science in Computer Science': staticCourseCount = 10; break;
                case 'Doctor of Philosophy in Education': staticCourseCount = 22; break;
                case 'Doctor of Philosophy in Educational Leadership': staticCourseCount = 22; break;
                case 'Doctor of Philosophy in Instructional Design': staticCourseCount = 22; break;
                case 'Doctor of Education': staticCourseCount = 22; break;
                case 'Doctor of Education in Educational Leadership': staticCourseCount = 22; break;
                case 'Doctor of Education in Instructional Design': staticCourseCount = 20; break;
                case 'Education Specialist': staticCourseCount = 14; break;
                case 'Education Specialist in Educational Leadership': staticCourseCount = 14; break;
                case 'Master of Education': staticCourseCount = 12; break;
                case 'Master of Education in Educational Leadership': staticCourseCount = 10; break;
                case 'Master of Science in Instructional Design': staticCourseCount = 12; break;
                case 'Master of Arts in Teaching': staticCourseCount = 8; break;
                case 'Bachelor of Arts in Psychology': staticCourseCount = 20; break;
                case 'Doctor of Philosophy in Psychology': staticCourseCount = 21; break;
                case 'Master of Arts in Psychology': staticCourseCount = 12; break;
                case 'Master of Science in Child and Adolescent Developmental Psychology': staticCourseCount = 11; break;
                case 'Master of Science in Educational Psychology': staticCourseCount = 11; break;
                case 'Master of Science in Forensic Psychology': staticCourseCount = 11; break;
                case 'Master of Science in Health Psychology': staticCourseCount = 15; break;
                case 'Master of Science in Industrial/Organizational Psychology': staticCourseCount = 10; break;
                case 'Doctor of Philosophy in Marriage and Family Therapy': staticCourseCount = 28; break;
                case 'Doctorate of Marriage and Family Therapy': staticCourseCount = 29; break;
                case 'Master of Arts in Marriage and Family Therapy': staticCourseCount = 21; break;
                case 'Master of Health Administration': staticCourseCount = 14; break;
                case 'Master of Science in Nursing': staticCourseCount = 12; break;
                case 'Doctor of Health Administration': staticCourseCount = 18; break;
                case 'Doctor of Nursing Practice in Executive Leadership': staticCourseCount = 18; break;
              }
              courseTotal =
                "<div>Courses: " +
                '<p class="bold-glance">' +
                staticCourseCount +
                " Courses</p></div>";
              var cta =
                '<div class="content"><div class="button cta-glance">Request Info</div></div>';
              popup =
                '<div class="popup">' +
                creditHours +
                courseTotal +
                deanCompletionTime +
                cta +
                "</div>";
              // if program glance expander button has been pressed
              if ($(".glance-expander").hasClass("power-on")) {
                $(plus).hide();
                $(minus).show();
                $(popup).insertAfter(currentProgramClick);
                $(".popup").addClass("active-popup");
                $(".loader").remove();
                adjustHeight(thisDegreeContainer);
              }
            }
          }
        );
      }
      $(programGlance).insertAfter("#prog-2");
    }
    getCatalog();
    var currentProgramClick;
    var thisDegreeContainer;
    $(".glance-expander").click(function () {
      var plus = this.firstElementChild;
      var minus = this.firstElementChild.nextElementSibling;
      popup = this.nextElementSibling;
      // degree container on program finder
      thisDegreeContainer = this.parentElement.parentElement;
      // if the button is clicked after user has already open and closed popup - prevent having to call API again
      if ($(this).hasClass("standby")) {
        $(plus).hide();
        $(minus).show();
        $(this).removeClass("standby");
        $(popup).removeClass("slide-down");
        $(this).addClass("power-on");
        $(popup).show();
        adjustHeight(thisDegreeContainer);
        return;
      }
      if ($(this).hasClass("power-on")) {
        $(minus).hide();
        $(plus).show();
        $(this).removeClass("power-on");
        $(this).addClass("standby");
        $(popup).addClass("slide-down");
        $(popup).hide();
        adjustHeight(thisDegreeContainer);
        return;
      }
      $(this).addClass("power-on");
      // grabing title for each program giving it to catalog for processing
      var programFinderProgramTitle = this.previousElementSibling
        .previousElementSibling.innerText.replace(/[^a-zA-Z ]/g, " ");
      currentProgramClick = this;
      console.log(currentProgramClick);
      getCatalog(programFinderProgramTitle, currentProgramClick, thisDegreeContainer, popup, plus, minus);
    });
  };
})(jQuery);

//catalog
!(function ($) {
  window.onload = function () {
    // need to hide static and dynamic catalog data at first
    $("#why-tab-3").hide();
    $(programGlance).hide();
    // $('#prog-2').hide()
    var programGlance =
      '<div class="program-glance"><h3 class="glance-title">Program at a Glance</h3></div>';
    var loader = '<div class="loader"></div>';
    jQuery.ajaxPrefilter(function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
      }
    });
    $(loader).insertAfter("#prog-2");
    $(loader).appendTo(".hours");
    $(loader).appendTo(".courses");
    $(loader).appendTo(".time");
    // grabbing all catalogs
    $.get("API", function getCatalogId(data) {
      //grabbing most recent catalog number, first value on second children object is the most recent
      var currentCatalogId = data.children[0].children[1].id.replace(
        /\D+/g,
        ""
      );
      A;
      getProgram(currentCatalogId);
    });
    var pageTitle;
    var fieldBody;
    // grabbing current program based on page title
    function getProgram(currentCatalogId) {
      var count = 0;
      fieldBody = document.getElementsByClassName("field-body");
      if (document.getElementById("page-title")) {
        if (document.getElementById("page-title").innerText) {
          pageTitle = document
            .getElementById("page-title")
            .innerText.toLowerCase();
        }
      }
      // need to use "bachelors" not "bachelor" for BA programs
      if (pageTitle) {
        if (pageTitle.includes("bachelor of business")) {
          pageTitle = "bachelors of business administration";
          console.log(pageTitle);
        }
      } else if (pageTitle) {
        if (pageTitle.includes("bachelor of arts in psychology")) {
          pageTitle = "bachelors of psychology";
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
              // grabbing h2 title which should include specialization text rather than page title
              pageTitle = JSON.stringify(
                fieldBody[0].innerText.toLowerCase().replace(/[^a-zA-Z ]/g, "")
              );
              console.log(fieldBody);
              console.log(pageTitle);
              console.log("we're on a specialization page");
            } else {
              pageTitle = JSON.stringify(
                pageTitle.toLowerCase().replace(/[^a-zA-Z ]/g, "")
              );
              console.log("we're not on a specialization page");
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
      if (
        $("#page-title")[0].innerText.toLowerCase() ===
        "programs and degree finder"
      ) {
        $(".program-desc").hover(function () {
          console.log(this.previousElementSibling.innerText.toLowerCase());
        });
      }
      $.get(
        "API" + currentCatalogId + "&query=" + pageTitle + "&options[limit]=1",
        function getProgramId(data) {
          // grabbing Ids for all programs
          var allProgramId = data.children[0].children[0].children[2].children;

          for (var i = 0; i < allProgramId.length; i++) {
            // all programIds
            var allProgramIds = allProgramId[i].children[0].innerHTML;
            getProgramContent(allProgramIds, currentCatalogId);
            count++;
            console.log(allProgramIds);
          }
          // if there's no program id the API can't correctly query this pagetitle and need to display static - temp fix
          if (allProgramIds === undefined) {
            $("#prog-2").show();
            $(".program-glance").hide();
            $(".loader").hide();
            console.log("showing static data");
            return;
          }
        }
      );
    }
    // grabbing content for all programs
    function getProgramContent(allProgramIds, currentCatalogId) {
      $.get("API" + allProgramIds + "&catalog=" + currentCatalogId, function (
        data
      ) {
        console.log(data.children);
        var count = 0;
        var countArr = [];
        var courseTotal;
        var specializationTotal;
        // access to lists of courses for each program
        var courseLists = data.children[0].children[4].children;
        // turning into array
        var courseListsArr = Object.values(courseLists);
        // grabbing lists for each program and counting the number of courses
        for (var i = 0; i < courseListsArr.length; i++) {
          count++;
          countArr.push(count);
        }
        var countArrNum = countArr.length - 1;
        // count total minus "field" element which is not a course
        courseTotal =
          "<div>Courses: " +
          '<p class="bold-glance">' +
          countArrNum +
          " Courses</p></div>";
        console.log(courseTotal);
        console.log(courseListsArr);
        // access to all page content non-certs
        var pageContent = data.children[0].children[3].children[0].children;
        // need to turn into array
        var pageContentArr = Object.values(pageContent);
        var deanCompletionTime;
        var creditHours;
        console.log(pageContentArr);
        // need to loop through each child to find completion times and minimum credits required
        for (var i = 0; i < pageContentArr.length; i++) {
          //if page content has children
          if (pageContentArr[i]) {
            // if each page section has a title
            if (pageContentArr[i].children[0]) {
              // all pagesTitles
              var catalogPageTitles = pageContentArr[
                i
              ].children[0].children[0].innerHTML.toLowerCase();
              console.log(catalogPageTitles);
              if (pageContentArr[i].children[0].textContent) {
                if (pageContentArr[i].children[0].children[3].children[0])
                  var degreeRequirements = pageContentArr[
                    i
                  ].children[0].children[3].children[0].textContent.toLowerCase();
              } else {
                continue;
              }
              var creditHoursNum;
              var overviewTitle = $(".degree").context.title;
              function getCredits() {
                // if catalog page title is degree requirements
                if (catalogPageTitles === "degree requirements") {
                  // if we're on any BA pages or specializations pages
                  if (
                    pageTitle.includes("bachelor") ||
                    overviewTitle.includes("BBA") ||
                    overviewTitle.includes("BAPSY")
                  ) {
                    creditHoursNum = degreeRequirements
                      .replace(/\D+/g, "")
                      .slice(0, 3);
                  }
                  // if mimimum credits are listed under degree requirmennts
                  if (
                    degreeRequirements.includes("minimum") ||
                    degreeRequirements.includes("edd") ||
                    degreeRequirements.includes("phd") ||
                    degreeRequirements.includes("eds")
                  ) {
                    console.log(pageTitle);
                    console.log(degreeRequirements);
                    // some content has more numbers in the text so we just need the first 2 which is the minimum credit amount
                    creditHoursNum = degreeRequirements
                      .replace(/\D+/g, "")
                      .slice(0, 2);
                    console.log(creditHoursNum);
                  }
                  creditHours =
                    "<div>Total Credit Hours: " +
                    "<p class='bold-glance'>" +
                    creditHoursNum +
                    " Credit Hours</p></div>";
                  // if minimum credits are listed under course sequence instead of degree requirements
                } else if (
                  (catalogPageTitles === "course sequence" &&
                    creditHoursNum === "") ||
                  (catalogPageTitles === "course sequence" &&
                    creditHoursNum === undefined)
                ) {
                  if (pageTitle.includes("bachelor")) {
                    return;
                  } else {
                    creditHoursNum = degreeRequirements
                      .replace(/\D+/g, "")
                      .slice(0, 2);
                    creditHours =
                      "<div>Total Credit Hours: " +
                      "<p class='bold-glance'>" +
                      creditHoursNum +
                      " Credit Hours</p></div>";
                  }
                }
              }
              getCredits();
              // making sure page content exists (redundant?)
              if (pageContentArr[i].children[0].children[3]) {
                if (pageContentArr[i].children[0].children[3].children[3]) {
                  // if sentence in time to completion array does not have any numbers after removing characters or the number returned is less than 10 (months) and we aren't on any cert pages (some certs have less than 10) we want to ignore it - might need to find a better way
                  if (
                    pageContentArr[
                      i
                    ].children[0].children[3].children[3].innerHTML.replace(
                      /\D+/g,
                      ""
                    ) === "" ||
                    (pageContentArr[
                      i
                    ].children[0].children[3].children[3].innerHTML
                      .replace(/\D+/g, "")
                      .slice(0, 2) < 9 &&
                      JSON.stringify(window.location).includes(
                        "certificate"
                      ) === false)
                  ) {
                    console.log(" completion times aren't in here");
                  } else if (
                    pageContentArr[
                      i
                    ].children[0].children[3].children[3].innerHTML.includes(
                      "Dean"
                    )
                  ) {
                    console.log(
                      pageContentArr[i].children[0].children[3].children[3]
                        .innerHTML
                    );
                    var completionTimeNum = pageContentArr[
                      i
                      // regex for removing all text and returning number w/ 2 digit max
                    ].children[0].children[3].children[3].innerHTML
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
                data.children[0].children[3].children[0].children[5].children[0]
                  .children[3]
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

                          for (var i = 0; i < outcomesArrInner.length; i++) {
                            console.log(outcomesArrInner[i]);

                            var outcomesList =
                              '<li class="outcome-list">' +
                              outcomesArrInner[i].innerText +
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
              for (var i = 0; i < specializations.length; i++) {
                specializationCount++;
              }
              specializationTotal =
                '<div><p class="bold-glance">' +
                specializationCount +
                " profesionally relevant specializations</p></div>";

              console.log(specializationTotal);
              console.log(specializationCount);
            }
          }
        }
        // if we're missing any data from the catalog or not pulling it correctly need to show static data
        if (
          completionTimeNum === "" ||
          completionTimeNum === undefined ||
          creditHours === "" ||
          courseTotal === "" ||
          allProgramIds === undefined
        ) {
          $("#prog-2").show();
          $(".program-glance").hide();
          $(".loader").hide();
          console.log("using static program data");
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
            console.log(creditHoursNum);
            console.log(countArrNum);
            console.log(completionTimeNum + " months");
            creditHoursNum =
              '<p class="course-info">' + creditHoursNum + "</p>";
            countArrNum = '<p class="course-info">' + countArrNum + "</p>";
            completionTimeNum =
              '<p class="course-info">' + completionTimeNum + " months</p>";
            $(creditHoursNum).appendTo(".hours");
            $(countArrNum).appendTo(".courses");
            $(completionTimeNum).appendTo(".time");
            $(specializationTotal)
              .add(creditHours)
              .add(courseTotal)
              .add(deanCompletionTime)
              .add(startDate)
              .add(classSize)
              .appendTo(".program-glance");
            $(".loader").hide();
            // if we're on cert page heirarchies and specializations are listed
          } else if (
            pageTitle.includes("certificate") ||
            (JSON.stringify(window.location).includes("certificate") &&
              specializations.length > 0)
          ) {
            var creditHoursNumCert = data.children[0].children[0].children[0].children[6].children[1].children[5].textContent
              .replace(/\D+/g, "")
              .slice(0, 2);
            creditHours =
              "<div>Total Credit Hours: " +
              '<p class="bold-glance">' +
              creditHoursNumCert +
              " Credit Hours</p></div>";
            console.log("should be posting cert stuff");
            $(specializationTotal)
              .add(creditHours)
              .add(courseTotal)
              .add(deanCompletionTime)
              .add(startDate)
              .add(classSize)
              .appendTo(".program-glance");
            $(".loader").hide();
            // if were on a cert specialization page
          } else if (JSON.stringify(window.location).includes("social-work")) {
            $(".program-glance").hide();
            // if we're on a normal program page
          } else {
            $(specializationTotal)
              .add(creditHours)
              .add(courseTotal)
              .add(deanCompletionTime)
              .add(startDate)
              .add(classSize)
              .appendTo(".program-glance");
            $(".loader").hide();
            console.log(creditHours + " credit hours");
            console.log(completionTimeNum + " completion time");
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
          console.log(creditHoursNum);
          console.log(countArrNum);
          console.log(completionTimeNum);
          // hiding for now if we're on social work
        }
      });
    }
    $(programGlance).insertAfter("#prog-2");
  };
})(jQuery);

//catalog
!(function ($) {
  window.onload = function () {
    // need CORS, 600 hourly limity
    jQuery.ajaxPrefilter(function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url
      }
    })

    // need to hide static and dynamic catalog data at first
    $('#prog-2').hide()
    $('.program-glance').hide()

    var programGlance =
      '<div class="program-glance"><h3>Program at a Glance</h3></div>'

    $(programGlance).insertAfter('.scholarship-container')

    // grabbing all catalogs
    $.get('API', function getCatalogId(data) {
      //grabbing most recent catalog number, first value on second children object is the most recent
      var currentCatalogId = data.children[0].children[1].id.replace(/\D+/g, '')
      getProgram(currentCatalogId)
    })

    // grabbing current program based on page title
    function getProgram(currentCatalogId) {
      var count = 0
      // current page title
      var pageTitle = document.getElementById('page-title').innerText

      pageTitle = JSON.stringify(pageTitle)

      $.get(
        'API' + currentCatalogId + '&query=' + pageTitle + '&options[limit]=1',
        function (data) {
          // grabbing Ids for all programs
          var allProgramId = data.children[0].children[0].children[2].children

          for (var i = 0; i < allProgramId.length; i++) {
            // all programIds
            var allProgramIds = allProgramId[i].children[0].innerHTML
            getProgramContent(allProgramIds, currentCatalogId)
            count++
          }
        },
      )
    }

    // grabbing content for all programs
    function getProgramContent(allProgramIds, currentCatalogId) {
      $.get('API' + allProgramIds + '&catalog=' + currentCatalogId, function (
        data,
      ) {
        var count = 0
        var countArr = []
        var courseTotal
        var specializationTotal
        // access to lists of courses for each program
        var courseLists = data.children[0].children[4].children
        // turning into array
        var courseListsArr = Object.values(courseLists)
        // grabbing lists for each program and counting the number of courses
        for (var i = 0; i < courseListsArr.length; i++) {
          count++
          countArr.push(count)
        }
        // count total minus "field" element which is not a course
        courseTotal =
          '<div>Courses: ' +
          '<p class="bold-glance">' +
          (countArr.length - 1) +
          ' Courses</p></div>'

        // access to all page content
        var pageContent = data.children[0].children[3].children[0].children
        // need to turn into array
        var pageContentArr = Object.values(pageContent)
        var deanCompletionTime
        var creditHours
        // need to loop through each child to find completion times and mimimum credits required
        for (var i = 0; i < pageContentArr.length; i++) {
          //if page content has children
          if (pageContentArr[i]) {
            // if each page section has a title
            if (pageContentArr[i].children[0]) {
              // course sequence title
              var courseSequenceTitle =
                pageContentArr[pageContentArr.length - 1].children[0]
                  .children[0].innerHTML
              //course sequence content for credits is always last child in the array
              var courseSequenceContent =
                pageContentArr[pageContentArr.length - 1].children[0]
                  .children[3].textContent
              // if the title for course sequence is "course sequence" (it should be)- might need to find a better way
              if ((courseSequenceTitle = 'Course Sequence')) {
                // strip away all characters but numbers
                creditHours = courseSequenceContent.replace(/\D+/g, '')
                // some content has more numbers in the text so we just need the first 2 which is the minimum credit amount
                creditHours =
                  '<div>Total Credit Hours: ' +
                  '<p class="bold-glance">' +
                  creditHours.slice(0, 2) +
                  ' Credit Hours</p></div>'
              }
              // making sure page content exists (reduntant?)
              if (pageContentArr[i].children[0].children[3]) {
                if (pageContentArr[i].children[0].children[3].children[3]) {
                  // if sentence in time to completion array does not have any numbers after removing letters or the number returned is less than 10 (months) we want to ignore it - might need to find a better way
                  if (
                    pageContentArr[
                      i
                    ].children[0].children[3].children[3].innerHTML.replace(
                      /\D+/g,
                      '',
                    ) === '' ||
                    pageContentArr[
                      i
                    ].children[0].children[3].children[3].innerHTML.replace(
                      /\D+/g,
                      '',
                    ) < 10
                  ) {
                    console.log(" completion times aren't in here")
                  } else {
                    console.log(
                      pageContentArr[i].children[0].children[3].children[3]
                        .innerHTML,
                    )
                    var completionTimeNum = pageContentArr[
                      i
                      // regex for removing all text and returning number w/ 2 digit max
                    ].children[0].children[3].children[3].innerHTML
                      .replace(/\D+/g, '')
                      .slice(0, 2)
                    deanCompletionTime =
                      '<div>Recommended Completion Time: ' +
                      '<p class="bold-glance">' +
                      completionTimeNum +
                      ' Months</p></div>'
                  }
                }
              }
            }
          }
        }

        var specializations = document.getElementsByClassName(
          'ncu-degrees-specializations-block',
        )

        // need to grab number of specializations
        if (specializations[0]) {
          if (specializations[0].children) {
            if (specializations[0].children[0].children) {
              specializations = Object.values(
                document.getElementsByClassName(
                  'ncu-degrees-specializations-block',
                )[0].children[0].children,
              )
              var specializationCount = 0

              for (var i = 0; i < specializations.length; i++) {
                specializationCount++
              }

              specializationTotal =
                '<div><p class="bold-glance">' +
                specializationCount +
                ' profesionally relevant specializations</p></div>'

              // $(specializationTotal).appendTo('.program-glance')
            }
          }
        }

        $(specializationTotal).appendTo('.program-glance')

        // if we're missing any data from the catalog or not pulling it correctly need to show static data
        if (
          completionTimeNum === '' ||
          creditHours === '' ||
          courseTotal === ''
        ) {
          $('#prog-2').show()
          $('.program-glance').hide()
          return
        } else {
          $('.program-glance').show()
        }

        var startDate =
          '<div>Next Start Date:<p class="bold-glance"> Every Monday</p></div>'
        var classSize =
          '<div>Classroom Size:<p class="bold-glance"> One</p></div>'
        $(creditHours).appendTo('.program-glance')
        $(courseTotal).appendTo('.program-glance')
        $(deanCompletionTime).appendTo('.program-glance')
        $(startDate).appendTo('.program-glance')
        $(classSize).appendTo('.program-glance')
      })
    }
  }
})(jQuery)

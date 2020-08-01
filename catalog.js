//catalog
!(function ($) {
  window.onload = function () {
    jQuery.ajaxPrefilter(function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url
      }
    })

    var programGlance =
      '<div class="program-glance"><h3>Program at a Glance</h3></div>'
    // need to hide static and dynamic catalog data at first
    $(programGlance).hide()
    $('#prog-2').hide()

    // grabbing all catalogs
    $.get('API', function getCatalogId(data) {
      console.log(data.children[0].children)
      //grabbing most recent catalog number, first value on second children object is the most recent
      var currentCatalogId = data.children[0].children[1].id.replace(/\D+/g, '')
      getProgram(currentCatalogId)
    })
    var pageTitle
    // grabbing current program based on page title
    function getProgram(currentCatalogId) {
      var count = 0
      var fieldBody = document.getElementsByClassName('field-body')

      // checking if we're on specialization page or not
      if (fieldBody) {
        if (fieldBody[0]) {
          if (fieldBody[0].children[0]) {
            if (fieldBody[0].children[0].innerText.includes('Specialization')) {
              // grabbing h2 title which should include specialization text rather than page title
              pageTitle = JSON.stringify(fieldBody[0].children[0].innerText)
              console.log(pageTitle)
              console.log("we're on a specialization page")
            } else {
              pageTitle = JSON.stringify(
                document.getElementById('page-title').innerText,
              )
              console.log(pageTitle)
              console.log("we're not on a specialization page")
            }
          }
        }
      }

      console.log(JSON.stringify(window.location))
      // need to see if we're on certificate pages
      if (JSON.stringify(window.location).includes('certificate')) {
        // can't accurately search for stringified cert titles
        pageTitle = document.getElementById('page-title').innerText

        console.log(programGlance)

        console.log(pageTitle)
      }

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
            console.log(allProgramIds)
          }
          // if there's no program id the API can't correctly query this pagetitle and need to display static - temp fix
          if (allProgramIds === undefined) {
            $('#prog-2').show()
            console.log('showing static data')
            return
          }
        },
      )
    }

    // grabbing content for all programs
    function getProgramContent(allProgramIds, currentCatalogId) {
      $.get('API' + allProgramIds + '&catalog=' + currentCatalogId, function (
        data,
      ) {
        console.log(data.children)

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

        var countArrNum = countArr.length - 1
        // count total minus "field" element which is not a course
        courseTotal =
          '<div>Courses: ' +
          '<p class="bold-glance">' +
          countArrNum +
          ' Courses</p></div>'

        console.log(courseTotal)
        console.log(courseListsArr)

        // access to all page content non-certs
        var pageContent = data.children[0].children[3].children[0].children
        console.log(pageContent)
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
                var creditHoursNum = courseSequenceContent
                  .replace(/\D+/g, '')
                  .slice(0, 2)
                // some content has more numbers in the text so we just need the first 2 which is the minimum credit amount
                creditHours =
                  '<div>Total Credit Hours: ' +
                  '<p class="bold-glance">' +
                  creditHoursNum +
                  ' Credit Hours</p></div>'
              }

              // making sure page content exists (reduntant?)
              if (pageContentArr[i].children[0].children[3]) {
                if (pageContentArr[i].children[0].children[3].children[3]) {
                  // if sentence in time to completion array does not have any numbers after removing characters or the number returned is less than 10 (months) and we aren't on any cert pages (some certs have less than 10) we want to ignore it - might need to find a better way
                  if (
                    pageContentArr[
                      i
                    ].children[0].children[3].children[3].innerHTML.replace(
                      /\D+/g,
                      '',
                    ) === '' ||
                    (pageContentArr[
                      i
                    ].children[0].children[3].children[3].innerHTML.replace(
                      /\D+/g,
                      '',
                    ) < 10 &&
                      JSON.stringify(window.location).includes(
                        'certificate',
                      ) === false)
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
        // checking to see if page lists specializations and grabbing count
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

              console.log(specializationTotal)
              console.log(specializationCount)
            }
          }
        }

        // if we're missing any data from the catalog or not pulling it correctly need to show static data
        if (
          completionTimeNum === '' ||
          completionTimeNum === undefined ||
          creditHours === '' ||
          courseTotal === '' ||
          allProgramIds === undefined
        ) {
          $('#prog-2').show()
          $('.program-glance').hide()
          console.log('using static program data')
          return
        } else {
          $('.program-glance').show()
          console.log('using catalog program data')
        }

        var startDate =
          '<div>Next Start Date:<p class="bold-glance"> Every Monday</p></div>'
        var classSize =
          '<div>Classroom Size:<p class="bold-glance"> One</p></div>'
        // if were on program specialization pages
        if (pageTitle.includes('Specialization')) {
          console.log(creditHoursNum)
          console.log(countArrNum)
          console.log(completionTimeNum + ' months')

          creditHoursNum = '<p class="course-info">' + creditHoursNum + '</p>'

          countArrNum = '<p class="course-info">' + countArrNum + '</p>'

          completionTimeNum =
            '<p class="course-info">' + completionTimeNum + ' months</p>'

          $(creditHoursNum).appendTo('.hours')
          $(countArrNum).appendTo('.courses')
          $(completionTimeNum).appendTo('.time')
          // if we're on cert page heirarchies and specializations are listed
        } else if (
          JSON.stringify(window.location).includes('certificate') &&
          specializations.length > 0
        ) {
          var creditHoursNumCert = data.children[0].children[0].children[0].children[6].children[1].children[5].textContent
            .replace(/\D+/g, '')
            .slice(0, 2)

          creditHours =
            '<div>Total Credit Hours: ' +
            '<p class="bold-glance">' +
            creditHoursNumCert +
            ' Credit Hours</p></div>'

          console.log('should be posting cert stuff')

          $(specializationTotal)
            .add(creditHours)
            .add(courseTotal)
            .add(deanCompletionTime)
            .add(startDate)
            .add(classSize)
            .appendTo('.program-glance')
          // if were on a cert specialization page
        } else if (
          JSON.stringify(window.location).includes('certificate') &&
          specializations.length === 0
        ) {
          creditHoursNumCert = data.children[0].children[0].children[0].children[6].children[1].children[5].textContent
            .replace(/\D+/g, '')
            .slice(0, 2)

          creditHoursNum =
            '<p class="course-info">' + creditHoursNumCert + '</p>'

          countArrNum = '<p class="course-info">' + countArrNum + '</p>'

          completionTimeNum =
            '<p class="course-info">' + completionTimeNum + ' months</p>'

          $(creditHoursNum).appendTo('.hours')
          $(countArrNum).appendTo('.courses')
          $(completionTimeNum).appendTo('.time')

          console.log(creditHoursNum)
          console.log(countArrNum)
          console.log(completionTimeNum)
          // if we're on a normal program page
        } else {
          $(specializationTotal)
            .add(creditHours)
            .add(courseTotal)
            .add(deanCompletionTime)
            .add(startDate)
            .add(classSize)
            .appendTo('.program-glance')
          console.log(creditHours + ' credit hours')
          console.log(completionTimeNum + ' completion time')
        }
      })
    }
    $(programGlance).insertAfter('#prog-2')
  }
})(jQuery)

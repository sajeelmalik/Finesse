// Grab the sales as a json

// $.getJSON("/sales", function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the apropos information on the page
//       $("#sales").append("<p data-id='" + data[i]._id + "'uk-tooltip='Add a Note!''>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
//   });


// Whenever someone clicks Add Note
$(document).on("click", ".add-note", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the element 
    var thisId = $(this).attr("data-id");
    // console.log(thisId);
    // Here, we make ajax call for the Sale
    $.ajax({
        method: "GET",
        url: "/sales/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the Sale
            $("#notes").append("<h2 class='uk-animation-slide-top-medium'>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input class= 'uk-input' id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea class='uk-textarea' id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the Sale saved to it
            $("#notes").append("<button class='uk-button' btn data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the Sale
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the Sale from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/sales/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


$(document).scroll(function () {
    $('#notes').css('top', $(this).scrollTop());
});
// Usable globals
var modalOpened = false;


// On-click listener for Add Note
$(document).on("click", ".add-note", function (event) {
    event.preventDefault();

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
            console.log("Note Data: ", data);
            // The title of the Sale
            $("#notes").show();

            $("#notes").append("<h2 class='uk-animation-slide-top-medium'>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input class= 'uk-input' id='titleinput' name='title' placeholder = 'Subject'>");
            // A textarea to add a new note body
            $("#notes").append("<textarea class='uk-textarea' id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the Sale saved to it
            $("#notes").append("<button class='uk-button note-confirm' btn data-id='" + data._id + "' id='savenote'>Save Note</button>");

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
$(document).on("click", "#savenote", function (event) {
    // event.preventDefault();
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
            // Hide and empty the notes section
            $("#notes").hide(500, function(){
                $("#notes").empty();

            });
            // setTimeout(function () {
            //     $("#notes").empty();
            // }, 500);
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


// Save to your local collection when Save Sale is clicked - WORKING for one user
$(document).on("click", ".save-sale", function (event) {
    event.preventDefault();

    // Grab the id associated with the Sale from the submit button
    var thisId = $(this).attr("data-id");
    // Check if the current value is false; if so, we'll save it as true, and vice versa
    var saved = $(this).attr("data-saved") === "false";

    // Reset the DOM data attribute for saved
    if (saved) {
        $(this).css("color", "#FF7870");
        $(this).css("text-shadow", "0px 0px 4px rgba(153, 69, 69, 0.627)");
    }
    else {
        $(this).css("color", "inherit");
        $(this).css("text-shadow", "0px 0px 4px rgba(0, 0, 0, 0.627)");
    }
    $(this).attr("data-saved", saved)

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "PUT",
        url: "/sales/" + thisId,
        data: {
            // Value taken from title input
            saved: saved,
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);

        });
});

//keep note area on screen
// $(window).scroll(function () {
//     $('#notes').css('margin-top', $(this).scrollTop());
// });


// Animations for Splash page

$(document).on("click", "#login-button", function () {
    $("#splash").addClass("uk-animation-reverse");
});


$(document).on("click", "#about", function (event) {
    if (!modalOpened) {
        console.log("clicked")
        $("#modal-full").css("visibility", "visible");
        modalOpened = true;
    }
});



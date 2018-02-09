Parse.Cloud.beforeSave("Score", function(request, response) {
  // This happens before EVERY save operation for the Score class
  if (request.object.get("score") % 2 == 0) { // In my example we check if the number is Odd
    request.object.set("isEvenNumber", true); // If so, we set the flag to True
  } else {
    request.object.set("isEvenNumber", false); // If not, to False
  }
  response.success(); // VERY VERY important. If you dont respond an Success or Error, your function will break
});

Parse.Cloud.define("getUser", function(request, response) {
  //This can be called by an API call from anywhere
  var query = new Parse.Query("User"); // We will query the class User
  query.equalTo("objectId", request.params.user) // and will search for a User that has the objectId equals to the parameter "user" the API call received
    .find() // Try to find it
    .then((results) => { // If found
      console.log("Results: " + results.length);
      response.success(results[0].get("username")); // respond the username
    })
    .catch(() =>  {
      response.error("Score lookup failed"); // If not, respond an error message
    });
});

Parse.Cloud.job("resetScores", function(request, status) {
  const query = new Parse.Query("Score"); // We will query the class Score

  query.find({ // find() without any parameters will retrieve all objects
    success: function (results) {
      console.log("Successfully retrivied " + results.length + " scores."); //console.log messages will be logged

      // Destroying the objects
      query.each(function (object, err) {
        object.destroy({
          success: function (object) {
            console.log("Successfully destroyed object.");
          },
          error: function (error) {
            console.log("Error: " + error.code + " - " + error.message);
          },
          useMasterKey: true  // VERY IMPORTANT!! So users won't be able to call the job.
        })
      })
    },
    error: function (error) {
      console.log("Error: " + error.code + " - " + error.message);
    }
  });
});

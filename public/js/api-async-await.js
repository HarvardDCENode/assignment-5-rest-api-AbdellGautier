// this is the async/await version of the original api.js, which uses Promise syntax

// wrap in IIFE to control scope
(function () {

    const baseURL = ''; //  for development, it's http://localhost:3030

    async function testAPIs() {
        // test list first
        let testId = '';
        let testJSON = {};
        try {
            // list
            let list = await callAPI('GET', '/api/events', null, null)
            console.log('\n\n**************\nlist results:');
            console.log(list);

            // If you don't have a file upload component to your application, a simple JSON object will do
            let data = {
                "title": "My API Test Title",
                "description": "This is an AJAX API test"
            }

            // create
            let newevent = await callAPI('POST', '/api/events', null, data)
            eventId = newevent._id;
            console.log('\n\n***************\ncreate results:');
            console.log(newevent);

            // find
            let retreivedNewevent = await callAPI('GET', '/api/events/' + newevent._id, null, null)
            console.log('\n\n**************\nfind results:');
            console.log(retreivedNewevent);

            // update description
            retreivedNewevent.description += ' appended by the AJAX API ';
            let updatedevent = await callAPI('PUT', '/api/events/' + retreivedNewevent._id, null, retreivedNewevent)
            console.log('\n\n*************\nupdate results:');
            console.log(updatedevent);

            // now find again to confirm that the description update was changed
            let retreivedUpdatedevent = await callAPI('GET', '/api/events/' + updatedevent._id, null, null)
            console.log('\n\n*************\nfind results (should contain updated description field):');
            console.log(retreivedUpdatedevent);

            //delete
            let deletedevent = await callAPI('DELETE', '/api/events/' + retreivedUpdatedevent._id, null, null)
            console.log(deletedevent);


        } catch (err) {
            console.error(err);
        };
    }//end testAPIs

    async function callAPI(method, uri, params, body) {
        jsonMimeType = {
            'Content-type': 'application/json'
        }
        try {
            /*  Set up our fetch.
             *   'body' to be included only when method is POST
             *   If 'PUT', we need to be sure the mimetype is set to json
             *      (so bodyparser.json() will deal with it) and the body
             *      will need to be stringified.
             *   '...' syntax is the ES6 spread operator.
             *      It assigns new properties to an object, and in this case
             *      lets us use a conditional to create, or not create, a property
             *      on the object. (an empty 'body' property will cause an error
             *      on a GET request!)
             */
            const response = await fetch(baseURL + uri, {
                method: method, // GET, POST, PUT, DELETE, etc.
                ...(method == 'POST' ? { body: body } : {}),
                ...(method == 'PUT' ? { headers: jsonMimeType, body: JSON.stringify(body) } : {})
            });
            // response.json() parses the textual JSON data to a JSON object. 
            // Returns a Promise that resolves with the value of the JSON object 
            //  which you can pick up as the argument passed to the .then()
            return response.json();
        } catch (err) {
            console.error(err);
            return "{'status':'error'}";
        }
    }


    // Calls our test function when we click the button
    //  afer validating that there's a file selected.
    document.querySelector('#testme').addEventListener("click", () => {
        testAPIs();
    });
})();
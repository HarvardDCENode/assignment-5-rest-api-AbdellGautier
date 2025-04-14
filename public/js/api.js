// wrap in IIFE to control scope
(function () {

    function testAPIs() {
        // test list first
        let testId = '';
        let testJSON = {};

        // list
        callAPI('GET', '/api/events', null, null)
            .then((list) => {
                console.log('\n\n***************************\nlist results:');
                console.log(list);
                testId = list[0]._id;
            })
            .then(() => {
                // create form data object with event and metadata
                // This section is for uploading a file to the REST API

                // JSON object to submit to the RESTApi calls
                let data = {
                    "title": "RestAPI Test Event",
                    "description": "This is an AJAX API test for an event record.",
                    "date": "2025-12-30T12:00:00.000Z"
                }

                // create the POST call to the API
                callAPI('POST', '/api/events', null, data)
                    .then((event) => {
                        console.log('\n\n***************************\ncreate results:');
                        console.log(event);
                        return event;
                    })
                    .then((event) => {
                        // find
                        return callAPI('GET', '/api/events/' + event._id, null, null)
                            .then((event) => {
                                // output the result of the Promise returned by response.json()
                                console.log('\n\n***************************\nfind results:');
                                console.log(event);
                                return event;
                            })
                            .then((event) => {
                                // update description
                                event.description += ' appended by the AJAX API ';
                                return callAPI('PUT', '/api/events/' + event._id, null, event)
                                    .then((event) => {
                                        // output the result of the Promise returned by response.json()
                                        console.log('\n\n***************************\nupdate results:');
                                        console.log(event);
                                        return event;
                                    })
                                    .then((event) => {
                                        // now find again to confirm that the dedscription update was changed
                                        return callAPI('GET', '/api/events/' + event._id, null, null)
                                    })
                                    .then((event) => {
                                        // output the result of the Promise returned by response.json()
                                        console.log('\n\n***************************\nfind results (should contain updated description field):');
                                        console.log(event);
                                        return event;
                                    })
                                    .then((event) => {
                                        //delete
                                        callAPI('DELETE', '/api/events/' + event._id, null, null)
                                            .then((result) => {
                                                console.log('\n\n***************************\ndelete result:');
                                                console.log(result);
                                            })
                                    });
                            })
                    })
            })
            .catch((err) => {
                console.error(err);
            });



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
                const response = await fetch(uri, {
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
    }

    // Calls our test function when we click the button
    document.querySelector('#testme').addEventListener("click", () => {
        testAPIs();
    });
})();
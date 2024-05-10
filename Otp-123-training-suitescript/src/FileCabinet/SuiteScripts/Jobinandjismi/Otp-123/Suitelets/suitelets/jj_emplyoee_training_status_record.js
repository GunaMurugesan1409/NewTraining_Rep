/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/email', 'N/runtime'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget, email, runtime) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} context
         * @param {ServerRequest} context.request - Incoming request
         * @param {ServerResponse} context.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(context) {
            if (context.request.method === 'GET') {
                // Create a new form
                var form = serverWidget.createForm({
                    title: 'Employee Training Registration'
                });

                // Add fields to the form
                var nameField = form.addField({
                    id: 'name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Employee Name'
                });

                var emailField = form.addField({
                    id: 'email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });

                var courseField = form.addField({
                    id: 'course',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Training Course'
                });

                var trainerField = form.addField({
                    id: 'trainer',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Trainer'
                });

                var statusField = form.addField({
                    id: 'status',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Training Status'
                });
                statusField.addSelectOption({
                    value: '2',
                    text: 'Completed'
                });
                statusField.addSelectOption({
                    value: '1',
                    text: 'In Progress'
                });
                statusField.addSelectOption({
                    value: '3',
                    text: 'Not Started'
                });

                // Add a submit button
                form.addSubmitButton({
                    label: 'Submit'
                });
                form.clientScriptModulePath = 'SuiteScripts/Otp-123/Client_scripts/jj_email_send.js';
                // Display the form
                context.response.writePage(form);
            } else if (context.request.method === 'POST') {
                // Retrieve form data from the request
                var name = context.request.parameters.name;
                var email = context.request.parameters.email;
                var course = context.request.parameters.course;
                var trainer = context.request.parameters.trainer;
                var status = context.request.parameters.status;

                // Display the form data
                var html = '<p>Employee Name: ' + name + '</p>';
                html += '<p>Email: ' + email + '</p>';
                html += '<p>Training Course: ' + course + '</p>';
                html += '<p>Trainer: ' + trainer + '</p>';
                html += '<p>Training Status: ' + status + '</p>';
                context.response.write(html);

                // Create a new training record
                var trainingRecord = record.create({
                    type: 'customrecord_jj_employee_training_record'
                });
                trainingRecord.setValue({
                    fieldId: 'custrecord_employee_name',
                    value: name
                });
                trainingRecord.setValue({
                    fieldId: 'custrecord_email',
                    value: email
                });
                trainingRecord.setValue({
                    fieldId: 'custrecord_training_course',
                    value: course
                });
                trainingRecord.setValue({
                    fieldId: 'custrecord_trainer',
                    value: trainer
                });
                trainingRecord.setValue({
                    fieldId: 'custrecord_training_status',
                    value: status
                });

                // Save the training record
                var trainingRecordId = trainingRecord.save();
                if (trainingRecordId) {
                    email.send({
                        author: runtime.getCurrentUser().id,
                        recipients: trainer,
                        subject: 'Employee Training Registration Details',
                        body: 'Employee is registered for training. Training details have been saved with record ID: ' + trainingRecordId
                    });
                    return trainingRecordId;
                }
            

                // Display success message or redirect to another page
                context.response.write('Training record created successfully. ID: ' + trainingRecordId);
                // Search for training records with "In Progress" status
                var searchObj = search.create({
                    type: 'customrecord_jj_employee_training_record',
                    filters: [['custrecord_training_status', 'is', '1']], 
                    columns: ['internalid']
                });

                var searchResults = searchObj.run().getRange({ start: 0, end: 100 });

                // Display the internal IDs of the search results
                var inProgressRecords = '<h2>Training Records In Progress</h2>';
                for (var i = 0; i < searchResults.length; i++) {
                    var result = searchResults[i];
                    inProgressRecords += '<p>In Progress : ' + result.getValue('internalid') + '</p>';
                }
                context.response.write(inProgressRecords);
            }
        }

        return {
            onRequest: onRequest
        };
    });


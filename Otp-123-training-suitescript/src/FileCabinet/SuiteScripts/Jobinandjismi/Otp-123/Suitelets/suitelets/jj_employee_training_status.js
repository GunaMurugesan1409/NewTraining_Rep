/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/email','N/record', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (record, serverWidget, email) => {
        function onRequest(context) {
            if (context.request.method === 'GET') {
                // Create a new form
                var form = serverWidget.createForm({
                    title: 'Employee Training Registration'
                });

                // Add fields to the form
                form.addField({
                    id: 'name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Employee Name'
                });

                form.addField({
                    id: 'email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });

                form.addField({
                    id: 'course',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Training Course'
                });

                form.addField({
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

                // Display the form
                var html = '<p>Employee Name: ' + name + '</p>';
                html += '<p>Email: ' + email + '</p>';
                html += '<p>Training Course: ' + course + '</p>';
                html += '<p>Trainer: ' + trainer + '</p>';
                html += '<p>Training Status: ' + status + '</p>';

                context.response.write(html);
            } else if (context.request.method === 'POST') {
                // Retrieve form data from the request
                var name = context.request.parameters.name;
                var email = context.request.parameters.email;
                var course = context.request.parameters.course;
                var trainer = context.request.parameters.trainer;
                var status = context.request.parameters.status;

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


                // Send notification to the trainer
                if (status === '1' && trainer) { // If status is "In Progress" and trainer is specified
                    email.send({
                        author: -5, // ID of the sender (typically internal ID of NetSuite user)
                        recipients: trainer,
                        subject: 'New Training Record',
                        body: 'A new training record has been assigned to you. Please review.'
                    });
                }

                // Display success message
                context.response.write('Training record created successfully. ID: ' + trainingRecordId);
            }
        }

        return {
            onRequest: onRequest
        };
    });

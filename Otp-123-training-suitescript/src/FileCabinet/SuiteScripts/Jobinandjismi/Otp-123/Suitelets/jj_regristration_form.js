/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (record, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(context) {
            if (context.request.method === 'GET') {
                // Create a new form
                var form = serverWidget.createForm({
                    title: 'Registration Form'
                });

                // Add fields to the form
                form.addField({
                    id: 'custpage_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                });

                form.addField({
                    id: 'custpage_age',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Age'
                });

                form.addField({
                    id: 'custpage_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                });

                form.addField({
                    id: 'custpage_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });

                form.addField({
                    id: 'custpage_father_name',
                    type: serverWidget.FieldType.TEXT,
                    label: "Father's Name"
                });

                form.addField({
                    id: 'custpage_address',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Address'
                });

                // Add a submit button
                // form.addSubmitButton({
                //     label: 'Submit'
                // });

                // Display the form
                context.response.writePage(form);
            } else if (context.request.method === 'POST') {
                // Retrieve form data from the request
                var name = context.request.parameters.name;
                var age = context.request.parameters.age;
                var phone = context.request.parameters.phone;
                var email = context.request.parameters.email;
                var fatherName = context.request.parameters.father_name;
                var address = context.request.parameters.address;

                // Display the details entered by the user
                var html = '<p>Name: ' + name + '</p>';
                html += '<p>Age: ' + age + '</p>';
                html += '<p>Phone Number: ' + phone + '</p>';
                html += '<p>Email: ' + email + '</p>';
                html += "<p>Father's Name: " + fatherName + '</p>';
                html += '<p>Address: ' + address + '</p>';

                context.response.write(html);

                // Create a custom record with the form data
                var customRecord = record.create({
                    type: 'customrecord_jj_registration_form'
                });
                customRecord.setValue({
                    fieldId: 'custrecordname',
                    value: name
                });
                customRecord.setValue({
                    fieldId: 'custrecordage',
                    value: age
                });
                customRecord.setValue({
                    fieldId: 'custrecordphone',
                    value: phone
                });
                customRecord.setValue({
                    fieldId: 'custrecordemail',
                    value: email
                });
                customRecord.setValue({
                    fieldId: 'custrecordfather_name',
                    value: fatherName
                });
                customRecord.setValue({
                    fieldId: 'custrecordaddress',
                    value: address
                });
                var customRecordId = customRecord.save();
                context.response.write('<p>Custom Record ID: ' + customRecordId + '</p>');
            }
        }

        return {
            onRequest: onRequest
        };



    });

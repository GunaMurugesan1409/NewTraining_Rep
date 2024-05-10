/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget', 'N/log'],
    (record, serverWidget, log) => {

        function onRequest(context) {
            if (context.request.method === 'GET') {
                // Create a new form
                var form = serverWidget.createForm({
                    title: 'Student Record'
                });

                // Add fields to the form
                var nameField = form.addField({
                    id: 'custpage_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                });
                nameField.isMandatory = true;

                var ageField = form.addField({
                    id: 'custpage_age',
                    type: serverWidget.FieldType.INTEGER,
                    label: 'Age'
                });
                ageField.isMandatory = true;

                var sexField = form.addField({
                    id: 'custpage_sex',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Sex'
                });
                sexField.addSelectOption({
                    value: 'M',
                    text: 'Male'
                });
                sexField.addSelectOption({
                    value: 'F',
                    text: 'Female'
                });
                sexField.addSelectOption({
                    value: 'O',
                    text: 'Others'
                });
                sexField.isMandatory = true;

                var addressField = form.addField({
                    id: 'custpage_address',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Address'
                });
                addressField.isMandatory = true;

                // Add a submit button
                form.addSubmitButton({
                    label: 'Submit'
                });

                // Display the form
                context.response.writePage(form);
            } else if (context.request.method === 'POST') {
                // Retrieve form data from the request
                var Detailcontext = JSON.parse(context.request.body);
                // Retrieve form data from the request
                var name = Detailcontext.custpage_name;
                log.debug("context", context)
                var age = Detailcontext.custpage_age;
                var sex = Detailcontext.custpage_sex;
                var address = Detailcontext.custpage_address;
                // Create a custom record with the form data
                var customRecord = record.create({
                    type: 'customrecord_jj_student_record'
                });
                customRecord.setValue({
                    fieldId: 'custrecord7',
                    value: name
                });
                customRecord.setValue({
                    fieldId: 'custrecord8',
                    value: age
                });
                customRecord.setValue({
                    fieldId: 'custrecordsex',
                    value: sex
                });
                customRecord.setValue({
                    fieldId: 'custrecord10',
                    value: address
                });

                var customRecordId = customRecord.save();
                log.debug('Custom Record ID:', customRecordId);
                var message = `student details ${customRecordId}`
                context.response.write(`student details ID ${customRecordId}`)
                return customRecordId;
            }
        }

        return {
            onRequest: onRequest
        };
    });

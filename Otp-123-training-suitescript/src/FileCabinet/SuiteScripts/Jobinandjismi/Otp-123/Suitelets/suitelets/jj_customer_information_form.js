/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(context) {
            if (context.request.method === 'GET') {
                // Create form
                var form = serverWidget.createForm({
                    title: 'Customer Information Form'
                });

                // Add fields to the form
                form.addField({
                    id: 'custpage_jj_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                });
                form.addField({
                    id: 'custpage_jj_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                form.addField({
                    id: 'custpage_jj_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone'
                });
                var salesRepField = form.addField({
                    id: 'salesrep',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Sales Rep'
                });
                salesRepField.isMandatory = true;

                var employeeSearch = search.create({
                    type: search.Type.EMPLOYEE,
                    filters: [
                        ['isinactive', 'is', 'F'],
                        'AND',
                        ['role.internalid', 'anyof', 'salesrep'] 
                    ],
                    columns: ['internalid', 'entityid'] 
                });

                var employeeSearchResults = employeeSearch.run().getRange({
                    start: 0,
                    end: 1000
                });

                // Add options to the sales rep select field
                for (var i = 0; i < employeeSearchResults.length; i++) {
                    var employeeId = employeeSearchResults[i].getValue('internalid');
                    var employeeName = employeeSearchResults[i].getValue('entityid');
                    salesRepField.addSelectOption({
                        value: employeeId,
                        text: employeeName
                    });
                }

                form.addField({
                    id: 'subsidiary',
                    type: serverWidget.FieldType.SELECT,
                    source: 'subsidiary',
                    label: 'Subsidiary'
                });

                // Add submit button
                form.addSubmitButton({
                    label: 'Submit'
                });

                // Display form
                context.response.writePage(form);

            } else {
                // Retrieve submitted form data
                var custName = context.request.parameters.custpage_jj_name;
                var custEmail = context.request.parameters.custpage_jj_email;
                var custPhone = context.request.parameters.custpage_jj_phone;
                var salesRep = context.request.parameters.salesrep;
                var subsidiary = context.request.parameters.subsidiary;

                // Display submitted data
                var message = 'Customer Information:\n';
                message += 'Name: ' + custName + '\n';
                message += 'Email: ' + custEmail + '\n';
                message += 'Phone: ' + custPhone + '\n';
                message += 'Sales Rep: ' + salesRep + '\n';
                message += 'Subsidiary: ' + subsidiary + '\n';

                context.response.write(message);

                // Create customer record
                var customerRecord = record.create({
                    type: record.Type.CUSTOMER,
                    isDynamic: true
                });
                customerRecord.setValue({
                    fieldId: 'companyname',
                    value: custName
                });
                customerRecord.setValue({
                    fieldId: 'email',
                    value: custEmail
                });
                customerRecord.setValue({
                    fieldId: 'phone',
                    value: custPhone
                });
                customerRecord.setValue({
                    fieldId: 'salesrep',
                    value: salesRep
                });
                customerRecord.setValue({
                    fieldId: 'subsidiary',
                    value: subsidiary
                });
                var customerId = customerRecord.save();

                // Display customer ID
                context.response.write('Customer Record Created. Customer ID: ' + customerId);
            }
        }

        return { onRequest }

    });


    
    /**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget', 'N/search'],
    /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (record, serverWidget, search) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                var form = serverWidget.createForm({
                    title: 'User Information Form'
                });
                var fname = form.addField({
                    id: 'custpage_jj_fname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                });
                var lname = form.addField({
                    id: 'custpage_jj_lname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                });
                var phone = form.addField({
                    id: 'custpage_jj_phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone'
                });
                var email = form.addField({
                    id: 'custpage_jj_email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                var dob = form.addField({
                    id: 'custpage_jj_dob',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Date of Birth'
                });
                var accountmgr = form.addField({
                    id: 'custpage_jj_manager',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Account Manager'
                });
                form.addSubmitButton({
                    label: 'Submit'
                });
                scriptContext.response.writePage(form);
            }
            else if (scriptContext.request.method === 'POST') {
                var fname = scriptContext.request.parameters.custpage_jj_fname;
                var lname = scriptContext.request.parameters.custpage_jj_lname;
                var email = scriptContext.request.parameters.custpage_jj_email;
                var phone = scriptContext.request.parameters.custpage_jj_phone;
                var dob = scriptContext.request.parameters.custpage_jj_dob;
                var accountmgr = '';
                var customerSearch = search.create({
                    type: search.Type.CUSTOMER,
                    filters: [['email', 'is', email]],
                    columns: ['salesrep']
                });
 
                var searchResults = customerSearch.run().getRange({ start: 0, end: 1 });
                if (searchResults && searchResults.length > 0) {
 
                    var salesRepId = searchResults[0].getValue({ name: 'salesrep' });
                    if (salesRepId) {
 
                        var salesRepRecord = record.load({
                            type: record.Type.EMPLOYEE,
                            id: salesRepId
                        });
                        if (salesRepRecord) {
 
                            accountmgr = salesRepRecord.getValue({
                                fieldId: 'entityid'
                            });
                        }
                    }
                }
               
                var customRecId = createCustomRecord(fname, lname, email, phone, dob, accountmgr);
                scriptContext.response.write("Record ID: " + customRecId);
            }
        };
 
        function createCustomRecord(fname, lname, email, phone, dob, accountmgr) {
            log.debug('name', fname);
            var customRecord = record.create({ type: 'customrecord_jj_user_input_record', isDynamic: true });
            customRecord.setValue({
                fieldId: 'custrecord_firstname',
                value: fname
            });
            customRecord.setValue({
                fieldId: 'custrecord_lastname',
                value: lname
            });
            customRecord.setValue({
                fieldId: 'custrecord13',
                value: email
            });
            customRecord.setValue({
                fieldId: 'custrecord12',
                value: phone
            });
 
            customRecord.setValue({
                fieldId: 'custrecord_dob',
                value: dob
            });
            customRecord.setValue({
                fieldId: 'custrecord_accountmanager',
                value: accountmgr
            });
            var recordId = customRecord.save({ ignoreMandatoryFields: false, enableSourcing: true });
            log.debug("record id", recordId);
            return recordId;
 
        }
 
        return { onRequest };
 
    });
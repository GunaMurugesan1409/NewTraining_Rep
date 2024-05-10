/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/ui/dialog', 'N/currentRecord'],
    function (dialog, currentRecord) {

        function sendEmailOnSubmit() {
            var currentRecordObj = currentRecord.get();
            var status = currentRecordObj.getValue({ fieldId: 'status' });

            if (status === '1') { // If status is "In Progress"
                var recordId = currentRecordObj.id;

                // Navigate to Suitelet URL to trigger email sending
                var suiteletURL = 'https://td2908587.app.netsuite.com/app/common/scripting/scriptrecord.nl?id=39' + recordId;
                // window.open(suiteletURL, '_blank');

                // Log email message
                var emailMessage = 'Email sending has been triggered.';
                console.log(emailMessage);

                // Show confirmation message
                dialog.alert({
                    title: 'Email Triggered',
                    message: emailMessage
                });
            } else {
                dialog.alert({
                    title: 'Email Not Sent',
                    message: 'Email will not be sent as the status is not "In Progress".'
                });
            }
        }

        return {
            saveRecord: function () {
                sendEmailOnSubmit();
                return true; // Allow the record to be saved
            }
        };
    });

/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'],

    function (record, log) {

        function beforeSubmit(context) {
            if (context.type !== context.UserEventType.EDIT && context.type !== context.UserEventType.CREATE) {
                return;
            }

            var newRecord = context.newRecord;
            var oldRecord = context.oldRecord;

            // Get the current value of the address fields
            var newAddress = newRecord.getValue({ fieldId: 'defaultaddress' });
            log.debug('newAddress', newAddress);

            if (oldRecord) {
                // If old record exists, compare old and new addresses
                var oldAddress = oldRecord.getValue({ fieldId: 'defaultaddress' });
                log.debug('oldAddress', oldAddress);

                // Check if the address has changed
                if (oldAddress !== newAddress) {
                    // If old and new addresses are different, it's an existing address change
                    newRecord.setValue({ fieldId: 'custentity_jj_addresschange_otp_7205', value: true });
                    log.debug('Checkbox updated for existing address change.');
                }
            } else {
                // If old record doesn't exist, this is a new record creation
                if (newAddress) {
                    // If new address exists, set the checkbox field to true
                    newRecord.setValue({ fieldId: 'custentity_jj_addresschange_otp_7205', value: true });
                    log.debug('Checkbox updated for new address.');
                }
            }
        }

        return {
            beforeSubmit: beforeSubmit
        };
    });

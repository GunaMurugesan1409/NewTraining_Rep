/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/record', 'N/ui/dialog'], function (record, dialog) {
    function validateLine(context) {
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        if (sublistName === 'item') {
            var amountField = currentRecord.getCurrentSublistValue({
                sublistId: sublistName,
                fieldId: 'amount'
            });

            if (amountField > 200) {
                return true;
            } else {
                dialog.alert({
                    title: 'Alert',
                    message: 'Amount should be greater than 200.'
                });
                return false;
            }
        }
        return true;
    }

    return {
        validateLine: validateLine
    };

});

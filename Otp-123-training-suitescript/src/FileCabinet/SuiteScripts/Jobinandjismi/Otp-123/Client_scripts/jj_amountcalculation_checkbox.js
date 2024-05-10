/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record', 'N/search'],
/**
 * @param{currentRecord} currentRecord
 * @param{record} record
 * @param{search} search
 */
function(currentRecord, record, search) {
    
    function fieldChanged(context) {
        var currentRecord = context.currentRecord;

        // Check if the field changed is the "Amount Calculation" checkbox
        if (context.fieldId === 'custcol_amount_calculation') {
            var isChecked = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_amount_calculation'
            });

            var rate = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate'
            });

            var quantity = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity'
            });

            var amountField = currentRecord.getCurrentSublistField({
                sublistId: 'item',
                fieldId: 'amount'
            });

            // Calculate the amount based on the checkbox value
            var amount;
            if (isChecked) {
                amount = (rate * quantity) / 2;
            } else {
                amount = rate * quantity;
            }

            currentRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'amount',
                value: amount
            });
        }
    }

    return {
        fieldChanged: fieldChanged
    };

    
});

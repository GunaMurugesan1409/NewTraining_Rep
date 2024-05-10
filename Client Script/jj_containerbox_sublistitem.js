/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/log'], function(currentRecord, log) {
    
    function calculateContainerBoxAndAmount() {
        var lineCount = currentRecord.getCurrentSublistCount({
            sublistId: 'item'
        });

        for (var i = 0; i < lineCount; i++) {
            var rate = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate'
            });

            var length = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custitem_jj_length_item' // Assuming custom field for length
            });

            var breadth = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custitem_jj_breadth_item' // Assuming custom field for breadth
            });

            var height = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custitem_jj_height_item' // Assuming custom field for height
            });

            var containerBox = length * breadth * height;

            var amount = rate * containerBox;

            currentRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_jj_container_box',
                value: containerBox
            });
            currentRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'amount',
                value: amount
            });
        }
    }

    return {
        pageInit: function(context) {
            // Trigger the calculation function on page load
            calculateContainerBoxAndAmount();
        }
    };
});

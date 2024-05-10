/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/record', 'N/runtime', 'N/search', 'N/ui/dialog'],
    /**
     * @param{currentRecord} currentRecord
     * @param{record} record
     * @param{runtime} runtime
     * @param{search} search
     */
    function (currentRecord, record, runtime, search, dialog) {
        function fieldChanged(scriptContext) {
            var currentRec = scriptContext.currentRecord;
            var recordType = currentRec.type;
            var sublistId = 'item';
            const selectedItem = currentRec.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: 'item'
            });
            if (recordType === "salesorder" && selectedItem) {
                var itemRecord = record.load({
                    type: record.Type.INVENTORY_ITEM,
                    id: selectedItem,
                    isDynamic: true,
                });
                var length = itemRecord.getText({
                    fieldId: 'custitem_jj_length_item'
                });
                var breadth = itemRecord.getText({
                    fieldId: 'custitem_jj_breadth_item'
                });
                var height = itemRecord.getText({
                    fieldId: 'custitem_jj_height_item'
                });
                var containerBox = ''; // Initialize container box as empty string
                if (length && breadth && height) {
                    containerBox = length * breadth * height;
                }
                currentRec.setCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: 'custcol_jj_container_box',
                    value: containerBox,
                    ignoreFieldChange: true
                });

                const container = currentRec.getCurrentSublistText({
                    sublistId: sublistId,
                    fieldId: 'custcol_jj_container_box'
                });

                const rate = currentRec.getCurrentSublistText({
                    sublistId: sublistId,
                    fieldId: 'rate'
                });
                var newAmount = ''; // Initialize newAmount as empty string
                if (container && rate) {
                    newAmount = container * rate;
                } else {
                    newAmount = currentRec.getCurrentSublistValue({
                        sublistId: sublistId,
                        fieldId: 'amount'
                    });
                }
                currentRec.setCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: 'amount',
                    value: newAmount,
                    ignoreFieldChange: true
                });
            }
        }



        function validateLine(scriptContext) {
            var currentRec = scriptContext.currentRecord;
            var recordType = currentRec.type;
            if (recordType === "salesorder") {
                var sublistId = 'item';
                var containerValue = currentRec.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: 'custcol_jj_container_box'
                });

                var amountValue = currentRec.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: 'amount'
                });

                var rateValue = currentRec.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: 'rate'
                });

                if (containerValue && amountValue && rateValue) {
                    var calculatedAmount = containerValue * rateValue;

                    if (amountValue === calculatedAmount) {
                        return true;
                    } else {
                        dialog.alert({
                            title: 'Invalid Amount',
                            message: 'Amount is not Equal to Rate times Container value'
                        });
                        return false;
                    }
                }
            }
            return true;
        }

        return {
            fieldChanged: fieldChanged,
            validateLine: validateLine,

        };

    });

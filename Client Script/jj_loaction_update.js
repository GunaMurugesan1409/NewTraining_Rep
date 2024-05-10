/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/ui/dialog'],
    function (record, dialog) {

        function fieldChanged(scriptContext) {
            var currentRec = scriptContext.currentRecord;
            var recordType = currentRec.type;
            if (recordType === "salesorder") {
                const stCurrField = scriptContext.fieldId;
                if (stCurrField === "location") {
                    var locationValue = currentRec.getValue({
                        fieldId: 'location'
                    });
                    var sublistId = 'item';
                    var itemCount = currentRec.getLineCount({
                        sublistId: sublistId
                    });
                    // Set location value for all lines in the sublist
                    for (var i = 0; i < itemCount; i++) {
                        currentRec.selectLine({
                            sublistId: sublistId,
                            line: i
                        });
                        currentRec.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'custcol_jj_location_update',
                            value: locationValue,
                            ignoreFieldChange: true
                        });
                        currentRec.commitLine({
                            sublistId: sublistId
                        });
                    }
                }
            }
        }

        function saveRecord(scriptContext) {
            var currentRec = scriptContext.currentRecord;
            var recordType = currentRec.type;
            if (recordType === "salesorder") {
                var locationValue = currentRec.getValue({
                    fieldId: 'location'
                });
                var sublistId = 'item';
                var itemCount = currentRec.getLineCount({
                    sublistId: sublistId
                });

                for (var i = 0; i < itemCount; i++) {

                    var lineLocationValue = currentRec.getSublistValue({
                        sublistId: sublistId,
                        fieldId: 'custcol_jj_location_update',
                        line: i
                    });
                    if (locationValue !== lineLocationValue) {
                        dialog.alert({
                            title: 'Invalid Location',
                            message: 'Location value in body field does not match line-level location on line '
                        });
                        return false;
                    }
                }
            }
            return true;

        }

        return {
            fieldChanged: fieldChanged,
            saveRecord: saveRecord
        };

    });

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
        var currentRecordObj = context.currentRecord;
        var customCheckboxField = currentRecordObj.getValue({ fieldId: 'custbody_custom_checkbox' });

        if (context.fieldId === 'custbody_custom_checkbox') {
            if (customCheckboxField) {
                // Set custom textbox value to "passed"
                currentRecordObj.setValue({ fieldId: 'custbody_custom_textbox', value: 'passed' });
            } else {
                // Set custom textbox value to "failed"
                currentRecordObj.setValue({ fieldId: 'custbody_custom_textbox', value: 'failed' });
            }
        }
    }

    return {
        fieldChanged: fieldChanged
    };
    });



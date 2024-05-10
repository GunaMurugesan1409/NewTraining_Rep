/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */

define(['N/record', 'N/log'], function (record, log) {

    function onAction(context) {
        var newRecord = context.newRecord;

        // Log the ID of the record being processed
        log.debug({
            title: 'Record ID',
            details: newRecord.id
        });

        // Log the type of the record being processed
        log.debug({
            title: 'Record Type',
            details: newRecord.type
        });

        // Get the value of the 'Number' field
        var numberValue = newRecord.getValue({
            fieldId: 'custbody_number'
        });

        // Log the value of the 'Number' field
        log.debug({
            title: 'Number Field Value',
            details: numberValue
        });

        // Set the value of the 'Result' field based on the 'Number' field value
        var resultValue = (numberValue >= 100) ? 'Result: Passed' : 'Result: Failed';

        // Log the calculated result value
        log.debug({
            title: 'Result Field Value',
            details: resultValue
        });

        // Set the value of the 'Result' field
        newRecord.setValue({
            fieldId: 'custbody_result',
            value: resultValue
        });

        // Save the changes
        // var newRecordId = newRecord.save();
        // return newRecordId;
    }

    return {
        onAction: onAction
    };
});
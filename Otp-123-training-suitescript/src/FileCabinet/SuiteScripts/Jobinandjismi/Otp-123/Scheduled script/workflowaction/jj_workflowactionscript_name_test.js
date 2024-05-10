/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record'],

    function (record) {

        function onAction(context) {
            var newRecord = record.create({
                type: 'customrecord_jj_workflowactionscript_nam'
            });
            newRecord.setValue({
                fieldId: 'custrecord_name',
                value: 'Task11'
            });
            newRecord.setValue({
                fieldId: 'custrecord11',
                value: 'Test'
            });
            var newRecordId = newRecord.save();

            // Return the newly created record
            return newRecordId;
        }

        return {
            onAction: onAction
        };
    });
  
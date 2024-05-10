/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/record', 'N/ui/dialog', 'N/runtime'], function (record, dialog, runtime) {

    function pageInit(context) {
        // Add page initialization logic here if needed
    }

    function saveRecord(context) {
        var currentRecord = context.currentRecord;
        var totalAmount = currentRecord.getValue({
            fieldId: 'total'
        });
        var salesRepAllowed = false; // Flag to determine if sales rep allows creation
        var employeeId = runtime.getCurrentUser().id;
        var employee = record.load({
            type: record.Type.EMPLOYEE,
            id: employeeId
        });
        var salesRepApproval = employee.getValue({
            fieldId: 'salesrep'
        });

        // Check if the total amount is less than $10,000
        // if (totalAmount < 10000) {
        //     dialog.alert({
        //         title: 'Warning',
        //         message: 'Total amount is less than $10,000. Please review before proceeding.'
        //     });
        //     return false;
        // } else {
        //     // Check if sales rep allows creation
        //     if (salesRepApproval !== true) {
        //         dialog.alert({
        //             title: 'Error',
        //             message: 'Sales representative does not allow creation of sales orders.'
        //         });
        //         return false;
        //     } else {
        //         return true;
        //     }
        // }
        if (totalAmount < 10000) {
            let con = confirm("Total amount is less than $10,000.. Do you want to continue?");
            if (con) {
                return true;
            }
            else {
                return false;
            }
        } else {
            return true;
        }

    }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord
    };
});

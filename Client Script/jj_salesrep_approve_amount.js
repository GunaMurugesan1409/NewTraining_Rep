/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/record', 'N/ui/dialog', 'N/runtime'], function(record, dialog, runtime) {
    
    function pageInit(context) {
        // Add page initialization logic here if needed
    }
    
    function saveRecord(context) {
        var currentRecord = context.currentRecord;
        var totalAmount = currentRecord.getValue({
            fieldId: 'total'
        });

        var salesRepAllowed = false; // Flag to determine if sales rep allows creation

        // Check if sales rep approves creation
        // You can customize this logic based on your business rules
        // For example, you can check the sales rep's role or permissions
        // In this example, we use a custom field 'custentity_sales_rep_approval' on the employee record
        var employeeId = runtime.getCurrentUser().id;
        var employee = record.load({
            type: record.Type.EMPLOYEE,
            id: employeeId
        });
        var salesRepApproval = employee.getValue({
            fieldId: 'custentity_sales_rep_approval'
        });
        if (salesRepApproval === true) {
            salesRepAllowed = true;
        }

        // Check if the total amount is less than $10,000
        if (totalAmount < 10000) {
            // Show a warning
            dialog.alert({
                title: 'Warning',
                message: 'Total amount is less than $10,000.'
            });
            // If sales rep doesn't allow creation, prevent saving the record
            if (!salesRepAllowed) {
                return false;
            }
        }

        // Allow saving the record
        return true;
    }
    
    return {
        pageInit: pageInit,
        saveRecord: saveRecord
    };
    
});

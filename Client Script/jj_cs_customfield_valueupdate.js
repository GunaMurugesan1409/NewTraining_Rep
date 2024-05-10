/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/ui/dialog'],
function(currentRecord, dialog) {

    function pageInit(scriptContext) {
        // Initialize the page
        applyCouponCheckbox();
    }
    function applyCouponCheckbox() {
        var currentRecordObj = currentRecord.get();
        var applyCouponValue = currentRecordObj.getValue({ fieldId: 'custentity20' });
        var couponCodeField = currentRecordObj.getField({ fieldId: 'custentity21' });
        couponCodeField.isDisabled = !applyCouponValue;
        if (!applyCouponValue) {
            currentRecordObj.setValue({ fieldId: 'custentity21', value: '' });
        }
    }
    function fieldChanged(scriptContext) {
        // Check if the field changed is 'Apply Coupon'
        if (scriptContext.fieldId === 'custentity20') {
            applyCouponCheckbox();
        }
    }

    function saveRecord(scriptContext) {
        var currentRecordObj = currentRecord.get();
        var couponCode = currentRecordObj.getValue({ fieldId: 'custentity21' });
        var isChecked = currentRecordObj.getValue({ fieldId: 'custentity20' });
        if (isChecked && couponCode.length !== 5) {
            dialog.alert({
                title: 'Alert',
                message: 'Coupon Code must be 5 characters long.'
            });
            return false;
        }
        return true;
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };

});

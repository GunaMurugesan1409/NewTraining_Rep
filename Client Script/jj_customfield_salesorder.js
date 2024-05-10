/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord'],
function(currentRecord) {

    function pageInit(scriptContext) {
        applyCouponCheckbox();
    }

    function applyCouponCheckbox() {
        var currentRecordObj = currentRecord.get();
        var applyCouponValue = currentRecordObj.getValue({ fieldId: 'custbody_jj_setvalue' });
        var couponCodeValue = applyCouponValue ? 'Passed' : 'Failed';
        currentRecordObj.setValue({ fieldId: 'custbody_jj_status_checkbox', value: couponCodeValue });
    }

    function fieldChanged(scriptContext) {
        if (scriptContext.fieldId === 'custbody_jj_setvalue') {
            applyCouponCheckbox();
        }
    }
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
    };

});

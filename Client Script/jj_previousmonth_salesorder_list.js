/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/format'],

function(record, search, format) {
    
    function fieldChanged(scriptContext) {
        var currentRecord = scriptContext.currentRecord;
        var fieldId = scriptContext.fieldId;

        if (fieldId === 'entity') {
            var customerId = currentRecord.getValue({ fieldId: 'entity' });
            var previousMonthOrders = getPreviousMonthOrders(customerId);
            currentRecord.setValue({ fieldId: 'custbody_jj_previous_monthsales_order', value: previousMonthOrders });
        }
    }

    function getPreviousMonthOrders(customerId) {
        var previousMonthOrders = 0;
        var lastMonthStartDate = new Date();
        lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);
        lastMonthStartDate.setDate(1);
        
        var lastMonthEndDate = new Date();
        lastMonthEndDate.setDate(0); // Set to last day of previous month
        
        var lastMonthStartString = format.format({ value: lastMonthStartDate, type: format.Type.DATE });
        var lastMonthEndString = format.format({ value: lastMonthEndDate, type: format.Type.DATE });
        
        var orderSearch = search.create({
            type: search.Type.SALES_ORDER,
            filters: [
                ['mainline', 'is', 'T'],
                'AND',
                ['entity', 'anyof', customerId],
                'AND',
                ['trandate', 'within', lastMonthStartString, lastMonthEndString]
            ],
            columns: [
                search.createColumn({ name: 'internalid', summary: 'COUNT' })
            ]
        });

        orderSearch.run().each(function(result) {
            previousMonthOrders = result.getValue({ name: 'internalid', summary: 'COUNT' });
            return false; 
        });

        return previousMonthOrders;
    }

    return {
        fieldChanged: fieldChanged
    };
    
});

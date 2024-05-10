/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record'], function (search, record) {

    function execute(context) {
        // Get the date 4 days ago


        // Create the search object
        var salesOrderSearchObj = search.create({
            type: "salesorder",
            filters: [
                ["type", "anyof", "SalesOrd"],
                "AND",
                ["datecreated", "within", "thisweek"],
                "AND",
                ["item", "anyof", "98"],
                "AND",
                ["mainline", "any", ""],
            ],
            columns: [
                search.createColumn({
                    name: "trandate",
                    label: "Date"
                }),
                search.createColumn({
                    name: "tranid",
                    label: "Document Number"
                }),
                search.createColumn({
                    name: "entity",
                    label: "Name"
                }),
                search.createColumn({
                    name: "memo",
                    label: "Memo"
                }),
                search.createColumn({
                    name: "amount",
                    label: "Amount"
                }),
                search.createColumn({
                    name: "internalid",
                    label: "Internal ID"
                })
            ]
        });

        // Run the search
        var closeSalesOrder = salesOrderSearchObj.run().getRange({ start: 0, end: 1000 });
        closeSalesOrder.forEach(function (result) {
            var internalID = result.getValue({
                name: 'internalid'
            });

            // Function to close a sales order
            var salesOrderRecord = record.load({
                type: record.Type.SALES_ORDER,
                id: internalID,
                isDynamic: true
            });

            // Get the line count
            var lineCount = salesOrderRecord.getLineCount({
                sublistId: 'item'
            });
            log.debug("lineCount", lineCount);

            var isKitKatFound = false;

            // Loop through each line item to check for "KITKAT"
            for (var i = 0; i < lineCount; i++) {
                var itemName = salesOrderRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });
                if (itemName === '98') {
                    isKitKatFound = true;
                    break;
                }
            }

            if (isKitKatFound) {
                for (var i = 0; i < lineCount; i++) {
                    salesOrderRecord.selectLine({
                        sublistId: 'item',
                        line: i
                    });
                    salesOrderRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'isclosed',
                        value: true
                    });
                    salesOrderRecord.commitLine({
                        sublistId: 'item'
                    });
                }
            }
            salesOrderRecord.save();
        });
    }

    return {
        execute: execute
    };

});
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],

function(record, search) {
    
    function pageInit(scriptContext) {
        // Add any initialization logic here if needed
    }

    function fieldChanged(scriptContext) {
        const currentRecord = scriptContext.currentRecord;
        const sublistId = scriptContext.sublistId;
        const fieldId = scriptContext.fieldId;

        // Check if the field changed is on the item sublist and it's the item field
        if (sublistId === 'item' && fieldId === 'item') {
            const lineNum = scriptContext.lineNum;
            const itemId = currentRecord.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: fieldId,
                line: lineNum
            });

            // Retrieve the in-transit quantity of the item
            const inTransitQuantity = getInTransitQuantity(itemId);

            // Set the in-transit quantity field on the line
            currentRecord.setCurrentSublistValue({
                sublistId: sublistId,
                fieldId: 'custcol_jj_transit_qauntity	',
                value: inTransitQuantity,
                line: lineNum
            });
        }
    }

    // Function to retrieve the in-transit quantity of the item
    function getInTransitQuantity(itemId) {
        // Perform a search to find the in-transit quantity of the item
        const itemSearch = search.create({
            type: search.Type.ITEM,
            filters: [
                ['internalid', 'anyof', itemId] // Use 'anyof' operator instead of 'is'
            ],
            columns: [
                search.createColumn({name: 'custitem_jj_height_item'}) // Update this with the correct field name
            ]
        });

        const searchResult = itemSearch.run().getRange({start: 0, end: 1});
        if (searchResult && searchResult.length > 0) {
            return searchResult[0].getValue({name: 'custitem_jj_height_item'});
        } else {
            return 0; // If in-transit quantity is not found, return 0
        }
    }

    // Add other functions if needed (pageInit, postSourcing, sublistChanged, etc.)

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
        // Add other functions here as needed
    };
    
});

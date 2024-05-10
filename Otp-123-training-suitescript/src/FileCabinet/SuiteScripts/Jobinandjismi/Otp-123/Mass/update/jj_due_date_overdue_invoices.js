/**
 * @NApiVersion 2.x
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        function each(params) {
            // Load the record
            const invoiceRecord = record.load({
                type: params.type,
                id: params.id
            });
            let newDueDateUpdate = "5/14/2024";
            let [month, day, year] = newDueDateUpdate.split('/').map(Number);
            let newDueDate = new Date(year, month - 1, day);
            invoiceRecord.setValue({
                fieldId: 'duedate',
                value: newDueDate
            });
            // Save the changes
            invoiceRecord.save();
        }
        return { each };
    });
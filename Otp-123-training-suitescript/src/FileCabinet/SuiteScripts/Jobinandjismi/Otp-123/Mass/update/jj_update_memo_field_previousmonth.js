/**
 /**
 * @NApiVersion 2.1
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
            // Set the probability to 61%
            const Salesordermemo = record.load({
                type: params.type,
                id: params.id
            });
            log.debug('Salesordermemo', Salesordermemo)
            Salesordermemo.setValue(
                {
                    fieldId: 'memo',
                    value: 'Memo updated this month '
                });
            Salesordermemo.save();
        }
        return { each }

    });
